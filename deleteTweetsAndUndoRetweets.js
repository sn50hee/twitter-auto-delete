(async function deleteTweetsAndUndoRetweets() {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let deleted = 0;
    let unretweeted = 0;

    while (true) {
        const tweets = document.querySelectorAll('article');
        console.log(`▶️ 현재 화면에 트윗 ${tweets.length}개 탐색 중...`);

        if (tweets.length === 0) {
            window.scrollTo(0, document.body.scrollHeight);
            await delay(1000);
            break;
        }

        for (const tweet of tweets) {
            const moreBtn = tweet.querySelector('button[aria-label="더 보기"]');
            if (!moreBtn) {
                console.log('❌ 메뉴 버튼 없음');
                continue;
            }

            moreBtn.click();
            await delay(400);

            const menuItems = Array.from(document.querySelectorAll('div[role="menuitem"]'));
            const deleteBtn = menuItems.find(el => el.textContent.includes("삭제하기") || el.textContent.includes("Delete"));
            const undoRetweetBtn = tweet.querySelector('button[data-testid="unretweet"]');
            if (deleteBtn) {
                deleteBtn.click();
                await delay(400);

                const confirmBtn = document.querySelector('button[data-testid="confirmationSheetConfirm"]');
                if (confirmBtn) {
                    confirmBtn.click();
                    deleted++;
                    console.log(`🗑️ 삭제된 트윗 수: ${deleted}`);
                    document.body.click(); // 바로 메뉴 닫기
                    await delay(1000);
                } else {
                    console.log('❌ 삭제 확인 버튼 없음');
                }
            } else if (undoRetweetBtn) {
                document.body.click(); // 바로 메뉴 닫기
                undoRetweetBtn.click();
                await delay(400); // ← 리트윗 메뉴 뜨는 시간
                const menuItems2 = Array.from(document.querySelectorAll('div[role="menuitem"]'));
                const unretweetBtn = menuItems2.find(x => x.textContent.includes("재게시 취소"));
                if (unretweetBtn) {
                    unretweetBtn.click();
                    unretweeted++;
                    console.log(`↩️ 리트윗 취소 수: ${unretweeted}`);
                    document.body.click(); // 바로 메뉴 닫기
                    await delay(800);
                }
            } else {
                console.log('❌ 삭제 또는 리트윗 취소 버튼 없음');
                document.body.click(); // 메뉴 닫기
                await delay(300);
            }
        }

        window.scrollTo(0, document.body.scrollHeight);
        await delay(1000);
    }

    console.log(`✅ 완료! 총 삭제: ${deleted}, 리트윗 취소: ${unretweeted}`);
})();

document.addEventListener('DOMContentLoaded', () => {
    // 1. 要素の取得
    const wrapper = document.getElementById('alphaTab');
    const textarea = document.getElementById('source');
    const copyBtn = document.getElementById('copy-btn');

    // 2. コピーボタンの機能
    if (copyBtn && textarea) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(textarea.value)
                .then(() => {
                    const originalText = copyBtn.innerText;
                    copyBtn.innerText = "コピーしました！";
                    copyBtn.style.backgroundColor = "#28a745";
                    setTimeout(() => {
                        copyBtn.innerText = originalText;
                        copyBtn.style.backgroundColor = "";
                    }, 1500);
                })
                .catch(err => {
                    console.error("コピー失敗:", err);
                });
        });
    }

    // 3. alphaTab初期化
    if (!wrapper || !textarea) return;

    const api = new alphaTab.AlphaTabApi(wrapper, {
        core: { engine: 'html5' },
        display: { staveProfile: 'Default', barsPerRow: 4 },
        player: {
            enablePlayer: true,
            soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2'
        }
    });

    // 4. 更新処理
    const updateScore = () => {
        try {
            api.tex(textarea.value);
        } catch (err) {
            console.error("変換エラー:", err);
        }
    };

    // 初期実行
    updateScore();

    // 入力検知
    let timer = null;
    textarea.addEventListener('input', () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(updateScore, 500);
    });
});
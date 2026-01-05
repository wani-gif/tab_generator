document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('alphaTab');
    const textarea = document.getElementById('source');
    const copyBtn = document.getElementById('copy-btn');

    // コピーボタンの機能
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
                .catch(err => { console.error("コピー失敗:", err); });
        });
    }

    if (!wrapper || !textarea) return;

    // ★ここが変更点：画面幅に合わせて設定を変える
    const isMobile = window.innerWidth <= 768; // 画面幅が768px以下をスマホとみなす

    const settings = {
        core: { engine: 'html5' },
        display: {
            staveProfile: 'Default',
            // スマホなら自動折り返し(null)、PCなら4小節区切り
            barsPerRow: isMobile ? null : 4,
            // スマホなら少し縮小(0.8)、PCなら標準(1.0)
            scale: isMobile ? 0.8 : 1.0
        },
        player: {
            enablePlayer: true,
            soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2'
        }
    };

    // alphaTab初期化
    const api = new alphaTab.AlphaTabApi(wrapper, settings);

    // 更新処理
    const updateScore = () => {
        try {
            api.tex(textarea.value);
        } catch (err) {
            console.error("変換エラー:", err);
        }
    };

    // 初期実行と入力検知
    updateScore();
    let timer = null;
    textarea.addEventListener('input', () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(updateScore, 500);
    });
    
    // 画面の向きを変えた時などに再描画してレイアウトを直す
    window.addEventListener('resize', () => {
         api.render();
    });
});
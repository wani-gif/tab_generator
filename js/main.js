document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('alphaTab');
    const textarea = document.getElementById('source');
    const copyBtn = document.getElementById('copy-btn');
    const saveBtn = document.getElementById('save-btn'); // 追加

    // --- 1. ボタン機能 ---
    // コピーボタン
    if (copyBtn && textarea) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(textarea.value)
                .then(() => {
                    const originalText = copyBtn.innerText;
                    copyBtn.innerText = "コピーOK!";
                    setTimeout(() => { copyBtn.innerText = originalText; }, 1500);
                })
                .catch(err => console.error("コピー失敗:", err));
        });
    }

    // 画像保存ボタン（新機能）
    if (saveBtn && wrapper) {
        saveBtn.addEventListener('click', () => {
            // alphaTabが描画しているCanvas要素を探す
            const canvas = wrapper.querySelector('canvas');
            if (!canvas) {
                alert("まだ描画されていません。");
                return;
            }
            try {
                // Canvasを画像データに変換
                const imageURL = canvas.toDataURL("image/png");
                // ダウンロード用のリンクを一時的に作ってクリック
                const link = document.createElement('a');
                link.href = imageURL;
                link.download = 'my_tab_score.png'; // 保存ファイル名
                link.click();
            } catch (e) {
                alert("画像の保存に失敗しました。ブラウザの制限の可能性があります。");
                console.error(e);
            }
        });
    }

    if (!wrapper || !textarea) return;

    // --- 2. alphaTab設定とスマホ対応 ---

    // 画面幅に合わせて最適なスケール（縮小率）を計算する関数
    const calculateScale = () => {
        const width = window.innerWidth;
        // 基準となる幅（PCでちょうどいい幅を1000pxと仮定）
        const baseWidth = 1000;
        // 画面幅と基準幅の比率を計算。最大1.0、最小0.4（小さすぎ防止）にする
        let scale = width / baseWidth;
        scale = Math.min(1.0, Math.max(0.4, scale));
        return scale;
    };

    const settings = {
        core: { engine: 'html5' },
        display: {
            staveProfile: 'Default',
            barsPerRow: 4, // スマホでもPCでも常に4小節区切り
            scale: calculateScale() // 初期スケールを設定
        },
        player: {
            enablePlayer: true,
            soundFont: 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2'
        }
    };

    const api = new alphaTab.AlphaTabApi(wrapper, settings);

    const updateScore = () => {
        try { api.tex(textarea.value); } catch (err) { console.error("変換エラー:", err); }
    };

    updateScore();

    let timer = null;
    textarea.addEventListener('input', () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(updateScore, 500);
    });

    // 画面サイズが変わったらスケールを再計算して再描画
    window.addEventListener('resize', () => {
         api.settings.display.scale = calculateScale();
         api.updateSettings(); // 設定を反映
         api.render();
    });
});
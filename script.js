/* =====================================================================
    お題メーカー 本体スクリプト
===================================================================== */

const drawBtn    = document.getElementById("drawBtn");
const resultCard = document.getElementById("resultCard");

// JSONから読み込んだデータを格納する変数
let dataSong = [];
let dataIdol = [];

/* ---------------------------------------------------------------
    JSONデータの読み込み処理
--------------------------------------------------------------- */
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('データの取得に失敗しました。');
        }
        const data = await response.json();

        // 変数にデータを格納
        dataSong = data.dataSong;
        dataIdol = data.dataIdol;

        // ボタンを利用可能にする
        drawBtn.disabled = false;
        drawBtn.innerText = "お題を引く";
    } catch (error) {
        console.error(error);
        resultCard.innerHTML = `<p class="empty-note" style="color:red;">データの読み込みに失敗しました: ${escapeHtml(error.message)}</p>`;
    }
}



/* ---------------------------------------------------------------
    配列からランダムに1件返す
--------------------------------------------------------------- */
function pickRandomOne(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* ---------------------------------------------------------------
    配列から重複なしでn件ランダムに抜き出す
--------------------------------------------------------------- */
function pickRandomUnique(array, n) {
    const pool = [...array];
    const result = [];
    const take = Math.min(n, pool.length);

    for (let i = 0; i < take; i++) {
        const randIndex = Math.floor(Math.random() * pool.length);
        result.push(pool[randIndex]);
        pool.splice(randIndex, 1);
    }
    return result;
}

/* ---------------------------------------------------------------
    抽選メイン処理
--------------------------------------------------------------- */
function drawOmikuji() {
    const chosenA = pickRandomOne(dataSong);
    const chosenB = pickRandomUnique(dataIdol, chosenA.count);

    renderResult(chosenA, chosenB);
}

/* ---------------------------------------------------------------
    結果表示
--------------------------------------------------------------- */
function renderResult(chosenA, chosenB) {
    const itemsHtml = chosenB
    .map((item, i) => {
        const borderStyle = `style="border-left-color: ${item.color};"`;
        return `<li ${borderStyle}>
            ${escapeHtml(item.name)}
        </li>`;
    })
    .join("");

    resultCard.innerHTML = `
        <p class="result-a-name">${escapeHtml(chosenA.name)}<br>（${chosenA.count}人）</p>
        <ul class="result-b-list">${itemsHtml || '<li>抽出対象がありません</li>'}</ul>
    `;

    resultCard.classList.remove("show");
    void resultCard.offsetWidth; // 強制リフロー
    resultCard.classList.add("show");
}

/* ---------------------------------------------------------------
    簡易HTMLエスケープ
--------------------------------------------------------------- */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/* イベントリスナーの設定 */
drawBtn.addEventListener("click", drawOmikuji);

// ページ読み込み時にJSONデータを読み込む
window.addEventListener('DOMContentLoaded', loadData);
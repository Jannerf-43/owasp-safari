/*
 * 공격 탐지 게임 (Threat Spotter)
 * 사용 JS: setInterval(타이머) · click/keydown(이벤트) · 배열 셔플/랜덤 · DOM 조작 · localStorage(최고점)
 */
(() => {
    "use strict";

    const DURATION = 30;          // 제한 시간(초)
    const BEST_KEY = "owaspGameBest";

    let samples = [];
    let queue   = [];
    let current = null;
    let score   = 0;
    let total   = 0;
    let timeLeft = DURATION;
    let timerId = null;
    let playing = false;

    const $ = id => document.getElementById(id);

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function nextSample() {
        if (!queue.length) queue = shuffle(samples);   // 다 쓰면 다시 섞어 채움
        current = queue.pop();
        $("game-sample").textContent = current.text;
        $("game-feedback").textContent = "";
        $("game-feedback").className = "game-feedback";
    }

    function classify(userSaysMalicious) {
        if (!playing || !current) return;
        total++;
        const correct = (userSaysMalicious === current.malicious);
        if (correct) score++;

        const fb = $("game-feedback");
        fb.textContent = (correct ? "✅ 정답! " : "❌ 오답. ")
            + `${current.text.length > 30 ? "이 입력" : "「" + current.text + "」"}은(는) `
            + (current.malicious ? `공격 (${current.type})` : `정상 (${current.type})`);
        fb.className = "game-feedback " + (correct ? "is-correct" : "is-wrong");

        $("game-score").textContent = `${score}점`;
        nextSample();
    }

    function tick() {
        timeLeft--;
        $("game-time").textContent = timeLeft;
        if (timeLeft <= 0) end();
    }

    function start() {
        score = 0; total = 0; timeLeft = DURATION; playing = true;
        queue = shuffle(samples);
        $("game-score").textContent = "0점";
        $("game-time").textContent = DURATION;
        $("game-result").style.display = "none";
        $("game-board").style.display = "block";
        $("game-attack").disabled = false;
        $("game-safe").disabled = false;
        nextSample();
        clearInterval(timerId);
        timerId = setInterval(tick, 1000);
    }

    function end() {
        playing = false;
        clearInterval(timerId);
        $("game-attack").disabled = true;
        $("game-safe").disabled = true;
        $("game-board").style.display = "none";

        let best = 0;
        try { best = parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (_) {}
        const isNew = score > best;
        if (isNew) { best = score; try { localStorage.setItem(BEST_KEY, String(best)); } catch (_) {} }

        $("game-result-score").textContent = `${total}문제 중 ${score}개 정답`;
        $("game-result-best").textContent = isNew ? `🎉 새 최고 기록! 최고 ${best}점` : `최고 기록: ${best}점`;
        $("game-result").style.display = "block";
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!$("game-board")) return;
        if (!Array.isArray(window.GAME_DATA)) {
            $("game-sample").textContent = "⚠️ 데이터(window.GAME_DATA)가 없습니다.";
            return;
        }
        samples = window.GAME_DATA;

        $("game-attack").addEventListener("click", () => classify(true));
        $("game-safe").addEventListener("click", () => classify(false));
        $("game-start").addEventListener("click", start);
        $("game-restart").addEventListener("click", start);

        // 키보드: ← 공격 / → 정상
        document.addEventListener("keydown", e => {
            if (!playing) return;
            if (e.key === "ArrowLeft")  { e.preventDefault(); classify(true); }
            else if (e.key === "ArrowRight") { e.preventDefault(); classify(false); }
        });
    });
})();

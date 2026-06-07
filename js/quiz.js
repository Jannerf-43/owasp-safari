(() => {
    "use strict";

    const BEST_KEY = "owaspQuizBest"; // 최고 점수 저장 키 (localStorage)

    const DIFFICULTY = {
        easy:   { label: "쉬움",   rank: 1, color: "var(--point)" },
        medium: { label: "보통",   rank: 2, color: "#ffaa00" },
        hard:   { label: "어려움", rank: 3, color: "var(--warning)" }
    };

    let baseQuestions = [];  // 원본 순서
    let questions     = [];  // 현재 정렬 적용된 목록
    let index         = 0;
    let earnedPoints  = 0;
    let totalPoints   = 0;
    let correctCount  = 0;
    let answered      = false;
    let breakdown     = {};  // 난이도별 { correct, total }

    const $ = id => document.getElementById(id);

    /** 입력값 정규화 후 accept 목록 중 하나라도 포함하면 정답 */
    function matchInput(value, accept) {
        const v = (value || "").toLowerCase().trim();
        if (!v) return false;
        return accept.some(a => v.includes(a.toLowerCase()));
    }

    /** 정렬 모드 적용 */
    function applySort(mode) {
        if (mode === "difficulty") {
            questions = [...baseQuestions].sort(
                (a, b) => DIFFICULTY[a.difficulty].rank - DIFFICULTY[b.difficulty].rank
            );
        } else if (mode === "random") {
            questions = [...baseQuestions];
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
        } else {
            questions = [...baseQuestions];
        }
    }

    function resetState() {
        index = 0;
        earnedPoints = 0;
        correctCount = 0;
        breakdown = { easy:{correct:0,total:0}, medium:{correct:0,total:0}, hard:{correct:0,total:0} };
        totalPoints = questions.reduce((s, q) => s + (q.points || 0), 0);
        questions.forEach(q => breakdown[q.difficulty].total++);
    }

    function renderQuestion() {
        answered = false;
        const q = questions[index];
        const diff = DIFFICULTY[q.difficulty];

        $("quiz-progress").textContent = `문제 ${index + 1} / ${questions.length}`;
        $("quiz-score").textContent    = `${earnedPoints}점`;
        $("quiz-category").textContent = q.category || "";
        $("quiz-difficulty").textContent = `${diff.label} · ${q.points}점`;
        $("quiz-difficulty").style.color = diff.color;
        $("quiz-difficulty").style.borderColor = diff.color;
        $("quiz-question").textContent = q.question;

        const optionsWrap = $("quiz-options");
        const inputWrap   = $("quiz-input-wrap");
        optionsWrap.innerHTML = "";

        if (q.type === "input") {
            optionsWrap.style.display = "none";
            inputWrap.style.display = "flex";
            const inputEl = $("quiz-input");
            inputEl.value = "";
            inputEl.placeholder = q.placeholder || "정답을 입력하세요";
            inputEl.disabled = false;
            $("quiz-submit").disabled = false;
            setTimeout(() => inputEl.focus(), 0);
        } else {
            inputWrap.style.display = "none";
            optionsWrap.style.display = "flex";
            q.options.forEach((optText, i) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "quiz-option";
                btn.textContent = optText;
                btn.addEventListener("click", () => selectChoice(i));
                optionsWrap.appendChild(btn);
            });
        }

        const exp = $("quiz-explanation");
        exp.textContent = "";
        exp.className = "quiz-explanation";

        const nextBtn = $("quiz-next");
        nextBtn.style.display = "none";
        nextBtn.textContent = (index + 1 < questions.length) ? "다음 문제 →" : "결과 보기";
    }

    /** 정답 처리 공통 */
    function finishAnswer(isCorrect) {
        answered = true;
        const q = questions[index];
        if (isCorrect) {
            earnedPoints += q.points || 0;
            correctCount++;
            breakdown[q.difficulty].correct++;
        }
        $("quiz-score").textContent = `${earnedPoints}점`;

        const exp = $("quiz-explanation");
        exp.textContent = (isCorrect ? "✅ 정답! " : "❌ 오답. ") + (q.explanation || "");
        exp.classList.add(isCorrect ? "is-correct" : "is-wrong");
        $("quiz-next").style.display = "inline-block";
    }

    /** 객관식 선택 */
    function selectChoice(chosen) {
        if (answered) return;
        const q = questions[index];
        const buttons = [...document.querySelectorAll(".quiz-option")];
        buttons.forEach((b, i) => {
            b.disabled = true;
            if (i === q.answer)    b.classList.add("correct");
            else if (i === chosen) b.classList.add("wrong");
        });
        finishAnswer(chosen === q.answer);
    }

    /** 입력 매칭형 제출 */
    function submitInput() {
        if (answered) return;
        const q = questions[index];
        const inputEl = $("quiz-input");
        const isCorrect = matchInput(inputEl.value, q.accept || []);
        inputEl.disabled = true;
        $("quiz-submit").disabled = true;
        inputEl.classList.add(isCorrect ? "correct" : "wrong");
        finishAnswer(isCorrect);
    }

    function next() {
        index++;
        if (index < questions.length) renderQuestion();
        else showResult();
    }

    function gradeMessage(pct) {
        if (pct === 100) return "🏆 완벽합니다! OWASP 기초가 탄탄하네요.";
        if (pct >= 75)   return "👍 훌륭해요. 조금만 더 다지면 됩니다.";
        if (pct >= 50)   return "🙂 절반 이상! 틀린 개념을 복습해 보세요.";
        return "📚 이론 페이지를 한 번 더 둘러보는 걸 추천해요.";
    }

    function showResult() {
        $("quiz-card").style.display = "none";
        const result = $("quiz-result");
        result.style.display = "block";

        const pct = totalPoints ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        $("result-pct").textContent    = `${pct}점`;
        $("result-points").textContent = `획득 점수: ${earnedPoints} / ${totalPoints}점`;
        $("result-score").textContent  = `정답 ${correctCount} / ${questions.length}문제`;
        $("result-message").textContent = gradeMessage(pct);

        // 난이도별 분석
        const bd = $("result-breakdown");
        bd.innerHTML = "";
        ["easy","medium","hard"].forEach(key => {
            const d = breakdown[key];
            if (!d.total) return;
            const row = document.createElement("div");
            row.className = "breakdown-row";
            const name = document.createElement("span");
            name.textContent = DIFFICULTY[key].label;
            name.style.color = DIFFICULTY[key].color;
            const val = document.createElement("span");
            val.textContent = `${d.correct} / ${d.total}`;
            row.append(name, val);
            bd.appendChild(row);
        });

        // 최고 점수 (localStorage)
        let best = 0;
        try { best = parseInt(localStorage.getItem(BEST_KEY), 10) || 0; } catch (_) {}
        if (pct > best) {
            best = pct;
            try { localStorage.setItem(BEST_KEY, String(best)); } catch (_) {}
            $("result-best").textContent = `🎉 새 최고 기록! 최고 점수: ${best}점`;
        } else {
            $("result-best").textContent = `최고 점수: ${best}점`;
        }
    }

    function start() {
        const mode = $("quiz-sort") ? $("quiz-sort").value : "default";
        applySort(mode);
        resetState();
        $("quiz-result").style.display = "none";
        $("quiz-card").style.display = "block";
        renderQuestion();
    }

    /** 키보드 조작: 1~4 보기 선택, Enter 다음 */
    function handleKey(e) {
        const card = $("quiz-card");
        if (!card || card.style.display === "none") return;     // 결과 화면이면 무시
        if (e.target && e.target.id === "quiz-input") return;   // 입력칸은 자체 처리

        const q = questions[index];
        if (!answered && q && q.type === "choice") {
            const n = parseInt(e.key, 10);
            if (n >= 1 && n <= q.options.length) {
                e.preventDefault();
                selectChoice(n - 1);
                return;
            }
        }
        if (e.key === "Enter" && answered && $("quiz-next").style.display !== "none") {
            e.preventDefault();
            next();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!$("quiz-card")) return;

        const data = window.QUIZ_DATA;
        if (!data || !Array.isArray(data.questions) || !data.questions.length) {
            $("quiz-question").textContent =
                "⚠️ 퀴즈 데이터(window.QUIZ_DATA)가 없습니다. data/quiz-data.js 로드를 확인하세요.";
            $("quiz-options").innerHTML = "";
            return;
        }

        baseQuestions = data.questions;

        $("quiz-next").addEventListener("click", next);
        $("quiz-restart").addEventListener("click", start);
        $("quiz-submit").addEventListener("click", submitInput);
        $("quiz-input").addEventListener("keydown", e => { if (e.key === "Enter") submitInput(); });
        if ($("quiz-sort")) $("quiz-sort").addEventListener("change", start);
        document.addEventListener("keydown", handleKey);

        start();
    });
})();

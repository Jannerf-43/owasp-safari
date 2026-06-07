(() => {
    "use strict";

    // payloads-data.js(window.PAYLOADS)에서 주입 (하드코딩 제거)
    let MAX_ATTEMPTS  = 5;
    let LOCKOUT_MS    = 30000;
    let WEAK_PASSWORDS = [];

    let attemptCount = 0;
    let isLocked     = false;
    let lockTimer    = null;

    /** 비밀번호 강도 평가 */
    function evaluatePassword(pw) {
        const tips = [];
        let score  = 0;

        if (pw.length >= 8)  score++;  else tips.push("8자 이상으로 설정하세요");
        if (pw.length >= 12) score++;  else tips.push("12자 이상이면 더 안전합니다");
        if (/[A-Z]/.test(pw)) score++; else tips.push("대문자를 포함하세요");
        if (/[a-z]/.test(pw)) score++; else tips.push("소문자를 포함하세요");
        if (/[0-9]/.test(pw)) score++; else tips.push("숫자를 포함하세요");
        if (/[^A-Za-z0-9]/.test(pw)) score += 2; else tips.push("특수문자(!@#$%)를 포함하세요");
        if (WEAK_PASSWORDS.includes(pw.toLowerCase())) {
            score = 0;
            tips.unshift("⚠️ 매우 흔한 비밀번호입니다. 즉시 변경하세요!");
        }

        const levels = [
            { min: 0, label: "🔴 매우 취약", color: "var(--warning)" },
            { min: 2, label: "🟠 취약",      color: "#ff7700" },
            { min: 4, label: "🟡 보통",      color: "#ffaa00" },
            { min: 6, label: "🟢 강함",      color: "var(--point)" }
        ];
        const level = [...levels].reverse().find(l => score >= l.min) || levels[0];
        return { score, label: level.label, color: level.color, tips };
    }

    function startLockout(button, resultEl) {
        isLocked = true;
        button.disabled = true;
        let remaining = LOCKOUT_MS / 1000;

        function tick() {
            resultEl.style.color = "var(--warning)";
            resultEl.innerHTML =
                `🔒 <strong>계정 잠금!</strong> 너무 많은 로그인 시도가 감지되었습니다.<br>
                 <strong>${remaining}초</strong> 후 다시 시도하세요.<br>
                 <small style="color:var(--text-muted)">
                   ⚠️ 실제 서비스라면 이 IP는 차단되거나 CAPTCHA가 요구되어야 합니다.
                 </small>`;
            remaining--;
            if (remaining < 0) {
                clearInterval(lockTimer);
                isLocked = false;
                attemptCount = 0;
                button.disabled = false;
                resultEl.style.color = "var(--text-muted)";
                resultEl.innerHTML = "🔓 잠금 해제됨. 다시 시도할 수 있습니다.";
            }
        }
        tick();
        lockTimer = setInterval(tick, 1000);
    }

    function handleAuthCheck() {
        const usernameEl = document.getElementById("broken-auth-username");
        const passwordEl = document.getElementById("broken-auth-password");
        const resultEl   = document.getElementById("broken-auth-result");
        const button     = document.getElementById("broken-auth-check-button");

        if (!usernameEl || !passwordEl || !resultEl || !button) return;
        if (isLocked) return;

        const username = usernameEl.value.trim();
        const password = passwordEl.value;

        if (!username || !password) {
            resultEl.style.color = "#ffaa00";
            resultEl.innerHTML = "⚠️ 아이디와 비밀번호를 모두 입력하세요.";
            return;
        }

        attemptCount++;
        const evaluation = evaluatePassword(password);
        const isWeak     = WEAK_PASSWORDS.includes(password.toLowerCase()) || password.length < 6;
        const remaining  = MAX_ATTEMPTS - attemptCount;

        if (isWeak) {
            const tipsHtml = evaluation.tips.length > 0
                ? `<br><strong>개선 방법:</strong><br>${evaluation.tips.map(t => `• ${t}`).join("<br>")}`
                : "";
            resultEl.style.color = evaluation.color;
            resultEl.innerHTML =
                `${evaluation.label}<br>
                 비밀번호 강도 점수: <strong>${evaluation.score} / 7</strong>${tipsHtml}<br><br>
                 <div style="border:1px dashed var(--warning);padding:10px;border-radius:8px;background:rgba(255,51,51,0.06)">
                   ⚠️ <strong>[취약한 인증 시뮬레이션]</strong><br>
                   이 비밀번호는 브루트포스나 사전 공격으로 쉽게 뚫립니다.<br>
                   시도 횟수: <strong>${attemptCount}</strong> / ${MAX_ATTEMPTS}
                   ${remaining > 0 ? `(${remaining}회 남음)` : ""}
                 </div>`;
        } else {
            resultEl.style.color = evaluation.color;
            resultEl.innerHTML =
                `${evaluation.label}<br>
                 비밀번호 강도 점수: <strong>${evaluation.score} / 7</strong><br>
                 ${evaluation.tips.length > 0
                     ? `개선 가능: ${evaluation.tips.join(", ")}`
                     : "✅ 안전한 비밀번호입니다!"}<br><br>
                 <small style="color:var(--text-muted)">시도 횟수: ${attemptCount} / ${MAX_ATTEMPTS}</small>`;
        }

        if (attemptCount >= MAX_ATTEMPTS) {
            startLockout(button, resultEl);
        }
    }

    function handlePasswordInput() {
        const passwordEl = document.getElementById("broken-auth-password");
        const resultEl   = document.getElementById("broken-auth-result");
        if (!passwordEl || !resultEl || isLocked) return;

        const pw = passwordEl.value;
        if (!pw) {
            resultEl.style.color = "var(--text-muted)";
            resultEl.innerHTML = "결과가 여기에 표시됩니다.";
            return;
        }
        const ev = evaluatePassword(pw);
        resultEl.style.color = ev.color;
        resultEl.innerHTML = `실시간 강도 측정: <strong>${ev.label}</strong> (${ev.score}/7점)`;
    }

    document.addEventListener("DOMContentLoaded", async () => {
        const button     = document.getElementById("broken-auth-check-button");
        const passwordEl = document.getElementById("broken-auth-password");
        const resultEl   = document.getElementById("broken-auth-result");
        if (!button) return;

        try {
            const data = (await window.OWASP.loadPayloads()).brokenAuth;
            MAX_ATTEMPTS   = data.maxAttempts;
            LOCKOUT_MS     = data.lockoutMs;
            WEAK_PASSWORDS = data.weakPasswords;
        } catch (err) {
            console.error("[broken-auth] payloads 로드 실패:", err);
            if (resultEl) {
                resultEl.style.color = "#ffaa00";
                resultEl.innerHTML = "⚠️ 실습 데이터를 불러오지 못했습니다. 로컬 서버로 실행하세요.";
            }
            return;
        }

        button.addEventListener("click", handleAuthCheck);
        if (passwordEl) passwordEl.addEventListener("input", handlePasswordInput);
        ["broken-auth-username", "broken-auth-password"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener("keydown", e => {
                if (e.key === "Enter") handleAuthCheck();
            });
        });
    });
})();

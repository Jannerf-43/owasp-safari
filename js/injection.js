(() => {
    "use strict";

    // payloads-data.js(window.PAYLOADS)에서 주입 (하드코딩 제거)
    let INJECTION_TRIGGERS = [];
    let FAKE_DB = [];

    /** 입력값이 Injection 트리거를 포함하는지 검사 */
    function isInjection(value) {
        const lower = value.toLowerCase().trim();
        return INJECTION_TRIGGERS.some(trigger => lower.includes(trigger));
    }

    /** 정상 로그인 시뮬레이션 (가상 DB 검색) */
    function normalLogin(username, password) {
        const user = FAKE_DB.find(
            u => u.username === username && u.password === password
        );
        return user ? { found: true, role: user.role } : { found: false };
    }

    function showResult(el, html, color) {
        el.style.color = color;
        el.innerHTML = html;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    // ── 취약한 방식 시뮬레이션 ───────────────────────────────────────────────
    function runVulnerableLogin(username, password, resultEl) {
        const fakeQuery =
            `SELECT * FROM users WHERE username='${escapeHtml(username)}' AND password='${escapeHtml(password)}'`;

        if (isInjection(username) || isInjection(password)) {
            showResult(resultEl,
                `✅ <strong>[취약한 방식] 인증 우회 성공!</strong><br><br>
                <div style="border:1px solid var(--warning);border-radius:10px;padding:12px;background:rgba(255,51,51,0.08)">
                  <strong>실행된 쿼리 (시뮬레이션):</strong><br>
                  <code style="color:var(--warning);word-break:break-all">${fakeQuery}</code><br><br>
                  <strong>공격 원리:</strong> 입력값이 쿼리에 그대로 결합되어 조건절이 항상 참이 됩니다.<br>
                  <strong>결과:</strong> DB의 첫 번째 계정(admin)으로 로그인 처리됨<br>
                  <span style="color:var(--point)">role: admin · 계정 탈취 성공</span>
                </div>`,
                "var(--warning)"
            );
        } else {
            const result = normalLogin(username, password);
            if (result.found) {
                showResult(resultEl,
                    `✅ <strong>[취약한 방식] 로그인 성공</strong><br>
                    <code style="color:var(--text-muted)">${fakeQuery}</code><br>
                    role: <span style="color:var(--point)">${result.role}</span>`,
                    "var(--point)"
                );
            } else {
                showResult(resultEl,
                    `❌ <strong>[취약한 방식] 로그인 실패</strong><br>
                    <code style="color:var(--text-muted)">${fakeQuery}</code><br>
                    <small>일치하는 계정 없음</small>`,
                    "var(--text-muted)"
                );
            }
        }
    }

    // ── 안전한 방식 시뮬레이션 (Prepared Statement) ──────────────────────────
    function runSafeLogin(username, password, resultEl) {
        const fakeQuery = `SELECT * FROM users WHERE username=? AND password=?`;

        if (isInjection(username) || isInjection(password)) {
            showResult(resultEl,
                `⛔ <strong>[안전한 방식] 공격 차단!</strong><br><br>
                <div style="border:1px solid var(--point);border-radius:10px;padding:12px;background:rgba(0,255,102,0.06)">
                  <strong>실행된 쿼리 (Prepared Statement):</strong><br>
                  <code style="color:var(--point)">${fakeQuery}</code><br>
                  <code style="color:var(--text-muted)">바인딩 값: ('${escapeHtml(username)}', '${escapeHtml(password)}')</code><br><br>
                  <strong>방어 원리:</strong> 입력값은 데이터로만 처리되어 쿼리 구조를 바꿀 수 없습니다.<br>
                  Injection 시도가 <span style="color:var(--point)">무력화</span>되었습니다.
                </div>`,
                "var(--point)"
            );
        } else {
            const result = normalLogin(username, password);
            if (result.found) {
                showResult(resultEl,
                    `✅ <strong>[안전한 방식] 로그인 성공</strong><br>
                    <code style="color:var(--text-muted)">${fakeQuery}</code><br>
                    role: <span style="color:var(--point)">${result.role}</span>`,
                    "var(--point)"
                );
            } else {
                showResult(resultEl,
                    `❌ <strong>[안전한 방식] 로그인 실패</strong><br>
                    <code style="color:var(--text-muted)">${fakeQuery}</code><br>
                    <small>일치하는 계정 없음</small>`,
                    "var(--text-muted)"
                );
            }
        }
    }

    function handleLogin() {
        const usernameEl = document.getElementById("injection-username");
        const passwordEl = document.getElementById("injection-password");
        const resultEl   = document.getElementById("injection-result");
        const modeEl     = document.getElementById("injection-mode");

        if (!usernameEl || !passwordEl || !resultEl) return;

        const username = usernameEl.value;
        const password = passwordEl.value;
        const mode     = modeEl ? modeEl.value : "vulnerable";

        if (!username.trim()) {
            resultEl.style.color = "#ffaa00";
            resultEl.innerHTML = "⚠️ 아이디를 입력하세요.";
            return;
        }

        if (mode === "vulnerable") {
            runVulnerableLogin(username, password, resultEl);
        } else {
            runSafeLogin(username, password, resultEl);
        }
    }

    document.addEventListener("DOMContentLoaded", async () => {
        const button = document.getElementById("injection-login-button");
        const resultEl = document.getElementById("injection-result");
        if (!button) return;

        // 데이터 로드 후 활성화
        try {
            const data = (await window.OWASP.loadPayloads()).injection;
            INJECTION_TRIGGERS = data.triggers;
            FAKE_DB = data.fakeDb;
        } catch (err) {
            console.error("[injection] payloads 로드 실패:", err);
            if (resultEl) {
                resultEl.style.color = "#ffaa00";
                resultEl.innerHTML = "⚠️ 실습 데이터를 불러오지 못했습니다. 로컬 서버로 실행하세요.";
            }
            return;
        }

        button.addEventListener("click", handleLogin);
        ["injection-username", "injection-password"].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener("keydown", e => {
                if (e.key === "Enter") handleLogin();
            });
        });
    });
})();

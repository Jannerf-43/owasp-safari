(() => {
    "use strict";

    // payloads-data.js(window.PAYLOADS)에서 주입 (하드코딩 제거)
    let XSS_PATTERNS = [];

    /** 입력값에서 XSS 패턴 탐지 */
    function detectXssPatterns(value) {
        const lower = value.toLowerCase();
        return XSS_PATTERNS.filter(p => lower.includes(p.toLowerCase()));
    }

    /** HTML 특수문자 이스케이프 (안전한 출력) */
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function handleXssRender() {
        const inputEl  = document.getElementById("xss-input");
        const resultEl = document.getElementById("xss-result");
        const modeEl   = document.getElementById("xss-mode");

        if (!inputEl || !resultEl) return;

        const rawValue    = inputEl.value;
        const detected    = detectXssPatterns(rawValue);
        const isDangerous = detected.length > 0;
        const mode        = modeEl ? modeEl.value : "safe";

        if (!rawValue.trim()) {
            resultEl.style.color = "var(--text-muted)";
            resultEl.innerHTML = "댓글을 입력한 후 버튼을 누르세요.";
            return;
        }

        if (mode === "unsafe" && isDangerous) {
            resultEl.style.color = "var(--warning)";
            resultEl.innerHTML =
                `⚠️ <strong>[취약한 서버 시뮬레이션]</strong> 입력값이 그대로 반영됩니다!<br><br>` +
                `<div style="border:1px dashed var(--warning);padding:10px;border-radius:8px;background:rgba(255,51,51,0.08)">` +
                `탐지된 패턴: <code style="color:var(--warning)">${detected.map(escapeHtml).join(", ")}</code><br>` +
                `실제 공격 시 이 위치에 악성 스크립트가 실행됩니다.<br>` +
                `예) 쿠키 탈취: <code>document.cookie</code> 값이 공격자 서버로 전송될 수 있습니다.` +
                `</div>`;
        } else if (mode === "safe") {
            resultEl.style.color = isDangerous ? "var(--point)" : "var(--text-muted)";
            resultEl.innerHTML =
                (isDangerous
                    ? `✅ <strong>[안전한 서버] XSS 시도 차단!</strong> 태그가 이스케이프되어 텍스트로 표시됩니다.<br><br>`
                    : `✅ <strong>[안전한 서버] 일반 입력으로 판단되어 그대로 출력합니다.</strong><br><br>`) +
                `<div style="border:1px solid var(--line);padding:10px;border-radius:8px">` +
                `댓글: ${escapeHtml(rawValue)}` +
                `</div>`;
        } else {
            resultEl.style.color = "var(--text-muted)";
            resultEl.innerHTML =
                `✅ [취약한 서버] 일반 입력 — 특이 패턴 없음<br>` +
                `<div style="border:1px dashed var(--line);padding:10px;border-radius:8px">` +
                `${escapeHtml(rawValue)}` +
                `</div>`;
        }
    }

    document.addEventListener("DOMContentLoaded", async () => {
        const button   = document.getElementById("xss-render-button");
        const resultEl = document.getElementById("xss-result");
        if (!button) return;

        // 데이터 로드
        try {
            XSS_PATTERNS = (await window.OWASP.loadPayloads()).xss.patterns;
        } catch (err) {
            console.error("[xss] payloads 로드 실패:", err);
            if (resultEl) {
                resultEl.style.color = "#ffaa00";
                resultEl.innerHTML = "⚠️ 실습 데이터를 불러오지 못했습니다. 로컬 서버로 실행하세요.";
            }
            return;
        }

        // 모드 선택 UI 동적 추가
        const labPanel = document.querySelector("#xss-page-container .lab-panel");
        const formGrid = labPanel ? labPanel.querySelector(".form-grid") : null;
        if (formGrid) {
            const modeLabel = document.createElement("label");
            modeLabel.textContent = "출력 방식";

            const modeSelect = document.createElement("select");
            modeSelect.id = "xss-mode";
            modeSelect.innerHTML = `
                <option value="safe">✅ 안전한 방식 (이스케이프)</option>
                <option value="unsafe">⚠️ 취약한 방식 (innerHTML 시뮬레이션)</option>
            `;
            formGrid.insertBefore(modeLabel, button);
            formGrid.insertBefore(modeSelect, button);
        }

        button.addEventListener("click", handleXssRender);

        const inputEl = document.getElementById("xss-input");
        if (inputEl) {
            inputEl.addEventListener("keydown", e => {
                if (e.key === "Enter") handleXssRender();
            });
        }
    });
})();

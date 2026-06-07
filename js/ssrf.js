(() => {
    "use strict";

    // payloads-data.js(window.PAYLOADS)에서 주입 (하드코딩 제거)
    let INTERNAL_PATTERNS = [];   // { pattern: RegExp, label, risk }
    let ALLOWLIST_DOMAINS = [];
    let PRESETS = [];

    // 위험도 표시 설정 (CSS 변수 사용 — 표현 계층이라 JS에 유지)
    const RISK_CONFIG = {
        critical: { label: "🔴 위험 (SSRF 공격 가능)",   color: "var(--warning)", bg: "rgba(255,51,51,0.08)" },
        high:     { label: "🟠 위험 (내부망 접근 가능)", color: "#ff7700",         bg: "rgba(255,119,0,0.08)" },
        medium:   { label: "🟡 주의 (외부 도메인)",      color: "#ffaa00",         bg: "rgba(255,170,0,0.08)" },
        safe:     { label: "✅ 허용 리스트 도메인",      color: "var(--point)",    bg: "rgba(0,255,102,0.08)" }
    };

    /** URL 위험도 분석 */
    function analyzeUrl(urlStr) {
        try {
            const parsed   = new URL(urlStr);
            const hostname = parsed.hostname;

            if (ALLOWLIST_DOMAINS.some(d => hostname === d || hostname.endsWith("." + d))) {
                return { risk: "safe", matchedLabel: `허용된 도메인: ${hostname}`, hostname };
            }
            for (const rule of INTERNAL_PATTERNS) {
                if (rule.pattern.test(urlStr)) {
                    return { risk: rule.risk, matchedLabel: rule.label, hostname };
                }
            }
            return { risk: "medium", matchedLabel: null, hostname };
        } catch (_) {
            return { risk: "critical", matchedLabel: "유효하지 않은 URL 형식", hostname: null };
        }
    }

    function showSsrfResult(resultEl, urlStr) {
        const { risk, matchedLabel, hostname } = analyzeUrl(urlStr);
        const cfg = RISK_CONFIG[risk] || RISK_CONFIG.medium;

        let detail = "";
        if (risk === "critical" || risk === "high") {
            detail = `
<div style="border:1px dashed ${cfg.color};padding:10px;border-radius:8px;background:${cfg.bg};margin-top:10px">
  <strong>⚠️ 탐지 이유:</strong> ${matchedLabel || "내부 리소스 접근 패턴 탐지"}<br>
  <strong>공격 시나리오:</strong><br>
  ${risk === "critical"
    ? "공격자가 이 URL을 전송하면, 서버가 내부 메타데이터 서버 또는 로컬 포트에 접근해 민감 정보를 유출할 수 있습니다."
    : "내부망 IP 대역에 접근해 방화벽 내부 서비스(DB, 캐시, 내부 API)를 스캔하거나 정보를 탈취할 수 있습니다."
  }<br>
  <strong>방어법:</strong> 허용 도메인 목록 검사 → 내부 IP 차단 → 리다이렉트 추적 차단
</div>`;
        } else if (risk === "medium") {
            detail = `
<div style="margin-top:10px;color:var(--text-muted);font-size:13px">
  외부 도메인(<code>${escapeHtml(hostname || urlStr)}</code>)은 일반적으로 허용되지만,<br>
  허용 리스트(Allowlist)에 없는 도메인입니다. 실제 서비스라면 차단을 권장합니다.
</div>`;
        } else {
            detail = `
<div style="margin-top:10px;color:var(--text-muted);font-size:13px">
  허용 리스트에 등록된 안전한 도메인입니다. 서버가 이 URL로 요청을 보내도 됩니다.<br>
  예시 허용 목록: ${ALLOWLIST_DOMAINS.map(d => `<code>${d}</code>`).join(", ")}
</div>`;
        }

        resultEl.style.color = cfg.color;
        resultEl.innerHTML =
            `<strong>${cfg.label}</strong><br>
             분석 URL: <code style="color:var(--text-muted)">${escapeHtml(urlStr)}</code>
             ${detail}`;
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    document.addEventListener("DOMContentLoaded", async () => {
        const button   = document.getElementById("ssrf-check-button");
        const inputEl  = document.getElementById("ssrf-url-input");
        const resultEl = document.getElementById("ssrf-result");
        if (!button || !inputEl || !resultEl) return;

        // 데이터 로드 + 정규식 재구성
        try {
            const data = (await window.OWASP.loadPayloads()).ssrf;
            INTERNAL_PATTERNS = data.internalPatterns.map(p => ({
                pattern: new RegExp(p.pattern, p.flags || ""),
                label:   p.label,
                risk:    p.risk
            }));
            ALLOWLIST_DOMAINS = data.allowlist;
            PRESETS = data.presets;
        } catch (err) {
            console.error("[ssrf] payloads 로드 실패:", err);
            resultEl.style.color = "#ffaa00";
            resultEl.innerHTML = "⚠️ 실습 데이터를 불러오지 못했습니다. 로컬 서버로 실행하세요.";
            return;
        }

        // 빠른 체험용 프리셋 버튼 삽입
        const lab = document.querySelector("#ssrf-page-container .lab-panel");
        if (lab) {
            const presetWrap = document.createElement("div");
            presetWrap.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-top:14px";
            presetWrap.innerHTML = `<span style="color:var(--text-muted);font-size:13px;align-self:center">빠른 테스트: </span>`;
            PRESETS.forEach(({ label, value }) => {
                const btn = document.createElement("button");
                btn.textContent = label;
                btn.style.cssText =
                    "padding:6px 12px;border:1px solid var(--line);border-radius:999px;" +
                    "background:transparent;color:var(--text-muted);cursor:pointer;font-size:13px;";
                btn.addEventListener("click", () => {
                    inputEl.value = value;
                    showSsrfResult(resultEl, value);
                });
                presetWrap.appendChild(btn);
            });
            const formGrid = lab.querySelector(".form-grid");
            if (formGrid) lab.insertBefore(presetWrap, formGrid.nextSibling);
        }

        button.addEventListener("click", () => {
            const val = inputEl.value.trim();
            if (!val) {
                resultEl.style.color = "#ffaa00";
                resultEl.innerHTML = "⚠️ URL을 입력하세요.";
                return;
            }
            showSsrfResult(resultEl, val);
        });

        inputEl.addEventListener("keydown", e => {
            if (e.key === "Enter") button.click();
        });
    });
})();

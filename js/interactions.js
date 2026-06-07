/*
 * 사이트 공통 인터랙션 (이벤트 중심)
 * - keydown : 키보드 단축키
 * - scroll  : 진행바 + 맨 위로 버튼
 * - click   : 이벤트 위임으로 <code> 복사
 * - CustomEvent : 토스트 알림 시스템 (owasp:toast)
 */
(() => {
    "use strict";

    window.OWASP = window.OWASP || {};

    // ─── 토스트 (CustomEvent 기반) ────────────────────────────────
    let toastHost = null;
    function ensureToastHost() {
        if (toastHost) return toastHost;
        toastHost = document.createElement("div");
        toastHost.id = "toast-host";
        document.body.appendChild(toastHost);
        return toastHost;
    }
    function showToast(message) {
        if (!message) return;
        const host = ensureToastHost();
        const el = document.createElement("div");
        el.className = "toast";
        el.textContent = message;
        host.appendChild(el);
        requestAnimationFrame(() => el.classList.add("show"));
        setTimeout(() => {
            el.classList.remove("show");
            el.addEventListener("transitionend", () => el.remove(), { once: true });
        }, 1800);
    }
    // 어디서든 호출 가능한 헬퍼 + 커스텀 이벤트 리스너
    window.OWASP.toast = msg =>
        document.dispatchEvent(new CustomEvent("owasp:toast", { detail: { message: msg } }));
    document.addEventListener("owasp:toast", e => showToast(e.detail && e.detail.message));

    // ─── 클립보드 복사 (execCommand 폴백 포함) ────────────────────
    async function copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            throw new Error("insecure context");
        } catch (_) {
            // file:// 등 비보안 컨텍스트 폴백
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand("copy"); } catch (_) {}
            ta.remove();
            return ok;
        }
    }

    // ─── DOM 준비 후 UI 생성 + 이벤트 부착 ────────────────────────
    document.addEventListener("DOMContentLoaded", () => {

        // 스크롤 진행바
        const progress = document.createElement("div");
        progress.id = "scroll-progress";
        document.body.appendChild(progress);

        // 맨 위로 버튼
        const toTop = document.createElement("button");
        toTop.id = "back-to-top";
        toTop.type = "button";
        toTop.textContent = "↑";
        toTop.setAttribute("aria-label", "맨 위로");
        document.body.appendChild(toTop);
        toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

        // scroll 이벤트 (requestAnimationFrame 으로 스로틀)
        let ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const h = document.documentElement;
                const max = h.scrollHeight - h.clientHeight;
                const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
                progress.style.width = pct + "%";
                toTop.classList.toggle("show", h.scrollTop > 320);
                ticking = false;
            });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        // 코드 복사 (이벤트 위임: 동적으로 생성된 <code> 도 동작)
        document.addEventListener("click", async e => {
            const code = e.target.closest("code");
            if (!code || !code.textContent.trim()) return;
            const ok = await copyText(code.textContent.trim());
            window.OWASP.toast(ok ? "📋 코드가 복사되었습니다" : "복사에 실패했습니다");
        });

        // 키보드 단축키 (keydown)
        document.addEventListener("keydown", e => {
            const tag = (e.target.tagName || "").toLowerCase();
            const typing = tag === "input" || tag === "textarea" || tag === "select";

            if (e.key === "Escape" && document.activeElement) {
                document.activeElement.blur();
                return;
            }
            if (typing) return; // 입력 중에는 문자 단축키 무시

            if (e.key === "t" || e.key === "T") {
                const btn = document.getElementById("themeToggle");
                if (btn) btn.click();
            } else if (e.key === "/") {
                const search = document.querySelector('input[type="search"], #news-search');
                if (search) { e.preventDefault(); search.focus(); }
            } else if (e.key === "?") {
                window.OWASP.toast("단축키: T=테마 · /=검색 · 퀴즈 1~4 선택, Enter 다음 · Esc=해제");
            }
        });
    });
})();

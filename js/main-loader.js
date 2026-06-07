(() => {
    "use strict";

    /** "index.title" 같은 점 경로로 중첩 객체 값을 꺼낸다. */
    function getPath(obj, path) {
        return path.split(".").reduce(
            (acc, key) => (acc == null ? undefined : acc[key]),
            obj
        );
    }

    /** [data-content="경로"] 요소에 값을 textContent로 주입 (XSS 안전) */
    function fillText(data) {
        document.querySelectorAll("[data-content]").forEach(el => {
            const value = getPath(data, el.getAttribute("data-content"));
            if (typeof value === "string") el.textContent = value;
        });
    }

    /** 대시보드 OWASP Top 10 카드 렌더 (#owasp-top10-grid 있을 때만) */
    function renderTop10(list) {
        const grid = document.getElementById("owasp-top10-grid");
        if (!grid || !Array.isArray(list)) return;
        grid.innerHTML = "";

        list.forEach(item => {
            const hasLink = typeof item.link === "string" && item.link.length > 0;
            const card = document.createElement(hasLink ? "a" : "div");
            card.className = "top10-card";
            if (hasLink) card.href = item.link;

            const head = document.createElement("div");
            head.className = "top10-head";

            const rank = document.createElement("span");
            rank.className = "top10-rank";
            rank.textContent = item.rank;
            head.appendChild(rank);

            if (item.isNew) {
                const badge = document.createElement("span");
                badge.className = "top10-badge";
                badge.textContent = "NEW 2025";
                head.appendChild(badge);
            }

            const name = document.createElement("h3");
            name.className = "top10-name";
            name.textContent = item.nameKo;

            const eng = document.createElement("p");
            eng.className = "top10-eng";
            eng.textContent = item.name;

            const summary = document.createElement("p");
            summary.className = "top10-summary";
            summary.textContent = item.summary;

            card.append(head, name, eng, summary);
            grid.appendChild(card);
        });
    }

    function showLoaderError() {
        const bar = document.createElement("div");
        bar.className = "loader-error";
        bar.textContent =
            "⚠️ 콘텐츠 데이터(window.SITE_CONTENT)가 없습니다. HTML에서 data/content-data.js 가 " +
            "js/main-loader.js 보다 먼저 로드되는지 확인하세요.";
        document.body.prepend(bar);
    }

    document.addEventListener("DOMContentLoaded", () => {
        const data = window.SITE_CONTENT;
        if (!data) { showLoaderError(); return; }
        fillText(data);
        renderTop10(data.index && data.index.owaspTop10);
    });
})();

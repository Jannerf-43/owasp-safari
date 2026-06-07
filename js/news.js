(() => {
    "use strict";

    let ALL_NEWS = [];

    /** http/https 링크만 허용 (javascript: 등 위험 스킴 차단) */
    function safeUrl(url) {
        try {
            const u = new URL(url, location.href);
            return (u.protocol === "http:" || u.protocol === "https:") ? u.href : "#";
        } catch (_) {
            return "#";
        }
    }

    /** 뉴스 카드 렌더 (모든 텍스트 textContent → XSS 안전) */
    function render(items) {
        const list = document.getElementById("news-list");
        if (!list) return;
        list.innerHTML = "";

        if (!items.length) {
            const empty = document.createElement("p");
            empty.className = "muted-text";
            empty.textContent = "검색 결과가 없습니다.";
            list.appendChild(empty);
            return;
        }

        items.forEach(n => {
            const card = document.createElement("article");
            card.className = "news-card";

            const cat = document.createElement("span");
            cat.className = "news-cat";
            cat.textContent = n.category;

            const title = document.createElement("h3");
            title.className = "news-title";
            title.textContent = n.title;

            const summary = document.createElement("p");
            summary.className = "news-summary";
            summary.textContent = n.summary;

            const meta = document.createElement("div");
            meta.className = "news-meta";
            meta.textContent = `${n.source} · ${n.date}`;

            const link = document.createElement("a");
            link.className = "news-link";
            link.href = safeUrl(n.url);
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "원문 보기 →";

            card.append(cat, title, summary, meta, link);
            list.appendChild(card);
        });
    }

    /** 검색어 + 분류 필터 (뉴스 전용 페이지) */
    function applyFilter() {
        const searchEl = document.getElementById("news-search");
        const catEl    = document.getElementById("news-category");
        const countEl  = document.getElementById("news-count");

        const q   = (searchEl ? searchEl.value : "").toLowerCase().trim();
        const cat = catEl ? catEl.value : "all";

        const filtered = ALL_NEWS.filter(n => {
            const matchCat = cat === "all" || n.category === cat;
            const haystack = `${n.title} ${n.summary} ${(n.tags || []).join(" ")}`.toLowerCase();
            const matchQ   = !q || haystack.includes(q);
            return matchCat && matchQ;
        });

        render(filtered);
        if (countEl) countEl.textContent = `${filtered.length}건`;
    }

    function buildCategoryOptions() {
        const catEl = document.getElementById("news-category");
        if (!catEl) return;
        [...new Set(ALL_NEWS.map(n => n.category))].forEach(c => {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = c;
            catEl.appendChild(opt);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const list = document.getElementById("news-list");
        if (!list) return;

        ALL_NEWS = window.NEWS_DATA;
        if (!Array.isArray(ALL_NEWS)) {
            list.innerHTML = "";
            const e = document.createElement("p");
            e.className = "muted-text";
            e.textContent = "⚠️ 뉴스 데이터(window.NEWS_DATA)가 없습니다. data/news-data.js 로드를 확인하세요.";
            list.appendChild(e);
            return;
        }

        const searchEl = document.getElementById("news-search");
        if (searchEl) {
            // 뉴스 전용 페이지: 검색/필터
            buildCategoryOptions();
            applyFilter();
            searchEl.addEventListener("input", applyFilter);
            const catEl = document.getElementById("news-category");
            if (catEl) catEl.addEventListener("change", applyFilter);
        } else {
            // 대시보드 미리보기: data-limit 개수만
            const limit = parseInt(list.dataset.limit, 10) || ALL_NEWS.length;
            render(ALL_NEWS.slice(0, limit));
        }
    });
})();

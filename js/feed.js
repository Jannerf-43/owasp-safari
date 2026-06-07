/*
 * 실시간 보안 피드 전광판
 * 주요 JS 활용:
 *  - 클래스(객체): NewsTicker — requestAnimationFrame + transform:translateY 로 부드러운 롤링
 *  - 배열 데이터 처리: sort(날짜) · filter(분류) · reduce(분류별 집계) · map
 *  - DOM 조작: 카드 동적 생성, 첫 요소를 맨 뒤로 보내는 회전으로 무한 루프
 *  - 사용자 이벤트: click(재생/방향) · input(속도) · change(분류) · mouseenter/leave(호버 정지)
 */
(() => {
    "use strict";

    const GAP = 12; // 카드 간격(px) — CSS margin-bottom 과 일치

    /** http/https 링크만 허용 */
    function safeUrl(url) {
        try {
            const u = new URL(url, location.href);
            return (u.protocol === "http:" || u.protocol === "https:") ? u.href : "#";
        } catch (_) { return "#"; }
    }

    // ─── 전광판 클래스 ─────────────────────────────────────────────
    class NewsTicker {
        constructor(viewport, items, opts = {}) {
            this.viewport = viewport;
            this.track = document.createElement("div");
            this.track.className = "ticker-track";
            viewport.innerHTML = "";
            viewport.appendChild(this.track);

            this.items     = items;
            this.speed     = opts.speed ?? 0.6;   // 프레임당 이동 px
            this.direction = opts.direction ?? "up";
            this.offset    = 0;
            this.paused    = false;   // 재생/일시정지 버튼 상태
            this.hovered   = false;   // 마우스 호버 상태
            this.rafId     = null;

            // 호버 시 정지 (mouseenter / mouseleave)
            viewport.addEventListener("mouseenter", () => { this.hovered = true; });
            viewport.addEventListener("mouseleave", () => { this.hovered = false; });

            this.render();
            this.loop = this.loop.bind(this);
            this.rafId = requestAnimationFrame(this.loop);
        }

        /** 뉴스 객체 → 카드 DOM (모든 텍스트 textContent → XSS 안전) */
        createCard(n) {
            const card = document.createElement("article");
            card.className = "ticker-card";

            const cat = document.createElement("span");
            cat.className = "news-cat";
            cat.textContent = n.category;

            const title = document.createElement("h3");
            title.className = "ticker-title";
            title.textContent = n.title;

            const summary = document.createElement("p");
            summary.className = "ticker-summary";
            summary.textContent = n.summary;

            const meta = document.createElement("div");
            meta.className = "news-meta";
            meta.textContent = `${n.source} · ${n.date}`;

            card.append(cat, title, summary, meta);
            // 클릭 시 원문 열기 (호버로 멈춘 상태에서 클릭)
            card.addEventListener("click", () => {
                const url = safeUrl(n.url);
                if (url !== "#") window.open(url, "_blank", "noopener");
            });
            return card;
        }

        render() {
            this.track.innerHTML = "";
            if (!this.items.length) {
                const empty = document.createElement("p");
                empty.className = "muted-text";
                empty.style.padding = "20px";
                empty.textContent = "해당 분류의 뉴스가 없습니다.";
                this.track.appendChild(empty);
            } else {
                this.items.forEach(n => this.track.appendChild(this.createCard(n)));
            }
            this.offset = 0;
            this.track.style.transform = "translateY(0px)";
        }

        loop() {
            const move = !this.paused && !this.hovered && this.items.length > 1;
            if (move) {
                if (this.direction === "up") {
                    this.offset -= this.speed;
                    const first = this.track.firstElementChild;
                    if (first && this.offset <= -(first.offsetHeight + GAP)) {
                        this.offset += first.offsetHeight + GAP;
                        this.track.appendChild(first);     // 첫 요소를 맨 뒤로 (회전)
                    }
                } else {
                    this.offset += this.speed;
                    if (this.offset >= 0) {
                        const last = this.track.lastElementChild;
                        if (last) {
                            this.track.insertBefore(last, this.track.firstElementChild);
                            this.offset -= last.offsetHeight + GAP;
                        }
                    }
                }
                this.track.style.transform = `translateY(${this.offset}px)`;
            }
            this.rafId = requestAnimationFrame(this.loop);
        }

        togglePlay() { this.paused = !this.paused; return this.paused; }
        setSpeed(v)  { this.speed = v; }
        setDirection(d) { this.direction = d; }
        setItems(items) { this.items = items; this.render(); }
    }

    // ─── 분류별 집계 (reduce) → 통계 배지 ─────────────────────────
    function renderStats(items, host) {
        const counts = items.reduce((acc, n) => {
            acc[n.category] = (acc[n.category] || 0) + 1;
            return acc;
        }, {});
        host.innerHTML = "";
        Object.entries(counts).forEach(([cat, cnt]) => {
            const badge = document.createElement("span");
            badge.className = "feed-stat";
            badge.textContent = `${cat} ${cnt}`;
            host.appendChild(badge);
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        const viewport = document.getElementById("ticker-viewport");
        if (!viewport) return;

        if (!Array.isArray(window.NEWS_DATA)) {
            viewport.innerHTML = '<p class="muted-text" style="padding:20px">⚠️ 뉴스 데이터(window.NEWS_DATA)가 없습니다.</p>';
            return;
        }

        // 배열 처리: 날짜 내림차순 정렬
        const sorted = [...window.NEWS_DATA].sort((a, b) => (a.date < b.date ? 1 : -1));

        // 통계 (있을 때만)
        const statsHost = document.getElementById("feed-stats");
        if (statsHost) renderStats(sorted, statsHost);

        // 분류 필터 옵션 (있을 때만, Set 으로 중복 제거)
        const catSel = document.getElementById("feed-category");
        if (catSel) {
            [...new Set(sorted.map(n => n.category))].forEach(c => {
                const opt = document.createElement("option");
                opt.value = c; opt.textContent = c;
                catSel.appendChild(opt);
            });
        }

        const ticker = new NewsTicker(viewport, sorted, { speed: 0.6, direction: "up" });

        // 사용자 이벤트들 (각 컨트롤은 페이지에 있을 때만 연결) ──────────
        const playBtn = document.getElementById("feed-play");
        if (playBtn) {
            const compact = playBtn.hasAttribute("data-compact"); // 인덱스 미니 버튼은 아이콘만
            playBtn.addEventListener("click", () => {
                const paused = ticker.togglePlay();
                playBtn.textContent = compact ? (paused ? "▶" : "⏸")
                                              : (paused ? "▶ 재생" : "⏸ 정지");
            });
        }

        const dirBtn = document.getElementById("feed-direction");
        if (dirBtn) {
            dirBtn.addEventListener("click", () => {
                const next = ticker.direction === "up" ? "down" : "up";
                ticker.setDirection(next);
                dirBtn.textContent = next === "up" ? "⬆ 위로" : "⬇ 아래로";
            });
        }

        const speedEl = document.getElementById("feed-speed");
        if (speedEl) {
            speedEl.addEventListener("input", e => ticker.setSpeed(parseFloat(e.target.value)));
        }

        if (catSel) {
            catSel.addEventListener("change", () => {
                const v = catSel.value;
                const filtered = v === "all" ? sorted : sorted.filter(n => n.category === v);
                ticker.setItems(filtered);
            });
        }
    });
})();

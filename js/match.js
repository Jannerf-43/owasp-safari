/*
 * 취약점 ↔ 방어 대책 드래그 앤 드롭 매칭 게임
 * 사용 이벤트: dragstart · dragend · dragover · dragenter · dragleave · drop (HTML5 DnD)
 *            + click (모바일/접근성 폴백: 카드 탭 → 방어칸 탭)
 */
(() => {
    "use strict";

    let pairs = [];
    let matched = 0;
    let selectedId = null;       // 클릭(탭) 폴백용 선택 상태
    let draggingId = null;

    const $ = id => document.getElementById(id);

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function updateProgress() {
        $("match-progress").textContent = `${matched} / ${pairs.length}`;
        if (matched === pairs.length) {
            if (window.OWASP && window.OWASP.toast) {
                window.OWASP.toast("🎉 모두 맞혔습니다! 완료!");
            }
            $("match-message").textContent = "🏆 완료! 모든 취약점과 방어 대책을 연결했어요.";
        }
    }

    /** 정답 매칭 처리 */
    function tryMatch(vulnId, zone) {
        const zoneId = zone.dataset.id;
        if (zone.classList.contains("matched")) return;

        if (vulnId === zoneId) {
            // 정답
            const card = document.querySelector(`.match-card[data-id="${vulnId}"]`);
            zone.classList.add("matched");
            zone.classList.remove("over");
            const def = pairs.find(p => p.id === zoneId).defense;
            zone.textContent = "✔ " + def;
            if (card) {
                card.classList.add("done");
                card.setAttribute("draggable", "false");
            }
            matched++;
            selectedId = null;
            clearSelection();
            updateProgress();
        } else {
            // 오답 — 흔들림 + 안내
            zone.classList.add("wrong");
            setTimeout(() => zone.classList.remove("wrong"), 500);
            if (window.OWASP && window.OWASP.toast) window.OWASP.toast("❌ 다시 시도해 보세요");
        }
    }

    function clearSelection() {
        document.querySelectorAll(".match-card.selected")
            .forEach(c => c.classList.remove("selected"));
    }

    function build() {
        matched = 0;
        selectedId = null;
        $("match-message").textContent = "";

        const vulnCol = $("match-vulns");
        const defCol  = $("match-defenses");
        vulnCol.innerHTML = "<h2>취약점</h2>";
        defCol.innerHTML  = "<h2>방어 대책</h2>";

        // 취약점 카드 (드래그 가능)
        shuffle(pairs).forEach(p => {
            const card = document.createElement("div");
            card.className = "match-card";
            card.textContent = p.vuln;
            card.dataset.id = p.id;
            card.setAttribute("draggable", "true");

            // 드래그 이벤트
            card.addEventListener("dragstart", e => {
                draggingId = p.id;
                card.classList.add("dragging");
                e.dataTransfer.setData("text/plain", p.id);
                e.dataTransfer.effectAllowed = "move";
            });
            card.addEventListener("dragend", () => {
                draggingId = null;
                card.classList.remove("dragging");
            });

            // 클릭(탭) 폴백 — 카드 선택
            card.addEventListener("click", () => {
                if (card.classList.contains("done")) return;
                clearSelection();
                selectedId = p.id;
                card.classList.add("selected");
            });

            vulnCol.appendChild(card);
        });

        // 방어 대책 드롭 존
        shuffle(pairs).forEach(p => {
            const zone = document.createElement("div");
            zone.className = "drop-zone";
            zone.textContent = p.defense;
            zone.dataset.id = p.id;

            zone.addEventListener("dragover", e => { e.preventDefault(); });
            zone.addEventListener("dragenter", e => {
                e.preventDefault();
                if (!zone.classList.contains("matched")) zone.classList.add("over");
            });
            zone.addEventListener("dragleave", () => zone.classList.remove("over"));
            zone.addEventListener("drop", e => {
                e.preventDefault();
                zone.classList.remove("over");
                const id = e.dataTransfer.getData("text/plain") || draggingId;
                if (id) tryMatch(id, zone);
            });

            // 클릭(탭) 폴백 — 선택된 카드와 매칭
            zone.addEventListener("click", () => {
                if (selectedId) tryMatch(selectedId, zone);
            });

            defCol.appendChild(zone);
        });

        updateProgress();
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (!$("match-board")) return;
        if (!Array.isArray(window.MATCH_DATA)) {
            $("match-message").textContent =
                "⚠️ 데이터(window.MATCH_DATA)가 없습니다. data/match-data.js 로드를 확인하세요.";
            return;
        }
        pairs = window.MATCH_DATA;
        $("match-reset").addEventListener("click", build);
        build();
    });
})();

/*
 * 팀 소개 — team-data.js(window.TEAM_DATA)를 읽어 카드와 프로젝트 패널을 렌더.
 * 배열/객체 데이터 처리 + DOM 조작 demo.
 */
(() => {
    "use strict";

    document.addEventListener("DOMContentLoaded", () => {
        const grid = document.getElementById("team-grid");
        if (!grid) return;

        const data = window.TEAM_DATA;
        if (!data) {
            grid.innerHTML =
                '<p class="muted-text">⚠️ 팀 데이터(window.TEAM_DATA)가 없습니다. data/team-data.js 로드를 확인하세요.</p>';
            return;
        }

        // 멤버 카드 렌더
        grid.innerHTML = "";
        data.members.forEach(m => {
            const card = document.createElement("article");
            card.className = "feature-card team-card";

            const name = document.createElement("h2");
            name.textContent = m.name;

            const role = document.createElement("p");
            role.className = "team-role";
            role.textContent = m.role;

            const ul = document.createElement("ul");
            ul.className = "flow-list";
            m.tasks.forEach(t => {
                const li = document.createElement("li");
                li.textContent = t;
                ul.appendChild(li);
            });

            card.append(name, role, ul);

            // GitHub / 블로그 링크
            const links = document.createElement("div");
            links.className = "team-links";
            if (m.github) {
                const g = document.createElement("a");
                g.className = "team-link";
                g.href = m.github;
                g.target = "_blank";
                g.rel = "noopener noreferrer";
                g.textContent = "GitHub";
                links.appendChild(g);
            }
            if (m.blog) {
                const b = document.createElement("a");
                b.className = "team-link";
                b.href = m.blog;
                b.target = "_blank";
                b.rel = "noopener noreferrer";
                b.textContent = "Blog";
                links.appendChild(b);
            }
            if (links.children.length) card.appendChild(links);

            grid.appendChild(card);
        });

        // 프로젝트 목표
        const goalEl = document.getElementById("project-goal");
        if (goalEl) goalEl.textContent = data.project.goal;

        // 역할 분담 (이름은 strong, 안전하게 textContent)
        const rolesEl = document.getElementById("project-roles");
        if (rolesEl) {
            rolesEl.innerHTML = "";
            data.project.roles.forEach(r => {
                const li = document.createElement("li");
                const strong = document.createElement("strong");
                strong.textContent = r.name;
                li.appendChild(strong);
                li.appendChild(document.createTextNode(" - " + r.desc));
                rolesEl.appendChild(li);
            });
        }

        // 사용 기술
        const techEl = document.getElementById("project-tech");
        if (techEl) {
            techEl.innerHTML = "";
            data.project.tech.forEach(t => {
                const li = document.createElement("li");
                li.textContent = t;
                techEl.appendChild(li);
            });
        }
    });
})();

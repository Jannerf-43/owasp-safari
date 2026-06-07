(() => {
    "use strict";

    // payloads-data.js(window.PAYLOADS)에서 주입 (하드코딩 제거)
    let ROLE_CONFIG = {};

    let accessAttempts = 0;

    function showResult(el, html, color) {
        el.style.color = color || "var(--text-muted)";
        el.innerHTML = html;
    }

    function handleAdminAccess() {
        const roleEl   = document.getElementById("bac-user-role");
        const resultEl = document.getElementById("bac-result");
        if (!roleEl || !resultEl) return;

        const role   = roleEl.value;
        const config = ROLE_CONFIG[role] || ROLE_CONFIG.guest;
        accessAttempts++;

        if (role === "admin") {
            showResult(resultEl,
                `✅ <strong>관리자 기능 접근 성공!</strong><br>
                 역할: <span style="color:var(--point)">${config.label}</span><br><br>
                 <strong>접근 가능한 기능 목록:</strong><br>
                 ${config.allowed.map(f => `✔ ${f}`).join("<br>")}`,
                "var(--point)"
            );
        } else {
            showResult(resultEl,
                `❌ <strong>접근 거부!</strong> 관리자 권한이 필요합니다.<br>
                 현재 역할: <span style="color:${config.color}">${config.label}</span>
                 (권한 레벨 ${config.level} / 필요 레벨 2)<br><br>
                 <div style="border:1px dashed var(--warning);padding:10px;border-radius:8px;background:rgba(255,51,51,0.06);margin-top:8px">
                   ⚠️ <strong>[BAC 취약점 시나리오]</strong><br>
                   서버 측 권한 검사가 없다면, URL을 <code>/admin/dashboard</code>로 직접 변경하거나<br>
                   API 파라미터를 <code>role=admin</code>으로 조작해 접근할 수 있습니다.<br>
                   시도 횟수: <strong>${accessAttempts}</strong>회 (실제 서비스라면 로그에 기록되어야 합니다)
                 </div>`,
                "var(--warning)"
            );
        }
    }

    function handleRoleChange() {
        const roleEl   = document.getElementById("bac-user-role");
        const resultEl = document.getElementById("bac-result");
        if (!roleEl || !resultEl) return;

        const role   = roleEl.value;
        const config = ROLE_CONFIG[role] || ROLE_CONFIG.guest;
        const permissions = config.allowed.length > 0
            ? config.allowed.map(f => `✔ ${f}`).join("<br>")
            : "접근 가능한 기능 없음";

        showResult(resultEl,
            `<strong>현재 역할:</strong> <span style="color:${config.color}">${config.label}</span>
             (권한 레벨: ${config.level})<br><br>
             <strong>허용된 기능:</strong><br>${permissions}`,
            config.color
        );
    }

    document.addEventListener("DOMContentLoaded", async () => {
        const button = document.getElementById("bac-admin-button");
        const roleEl = document.getElementById("bac-user-role");
        const resultEl = document.getElementById("bac-result");
        if (!button || !roleEl) return;

        try {
            ROLE_CONFIG = (await window.OWASP.loadPayloads()).bac.roles;
        } catch (err) {
            console.error("[bac] payloads 로드 실패:", err);
            if (resultEl) {
                resultEl.style.color = "#ffaa00";
                resultEl.innerHTML = "⚠️ 실습 데이터를 불러오지 못했습니다. 로컬 서버로 실행하세요.";
            }
            return;
        }

        button.addEventListener("click", handleAdminAccess);
        roleEl.addEventListener("change", handleRoleChange);
        handleRoleChange(); // 초기 권한 상태 표시
    });
})();

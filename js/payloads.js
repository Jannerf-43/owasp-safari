(() => {
    "use strict";
    window.OWASP = window.OWASP || {};

    /** window.PAYLOADS(데이터 전역)를 반환. data/payloads-data.js가 먼저 로드돼 있어야 함. */
    window.OWASP.loadPayloads = async function loadPayloads() {
        if (window.PAYLOADS) return window.PAYLOADS;
        throw new Error("PAYLOADS 데이터가 없습니다. data/payloads-data.js 로드를 확인하세요.");
    };
})();

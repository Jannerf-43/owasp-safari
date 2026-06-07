(() => {
    "use strict";

    /**
     * Web Crypto API로 SHA-256 해시 생성
     * @param {string} message
     * @returns {Promise<string>} hex string
     */
    async function sha256(message) {
        const encoder = new TextEncoder();
        const data    = encoder.encode(message);
        const hashBuf = await crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(hashBuf))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    /**
     * MD5 시뮬레이션 (교육용 — 실제 MD5 아님)
     * 실제 MD5는 브라우저 표준 API에 없으므로
     * 짧고 충돌 가능성을 보여주는 약한 해시로 대체
     * @param {string} str
     * @returns {string}
     */
    function weakHashSimulate(str) {
        let h = 0x811c9dc5;
        for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h  = (h * 0x01000193) >>> 0;
        }
        // 8자리 hex — 짧아서 충돌 위험을 시각적으로 드러냄
        return h.toString(16).padStart(8, "0");
    }

    /**
     * 평문 비밀번호를 여러 방식으로 변환해 비교 출력
     * @param {string} plaintext
     * @param {HTMLElement} resultEl
     */
    async function showCryptoComparison(plaintext, resultEl) {
        resultEl.style.color = "var(--text-muted)";
        resultEl.innerHTML   = "🔄 해시 계산 중...";

        const sha256Hash = await sha256(plaintext);
        const weakHash   = weakHashSimulate(plaintext);
        const plain      = plaintext; // 평문 저장 (최악의 경우)

        resultEl.style.color = "var(--text-main)";
        resultEl.innerHTML = `
<div style="display:flex;flex-direction:column;gap:14px">

  <!-- 평문 저장 (최악) -->
  <div style="border:1px solid var(--warning);border-radius:12px;padding:14px;background:rgba(255,51,51,0.07)">
    <div style="color:var(--warning);font-weight:800;margin-bottom:6px">
      ❌ 평문 저장 (최악)
    </div>
    <code style="color:var(--warning);word-break:break-all">${escapeHtml(plain)}</code>
    <div style="color:var(--text-muted);font-size:13px;margin-top:6px">
      DB가 유출되면 비밀번호가 그대로 노출됩니다. 절대 사용하지 마세요.
    </div>
  </div>

  <!-- 취약한 해시 (위험) -->
  <div style="border:1px solid #ff7700;border-radius:12px;padding:14px;background:rgba(255,119,0,0.07)">
    <div style="color:#ff7700;font-weight:800;margin-bottom:6px">
      ⚠️ 취약한 해시 (위험) — MD5 시뮬레이션
    </div>
    <code style="color:#ff7700;word-break:break-all">${weakHash}</code>
    <div style="color:var(--text-muted);font-size:13px;margin-top:6px">
      8자리(32bit) 해시 — 충돌 위험, 레인보우 테이블로 역추적 가능합니다.
    </div>
  </div>

  <!-- SHA-256 (개선) -->
  <div style="border:1px solid #ffaa00;border-radius:12px;padding:14px;background:rgba(255,170,0,0.07)">
    <div style="color:#ffaa00;font-weight:800;margin-bottom:6px">
      🟡 SHA-256 단독 사용 (개선 필요)
    </div>
    <code style="color:#ffaa00;word-break:break-all">${sha256Hash}</code>
    <div style="color:var(--text-muted);font-size:13px;margin-top:6px">
      MD5보다 강하지만, Salt 없이 사용하면 동일 비밀번호가 동일 해시를 가집니다.
    </div>
  </div>

  <!-- bcrypt + Salt 권장 -->
  <div style="border:1px solid var(--point);border-radius:12px;padding:14px;background:rgba(0,255,102,0.07)">
    <div style="color:var(--point);font-weight:800;margin-bottom:6px">
      ✅ bcrypt + Salt (권장)
    </div>
    <code style="color:var(--point);word-break:break-all">
      $2b$12$[랜덤Salt16자]${sha256Hash.slice(0, 24)}...
    </code>
    <div style="color:var(--text-muted);font-size:13px;margin-top:6px">
      매번 다른 Salt가 붙어 동일 비밀번호도 다른 해시가 됩니다. 레인보우 테이블 무력화.
    </div>
  </div>

</div>
<div style="margin-top:14px;color:var(--text-muted);font-size:13px">
  입력값: <strong style="color:var(--text-main)">${escapeHtml(plaintext)}</strong>
  (${plaintext.length}자)
</div>`;
    }

    /** HTML 이스케이프 */
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    document.addEventListener("DOMContentLoaded", () => {
        const button  = document.getElementById("crypto-hash-button");
        const inputEl = document.getElementById("crypto-plain-input");
        const resultEl = document.getElementById("crypto-result");

        if (!button || !inputEl || !resultEl) return;

        button.addEventListener("click", () => {
            const val = inputEl.value.trim();
            if (!val) {
                resultEl.style.color = "#ffaa00";
                resultEl.innerHTML = "⚠️ 평문을 입력하세요.";
                return;
            }
            showCryptoComparison(val, resultEl);
        });

        inputEl.addEventListener("keydown", e => {
            if (e.key === "Enter") button.click();
        });
    });
})();

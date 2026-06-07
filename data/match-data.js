// 드래그 앤 드롭 매칭 게임 데이터 (취약점 ↔ 방어 대책)
window.MATCH_DATA = [
  { "id": "sqli",   "vuln": "SQL Injection",      "defense": "Prepared Statement (매개변수 바인딩)" },
  { "id": "xss",    "vuln": "XSS",                "defense": "출력 시 HTML 이스케이프 / CSP 적용" },
  { "id": "bac",    "vuln": "취약한 접근 제어",    "defense": "서버 측 권한 검사 (기본 차단)" },
  { "id": "crypto", "vuln": "암호화 오류",        "defense": "bcrypt + Salt 단방향 해시 저장" },
  { "id": "ssrf",   "vuln": "SSRF",               "defense": "허용 도메인 목록 + 내부 IP 차단" },
  { "id": "auth",   "vuln": "취약한 인증",        "defense": "다중 인증(MFA) + 로그인 시도 제한" }
];

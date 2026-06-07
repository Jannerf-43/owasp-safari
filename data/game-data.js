// 공격 탐지 게임 샘플 (malicious: true=공격, false=정상)
window.GAME_DATA = [
  { "text": "' OR '1'='1",                              "malicious": true,  "type": "SQL Injection" },
  { "text": "admin'--",                                 "malicious": true,  "type": "SQL Injection" },
  { "text": "UNION SELECT username, password FROM users","malicious": true, "type": "SQL Injection" },
  { "text": "<script>alert(document.cookie)</script>",  "malicious": true,  "type": "XSS" },
  { "text": "<img src=x onerror=alert(1)>",             "malicious": true,  "type": "XSS" },
  { "text": "javascript:alert(1)",                      "malicious": true,  "type": "XSS" },
  { "text": "http://169.254.169.254/latest/meta-data/", "malicious": true,  "type": "SSRF" },
  { "text": "http://localhost:8080/admin",              "malicious": true,  "type": "SSRF" },
  { "text": "../../../../etc/passwd",                   "malicious": true,  "type": "Path Traversal" },
  { "text": "hong@example.com",                         "malicious": false, "type": "이메일 주소" },
  { "text": "안녕하세요, 좋은 글 감사합니다!",            "malicious": false, "type": "일반 댓글" },
  { "text": "https://cdn.example.com/banner.png",       "malicious": false, "type": "정상 이미지 URL" },
  { "text": "P@ssw0rd!2025",                            "malicious": false, "type": "강한 비밀번호" },
  { "text": "010-1234-5678",                            "malicious": false, "type": "전화번호" },
  { "text": "서울특별시 강남구 테헤란로 123",            "malicious": false, "type": "주소" },
  { "text": "오늘 발표 자료 정리했습니다",               "malicious": false, "type": "일반 댓글" }
];

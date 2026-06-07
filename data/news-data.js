// 보안 뉴스 — 사이트의 6개 OWASP 주제에 맞춘 6개 (교육용 샘플)
// script 태그로 로드되므로 file:// 더블클릭에서도 작동합니다.
window.NEWS_DATA = [
  {
    "id": 1,
    "title": "약한 비밀번호·세션 관리 미흡으로 대규모 계정 탈취",
    "summary": "재사용 비밀번호와 로그인 시도 제한 부재가 겹쳐 크리덴셜 스터핑 피해가 커졌습니다. MFA와 잠금 정책의 중요성이 강조됩니다.",
    "category": "취약한 인증",
    "tags": ["auth", "mfa", "비밀번호", "세션"],
    "source": "Identity Now",
    "date": "2026-01-12",
    "url": "https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/"
  },
  {
    "id": 2,
    "title": "구형 ORM 설정에서 SQL Injection 자동화 공격 재유행",
    "summary": "Prepared Statement를 우회하는 동적 쿼리 조합 패턴이 레거시 서비스에서 다시 악용되고 있습니다.",
    "category": "Injection",
    "tags": ["sql", "injection", "orm", "prepared-statement"],
    "source": "Threat Watch",
    "date": "2026-01-10",
    "url": "https://owasp.org/Top10/2025/A05_2025-Injection/"
  },
  {
    "id": 3,
    "title": "CSP 미적용 게시판 노린 저장형 XSS로 세션 쿠키 탈취",
    "summary": "댓글·프로필 입력값을 이스케이프하지 않은 페이지에서 스크립트가 실행되는 전형적인 저장형 XSS가 보고되었습니다.",
    "category": "XSS",
    "tags": ["xss", "csp", "쿠키", "이스케이프"],
    "source": "WebSec Times",
    "date": "2026-01-08",
    "url": "https://owasp.org/Top10/2025/A05_2025-Injection/"
  },
  {
    "id": 4,
    "title": "접근 제어 실패, OWASP 2025에서도 1위 위험으로 집계",
    "summary": "175,000건 이상의 CVE 분석 결과 Broken Access Control이 가장 빈번한 위험으로 재차 1위를 차지했습니다.",
    "category": "접근 제어",
    "tags": ["bac", "권한", "idor", "서버검증"],
    "source": "AppSec Daily",
    "date": "2026-01-06",
    "url": "https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/"
  },
  {
    "id": 5,
    "title": "평문 저장 비밀번호 DB 유출 — 해시·Salt 미적용 책임론",
    "summary": "유출 사고 조사에서 비밀번호가 평문 또는 약한 해시로 저장되어 있던 것으로 드러났습니다. bcrypt 등 강한 해시가 권장됩니다.",
    "category": "암호화 오류",
    "tags": ["crypto", "hash", "salt", "bcrypt"],
    "source": "Breach Brief",
    "date": "2026-01-04",
    "url": "https://owasp.org/Top10/2025/A04_2025-Cryptographic_Failures/"
  },
  {
    "id": 6,
    "title": "클라우드 메타데이터 노린 SSRF, 2025부터 접근 제어로 통합",
    "summary": "169.254.169.254 같은 메타데이터 엔드포인트를 겨냥한 SSRF가 계속 보고되며, 2025 분류에서는 Broken Access Control에 통합되었습니다.",
    "category": "SSRF",
    "tags": ["ssrf", "cloud", "metadata", "내부망"],
    "source": "Cloud Sec Wire",
    "date": "2026-01-02",
    "url": "https://owasp.org/Top10/2025/A01_2025-Broken_Access_Control/"
  }
];

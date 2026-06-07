// 사이트 전역 콘텐츠 (script 태그로 로드 → file://·서버·Vercel 모두 작동)
window.SITE_CONTENT = {
  "meta": {
    "siteName": "OWASP Safari",
    "footer": "OWASP Safari Project · Educational Purpose Only"
  },
  "index": {
    "eyebrow": "Cyber Security Learning · 2025",
    "title": "OWASP Top 10 : 2025 웹 취약점 학습 대시보드",
    "description": "OWASP가 2025년에 갱신한 최신 웹 애플리케이션 보안 위험 10가지를 한눈에 보고, 개념 학습 → 모의 실습 → 퀴즈까지 안전한 환경에서 체험하는 교육용 프로젝트입니다.",
    "top10Heading": "OWASP Top 10 : 2025",
    "top10Note": "2025년 11월 발표, 2026년 1월 최종 릴리스 기준. 공급망 실패와 예외 처리 미흡이 신규 진입했고, SSRF는 접근 제어로 통합되었습니다.",
    "newsHeading": "최신 보안 뉴스",
    "newsNote": "큐레이션된 보안 동향입니다. 전체 보기와 검색은 뉴스 페이지에서 가능합니다.",
    "feedHeading": "실시간 보안 피드",
    "owaspTop10": [
      {
        "rank": "A01",
        "name": "Broken Access Control",
        "nameKo": "취약한 접근 제어",
        "summary": "권한 확인 부재로 다른 사용자의 데이터·기능에 접근. 2025년에 SSRF가 이 항목으로 통합되었습니다.",
        "isNew": false,
        "link": "vuln-bac.html"
      },
      {
        "rank": "A02",
        "name": "Security Misconfiguration",
        "nameKo": "보안 설정 오류",
        "summary": "기본 계정, 불필요한 기능 활성화, 잘못된 클라우드 설정 등 설정 단계의 허점입니다.",
        "isNew": false,
        "link": "owasp-intro.html"
      },
      {
        "rank": "A03",
        "name": "Software Supply Chain Failures",
        "nameKo": "소프트웨어 공급망 실패",
        "summary": "서드파티 의존성·빌드·배포 과정의 변조나 취약점. 2025년 신규 항목입니다.",
        "isNew": true,
        "link": "owasp-intro.html"
      },
      {
        "rank": "A04",
        "name": "Cryptographic Failures",
        "nameKo": "암호화 오류",
        "summary": "평문 저장, 약한 해시, 부적절한 키 관리로 민감정보가 유출됩니다.",
        "isNew": false,
        "link": "vuln-crypto.html"
      },
      {
        "rank": "A05",
        "name": "Injection",
        "nameKo": "인젝션",
        "summary": "검증되지 않은 입력이 쿼리·명령으로 처리됩니다. XSS도 이 범주에 포함됩니다.",
        "isNew": false,
        "link": "vuln-injection.html"
      },
      {
        "rank": "A06",
        "name": "Insecure Design",
        "nameKo": "안전하지 않은 설계",
        "summary": "구현이 아닌 설계 단계의 결함. 위협 모델링과 보안 설계 패턴이 필요합니다.",
        "isNew": false,
        "link": "owasp-intro.html"
      },
      {
        "rank": "A07",
        "name": "Authentication Failures",
        "nameKo": "인증 실패",
        "summary": "약한 비밀번호, 세션 관리 미흡, 무차별 대입 방어 부재 등입니다.",
        "isNew": false,
        "link": "vuln-broken-auth.html"
      },
      {
        "rank": "A08",
        "name": "Software or Data Integrity Failures",
        "nameKo": "소프트웨어·데이터 무결성 실패",
        "summary": "검증 없는 업데이트·역직렬화로 무결성이 깨집니다.",
        "isNew": false,
        "link": "owasp-intro.html"
      },
      {
        "rank": "A09",
        "name": "Security Logging & Alerting Failures",
        "nameKo": "보안 로깅·알림 실패",
        "summary": "탐지·대응에 필요한 로깅과 알림이 부족해 침해를 놓칩니다. 2025년 명칭이 변경되었습니다.",
        "isNew": false,
        "link": "owasp-intro.html"
      },
      {
        "rank": "A10",
        "name": "Mishandling of Exceptional Conditions",
        "nameKo": "예외 상황 처리 미흡",
        "summary": "잘못된 오류 처리, 페일 오픈, 논리 오류. 2025년 신규 항목입니다.",
        "isNew": true,
        "link": "owasp-intro.html"
      }
    ]
  },
  "news": {
    "eyebrow": "Security Feed",
    "title": "보안 뉴스 큐레이션",
    "description": "키워드 검색과 분류 필터로 관심 있는 보안 동향을 빠르게 찾아보세요. (교육용 샘플 데이터)"
  },
  "feed": {
    "eyebrow": "Live Board",
    "title": "실시간 보안 피드 전광판",
    "description": "조원들이 준비한 보안 뉴스 데이터를 전광판처럼 부드럽게 흘려보냅니다. 마우스를 올리면 멈추고, 속도·방향·분류를 직접 조절할 수 있어요."
  },
  "quiz": {
    "eyebrow": "Knowledge Check",
    "title": "OWASP 실습 퀴즈",
    "description": "지금까지 학습한 취약점 개념을 문제로 점검합니다. 데이터는 quiz-data.js에서 동적으로 불러옵니다."
  },
  "match": {
    "eyebrow": "Drag & Drop",
    "title": "취약점 ↔ 방어 대책 매칭",
    "description": "왼쪽 취약점 카드를 오른쪽의 알맞은 방어 대책으로 끌어다 놓으세요. (모바일은 카드를 탭한 뒤 방어 대책을 탭하면 됩니다.)"
  },
  "games": {
    "eyebrow": "Games",
    "title": "OWASP 게임",
    "description": "보안 개념을 게임으로 익혀보세요. 퀴즈 · 매칭 · 공격 탐지 세 가지를 준비했습니다."
  },
  "game": {
    "eyebrow": "Threat Spotter",
    "title": "공격 탐지 게임",
    "description": "제한 시간 안에 화면의 입력이 '공격'인지 '정상'인지 빠르게 판별하세요. 키보드 ← (공격) / → (정상) 도 됩니다."
  }
};

// OWASP 퀴즈 데이터 (script 태그 로드 → file://에서도 작동)
// type: "choice"(객관식) | "input"(입력 매칭형)
// difficulty: "easy" | "medium" | "hard"
window.QUIZ_DATA = {
  "title": "OWASP Top 10 점검 퀴즈",
  "questions": [
    {
      "id": "q1",
      "type": "choice",
      "difficulty": "easy",
      "category": "동향",
      "points": 10,
      "question": "OWASP Top 10 : 2025에서 1위로 집계된 취약점은?",
      "options": ["인젝션", "취약한 접근 제어(Broken Access Control)", "암호화 오류", "보안 설정 오류"],
      "answer": 1,
      "explanation": "접근 제어 실패는 2021에 이어 2025에서도 1위를 유지했고, SSRF가 이 범주로 통합되었습니다."
    },
    {
      "id": "q2",
      "type": "input",
      "difficulty": "hard",
      "category": "Injection",
      "points": 20,
      "question": "취약한 로그인 폼에서 인증을 우회할 수 있는 SQL Injection 입력을 작성하세요.",
      "placeholder": "예: ' OR '1'='1",
      "accept": ["' or '1'='1", "' or 1=1", "or 1=1", "1=1", "admin'--", "' or ''='", "--", "' or true"],
      "explanation": "조건절을 항상 참으로 만드는 입력(' OR '1'='1 등)이 그대로 쿼리에 결합되면 인증이 우회됩니다. Prepared Statement로 막을 수 있습니다."
    },
    {
      "id": "q3",
      "type": "choice",
      "difficulty": "medium",
      "category": "Injection",
      "points": 15,
      "question": "SQL Injection을 가장 근본적으로 막는 방법은?",
      "options": ["입력값을 문자열로 그대로 결합", "Prepared Statement(매개변수 바인딩) 사용", "에러 메시지 숨기기", "비밀번호를 길게 설정"],
      "answer": 1,
      "explanation": "Prepared Statement는 입력값을 데이터로만 처리해 쿼리 구조 변경을 막습니다."
    },
    {
      "id": "q4",
      "type": "input",
      "difficulty": "hard",
      "category": "XSS",
      "points": 20,
      "question": "댓글로 스크립트를 실행시키는 XSS 입력의 일부를 작성하세요.",
      "placeholder": "예: <script>alert(1)</script>",
      "accept": ["<script", "onerror=", "onload=", "javascript:", "<img", "<svg", "alert(", "<iframe"],
      "explanation": "<script>나 onerror= 같은 패턴이 이스케이프 없이 출력되면 브라우저가 스크립트로 해석합니다. 출력 시 HTML 이스케이프로 막습니다."
    },
    {
      "id": "q5",
      "type": "choice",
      "difficulty": "easy",
      "category": "XSS",
      "points": 10,
      "question": "저장형 XSS를 막는 가장 직접적인 출력 처리 방법은?",
      "options": ["innerHTML로 그대로 출력", "출력 시 HTML 이스케이프 / textContent 사용", "입력을 그대로 DB에 저장", "쿠키를 자주 삭제"],
      "answer": 1,
      "explanation": "출력 위치에 맞는 인코딩(이스케이프)과 textContent 사용, CSP가 핵심 방어책입니다."
    },
    {
      "id": "q6",
      "type": "input",
      "difficulty": "hard",
      "category": "SSRF",
      "points": 20,
      "question": "서버가 내부 클라우드 메타데이터에 접근하게 만드는 URL을 작성하세요.",
      "placeholder": "예: http://169.254.169.254/...",
      "accept": ["169.254.169.254", "localhost", "127.0.0.1", "metadata.google.internal", "0.0.0.0", "192.168."],
      "explanation": "169.254.169.254(메타데이터)나 localhost 같은 내부 주소로 서버 요청을 유도하는 것이 SSRF입니다. 허용 도메인 목록과 내부 IP 차단으로 막습니다."
    },
    {
      "id": "q7",
      "type": "choice",
      "difficulty": "easy",
      "category": "취약한 인증",
      "points": 10,
      "question": "무차별 대입(brute force) 공격을 줄이는 직접적인 대책이 아닌 것은?",
      "options": ["로그인 실패 횟수 제한", "다중 인증(MFA)", "평문 비밀번호 저장", "계정 잠금 정책"],
      "answer": 2,
      "explanation": "평문 저장은 오히려 유출 피해를 키웁니다. 비밀번호는 Salt를 곁들인 단방향 해시로 저장해야 합니다."
    },
    {
      "id": "q8",
      "type": "choice",
      "difficulty": "medium",
      "category": "암호화 오류",
      "points": 15,
      "question": "비밀번호 저장 방식 중 가장 권장되는 것은?",
      "options": ["평문 저장", "MD5 단독", "SHA-256 단독", "bcrypt 등 Salt가 포함된 해시"],
      "answer": 3,
      "explanation": "bcrypt/argon2처럼 Salt가 매번 달라지는 느린 해시가 레인보우 테이블 공격을 무력화합니다."
    },
    {
      "id": "q9",
      "type": "choice",
      "difficulty": "medium",
      "category": "접근 제어",
      "points": 15,
      "question": "접근 제어(권한 검사)는 어디에서 수행해야 안전한가요?",
      "options": ["클라이언트(브라우저)에서만", "서버 측에서", "URL 주석으로", "CSS로"],
      "answer": 1,
      "explanation": "권한 검사는 반드시 서버 측에서 하며, 기본 차단(deny by default) 정책이 권장됩니다."
    }
  ]
};

// 실습용 페이로드/데이터 사전 (교육용 시뮬레이션)
window.PAYLOADS = {
  "_comment": "각 실습 페이지의 시뮬레이션 데이터. 전부 교육용 데모이며 실제 공격을 수행하지 않습니다.",
  "injection": {
    "triggers": [
      "' or '1'='1",
      "' or 1=1",
      "or '1'='1",
      "' or ''='",
      "1=1",
      "' --",
      "'--",
      "--",
      "' #",
      "admin'--",
      "admin' --",
      "' or 'x'='x",
      "union select",
      "drop table",
      "' or true"
    ],
    "fakeDb": [
      {
        "username": "admin",
        "password": "SuperSecret!99",
        "role": "admin"
      },
      {
        "username": "alice",
        "password": "alice1234",
        "role": "user"
      },
      {
        "username": "bob",
        "password": "bobpass",
        "role": "user"
      },
      {
        "username": "charlie",
        "password": "ch@rlie!",
        "role": "user"
      }
    ]
  },
  "xss": {
    "patterns": [
      "<script",
      "</script>",
      "javascript:",
      "onerror=",
      "onload=",
      "onclick=",
      "onmouseover=",
      "alert(",
      "document.cookie",
      "eval(",
      "<img",
      "<iframe",
      "<svg",
      "src=http",
      "data:text/html"
    ]
  },
  "ssrf": {
    "internalPatterns": [
      {
        "pattern": "^https?://localhost",
        "flags": "i",
        "label": "localhost",
        "risk": "critical"
      },
      {
        "pattern": "^https?://127\\.",
        "flags": "",
        "label": "루프백 (127.x.x.x)",
        "risk": "critical"
      },
      {
        "pattern": "^https?://0\\.0\\.0\\.0",
        "flags": "",
        "label": "0.0.0.0",
        "risk": "critical"
      },
      {
        "pattern": "^https?://10\\.",
        "flags": "",
        "label": "내부망 (10.x.x.x)",
        "risk": "high"
      },
      {
        "pattern": "^https?://192\\.168\\.",
        "flags": "",
        "label": "내부망 (192.168.x.x)",
        "risk": "high"
      },
      {
        "pattern": "^https?://172\\.(1[6-9]|2\\d|3[01])\\.",
        "flags": "",
        "label": "내부망 (172.16~31.x)",
        "risk": "high"
      },
      {
        "pattern": "^https?://169\\.254\\.",
        "flags": "",
        "label": "링크-로컬 (169.254.x.x)",
        "risk": "critical"
      },
      {
        "pattern": "^https?://metadata\\.google\\.internal",
        "flags": "i",
        "label": "GCP 메타데이터 서버",
        "risk": "critical"
      },
      {
        "pattern": "file://",
        "flags": "i",
        "label": "파일 스키마 (file://)",
        "risk": "critical"
      },
      {
        "pattern": "dict://",
        "flags": "i",
        "label": "DICT 프로토콜",
        "risk": "critical"
      },
      {
        "pattern": "gopher://",
        "flags": "i",
        "label": "Gopher 프로토콜",
        "risk": "critical"
      },
      {
        "pattern": "^ftp://",
        "flags": "i",
        "label": "FTP 스키마",
        "risk": "high"
      }
    ],
    "allowlist": [
      "example.com",
      "cdn.example.com",
      "images.example.com",
      "api.example.com"
    ],
    "presets": [
      {
        "label": "내부 IP",
        "value": "http://192.168.1.1/admin"
      },
      {
        "label": "localhost",
        "value": "http://localhost:6379"
      },
      {
        "label": "AWS 메타데이터",
        "value": "http://169.254.169.254/latest/meta-data/"
      },
      {
        "label": "안전한 도메인",
        "value": "https://cdn.example.com/image.png"
      }
    ]
  },
  "bac": {
    "roles": {
      "guest": {
        "label": "게스트",
        "level": 0,
        "allowed": [],
        "color": "var(--text-muted)"
      },
      "user": {
        "label": "일반 사용자",
        "level": 1,
        "allowed": [
          "내 프로필 보기",
          "게시글 작성",
          "댓글 달기"
        ],
        "color": "#4db8ff"
      },
      "admin": {
        "label": "관리자",
        "level": 2,
        "allowed": [
          "내 프로필 보기",
          "게시글 작성",
          "댓글 달기",
          "사용자 관리",
          "DB 조회",
          "서버 설정"
        ],
        "color": "var(--point)"
      }
    }
  },
  "brokenAuth": {
    "maxAttempts": 5,
    "lockoutMs": 30000,
    "weakPasswords": [
      "password",
      "123456",
      "password123",
      "admin",
      "qwerty",
      "abc123",
      "letmein",
      "12345678",
      "1234567890",
      "iloveyou"
    ]
  }
};

// 팀 소개 데이터 (script 태그 로드 → file://에서도 작동)
// github / blog 는 임시 링크 (추후 각자 본인 링크로 교체)
window.TEAM_DATA = {
  members: [
    {
      name: '안태규',
      role: 'Front-End Developer',
      tasks: [
        'JavaScript 기능 구현',
        'XSS 체험 페이지 개발',
        'SQL Injection 시뮬레이터 구현',
        '다크/화이트 모드 구현',
        '사용자 인터랙션 기능 담당',
      ],
      github: 'https://github.com/anty9915-sudo',
      blog: 'https://blog.naver.com/anty9951',
    },
    {
      name: '이승준',
      role: 'UI / UX Designer',
      tasks: [
        'HTML/CSS 레이아웃 설계',
        '반응형 웹 구현',
        '메인 페이지 디자인',
        '공통 UI 구성',
      ],
      github: 'https://naver.com',
      blog: 'https://google.com',
    },
    {
      name: '손유승',
      role: 'JavaScript Developer',
      tasks: [
        '실시간 피드 기능',
        '취약점 게임 시나리오 3가지 구현',
        '뉴스·퀴즈·게임 데이터 세트 설계',
        '퀴즈 점수·최고기록 시스템 구현',
      ],
      github: 'https://github.com/Jannerf-43/Son_Portfolio',
      blog: 'https://son-portfolio-green.vercel.app/index.html',
    },
  ],
  project: {
    goal: 'OWASP Top 10 웹 취약점을 소개하고, 취약점의 동작 원리와 대응 방안을 학습할 수 있는 교육용 웹사이트를 제작하는 것이 목표입니다.',
    roles: [
      { name: '안태규', desc: 'JavaScript 기능 구현 및 UI 인터랙션' },
      { name: '이승준', desc: 'HTML/CSS 및 UI 디자인' },
      { name: '손유승', desc: '콘텐츠 조사 및 백엔드 설계' },
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Git / GitHub', 'Vercel'],
  },
}

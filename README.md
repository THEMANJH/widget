# 🥠 포춘쿠키 위젯 SaaS

블로그와 웹사이트에 쉽게 추가할 수 있는 한국어 포춘쿠키 위젯 서비스입니다.

## 🚀 주요 기능

- **간편한 설치**: 한 줄의 코드로 어떤 웹사이트든 설치 가능
- **구독 기반 서비스**: Free/Pro/Premium 플랜 제공
- **API 키 인증**: 사용량 추적 및 제한 관리
- **사용자 대시보드**: 실시간 사용량 모니터링
- **반응형 디자인**: 모든 기기에서 완벽 작동

## 📁 프로젝트 구조

```
├── api/
│   ├── cookie.js              # 메인 포춘쿠키 API (인증 포함)
│   ├── auth/
│   │   ├── signup.js          # 회원가입 API
│   │   └── login.js           # 로그인 API
│   └── dashboard/
│       └── keys.js            # API 키 관리 API
├── lib/
│   ├── supabase.js           # Supabase 클라이언트 설정
│   └── auth.js               # 인증 및 사용량 관리 로직
├── public/
│   ├── index.html            # 랜딩 페이지
│   ├── dashboard.html        # 사용자 대시보드
│   ├── loader.js             # 위젯 로더 (API 키 인증)
│   └── widject.css           # 위젯 스타일
├── supabase/
│   └── schema.sql            # 데이터베이스 스키마
├── fortunes.json             # 포춘쿠키 메시지 데이터
└── package.json
```

## 🛠️ 설치 및 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. Supabase 설정
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. `supabase/schema.sql` 파일의 내용을 SQL 에디터에서 실행
3. `.env` 파일 생성 후 환경 변수 설정:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DOMAIN=https://your-domain.com
```

### 3. Vercel 배포
```bash
npm run deploy
```

## 💰 요금제

| 플랜 | 가격 | 월간 요청 수 | 기능 |
|------|------|-------------|------|
| Free | ₩0 | 1,000회 | 기본 메시지, 커뮤니티 지원 |
| Pro | ₩9,900 | 10,000회 | 커스텀 메시지, 5가지 테마, 이메일 지원 |
| Premium | ₩19,900 | 100,000회 | 무제한 커스텀, 무제한 테마, 우선 지원 |

## 🔧 사용 방법

### 1. 회원가입
랜딩 페이지에서 원하는 플랜을 선택하고 회원가입

### 2. API 키 발급
대시보드에서 API 키 생성

### 3. 위젯 설치
아래 코드를 웹사이트에 추가:

```html
<script>
(function() {
  const script = document.createElement('script');
  script.src = 'https://your-domain.vercel.app/public/loader.js';
  script.setAttribute('data-api-key', 'YOUR_API_KEY_HERE');
  document.head.appendChild(script);
})();
</script>
```

## 🎯 API 엔드포인트

### 포춘쿠키 API
```
GET /api/cookie
Headers: X-API-Key: your_api_key
```

### 인증 API
```
POST /api/auth/signup    # 회원가입
POST /api/auth/login     # 로그인
```

### 대시보드 API
```
GET /api/dashboard/keys     # API 키 목록
POST /api/dashboard/keys    # API 키 생성
DELETE /api/dashboard/keys  # API 키 삭제
```

## 🔒 보안 기능

- JWT 기반 사용자 인증
- API 키 해시 저장
- Row Level Security (RLS) 적용
- CORS 설정
- 사용량 제한 및 추적

## 📊 데이터베이스 스키마

- `profiles`: 사용자 프로필
- `subscription_plans`: 구독 플랜 정보
- `user_subscriptions`: 사용자 구독 상태
- `api_keys`: API 키 관리
- `usage_logs`: 사용량 추적

## 🚀 향후 계획

- [ ] 결제 시스템 연동 (Stripe)
- [ ] 커스텀 메시지 기능
- [ ] 다양한 테마 옵션
- [ ] 사용량 분석 대시보드
- [ ] 웹훅 지원
- [ ] 다국어 지원

## 📝 라이선스

MIT License
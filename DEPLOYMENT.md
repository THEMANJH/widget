# 🚀 배포 가이드

## 1. Supabase 프로젝트 설정

### 1-1. Supabase 계정 생성 및 프로젝트 생성
1. [Supabase](https://supabase.com) 접속
2. "Start your project" 클릭
3. 새 프로젝트 생성 (이름: fortune-cookie-widget)
4. 데이터베이스 비밀번호 설정

### 1-2. 데이터베이스 스키마 적용
1. Supabase 대시보드 → SQL Editor
2. `supabase/schema.sql` 파일 내용 전체 복사
3. SQL Editor에 붙여넣기 후 실행 (Run)

### 1-3. API 키 확인
1. Supabase 대시보드 → Settings → API
2. 다음 값들 복사해두기:
   - Project URL
   - anon public key
   - service_role key (secret)

## 2. Vercel 배포

### 2-1. Vercel 계정 생성
1. [Vercel](https://vercel.com) 접속
2. GitHub 계정으로 로그인

### 2-2. 프로젝트 배포
1. 터미널에서 프로젝트 폴더로 이동
2. 다음 명령어 실행:
```bash
npx vercel login
npx vercel --prod
```

### 2-3. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수들 추가:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DOMAIN=https://your-vercel-app.vercel.app
```

## 3. 배포 후 확인사항

### 3-1. API 테스트
```bash
# 회원가입 테스트
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 3-2. 위젯 테스트
1. 랜딩 페이지 접속: `https://your-app.vercel.app`
2. 회원가입 후 대시보드에서 API 키 생성
3. 테스트 HTML 파일에 위젯 코드 삽입하여 테스트

## 4. 도메인 설정 (선택사항)

### 4-1. 커스텀 도메인 연결
1. Vercel 대시보드 → Settings → Domains
2. 원하는 도메인 추가
3. DNS 설정 (A 레코드 또는 CNAME)

### 4-2. 코드 내 도메인 업데이트
배포 후 다음 파일들의 도메인을 실제 도메인으로 변경:
- `public/loader.js` (API_URL)
- `api/cookie.js` (signup_url, dashboard_url 등)
- `public/index.html` (링크들)

## 5. 트러블슈팅

### 5-1. CORS 오류
- Vercel 환경 변수에 DOMAIN 설정 확인
- API 응답 헤더의 Access-Control-Allow-Origin 확인

### 5-2. Supabase 연결 오류
- 환경 변수 값 재확인
- Supabase 프로젝트 상태 확인 (일시정지되지 않았는지)

### 5-3. API 키 인증 오류
- 데이터베이스 스키마가 올바르게 적용되었는지 확인
- RLS 정책이 활성화되었는지 확인

## 6. 성능 최적화 (배포 후)

### 6-1. CDN 설정
- 위젯 로더 파일 캐싱 설정
- 정적 파일 압축 활성화

### 6-2. 모니터링 설정
- Vercel Analytics 활성화
- Supabase 사용량 모니터링

## 7. 보안 체크리스트

- [ ] 환경 변수에 민감한 정보 저장 확인
- [ ] API 키 해시 저장 확인
- [ ] RLS 정책 적용 확인
- [ ] CORS 설정 적절성 확인
- [ ] 사용량 제한 동작 확인
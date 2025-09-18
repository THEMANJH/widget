const fortunes = require('../fortunes.json');
const { validateApiKey, logUsage, checkMonthlyUsage } = require('../lib/auth');

module.exports = async (req, res) => {
  // CORS 허용 헤더 추가
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  // OPTIONS 요청일 경우 바로 종료 (Preflight 요청 대응)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // API 키 확인
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: 'API 키가 필요합니다. 회원가입 후 API 키를 발급받아 주세요.',
        signup_url: `${process.env.DOMAIN || 'https://localhost:3000'}/`
      });
    }

    // API 키 검증
    const authResult = await validateApiKey(apiKey);
    if (!authResult) {
      return res.status(401).json({ 
        error: '유효하지 않거나 만료된 API 키입니다.',
        dashboard_url: `${process.env.DOMAIN || 'https://localhost:3000'}/dashboard`
      });
    }

    // 월간 사용량 확인
    const monthlyUsage = await checkMonthlyUsage(authResult.userId);
    if (monthlyUsage >= authResult.plan.max_requests_per_month) {
      return res.status(429).json({ 
        error: '월간 사용량을 초과했습니다. 플랜을 업그레이드해 주세요.',
        current_usage: monthlyUsage,
        limit: authResult.plan.max_requests_per_month,
        upgrade_url: `${process.env.DOMAIN || 'https://localhost:3000'}/#pricing`
      });
    }

    // 사용량 로깅
    await logUsage(authResult.userId, authResult.keyId, '/api/cookie');

    // 랜덤으로 메시지를 선택합니다.
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    const randomFortune = fortunes[randomIndex];
    
    // 응답에 사용량 정보 포함
    res.status(200).json({ 
      message: randomFortune,
      usage: {
        current: monthlyUsage + 1,
        limit: authResult.plan.max_requests_per_month,
        plan: authResult.plan.name
      }
    });

  } catch (error) {
    console.error('Fortune Cookie API Error:', error);
    res.status(500).json({ message: '쿠키가 부서졌나 봐요. 다시 시도해 주세요.' });
  }
};
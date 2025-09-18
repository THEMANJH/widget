const { supabaseAdmin } = require('../../lib/supabase');
const { generateApiKey } = require('../../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 메서드만 허용됩니다.' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호가 필요합니다.' });
    }

    // Supabase Auth로 사용자 생성
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // 프로필 생성
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name: name || email.split('@')[0]
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // 기본 무료 플랜 구독 생성
    const { error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: authData.user.id,
        plan_id: 1, // Free 플랜
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1년
      });

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError);
    }

    // 기본 API 키 생성
    const apiKeyData = await generateApiKey(authData.user.id, 'Default Key');

    res.status(201).json({
      message: '회원가입이 완료되었습니다!',
      user: {
        id: authData.user.id,
        email: authData.user.email
      },
      api_key: apiKeyData.key,
      dashboard_url: `${process.env.DOMAIN || 'https://localhost:3000'}/dashboard`
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
};
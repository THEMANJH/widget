const { supabaseAdmin } = require('./supabase');
const crypto = require('crypto');

// API 키 생성
async function generateApiKey(userId, keyName = 'Default') {
  const apiKey = 'fck_' + crypto.randomBytes(32).toString('hex');
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .insert({
      user_id: userId,
      key_hash: keyHash,
      name: keyName
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return { ...data, key: apiKey }; // 실제 키는 한 번만 반환
}

// API 키 검증
async function validateApiKey(apiKey) {
  if (!apiKey || !apiKey.startsWith('fck_')) {
    return null;
  }
  
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select(`
      *,
      profiles!inner(
        id,
        email,
        user_subscriptions!inner(
          status,
          current_period_end,
          subscription_plans!inner(
            name,
            max_requests_per_month
          )
        )
      )
    `)
    .eq('key_hash', keyHash)
    .eq('is_active', true)
    .single();
    
  if (error || !data) return null;
  
  // 구독 상태 확인
  const subscription = data.profiles.user_subscriptions[0];
  if (!subscription || subscription.status !== 'active') {
    return null;
  }
  
  // 구독 만료 확인
  if (new Date(subscription.current_period_end) < new Date()) {
    return null;
  }
  
  return {
    userId: data.user_id,
    keyId: data.id,
    plan: subscription.subscription_plans,
    lastUsed: data.last_used_at
  };
}

// 사용량 로깅
async function logUsage(userId, apiKeyId, endpoint) {
  await supabaseAdmin
    .from('usage_logs')
    .insert({
      user_id: userId,
      api_key_id: apiKeyId,
      endpoint: endpoint
    });
    
  // API 키 마지막 사용 시간 업데이트
  await supabaseAdmin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', apiKeyId);
}

// 월간 사용량 확인
async function checkMonthlyUsage(userId) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabaseAdmin
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString());
    
  if (error) throw error;
  return count || 0;
}

module.exports = {
  generateApiKey,
  validateApiKey,
  logUsage,
  checkMonthlyUsage
};
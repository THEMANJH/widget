const { supabaseAdmin } = require('../../lib/supabase');
const { generateApiKey } = require('../../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // JWT 토큰에서 사용자 ID 추출
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '인증이 필요합니다.' });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
    }

    if (req.method === 'GET') {
      // API 키 목록 조회
      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .select('id, name, is_active, created_at, last_used_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({ keys: data });

    } else if (req.method === 'POST') {
      // 새 API 키 생성
      const { name } = req.body;
      const keyData = await generateApiKey(user.id, name || 'New Key');

      res.status(201).json({
        message: 'API 키가 생성되었습니다.',
        key: keyData.key,
        id: keyData.id,
        name: keyData.name
      });

    } else if (req.method === 'DELETE') {
      // API 키 삭제
      const { keyId } = req.query;
      
      const { error } = await supabaseAdmin
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user.id);

      if (error) throw error;

      res.status(200).json({ message: 'API 키가 삭제되었습니다.' });
    }

  } catch (error) {
    console.error('API Keys error:', error);
    res.status(500).json({ error: '요청 처리 중 오류가 발생했습니다.' });
  }
};
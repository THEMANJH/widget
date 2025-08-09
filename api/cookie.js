// fortunes.json 파일을 데이터처럼 직접 불러옵니다. (require 사용)
const fortunes = require('../fortunes.json');

// Vercel 서버에서 실행될 기본 함수입니다.
module.exports = (req, res) => {
  try {
    // 랜덤으로 메시지를 선택합니다.
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    const randomFortune = fortunes[randomIndex];
    
    // 성공적으로 포춘쿠키 메시지를 보내줍니다.
    res.status(200).json({ message: randomFortune });

  } catch (error) {
    // 혹시 모를 에러에 대비합니다.
    console.error(error); // 에러 내용을 로그에 남겨서 확인하기 쉽게 합니다.
    res.status(500).json({ message: '쿠키가 부서졌나 봐요. 다시 시도해 주세요.' });
  }
};
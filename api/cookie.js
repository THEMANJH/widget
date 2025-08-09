const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'fortunes.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const fortunes = JSON.parse(jsonData);

    // 포춘쿠키는 매번 다른 메시지가 나오는 것이 더 재미있습니다.
    // 날짜 기준 대신, '랜덤'으로 메시지를 선택하는 로직으로 변경합니다.
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    const todaysFortune = fortunes[randomIndex];
    
    // 성공적으로 포춘쿠키 메시지를 보내줍니다.
    res.status(200).json({ message: todaysFortune });

  } catch (error) {
    res.status(500).json({ message: '쿠키를 굽는 데 실패했어요. 굽는 중...' });
  }
};
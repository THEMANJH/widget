// Node.js의 기본 기능을 가져옵니다.
const fs = require('fs');
const path = require('path');

// Vercel 서버에서 실행될 기본 함수입니다.
module.exports = (req, res) => {
  try {
    // 1. fortunes.json 파일의 전체 경로를 찾습니다.
    // process.cwd()는 현재 프로젝트의 루트 폴더를 의미합니다.
    const filePath = path.join(process.cwd(), 'fortunes.json');
    
    // 2. JSON 파일을 읽어서 텍스트로 가져옵니다.
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    
    // 3. 텍스트를 실제 데이터 배열로 변환합니다.
    const fortunes = JSON.parse(jsonData);

    // 4. 오늘 날짜를 기준으로 운세를 선택합니다.
    const today = new Date();
    const dayIndex = today.getDate() % fortunes.length;
    const todaysFortune = fortunes[dayIndex];
    
    // 5. 성공적으로 운세 메시지를 클라이언트에게 보내줍니다.
    res.status(200).json({ message: todaysFortune });

  } catch (error) {
    // 만약 파일 읽기 등에서 에러가 발생하면, 에러 메시지를 보냅니다.
    res.status(500).json({ message: '운세를 불러오는 데 실패했습니다.' });
  }
};
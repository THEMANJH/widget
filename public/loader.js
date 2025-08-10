// public/loader.js (All-in-One 최종본)
(function() {
  // 1. 설정
  const API_URL = 'https://widget-seven-taupe.vercel.app/api/cookie';

  // 2. CSS 내용을 자바스크립트 변수 안에 저장
  const cssStyles = `
    #fortuneCookieWidget {
      background-color: #fff8e1;
      border: 2px dashed #e6c56e;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      text-align: center;
      font-family: 'KyoboHandwriting2020', 'Noto Sans KR', sans-serif;
      transition: transform 0.2s ease;
      cursor: pointer;
      -webkit-font-smoothing: antialiased;
    }
    #fortuneCookieWidget:hover {
      transform: scale(1.03);
    }
    #fortuneCookieWidget h4 {
      margin: 0 0 10px 0;
      font-size: 17px;
      font-weight: bold;
      color: #b08c3a;
    }
    #fortuneCookieWidget p {
      font-size: 15px;
      color: #7b6d51;
      line-height: 1.6;
      margin: 0;
    }
  `;

  // 3. <style> 태그를 직접 만들어 페이지의 <head>에 주입
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = cssStyles;
  document.head.appendChild(styleSheet);

  // 4. 위젯 HTML 생성 및 페이지에 추가
  const sidebar = document.querySelector('.area-aside') || document.querySelector('#sidebar') || document.body;
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'fortuneCookieWidget';
  widgetContainer.innerHTML = `<h4>🥠 오늘의 포춘쿠키</h4><p>쿠키를 눌러서 열어보세요!</p>`;
  sidebar.prepend(widgetContainer);

  // 5. 포춘쿠키 가져오기 로직
  const messageParagraph = widgetContainer.querySelector('p');
  let isLoading = false;
  const fetchFortune = () => {
    if (isLoading) return;
    isLoading = true;
    messageParagraph.textContent = '쿠키를 여는 중...';

    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        messageParagraph.textContent = data.message;
        isLoading = false;
      })
      .catch(error => {
        console.error('Fortune Cookie Widget Error:', error);
        messageParagraph.textContent = '쿠키가 바삭하지 않네요! 다시 눌러주세요.';
        isLoading = false;
      });
  };

  widgetContainer.addEventListener('click', fetchFortune);
})();
// public/loader.js
(function() {
    // 1. 설정: 당신의 Vercel API 주소
    const API_URL = 'https://widget-seven-taupe.vercel.app/api/cookie'; 
    const CSS_URL = 'https://widget-seven-taupe.vercel.app/api/cookie';
  
    // 2. CSS 파일을 동적으로 불러오기
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = CSS_URL;
    document.head.appendChild(link);
  
    // 3. 위젯을 설치할 기준 위치 찾기 (여기서는 블로그의 'sidebar'를 찾습니다)
    // 티스토리 스킨마다 다를 수 있으므로, 여러 선택자를 시도합니다.
    const sidebar = document.querySelector('.area-aside') || document.querySelector('#sidebar') || document.body;
  
    // 4. 위젯의 HTML 구조를 동적으로 생성
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'fortuneCookieWidget';
    widgetContainer.innerHTML = `
      <h4>🥠 오늘의 포춘쿠키</h4>
      <p>쿠키를 눌러서 열어보세요!</p>
    `;
  
    // 5. 생성된 위젯을 사이드바의 첫 번째 자식으로 추가
    sidebar.prepend(widgetContainer);
  
    // 6. 기존의 포춘쿠키 가져오기 로직
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
/**
 * content-localhost.js
 * 앱과 확장 프로그램 간 메시지 중계 (UI 없음)
 */

(function () {
  console.log('[AI Connector] localhost 콘텐츠 스크립트 로드됨');

  // 확장 프로그램 컨텍스트 유효성 검사
  function isContextValid() {
    try {
      return !!(chrome && chrome.runtime && chrome.runtime.id);
    } catch (e) {
      return false;
    }
  }

  function safeSendMessage(message, callback) {
    if (!isContextValid()) {
      console.warn('[AI Connector] 확장 프로그램이 새로고침되었습니다. 페이지를 새로고침해주세요.');
      return;
    }
    try {
      chrome.runtime.sendMessage(message, callback);
    } catch (e) {
      console.warn('[AI Connector] 메시지 전송 실패:', e.message);
    }
  }

  // ── 페이지 로드 시 Suno 상태 전달 ──
  safeSendMessage({ type: 'CHECK_SUNO_STATUS' }, (response) => {
    if (chrome.runtime.lastError) return;
    window.postMessage({
      type: 'SUNO_STATUS',
      connected: !!(response && response.connected),
      cookieCount: response?.cookieCount || 0,
      credits: response?.credits ?? null,
      version: response?.version || ''
    }, '*');
  });

  // ── 앱 postMessage 수신 ──
  window.addEventListener('message', (event) => {
    if (!event.data || !event.data.type) return;

    if (event.data.type === 'SUNO_CHECK_STATUS') {
      safeSendMessage({ type: 'CHECK_SUNO_STATUS' }, (response) => {
        if (chrome.runtime.lastError) return;
        window.postMessage({
          type: 'SUNO_STATUS',
          connected: !!(response && response.connected),
          cookieCount: response?.cookieCount || 0,
          credits: response?.credits ?? null,
          version: response?.version || ''
        }, '*');
      });
      return;
    }

    if (event.data.type === 'SUNO_GENERATE') {
      console.log('[AI Connector] 곡 생성 요청:', event.data);

      safeSendMessage(
        {
          type: 'GENERATE_SONG',
          data: {
            title: event.data.title || '',
            lyrics: event.data.lyrics || '',
            style: event.data.style || '',
            excludeStyles: event.data.excludeStyles || '',
            weirdness: event.data.weirdness ?? null,
            styleInfluence: event.data.styleInfluence ?? null
          }
        },
        (response) => {
          if (chrome.runtime.lastError) return;
          if (response && response.success) {
            window.postMessage({
              type: 'SUNO_GENERATE_STARTED',
              success: true,
              queueLength: response.queueLength || 0
            }, '*');
          } else {
            window.postMessage({
              type: 'SUNO_GENERATE_STARTED',
              success: false,
              error: response?.error || '알 수 없는 오류'
            }, '*');
          }
        }
      );
    }
  });

})();

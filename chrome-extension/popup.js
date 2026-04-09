/**
 * popup.js (v2) - 서버 없이 동작
 * 
 * suno.com 쿠키가 있는지 확인하여 로그인 상태를 판단하고,
 * 쿠키를 chrome.storage.local에 저장합니다.
 * 서버 전송 없이, 같은 브라우저 내에서 content script가 직접 사용합니다.
 */

document.addEventListener('DOMContentLoaded', () => {
  checkSunoStatus();
  document.getElementById('btnCheck').addEventListener('click', checkSunoStatus);
});

async function checkSunoStatus() {
  const btn = document.getElementById('btnCheck');
  const dot = document.getElementById('dotSuno');
  const footer = document.getElementById('footerMsg');

  btn.textContent = '확인 중...';
  footer.textContent = 'Suno 로그인 상태를 확인하는 중...';
  footer.className = 'footer-msg';

  try {
    // suno.com 도메인의 쿠키 전체 가져오기
    const cookies = await chrome.cookies.getAll({ domain: '.suno.com' });
    const cookies2 = await chrome.cookies.getAll({ domain: 'suno.com' });

    // 중복 제거하여 합치기
    const allCookies = [...cookies];
    for (const c of cookies2) {
      if (!allCookies.find(x => x.name === c.name)) {
        allCookies.push(c);
      }
    }

    // 로그인 판단: __session 또는 __client_uat 쿠키가 있는지 확인
    const hasSession = allCookies.some(c =>
      c.name === '__session' ||
      c.name === '__client_uat' ||
      c.name === '__clerk_db_jwt'
    );

    if (hasSession && allCookies.length > 0) {
      // ✅ 로그인 상태
      dot.className = 'dot on';
      btn.textContent = '다시 확인';
      btn.classList.add('on');

      // 쿠키를 chrome.storage에 저장 (content script에서 사용)
      const cookieArray = allCookies.map(c => ({
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        secure: c.secure,
        httpOnly: c.httpOnly,
        sameSite: c.sameSite || 'Lax',
      }));

      const cookieString = allCookies
        .map(c => `${c.name}=${c.value}`)
        .join('; ');

      await chrome.storage.local.set({
        sunoConnected: true,
        sunoCookies: cookieArray,
        sunoCookieString: cookieString,
        sunoLastChecked: new Date().toISOString(),
        sunoCookieCount: allCookies.length
      });

      // UI 업데이트
      document.getElementById('infoArea').style.display = 'block';
      document.getElementById('guideArea').style.display = 'none';
      document.getElementById('loginStatus').textContent = '✅ 로그인됨';
      document.getElementById('cookieCount').textContent = `${allCookies.length}개`;
      document.getElementById('lastChecked').textContent = new Date().toLocaleTimeString('ko-KR');

      footer.textContent = 'Suno 연결 완료!';
      footer.className = 'footer-msg ok';

    } else {
      // ❌ 로그인 안 됨
      dot.className = 'dot off';
      btn.textContent = '다시 확인';
      btn.classList.remove('on');

      await chrome.storage.local.set({ sunoConnected: false });

      document.getElementById('infoArea').style.display = 'none';
      document.getElementById('guideArea').style.display = 'block';

      footer.textContent = 'Suno에 먼저 로그인해주세요';
      footer.className = 'footer-msg err';
    }

  } catch (error) {
    dot.className = 'dot off';
    btn.textContent = '다시 확인';
    footer.textContent = '오류: ' + error.message;
    footer.className = 'footer-msg err';
  }
}

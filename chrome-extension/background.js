/**
 * background.js - 서비스 워커
 *
 * 핵심 변경:
 * 1. pendingSongs = 배열 (큐) — 여러 곡을 한 탭에서 순차 처리
 * 2. sunoTabId 저장 — 탭 재사용으로 중복 열림 방지
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GENERATE_SONG') {
    handleGenerateSong(message.data)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message.type === 'CHECK_SUNO_STATUS') {
    checkSunoStatus()
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ connected: false, error: error.message }));
    return true;
  }

  if (message.type === 'SUNO_PAGE_INFO') {
    chrome.storage.local.set({
      sunoVersion: message.version || '',
      sunoCredits: message.credits ?? null,
      sunoInfoUpdated: Date.now()
    });
    sendResponse({ ok: true });
    return false;
  }

  // content-suno.js가 현재 곡 처리 완료 알림 → 다음 곡 있으면 알려줌
  if (message.type === 'SONG_FILLED') {
    sendResponse({ ok: true });
    return false;
  }
});

// ── 큐 추가 락 (race condition 방지) ──
let queueLock = false;

async function waitForLock() {
  while (queueLock) {
    await new Promise(r => setTimeout(r, 50));
  }
}

// ── 곡 생성 처리 (큐 방식) ──
async function handleGenerateSong(songData) {
  console.log('[Background] 곡 생성 요청:', songData);

  const status = await checkSunoStatus();
  if (!status.connected) {
    return { success: false, error: 'Suno에 로그인되어 있지 않습니다.' };
  }

  // 락 획득 → 큐에 곡 추가 → 락 해제
  await waitForLock();
  queueLock = true;
  try {
    const stored = await chrome.storage.local.get('pendingSongs');
    const queue = stored.pendingSongs || [];
    queue.push({
      title: songData.title || '',
      lyrics: songData.lyrics || '',
      style: songData.style || '',
      excludeStyles: songData.excludeStyles || '',
      weirdness: songData.weirdness ?? null,
      styleInfluence: songData.styleInfluence ?? null,
      isInstrumental: songData.isInstrumental || false,
      timestamp: Date.now()
    });
    await chrome.storage.local.set({ pendingSongs: queue });
    console.log('[Background] 큐에 추가됨. 현재 큐 길이:', queue.length);
  } finally {
    queueLock = false;
  }

  // 기존 Suno 탭 확인 및 재사용
  const tabResult = await ensureSunoTab();

  return {
    success: true,
    message: tabResult.isNew ? 'Suno 페이지를 열고 있습니다...' : '기존 Suno 탭에 곡을 추가했습니다.',
    tabId: tabResult.tabId,
    queueLength: queue.length
  };
}

// ── Suno 탭 확인/열기 (중복 방지) ──
async function ensureSunoTab() {
  // 1. 저장된 탭 ID 확인
  const stored = await chrome.storage.local.get('sunoTabId');
  if (stored.sunoTabId) {
    try {
      const tab = await chrome.tabs.get(stored.sunoTabId);
      if (tab && tab.url && tab.url.includes('suno.com')) {
        await chrome.tabs.update(tab.id, { active: true });
        // 탭에 메시지 전송하여 새 곡 데이터 처리하도록 알림
        try {
          await chrome.tabs.sendMessage(tab.id, { type: 'PROCESS_NEXT_SONG' });
        } catch (e) {
          // content script가 아직 안 로드되었으면 새로고침
          await chrome.tabs.reload(tab.id);
        }
        return { tabId: tab.id, isNew: false };
      }
    } catch (e) {
      // 탭이 이미 닫혔음
    }
  }

  // 2. URL 패턴으로 기존 탭 검색
  const tabs = await chrome.tabs.query({ url: ['https://suno.com/create*', 'https://www.suno.com/create*'] });
  if (tabs.length > 0) {
    const tabId = tabs[0].id;
    await chrome.storage.local.set({ sunoTabId: tabId });
    await chrome.tabs.update(tabId, { active: true });
    try {
      await chrome.tabs.sendMessage(tabId, { type: 'PROCESS_NEXT_SONG' });
    } catch (e) {
      await chrome.tabs.reload(tabId);
    }
    return { tabId, isNew: false };
  }

  // 3. 새 탭 열기
  const tab = await chrome.tabs.create({ url: 'https://suno.com/create', active: true });
  await chrome.storage.local.set({ sunoTabId: tab.id });
  return { tabId: tab.id, isNew: true };
}

// ── 탭 닫힘 감지 ──
chrome.tabs.onRemoved.addListener(async (tabId) => {
  const stored = await chrome.storage.local.get('sunoTabId');
  if (stored.sunoTabId === tabId) {
    await chrome.storage.local.remove('sunoTabId');
  }
});

// ── Suno 로그인 상태 확인 ──
async function checkSunoStatus() {
  try {
    const cookies = await chrome.cookies.getAll({ domain: '.suno.com' });
    const cookies2 = await chrome.cookies.getAll({ domain: 'suno.com' });

    const allCookies = [...cookies];
    for (const c of cookies2) {
      if (!allCookies.find(x => x.name === c.name)) {
        allCookies.push(c);
      }
    }

    const hasSession = allCookies.some(c =>
      c.name === '__session' || c.name === '__client_uat' || c.name === '__clerk_db_jwt'
    );
    const connected = hasSession && allCookies.length > 0;

    const stored = await chrome.storage.local.get(['sunoVersion', 'sunoCredits']);
    let credits = stored.sunoCredits ?? null;
    let version = stored.sunoVersion || '';

    if (connected) {
      try {
        const apiCredits = await fetchSunoCredits(allCookies);
        if (apiCredits !== null) credits = apiCredits;
      } catch (e) { }
    }

    return { connected, cookieCount: allCookies.length, credits, version };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

async function fetchSunoCredits(cookies) {
  const sessionCookie = cookies.find(c => c.name === '__session');
  if (!sessionCookie) return null;

  const endpoints = [
    'https://studio-api.suno.ai/api/billing/info/',
    'https://studio-api.suno.ai/api/billing/credits/'
  ];

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${sessionCookie.value}`, 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        const credits = data.total_credits_left ?? data.credits_left ?? data.credits ?? data.remaining_credits ?? data.balance ?? null;
        if (credits !== null) return credits;
      }
    } catch (e) { continue; }
  }
  return null;
}

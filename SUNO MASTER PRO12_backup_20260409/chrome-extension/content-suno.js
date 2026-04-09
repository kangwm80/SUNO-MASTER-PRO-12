/**
 * content-suno.js — Suno v5.5 완전 자동화 (안정성 최우선)
 *
 * 설계 원칙:
 * - 속도보다 안정성: 모든 단계에 충분한 대기 시간
 * - 슬라이더: 1회 누르고 확인하는 반복 방식 (키 누락 원천 방지)
 * - 각 단계 독립 실행: 한 곳 실패해도 다음 단계 계속
 * - 곡 간 45초 대기: captcha 방지
 * - 타임스탬프 10분: 5곡 처리 시간 충분히 확보
 */

(function () {
  console.log('[Suno Bot] content-suno.js 로드됨');

  function isContextValid() {
    try { return !!(chrome && chrome.runtime && chrome.runtime.id); } catch (e) { return false; }
  }

  setTimeout(() => {
    if (!isContextValid()) return;
    scrapePageInfo();
    processNextSong();
  }, 4000);

  try {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'PROCESS_NEXT_SONG') {
        setTimeout(() => processNextSong(), 2000);
        sendResponse({ ok: true });
      }
    });
  } catch (e) { }

  function scrapePageInfo() {
    let version = '', credits = null;
    document.querySelectorAll('span, div, button, p').forEach(el => {
      const t = (el.textContent || '').trim();
      if (/^v\d+\.\d+$/.test(t) && t.length < 8) version = t;
    });
    document.querySelectorAll('span, div, p').forEach(el => {
      const t = (el.textContent || '').trim().toLowerCase();
      const m = t.match(/(\d[\d,]*)\s*credits?/);
      if (m) credits = parseInt(m[1].replace(/,/g, ''), 10);
    });
    if (version || credits !== null) {
      try { chrome.runtime.sendMessage({ type: 'SUNO_PAGE_INFO', version, credits }); } catch (e) { }
    }
  }

  // ══════════════════════════════════════════════════
  // 요소 가시성 검증
  // ══════════════════════════════════════════════════
  function isVisible(el) {
    if (!el || el.offsetParent === null) return false;
    let parent = el;
    while (parent) {
      if (parent.getAttribute && parent.getAttribute('aria-hidden') === 'true') return false;
      const s = parent.style;
      if (s && (s.display === 'none' || s.visibility === 'hidden' || s.pointerEvents === 'none')) return false;
      if (s && s.height === '0px' && s.overflow === 'hidden') return false;
      parent = parent.parentElement;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  // ══════════════════════════════════════════════════
  // 메인 처리
  // ══════════════════════════════════════════════════
  async function processNextSong() {
    if (!isContextValid()) return;
    let data;
    try { data = await chrome.storage.local.get('pendingSongs'); } catch (e) { return; }
    const queue = data.pendingSongs || [];
    if (queue.length === 0) { console.log('[Suno Bot] 큐 비어있음'); return; }

    const song = queue.shift();
    await chrome.storage.local.set({ pendingSongs: queue });

    // 10분 이내 요청만 처리 (5곡 × 45초 = 약 4분)
    if (Date.now() - song.timestamp > 10 * 60 * 1000) {
      console.log('[Suno Bot] 오래된 요청 스킵');
      return processNextSong();
    }

    const remaining = queue.length;
    const songNum = 5 - remaining; // 대략적 곡 번호
    console.log(`[Suno Bot] ═══ ${songNum}번째 곡 입력 시작 (남은: ${remaining}곡) ═══`);
    showBanner(`🎵 ${songNum}번째 곡 자동 입력 중...`);

    // Step 1: 폼 활성화
    await safeRun('폼 활성화', activateCreateForm);

    // Step 2: Advanced 탭
    await safeRun('Advanced 탭', () => clickTab('advanced'));
    await sleep(1500);

    // Step 3: Lyrics
    if (song.lyrics && !song.isInstrumental) {
      await safeRun('Lyrics', () => fillBySection('lyrics', song.lyrics));
      await sleep(1000);
    }

    // Step 4: Styles
    if (song.style) {
      await safeRun('Styles', () => fillBySection('styles', song.style));
      await sleep(1000);
    }

    // Step 5: Title
    if (song.title) {
      await safeRun('Title', () => fillTitle(song.title));
      await sleep(1000);
    }

    // Step 6: More Options
    await safeRun('More Options', clickMoreOptions);
    await sleep(1500);

    // Step 7: Exclude
    if (song.excludeStyles) {
      await safeRun('Exclude', () => fillExclude(song.excludeStyles));
      await sleep(1000);
    }

    // Step 8: Vocal Gender
    await safeRun('Vocal Gender', () => selectVocalGender('male'));
    await sleep(800);

    // Step 9: Weirdness (안정적 1회씩 방식)
    if (song.weirdness != null) {
      await safeRun('Weirdness', () => setSliderSafe('weirdness', song.weirdness));
      await sleep(1000);
    }

    // Step 10: Style Influence
    if (song.styleInfluence != null) {
      await safeRun('Style Influence', () => setSliderSafe('style influence', song.styleInfluence));
      await sleep(1000);
    }

    // Step 11: 최종 확인 후 Create
    showBanner(`🚀 ${songNum}번째 곡 Create 클릭!`, 'success');
    await sleep(2000);
    await safeRun('Create', clickCreateButton);

    try { chrome.runtime.sendMessage({ type: 'SONG_FILLED' }); } catch (e) { }

    // Step 12: 다음 곡
    if (remaining > 0) {
      showBanner(`✅ ${songNum}번째 곡 생성 시작! 45초 후 다음 곡...`, 'success');
      setTimeout(() => processNextSong(), 45000);
    } else {
      showBanner('✅ 모든 곡 생성 완료!', 'success');
    }
  }

  async function safeRun(stepName, fn) {
    try {
      await fn();
    } catch (e) {
      console.error(`[Suno Bot] ❌ ${stepName} 실패:`, e.message);
    }
  }

  // ══════════════════════════════════════════════════
  // 폼 활성화
  // ══════════════════════════════════════════════════
  async function activateCreateForm() {
    if (isFormVisible()) {
      console.log('[Suno Bot] ✅ 폼 이미 활성화됨');
      return;
    }
    console.log('[Suno Bot] 사이드바 Create 클릭 시도...');

    const links = document.querySelectorAll('a[href="/create"], a[href*="/create"]');
    for (const link of links) {
      if ((link.textContent || '').includes('+')) continue;
      link.click();
      console.log('[Suno Bot] ✅ 사이드바 Create 클릭됨');
      await waitUntil(isFormVisible, 15000);
      return;
    }

    for (const el of document.querySelectorAll('a, button, div[role="button"]')) {
      if ((el.textContent || '').trim() === 'Create' && isVisible(el)) {
        el.click();
        await waitUntil(isFormVisible, 15000);
        return;
      }
    }

    await waitUntil(isFormVisible, 15000);
  }

  function isFormVisible() {
    for (const el of document.querySelectorAll('span, div, h2, h3, h4, label, p')) {
      const dt = getDirectText(el).toLowerCase();
      if ((dt === 'lyrics' || dt === 'styles') && isVisible(el)) return true;
    }
    return false;
  }

  // ══════════════════════════════════════════════════
  // 탭 클릭
  // ══════════════════════════════════════════════════
  async function clickTab(tabName) {
    for (const el of document.querySelectorAll('button, [role="tab"], a, span, div')) {
      if ((el.textContent || '').trim().toLowerCase() === tabName && isVisible(el)) {
        el.click();
        console.log(`[Suno Bot] ✅ ${tabName} 탭 클릭`);
        return;
      }
    }
  }

  // ══════════════════════════════════════════════════
  // 텍스트 입력 (Lyrics, Styles)
  // ══════════════════════════════════════════════════
  async function fillBySection(sectionName, value) {
    console.log(`[Suno Bot] ${sectionName} 입력 시도...`);
    const section = findSectionByHeading(sectionName);
    if (!section) { console.warn(`[Suno Bot] ❌ ${sectionName} 섹션 못 찾음`); return; }

    const candidates = section.querySelectorAll('textarea, div[contenteditable="true"], [role="textbox"], input[type="text"], input:not([type])');
    let el = null;
    for (const c of candidates) {
      if (isVisible(c)) { el = c; break; }
    }
    if (!el) { console.warn(`[Suno Bot] ❌ ${sectionName} 입력 요소 못 찾음`); return; }

    await smartFill(el, value);
    console.log(`[Suno Bot] ✅ ${sectionName} 입력 완료`);
  }

  // ══════════════════════════════════════════════════
  // Title
  // ══════════════════════════════════════════════════
  async function fillTitle(value) {
    console.log('[Suno Bot] Title 입력 시도...');
    let el = findVisibleByPlaceholder(['title', 'song name', '제목', 'untitled']);

    if (!el) {
      const btn = findOrangeCreateButton();
      if (btn) {
        let p = btn.parentElement;
        for (let i = 0; i < 6 && p; i++) {
          for (const inp of p.querySelectorAll('input')) {
            if (isVisible(inp) && !['range','hidden','checkbox'].includes(inp.type)) { el = inp; break; }
          }
          if (el) break;
          p = p.parentElement;
        }
      }
    }

    if (el) {
      await smartFill(el, value);
      console.log('[Suno Bot] ✅ Title 입력 완료');
    } else {
      console.warn('[Suno Bot] ❌ Title 못 찾음');
    }
  }

  // ══════════════════════════════════════════════════
  // More Options
  // ══════════════════════════════════════════════════
  async function clickMoreOptions() {
    console.log('[Suno Bot] More Options 펼치기...');

    if (findVisibleText('weirdness')) {
      console.log('[Suno Bot] ✅ More Options 이미 열려있음');
      return;
    }

    for (const el of document.querySelectorAll('*')) {
      const dt = getDirectText(el).toLowerCase();
      if (dt.includes('more option') && dt.length < 25 && isVisible(el)) {
        el.click();
        console.log('[Suno Bot] ✅ More Options 클릭됨');
        await waitUntil(() => findVisibleText('weirdness'), 8000);
        return;
      }
    }

    for (const btn of document.querySelectorAll('button, [role="button"], summary')) {
      const t = (btn.textContent || '').trim().toLowerCase();
      if (t.includes('more') && t.length < 20 && isVisible(btn)) {
        btn.click();
        await waitUntil(() => findVisibleText('weirdness'), 8000);
        return;
      }
    }

    console.warn('[Suno Bot] ❌ More Options 못 찾음');
  }

  // ══════════════════════════════════════════════════
  // Exclude
  // ══════════════════════════════════════════════════
  async function fillExclude(value) {
    console.log('[Suno Bot] Exclude 입력 시도...');

    let el = findVisibleByPlaceholder(['exclude', 'negative']);

    if (!el) {
      for (const label of document.querySelectorAll('label, span, div, p')) {
        const dt = getDirectText(label).toLowerCase();
        if (!dt.includes('exclude') || dt.length > 30 || !isVisible(label)) continue;
        let parent = label.parentElement;
        for (let i = 0; i < 4 && parent; i++) {
          for (const inp of parent.querySelectorAll('input, textarea')) {
            if (isVisible(inp) && !['range','hidden'].includes(inp.type)) { el = inp; break; }
          }
          if (el) break;
          parent = parent.parentElement;
        }
        if (el) break;
      }
    }

    if (!el) {
      const moreSection = findSectionByHeading('more option');
      if (moreSection) {
        for (const inp of moreSection.querySelectorAll('input, textarea')) {
          if (isVisible(inp) && !['range','hidden','checkbox','radio'].includes(inp.type)) { el = inp; break; }
        }
      }
    }

    if (!el) {
      const stylesSection = findSectionByHeading('styles');
      const lyricsSection = findSectionByHeading('lyrics');
      for (const inp of document.querySelectorAll('input[type="text"], input:not([type])')) {
        if (!isVisible(inp) || ['range','hidden'].includes(inp.type)) continue;
        if (stylesSection && stylesSection.contains(inp)) continue;
        if (lyricsSection && lyricsSection.contains(inp)) continue;
        const ph = (inp.placeholder || '').toLowerCase();
        if (ph.includes('title') || ph.includes('song')) continue;
        el = inp;
        break;
      }
    }

    if (el) {
      await smartFill(el, value);
      console.log('[Suno Bot] ✅ Exclude 입력 완료');
    } else {
      console.warn('[Suno Bot] ❌ Exclude 못 찾음');
    }
  }

  // ══════════════════════════════════════════════════
  // Vocal Gender
  // ══════════════════════════════════════════════════
  async function selectVocalGender(gender) {
    console.log(`[Suno Bot] Vocal Gender = ${gender} 선택...`);
    const target = gender.toLowerCase();

    for (const el of document.querySelectorAll('button, span, div, label, [role="button"], [role="radio"], [role="option"]')) {
      const t = (el.textContent || '').trim().toLowerCase();
      if (t !== target || !isVisible(el)) continue;
      let p = el.parentElement;
      for (let i = 0; i < 5 && p; i++) {
        if ((p.textContent || '').toLowerCase().includes('vocal')) {
          el.click();
          console.log(`[Suno Bot] ✅ Vocal Gender = ${target}`);
          return;
        }
        p = p.parentElement;
      }
    }
    console.warn(`[Suno Bot] ❌ Vocal Gender ${target} 못 찾음`);
  }

  // ══════════════════════════════════════════════════
  // 슬라이더 — 안정적 1회씩 방식 (키 누락 원천 방지)
  // ══════════════════════════════════════════════════
  async function setSliderSafe(name, targetPercent) {
    console.log(`[Suno Bot] ${name} = ${targetPercent}% 설정...`);
    const keyword = name.toLowerCase().includes('weird') ? 'weirdness' : 'style influence';

    // 슬라이더 찾기
    const label = findVisibleText(keyword);
    if (!label) { console.warn(`[Suno Bot] ❌ ${name} 라벨 못 찾음`); return; }

    let slider = null;
    let container = label.parentElement;
    for (let i = 0; i < 6 && container; i++) {
      slider = [...(container.querySelectorAll('[role="slider"], input[type="range"]'))].find(isVisible);
      if (slider) break;
      container = container.parentElement;
    }

    if (!slider) {
      const all = [...document.querySelectorAll('[role="slider"], input[type="range"]')].filter(isVisible);
      const idx = keyword.includes('weird') ? 0 : 1;
      if (all.length > idx) slider = all[idx];
    }

    if (!slider) { console.warn(`[Suno Bot] ❌ ${name} 슬라이더 못 찾음`); return; }

    // 값 읽기 함수
    function readValue() {
      return parseFloat(slider.getAttribute('aria-valuenow') || slider.value || 50);
    }

    function pressKey(key) {
      slider.dispatchEvent(new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true }));
      slider.dispatchEvent(new KeyboardEvent('keyup', { key, code: key, bubbles: true }));
    }

    slider.focus();
    await sleep(300);

    const startValue = readValue();
    console.log(`[Suno Bot] ${name}: 현재=${startValue}%, 목표=${targetPercent}%`);

    if (Math.abs(targetPercent - startValue) < 1) {
      console.log(`[Suno Bot] ✅ ${name} 이미 목표값`);
      return;
    }

    // 1회씩 누르고 확인하는 안전한 방식 (최대 60회 제한)
    const maxAttempts = 60;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const current = readValue();
      const diff = targetPercent - current;

      // 목표 도달 확인 (±1% 허용)
      if (Math.abs(diff) < 1) {
        console.log(`[Suno Bot] ✅ ${name} = ${current}% (목표: ${targetPercent}%, ${attempts}회)`);
        return;
      }

      // 방향 결정
      const key = diff > 0 ? 'ArrowRight' : 'ArrowLeft';
      pressKey(key);
      attempts++;

      // React 처리 대기 (핵심: 충분한 시간)
      await sleep(200);
    }

    const finalValue = readValue();
    console.log(`[Suno Bot] ✅ ${name} = ${finalValue}% (목표: ${targetPercent}%, 최대 시도 도달)`);
  }

  // ══════════════════════════════════════════════════
  // Create 버튼
  // ══════════════════════════════════════════════════
  async function clickCreateButton() {
    const btn = findOrangeCreateButton();
    if (btn) {
      btn.click();
      console.log('[Suno Bot] ✅ Create 버튼 클릭됨');
    } else {
      console.warn('[Suno Bot] ❌ Create 버튼 못 찾음');
    }
  }

  function findOrangeCreateButton() {
    const btns = [...document.querySelectorAll('button')].filter(b => {
      const t = (b.textContent || '').trim().toLowerCase();
      return t.includes('create') && !t.includes('+') && isVisible(b);
    });
    if (btns.length === 0) return null;
    return btns.reduce((a, b) => a.getBoundingClientRect().width > b.getBoundingClientRect().width ? a : b);
  }

  // ══════════════════════════════════════════════════
  // React 호환 입력
  // ══════════════════════════════════════════════════
  async function smartFill(element, value) {
    element.focus();
    await sleep(200);

    const isEditable = element.getAttribute('contenteditable') === 'true' || element.getAttribute('role') === 'textbox';

    if (isEditable) {
      document.execCommand('selectAll', false, null);
      await sleep(100);
      document.execCommand('delete', false, null);
      await sleep(100);
      document.execCommand('insertText', false, value);
    } else {
      const proto = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(element, '');
      element.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(100);
      setter.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    await sleep(200);
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  // ══════════════════════════════════════════════════
  // 유틸리티
  // ══════════════════════════════════════════════════
  function findSectionByHeading(keyword) {
    const kw = keyword.toLowerCase();
    for (const el of document.querySelectorAll('h1,h2,h3,h4,h5,h6,span,div,p,label,button')) {
      const dt = getDirectText(el).toLowerCase();
      if (dt.length > 25 || !dt.includes(kw) || !isVisible(el)) continue;
      let p = el.parentElement;
      for (let i = 0; i < 6 && p; i++) {
        if (p.querySelector('textarea, input, div[contenteditable="true"], [role="textbox"]') && p.offsetHeight > 30) return p;
        p = p.parentElement;
      }
    }
    return null;
  }

  function findVisibleByPlaceholder(keywords) {
    for (const inp of document.querySelectorAll('input, textarea')) {
      if (['range','hidden','checkbox','radio'].includes(inp.type) || !isVisible(inp)) continue;
      const ph = (inp.placeholder || '').toLowerCase();
      if (keywords.some(kw => ph.includes(kw))) return inp;
    }
    return null;
  }

  function findVisibleText(keyword) {
    const kw = keyword.toLowerCase();
    for (const el of document.querySelectorAll('span, div, p, label, h4, h5')) {
      const dt = getDirectText(el).toLowerCase();
      if (dt.includes(kw) && dt.length < 25 && isVisible(el)) return el;
    }
    return null;
  }

  function getDirectText(el) {
    let t = '';
    for (const n of el.childNodes) { if (n.nodeType === Node.TEXT_NODE) t += n.textContent; }
    return t.trim();
  }

  function waitUntil(fn, ms) {
    return new Promise(resolve => {
      const start = Date.now();
      const check = () => {
        if (fn()) { resolve(true); return; }
        if (Date.now() - start > ms) { resolve(false); return; }
        setTimeout(check, 500);
      };
      check();
    });
  }

  function showBanner(text, type = 'info') {
    const existing = document.getElementById('suno-bot-banner');
    if (existing) existing.remove();
    const c = { info: '#1a2a3a|#2d4a6d|#8ecaff', success: '#1a2a1a|#2d4a2d|#8eca8e', error: '#2a1a1a|#4a2d2d|#ca8e8e' }[type]?.split('|') || ['#1a2a3a','#2d4a6d','#8ecaff'];
    const b = document.createElement('div');
    b.id = 'suno-bot-banner';
    b.style.cssText = `position:fixed;top:10px;left:50%;transform:translateX(-50%);background:${c[0]};border:2px solid ${c[1]};color:${c[2]};padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;z-index:999999;font-family:-apple-system,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.5);`;
    b.textContent = text;
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 15000);
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
})();

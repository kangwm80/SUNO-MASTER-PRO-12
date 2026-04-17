// ============================================
// SUNO MASTER PRO 12 - 노래제목&가사 만들기
// ============================================

// 파트 파일 병합 (파트2~4가 로드된 경우)
if (typeof SITUATION_DATA !== 'undefined') {
    if (typeof SITUATION_DATA_PART2 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART2);
    if (typeof SITUATION_DATA_PART3 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART3);
    if (typeof SITUATION_DATA_PART4 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART4);
}

document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const state = {
        promptData: null, appliedPrompt: null, appliedStory: null, reference: '', language: 'korean', story: '', generation: '', generations: [], confirmedTitles: [],
        titleCount: 5, titles: [], selectedTitle: '', songform: [], sectionLyrics: {}
    };

    // === DOM 요소 미리 선언 (변수 순서 오류 방지) ===
    const langBtns = document.getElementById('langBtns');
    const genBtns = document.getElementById('generationBtns');
    const lyricsGenBtns = document.getElementById('lyricsGenBtns');

    // 세대별 언어 완전 가이드 (세대별 언어 완전 가이드 & 노래 가사·제목 적용법 + 연령대별 장르 선호도 반영)
    const GEN_GUIDE = {
        teens: {
            label: '10대',
            keywords: '헐, 진짜, 완전, 존잼, 갓, 레전드, 인정, 킹받다, 미쳤다, 갑통알, 현타, 최애',
            emotion: '설렘, 인정욕구, 소속감, 꿈, 도전, 자기표현',
            tip: '짧은 훅 + 감탄사 활용, 학교/첫사랑/친구 소재, TikTok 바이럴 가능한 중독성 있는 후렴구',
            avoid: '훈계 어투, 어른 시선의 조언, 교훈적 메시지 금지',
            want: '"네가 제일 특별해", "넌 할 수 있어", "너만 보여"',
            platform: 'TikTok > YouTube > Spotify',
            hookTip: '코러스에 세대 언어 + 감탄사 넣기, 따라 부르기 쉬운 멜로디',
            preferredGenres: ['Pop', 'K-Pop', 'Hip Hop / Rap', 'Trap', 'EDM', 'Phonk'],
            titleStyle: '짧고 강렬한 1~3단어, 영어 믹스 OK',
            verseTip: '3~4줄, 구체적 학교/SNS 상황',
            chorusTip: '따라 부르기 쉬운 반복 훅, 감탄사 포함'
        },
        'young-adults': {
            label: '2030세대',
            keywords: '번아웃, 현타, 갓생, 워라밸, 소확행, 혼술, 자존감, 손절, 혼밥',
            emotion: '공감, 위로, 현실 인정, 자립, 성장통, 외로움',
            tip: '현실적인 버스(구체적 상황) + 보편적 위로 코러스, 카톡에서 쓸 수 있는 자연스러운 문장',
            avoid: '"다 때가 있어", "젊으니까 괜찮아" 같은 무시하는 어투 금지',
            want: '"그래 힘든 게 당연해", "천천히 가도 괜찮아", "넌 충분해"',
            platform: 'Spotify > YouTube > Apple Music',
            hookTip: '현실 공감 버스 + 위로 코러스 구조, 공유하고 싶은 가사',
            preferredGenres: ['Hip Hop / Rap', 'R&B / Soul', 'Pop', 'K-Pop', 'Indie', 'Lo-Fi'],
            titleStyle: '감성적 문장형 or 직관적 단어, 공유하고 싶은 제목',
            verseTip: '구체적 현실 상황(출근/번아웃/혼밥), 4~6줄',
            chorusTip: '보편적 위로 메시지, 따뜻하지만 현실적'
        },
        'middle-aged': {
            label: '5060세대',
            keywords: '수고했어, 고생 많았어, 힘내, 괜찮아, 최고야, 건강, 워라밸',
            emotion: '인정, 위로, 존재 증명, 그리움, 책임감, 노스탤지어',
            tip: '수고/인정 훅, 젊은 시절 추억 + 현재 감사 대비, 두 세대 언어를 모두 이해하는 가사',
            avoid: '"라떼는 말이야" 같은 꼰대 어투, 젊은 세대 비하 금지',
            want: '"당신은 대단한 사람이에요", "수고했어 오늘도", "당신 덕분이에요"',
            platform: 'YouTube > Spotify > 멜론',
            hookTip: '인정과 수고의 메시지를 코러스에, 구체적 일상(직장/가족) 버스에',
            preferredGenres: ['Pop', 'Rock', 'Ballad', 'R&B / Soul', 'Country / Folk', 'Jazz'],
            titleStyle: '따뜻하고 공감되는 문장형, 쉬운 단어',
            verseTip: '직장/가족/건강 등 구체적 일상, 4~5줄',
            chorusTip: '인정과 위로의 반복 메시지'
        },
        seniors: {
            label: '시니어세대',
            keywords: '감사합니다, 건강하세요, 행복하세요, 축하합니다, 사랑합니다, 세월, 정',
            emotion: '감사, 가족 사랑, 건강 소망, 세월의 지혜, 추억, 그리움',
            tip: '느린 리듬, 완성된 문장, 쉬운 단어, 구체적이고 따뜻한 표현, 존댓말도 자연스럽게 활용',
            avoid: '세대 갈등 강조, 늙었다는 표현, 동정하는 어투 금지',
            want: '"건강하게 오래오래", "함께해서 행복해요", "당신이 있어 감사해요"',
            platform: 'YouTube(절대적 1위) > 라디오 > 멜론',
            hookTip: '반복이 쉬운 단순한 코러스, 가족/건강/감사 키워드 중심',
            preferredGenres: ['Ballad', 'Trot', 'Classical', 'Jazz', 'Country / Folk', 'Pop'],
            titleStyle: '따뜻하고 쉬운 완성된 문장형',
            verseTip: '가족/건강/추억 소재, 3~4줄, 쉬운 단어',
            chorusTip: '반복이 쉬운 단순한 구조, 감사/사랑 키워드'
        }
    };

    // 장르별 기본 송폼 (음악 장르별 송폼 구조 완전 가이드 반영)
    const GENRE_SONGFORM = {
        'pop': ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
        'ballad': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Key Change', 'Chorus', 'Outro'],
        'kpop': ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Rap', 'Pre-Chorus', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
        'jpop': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Interlude', 'Chorus', 'Outro'],
        'hiphop': ['Intro', 'Hook', 'Verse', 'Hook', 'Verse', 'Hook', 'Bridge', 'Hook', 'Outro'],
        'trap': ['Intro', 'Verse', 'Hook', 'Verse', 'Hook', 'Verse', 'Hook', 'Outro'],
        'edm': ['Intro', 'Build Up', 'Drop', 'Breakdown', 'Build Up', 'Drop', 'Outro'],
        'rnb': ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Bridge', 'Ad-lib', 'Chorus', 'Outro'],
        'rock': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Solo', 'Bridge', 'Chorus', 'Outro'],
        'metal': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Solo', 'Bridge', 'Chorus', 'Outro'],
        'punk': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Chorus', 'Outro'],
        'alternative': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
        'jazz': ['Intro', 'Verse', 'Chorus', 'Interlude', 'Verse', 'Chorus', 'Solo', 'Outro'],
        'latin': ['Intro', 'Verse', 'Pre-Chorus', 'Chorus', 'Verse', 'Pre-Chorus', 'Chorus', 'Instrumental', 'Chorus', 'Outro'],
        'reggae': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Instrumental', 'Verse', 'Chorus', 'Outro'],
        'folk': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Fade Out'],
        'country': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
        'gospel': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Ad-lib', 'Outro'],
        'funk': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Instrumental', 'Chorus', 'Outro'],
        'classical': ['Intro', 'Verse', 'Interlude', 'Verse', 'Bridge', 'Verse', 'Outro'],
        'ambient': ['Intro', 'Verse', 'Interlude', 'Verse', 'Outro'],
        'indie': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Fade Out'],
        'trot': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'],
        'default': ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro']
    };

    // 무보컬 섹션
    const NO_LYRICS_SECTIONS = ['Intro', 'Outro', 'Solo', 'Drop', 'Breakdown', 'Instrumental', 'Interlude', 'Build Up', 'Fade Out', 'End', 'Callback', 'Key Change'];

    // 장르별 가사 밀도 (빌보드급 작사 완전 가이드 반영)
    const LYRICS_DENSITY = {
        'ballad': { linesPerSection: 4, syllablesPerLine: '8-12', tip: '멜로디 중심, 은유적 표현, 멜리스마 단어 배치' },
        'pop': { linesPerSection: 6, syllablesPerLine: '8-14', tip: '단순하고 캐치한 표현, 코러스=제목=훅' },
        'kpop': { linesPerSection: 6, syllablesPerLine: '8-16', tip: '한영 믹스, 랩 구간은 밀도 높게' },
        'hiphop': { linesPerSection: 8, syllablesPerLine: '10-18', tip: '라임 밀도 높게, 16마디 기준 100-180음절' },
        'rock': { linesPerSection: 6, syllablesPerLine: '8-14', tip: '파워풀한 동사, 저항/자유 테마' },
        'rnb': { linesPerSection: 5, syllablesPerLine: '8-12', tip: '그루브 우선, 멜리스마 활용' },
        'edm': { linesPerSection: 3, syllablesPerLine: '6-10', tip: '반복이 훅, 최소한의 가사' },
        'jazz': { linesPerSection: 4, syllablesPerLine: '8-12', tip: '세련된 어휘, 즉흥적 프레이징' },
        'folk': { linesPerSection: 6, syllablesPerLine: '8-14', tip: '스토리텔링 중심, 서사적 전개' },
        'default': { linesPerSection: 5, syllablesPerLine: '8-14', tip: '자연스러운 대화체' }
    };

    // === 단계 이동 ===
    function goToStep(step) {
        document.querySelectorAll('.step-page').forEach(p => p.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');
        document.querySelectorAll('.step-item').forEach((item, i) => { const n = i+1; item.classList.remove('active','done'); if (n<step) item.classList.add('done'); else if (n===step) item.classList.add('active'); });
        document.querySelectorAll('.step-line').forEach((l, i) => l.classList.toggle('done', i < step-1));

        const nb = document.getElementById('navButtons');
        if (step === 5) { nb.style.display = 'none'; }
        else { nb.style.display = 'flex'; document.getElementById('btnPrev').style.visibility = step === 1 ? 'hidden' : 'visible'; }

        document.getElementById('navInfo').textContent = `${step} / 5 단계`;
        const btnNext = document.getElementById('btnNext');
        btnNext.disabled = false;

        if (step === 2) { autoFillStep2(); initThemeDropdown(); forceShowDataInfo(); }
        if (step === 4) { autoRecommendSongform(); autoSelectLyricsGen(); }
        if (step === 5) buildFinalOutput();

        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.getElementById('btnPrev').addEventListener('click', () => { if (currentStep > 1) goToStep(currentStep - 1); });
    document.getElementById('btnNext').addEventListener('click', () => { if (currentStep < 5) goToStep(currentStep + 1); });
    document.getElementById('btnPrevStep').addEventListener('click', () => goToStep(4));

    // === 파이프라인 자동 로드 (쉽게/전문가/직접 만들기 → 노래제목&가사생성) ===
    (function checkPipelineData() {
        const sourceLabels = { 'easy': '쉽게 만들기', 'pro': '전문가 모드', 'custom': '직접 만들기' };
        const keys = ['suno-pipeline-easy', 'suno-pipeline-pro', 'suno-pipeline-custom'];
        let loaded = null, usedKey = null;
        for (const key of keys) {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            try {
                const data = JSON.parse(raw);
                if (data && data.stylePrompt) { loaded = data; usedKey = key; break; }
            } catch (e) {}
        }
        if (!loaded) return;
        state.promptData = loaded;
        showLoadedPrompt();
        localStorage.removeItem(usedKey);
        const label = sourceLabels[loaded.source] || '이전 단계';
        const notice = document.createElement('div');
        notice.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#00b894,#6c5ce7);color:white;padding:12px 28px;border-radius:999px;font-weight:700;font-size:1rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.25);';
        notice.textContent = `✅ ${label} 데이터가 자동으로 불러와졌습니다!`;
        document.body.appendChild(notice);
        setTimeout(() => notice.remove(), 3000);
    })();

    // === STEP 1: 데이터 불러오기 ===
    document.getElementById('btnLoadFromLibrary').addEventListener('click', () => {
        const lib = JSON.parse(localStorage.getItem('suno-master-library') || '[]');
        const list = document.getElementById('librarySelectList');
        list.innerHTML = lib.length === 0 ? '<p style="padding:20px;text-align:center;color:var(--text-secondary);">보관함이 비어있습니다.</p>' :
            lib.map((item, i) => `<div class="library-select-item" data-idx="${i}"><div class="lib-sel-title">${(item.genres||[]).join(' + ') || '프롬프트'} - ${new Date(item.createdAt).toLocaleDateString('ko-KR')}</div><div class="lib-sel-preview">${(item.stylePrompt||'').substring(0,80)}...</div></div>`).join('');
        list.querySelectorAll('.library-select-item').forEach(item => {
            item.addEventListener('click', () => {
                state.promptData = lib[parseInt(item.dataset.idx)];
                state.promptData.fileName = (state.promptData.genres||[]).join(' + ') + ' - 보관함';
                showLoadedPrompt();
                document.getElementById('libraryPopup').classList.remove('active');
            });
        });
        document.getElementById('libraryPopup').classList.add('active');
    });
    document.getElementById('libraryPopupClose').addEventListener('click', () => document.getElementById('libraryPopup').classList.remove('active'));
    document.getElementById('libraryPopup').addEventListener('click', (e) => { if (e.target.id === 'libraryPopup') e.target.classList.remove('active'); });

    document.getElementById('fileLoadPrompt').addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const c = ev.target.result;
            try { const j = JSON.parse(c); if (Array.isArray(j) && j[0]) { state.promptData = j[0]; state.promptData.fileName = file.name; showLoadedPrompt(); return; } } catch {}
            const sm = c.match(/\[Style Prompt\]\s*\n([\s\S]*?)(?=\n={3,})/);
            if (sm) {
                state.promptData = { stylePrompt: sm[1].trim(), genres: [], mood: [], target: [], place: [], excludeStyles: '', explanation: '', fileName: file.name };
                const gm = c.match(/-\s*장르:\s*(.+)/); if (gm) state.promptData.genres = gm[1].trim().split(/\s*\+\s*/);
                const tm = c.match(/-\s*타겟층:\s*(.+)/); if (tm) state.promptData.target = tm[1].trim().split(',').map(s => s.trim());
                const pm = c.match(/-\s*장소:\s*(.+)/); if (pm) state.promptData.place = pm[1].trim().split(',').map(s => s.trim());
                const mm = c.match(/-\s*분위기:\s*(.+)/); if (mm) state.promptData.mood = mm[1].trim().split(',').map(s => s.trim());
                const em = c.match(/\[Exclude Styles\]\s*\n([\s\S]*?)(?=\n={3,})/); if (em) state.promptData.excludeStyles = em[1].trim();
                const wm = c.match(/Weirdness:\s*(\d+)%/); if (wm) state.promptData.weirdness = parseInt(wm[1]);
                const sim = c.match(/Style Influence:\s*(\d+)%/); if (sim) state.promptData.styleInfluence = parseInt(sim[1]);
                const exm = c.match(/\[한국어 설명\]\s*\n([\s\S]*?)(?=\n={3,})/); if (exm) state.promptData.explanation = exm[1].trim();
                const dm = c.match(/생성일시:\s*(.+)/); if (dm) state.promptData.createdAt = dm[1].trim();
                showLoadedPrompt();
            }
        };
        reader.readAsText(file, 'UTF-8'); e.target.value = '';
    });

    // === 주제 선택 (흐름: 연령대 → 노래주제 → 장소/상황 → 스토리) ===
    let themeDropdownInitialized = false;
    let selectedStoryData = null;

    function initThemeDropdown() {
        if (themeDropdownInitialized) return;
        themeDropdownInitialized = true;

        const mainSelect = document.getElementById('themeDirectSelect');
        const ageGroupBtns = document.getElementById('ageGroupBtns');
        const themeDropdownArea = document.getElementById('themeDropdownArea');
        const situationArea = document.getElementById('situationArea');
        const situationSelect = document.getElementById('situationSelect');
        const btnRegenSituations = document.getElementById('btnRegenSituations');
        const storiesArea = document.getElementById('themeStoriesArea');
        const storiesTitle = document.getElementById('themeStoriesTitle');
        const recreatedList = document.getElementById('recreatedStoriesList');
        const btnApply = document.getElementById('btnApplyStory');

        if (!mainSelect) return;

        let selectedAge = ''; // 선택된 연령대 (단일 선택)
        let selectedSituation = null; // 선택된 장소/상황
        let currentThemeName = '';

        // 31개 주제 (감정/스토리 22개 + 일상/상황 9개)
        const themeList = [
            // 감정/스토리 기반
            { id: 1, name: '사랑과 연애', emoji: '💕' },
            { id: 2, name: '이별과 상실', emoji: '💔' },
            { id: 3, name: '나를 찾아가는 여정', emoji: '🧭' },
            { id: 4, name: '다시 일어서는 힘', emoji: '💪' },
            { id: 5, name: '그리움과 향수', emoji: '🌅' },
            { id: 6, name: '가족이라는 이름', emoji: '👨‍👩‍👧‍👦' },
            { id: 7, name: '우정과 인연', emoji: '🤝' },
            { id: 8, name: '외로움과 고독', emoji: '🌙' },
            { id: 9, name: '밤과 새벽의 감정', emoji: '🌃' },
            { id: 10, name: '파티와 자유', emoji: '🎉' },
            { id: 11, name: '위로와 치유', emoji: '🩹' },
            { id: 12, name: '세상을 향한 목소리', emoji: '📢' },
            { id: 13, name: '욕망과 갈망', emoji: '🔥' },
            { id: 14, name: '여행과 떠남', emoji: '✈️' },
            { id: 15, name: '신앙과 감사', emoji: '🙏' },
            { id: 16, name: '꿈과 미래', emoji: '⭐' },
            { id: 17, name: '용서와 화해', emoji: '🕊️' },
            { id: 18, name: '중독과 집착', emoji: '🔗' },
            { id: 19, name: '비밀과 거짓말', emoji: '🤫' },
            { id: 20, name: '도시의 삶', emoji: '🏙️' },
            { id: 21, name: '자연과 계절', emoji: '🍃' },
            { id: 22, name: '운명과 만남', emoji: '✨' },
            // 일상/상황 기반
            { id: 23, name: '출퇴근길', emoji: '🚇' },
            { id: 24, name: '카페', emoji: '☕' },
            { id: 25, name: '업무/집중', emoji: '💼' },
            { id: 26, name: '집/사무실', emoji: '🏠' },
            { id: 27, name: '운동/산책', emoji: '🏃' },
            { id: 28, name: '드라이브', emoji: '🚗' },
            { id: 29, name: '여행', emoji: '🧳' },
            { id: 30, name: '힐링', emoji: '🧘' },
            { id: 31, name: '독서', emoji: '📖' }
        ];

        // 주제 드롭다운 구성
        themeList.forEach((t, idx) => {
            // 일상/상황 기반 섹션 구분선
            if (t.id === 23 && idx > 0) {
                const sep = document.createElement('option');
                sep.disabled = true;
                sep.textContent = '── 일상/상황 기반 ──';
                mainSelect.appendChild(sep);
            }
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.emoji} ${t.name}`;
            mainSelect.appendChild(opt);
        });

        // 연령대 버튼 목록
        const ageOptions = [
            { value: '10대', label: '10대' },
            { value: '2030세대', label: '2030세대' },
            { value: '5060세대', label: '5060세대' },
            { value: '시니어세대', label: '시니어세대' }
        ];

        // === 노래주제 × 연령대 연동 장소/상황 생성 ===
        function generateSituations() {
            const age = selectedAge || '2030세대';
            const theme = currentThemeName;

            // 노래주제별 × 연령대별 장소/상황 데이터
            // 각 세대의 문화·언어·생활환경에 맞게 재창조
            const themeAgeSituations = {
                // ===== 감정/스토리 기반 주제 =====
                '사랑과 연애': {
                    '10대': [
                        { emoji: '📝', label: '쪽지 돌리다 들킨 자습시간의 고백' },
                        { emoji: '🚶', label: '학교 끝나고 일부러 돌아가는 귀갓길' },
                        { emoji: '📱', label: 'DM으로 시작된 두근거리는 대화' },
                        { emoji: '🎡', label: '놀이공원에서 손잡을 핑계를 찾는 오후' },
                        { emoji: '🎵', label: '같은 플레이리스트 공유하며 가까워진 사이' },
                        { emoji: '🏫', label: '짝꿍 바뀌는 날 제비뽑기의 떨림' }
                    ],
                    '2030세대': [
                        { emoji: '☕', label: '카페에서의 우연한 만남' },
                        { emoji: '🌧️', label: '비 오는 날 같은 우산 아래' },
                        { emoji: '🍸', label: '바에서 눈이 마주친 순간' },
                        { emoji: '📱', label: 'SNS에서 시작된 썸' },
                        { emoji: '🚗', label: '밤 드라이브에서 손잡은 첫 순간' },
                        { emoji: '🏠', label: '현관문 열었을 때 반기는 사람이 있는 저녁' }
                    ],
                    '5060세대': [
                        { emoji: '💑', label: '결혼기념일에 오랜만에 둘이서 외출' },
                        { emoji: '🌹', label: '아내에게 처음으로 꽃을 건네본 날' },
                        { emoji: '🚗', label: '아내와 말없이 달리는 가을 국도' },
                        { emoji: '📸', label: '앨범 속 연애시절 사진을 꺼내 보며' },
                        { emoji: '🍶', label: '포장마차에서 꺼낸 첫사랑 이야기' },
                        { emoji: '🌅', label: '제주 바닷가에서 함께 본 일출' }
                    ],
                    '시니어세대': [
                        { emoji: '💑', label: '할아버지 할머니가 손잡고 걷는 석양길' },
                        { emoji: '🌹', label: '금혼식 날 처음으로 건넨 장미꽃 한 송이' },
                        { emoji: '📸', label: '흑백사진 속 젊은 날의 우리가 반갑다' },
                        { emoji: '🍵', label: '차 한 잔 앞에 두고 나누는 평생의 이야기' },
                        { emoji: '🏔️', label: '신혼여행지를 다시 찾은 날의 감회' }
                    ]
                },
                '이별과 상실': {
                    '10대': [
                        { emoji: '🎓', label: '졸업식 날 말하지 못한 마지막 인사' },
                        { emoji: '💍', label: '100일 커플반지 빼서 서랍에 넣은 날' },
                        { emoji: '👋', label: '전학 간 친구를 배웅한 교문 앞' },
                        { emoji: '📱', label: '카톡 프로필 사진 바꾸며 울었던 밤' },
                        { emoji: '🎧', label: '이별 노래만 골라 듣는 새벽 이불 속' }
                    ],
                    '2030세대': [
                        { emoji: '📦', label: '이사하는 날의 마지막 인사' },
                        { emoji: '☕', label: '단골 카페 늘 앉던 자리가 비어 있는 오후' },
                        { emoji: '🚪', label: '현관문 닫히는 소리가 유독 크게 들린 밤' },
                        { emoji: '📞', label: '새벽 2시 걸려온 전화를 받지 못한 후회' },
                        { emoji: '🌧️', label: '비 오는 날 혼자 걷는 예전 같이 걷던 길' }
                    ],
                    '5060세대': [
                        { emoji: '🏠', label: '아이들 독립한 뒤 조용해진 거실' },
                        { emoji: '🏢', label: '정년 앞두고 책상 정리하는 마지막 날' },
                        { emoji: '📸', label: '앨범 속 빛바랜 사진을 꺼내 본 밤' },
                        { emoji: '🍲', label: '혼자 차린 밥상이 유독 크게 느껴지는 저녁' },
                        { emoji: '👋', label: '동창회에서 빈 자리를 보며 느끼는 허전함' }
                    ],
                    '시니어세대': [
                        { emoji: '🏠', label: '텅 빈 집에 울리는 시계 소리의 무게' },
                        { emoji: '🌙', label: '보름달 뜬 밤, 먼저 간 벗이 그리운 시간' },
                        { emoji: '👋', label: '먼저 간 친구 묘소에 다녀온 날' },
                        { emoji: '📸', label: '서랍 속 흑백사진이 데려간 그 시절' },
                        { emoji: '📞', label: '전화번호는 있는데 전화할 수 없는 그 사람' }
                    ]
                },
                '나를 찾아가는 여정': {
                    '10대': [
                        { emoji: '📖', label: '진로 상담 후 혼란스러운 하굣길' },
                        { emoji: '🎧', label: '나만의 플레이리스트 만들며 찾은 취향' },
                        { emoji: '✏️', label: '일기장에 꿈을 적어보는 새벽' },
                        { emoji: '🏃', label: '체육대회에서 나도 할 수 있다는 걸 알게 된 순간' }
                    ],
                    '2030세대': [
                        { emoji: '✈️', label: '혼자 떠난 첫 해외여행' },
                        { emoji: '💻', label: '새벽까지 코드를 쓰다 발견한 새로운 나' },
                        { emoji: '🏋️', label: '땀 흘리며 어제의 나를 이겨내는 새벽' },
                        { emoji: '📚', label: '서점에서 우연히 집은 책이 바꾼 하루' }
                    ],
                    '5060세대': [
                        { emoji: '📚', label: '은퇴 후 처음 다시 편 책의 첫 장' },
                        { emoji: '🎨', label: '늦깎이 취미로 시작한 그림 수업' },
                        { emoji: '🚶', label: '단풍 든 산길을 걸으며 인생을 돌아보다' },
                        { emoji: '🏃', label: '건강 위해 시작한 새벽 운동의 뿌듯함' }
                    ],
                    '시니어세대': [
                        { emoji: '📖', label: '큰 글씨 책 읽으며 보내는 오후의 소소한 행복' },
                        { emoji: '🪴', label: '손수 가꾼 화분에 꽃이 핀 아침의 기쁨' },
                        { emoji: '✨', label: '아침 햇살에 감사한 또 하루의 시작' },
                        { emoji: '🎤', label: '노래방에서 십팔번 부르며 되찾는 청춘' }
                    ]
                },
                '다시 일어서는 힘': {
                    '10대': [
                        { emoji: '📝', label: '시험 망치고 다시 책 편 늦은 밤' },
                        { emoji: '🏃', label: '넘어져도 다시 뛰어간 운동회' },
                        { emoji: '👊', label: '친구의 응원 한마디에 다시 힘이 난 순간' },
                        { emoji: '🌅', label: '울다 잠들었는데 아침이 와 있는 창문' }
                    ],
                    '2030세대': [
                        { emoji: '🏢', label: '야근 끝 텅 빈 사무실에서 다짐한 내일' },
                        { emoji: '💪', label: '퇴사 후 처음 맞는 아침의 자유와 불안' },
                        { emoji: '🌧️', label: '비 맞으며 걷다 갠 하늘을 본 순간' },
                        { emoji: '📦', label: '이사 후 텅 빈 방에서 시작하는 새 출발' }
                    ],
                    '5060세대': [
                        { emoji: '🤝', label: '후배에게 자리 넘기며 건넨 한마디의 무게' },
                        { emoji: '🏔️', label: '산 정상에서 바라본 세상이 다르게 보이다' },
                        { emoji: '🌅', label: '새벽 일출을 보며 다시 시작할 용기를 얻다' },
                        { emoji: '📻', label: '라디오에서 들린 노래가 힘이 된 아침' }
                    ],
                    '시니어세대': [
                        { emoji: '🏥', label: '병원 다녀온 뒤에도 웃을 수 있는 하루' },
                        { emoji: '🌳', label: '공원 벤치에서 바라본 봄이 다시 온 풍경' },
                        { emoji: '📞', label: '자식의 안부 전화 한 통에 힘이 솟는 저녁' },
                        { emoji: '🍃', label: '봄꽃 피는 걸 보며 올해도 왔구나 싶은 마음' }
                    ]
                },
                '그리움과 향수': {
                    '10대': [
                        { emoji: '📸', label: '폰 갤러리에서 우연히 본 작년 사진' },
                        { emoji: '🏫', label: '졸업 후 텅 빈 교실을 지나가다' },
                        { emoji: '🎵', label: '예전에 같이 듣던 노래가 갑자기 추천에 뜬 순간' },
                        { emoji: '👋', label: '전학 간 친구를 우연히 다시 만난 날' }
                    ],
                    '2030세대': [
                        { emoji: '📸', label: '우연히 발견한 오래된 사진' },
                        { emoji: '🌆', label: '고향 골목이 갑자기 떠오른 퇴근길' },
                        { emoji: '🍜', label: '엄마가 끓여주던 그 맛이 그리운 밤' },
                        { emoji: '👋', label: '오래간만에 다시 만난 그 사람' }
                    ],
                    '5060세대': [
                        { emoji: '📸', label: '서랍 속 빛바랜 사진이 데려간 그때 그 시절' },
                        { emoji: '🛣️', label: '고향 가는 길, 창밖으로 스치는 추억' },
                        { emoji: '🎵', label: '우연히 들린 옛 노래에 발걸음이 멈추다' },
                        { emoji: '👋', label: '동창회에서 수십 년 만에 다시 만난 그 사람' }
                    ],
                    '시니어세대': [
                        { emoji: '📸', label: '흑백사진 속 젊은 우리가 낯설기도 반갑기도' },
                        { emoji: '🌧️', label: '빗소리 들으며 고향 생각에 젖는 오후' },
                        { emoji: '🛣️', label: '고향 마을 어귀에 닿았을 때 코끝에 스친 바람' },
                        { emoji: '📞', label: '오랜만에 들린 옛 동네 친구의 목소리' }
                    ]
                },
                '가족이라는 이름': {
                    '10대': [
                        { emoji: '😤', label: '엄마랑 싸우고 방에 틀어박힌 저녁' },
                        { emoji: '🎂', label: '깜짝 생일파티에 울어버린 순간' },
                        { emoji: '🍳', label: '집에 아무도 없을 때 처음 해본 계란볶음밥' },
                        { emoji: '📞', label: '할머니한테 전화 온 날 괜히 울컥한 밤' }
                    ],
                    '2030세대': [
                        { emoji: '📞', label: '부모님께 안부 전화 거는 퇴근길' },
                        { emoji: '🍲', label: '명절에 온 가족이 모인 거실의 소란함' },
                        { emoji: '🏠', label: '독립 후 텅 빈 방에서 집이 그리운 밤' },
                        { emoji: '📦', label: '부모님이 보내주신 택배 열어보는 순간' }
                    ],
                    '5060세대': [
                        { emoji: '🏠', label: '아이들 독립한 뒤 조용해진 거실의 적막' },
                        { emoji: '🎉', label: '명절에 온 가족이 모인 거실의 웃음소리' },
                        { emoji: '👴', label: '돌아가신 부모님 생각에 목이 메는 추석' },
                        { emoji: '📞', label: '자식에게 먼저 전화하기 망설이는 저녁' }
                    ],
                    '시니어세대': [
                        { emoji: '🎂', label: '칠순잔치에 모인 온 가족의 축하' },
                        { emoji: '📞', label: '자식에게서 온 안부 전화 한 통의 따뜻함' },
                        { emoji: '👶', label: '손주를 처음 안았을 때의 벅찬 감동' },
                        { emoji: '🍲', label: '며느리에게 전수하는 우리 집 김치 비법' }
                    ]
                },
                '우정과 인연': {
                    '10대': [
                        { emoji: '🍦', label: '편의점 앞에서 아이스크림 나눠 먹는 방과 후' },
                        { emoji: '🎒', label: '수학여행 버스 안에서 몰래 주고받은 간식' },
                        { emoji: '🌙', label: '새벽에 친구랑 통화하다 잠든 밤' },
                        { emoji: '🌸', label: '벚꽃 터널 밑에서 찍은 단체 셀카' }
                    ],
                    '2030세대': [
                        { emoji: '🍻', label: '회식 후 2차에서 나눈 진짜 속마음' },
                        { emoji: '🥳', label: '각자 음식 하나씩 들고 모인 홈파티' },
                        { emoji: '✈️', label: '친구와 무계획으로 떠난 급발진 여행' },
                        { emoji: '🎵', label: '음악이 연결해준 순간' }
                    ],
                    '5060세대': [
                        { emoji: '🍶', label: '오래된 단골 포장마차에서 소주 한 잔' },
                        { emoji: '👋', label: '동창회에서 수십 년 만에 다시 만난 그 사람' },
                        { emoji: '🚶', label: '이른 아침 공원 산책길에서 만난 이웃' },
                        { emoji: '📞', label: '오랜 친구에게서 온 뜻밖의 안부 전화' }
                    ],
                    '시니어세대': [
                        { emoji: '🫖', label: '경로당 옆 찻집에서 벗님과 나누는 담소' },
                        { emoji: '🍶', label: '옛 동료와 막걸리 한 사발 기울이며 추억담' },
                        { emoji: '🌳', label: '공원 벤치에서 매일 만나는 산책 벗' },
                        { emoji: '📞', label: '오랜만에 들린 옛 동네 친구의 목소리' }
                    ]
                },
                '외로움과 고독': {
                    '10대': [
                        { emoji: '🛏️', label: '이불 속에서 유튜브 보다 잠든 새벽' },
                        { emoji: '🎧', label: '방문 잠그고 혼자 음악 듣는 밤' },
                        { emoji: '🏫', label: '점심시간에 혼자 앉아 있는 교실 구석' },
                        { emoji: '🌙', label: '아무도 모르게 울었던 새벽' }
                    ],
                    '2030세대': [
                        { emoji: '🏠', label: '혼자 사는 원룸의 조용한 밤' },
                        { emoji: '🍺', label: '혼자 마시는 맥주가 유독 맛있는 금요일' },
                        { emoji: '🌙', label: '새벽 감성이 밀려오는 시간' },
                        { emoji: '🚇', label: '만원 지하철 속에서도 혼자인 느낌' }
                    ],
                    '5060세대': [
                        { emoji: '🏠', label: '아이들 독립한 뒤 조용해진 거실' },
                        { emoji: '🍲', label: '혼자 차린 밥상이 유독 크게 느껴지는 저녁' },
                        { emoji: '🌙', label: '잠 못 이루는 밤, 창밖 달을 보다' },
                        { emoji: '📻', label: '라디오에서 흘러나온 옛날 노래에 눈물' }
                    ],
                    '시니어세대': [
                        { emoji: '🏠', label: '텅 빈 집에 울리는 시계 소리와 함께하는 저녁' },
                        { emoji: '🌙', label: '보름달 뜬 밤, 먼저 간 벗이 그리운 시간' },
                        { emoji: '📻', label: '라디오에서 나오는 옛날 가요에 눈시울 붉어지다' },
                        { emoji: '🚶', label: '늙은 반려견과 느릿느릿 걷는 저녁 산책' }
                    ]
                },
                '밤과 새벽의 감정': {
                    '10대': [
                        { emoji: '🌙', label: '새벽에 친구랑 통화하다 잠든 밤' },
                        { emoji: '🛏️', label: '이불 속에서 폰 보다 울었던 새벽' },
                        { emoji: '🎧', label: '새벽 3시 감성 플레이리스트 무한반복' },
                        { emoji: '💭', label: '내일 고백할까 말까 뒤척이는 밤' }
                    ],
                    '2030세대': [
                        { emoji: '🌃', label: '새벽 드라이브 끝에 도착한 바다' },
                        { emoji: '🛣️', label: '아무 목적지 없이 달리는 밤' },
                        { emoji: '📞', label: '새벽 2시에 온 전화 한 통' },
                        { emoji: '🍸', label: '조명 낮은 바에서 기울인 한 잔' }
                    ],
                    '5060세대': [
                        { emoji: '🌃', label: '잠 안 오는 밤 무작정 차 끌고 나온 바닷가' },
                        { emoji: '📻', label: '옛 카세트 테이프 틀어놓고 달리는 밤길' },
                        { emoji: '🌉', label: '다리 위에서 내려다본 도시 불빛' },
                        { emoji: '🍶', label: '혼자 반주 한 잔에 옛 노래 흥얼거리는 밤' }
                    ],
                    '시니어세대': [
                        { emoji: '🌃', label: '잠 못 드는 밤 창밖에 비치는 가로등 불빛' },
                        { emoji: '🍶', label: '혼자 데운 막걸리에 옛 노래 흥얼거리는 밤' },
                        { emoji: '📻', label: '라디오 야간 프로에서 들려오는 옛 노래' },
                        { emoji: '📸', label: '서랍 속 흑백사진 꺼내 보며 그 시절을 그리다' }
                    ]
                },
                '파티와 자유': {
                    '10대': [
                        { emoji: '🎂', label: '친구 생일에 깜짝 파티 준비한 우리 집' },
                        { emoji: '🎉', label: '축제 끝나고 교실에서 벌인 뒤풀이' },
                        { emoji: '🏖️', label: '바다에서 파도 맞으며 소리 지른 여름' },
                        { emoji: '🚲', label: '자전거 타고 한강까지 달린 여름밤' }
                    ],
                    '2030세대': [
                        { emoji: '🥳', label: '각자 음식 하나씩 들고 모인 홈파티 밤' },
                        { emoji: '🎷', label: '재즈가 흐르는 라운지 구석 자리' },
                        { emoji: '🌃', label: '새벽 드라이브 끝에 도착한 바다' },
                        { emoji: '🎵', label: '페스티벌에서 모르는 사람과 떼창하는 순간' }
                    ],
                    '5060세대': [
                        { emoji: '🎉', label: '명절에 온 가족이 모인 거실의 웃음소리' },
                        { emoji: '🎵', label: '라이브 카페에서 청춘 시절 노래를 듣다' },
                        { emoji: '🏔️', label: '은퇴 후 처음 간 해외여행의 설렘' },
                        { emoji: '🍶', label: '동창회 2차 노래방에서 목 놓아 부르다' }
                    ],
                    '시니어세대': [
                        { emoji: '🎂', label: '칠순잔치에 모인 온 가족의 축하' },
                        { emoji: '🎤', label: '노래방에서 젊은 시절 십팔번 부르던 그 노래' },
                        { emoji: '🤸', label: '경로당 체조 시간에 맞춰 나가는 즐거움' },
                        { emoji: '🌅', label: '바닷가에서 노을 보며 살아온 날들에 감사하다' }
                    ]
                },
                '위로와 치유': {
                    '10대': [
                        { emoji: '🍦', label: '친구가 아무 말 없이 아이스크림 사다 준 날' },
                        { emoji: '🐕', label: '강아지 산책시키다 마음이 풀린 저녁' },
                        { emoji: '✨', label: '뜻밖의 칭찬 한마디에 하루가 빛난 순간' },
                        { emoji: '🎧', label: '위로가 되는 노래를 찾아 듣는 새벽' }
                    ],
                    '2030세대': [
                        { emoji: '🌳', label: '이어폰 없이 걷는 동네 한 바퀴' },
                        { emoji: '🌧️', label: '비 오는 날의 우연한 위로' },
                        { emoji: '✨', label: '일상 속 작은 기적' },
                        { emoji: '🎁', label: '아무 이유 없는 날의 선물' }
                    ],
                    '5060세대': [
                        { emoji: '🚶', label: '이른 아침 공원 산책길에서 만난 이웃의 인사' },
                        { emoji: '🪴', label: '베란다 화분에 물 주며 마음이 편해지는 아침' },
                        { emoji: '🐕', label: '반려견과 매일 같은 시간 같은 길을 걷다' },
                        { emoji: '✨', label: '손주의 웃음에 세상이 환해지는 순간' }
                    ],
                    '시니어세대': [
                        { emoji: '🪴', label: '손수 가꾼 화분에 꽃이 핀 아침의 기쁨' },
                        { emoji: '☕', label: '손주가 사다 준 커피 처음 마셔본 날' },
                        { emoji: '🎵', label: '손주가 틀어준 노래가 내 젊은 날 노래였을 때' },
                        { emoji: '📞', label: '자식에게서 온 안부 전화 한 통의 따뜻함' }
                    ]
                },
                '세상을 향한 목소리': {
                    '10대': [
                        { emoji: '📢', label: '교실에서 부당함에 처음 목소리 낸 순간' },
                        { emoji: '✊', label: '친구를 위해 대신 나서준 점심시간' },
                        { emoji: '📝', label: 'SNS에 처음 내 생각을 올린 날' }
                    ],
                    '2030세대': [
                        { emoji: '📢', label: '부당한 야근에 처음 목소리 낸 퇴근 후' },
                        { emoji: '🌇', label: '점심시간 옥상에서 본 하늘 아래 다짐' },
                        { emoji: '✊', label: '광장에서 함께 외친 우리의 목소리' }
                    ],
                    '5060세대': [
                        { emoji: '📢', label: '세월의 경험으로 건네는 진심 어린 조언' },
                        { emoji: '🤝', label: '후배에게 자리 넘기며 건넨 한마디' },
                        { emoji: '📰', label: '신문 칼럼에 실린 내 이야기' }
                    ],
                    '시니어세대': [
                        { emoji: '📢', label: '평생 경험에서 우러나온 지혜의 말씀' },
                        { emoji: '📋', label: '수십 년 모은 명함첩에 담긴 인생 이야기' },
                        { emoji: '🫖', label: '찻집에서 후배들에게 전하는 인생 조언' }
                    ]
                },
                '욕망과 갈망': {
                    '10대': [
                        { emoji: '⭐', label: '연예인 꿈을 꾸며 거울 앞에서 연습하는 밤' },
                        { emoji: '🎮', label: '게임 1등 하고 싶어서 밤새운 새벽' },
                        { emoji: '💕', label: '좋아하는 사람 앞에서 멋져 보이고 싶은 마음' }
                    ],
                    '2030세대': [
                        { emoji: '🔥', label: '원하는 것을 위해 불태우는 새벽' },
                        { emoji: '🏙️', label: '도시의 네온사인처럼 끝없이 타오르는 야망' },
                        { emoji: '🍸', label: '성공을 꿈꾸며 기울인 한 잔의 결의' }
                    ],
                    '5060세대': [
                        { emoji: '🌅', label: '새벽 일출을 보며 아직 남은 꿈을 되새기다' },
                        { emoji: '🎨', label: '은퇴 후 품었던 꿈을 시작하는 첫 걸음' },
                        { emoji: '🚗', label: '갖고 싶었던 차를 드디어 몬 날' }
                    ],
                    '시니어세대': [
                        { emoji: '🏔️', label: '젊을 적 못 가본 곳을 꼭 가보고 싶은 마음' },
                        { emoji: '📖', label: '쓰고 싶었던 자서전 첫 장을 여는 날' },
                        { emoji: '🌅', label: '바닷가에서 노을 보며 아직 하고 싶은 것들' }
                    ]
                },
                '여행과 떠남': {
                    '10대': [
                        { emoji: '🎒', label: '수학여행 버스 안에서 몰래 주고받은 간식' },
                        { emoji: '⛺', label: '친구들이랑 처음 간 캠핑에서 뜬 밤' },
                        { emoji: '🏖️', label: '바다에서 파도 맞으며 소리 지른 여름' },
                        { emoji: '🛤️', label: '기차 타고 처음 가본 낯선 도시' }
                    ],
                    '2030세대': [
                        { emoji: '✈️', label: '공항 게이트 앞 새로운 시작' },
                        { emoji: '🗺️', label: '낯선 도시 골목에서 길을 잃다' },
                        { emoji: '🌅', label: '여행지에서 본 생애 첫 일출' },
                        { emoji: '🚗', label: '밤 도로 위 헤드라이트만 보이는 길' }
                    ],
                    '5060세대': [
                        { emoji: '🚂', label: '기차 타고 떠난 소도시 느린 여행' },
                        { emoji: '🏔️', label: '은퇴 후 처음 간 해외여행의 설렘' },
                        { emoji: '🌅', label: '제주 바닷가에서 본 일출에 눈물이 나다' },
                        { emoji: '🛣️', label: '고향 가는 길, 창밖으로 스치는 추억' }
                    ],
                    '시니어세대': [
                        { emoji: '🚂', label: '경로 우대로 기차 타고 떠난 당일치기 나들이' },
                        { emoji: '🏔️', label: '젊을 적 신혼여행지를 다시 찾은 날' },
                        { emoji: '🌅', label: '바닷가에서 노을 보며 살아온 날들에 감사하다' },
                        { emoji: '🚗', label: '아들 차 타고 오랜만에 나온 나들이' }
                    ]
                },
                '신앙과 감사': {
                    '10대': [
                        { emoji: '🙏', label: '시험 전날 간절히 기도한 밤' },
                        { emoji: '✨', label: '뜻밖의 칭찬 한마디에 감사한 순간' },
                        { emoji: '🌅', label: '힘든 하루 끝에 본 예쁜 석양에 감동' }
                    ],
                    '2030세대': [
                        { emoji: '🙏', label: '힘든 하루 끝에 감사를 되새기는 밤' },
                        { emoji: '✨', label: '일상 속 작은 기적에 감사한 순간' },
                        { emoji: '🌅', label: '여행지 일출을 보며 경건해진 마음' }
                    ],
                    '5060세대': [
                        { emoji: '🙏', label: '건강하게 하루를 마칠 수 있음에 감사' },
                        { emoji: '🌅', label: '새벽 기도 후 밝아오는 하늘의 은혜' },
                        { emoji: '👴', label: '돌아가신 부모님께 감사 인사를 전하는 추석' }
                    ],
                    '시니어세대': [
                        { emoji: '✨', label: '아침 햇살에 감사한 또 하루의 시작' },
                        { emoji: '🙏', label: '살아 있음에 감사하며 올리는 아침 기도' },
                        { emoji: '🌅', label: '바닷가에서 노을 보며 살아온 날들에 감사하다' }
                    ]
                },
                '꿈과 미래': {
                    '10대': [
                        { emoji: '⭐', label: '장래희망 칸에 뭘 쓸지 고민하는 밤' },
                        { emoji: '✏️', label: '일기장에 꿈을 적어보는 새벽' },
                        { emoji: '🎓', label: '대학 합격 상상하며 공부하는 도서관' },
                        { emoji: '🎵', label: '가수가 되고 싶어 몰래 노래 연습하는 방과 후' }
                    ],
                    '2030세대': [
                        { emoji: '⭐', label: '꿈을 위해 새벽에 일어나는 매일의 다짐' },
                        { emoji: '💻', label: '사이드 프로젝트에 몰두하는 퇴근 후의 열정' },
                        { emoji: '✈️', label: '새로운 도시에서 새 삶을 시작하는 설렘' }
                    ],
                    '5060세대': [
                        { emoji: '🎨', label: '은퇴 후 꿈꾸던 취미를 시작하는 첫 날' },
                        { emoji: '📚', label: '늦깎이 공부를 시작하며 느끼는 청춘' },
                        { emoji: '🌅', label: '인생 2막을 준비하며 바라본 새벽 하늘' }
                    ],
                    '시니어세대': [
                        { emoji: '📖', label: '쓰고 싶었던 자서전 첫 장을 여는 설렘' },
                        { emoji: '👶', label: '손주의 미래를 위해 기도하는 밤' },
                        { emoji: '🪴', label: '내년 봄에도 꽃이 피기를 바라는 마음' }
                    ]
                },
                '용서와 화해': {
                    '10대': [
                        { emoji: '🤝', label: '싸운 친구와 먼저 말 건넨 점심시간' },
                        { emoji: '😢', label: '엄마한테 미안하다고 처음 말한 밤' },
                        { emoji: '📝', label: '편지로 전한 사과의 마음' }
                    ],
                    '2030세대': [
                        { emoji: '📞', label: '오래 연락 끊겼던 친구에게 먼저 건 전화' },
                        { emoji: '☕', label: '화해하자고 잡은 카페 약속' },
                        { emoji: '🚶', label: '비 온 뒤 맑아진 하늘처럼 풀린 마음' }
                    ],
                    '5060세대': [
                        { emoji: '📞', label: '수십 년 앙금 풀고 건넨 안부 전화' },
                        { emoji: '🍶', label: '오해 풀고 마주 앉아 마시는 소주 한 잔' },
                        { emoji: '🤝', label: '형제자매와 오랜 서운함을 풀어낸 명절' }
                    ],
                    '시니어세대': [
                        { emoji: '📞', label: '먼저 간 친구에게 못 전한 미안함' },
                        { emoji: '🙏', label: '살면서 미안했던 사람들을 떠올리는 밤' },
                        { emoji: '🤝', label: '오랜 원수와 악수하며 풀어낸 평생의 앙금' }
                    ]
                },
                '중독과 집착': {
                    '10대': [
                        { emoji: '🎮', label: '게임하다 새벽 3시, 내일 시험인데 어쩌지' },
                        { emoji: '📱', label: '읽씹당한 카톡 확인하며 뒤척이는 밤' },
                        { emoji: '💕', label: '좋아하는 애 인스타 계속 새로고침하는 나' }
                    ],
                    '2030세대': [
                        { emoji: '📱', label: '헤어진 사람 SNS를 몰래 확인하는 새벽' },
                        { emoji: '🍸', label: '한 잔이 열 잔이 되는 금요일 밤' },
                        { emoji: '🔗', label: '끊어야 할 관계를 놓지 못하는 나' }
                    ],
                    '5060세대': [
                        { emoji: '📸', label: '꺼내봐야 아픈 줄 알면서 여는 옛 앨범' },
                        { emoji: '🍶', label: '술잔을 비울수록 깊어지는 옛 생각' },
                        { emoji: '🛣️', label: '고향에 갈 수 없는데 자꾸 그 길이 밟히다' }
                    ],
                    '시니어세대': [
                        { emoji: '📸', label: '흑백사진 속 그 시절에서 벗어나지 못하는 밤' },
                        { emoji: '📞', label: '전화번호만 보고 또 보는 못 거는 전화' },
                        { emoji: '🍶', label: '혼자 데운 막걸리가 자꾸 한 잔 더를 부르다' }
                    ]
                },
                '비밀과 거짓말': {
                    '10대': [
                        { emoji: '🤫', label: '부모님 몰래 한 첫 아르바이트' },
                        { emoji: '📱', label: '비밀 계정에만 올리는 진짜 내 마음' },
                        { emoji: '😶', label: '친구한테 말 못 한 비밀이 점점 커지는 밤' }
                    ],
                    '2030세대': [
                        { emoji: '🤫', label: '아무에게도 말 못 한 퇴사 계획' },
                        { emoji: '🌃', label: '밤마다 몰래 쓰는 소설의 첫 줄' },
                        { emoji: '📞', label: '괜찮다고 말했지만 괜찮지 않았던 그 전화' }
                    ],
                    '5060세대': [
                        { emoji: '📸', label: '가족에게 보여주지 않은 서랍 속 사진' },
                        { emoji: '🍶', label: '술자리에서만 꺼내는 젊은 날의 비밀' },
                        { emoji: '📞', label: '아들에게 건강 걱정 말라 거짓말한 오후' }
                    ],
                    '시니어세대': [
                        { emoji: '📸', label: '평생 간직한 서랍 속 비밀 편지' },
                        { emoji: '📞', label: '아프지 않다고 말한 자식에게 건넨 거짓말' },
                        { emoji: '🙏', label: '무덤까지 가져가려는 마음속 이야기' }
                    ]
                },
                '도시의 삶': {
                    '10대': [
                        { emoji: '🏫', label: '학원 끝나고 네온사인 반짝이는 학원가 거리' },
                        { emoji: '🚌', label: '버스 뒷자리에서 이어폰 끼고 창밖 보는 도시' },
                        { emoji: '🏙️', label: '처음 본 서울 야경에 입이 벌어진 수학여행' }
                    ],
                    '2030세대': [
                        { emoji: '🏙️', label: '퇴근길 네온사인 아래 걷는 도시의 밤' },
                        { emoji: '🚇', label: '출근길 같은 버스에서 매일 마주치는 사람' },
                        { emoji: '🌆', label: '퇴근길 석양이 물드는 빌딩 사이 하늘' }
                    ],
                    '5060세대': [
                        { emoji: '🏙️', label: '수십 년 전 올라온 서울이 이제 고향 같은 느낌' },
                        { emoji: '🌇', label: '옥상에서 바라본 수십 년 다닌 출근길 풍경' },
                        { emoji: '🚇', label: '수십 년 같은 노선 지하철의 마지막 출근' }
                    ],
                    '시니어세대': [
                        { emoji: '🏢', label: '젊은 시절 일하던 건물 앞을 지나가다 멈춘 발걸음' },
                        { emoji: '🚌', label: '버스에서 자리 양보받고 고맙다 인사한 아침' },
                        { emoji: '🏥', label: '병원 다녀오는 길에 만난 오랜 이웃의 반가움' }
                    ]
                },
                '자연과 계절': {
                    '10대': [
                        { emoji: '🌸', label: '벚꽃 터널 밑에서 찍은 단체 셀카' },
                        { emoji: '🍂', label: '낙엽 밟으며 등교하는 가을 아침' },
                        { emoji: '☃️', label: '첫눈 오는 날 소원 빌며 뛰어나간 교실' },
                        { emoji: '🏖️', label: '바다에서 파도 맞으며 소리 지른 여름' }
                    ],
                    '2030세대': [
                        { emoji: '🍂', label: '낙엽 밟으며 걷는 가을 공원' },
                        { emoji: '🍃', label: '계절이 바뀌는 날의 공기' },
                        { emoji: '🌅', label: '여행지에서 본 일출' },
                        { emoji: '🌧️', label: '비 오는 날의 우연' }
                    ],
                    '5060세대': [
                        { emoji: '🍂', label: '단풍 든 산길을 걸으며 인생을 돌아보다' },
                        { emoji: '🍃', label: '계절이 바뀔 때마다 느끼는 세월의 무게' },
                        { emoji: '🌅', label: '제주 바닷가에서 본 일출에 눈물이 나다' },
                        { emoji: '🌧️', label: '빗소리에 문득 떠오른 젊은 날의 기억' }
                    ],
                    '시니어세대': [
                        { emoji: '🍂', label: '낙엽 쌓인 길을 지팡이 짚으며 걷는 가을' },
                        { emoji: '🍃', label: '봄꽃 피는 걸 보며 올해도 왔구나 싶은 마음' },
                        { emoji: '🌅', label: '바닷가에서 노을 보며 살아온 날들에 감사하다' },
                        { emoji: '🌧️', label: '빗소리 들으며 고향 생각에 젖는 오후' }
                    ]
                },
                '운명과 만남': {
                    '10대': [
                        { emoji: '🏫', label: '짝꿍 바뀌는 날 제비뽑기의 운명' },
                        { emoji: '📚', label: '도서관에서 같은 책 손 뻗다 눈 마주친 순간' },
                        { emoji: '👋', label: '전학 온 날 처음 눈이 마주친 그 사람' }
                    ],
                    '2030세대': [
                        { emoji: '☕', label: '카페에서의 우연한 만남' },
                        { emoji: '👋', label: '오래간만에 다시 만난 그 사람' },
                        { emoji: '🚇', label: '출근길 같은 버스에서 매일 마주치는 사람' }
                    ],
                    '5060세대': [
                        { emoji: '👋', label: '동창회에서 수십 년 만에 다시 만난 그 사람' },
                        { emoji: '🚶', label: '이른 아침 공원 산책길에서 만난 이웃' },
                        { emoji: '📞', label: '오랜 친구에게서 온 뜻밖의 안부 전화' }
                    ],
                    '시니어세대': [
                        { emoji: '🫖', label: '경로당 옆 찻집에서 벗님과 나누는 담소' },
                        { emoji: '📞', label: '오랜만에 들린 옛 동네 친구의 목소리' },
                        { emoji: '🌳', label: '공원 벤치에서 매일 만나게 된 산책 벗' }
                    ]
                },
                // ===== 일상/상황 기반 주제 =====
                '출퇴근길': {
                    '10대': [
                        { emoji: '🚌', label: '등교 버스에서 매일 같은 시간에 보이는 애' },
                        { emoji: '🎵', label: '하교길 이어폰에서 흘러나온 그 노래' },
                        { emoji: '🚶', label: '학교 끝나고 일부러 돌아가는 귀갓길' },
                        { emoji: '🌧️', label: '비 와서 우산 없이 같이 뛰어간 그날' }
                    ],
                    '2030세대': [
                        { emoji: '🚇', label: '출근길 같은 버스에서 매일 마주치는 사람' },
                        { emoji: '🌆', label: '퇴근길 석양이 물드는 창밖' },
                        { emoji: '🎵', label: '지하철에서 이어폰으로 듣는 나만의 위로' },
                        { emoji: '🌧️', label: '비 오는 퇴근길 혼자 걷는 골목' }
                    ],
                    '5060세대': [
                        { emoji: '🚇', label: '수십 년 같은 노선 지하철의 마지막 출근' },
                        { emoji: '🌆', label: '퇴근길 석양을 보며 세월을 느끼다' },
                        { emoji: '🌇', label: '옥상에서 바라본 수십 년 다닌 출근길 풍경' },
                        { emoji: '📻', label: '출근길 라디오에서 들려온 추억의 노래' }
                    ],
                    '시니어세대': [
                        { emoji: '🚌', label: '버스에서 자리 양보받고 고맙다 인사한 아침' },
                        { emoji: '🏥', label: '병원 다녀오는 길에 만난 오랜 이웃의 반가움' },
                        { emoji: '🚶', label: '해 뜨기 전 동네 뒷산 산책의 하루 시작' },
                        { emoji: '🌅', label: '새벽 시장 가는 길에 본 여명의 아름다움' }
                    ]
                },
                '카페': {
                    '10대': [
                        { emoji: '☕', label: '시험 끝나고 친구들이랑 몰려간 카페' },
                        { emoji: '📱', label: '카페에서 폰 충전하며 릴스 보는 시간' },
                        { emoji: '🧋', label: '신메뉴 나올 때마다 인증샷 찍는 단골 카페' },
                        { emoji: '📖', label: '카페에서 공부하는 척 멍 때리는 오후' }
                    ],
                    '2030세대': [
                        { emoji: '☕', label: '카페에서의 우연한 만남' },
                        { emoji: '🪟', label: '단골 카페의 늘 앉던 자리' },
                        { emoji: '🌧️', label: '비 오는 날 카페 창가에서' },
                        { emoji: '🕐', label: '카페 문 닫을 때까지 이어진 대화' }
                    ],
                    '5060세대': [
                        { emoji: '☕', label: '오랜 친구와 약속 잡은 동네 찻집' },
                        { emoji: '🫖', label: '한적한 오후, 커피 한 잔의 여유' },
                        { emoji: '🌧️', label: '비 오는 날 창가에서 옛 생각에 잠긴 시간' },
                        { emoji: '📰', label: '신문 읽다 문득 떠오른 그때 그 사람' }
                    ],
                    '시니어세대': [
                        { emoji: '🫖', label: '경로당 옆 찻집에서 벗님과 나누는 담소' },
                        { emoji: '☕', label: '손주가 사다 준 커피 처음 마셔본 날' },
                        { emoji: '🍵', label: '오후 햇살 받으며 마시는 따뜻한 차 한 잔' }
                    ]
                },
                '업무/집중': {
                    '10대': [
                        { emoji: '📝', label: '자습시간에 몰래 쪽지 돌리던 순간' },
                        { emoji: '🏫', label: '빈 교실에서 혼자 앉아 있는 방과 후' },
                        { emoji: '💤', label: '시험 기간 도서관에서 엎드려 잠든 오후' },
                        { emoji: '📚', label: '벼락치기로 밤새 공부하는 시험 전날' }
                    ],
                    '2030세대': [
                        { emoji: '🏢', label: '야근 끝 텅 빈 사무실에서' },
                        { emoji: '🛗', label: '퇴근길 엘리베이터 안에서의 해방감' },
                        { emoji: '🌇', label: '점심시간 옥상에서 본 하늘' },
                        { emoji: '💻', label: '새벽까지 코드를 쓰다 발견한 새로운 나' }
                    ],
                    '5060세대': [
                        { emoji: '🏢', label: '정년 앞두고 책상 정리하는 마지막 날' },
                        { emoji: '🤝', label: '후배에게 자리 넘기며 건넨 한마디' },
                        { emoji: '🌇', label: '옥상에서 바라본 수십 년 다닌 출근길 풍경' },
                        { emoji: '📋', label: '수십 년 모은 명함첩을 넘기며 떠오르는 얼굴들' }
                    ],
                    '시니어세대': [
                        { emoji: '🏢', label: '젊은 시절 일하던 건물 앞을 지나가다 멈춘 발걸음' },
                        { emoji: '📋', label: '수십 년 모은 명함첩을 넘기며 떠오르는 얼굴들' },
                        { emoji: '📱', label: '손주가 알려준 영상통화 처음 해본 날의 신기함' }
                    ]
                },
                '집/사무실': {
                    '10대': [
                        { emoji: '🛏️', label: '이불 속에서 유튜브 보다 잠든 새벽' },
                        { emoji: '🎧', label: '방문 잠그고 혼자 음악 듣는 밤' },
                        { emoji: '🍜', label: '라면 끓여 먹으며 웹툰 정주행' },
                        { emoji: '😤', label: '엄마랑 싸우고 방에 틀어박힌 저녁' }
                    ],
                    '2030세대': [
                        { emoji: '🏠', label: '혼자 사는 원룸의 조용한 밤' },
                        { emoji: '🛋️', label: '이불 속에서 듣는 새벽 음악' },
                        { emoji: '🍳', label: '같이 요리하다 망친 저녁' },
                        { emoji: '🏢', label: '야근 끝 텅 빈 사무실에서의 한숨' }
                    ],
                    '5060세대': [
                        { emoji: '🏠', label: '아이들 독립한 뒤 조용해진 거실' },
                        { emoji: '🪴', label: '베란다 화분에 물 주며 생각에 잠기는 아침' },
                        { emoji: '📻', label: '라디오에서 흘러나온 옛날 노래에 눈물' },
                        { emoji: '📸', label: '앨범 속 빛바랜 사진을 꺼내 본 밤' }
                    ],
                    '시니어세대': [
                        { emoji: '🏠', label: '텅 빈 집에 울리는 시계 소리와 함께하는 저녁' },
                        { emoji: '📻', label: '라디오에서 나오는 옛날 가요에 눈시울 붉어지다' },
                        { emoji: '🪴', label: '손수 가꾼 화분에 꽃이 핀 아침의 기쁨' },
                        { emoji: '📞', label: '자식에게서 온 안부 전화 한 통의 따뜻함' }
                    ]
                },
                '운동/산책': {
                    '10대': [
                        { emoji: '⚽', label: '체육시간에 골 넣고 소리 지른 순간' },
                        { emoji: '🚲', label: '자전거 타고 한강까지 달린 여름밤' },
                        { emoji: '🐕', label: '강아지 산책시키다 동네 친구 만난 저녁' },
                        { emoji: '🏃', label: '체육대회에서 나도 할 수 있다는 걸 알게 된 순간' }
                    ],
                    '2030세대': [
                        { emoji: '🏋️', label: '땀 흘리며 어제의 나를 이겨내는 새벽' },
                        { emoji: '🚶', label: '비 온 뒤 젖은 골목을 걷는 귀갓길' },
                        { emoji: '🌳', label: '이어폰 없이 걷는 동네 한 바퀴' },
                        { emoji: '🍂', label: '낙엽 밟으며 걷는 가을 공원' }
                    ],
                    '5060세대': [
                        { emoji: '🚶', label: '이른 아침 공원 산책길에서 만난 이웃' },
                        { emoji: '🍂', label: '단풍 든 산길을 걸으며 인생을 돌아보다' },
                        { emoji: '🐕', label: '반려견과 매일 같은 시간 같은 길을 걷다' },
                        { emoji: '🏃', label: '건강 위해 시작한 새벽 운동의 뿌듯함' }
                    ],
                    '시니어세대': [
                        { emoji: '🚶', label: '해 뜨기 전 동네 뒷산 산책의 하루 시작' },
                        { emoji: '🌳', label: '공원 벤치에 앉아 지나가는 사람들 구경하기' },
                        { emoji: '🐕', label: '늙은 반려견과 느릿느릿 걷는 저녁 산책' },
                        { emoji: '🤸', label: '경로당 체조 시간에 맞춰 나가는 즐거움' }
                    ]
                },
                '드라이브': {
                    '10대': [
                        { emoji: '🚌', label: '버스 뒷자리에서 이어폰 끼고 창밖 보는 길' },
                        { emoji: '🚲', label: '자전거 타고 한강까지 달린 여름밤' },
                        { emoji: '🌃', label: '친구 오토바이 뒤에 타고 달린 새벽' },
                        { emoji: '🛤️', label: '기차 타고 처음 가본 낯선 도시' }
                    ],
                    '2030세대': [
                        { emoji: '🚗', label: '밤 도로 위 헤드라이트만 보이는 길' },
                        { emoji: '📻', label: '라디오에서 흘러나온 그 노래' },
                        { emoji: '🌉', label: '고속도로 위에서 창문을 내린 순간' },
                        { emoji: '🌃', label: '새벽 드라이브 끝에 도착한 바다' },
                        { emoji: '🛣️', label: '아무 목적지 없이 달리는 밤' }
                    ],
                    '5060세대': [
                        { emoji: '🚗', label: '아내와 말없이 달리는 가을 국도' },
                        { emoji: '📻', label: '옛 카세트 테이프 틀어놓고 달리는 밤길' },
                        { emoji: '🛣️', label: '고향 가는 길, 창밖으로 스치는 추억' },
                        { emoji: '🌃', label: '잠 안 오는 밤 무작정 차 끌고 나온 바닷가' }
                    ],
                    '시니어세대': [
                        { emoji: '🚗', label: '아들 차 타고 오랜만에 나온 나들이' },
                        { emoji: '🛣️', label: '고향 마을 어귀에 닿았을 때 코끝에 스친 바람' },
                        { emoji: '🌃', label: '잠 못 드는 밤 창밖에 비치는 가로등 불빛' }
                    ]
                },
                '여행': {
                    '10대': [
                        { emoji: '🎒', label: '수학여행 버스 안에서 몰래 주고받은 간식' },
                        { emoji: '⛺', label: '친구들이랑 처음 간 캠핑에서 뜬 밤' },
                        { emoji: '🏖️', label: '바다에서 파도 맞으며 소리 지른 여름' },
                        { emoji: '🛤️', label: '기차 타고 처음 가본 낯선 도시' }
                    ],
                    '2030세대': [
                        { emoji: '✈️', label: '공항 게이트 앞 새로운 시작' },
                        { emoji: '🗺️', label: '낯선 도시 골목에서 길을 잃다' },
                        { emoji: '🌅', label: '여행지에서 본 생애 첫 일출' },
                        { emoji: '🚗', label: '밤 도로 위 헤드라이트만 보이는 길' }
                    ],
                    '5060세대': [
                        { emoji: '🚂', label: '기차 타고 떠난 소도시 느린 여행' },
                        { emoji: '🏔️', label: '은퇴 후 처음 간 해외여행의 설렘' },
                        { emoji: '🌅', label: '제주 바닷가에서 본 일출에 눈물이 나다' },
                        { emoji: '🛣️', label: '고향 가는 길, 창밖으로 스치는 추억' }
                    ],
                    '시니어세대': [
                        { emoji: '🚂', label: '경로 우대로 기차 타고 떠난 당일치기 나들이' },
                        { emoji: '🏔️', label: '젊을 적 신혼여행지를 다시 찾은 날' },
                        { emoji: '🌅', label: '바닷가에서 노을 보며 살아온 날들에 감사하다' },
                        { emoji: '🚗', label: '아들 차 타고 오랜만에 나온 나들이' }
                    ]
                },
                '힐링': {
                    '10대': [
                        { emoji: '🎧', label: '좋아하는 노래 무한반복하며 멍 때리는 오후' },
                        { emoji: '🐕', label: '강아지 산책시키다 마음이 풀린 저녁' },
                        { emoji: '🍦', label: '친구가 아무 말 없이 아이스크림 사다 준 날' },
                        { emoji: '🌸', label: '벚꽃 터널 밑에서 깊게 숨 쉰 순간' }
                    ],
                    '2030세대': [
                        { emoji: '🌳', label: '이어폰 없이 걷는 동네 한 바퀴' },
                        { emoji: '☕', label: '비 오는 날 카페 창가에서의 여유' },
                        { emoji: '🛋️', label: '이불 속에서 듣는 새벽 음악' },
                        { emoji: '🎁', label: '아무 이유 없는 날의 선물' },
                        { emoji: '✨', label: '일상 속 작은 기적' }
                    ],
                    '5060세대': [
                        { emoji: '🪴', label: '베란다 화분에 물 주며 마음이 편해지는 아침' },
                        { emoji: '🐕', label: '반려견과 매일 같은 시간 같은 길을 걷다' },
                        { emoji: '🫖', label: '한적한 오후, 커피 한 잔의 여유' },
                        { emoji: '🍂', label: '단풍 든 산길을 걸으며 인생을 돌아보다' }
                    ],
                    '시니어세대': [
                        { emoji: '🪴', label: '손수 가꾼 화분에 꽃이 핀 아침의 기쁨' },
                        { emoji: '🍵', label: '오후 햇살 받으며 마시는 따뜻한 차 한 잔' },
                        { emoji: '🌳', label: '공원 벤치에 앉아 지나가는 사람들 구경하기' },
                        { emoji: '✨', label: '아침 햇살에 감사한 또 하루의 시작' }
                    ]
                },
                '독서': {
                    '10대': [
                        { emoji: '📚', label: '도서관에서 같은 책 손 뻗다 눈 마주친 순간' },
                        { emoji: '💤', label: '시험 기간 도서관에서 엎드려 잠든 오후' },
                        { emoji: '📖', label: '만화책에 빠져 시간 가는 줄 모른 방과 후' },
                        { emoji: '🎒', label: '도서관 가는 척 하고 카페 간 비밀' }
                    ],
                    '2030세대': [
                        { emoji: '📚', label: '조용한 열람실에서 같은 책을 집은 순간' },
                        { emoji: '📖', label: '책장 사이로 몰래 본 그 사람의 옆모습' },
                        { emoji: '☕', label: '카페에서 책 읽다 빠져든 오후' },
                        { emoji: '🛋️', label: '비 오는 날 이불 속에서 소설 한 권의 여유' }
                    ],
                    '5060세대': [
                        { emoji: '📚', label: '은퇴 후 처음 다시 편 책의 첫 장' },
                        { emoji: '📖', label: '젊은 시절 읽던 책을 다시 펼치니 다른 감동' },
                        { emoji: '🫖', label: '찻집에서 책 읽으며 보내는 한적한 오후' },
                        { emoji: '📰', label: '신문 읽다 문득 떠오른 그때 그 사람' }
                    ],
                    '시니어세대': [
                        { emoji: '📚', label: '큰 글씨 책 찾아 읽는 오후의 소소한 행복' },
                        { emoji: '📖', label: '손주에게 읽어줄 동화책 고르는 할머니의 설렘' },
                        { emoji: '🍵', label: '차 마시며 느긋하게 넘기는 수필집' },
                        { emoji: '📻', label: '라디오 낭독 프로그램 듣는 조용한 오후' }
                    ]
                }
            };

            // 해당 주제+연령대 조합의 상황 반환
            const themeSituations = (themeAgeSituations[theme] || {})[age] || [];

            if (themeSituations.length > 0) {
                return themeSituations;
            }

            // 매칭되는 데이터가 없으면 해당 연령대의 기본 상황 제공
            const defaultSituations = {
                '10대': [
                    { emoji: '🏫', label: '학교에서의 일상' },
                    { emoji: '🎧', label: '음악과 함께하는 시간' },
                    { emoji: '📱', label: '친구들과의 소통' },
                    { emoji: '🌙', label: '혼자만의 밤 시간' }
                ],
                '2030세대': [
                    { emoji: '☕', label: '카페에서의 시간' },
                    { emoji: '🏢', label: '일상 속 직장에서' },
                    { emoji: '🌙', label: '새벽 감성의 순간' },
                    { emoji: '🚶', label: '걸으며 생각하는 시간' }
                ],
                '5060세대': [
                    { emoji: '🚶', label: '산책길에서의 생각' },
                    { emoji: '📻', label: '추억의 노래와 함께' },
                    { emoji: '🫖', label: '차 한 잔의 여유' },
                    { emoji: '📸', label: '옛 사진 속 추억' }
                ],
                '시니어세대': [
                    { emoji: '🍵', label: '따뜻한 차 한 잔의 시간' },
                    { emoji: '🚶', label: '동네 산책의 일상' },
                    { emoji: '📻', label: '라디오에서 들려오는 옛 노래' },
                    { emoji: '📸', label: '흑백사진 속 그 시절' }
                ]
            };

            return defaultSituations[age] || defaultSituations['2030세대'];
        }

        // ===== 연령대 버튼 즉시 생성 및 1단계 데이터 자동 선택 =====
        ageGroupBtns.innerHTML = ageOptions.map(a =>
            `<button class="toggle-btn" data-value="${a.value}">${a.label}</button>`
        ).join('');

        // 1단계 데이터 기반 연령대 자동 선택 (단일)
        const presetTargets = normalizeTargetLabels((state.promptData || {}).target || []);
        if (presetTargets.length > 0) {
            const firstValid = presetTargets.find(t => ageOptions.some(a => a.value === t));
            if (firstValid) {
                const btn = ageGroupBtns.querySelector(`[data-value="${firstValid}"]`);
                if (btn) {
                    btn.classList.add('active');
                    selectedAge = firstValid;
                }
                // 연령대가 자동 선택되면 주제 드롭다운 표시
                themeDropdownArea.style.display = 'block';
            }
        }

        // === 파이프라인 데이터 기반 노래주제 + 장소/상황 자동 매칭 ===
        const pipeData = state.promptData || {};
        const pipeMoods = (pipeData.mood || []).map(m => (typeof m === 'string' ? m : '').toLowerCase());
        const pipePlaces = (pipeData.place || []).map(p => (typeof p === 'string' ? p : '').toLowerCase());
        const pipeFreeText = ((pipeData.explanation || '') + ' ' + (pipeData.stylePrompt || '')).toLowerCase();

        if (selectedAge && (pipeMoods.length > 0 || pipePlaces.length > 0 || pipeFreeText.length > 10)) {
            // mood/place → 노래주제 매핑
            const themeMatchMap = {
                '사랑과 연애': ['love', 'flutter', '사랑', '설레', '로맨스', '연애', '고백'],
                '이별과 상실': ['breakup', '이별', '헤어', '슬픈', '눈물', '상실'],
                '나를 찾아가는 여정': ['자아', '정체성', '나를 찾', '성장'],
                '다시 일어서는 힘': ['confidence', 'powerful', '자신감', '용기', '도전', '파워', '극복'],
                '그리움과 향수': ['nostalgic', '그리운', '추억', '향수', '그리움', '보고 싶'],
                '가족이라는 이름': ['가족', '부모', '엄마', '아빠', '할머니', '할아버지'],
                '우정과 인연': ['우정', '친구', '인연', '절친'],
                '외로움과 고독': ['lonely', '외로', '고독', '쓸쓸', 'sentimental', '센치'],
                '밤과 새벽의 감정': ['dawn', 'dawn-mood', '새벽', '밤', '야심한'],
                '파티와 자유': ['exciting', 'groovy', 'tension-up', '신나', '흥겨', '파티', '클럽', '자유'],
                '위로와 치유': ['comfort', 'healing', '위로', '힐링', '치유', '위안'],
                '꿈과 미래': ['꿈', '미래', '목표', '희망'],
                '여행과 떠남': ['travel', '여행', '떠나', '트립'],
                '자연과 계절': ['rainy', 'sunset', '비오는', '일몰', '노을', '봄', '여름', '가을', '겨울', '눈오는', '자연'],
                '도시의 삶': ['도시', '일상', '출퇴근', '직장'],
                '카페': ['cafe', '카페', '커피', 'coffee'],
                '출퇴근길': ['commute', '출퇴근', '지하철', '버스'],
                '업무/집중': ['focus', 'immersive', '집중', '몰입', '업무', '일할'],
                '집/사무실': ['home', '집', '거실', '사무실'],
                '운동/산책': ['running', 'gym', '운동', '산책', '달리', '헬스', '조깅'],
                '드라이브': ['drive', '드라이브', '운전', '자동차'],
                '힐링': ['comfortable', 'calm', 'cozy', 'warm', '편안', '잔잔', '포근', '따뜻', '수면', 'sleep'],
                '독서': ['reading', '독서', '책', '도서관']
            };

            let bestThemeId = 0;
            let bestScore = 0;
            const allKeywords = [...pipeMoods, ...pipePlaces, ...pipeFreeText.split(/\s+/)];

            for (const [themeName, keywords] of Object.entries(themeMatchMap)) {
                let score = 0;
                keywords.forEach(kw => {
                    if (allKeywords.some(w => w.includes(kw) || kw.includes(w))) score++;
                    if (pipeFreeText.includes(kw)) score++;
                });
                if (score > bestScore) {
                    bestScore = score;
                    const found = themeList.find(t => t.name === themeName);
                    if (found) bestThemeId = found.id;
                }
            }

            // 노래주제 자동 선택
            if (bestThemeId > 0 && bestScore >= 1) {
                mainSelect.value = bestThemeId;
                const theme = themeList.find(t => t.id === bestThemeId);
                currentThemeName = theme ? theme.name : '';

                // 장소/상황 렌더링 후 자동 선택
                renderSituations();
                situationArea.style.display = 'block';
                btnRegenSituations.style.display = 'inline-flex';

                // 첫 번째 장소/상황 자동 선택
                if (situationSelect.options.length > 1) {
                    situationSelect.selectedIndex = 1;
                    selectedSituation = situationSelect.value;
                    renderStories();
                }
            }
        }

        // 연령대 버튼 클릭 (단일 선택)
        ageGroupBtns.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.value;
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    selectedAge = '';
                    themeDropdownArea.style.display = 'none';
                } else {
                    ageGroupBtns.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedAge = val;
                    themeDropdownArea.style.display = 'block';
                }
                // 연령대 바뀌면 하위 초기화
                mainSelect.value = '';
                currentThemeName = '';
                situationArea.style.display = 'none';
                storiesArea.style.display = 'none';
                selectedSituation = null;
            });
        });

        // 주제 선택 → 장소/상황 표시
        mainSelect.addEventListener('change', () => {
            const themeId = parseInt(mainSelect.value);
            situationArea.style.display = 'none';
            storiesArea.style.display = 'none';
            selectedSituation = null;
            if (!themeId || !selectedAge) return;

            const theme = themeList.find(t => t.id === themeId);
            currentThemeName = theme ? theme.name : '';

            renderSituations();
            situationArea.style.display = 'block';
            btnRegenSituations.style.display = 'inline-flex';
        });

        // 다시생성 버튼
        btnRegenSituations.addEventListener('click', () => {
            if (!currentThemeName || !selectedAge) return;
            renderSituations();
            // 하위 스토리 초기화
            situationSelect.value = '';
            selectedSituation = null;
            storiesArea.style.display = 'none';
        });

        // 장소/상황 드롭다운 렌더링 (SITUATION_DATA에서 랜덤 50개)
        function renderSituations() {
            const pool = (typeof SITUATION_DATA !== 'undefined' && SITUATION_DATA[currentThemeName] && SITUATION_DATA[currentThemeName][selectedAge])
                ? SITUATION_DATA[currentThemeName][selectedAge]
                : generateSituations();

            // 셔플 후 50개 추출
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            const picked = shuffled.slice(0, 50);

            situationSelect.innerHTML = '<option value="">-- 장소/상황 선택 --</option>';
            picked.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.label;
                opt.textContent = `${s.emoji} ${s.label}`;
                situationSelect.appendChild(opt);
            });
        }

        // 장소/상황 드롭다운 선택 시 스토리 표시
        situationSelect.addEventListener('change', () => {
            const val = situationSelect.value;
            if (!val) {
                storiesArea.style.display = 'none';
                selectedSituation = null;
                return;
            }
            selectedSituation = val;
            renderStories();
        });

        // 스토리 렌더링
        function renderStories() {
            const ageLabel = selectedAge;
            storiesTitle.textContent = `${currentThemeName} > ${ageLabel} > ${selectedSituation}`;

            renderCreatedStories();

            const btnRecreate = document.getElementById('btnRecreateStories');
            if (btnRecreate) {
                btnRecreate.style.display = 'inline-flex';
                btnRecreate.onclick = () => {
                    renderCreatedStories();
                    btnApply.disabled = true;
                    selectedStoryData = null;
                    document.getElementById('storyApplyStatus').textContent = '';
                };
            }

            storiesArea.style.display = 'block';
            btnApply.disabled = true;
            selectedStoryData = null;
            document.getElementById('storyApplyStatus').textContent = '';
        }

        function renderCreatedStories() {
            // 선택된 연령대/상황/주제를 키워드로 전달
            const situationKeywords = selectedSituation ? selectedSituation.replace(/[에서의|에서|의|을|를|이|가]/g, ' ').split(/\s+/).filter(w => w.length > 1) : [];
            // 선택한 연령대를 generateRecreatedStories에 전달 (state 임시 오버라이드)
            const origTarget = (state.promptData || {}).target;
            if (state.promptData) state.promptData.target = selectedAge ? [selectedAge] : [];
            const recreated = generateRecreatedStories(null, situationKeywords, currentThemeName);
            if (state.promptData && origTarget !== undefined) state.promptData.target = origTarget;
            recreatedList.innerHTML = recreated.map((s, i) =>
                `<div class="theme-story-item" data-type="recreated" data-idx="${i}">
                    <div class="theme-story-name">\u2728 \uCC3D\uC791 #${i+1}</div>
                    <div class="theme-story-desc">${s}</div>
                </div>`
            ).join('');

            recreatedList.querySelectorAll('.theme-story-item').forEach(item => {
                item.addEventListener('click', () => {
                    recreatedList.querySelectorAll('.theme-story-item').forEach(c => c.classList.remove('selected'));
                    item.classList.add('selected');
                    selectedStoryData = {
                        name: selectedSituation || currentThemeName,
                        theme: currentThemeName,
                        desc: item.querySelector('.theme-story-desc').textContent || '',
                        keywords: situationKeywords,
                        type: 'recreated'
                    };
                    btnApply.disabled = false;
                });
            });
        }

        // 적용하기 버튼
        btnApply.addEventListener('click', () => {
            if (!selectedStoryData) return;

            state.story = `${selectedStoryData.name}\n${selectedStoryData.desc}\n\uD0A4\uC6CC\uB4DC: ${selectedStoryData.keywords.join(', ')}`;
            state.appliedStory = selectedStoryData;

            document.getElementById('storyApplyStatus').textContent = '\u2705 \uC2A4\uD1A0\uB9AC \uC801\uC6A9 \uC644\uB8CC! \uB2E4\uC74C \uB2E8\uACC4\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4.';
            document.getElementById('storyApplyStatus').className = 'ref-apply-status success';

            const display = document.getElementById('selectedStoryDisplay');
            display.style.display = 'block';
            display.innerHTML = `<div class="story-confirmed">\u2705 \uC801\uC6A9\uB428: <strong>${selectedStoryData.name}</strong>\n${selectedStoryData.desc}</div><div class="story-edit-btn"><button class="btn-edit-toggle" id="btnEditStory">\u270E \uC218\uC815\uD558\uAE30</button></div>`;
            document.getElementById('storyEditArea').style.display = 'none';
            document.getElementById('btnEditStory').addEventListener('click', () => {
                display.style.display = 'none';
                document.getElementById('storyEditArea').style.display = 'block';
                document.getElementById('storyInput').value = state.story;
            });

            // 스토리 적용 즉시 데이터 정보 갱신
            showGenerationGuide();
        });
    }

    // === 1단계 데이터 기반 AI 창작 스토리 생성 ===
    function generateRecreatedStories(origStories, keywords, themeName) {
        const d = state.promptData || {};
        const targets = normalizeTargetLabels(d.target || []);
        const targetGen = targets[0] || '2030세대';

        // 세대별 완성형 스토리 풀 (1단계 데이터 조건에 따라 필터링/선택)
        // 각 스토리는 해당 세대의 실제 언어와 구체적 장면으로 작성
        const storyBank = {
            '10대': {
                '사랑과 연애': [
                    '수업 시간에 몰래 옆자리를 훔쳐봅니다. 연필을 빌려달라고 말을 걸까 한참을 고민하다가 또 수업이 끝나버렸습니다. 집에 돌아와서 일기장에 적습니다. \'내일은 진짜 말 건다.\' 근데 이 다짐, 벌써 열두 번째입니다. 친구한테 말하면 \'야 그냥 말 걸어 뭘 고민해\'라고 하겠지만, 이 떨림을 모르는 거예요. 연필 하나 빌리는 게 이렇게 어려운 일인 줄, 좋아해본 사람만 압니다.',
                    '짝꿍이 바뀌는 날. 제비뽑기하는 손이 진짜로 떨립니다. 제발 그 사람 옆자리. 속으로 백 번은 빌었습니다. 번호를 뽑는 순간 심장이 터질 것 같았는데, 옆자리가 됐습니다. 미소를 참느라 입술을 깨무는데 친구가 \'야 왜 웃어?\'라고 묻습니다. \'아니 아무것도 아니야.\' 아무것도 아닌 척하는 게 이렇게 어려운 줄 몰랐습니다. 한 학기가 인생에서 가장 짧으면서도 가장 긴 시간이었습니다.',
                    '축제 공연에서 기타 치며 노래하는 그 사람을 객석에서 바라봅니다. 조명 받으면서 눈을 감고 노래하는 모습이 너무 멋있어서 숨을 참았습니다. 옆에 앉은 친구가 \'야 숨 쉬어\'라고 했을 때야 내가 숨을 안 쉬고 있었다는 걸 알았습니다. 공연이 끝나고 \'잘했어\'라는 말 한마디를 건네려고 30분을 기다렸는데, 막상 앞에 서니까 \'어... 그... 잘했어\'밖에 못했습니다. 레전드로 쿨하지 못한 내 고백.',
                    '카톡 프로필 사진을 바꿀 때마다 \'그 사람이 볼까?\' 생각하며 10번은 고릅니다. 프로필 음악도 그 사람이 좋아한다던 노래로 바꿔놓고, 상태메시지도 은근히 그 사람을 겨냥해서 적습니다. 근데 진짜 웃긴 건, 그 사람이 내 프로필을 한 번이라도 봤는지 모른다는 거예요. 이 모든 소심한 어필이 허공에 날아가는 중일 수도 있는데, 그래도 혹시나 하는 마음에 오늘도 프로필을 수정합니다. 찐으로 바보 같지만, 좋아하는 마음은 어쩔 수 없잖아요.',
                    '졸업 앨범에 쓰는 마지막 메시지. \'좋아했어\'라고 쓸까 \'고마웠어\'라고 쓸까 30분째 고민합니다. 펜을 잡은 손이 떨려서 글씨가 삐뚤어집니다. 결국 \'앞으로도 행복해\'라고 적었습니다. 진심은 그 다섯 글자 사이 어딘가에 숨어있습니다. 졸업식이 끝나고 집에 돌아와 이불을 뒤집어쓰고 울었습니다. 말하지 못한 마음이 이렇게 무거운 줄, 그날 처음 알았습니다.'
                ],
                '이별과 상실': [
                    '100일 커플반지를 빼서 책상 서랍에 넣습니다. 아직 손가락에 따뜻한 감촉이 남아있어서, 서랍을 닫고도 한참을 바라봤습니다. 수업 시간 내내 창밖만 바라보는데, 선생님이 \'왜 멍하니?\'라고 물어도 \'괜찮아요\'라고 답할 수밖에 없었습니다. 괜찮지 않은데 괜찮다고 말하는 법을 16살에 처음 배웠습니다. 집에 와서 친구한테 울면서 전화했더니, 그 친구가 아무 말 없이 아이스크림을 들고 와줬습니다. 그날 밤, 이별은 아프지만 우정은 따뜻하다는 걸 알았습니다.',
                    '졸업식 날, 3년간 매일 보던 친구들과 교문 앞에서 사진을 찍습니다. \'자주 보자\'라고 말하지만, 다들 이 약속이 지켜지기 어렵다는 걸 알고 있는 표정입니다. 웃는데 눈물이 나고, 울다가 웃고, 감정이 롤러코스터입니다. 교복 주머니에 손을 넣으면 3년간의 기억이 만져지는 것 같았습니다. 투덜거리며 입던 이 옷이 마지막이라고 생각하니 갑자기 아껴입고 싶어지는 마음. 거울 앞에서 \'나쁘지 않았다\'고 웃었습니다.'
                ],
                '나를 찾아가는 여정': [
                    '진로 상담 시간. \'꿈이 뭐니?\'라는 질문에 아무 말도 못 합니다. 친구들은 다 정해진 것 같은데 나만 백지인 것 같아서 불안합니다. 부모님은 의사가 되라고 하고, 나는 게임을 만들고 싶은데, 그 말을 저녁 식탁에서 꺼낼 수가 없습니다. 일기장에만 몰래 적어둡니다. \'나는 숫자의 사람이 아니라 코드의 사람이다.\' 언젠가 이 일기장을 부모님께 보여줄 수 있는 날이 오겠죠? 모르는 것도 괜찮다는 선생님의 말이 오늘따라 좀 위로가 됩니다.',
                    '인싸도 아싸도 아닌 경계에 있습니다. 어느 그룹에도 완전히 속하지 못하는 느낌. 점심시간에 어디로 가야 할지 매일 고민입니다. 근데 어느 날 깨달았습니다. 어디에도 속하지 않는다는 건, 어디든 갈 수 있다는 뜻이라는 거. 혼자만의 시간에 발견한 그림 그리기가 있었기에 버틸 수 있었고, 그 그림이 나중에 미술대회 대상이 될 줄은 그때 몰랐습니다. 나만 다른 게 아니라, 나만의 길이 있었던 거였습니다.'
                ],
                '다시 일어서는 힘': [
                    '모의고사 성적이 곤두박질쳤습니다. 화장실에서 울다가 세수하고 나와 다시 책상에 앉았습니다. 오늘의 점수가 내 인생의 점수는 아니라는 거, 머리로는 아는데 마음이 따라가지 못합니다. 그래도 다시 펜을 듭니다. 옆자리 친구가 초콜릿을 하나 건네며 \'야, 다음에 잘하면 되지\'라고 합니다. 대단한 말은 아닌데 그 한마디에 눈물이 핑 돕니다. 초콜릿 하나의 위로가 자기계발서 열 권보다 강한 밤이었습니다.'
                ],
                'default': [
                    '쉬는 시간에 모두가 그룹으로 모여있는데 나만 혼자 자리에 앉아있습니다. 핸드폰을 보는 척하지만 화면에는 아무것도 안 보이고, 주변의 웃음소리만 크게 들립니다. 근데 어느 날 같은 처지의 아이를 만났습니다. \'같이 먹을래?\'라고 먼저 말을 걸었더니, 그 아이가 환하게 웃었습니다. 그 웃음 하나에 교실이 달라 보이기 시작했습니다. 혼자였기에 용기를 낸 거였고, 그 용기가 가장 좋은 친구를 만들어줬습니다.'
                ]
            },
            '2030세대': {
                '사랑과 연애': [
                    '10번째 소개팅. 이번에도 현타 올 각오로 나갔습니다. 그런데 마주 앉은 사람이 아메리카노에 바닐라 시럽을 두 번 넣는 걸 보고 심장이 멈칫했습니다. 나만 그러는 줄 알았거든요. \'혹시 그거 바닐라 시럽이에요?\' 용기를 내서 물었더니 \'어떻게 알았어요? 다들 이상하다고 하는데\'라며 웃는 얼굴. 번아웃으로 무뎌진 줄 알았던 감정이 다시 살아나는 느낌. 2시간이 6시간이 되고 카페가 문을 닫아서 억지로 나왔습니다. 택시 안에서 볼이 아플 만큼 웃고 있는 자신을 발견하며 친구에게 카톡을 보냅니다. \'야, 평생 밥 사줄게. 진짜로.\'',
                    '비 오는 일요일, 이불 밖으로 나가지 않고 영화를 틀어놓고 나란히 누워있는 오후. 아무것도 안 하는 것이 가장 완벽한 데이트라는 것을 아는 사이가 됐습니다. 중간에 배달 시킨 피자를 이불 위에서 먹다가 치즈가 이불에 떨어져서 둘 다 빵 터졌습니다. 대단한 일은 하나도 없었는데, 이런 평범한 일요일이 일주일을 버티는 이유가 된다는 걸 알게 된 순간. 워라밸의 진짜 의미를 깨달은 날입니다.',
                    '매일 퇴근 후 30분 통화하는 습관이 생겼습니다. 대단한 이야기를 하는 것도 아닌데, 그 사람 목소리를 들으면 하루의 피로가 녹습니다. \'끊자 끊자\' 하면서 1시간째 통화하는 밤. \'오늘 점심 뭐 먹었어?\' \'삼겹살.\' \'부럽다 나도 먹고 싶었는데.\' 이런 뻔한 대화가 세상에서 가장 좋은 이유를, 좋아해본 사람은 다 알 거예요. 소확행이라는 말이 이럴 때 쓰는 거였습니다.',
                    '읽씹당할까봐 무서워서 카톡을 못 보내고 있다가, 상대방이 먼저 \'뭐해?\'라고 보내줄 때 터지는 미소. 이 작은 메시지 하나에 하루가 환해집니다. 별거 아닌 건 아는데 멈출 수가 없는 미소. 회사 화장실에서 혼자 핸드폰 보고 히죽거리다가 동료한테 걸려서 \'아 아무것도 아니에요\' 했는데, 표정 관리가 안 돼서 다 들통났습니다. 어른이 돼도 좋아하는 감정 앞에서는 다 바보가 되나 봅니다.',
                    'IKEA에서 함께 가구를 고르는 오후. \'우리 집\'이라는 단어를 처음 쓰는 순간의 설렘. 아직 같이 살지 않지만, \'이 소파 우리 집에 놓으면 예쁘겠다\'라는 말이 자연스럽게 나왔을 때, 서로 눈이 마주치며 3초간 멈췄습니다. 그 3초 안에 미래가 보였습니다. 그리고 그날 사온 건 소파가 아니라 라면 냄비 하나. 현실은 아직 원룸이지만, 꿈은 이미 같이 사는 집입니다.'
                ],
                '이별과 상실': [
                    '\'우리 그만하자\'라는 한마디에 카페 안의 모든 소리가 사라졌습니다. 그 사람의 입술만 슬로모션으로 움직이는 것 같은 비현실적인 순간. 3년 연애의 끝. 짐을 싸면서 \'이 컵은 네 거, 이 쿠션은 내 거\' 나누는 과정이 관계를 해체하는 것처럼 잔인했습니다. 이별 후 첫 월요일 출근. 주말 내내 울었지만 월요일 아침에는 마스크를 쓰고 \'좋은 아침이에요\'라고 인사해야 하는 어른의 세계. 화장실에서 몰래 30초만 울고 돌아오는 프로의 하루가 시작됐습니다.',
                    '헤어진 후 처음으로 혼자 해외여행을 떠났습니다. 낯선 도시에서 혼자 밥을 먹고, 혼자 길을 찾고, 혼자 해낸 하루하루가 나를 다시 세워줬습니다. 1km도 못 뛰던 사람이 3개월 후 10km를 완주했습니다. 달리면서 흘린 땀이 눈물 대신이 되어주고, 결승선을 통과하며 \'나 혼자서도 할 수 있다\'는 것을 증명했습니다. 작년의 나에게 말해주고 싶습니다. \'1년 후에 웃고 있을 거야.\''
                ],
                '나를 찾아가는 여정': [
                    '회사에서는 \'밝고 적극적인 사원\'이지만, 집에 오면 아무도 만나고 싶지 않은 극강의 내향인. 두 개의 나 사이에서 진짜 나는 어디에 있는 걸까 고민하는 밤. 번아웃이 왔을 때 비로소 \'나는 왜 이 일을 하고 있지?\'라는 본질적 질문을 하게 됐습니다. 퇴사 후 3개월간 아무것도 안 해봤습니다. 처음엔 불안했지만, 서서히 \'아무것도 하지 않아도 나는 존재한다\'는 편안함을 배웠습니다. 생산성이 아닌 존재 자체로 충분하다는 발견. 그게 현타가 아니라 각성이었습니다.'
                ],
                '다시 일어서는 힘': [
                    '면접에서 50번 떨어진 후 51번째 합격 문자를 받았습니다. 화장실에서 소리 없이 주먹을 쥐며 \'해냈다\'고 속삭였습니다. 50번의 \'아니요\' 끝에 온 1번의 \'축하합니다\'. 사업에 실패하고 빚을 진 적도 있었습니다. 모든 것을 잃었지만 \'건강한 몸과 배운 교훈이 남았다\'며 배달 알바를 시작했습니다. 바닥에서 올려다본 하늘이 가장 넓더라는 것을. 쉬는 것도 용기라는 것, 멈추는 것도 전진의 일부라는 것을 그때 배웠습니다.'
                ],
                'default': [
                    '혼자 사는 집에서 \'다녀왔습니다\'라고 말할 사람이 없는 현관. 신발을 벗으며 TV를 켜는 것이 습관이 됐습니다. 배달 앱에서 \'1인분 주문 가능\'을 필터링하는 순간이 가끔 쓸쓸하지만, 혼자의 시간이 쌓이면서 나를 더 깊이 알게 됐습니다. \'나랑 나, 꽤 괜찮은 조합인데?\' 외로움이 자기 발견의 통로가 되는 반전. 그리고 오늘도 현관문을 열며 혼잣말합니다. \'다녀왔습니다, 나에게.\''
                ]
            },
            '5060세대': {
                '사랑과 연애': [
                    '거울에서 흰머리를 발견한 아내에게 \'당신은 흰머리도 예뻐\'라고 말했습니다. 진심인지 빈말인지 모르겠지만, 그 한마디에 아내의 하루가 좋아지는 것을 압니다. 결혼기념일에 처음 데이트했던 식당을 찾아갔는데, 그 식당은 이미 없어졌습니다. 그 자리에 서서 30년 전을 떠올리며 웃었습니다. \'그때 나 진짜 떨렸어\' \'나도.\' 식당은 없어져도 그때의 떨림은 아직 남아있다는 것이, 오래된 사랑의 증거입니다.',
                    '막내가 대학에 가고 텅 빈 집. 20년 만에 다시 둘만 남았습니다. 처음엔 어색했습니다. 와인 한 잔을 나누며 \'우리 연애할 때처럼 데이트하자\'고 말한 밤. 신혼여행 이후 처음으로 부부만의 해외여행을 계획하면서, 20대에는 돈이 없어서 못 갔던 곳을 50대에 드디어 가게 됐습니다. 느리지만 여유 있는 여행이 주는 새로운 행복. 부모이기 전에 연인이었던 시절을 다시 발견하는 두 번째 신혼입니다.'
                ],
                '이별과 상실': [
                    '아이 방을 정리하다 발견한 유치원 때 그림. \'엄마 사랑해\' 삐뚤삐뚤 쓴 글씨를 보며 \'이게 엊그제 같은데\'라고 중얼거립니다. 시간은 어디로 간 걸까요. 자녀에게 \'엄마 보고 싶어\'라는 카톡이 올 때, 눈물이 나면서도 \'밥은 잘 챙겨 먹어\'라고 답합니다. 보고 싶다고 말하면 아이가 걱정할까봐 참는 부모의 마음. 빈 방에 남겨진 트로피와 상장을 버리지 못합니다. 이 방은 박물관이 아니라 기억의 저장소입니다.',
                    '30년간 다니던 회사를 마지막으로 나서는 날. 동료들의 박수를 받으며 현관을 나섰지만, 주차장에 도착해서야 \'내일부터 여기 안 와도 되는구나\'라는 실감에 차 안에서 한참 앉아있었습니다. 하지만 퇴직은 끝이 아니라 또 다른 시작입니다. 하고 싶었지만 못 했던 일들의 목록을 꺼내보는 아침. 기타를 배우고, 그림을 그리고, 아내와 세계 여행을 계획하는 제2막의 설렘이 시작됩니다.'
                ],
                '나를 찾아가는 여정': [
                    '30년간 직함 뒤에 숨어있던 \'나\'를 처음 마주합니다. \'부장님\'이 아닌 \'나\'로서 살아가는 법을 처음부터 배우는 이야기. 두렵지만 자유로운 제2의 사춘기입니다. 아내가 \'당신, 이제 뭐 하고 싶어?\'라고 묻자 대답하지 못했습니다. 평생 가족을 위해 살았기에 \'나\'의 소원이 뭔지 모르겠다는 고백. 하지만 그 질문이 새로운 시작의 씨앗이 됐습니다. 60세에 그림을 배우기 시작했는데, 선생님이 \'삐뚤어도 멋있어요\'라고 말해줬을 때의 해방감. 완벽하지 않아도 된다는 것을 60년 만에 처음 배웠습니다.'
                ],
                'default': [
                    '동창회에 갈 때마다 빈 의자가 하나씩 늘어납니다. \'걔 요즘 뭐 해?\'라는 질문에 \'거기 갔어\'라는 대답이 돌아올 때의 침묵. 살아있는 것 자체가 축복이라는 무게. 하지만 그리움은 사랑의 다른 이름이라는 것을 압니다. 그리운 사람이 있다는 것은 사랑한 사람이 있었다는 뜻이니까요. 그리움마저 감사한 나이가 됐습니다. 수고했습니다, 여기까지 온 우리 모두.'
                ]
            },
            '시니어세대': {
                '사랑과 연애': [
                    '매일 같은 시간, 같은 공원을 손잡고 걷습니다. 말이 없어도 서로의 걸음 속도를 맞추는 것이 50년간 연습한 사랑의 기술입니다. 할머니가 걸음이 느려져서 할아버지가 속도를 맞춰 천천히 걷습니다. 젊었을 때는 할아버지가 빨리 걸어서 할머니가 쫓아갔는데, 이제는 거꾸로입니다. 사랑의 방향은 바뀌어도 사랑은 변하지 않습니다. 비가 오면 산책을 못 하니까, 할아버지가 아침부터 창밖을 보며 날씨를 걱정합니다. 산책이 아니라 할머니와 함께하는 시간이 소중한 것이라는 걸, 말하지 않아도 아는 사이입니다.',
                    '배우자를 먼저 보내고 5년. 경로당에서 만난 같은 처지의 사람과 대화를 나누다 보니, 오랜만에 마음이 따뜻해지는 경험을 합니다. 이 나이에 설레어도 되는 걸까 스스로에게 물었습니다. 자녀들이 \'아버지가 새 사람을 만나셔도 돼\'라고 말해줬을 때, 고마우면서도 미안한 마음. 70대에 시작한 새 연애. 손을 잡는 게 쑥스러워서, 나란히 걸으며 슬쩍 팔꿈치를 맞대는 것이 최선의 스킨십입니다. 인생은 끝날 때까지 끝난 게 아니라는 것을 가르쳐주는 이야기입니다.'
                ],
                '이별과 상실': [
                    '할아버지가 돌아가신 후, 할머니는 매일 아침 할아버지 사진 앞에 물 한 잔을 놓고 \'잘 잤어?\'라고 인사합니다. 50년간의 습관은 사람이 떠나도 멈추지 않습니다. 옷장 깊숙이 보관된 할아버지의 외투. 가끔 꺼내서 코를 묻으면 아직 할아버지 냄새가 남아있는 것 같아서, 조금만 더 보관하겠다고 마음먹습니다. 하늘이 맑은 날 베란다에서 하늘을 올려다보며 중얼거립니다. \'여보, 거기 날씨는 어때?\' 보이지 않는 곳에 있어도 여전히 대화를 나누는 영원한 동반자입니다.'
                ],
                'default': [
                    '손주를 안는 순간, 30년 전 내 아이를 안았던 기억이 겹칩니다. 이번에는 조급함 없이 여유롭게 안을 수 있는 두 번째 기회입니다. 손주가 \'할아버지 최고!\'라고 외칠 때, 회사에서 어떤 상을 받는 것보다 기분 좋습니다. 인생의 가장 소중한 타이틀은 \'할아버지\'였다는 깨달음. 추석에 온 가족이 모인 식탁. 시끌벅적하고 정신없지만, 이 소음이 세상에서 가장 아름다운 음악이라는 걸 아는 나이가 됐습니다. 감사합니다, 이 시간이 주어져서.'
                ]
            }
        };

        // 테마 매칭: 정확한 테마명 → 유사 테마 → default
        function getStoriesForTheme(gen, theme) {
            const genBank = storyBank[gen] || storyBank['2030세대'];
            if (genBank[theme]) return genBank[theme];
            // 유사 테마 매칭
            const themeKeys = Object.keys(genBank);
            for (const key of themeKeys) {
                if (key !== 'default' && theme.includes(key.substring(0, 2))) return genBank[key];
            }
            return genBank['default'] || [];
        }

        const pool = getStoriesForTheme(targetGen, themeName);
        if (pool.length === 0) return ['스토리를 생성할 수 없습니다. 1단계에서 데이터를 먼저 불러와주세요.'];

        // 5개 선택 (풀이 부족하면 반복 허용하되 셔플)
        const results = [];
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        for (let i = 0; i < 5; i++) {
            results.push(shuffled[i % shuffled.length]);
        }

        return results;
    }

    // 수정하기 버튼 이벤트 위임 (innerHTML로 재생성되어도 작동)
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btnEditStory') {
            document.getElementById('selectedStoryDisplay').style.display = 'none';
            document.getElementById('storyEditArea').style.display = 'block';
            document.getElementById('storyInput').value = state.story;
            document.getElementById('storyInput').focus();
        }
    });

    // === 스타일 프롬프트 적용하기 버튼 ===
    document.getElementById('btnApplyPromptData').addEventListener('click', () => {
        const d = state.promptData;
        if (!d || !d.stylePrompt) {
            document.getElementById('promptApplyStatus').textContent = '\u26A0\uFE0F \uBA3C\uC800 \uD504\uB86C\uD504\uD2B8 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC138\uC694';
            document.getElementById('promptApplyStatus').className = 'ref-apply-status error';
            return;
        }

        // 프롬프트에서 핵심 데이터 파싱 & 확정 저장
        state.appliedPrompt = {
            stylePrompt: d.stylePrompt,
            excludeStyles: d.excludeStyles || '',
            genres: d.genres || [],
            mood: d.mood || [],
            target: d.target || [],
            place: d.place || [],
            weirdness: d.weirdness,
            styleInfluence: d.styleInfluence,
            // 프롬프트에서 BPM 추출
            bpm: (d.stylePrompt.match(/(\d+)\s*BPM/i) || [])[1] || '110',
            // 프롬프트에서 mood 서술 추출 (메타태그용)
            moodSentence: extractMoodFromPrompt(d.stylePrompt),
            // 프롬프트에서 key 추출
            key: (d.stylePrompt.match(/([A-G][b#]?\s*(?:major|minor))/i) || [])[1] || ''
        };

        document.getElementById('promptApplyStatus').textContent = '\u2705 \uC2A4\uD0C0\uC77C \uD504\uB86C\uD504\uD2B8 \uC801\uC6A9 \uC644\uB8CC! \uB2E4\uC74C \uB2E8\uACC4\uC5D0 \uBC18\uC601\uB429\uB2C8\uB2E4.';
        document.getElementById('promptApplyStatus').className = 'ref-apply-status success';

        // 2단계 데이터 정보를 미리 세팅
        prefillDataInfo();
    });

    // 프롬프트에서 mood/감정 추출
    function extractMoodFromPrompt(prompt) {
        const lower = prompt.toLowerCase();
        const moodMap = {
            'calm': 'Calm', 'serene': 'Serene', 'peaceful': 'Peaceful',
            'warm': 'Warm', 'cozy': 'Cozy', 'comfortable': 'Comfortable',
            'melancholic': 'Melancholic', 'sad': 'Sad', 'lonely': 'Lonely',
            'joyful': 'Joyful', 'happy': 'Happy', 'upbeat': 'Upbeat',
            'dreamy': 'Dreamy', 'ethereal': 'Ethereal', 'floating': 'Floating',
            'powerful': 'Powerful', 'intense': 'Intense', 'driving': 'Driving',
            'nostalgic': 'Nostalgic', 'reflective': 'Reflective',
            'romantic': 'Romantic', 'tender': 'Tender', 'sweet': 'Sweet',
            'healing': 'Healing', 'soothing': 'Soothing',
            'groovy': 'Groovy', 'funky': 'Funky',
            'exciting': 'Exciting', 'energetic': 'Energetic'
        };
        const found = [];
        for (const [eng, label] of Object.entries(moodMap)) {
            if (lower.includes(eng)) found.push(label);
        }
        return found.length > 0 ? found : ['Reflective'];
    }

    // === 레퍼런스 적용하기 버튼 ===
    document.getElementById('btnApplyRef').addEventListener('click', () => {
        const refText = document.getElementById('referenceInput').value.trim();
        const statusEl = document.getElementById('refApplyStatus');
        const analysisEl = document.getElementById('refAnalysis');

        if (!refText) {
            statusEl.textContent = '\u26A0\uFE0F \uCC38\uACE0\uD560 \uAC00\uC0AC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694';
            statusEl.className = 'ref-apply-status error';
            analysisEl.style.display = 'none';
            return;
        }

        // 레퍼런스 저장
        state.reference = refText;
        parsedRefCache = null; // 캐시 초기화

        // 구조 분석
        const sections = parseReferenceSections(refText);
        const totalLines = refText.split('\n').filter(l => l.trim() && !l.trim().startsWith('[')).length;
        const sectionNames = sections.map(s => s.name + (s.num > 1 ? ' ' + s.num : ''));

        statusEl.textContent = '\u2705 \uB808\uD37C\uB7F0\uC2A4 \uC801\uC6A9 \uC644\uB8CC!';
        statusEl.className = 'ref-apply-status success';

        // 분석 결과 표시
        let analysisHtml = '<strong>\u2705 \uB808\uD37C\uB7F0\uC2A4 \uBD84\uC11D \uACB0\uACFC</strong><br>';
        analysisHtml += `\u2022 \uC139\uC158 \uC218: ${sections.length}\uAC1C (${sectionNames.join(' \u2192 ')})<br>`;
        analysisHtml += `\u2022 \uCD1D \uAC00\uC0AC \uC904 \uC218: ${totalLines}\uC904<br>`;
        sections.forEach(s => {
            if (s.lines.length > 0) {
                const wordCounts = s.lines.map(l => l.trim().split(/\s+/).filter(w => w).length);
                analysisHtml += `\u2022 [${s.name}${s.num > 1 ? ' ' + s.num : ''}]: ${s.lines.length}\uC904 (\uC904\uB2F9 ${wordCounts.join(', ')} \uB2E8\uC5B4)<br>`;
            }
        });
        analysisHtml += '<br>\uD83D\uDCA1 \uC774 \uAD6C\uC870\uC640 \uB3D9\uC77C\uD558\uAC8C \uC0C8\uB85C\uC6B4 \uAC00\uC0AC\uB97C \uC0DD\uC131\uD569\uB2C8\uB2E4.';
        analysisEl.innerHTML = analysisHtml;
        analysisEl.style.display = 'block';
    });

    // === 참고 가사 불러오기 ===
    // 보관함에서 불러오기
    document.getElementById('btnLoadRefFromLibrary').addEventListener('click', () => {
        const lib = JSON.parse(localStorage.getItem('suno-master-library') || '[]');
        const list = document.getElementById('librarySelectList');
        list.innerHTML = lib.length === 0 ? '<p style="padding:20px;text-align:center;color:var(--text-secondary);">보관함이 비어있습니다.</p>' :
            lib.map((item, i) => `<div class="library-select-item" data-idx="${i}" data-type="ref"><div class="lib-sel-title">${(item.genres||[]).join(' + ') || '프롬프트'} - ${new Date(item.createdAt).toLocaleDateString('ko-KR')}</div><div class="lib-sel-preview">${(item.stylePrompt||'').substring(0,80)}...</div></div>`).join('');
        list.querySelectorAll('.library-select-item').forEach(item => {
            item.addEventListener('click', () => {
                const selected = lib[parseInt(item.dataset.idx)];
                // 프롬프트 정보를 참고 가사란에 넣기
                let refText = '';
                if (selected.stylePrompt) refText += `[Style Prompt]\n${selected.stylePrompt}\n\n`;
                if (selected.explanation) refText += `[설명]\n${selected.explanation}\n`;
                document.getElementById('referenceInput').value = refText;
                state.reference = refText;
                document.getElementById('libraryPopup').classList.remove('active');
            });
        });
        document.getElementById('libraryPopup').classList.add('active');
    });

    // 파일에서 불러오기
    document.getElementById('fileLoadRef').addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const content = ev.target.result;
            document.getElementById('referenceInput').value = content;
            state.reference = content;
        };
        reader.readAsText(file, 'UTF-8'); e.target.value = '';
    });

    // 타겟층 텍스트를 프로그램 표준 라벨로 매핑
    function normalizeTargetLabels(targets) {
        const targetLabelMap = {
            'teens': '10대', 'young-adults': '2030세대', 'middle-aged': '5060세대', 'seniors': '시니어세대'
        };
        return (targets || []).map(t => {
            // 이미 표준 라벨이면 그대로
            if (['10대', '2030세대', '5060세대', '시니어세대'].includes(t)) return t;
            // data-value 형식이면 매핑
            if (targetLabelMap[t]) return targetLabelMap[t];
            // 비표준 텍스트를 표준 라벨로 변환
            if (t.includes('10') || t.includes('초등') || t.includes('고등') || t.includes('중학')) return '10대';
            if (t.includes('청년') || t.includes('2030') || t.includes('20') || t.includes('30') || t.includes('대학') || t.includes('직장인')) return '2030세대';
            if (t.includes('중장년') || t.includes('5060') || t.includes('50') || t.includes('60') || t.includes('중년')) return '5060세대';
            if (t.includes('시니어') || t.includes('70') || t.includes('80') || t.includes('어르신') || t.includes('노인')) return '시니어세대';
            return t; // 매핑 불가 시 원본
        });
    }

    function showLoadedPrompt() {
        const d = state.promptData;

        // 타겟층을 표준 라벨로 변환
        d.target = normalizeTargetLabels(d.target);

        // 각 입력창에 데이터 채우기
        document.getElementById('loadedStylePrompt').value = d.stylePrompt || '';
        document.getElementById('loadedExcludeStyles').value = d.excludeStyles || '';
        document.getElementById('loadedTarget').value = (d.target || []).join(', ') || '-';
        document.getElementById('loadedGenres').value = (d.genres || []).join(' + ') || '-';
        document.getElementById('loadedPlace').value = (d.place || []).join(', ') || '-';
        document.getElementById('loadedMood').value = (d.mood || []).join(', ') || '-';

        let optStr = '';
        if (d.weirdness) optStr += `Weirdness: ${d.weirdness}%`;
        if (d.weirdness && d.styleInfluence) optStr += ' | ';
        if (d.styleInfluence) optStr += `Style Influence: ${d.styleInfluence}%`;
        document.getElementById('loadedOptions').value = optStr || '-';

        document.getElementById('loadedExplanation').value = d.explanation || '-';
        document.getElementById('loadedFileName').value = d.fileName || '-';

        document.getElementById('loadedPromptPreview').style.display = 'block';
        document.getElementById('btnNext').disabled = false;

        // 모든 입력창 높이 자동 조절
        setTimeout(() => {
            document.querySelectorAll('.loaded-field-input').forEach(el => {
                if (el.tagName === 'TEXTAREA') {
                    el.style.height = 'auto';
                    el.style.height = el.scrollHeight + 'px';
                }
            });
        }, 50);

        // 2단계 '불러온 데이터 기반 정보'를 미리 세팅 (step2 이동 전에 미리 채워놓기)
        prefillDataInfo();
    }

    // 1단계에서 미리 2단계의 데이터 정보를 채워놓는 함수
    function prefillDataInfo() {
        const guide = document.getElementById('generationGuide');
        if (!guide) return;
        const d = state.promptData || {};
        const moods = (d.mood || []).join(', ');
        const places = (d.place || []).join(', ');
        const genres = (d.genres || []).join(', ');
        const targets = normalizeTargetLabels(d.target || []);

        let html = '';

        // 데이터 기반 정보
        html += '<div style="margin-top:8px;padding-top:8px;border-top:2px solid var(--primary-light);">';
        html += '<strong>\uD83D\uDCCA \uBD88\uB7EC\uC628 \uB370\uC774\uD130 \uAE30\uBC18 \uC815\uBCF4</strong><br>';
        if (genres) html += '\u2022 \uC7A5\uB974: ' + genres + '<br>';
        if (moods) html += '\u2022 \uBD84\uC704\uAE30: ' + moods + '<br>';
        if (places) html += '\u2022 \uC7A5\uC18C/\uD65C\uB3D9: ' + places + '<br>';
        html += '\u2022 \uB178\uB798 \uC5B8\uC5B4: \uD55C\uAD6D\uC5B4<br>';
        if (targets.length) html += '\u2022 \uD0C0\uAC9F\uCE35: ' + targets.join(', ');
        html += '</div>';

        guide.innerHTML = html;
    }

    // === STEP 2: 자동 채우기 ===
    let step2Initialized = false;

    // 분위기 → 감정/장면 매핑 (데이터 기반)
    const MOOD_STORY_MAP = {
        '편안한': { emotion: '평온, 안식', scene: '하루 끝에 소파에 앉아 숨을 고르는 순간' },
        '힐링': { emotion: '치유, 회복', scene: '상처받은 마음이 천천히 아물어가는 과정' },
        '포근한': { emotion: '따스함, 안정', scene: '엄마가 덮어준 이불처럼 따뜻한 기억' },
        '따뜻한': { emotion: '온기, 사랑', scene: '손을 잡아주는 사람이 있다는 것의 의미' },
        '감성적': { emotion: '서정, 그리움', scene: '오래된 사진첩을 넘기며 떠오르는 얼굴들' },
        '몽환적': { emotion: '꿈, 환상', scene: '현실과 꿈 사이에서 헤매는 새벽의 감각' },
        '잔잔한': { emotion: '고요, 평화', scene: '바람 없는 호수 위에 비치는 하늘' },
        '쓸쓸한': { emotion: '외로움, 공허', scene: '붐비는 거리에서 혼자라고 느끼는 순간' },
        '센치한': { emotion: '감상, 아련함', scene: '향수를 불러일으키는 익숙한 노래 한 소절' },
        '새벽감성': { emotion: '고독, 성찰', scene: '잠 못 드는 새벽, 창밖을 바라보며 떠오르는 생각들' },
        '그리운': { emotion: '향수, 그리움', scene: '다시는 돌아갈 수 없는 그때 그 시절' },
        '설레는': { emotion: '기대, 두근거림', scene: '좋아하는 사람의 연락을 기다리는 마음' },
        '사랑': { emotion: '애정, 헌신', scene: '말하지 않아도 알 수 있는 눈빛의 대화' },
        '이별': { emotion: '상실, 아픔', scene: '마지막이라는 걸 알면서도 놓지 못하는 손' },
        '기분좋은': { emotion: '행복, 만족', scene: '아무 이유 없이 기분 좋은 어느 봄날 아침' },
        '상쾌한': { emotion: '활력, 시작', scene: '창문을 활짝 열었을 때 들어오는 첫 바람' },
        '신나는': { emotion: '흥분, 에너지', scene: '오랜만에 만난 친구들과 함께하는 시간' },
        '흥겨운': { emotion: '축제, 즐거움', scene: '모두가 하나되어 춤추는 순간' },
        '파워풀한': { emotion: '열정, 도전', scene: '넘어져도 다시 일어나는 불굴의 의지' },
        '자신감': { emotion: '당당함, 자존감', scene: '나다운 것이 가장 아름답다는 깨달음' },
        '위로': { emotion: '공감, 따뜻함', scene: '괜찮지 않아도 괜찮다고 말해주는 한마디' },
        '비오는날': { emotion: '고독, 성찰', scene: '빗소리를 들으며 떠올리는 지난 날의 기억' },
        '일몰': { emotion: '아쉬움, 아름다움', scene: '하루가 저물어가는 순간의 붉은 하늘' }
    };

    function autoFillStep2() {
        if (step2Initialized) return;
        step2Initialized = true;
        const d = state.promptData;
        if (!d) return;

        // 타겟 세대 복수 자동 선택 (데이터의 모든 타겟층 반영)
        const targets = d.target || [];
        const autoGens = [];
        genBtns.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));

        targets.forEach(t => {
            let gen = '';
            if (t.includes('10')) gen = 'teens';
            else if (t.includes('2030') || t.includes('20') || t.includes('30') || t.includes('청년')) gen = 'young-adults';
            else if (t.includes('5060') || t.includes('50') || t.includes('60') || t.includes('중장년')) gen = 'middle-aged';
            else if (t.includes('시니어') || t.includes('70')) gen = 'seniors';
            if (gen && !autoGens.includes(gen)) autoGens.push(gen);
        });

        autoGens.forEach(gen => {
            const btn = genBtns.querySelector(`[data-value="${gen}"]`);
            if (btn) btn.classList.add('active');
        });
        state.generations = autoGens;
        state.generation = autoGens[0] || '';
        const autoGen = autoGens[0] || 'young-adults';

        // 노래 언어 자동 선택 (기본 한국어)
        langBtns.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        const langBtn = langBtns.querySelector('[data-value="korean"]');
        if (langBtn) langBtn.classList.add('active');
        state.language = 'korean';

        // === 데이터 기반 스토리 5개 추천 ===
        const moods = d.mood || [];
        const places = d.place || [];
        const genres = d.genres || [];
        // 스토리 추천 삭제됨 - 사용자가 드롭다운에서 직접 선택
    }

    function generateStoryRecommendations(moods, places, genres, gen) {
        // 첨부 PDF 기반: SONG_THEMES에서 분위기/장소에 맞는 주제 추천
        if (typeof recommendThemes === 'function') {
            const recommended = recommendThemes(moods, genres, places, 5);
            if (recommended.length > 0) {
                const container = document.getElementById('storyRecommendList');
                // 추천된 주제의 전체 스토리를 출력 (숫자 없이)
                const allStories = [];
                recommended.forEach(theme => {
                    theme.subThemes.forEach(st => {
                        allStories.push({ name: st.name, theme: theme.name, desc: theme.desc, keywords: st.keywords });
                    });
                });

                container.innerHTML = allStories.map((s, i) =>
                    `<div class="story-card" data-idx="${i}"><div class="story-card-title">${s.name}</div><div class="story-card-desc">${s.theme}: ${s.desc}</div><div class="story-card-emotion">${s.keywords.map(k => `<span>${k}</span>`).join('')}</div></div>`
                ).join('');

                state.storyOptions = allStories;

                container.querySelectorAll('.story-card').forEach(card => {
                    card.addEventListener('click', () => {
                        container.querySelectorAll('.story-card').forEach(c => c.classList.remove('selected'));
                        card.classList.add('selected');
                        const sel = state.storyOptions[parseInt(card.dataset.idx)];
                        state.story = `${sel.name}\n${sel.theme}: ${sel.desc}\n\uD0A4\uC6CC\uB4DC: ${sel.keywords.join(', ')}`;
                        state.appliedStory = sel;

                        const display = document.getElementById('selectedStoryDisplay');
                        display.style.display = 'block';
                        display.innerHTML = `<div class="story-confirmed">\u2705 \uC120\uD0DD\uB428: <strong>${sel.name}</strong>\n${sel.theme}: ${sel.desc}\n\uD0A4\uC6CC\uB4DC: ${sel.keywords.join(', ')}</div><div class="story-edit-btn"><button class="btn-edit-toggle" id="btnEditStory">\u270E \uC218\uC815\uD558\uAE30</button></div>`;
                        document.getElementById('storyEditArea').style.display = 'none';
                        document.getElementById('btnEditStory').addEventListener('click', () => {
                            display.style.display = 'none';
                            document.getElementById('storyEditArea').style.display = 'block';
                            document.getElementById('storyInput').value = state.story;
                        });

                        // 드롭다운 선택 해제
                        document.querySelectorAll('.theme-story-item').forEach(c => c.classList.remove('selected'));
                    });
                });
                return; // SONG_THEMES 기반 추천으로 완료
            }
        }

        // fallback: 기존 MOOD_STORY_MAP 기반
        const emotions = [], scenes = [];
        moods.forEach(m => { const mapped = MOOD_STORY_MAP[m]; if (mapped) { emotions.push(mapped.emotion); scenes.push(mapped.scene); } });

        const genreStr = genres.join(', ') || '\uC74C\uC545';
        const stories = [];

        // 1: 분위기 기반
        if (scenes.length > 0) {
            stories.push({ title: scenes[0], desc: `${genreStr} \uC7A5\uB974\uC758 ${moods.join(', ')} \uBD84\uC704\uAE30. ${scenes[0]}\uC744 \uB2F4\uC740 \uB178\uB798. \uB204\uAD6C\uB098 \uD55C \uBC88\uCE4E \uACBD\uD5D8\uD588\uC744 \uADF8 \uC21C\uAC04\uC744 \uC74C\uC545\uC73C\uB85C \uADF8\uB9BD\uB2C8\uB2E4.`, emotions: emotions.slice(0,3) });
        }

        // 2: 감정 중심
        if (emotions.length > 0) {
            stories.push({ title: `${emotions[0].split(',')[0].trim()}\uC758 \uC21C\uAC04`, desc: `${emotions.join(', ')}\uC744 \uB290\uB07C\uB294 \uC21C\uAC04\uC744 \uC9C4\uC194\uD558\uAC8C \uB2F4\uC740 \uB178\uB798. ${places.length ? places[0] + '\uC5D0\uC11C ' : ''}\uB4E4\uC73C\uBA74 \uAC00\uC2B4 \uD55C\uCF20\uC774 \uB530\uB73B\uD574\uC9C0\uB294 \uC774\uC57C\uAE30.`, emotions: emotions.slice(0,3) });
        }

        // 3: 장소 기반
        const placeScenes = { '\uCE74\uD398': '\uCEE4\uD53C \uD5A5 \uAC00\uB4DD\uD55C \uC624\uD6C4, \uCC3D\uAC00\uC5D0 \uC549\uC544 \uB5A0\uC62C\uB9AC\uB294 \uADF8 \uC0AC\uB78C', '\uC9D1': '\uC544\uBB34\uB3C4 \uC5C6\uB294 \uBE48 \uBC29\uC5D0\uC11C \uD63C\uC790 \uB4E3\uB294 \uB178\uB798\uC758 \uC758\uBBF8', '\uB4DC\uB77C\uC774\uBE0C': '\uD578\uB4E4\uC744 \uC7A1\uACE0 \uC544\uBB34 \uB370\uB098 \uB2EC\uB9AC\uACE0 \uC2F6\uC740 \uBC24', '\uD5EC\uC2A4\uC7A5': '\uB540\uC744 \uD758\uB9AC\uBA70 \uC5B4\uC81C\uC758 \uB098\uB97C \uC774\uACA8\uB0B4\uB294 \uACFC\uC815' };
        if (places.length > 0) {
            const ps = placeScenes[places[0]] || `${places[0]}\uC5D0\uC11C \uB290\uB07C\uB294 \uD2B9\uBCC4\uD55C \uAC10\uC815`;
            stories.push({ title: ps, desc: `${places[0]}\uC774\uB77C\uB294 \uACF5\uAC04\uC5D0\uC11C \uC2DC\uC791\uB418\uB294 \uC774\uC57C\uAE30. ${ps}. ${genreStr} \uC7A5\uB974\uB85C \uADF8 \uC21C\uAC04\uC758 \uAC10\uC815\uC744 \uD45C\uD604\uD569\uB2C8\uB2E4.`, emotions: [places[0], ...emotions.slice(0,2)] });
        }

        // 4: 세대별 인생 공감
        const lifeStories = {
            'teens': { title: '\uCC98\uC74C\uC774\uB77C \uC11C\uD234\uB800\uB358 \uADF8 \uB9C8\uC74C', desc: '\uCCAB \uACE0\uBC31, \uCCAB \uC774\uBCC4, \uCCAB \uB3C4\uC804... \uCC98\uC74C\uC774\uB77C \uC11C\uD234\uB800\uC9C0\uB9CC \uADF8\uB798\uC11C \uB354 \uBE5B\uB0AC\uB358 \uC21C\uAC04\uB4E4. \uC5B4\uB978\uC774 \uB418\uC5B4 \uB3CC\uC544\uBCF4\uBA74 \uADF8\uB54C\uAC00 \uAC00\uC7A5 \uC21C\uC218\uD588\uB358 \uB098.' },
            'young-adults': { title: '\uAD1C\uCC2E\uC9C0 \uC54A\uC544\uB3C4 \uAD1C\uCC2E\uC740 \uD558\uB8E8', desc: '\uB9E4\uC77C\uC774 \uC804\uC7C1 \uAC19\uC740 \uD558\uB8E8\uB97C \uBC84\uD2F0\uACE0 \uC788\uB294 \uB2F9\uC2E0\uC5D0\uAC8C. \uC644\uBCBD\uD558\uC9C0 \uC54A\uC544\uB3C4, \uB290\uB824\uB3C4, \uC9C0\uAE08 \uC774 \uC790\uB9AC\uC5D0 \uC788\uB294 \uAC83\uB9CC\uC73C\uB85C \uCDA9\uBD84\uD558\uB2E4\uB294 \uC704\uB85C\uC758 \uB178\uB798.' },
            'middle-aged': { title: '\uB3CC\uC544\uBCF4\uBA74 \uCC38 \uC798 \uC0B4\uC544\uC654\uB2E4', desc: '\uB0A8\uB4E4\uC740 \uBAA8\uB974\uB294 \uBB34\uAC70\uC6B4 \uC9D0\uC744 \uC9C0\uACE0 \uBB35\uBB35\uD788 \uAC78\uC5B4\uC628 \uAE38. \uB204\uAD6C\uC5D0\uAC8C\uB3C4 \uB9D0\uD558\uC9C0 \uBABB\uD588\uB358 \uD798\uB4E6\uACFC, \uADF8\uB798\uB3C4 \uD3EC\uAE30\uD558\uC9C0 \uC54A\uC558\uB358 \uB098\uC5D0\uAC8C \uAC74\uB124\uB294 \uC218\uACE0\uD588\uB2E4\uB294 \uD55C\uB9C8\uB514.' },
            'seniors': { title: '\uADF8\uB54C \uADF8 \uC2DC\uC808\uC774 \uADF8\uB9BD\uC2B5\uB2C8\uB2E4', desc: '\uC816\uC5C8\uB358 \uB0A0\uC758 \uAFC8, \uD568\uAED8 \uB298\uC5B4\uAC00\uC790\uB358 \uC57D\uC18D, \uC138\uC6D4\uC774 \uAC00\uC838\uAC04 \uAC83\uB4E4\uACFC \uB0A8\uACA8\uC900 \uAC83\uB4E4. \uC778\uC0DD\uC774\uB77C\uB294 \uAE34 \uB178\uB798\uC758 \uB9C8\uC9C0\uB9C9 \uCF54\uB7EC\uC2A4\uB97C \uBD80\uB974\uBA70.' }
        };
        const life = lifeStories[gen] || lifeStories['young-adults'];
        stories.push({ title: life.title, desc: life.desc, emotions: emotions.slice(0,3) });

        // 5: 장르+진심
        stories.push({ title: '\uB9D0\uD558\uC9C0 \uBABB\uD55C \uB9C8\uC74C', desc: `\uAC00\uC2B4 \uC18D\uC5D0 \uB2F4\uC544\uB450\uAE30\uB9CC \uD588\uB358 \uB9D0\uB4E4\uC744 ${genreStr} \uC74C\uC545\uC5D0 \uC2E4\uC5B4 \uBCF4\uB0C5\uB2C8\uB2E4. \uB4E3\uB294 \uC0AC\uB78C\uB3C4, \uBD80\uB974\uB294 \uC0AC\uB78C\uB3C4 \uC6B8\uCEF1\uD574\uC9C0\uB294 \uC9C4\uC194\uD55C \uB178\uB798.`, emotions: ['\uC9C4\uC2EC', '\uACF5\uAC10', '\uAC10\uB3D9'] });

        // 부족하면 채우기
        while (stories.length < 5) {
            stories.push({ title: '\uB2F9\uC2E0\uC758 \uC774\uC57C\uAE30', desc: `${genreStr} \uC7A5\uB974\uB85C \uC804\uD558\uB294 \uB2F9\uC2E0\uB9CC\uC758 \uC774\uC57C\uAE30. \uC9C1\uC811 \uC218\uC815\uD574\uC11C \uC6D0\uD558\uB294 \uC8FC\uC81C\uB97C \uC785\uB825\uD558\uC138\uC694.`, emotions: [] });
        }

        // \uB80C\uB354\uB9C1
        const container = document.getElementById('storyRecommendList');
        container.innerHTML = stories.slice(0,5).map((s, i) =>
            `<div class="story-card" data-idx="${i}"><div class="story-card-title">${i+1}. ${s.title}</div><div class="story-card-desc">${s.desc}</div><div class="story-card-emotion">${(s.emotions||[]).map(e => `<span>${e}</span>`).join('')}</div></div>`
        ).join('');

        state.storyOptions = stories;

        container.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', () => {
                container.querySelectorAll('.story-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const sel = stories[parseInt(card.dataset.idx)];
                state.story = `${sel.title}\n${sel.desc}`;
                const display = document.getElementById('selectedStoryDisplay');
                display.style.display = 'block';
                display.innerHTML = `<div class="story-confirmed">\u2705 \uC120\uD0DD\uB428: <strong>${sel.title}</strong>\n${sel.desc}</div><div class="story-edit-btn"><button class="btn-edit-toggle" id="btnEditStory">\u270E \uC218\uC815\uD558\uAE30</button></div>`;
                document.getElementById('storyEditArea').style.display = 'none';
                document.getElementById('btnEditStory').addEventListener('click', () => {
                    display.style.display = 'none';
                    document.getElementById('storyEditArea').style.display = 'block';
                    document.getElementById('storyInput').value = state.story;
                    document.getElementById('storyInput').focus();
                });
            });
        });
    }

    // \uC801\uC6A9/\uCDE8\uC18C
    document.getElementById('btnStoryApply').addEventListener('click', () => {
        const editedStory = document.getElementById('storyInput').value;
        state.story = editedStory;
        // appliedStory도 업데이트 (수정된 내용 반영)
        if (state.appliedStory) {
            state.appliedStory.desc = editedStory;
        } else {
            state.appliedStory = { name: '직접 수정', theme: '', desc: editedStory, keywords: [], type: 'edited' };
        }
        document.getElementById('storyEditArea').style.display = 'none';
        const display = document.getElementById('selectedStoryDisplay');
        display.style.display = 'block';
        display.innerHTML = `<div class="story-confirmed">\u2705 \uC218\uC815 \uC801\uC6A9\uB428:\n${state.story}</div><div class="story-edit-btn"><button class="btn-edit-toggle" id="btnEditStory">\u270E \uB2E4\uC2DC \uC218\uC815</button></div>`;

        // 적용 상태 표시
        document.getElementById('storyApplyStatus').textContent = '\u2705 \uC218\uC815\uB41C \uC2A4\uD1A0\uB9AC \uC801\uC6A9 \uC644\uB8CC!';
        document.getElementById('storyApplyStatus').className = 'ref-apply-status success';

        // 세대 가이드 업데이트 (스토리 정보 반영)
        showGenerationGuide();

        document.getElementById('btnEditStory').addEventListener('click', () => {
            display.style.display = 'none';
            document.getElementById('storyEditArea').style.display = 'block';
            document.getElementById('storyInput').value = state.story;
        });
    });
    document.getElementById('btnStoryCancel').addEventListener('click', () => {
        document.getElementById('storyEditArea').style.display = 'none';
        document.getElementById('selectedStoryDisplay').style.display = 'block';
    });

    // === STEP 2: 노래 설정 ===
    // 언어 단일 선택
    langBtns.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active'); state.language = btn.dataset.value;
        });
    });

    // 언어 적용하기 버튼 - state.language를 확실하게 업데이트
    document.getElementById('btnApplyLanguage').addEventListener('click', () => {
        const active = langBtns.querySelector('.toggle-btn.active');
        if (!active) {
            document.getElementById('langApplyStatus').textContent = '\u26A0 \uC5B8\uC5B4\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694';
            document.getElementById('langApplyStatus').className = 'ref-apply-status error';
            return;
        }
        state.language = active.dataset.value;
        const langNames = { korean: '\uD55C\uAD6D\uC5B4', english: '\uC601\uC5B4', mixed: '\uD55C\uC601 \uD63C\uD569', japanese: '\uC77C\uBCF8\uC5B4', spanish: '\uC2A4\uD398\uC778\uC5B4', chinese: '\uC911\uAD6D\uC5B4', portuguese: '\uD3EC\uB974\uD22C\uAC08\uC5B4', german: '\uB3C5\uC77C\uC5B4', french: '\uD504\uB791\uC2A4\uC5B4', hindi: '\uD78C\uB514\uC5B4', arabic: '\uC544\uB78D\uC5B4' };
        document.getElementById('langApplyStatus').textContent = '\u2713 ' + (langNames[state.language] || state.language) + ' \uC801\uC6A9 \uC644\uB8CC!';
        document.getElementById('langApplyStatus').className = 'ref-apply-status success';
        // 세대 가이드도 업데이트
        showGenerationGuide();
    });

    // 세대 복수 선택
    genBtns.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const active = genBtns.querySelectorAll('.toggle-btn.active');
            state.generations = Array.from(active).map(b => b.dataset.value);
            state.generation = state.generations[0] || '';
            showGenerationGuide();
        });
    });

    // step 2 진입 시 무조건 데이터 정보를 표시하는 함수
    function forceShowDataInfo() {
        // 동기적으로 즉시 실행
        showGenerationGuide();
        // DOM 페인트 보장을 위해 추가로 다시 실행
        requestAnimationFrame(() => { showGenerationGuide(); });
    }

    function showGenerationGuide() {
        const guide = document.getElementById('generationGuide');
        if (!guide) return;
        const gens = state.generations || [];

        // 데이터 기반 정보 추가
        const d = state.promptData || {};
        const moods = (d.mood || []).join(', ');
        const places = (d.place || []).join(', ');
        const genres = (d.genres || []).join(', ');

        let html = '';
        gens.forEach(genKey => {
            const g = GEN_GUIDE[genKey];
            if (!g) return;
            html += `<div style="margin-bottom:16px;padding-bottom:12px;${gens.length > 1 ? 'border-bottom:1px solid rgba(0,0,0,0.06);' : ''}">`;
            html += `<strong>${g.label} \uC5B8\uC5B4 \uAC00\uC774\uB4DC</strong><br>`;
            html += `\u2022 \uD575\uC2EC \uD0A4\uC6CC\uB4DC: ${g.keywords}<br>`;
            html += `\u2022 \uAC10\uC815 \uCF54\uC5B4: ${g.emotion}<br>`;
            html += `\u2022 \uAC00\uC0AC \uC804\uB7B5: ${g.tip}<br>`;
            html += `\u2022 \uD6C5 \uC791\uC131 \uD301: ${g.hookTip}<br>`;
            html += `\u2022 \uC6D0\uD558\uB294 \uB9D0: ${g.want}<br>`;
            html += `\u2022 \uD53C\uD560 \uB9D0: ${g.avoid}<br>`;
            html += `\u2022 \uC8FC\uC694 \uD50C\uB7AB\uD3FC: ${g.platform}`;
            html += `</div>`;
        });

        // 데이터 기반 추가 정보 (1단계 + 2단계 설정 데이터)
        html += `<div style="margin-top:8px;padding-top:8px;border-top:2px solid var(--primary-light);">`;
        html += `<strong>\uD83D\uDCCA \uBD88\uB7EC\uC628 \uB370\uC774\uD130 \uAE30\uBC18 \uC815\uBCF4</strong><br>`;
        if (genres) html += `\u2022 \uC7A5\uB974: ${genres}<br>`;
        if (moods) html += `\u2022 \uBD84\uC704\uAE30: ${moods}<br>`;
        if (places) html += `\u2022 \uC7A5\uC18C/\uD65C\uB3D9: ${places}<br>`;
        // 2단계 설정
        const langNames = { korean: '\uD55C\uAD6D\uC5B4', english: '\uC601\uC5B4', mixed: '\uD55C\uC601 \uD63C\uD569', japanese: '\uC77C\uBCF8\uC5B4', spanish: '\uC2A4\uD398\uC778\uC5B4', chinese: '\uC911\uAD6D\uC5B4', portuguese: '\uD3EC\uB974\uD22C\uAC08\uC5B4', german: '\uB3C5\uC77C\uC5B4', french: '\uD504\uB791\uC2A4\uC5B4', hindi: '\uD78C\uB514\uC5B4', arabic: '\uC544\uB78D\uC5B4' };
        const currentLang = getSelectedLanguage();
        html += `\u2022 \uB178\uB798 \uC5B8\uC5B4: ${langNames[currentLang] || currentLang}<br>`;
        if (state.appliedStory) {
            if (state.appliedStory.theme) html += `\u2022 \uB178\uB798\uC8FC\uC81C: ${state.appliedStory.theme}<br>`;
            if (state.appliedStory.name) html += `\u2022 \uC138\uBD80\uC8FC\uC81C: ${state.appliedStory.name}<br>`;
            if (state.appliedStory.desc) {
                let storyDesc = state.appliedStory.desc.replace(/\n?\uD0A4\uC6CC\uB4DC:.*$/s, '').trim();
                html += `\u2022 \uC2A4\uD1A0\uB9AC\uB0B4\uC6A9: ${storyDesc.substring(0, 150)}${storyDesc.length > 150 ? '...' : ''}<br>`;
            }
            if (state.appliedStory.keywords && state.appliedStory.keywords.length > 0) html += `\u2022 \uC2A4\uD1A0\uB9AC \uD0A4\uC6CC\uB4DC: ${state.appliedStory.keywords.join(', ')}<br>`;
        }
        if ((d.target || []).length) html += `\u2022 \uD0C0\uAC9F\uCE35: ${normalizeTargetLabels(d.target).join(', ')}`;
        html += `</div>`;

        guide.innerHTML = html;
    }

    // === STEP 3: 제목 생성 ===
    const tcBtns = document.getElementById('titleCountBtns');
    tcBtns.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            tcBtns.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const v = btn.dataset.value;
            document.getElementById('customCountRow').style.display = v === 'custom' ? 'flex' : 'none';
            state.titleCount = v === 'custom' ? parseInt(document.getElementById('customCountInput').value) : parseInt(v);
        });
    });

    // 한국어 → 선택 언어 번역 매핑 (단어 + 구문 레벨)
    // 공통 한→영 사전 (다른 언어에 매핑이 없을 때 영어 경유용)
    const KOR_BASE = {
        // 구문 (2어절 이상)
        '또다른 인연': 'Another Fate', '새로운 시작': 'New Beginning', '사랑의 노래': 'Love Song',
        '별빛 아래': 'Under Starlight', '달빛 아래': 'Under Moonlight', '마지막 인사': 'Last Goodbye',
        '영원한 약속': 'Eternal Promise', '다시 만나': 'Meet Again', '우리의 계절': 'Our Season',
        '봄날의 기억': 'Spring Memory', '겨울 바다': 'Winter Ocean', '바람이 분다': 'Wind Blows',
        '다 괜찮아': 'It\'s Okay', '떠나지 마': 'Don\'t Leave', '작은 기적': 'Small Miracle',
        '같은 하늘': 'Same Sky', '잊지 못할': 'Unforgettable', '오늘도 수고했어': 'Well Done Today',
        '너의 온도': 'Your Warmth', '흔들리는 꽃': 'Swaying Flower', '괜찮은 척': 'Pretending Fine',
        '한 걸음 더': 'One More Step', '그때 우리': 'Us Back Then', '눈부신 하루': 'Dazzling Day',
        '시간의 끝': 'End of Time', '그리움의 색': 'Color of Longing', '너만의 길': 'Your Own Path',
        '아직 여기': 'Still Here', '빈자리': 'Empty Seat', '내일의 나': 'Tomorrow\'s Me',
        '고마운 사람': 'Grateful Soul', '푸른 밤': 'Blue Night', '첫사랑의 기억': 'First Love Memory',
        '너를 위해': 'For You', '너만 보여': 'Only You', '너뿐이야': 'Only You',
        '난 몰랐어': 'I Didn\'t Know', '말해줘': 'Tell Me', '넌 특별해': 'You\'re Special',
        '내맘알아?': 'Know My Heart?', '어른이라서': 'Because I\'m Adult', '알아서 할게': 'I\'ll Handle It',
        '그래도 괜찮아': 'Still Okay', '내 속도로': 'At My Pace', '수고했어': 'Well Done',
        '고생 많았어': 'You Worked Hard', '당신 덕분에': 'Thanks to You', '오늘도 감사': 'Grateful Today',
        '함께한 시간': 'Time Together', '인생이란': 'What Is Life', '당신은 특별해': 'You Are Special',
        '세월이 가도': 'Even As Time Goes', '우리의 이야기': 'Our Story', '감사한 하루': 'Thankful Day',
        '아름다운 인생': 'Beautiful Life', '감사합니다': 'Thank You', '건강하세요': 'Be Healthy',
        '사랑합니다': 'I Love You', '행복하세요': 'Be Happy', '고마운 세월': 'Grateful Years',
        '함께해서 좋아요': 'Happy Together', '당신이 있어': 'Because of You', '감사한 인생': 'Grateful Life',
        '함께 걸어요': 'Walk Together', '사랑하는 가족': 'Beloved Family', '우리 함께': 'Together',
        '고운 마음': 'Beautiful Heart', '좋은 날': 'Good Day', '따뜻한 마음': 'Warm Heart',
        '새벽감성': 'Dawn Vibes', '첫느낌': 'First Feeling', '설렘주의': 'Butterflies Warning',
        '심장폭발': 'Heart Explosion', '취향저격': 'My Taste', '마지막 페이지': 'Last Page',
        '별이 되어': 'Become a Star', '내 마음은': 'My Heart',
        // 단어 (1어절)
        '도서관': 'Library', '사랑': 'Love', '별': 'Star', '꿈': 'Dream', '비': 'Rain',
        '밤': 'Night', '봄': 'Spring', '가을': 'Autumn', '겨울': 'Winter', '여름': 'Summer',
        '바다': 'Ocean', '하늘': 'Sky', '달': 'Moon', '빛': 'Light', '마음': 'Heart',
        '눈물': 'Tears', '행복': 'Happiness', '안녕': 'Goodbye', '시작': 'Beginning',
        '인연': 'Fate', '추억': 'Memories', '기다림': 'Waiting', '바람': 'Wind',
        '꽃': 'Flower', '그리움': 'Longing', '노래': 'Song', '기적': 'Miracle',
        '첫눈': 'First Snow', '새벽': 'Dawn', '길': 'Road', '세상': 'World',
        '편지': 'Letter', '약속': 'Promise', '시간': 'Time', '이별': 'Farewell',
        '어둠': 'Darkness', '기억': 'Memory', '태양': 'Sun', '미소': 'Smile', '손': 'Hand',
        '눈': 'Snow', '우리': 'Us', '너': 'You', '나': 'Me', '오늘': 'Today', '내일': 'Tomorrow',
        '친구': 'Friend', '고백': 'Confession', '위로': 'Comfort', '용기': 'Courage',
        '소원': 'Wish', '무지개': 'Rainbow', '파도': 'Wave', '구름': 'Cloud',
        '나비': 'Butterfly', '강': 'River', '숲': 'Forest', '정원': 'Garden',
        '거리': 'Street', '창문': 'Window', '계단': 'Stairs', '지붕': 'Rooftop',
        '카페': 'Café', '공원': 'Park', '골목': 'Alley', '다리': 'Bridge',
        '항구': 'Harbor', '섬': 'Island', '호수': 'Lake', '폭풍': 'Storm',
        '천둥': 'Thunder', '불꽃': 'Flame', '연기': 'Smoke', '그림자': 'Shadow',
        '거울': 'Mirror', '시계': 'Clock', '열쇠': 'Key', '문': 'Door',
        '벽': 'Wall', '계절': 'Season', '향기': 'Scent', '색': 'Color',
        '목소리': 'Voice', '발자국': 'Footstep', '날개': 'Wings', '뿌리': 'Roots',
        '씨앗': 'Seed', '감정': 'Emotion', '진심': 'Sincerity', '온기': 'Warmth',
        '고독': 'Solitude', '자유': 'Freedom', '평화': 'Peace', '희망': 'Hope',
        '축복': 'Blessing', '운명': 'Destiny', '영혼': 'Soul', '천사': 'Angel',
        '일기': 'Diary', '선물': 'Gift', '여행': 'Journey', '집': 'Home',
        '심쿵': 'Heartbeat', '찐이야': 'For Real', '레전드': 'Legend', '킹받네': 'So Annoying',
        '갓생': 'Best Life', '존잼': 'So Fun', '직진': 'Go Straight', '현타': 'Reality Check',
        '번아웃': 'Burnout', '소확행': 'Small Happiness', '워라밸': 'Work Life Balance',
        '혼술': 'Drinking Alone', '자존감': 'Self Esteem', '충분해': 'Enough',
        '나답게': 'Being Me', '천천히': 'Slowly', '한잔해': 'Let\'s Drink', '퇴근길': 'Way Home',
        '지쳤어': 'I\'m Tired', '완전 빠짐': 'Totally Into', '그냥 그래': 'Just So-So',
        '어쩌라고': 'So What', '변함없이': 'Unchanging', '든든한': 'Reliable',
        '힘내요': 'Cheer Up', '건강한': 'Healthy', '오래오래': 'Forever',
        '감사해요': 'Thank You', '건강이 최고': 'Health First',
        '지우개': 'Eraser', '연필': 'Pencil', '칠판': 'Blackboard', '교실': 'Classroom',
        '우산': 'Umbrella', '거짓말': 'Lie', '약속해': 'Promise Me', '웃음': 'Laughter',
        '쓸쓸한': 'Lonely', '설레는': 'Fluttering', '고요한': 'Still', '아침': 'Morning',
        '저녁': 'Evening', '하루': 'One Day', '내년': 'Next Year', '진실': 'Truth'
    };

    const KOR_TO_LANG = {
        japanese: {
            // 구문
            '또다른 인연': '新たな縁', '새로운 시작': '新しい始まり', '첫사랑의 기억': '初恋の記憶',
            '사랑의 노래': '恋の歌', '별빛 아래': '星空の下', '달빛 아래': '月明かりの下',
            '마지막 인사': '最後の挨拶', '다시 만나': 'また会おう', '영원한 약속': '永遠の約束',
            '너를 위해': '君のために', '우리의 계절': '僕らの季節', '봄날의 기억': '春の日の記憶',
            '겨울 바다': '冬の海', '푸른 밤': '青い夜', '고마운 사람': 'ありがとうの人',
            '바람이 분다': '風が吹く', '잊지 못할': '忘れられない', '오늘도 수고했어': '今日もお疲れ様',
            '다 괜찮아': '大丈夫だよ', '떠나지 마': '行かないで', '빈자리': '空席',
            '같은 하늘': '同じ空', '작은 기적': '小さな奇跡', '내일의 나': '明日の私',
            '너의 온도': '君の温度', '어디쯤': 'どこかで', '괜찮은 척': '平気なフリ',
            '한 걸음 더': 'もう一歩', '너만의 길': '君だけの道', '아직 여기': 'まだここに',
            '그때 우리': 'あの頃の僕ら', '안녕 오늘': 'さよなら今日', '흔들리는 꽃': '揺れる花',
            '눈부신 하루': '眩しい一日', '시간의 끝': '時の果てに', '그리움의 색': '恋しさの色',
            '너만 보여': '君しか見えない', '수고했어': 'お疲れ様', '고생 많았어': 'よく頑張ったね',
            '당신 덕분에': 'あなたのおかげ', '함께한 시간': '共に過ごした時間',
            '감사합니다': 'ありがとう', '사랑합니다': '愛してる', '함께 걸어요': '一緒に歩こう',
            '좋은 날': 'いい日', '따뜻한 마음': '温かい心', '별이 되어': '星になって',
            '내 마음은': '私の心は', '그래도 괜찮아': 'それでも大丈夫',
            // 단어
            '도서관': '図書館', '사랑': '愛', '별': '星', '꿈': '夢', '비': '雨',
            '밤': '夜', '봄': '春', '가을': '秋', '겨울': '冬', '여름': '夏',
            '바다': '海', '하늘': '空', '달': '月', '빛': '光', '그리움': '恋しさ',
            '추억': '思い出', '약속': '約束', '시간': '時間', '이별': '別れ',
            '안녕': 'さよなら', '시작': '始まり', '끝': '終わり', '인연': '縁',
            '마음': '心', '눈물': '涙', '행복': '幸せ', '감사': '感謝',
            '어둠': '闇', '새벽': '明け方', '길': '道', '첫눈': '初雪',
            '노래': '歌', '기다림': '待つこと', '오늘': '今日', '내일': '明日',
            '세상': '世界', '너': '君', '나': '僕', '우리': '僕ら',
            '기억': '記憶', '기적': '奇跡', '바람': '風', '꽃': '花',
            '눈': '雪', '태양': '太陽', '미소': '微笑み', '손': '手',
            '편지': '手紙', '친구': '友達', '고백': '告白', '위로': '慰め', '용기': '勇気',
            '소원': '願い', '무지개': '虹', '파도': '波', '구름': '雲', '나비': '蝶',
            '강': '川', '숲': '森', '정원': '庭', '거리': '通り', '창문': '窓',
            '계단': '階段', '지붕': '屋根', '카페': 'カフェ', '공원': '公園', '골목': '路地',
            '다리': '橋', '항구': '港', '섬': '島', '호수': '湖', '폭풍': '嵐',
            '불꽃': '炎', '그림자': '影', '거울': '鏡', '시계': '時計', '열쇠': '鍵',
            '문': '扉', '계절': '季節', '향기': '香り', '색': '色', '목소리': '声',
            '날개': '翼', '감정': '感情', '진심': '本気', '온기': '温もり',
            '고독': '孤独', '자유': '自由', '평화': '平和', '희망': '希望',
            '축복': '祝福', '운명': '運命', '영혼': '魂', '천사': '天使',
            '일기': '日記', '선물': 'プレゼント', '여행': '旅', '집': '家',
            '충분해': '十分だよ', '나답게': '自分らしく', '천천히': 'ゆっくり',
            '지우개': '消しゴム', '연필': '鉛筆', '칠판': '黒板', '교실': '教室',
            '우산': '傘', '거짓말': '嘘', '진실': '真実', '약속해': '約束して',
            '웃음': '笑い', '쓸쓸한': '寂しい', '설레는': 'ときめく', '고요한': '静かな',
            '아침': '朝', '저녁': '夕方', '하루': '一日', '내년': '来年'
        },
        spanish: {
            '또다른 인연': 'Otro Destino', '새로운 시작': 'Nuevo Comienzo', '사랑의 노래': 'Canción de Amor',
            '별빛 아래': 'Bajo las Estrellas', '마지막 인사': 'Último Adiós', '영원한 약속': 'Promesa Eterna',
            '봄날의 기억': 'Recuerdo de Primavera', '겨울 바다': 'Mar de Invierno', '바람이 분다': 'Sopla el Viento',
            '다 괜찮아': 'Todo Está Bien', '떠나지 마': 'No Te Vayas', '작은 기적': 'Pequeño Milagro',
            '같은 하늘': 'Mismo Cielo', '잊지 못할': 'Inolvidable', '오늘도 수고했어': 'Buen Trabajo Hoy',
            '도서관': 'Biblioteca', '사랑': 'Amor', '별': 'Estrella', '꿈': 'Sueño', '비': 'Lluvia',
            '밤': 'Noche', '봄': 'Primavera', '가을': 'Otoño', '겨울': 'Invierno', '여름': 'Verano',
            '바다': 'Mar', '하늘': 'Cielo', '달': 'Luna', '빛': 'Luz', '마음': 'Corazón',
            '인연': 'Destino', '눈물': 'Lágrimas', '행복': 'Felicidad', '안녕': 'Adiós',
            '시작': 'Comienzo', '추억': 'Recuerdos', '기다림': 'Espera', '바람': 'Viento',
            '꽃': 'Flor', '그리움': 'Nostalgia', '노래': 'Canción', '기적': 'Milagro',
            '편지': 'Carta', '친구': 'Amigo', '고백': 'Confesión', '위로': 'Consuelo',
            '용기': 'Valentía', '소원': 'Deseo', '여행': 'Viaje', '집': 'Hogar',
            '자유': 'Libertad', '희망': 'Esperanza', '운명': 'Destino', '영혼': 'Alma'
        },
        english: {}, // 영어는 KOR_BASE를 직접 사용
        chinese: {
            '또다른 인연': '另一段缘', '새로운 시작': '新的开始', '사랑의 노래': '爱的歌',
            '별빛 아래': '星光下', '마지막 인사': '最后的问候', '영원한 약속': '永远的约定',
            '봄날의 기억': '春天的记忆', '겨울 바다': '冬天的海', '바람이 분다': '风在吹',
            '다 괜찮아': '一切都好', '떠나지 마': '别走', '작은 기적': '小奇迹',
            '도서관': '图书馆', '사랑': '爱', '별': '星', '꿈': '梦', '비': '雨',
            '밤': '夜', '바다': '海', '하늘': '天空', '달': '月', '빛': '光',
            '마음': '心', '눈물': '泪', '인연': '缘分', '행복': '幸福',
            '추억': '回忆', '바람': '风', '꽃': '花', '그리움': '思念', '기적': '奇迹',
            '편지': '信', '친구': '朋友', '고백': '告白', '위로': '安慰', '용기': '勇气',
            '소원': '心愿', '여행': '旅行', '집': '家', '자유': '自由', '희망': '希望'
        },
        portuguese: {
            '또다른 인연': 'Outro Destino', '새로운 시작': 'Novo Começo', '마지막 인사': 'Último Adeus',
            '사랑': 'Amor', '별': 'Estrela', '꿈': 'Sonho', '비': 'Chuva', '밤': 'Noite',
            '바다': 'Mar', '하늘': 'Céu', '달': 'Lua', '빛': 'Luz', '마음': 'Coração',
            '인연': 'Destino', '바람': 'Vento', '꽃': 'Flor', '편지': 'Carta', '친구': 'Amigo'
        },
        german: {
            '또다른 인연': 'Ein Neues Schicksal', '새로운 시작': 'Neuer Anfang', '마지막 인사': 'Letzter Gruß',
            '사랑': 'Liebe', '별': 'Stern', '꿈': 'Traum', '비': 'Regen', '밤': 'Nacht',
            '바다': 'Meer', '하늘': 'Himmel', '달': 'Mond', '빛': 'Licht', '마음': 'Herz',
            '인연': 'Schicksal', '바람': 'Wind', '꽃': 'Blume', '편지': 'Brief', '친구': 'Freund'
        },
        french: {
            '또다른 인연': 'Un Autre Destin', '새로운 시작': 'Nouveau Départ', '마지막 인사': 'Dernier Adieu',
            '사랑': 'Amour', '별': 'Étoile', '꿈': 'Rêve', '비': 'Pluie', '밤': 'Nuit',
            '바다': 'Mer', '하늘': 'Ciel', '달': 'Lune', '빛': 'Lumière', '마음': 'Cœur',
            '인연': 'Destin', '바람': 'Vent', '꽃': 'Fleur', '편지': 'Lettre', '친구': 'Ami'
        },
        hindi: {
            '또다른 인연': 'एक और रिश्ता', '사랑': 'प्रेम', '꿈': 'सपना', '밤': 'रात',
            '하늘': 'आसमान', '달': 'चाँद', '빛': 'रोशनी', '마음': 'दिल', '인연': 'किस्मत',
            '편지': 'पत्र', '친구': 'दोस्त'
        },
        arabic: {
            '또다른 인연': 'قدر آخر', '사랑': 'حب', '꿈': 'حلم', '밤': 'ليل',
            '하늘': 'سماء', '달': 'قمر', '빛': 'نور', '마음': 'قلب', '인연': 'قدر',
            '편지': 'رسالة', '친구': 'صديق'
        }
    };

    function translateTitleToLanguage(korTitle, lang) {
        const hasKorean = /[\uAC00-\uD7A3]/.test(korTitle);
        if (!hasKorean) return korTitle;
        if (lang === 'korean') return korTitle;

        // 해당 언어 매핑 → 없으면 KOR_BASE(영어) 경유
        const map = KOR_TO_LANG[lang] || {};
        const trimmed = korTitle.trim();

        // 1단계: 해당 언어 매핑에서 전체 제목 매칭
        if (map[trimmed]) {
            return `${map[trimmed]} (${trimmed})`;
        }

        // 2단계: KOR_BASE(영어)에서 전체 제목 매칭 → 영어로라도 번역
        if (lang === 'english' && KOR_BASE[trimmed]) {
            return `${KOR_BASE[trimmed]} (${trimmed})`;
        }

        // 3단계: 긴 구문부터 greedy matching (해당 언어)
        const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
        let translated = trimmed;
        let anyMatched = false;

        for (const kor of sortedKeys) {
            if (translated.includes(kor)) {
                translated = translated.replace(kor, map[kor]);
                anyMatched = true;
            }
        }

        if (anyMatched) {
            return `${translated} (${trimmed})`;
        }

        // 4단계: KOR_BASE(영어) 긴 구문부터 greedy matching
        const baseKeys = Object.keys(KOR_BASE).sort((a, b) => b.length - a.length);
        translated = trimmed;
        anyMatched = false;

        for (const kor of baseKeys) {
            if (translated.includes(kor)) {
                translated = translated.replace(kor, KOR_BASE[kor]);
                anyMatched = true;
            }
        }

        if (anyMatched) {
            return `${translated} (${trimmed})`;
        }

        // 5단계: 단어 분리 후 각각 번역 (해당 언어 → KOR_BASE 순서)
        const words = trimmed.split(/\s+/);
        if (words.length >= 1) {
            const translatedWords = words.map(w => map[w] || KOR_BASE[w] || w);
            const result = translatedWords.join(' ');
            if (result !== trimmed) {
                return `${result} (${trimmed})`;
            }
        }

        // 최종 실패: 영어 경유 번역 (KOR_BASE 사용)
        // KOR_BASE에도 없으면 해당 언어 표기 + 한국어 원본 유지
        // 번역 실패 시 원본 그대로 반환 (태그 붙이지 않음)
        return trimmed;
    }

    // 노래 제목 직접 입력
    // state.titles에는 원본(한국어/영어 등)을 저장, 표시할 때 getTitleWithTranslation()이 설정 언어로 변환
    // 직접 입력된 제목을 "영어 (한국어)" 형식으로 변환
    function formatCustomTitle(val) {
        // 이미 (번역) 형식이면 그대로
        if (val.includes('(') && val.includes(')')) return val;

        const hasKorean = /[\uAC00-\uD7A3]/.test(val);
        const isLatin = /^[a-zA-Z\s'\-!?,.:;]+$/.test(val.trim());

        if (hasKorean && !isLatin) {
            // 한국어 입력 → 영어로 번역 시도
            const trimmed = val.trim();

            // KOR_BASE에서 전체/부분 매칭
            const baseKeys = Object.keys(KOR_BASE).sort((a, b) => b.length - a.length);
            let translated = trimmed;
            let anyMatched = false;
            for (const kor of baseKeys) {
                if (translated.includes(kor)) {
                    translated = translated.replace(kor, KOR_BASE[kor]);
                    anyMatched = true;
                }
            }
            if (anyMatched) return `${translated} (${trimmed})`;

            // 단어별 번역
            const words = trimmed.split(/\s+/);
            const translatedWords = words.map(w => KOR_BASE[w] || w);
            const result = translatedWords.join(' ');
            if (result !== trimmed) return `${result} (${trimmed})`;

            // 번역 실패 시 원본 유지
            return val;
        } else if (isLatin) {
            // 영어 입력 → 한국어 번역 추가
            const kor = TITLE_KOR_MAP[val];
            if (kor) return `${val} (${kor})`;

            // TITLE_KOR_MAP에 없으면 단어별 번역 시도
            const words = val.trim().split(/\s+/);
            const korWords = words.map(w => {
                // 대소문자 무시 검색
                const found = Object.entries(TITLE_KOR_MAP).find(([k]) => k.toLowerCase() === w.toLowerCase());
                if (found) return found[1];
                // KOR_BASE 역방향 검색 (영어→한국어)
                const baseFound = Object.entries(KOR_BASE).find(([, eng]) => eng.toLowerCase() === w.toLowerCase());
                if (baseFound) return baseFound[0];
                return null;
            });

            // 번역된 단어가 하나라도 있으면 조합
            if (korWords.some(w => w !== null)) {
                const korTitle = korWords.map((w, i) => w || words[i]).join(' ');
                return `${val} (${korTitle})`;
            }

            return val;
        }
        return val;
    }

    document.getElementById('btnAddCustomTitle').addEventListener('click', () => {
        const input = document.getElementById('customTitleInput');
        const val = input.value.trim();
        if (!val) return;

        const formatted = formatCustomTitle(val);
        if (!state.titles.includes(formatted)) {
            state.titles.push(formatted);
        }
        input.value = '';
        renderTitles();
        document.getElementById('titlesResult').style.display = 'block';
    });
    document.getElementById('customTitleInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('btnAddCustomTitle').click();
    });

    document.getElementById('btnGenerateTitles').addEventListener('click', () => {
        state.story = document.getElementById('storyInput').value.trim();
        lockedTitles = [];
        previouslyGeneratedTitles = new Set(); // 첫 생성 시 이력 초기화
        state.titles = generateTitles(state.titleCount);
        renderTitles();
    });

    // 다시 생성 버튼 - 이전 제목과 절대 중복 안 됨
    document.getElementById('btnRegenerateTitles').addEventListener('click', () => {
        // 고정되지 않은 이전 제목들을 previouslyGeneratedTitles에 추가 (중복 방지)
        state.titles.forEach(t => {
            if (!lockedTitles.includes(t)) {
                previouslyGeneratedTitles.add(t);
            }
        });
        state.titles = generateTitles(state.titleCount);
        renderTitles();
        document.getElementById('titleConfirmed').style.display = 'none';
    });

    // 제목 확정하기 버튼
    document.getElementById('btnApplyTitles').addEventListener('click', () => {
        if (state.titles.length === 0) return;

        state.confirmedTitles = [...state.titles];
        state.selectedTitle = state.titles[0]; // 코러스용 메인 제목

        const confirmedEl = document.getElementById('titleConfirmed');
        let html = '<h4>\u2705 \uC81C\uBAA9 \uD655\uC815 \uC644\uB8CC! (\uCF54\uB7EC\uC2A4\uC5D0 \uBC18\uC601\uB428)</h4>';
        html += '<div class="title-confirmed-list">';
        state.titles.forEach((t, i) => { html += `${i + 1}. ${getTitleWithTranslation(t)}<br>`; });
        html += '</div>';
        confirmedEl.innerHTML = html;
        confirmedEl.style.display = 'block';
    });

    // 생성된 노래 제목 숨기기/표시하기 토글
    document.getElementById('titlesResultHeader').addEventListener('click', () => {
        const body = document.getElementById('titlesResultBody');
        if (body.style.display === 'none') {
            body.style.display = 'block';
        } else {
            body.style.display = 'none';
        }
    });

    // 언어별 제목 데이터베이스
    const TITLE_DB = {
        korean: [
            '그 밤', '첫눈', '새벽빛', '너에게', '우리의 계절', '마지막 인사', '다시 봄', '빗소리',
            '푸른 밤', '손끝', '기다림', '그때 우리', '별이 되어', '안녕 오늘', '내 마음은',
            '너의 온도', '흔들리는 꽃', '달빛 아래', '어디쯤', '괜찮은 척', '시간의 끝',
            '바람이 분다', '눈부신 하루', '고마운 사람', '다 괜찮아', '오늘도 수고했어',
            '떠나지 마', '한 걸음 더', '너만의 길', '아직 여기', '빈자리', '마지막 페이지',
            '같은 하늘', '잊지 못할', '내일의 나', '작은 기적', '사랑이란', '그리움의 색',
            '봄날의 기억', '겨울 바다'
        ],
        english: [
            'Beautiful Pain', 'Sweet Goodbye', 'Loud Silence', 'Cold Fire',
            'Rainy Window', 'Neon Lights', 'Empty Chair', 'Paper Plane', 'Last Train',
            'Golden Hour', 'Ocean Eyes', 'Better Days', 'Still Here',
            'Midnight Rain', 'Burning Low', 'Quiet Storm', 'Fading Light',
            'Silent Waves', 'Crystal Tears', 'Broken Crown', 'Velvet Sky',
            'Restless Heart', 'Shadow Dance', 'Winter Sun', 'Neon Dreams',
            'Glass Heart', 'Silver Lining', 'Frozen Time', 'Bitter Sweet',
            'Distant Shore', 'Falling Stars', 'Empty Roads', 'Lost Signal',
            'Crimson Tide', 'Paper Moon', 'Wasted Youth', 'Blind Faith',
            'Chasing Dawn', 'Endless Blue', 'Ghost Town', 'Iron Rose'
        ],
        japanese: [
            '\u5915\u7126\u308C\u306E\u9053', '\u82B1\u706B\u306E\u591C', '\u604B\u306E\u6B4C', '\u661F\u7A7A\u306E\u4E0B',
            '\u96E8\u97F3\u306E\u8A18\u61B6', '\u6D99\u306E\u96E8', '\u6708\u660E\u304B\u308A\u306E\u7A93', '\u3055\u3088\u306A\u3089\u306E\u5F8C',
            '\u541B\u3078\u306E\u624B\u7D19', '\u5922\u306E\u4E2D\u3067', '\u6625\u98A8\u306E\u5F8C', '\u79CB\u685C\u306E\u8272',
            '\u5FC3\u97F3\u306E\u30EA\u30BA\u30E0', '\u5149\u306E\u5411\u3053\u3046', '\u6C38\u9060\u306E\u7D04\u675F', '\u60F3\u3044\u51FA\u306E\u7BB1',
            '\u58CA\u308C\u305F\u7FFC', '\u9752\u3044\u9CE5\u306E\u6B4C', '\u5922\u899A\u3081\u306E\u671D', '\u6700\u5F8C\u306E\u30C0\u30F3\u30B9'
        ],
        spanish: [
            'Coraz\u00F3n', 'Bailando', 'Fuego', 'Lluvia', 'Sue\u00F1os',
            'Amor Eterno', 'Noche', 'Cielo', 'Libre', 'Esperanza',
            'Destino', 'Mariposa', 'Sol y Luna', 'Alma', 'Silencio',
            'Camino', 'Estrella', 'Pasi\u00F3n', 'Recuerdos', 'Viento'
        ],
        chinese: [
            '\u6708\u5149', '\u661F\u8FB0', '\u68A6\u5883', '\u5F69\u8679', '\u65F6\u5149',
            '\u5FC3\u8DDF', '\u6D77\u6D6A', '\u6625\u98CE', '\u6D41\u661F', '\u5929\u7A7A',
            '\u7EA2\u8C46', '\u5BD2\u6885', '\u6708\u82B1', '\u5149\u5F71', '\u5C71\u6C34',
            '\u5FC3\u58F0', '\u96E8\u540E', '\u65E5\u843D', '\u5929\u6DAF', '\u6D41\u5E74'
        ],
        portuguese: [
            'Saudade', 'Cora\u00E7\u00E3o', 'Sol Nascente', 'Mar Azul', 'Estrela',
            'Noite', 'Lua Cheia', 'Liberdade', 'Amor', 'Sonho',
            'Destino', 'Flor', 'Tempestade', 'Vida', 'Aurora',
            'Esperan\u00E7a', 'Luz', 'Chuva', 'Vento', 'Caminho'
        ],
        german: [
            'Mondlicht', 'Sternschnuppe', 'Heimat', 'Sehnsucht', 'Freiheit',
            'Traumland', 'Nachtlied', 'Stille', 'Morgenrot', 'Seele',
            'Fernweh', 'Zeitlos', 'Herzschlag', 'Grenzenlos', 'Lichtblick',
            'Sonnenwende', 'Sternenstaub', 'Weltschmerz', 'Geborgenheit', 'Wanderlust'
        ],
        french: [
            'Clair de Lune', 'Mon Amour', 'Chanson', 'R\u00EAve', '\u00C9toile',
            'Soleil', 'Libert\u00E9', 'Voyage', 'Coeur', 'Pluie',
            'Nuit Blanche', 'Belle', 'Espoir', '\u00C2me', 'Douceur',
            'Papillon', 'Brume', 'Aurore', 'Destin', 'Harmonie'
        ],
        hindi: [
            '\u091A\u093E\u0902\u0926\u0928\u0940', '\u0938\u092A\u0928\u093E', '\u092A\u094D\u0930\u0947\u092E',
            '\u0926\u093F\u0932', '\u0930\u093E\u0924', '\u0938\u0942\u0930\u091C', '\u092E\u0941\u0938\u094D\u0915\u093E\u0928',
            '\u0906\u0936\u093E', '\u091C\u093F\u0902\u0926\u0917\u0940', '\u0916\u0941\u0936\u0940',
            '\u0906\u0938\u092E\u093E\u0928', '\u0924\u093E\u0930\u0947', '\u092C\u093E\u0930\u093F\u0936',
            '\u0927\u0941\u0928', '\u092A\u0930\u093F\u0928\u094D\u0926\u093E', '\u0938\u092B\u0930',
            '\u0926\u0930\u094D\u092A\u0923', '\u0909\u092E\u094D\u092E\u0940\u0926', '\u091C\u0928\u094D\u0928\u0924', '\u0930\u094B\u0936\u0928\u0940'
        ],
        arabic: [
            '\u0642\u0645\u0631', '\u0646\u062C\u0645\u0629', '\u062D\u0644\u0645',
            '\u062D\u0628', '\u0644\u064A\u0644', '\u0634\u0645\u0633', '\u0623\u0645\u0644',
            '\u0631\u0648\u062D', '\u0633\u0644\u0627\u0645', '\u062D\u0631\u064A\u0629',
            '\u0633\u0645\u0627\u0621', '\u0628\u062D\u0631', '\u0632\u0647\u0631\u0629',
            '\u0645\u0637\u0631', '\u0631\u064A\u062D', '\u0641\u062C\u0631',
            '\u063A\u0631\u0648\u0628', '\u0642\u0644\u0628', '\u0637\u0631\u064A\u0642', '\u0646\u0648\u0631'
        ],
        mixed: [] // 한영 혼합은 korean + english 합침
    };
    TITLE_DB.mixed = [...TITLE_DB.korean, ...TITLE_DB.english];

    let lockedTitles = [];
    let previouslyGeneratedTitles = new Set(); // 이전에 생성된 모든 제목 추적

    // 제목 유사도 체크 (70% 이상 동일 금지)
    function calcSimilarity(a, b) {
        const la = a.toLowerCase(), lb = b.toLowerCase();
        if (la === lb) return 1;
        const longer = la.length > lb.length ? la : lb;
        const shorter = la.length > lb.length ? lb : la;
        if (longer.length === 0) return 1;
        let matches = 0;
        for (let i = 0; i < shorter.length; i++) {
            if (longer.includes(shorter[i])) matches++;
        }
        return matches / longer.length;
    }

    // 유명 곡 제목 DB (유사도 체크용)
    const FAMOUS_TITLES = [
        'Blinding Lights', 'Shape of You', 'Bohemian Rhapsody', 'Rolling in the Deep',
        'Dynamite', 'Butter', 'Spring Day', 'Love Scenario', 'Eight', 'Celebrity',
        '첫눈처럼 너에게로 가겠다', '좋은 날', '거짓말', '뚜두뚜두', '작은 것들을 위한 시',
        'Yesterday', 'Imagine', 'Hotel California', 'Stairway to Heaven', 'Hallelujah'
    ];

    function isTitleTooSimilar(title) {
        return FAMOUS_TITLES.some(famous => calcSimilarity(title, famous) >= 0.7);
    }

    function getSelectedLanguage() {
        // 버튼에서 읽기 (가장 최신 UI 상태 반영)
        const active = langBtns ? langBtns.querySelector('.toggle-btn.active') : null;
        if (active) {
            state.language = active.dataset.value;
            return state.language;
        }
        return state.language || 'korean';
    }

    // 세대별 제목 스타일 DB - 각 세대 특성에 맞는 제목 패턴
    const GEN_TITLE_STYLE = {
        teens: {
            korean: ['너만 보여', '심쿵', '찐이야', '완전 빠짐', '레전드', '킹받네', '갓생', '존잼', '너뿐이야', '첫느낌',
                     '설렘주의', '심장폭발', '내맘알아?', '난 몰랐어', '말해줘', 'OMG', '취향저격', '넌 특별해', '찐사랑', '직진'],
            english: ['Crush', 'Feels', 'Obsessed', 'No Cap', 'Vibe Check', 'Main Character', 'Glow Up', 'Slay',
                      'Lowkey', 'Highkey', 'For Real', 'No Filter', 'On Repeat', 'My Type', 'Catch Me',
                      'So Into You', 'Can\'t Stop', 'Bad Idea', 'Sweet Chaos', 'Plot Twist']
        },
        'young-adults': {
            korean: ['현타', '번아웃', '소확행', '워라밸', '혼술', '자존감', '괜찮은 척', '그냥 그래', '어쩌라고',
                     '어른이라서', '알아서 할게', '나답게', '천천히', '한잔해', '퇴근길', '새벽감성', '지쳤어', '그래도 괜찮아',
                     '충분해', '내 속도로'],
            english: ['Burnout', 'Adulting', 'Self Love', 'Let It Be', 'On My Own', 'Growing Pains', 'Real Talk',
                      'Enough', 'Breathe', 'My Pace', 'Late Night', 'Quarter Life', 'Worth It', 'Take Your Time',
                      'Figure It Out', 'Glass Half Full', 'Raw Deal', 'Slow Down', 'Room to Grow', 'Honest']
        },
        'middle-aged': {
            korean: ['수고했어', '고생 많았어', '당신 덕분에', '오늘도 감사', '함께한 시간', '인생이란',
                     '아직도 설레', '당신은 특별해', '고마워요', '세월이 가도', '우리의 이야기', '변함없이',
                     '든든한 당신', '힘내요 당신', '행복한 오늘', '좋은 사람', '그대가 있어', '감사한 하루',
                     '가슴 뛰는 날', '아름다운 인생'],
            english: ['Worth Every Mile', 'Standing Strong', 'Golden Years', 'Through It All', 'Still Standing',
                      'Grateful Heart', 'Time Well Spent', 'Built to Last', 'Rise Again', 'Legacy',
                      'Steady Ground', 'Unshaken', 'Proud Heart', 'Long Road Home', 'Second Wind',
                      'Timeless Bond', 'Seasons Change', 'Iron Will', 'Heart of Gold', 'Homebound']
        },
        seniors: {
            korean: ['감사합니다', '건강하세요', '사랑합니다', '행복하세요', '고마운 세월', '함께해서 좋아요',
                     '당신이 있어', '건강한 하루', '감사한 인생', '오래오래', '행복한 노래', '고마워 내 사람',
                     '좋은 날', '따뜻한 마음', '함께 걸어요', '감사해요 오늘', '건강이 최고', '사랑하는 가족',
                     '우리 함께', '고운 마음'],
            english: ['Thank You', 'Blessed Life', 'Forever Young', 'Gentle Days', 'Family Song',
                      'Golden Sunset', 'With Gratitude', 'Peaceful Heart', 'Together Always', 'Beautiful Life',
                      'Warm Embrace', 'Heart Full', 'Grace Notes', 'Simple Joy', 'Love Remains',
                      'Cherished Days', 'Held Close', 'Soft Morning', 'Ever Grateful', 'Home Sweet Home']
        }
    };

    // 스토리/주제 기반 제목 동적 생성 (빌보드 히트곡 공식 반영)
    // 빌보드 1~10위 히트곡 제목 패턴: 감정 키워드 + 구체적 이미지 + 짧지만 울림 있는 문장
    const BILLBOARD_TITLE_PATTERNS = {
        korean: {
            // 감정+이미지 조합 패턴 (빌보드 스타일: 짧은 문장형 + 감성 키워드)
            emotion_image: [
                '{emotion}이 번지는 {time}', '{place}에서 부르는 {emotion}', '{emotion} 가득한 {image}',
                '{image} 위의 {emotion}', '{time}의 {emotion}', '{emotion}이 머무는 곳',
                '{image}처럼 피어나는 {emotion}', '{emotion}을 담은 {image}'
            ],
            // 질문형/명령형 (빌보드 공식)
            question: [
                '그때 {emotion} 알았을까', '{image} 기억나?', '{emotion} 느껴본 적 있나요',
                '왜 자꾸 {image}이 떠오를까', '다시 {emotion}할 수 있을까',
                '{place}에서 널 만나면', '이게 {emotion}인 걸까'
            ],
            // 역설/반전 (빌보드 공식)
            paradox: [
                '아름다운 {emotion}', '달콤한 {image}', '차가운 {emotion}',
                '뜨거운 {image}', '조용한 {emotion}', '찬란한 {image}',
                '익숙한 {emotion}', '낯선 {image}'
            ],
            // 공감/진심 문장형 (감동/공감/진심 - 시청자가 느끼는)
            sentence: [
                '{emotion}이 찾아온 {time}', '나만의 {image}', '너에게 보내는 {emotion}',
                '{image} 같은 너', '{emotion}을 걷는 밤', '우리의 {image}',
                '{time}에 쓰는 {emotion}', '{emotion}이라 괜찮아',
                '{image}에 닿는 순간', '너라는 {emotion}', '{emotion}의 온도',
                '내 마음의 {image}', '{time}, {emotion}을 만나다',
                '{emotion}이 노래가 될 때', '아직도 {emotion}한 {time}',
                '{image} 너머의 {emotion}', '그날의 {emotion}은 {image}이었다',
                '{emotion}이 시작되는 곳', '{image}에서 만난 {emotion}',
                '{emotion} 하나면 돼', '{time}의 {image}', '다시 {emotion}할 수 있다면',
                '{emotion}을 닮은 {image}', '{image}와 {emotion} 사이',
                '우리가 {emotion}이던 {time}', '{emotion}이 머무는 {image}'
            ]
        },
        english: {
            emotion_image: [
                '{emotion} in the {image}', '{image} of {emotion}', '{emotion} After {time}',
                '{time} {emotion}', 'Where {emotion} Lives', '{image} and {emotion}',
                '{emotion} Like {image}', 'Chasing {emotion}'
            ],
            question: [
                'Do You {emotion}?', 'What If {emotion}?', 'Can You {emotion}?',
                'Remember the {image}?', 'Where Did {emotion} Go?'
            ],
            paradox: [
                'Beautiful {emotion}', 'Silent {image}', 'Frozen {emotion}',
                'Burning {image}', 'Sweet {emotion}', 'Broken {image}'
            ],
            sentence: [
                '{emotion} Is All I Know', 'The {image} We Shared', '{emotion} Runs Deep',
                'Lost in {emotion}', '{image} on My Mind', 'One More {emotion}',
                'Through the {image}', 'When {emotion} Fades', 'Hold On to {emotion}',
                '{emotion} Never Lies', 'Dancing with {emotion}', 'The Last {image}',
                '{time} of {emotion}', 'Falling Into {image}', '{emotion} Is Enough'
            ]
        }
    };

    // 스토리 텍스트에서 핵심 단어를 직접 추출
    function extractWordsFromStory(text) {
        if (!text) return [];
        // 의미 있는 한국어 명사/감정어 사전
        const meaningfulWords = [
            '사랑','마음','눈물','꿈','희망','기억','추억','약속','그리움','설렘','이별','만남',
            '인연','운명','시간','세월','기다림','행복','감사','위로','용기','진심','고백','편지',
            '미소','웃음','눈빛','손','포옹','키스','심장','가슴','영혼','소망','기적','축복',
            '소개팅','직감','케미','첫사랑','데이트','프러포즈','결혼','가족','부모','자녀',
            '친구','동기','선배','후배','동료','연인','짝꿍','우리','너','나',
            '교실','학교','카페','공원','바다','하늘','별','달','해','비','눈','꽃','나무','숲',
            '거리','골목','계단','지붕','창문','문','다리','강','호수','산','섬','항구',
            '봄','여름','가을','겨울','새벽','아침','저녁','밤','노을','석양','일출','황혼',
            '라면','커피','맥주','초콜릿','우산','사진','일기','노래','기타','피아노',
            '버스','기차','비행기','자동차','자전거','택시',
            '반지','선물','생일','졸업','입학','퇴근','출근','여행','산책','드라이브',
            '떨림','두근','빨개','설레','웃는','우는','잠든','깨어나','달리','걷는',
            '뜨거운','차가운','따뜻한','포근한','그리운','외로운','행복한','슬픈','기쁜',
            '수줍은','부끄러운','용기있는','당당한','조용한','시끄러운',
            '흰머리','건강','돋보기','요리','된장찌개','LP','영화','앨범',
            '취미','공연','축제','모닥불','풍선','놀이공원','롤러코스터',
            '카톡','인스타','SNS','프로필','영상통화','매칭앱',
            '수고','고생','인정','감동','공감','위안','응원','격려',
            '퇴직','은퇴','재취업','창업','도전','성장','성공','실패',
            '아이','딸','아들','손주','할머니','할아버지','엄마','아빠'
        ];
        const found = [];
        meaningfulWords.forEach(w => {
            if (text.includes(w)) found.push(w);
        });
        return found;
    }

    // 스토리/분위기 키워드에서 제목 재료 추출 (2단계 데이터 완전 반영)
    function extractTitleIngredients() {
        const d = state.promptData || {};
        const story = state.appliedStory || {};
        const moods = d.mood || [];
        const places = d.place || [];

        // 1. 스토리에서 직접 추출한 핵심 단어 (가장 중요)
        const storyWords = extractWordsFromStory(story.desc || '');
        const storyNameWords = extractWordsFromStory(story.name || '');
        const themeWords = extractWordsFromStory(story.theme || '');

        // 2. 스토리 키워드 (사용자가 선택한 주제의 키워드)
        const storyKeywords = story.keywords || [];

        // 3. 분위기에서 감정 추출
        const emotionMap = {
            '편안한': ['평온', '안식', '쉼'], '힐링': ['치유', '회복', '온기'],
            '포근한': ['따스함', '온기', '포근함'], '따뜻한': ['온기', '사랑', '따스함'],
            '감성적': ['감성', '서정', '마음'], '몽환적': ['꿈', '환상', '아련함'],
            '잔잔한': ['고요', '평화', '잔잔함'], '쓸쓸한': ['외로움', '쓸쓸함', '그리움'],
            '센치한': ['감상', '아련함', '추억'], '새벽감성': ['새벽', '고독', '성찰'],
            '그리운': ['그리움', '향수', '추억'], '설레는': ['설렘', '두근거림', '기대'],
            '사랑': ['사랑', '마음', '진심'], '이별': ['이별', '눈물', '그리움'],
            '기분좋은': ['행복', '기쁨', '미소'], '상쾌한': ['활력', '시작', '바람'],
            '신나는': ['에너지', '흥', '열정'], '흥겨운': ['축제', '리듬', '춤'],
            '파워풀한': ['열정', '도전', '의지'], '자신감': ['당당함', '자신감', '빛남'],
            '위로': ['위로', '공감', '따뜻함'], '비오는날': ['빗소리', '그리움', '감성'],
            '일몰': ['석양', '아름다움', '감동'], '집중': ['몰입', '집중', '흐름'],
            '공부할때': ['집중', '성장', '도전']
        };
        const moodEmotions = [];
        moods.forEach(m => {
            if (emotionMap[m]) moodEmotions.push(...emotionMap[m]);
            else moodEmotions.push(m);
        });

        // 감정 풀: 스토리 키워드 > 스토리 추출어 > 분위기 (우선순위)
        const emotions = [...storyKeywords, ...storyWords, ...storyNameWords, ...themeWords, ...moodEmotions];

        // 이미지 풀: 스토리에서 추출한 구체적 이미지 우선
        const storyImages = storyWords.filter(w =>
            ['교실','학교','카페','공원','바다','하늘','별','달','해','비','눈','꽃','나무','숲',
             '거리','골목','계단','지붕','창문','문','다리','강','호수','산','섬','항구',
             '버스','기차','비행기','자동차','자전거','우산','사진','일기','노래','기타','피아노',
             '라면','커피','맥주','초콜릿','반지','선물','LP','영화','앨범','풍선',
             '놀이공원','롤러코스터','모닥불','인스타','카톡','프로필',
             '흰머리','돋보기','된장찌개','소개팅'].includes(w)
        );
        const defaultImages = ['하늘', '바람', '별빛', '달빛', '노을', '꽃', '바다', '길', '창문', '편지', '사진'];
        const images = storyImages.length > 0 ? [...storyImages, ...defaultImages] : [...defaultImages];
        places.forEach(p => images.push(p));

        // 시간 풀
        const storyTimes = storyWords.filter(w =>
            ['봄','여름','가을','겨울','새벽','아침','저녁','밤','노을','석양','일출','황혼'].includes(w)
        );
        const defaultTimes = ['오늘', '그날', '어젯밤', '새벽', '봄날', '겨울밤', '가을', '여름날', '아침', '저녁', '밤', '내일'];
        const times = storyTimes.length > 0 ? [...storyTimes, ...defaultTimes] : defaultTimes;

        // 영어 버전 (스토리 키워드 기반 매핑)
        const korToEngEmotion = {
            '사랑': ['Love','사랑'], '마음': ['Heart','마음'], '눈물': ['Tears','눈물'], '꿈': ['Dreams','꿈'],
            '희망': ['Hope','희망'], '기억': ['Memory','기억'], '추억': ['Memories','추억'], '약속': ['Promise','약속'],
            '그리움': ['Longing','그리움'], '설렘': ['Butterflies','설렘'], '이별': ['Farewell','이별'],
            '만남': ['Encounter','만남'], '인연': ['Destiny','인연'], '운명': ['Fate','운명'],
            '기다림': ['Waiting','기다림'], '행복': ['Happiness','행복'], '감사': ['Gratitude','감사'],
            '위로': ['Comfort','위로'], '용기': ['Courage','용기'], '진심': ['Sincerity','진심'],
            '고백': ['Confession','고백'], '미소': ['Smile','미소'], '웃음': ['Laughter','웃음'],
            '두근': ['Heartbeat','두근거림'], '떨림': ['Trembling','떨림'], '감동': ['Touched','감동'],
            '공감': ['Empathy','공감'], '직감': ['Instinct','직감'], '케미': ['Chemistry','케미'],
            '소개팅': ['Blind Date','소개팅'], '첫사랑': ['First Love','첫사랑'],
            '프러포즈': ['Proposal','프러포즈'], '졸업': ['Graduation','졸업'],
            '수고': ['Well Done','수고'], '고생': ['Hard Work','고생'],
            '성장': ['Growing','성장'], '도전': ['Challenge','도전'], '열정': ['Passion','열정'],
            '평온': ['Serenity','평온'], '온기': ['Warmth','온기'], '치유': ['Healing','치유']
        };
        const korToEngImage = {
            '교실': ['Classroom','교실'], '카페': ['Café','카페'], '공원': ['Park','공원'],
            '바다': ['Ocean','바다'], '하늘': ['Sky','하늘'], '별': ['Stars','별'], '달': ['Moon','달'],
            '비': ['Rain','비'], '눈': ['Snow','눈'], '꽃': ['Flowers','꽃'], '길': ['Road','길'],
            '창문': ['Window','창문'], '편지': ['Letter','편지'], '사진': ['Photo','사진'],
            '우산': ['Umbrella','우산'], '반지': ['Ring','반지'], '노래': ['Song','노래'],
            '버스': ['Bus','버스'], '기차': ['Train','기차'], '커피': ['Coffee','커피'],
            '라면': ['Ramen','라면'], '거리': ['Street','거리'], '다리': ['Bridge','다리'],
            '강': ['River','강'], '호수': ['Lake','호수'], '숲': ['Forest','숲'],
            '인스타': ['Instagram','인스타'], '카톡': ['Message','카톡'],
            '풍선': ['Balloon','풍선'], '선물': ['Gift','선물'], '일기': ['Diary','일기']
        };
        const korToEngTime = {
            '봄': ['Spring','봄'], '여름': ['Summer','여름'], '가을': ['Autumn','가을'], '겨울': ['Winter','겨울'],
            '새벽': ['Dawn','새벽'], '아침': ['Morning','아침'], '저녁': ['Evening','저녁'], '밤': ['Night','밤'],
            '노을': ['Sunset','노을'], '석양': ['Sunset','석양'], '황혼': ['Twilight','황혼']
        };

        // 스토리에서 추출한 단어를 영어 쌍으로 변환
        const engEmotionPairs = [];
        const engImagePairs = [];
        const engTimePairs = [];

        emotions.forEach(e => { if (korToEngEmotion[e] && !engEmotionPairs.some(p => p[0] === korToEngEmotion[e][0])) engEmotionPairs.push(korToEngEmotion[e]); });
        images.forEach(img => { if (korToEngImage[img] && !engImagePairs.some(p => p[0] === korToEngImage[img][0])) engImagePairs.push(korToEngImage[img]); });
        times.forEach(t => { if (korToEngTime[t] && !engTimePairs.some(p => p[0] === korToEngTime[t][0])) engTimePairs.push(korToEngTime[t]); });

        // 기본값 보충
        if (engEmotionPairs.length < 3) {
            [['Love','사랑'],['Hope','희망'],['Heart','마음'],['Dreams','꿈'],['Light','빛']].forEach(p => {
                if (!engEmotionPairs.some(e => e[0] === p[0])) engEmotionPairs.push(p);
            });
        }
        if (engImagePairs.length < 3) {
            [['Stars','별'],['Rain','비'],['Ocean','바다'],['Wind','바람'],['Flowers','꽃']].forEach(p => {
                if (!engImagePairs.some(e => e[0] === p[0])) engImagePairs.push(p);
            });
        }
        if (engTimePairs.length < 3) {
            [['Tonight','오늘 밤'],['Dawn','새벽'],['Spring','봄'],['Midnight','자정'],['Sunset','석양']].forEach(p => {
                if (!engTimePairs.some(e => e[0] === p[0])) engTimePairs.push(p);
            });
        }

        return {
            emotions: [...new Set(emotions)],
            images: [...new Set(images)],
            times,
            engEmotionPairs,
            engImagePairs,
            engTimePairs,
            engEmotions: engEmotionPairs.map(p => p[0]),
            engImages: engImagePairs.map(p => p[0]),
            engTimes: engTimePairs.map(p => p[0]),
            storyDesc: story.desc || '',
            storyName: story.name || '',
            themeName: story.theme || ''
        };
    }

    // 영어-한국어 대응 패턴 쌍 (영어 패턴 → 자연스러운 한국어 번역 패턴)
    const ENG_KOR_PATTERN_PAIRS = [
        // emotion_image
        ['{emotion} in the {image}', '{image} 속의 {emotion}'],
        ['{image} of {emotion}', '{emotion}의 {image}'],
        ['{emotion} After {time}', '{time} 후의 {emotion}'],
        ['{time} {emotion}', '{time}의 {emotion}'],
        ['Where {emotion} Lives', '{emotion}이 사는 곳'],
        ['{image} and {emotion}', '{image}와 {emotion}'],
        ['{emotion} Like {image}', '{image} 같은 {emotion}'],
        ['Chasing {emotion}', '{emotion}을 쫓아서'],
        // question
        ['Do You {emotion}?', '너도 {emotion}을 느껴?'],
        ['What If {emotion}?', '{emotion}이라면 어떨까'],
        ['Can You {emotion}?', '{emotion}할 수 있을까'],
        ['Remember the {image}?', '{image} 기억나?'],
        ['Where Did {emotion} Go?', '{emotion}은 어디로 갔을까'],
        // paradox
        ['Beautiful {emotion}', '아름다운 {emotion}'],
        ['Silent {image}', '고요한 {image}'],
        ['Frozen {emotion}', '얼어붙은 {emotion}'],
        ['Burning {image}', '타오르는 {image}'],
        ['Sweet {emotion}', '달콤한 {emotion}'],
        ['Broken {image}', '부서진 {image}'],
        // sentence
        ['{emotion} Is All I Know', '{emotion}밖에 모르는 나'],
        ['The {image} We Shared', '우리가 함께한 {image}'],
        ['{emotion} Runs Deep', '깊어지는 {emotion}'],
        ['Lost in {emotion}', '{emotion}에 빠져서'],
        ['{image} on My Mind', '자꾸 떠오르는 {image}'],
        ['One More {emotion}', '한 번 더 {emotion}'],
        ['Through the {image}', '{image}를 지나며'],
        ['When {emotion} Fades', '{emotion}이 사라질 때'],
        ['Hold On to {emotion}', '{emotion}을 놓지 마'],
        ['{emotion} Never Lies', '{emotion}은 거짓말 안 해'],
        ['Dancing with {emotion}', '{emotion}과 춤을'],
        ['The Last {image}', '마지막 {image}'],
        ['{time} of {emotion}', '{emotion}의 {time}'],
        ['Falling Into {image}', '{image} 속으로'],
        ['{emotion} Is Enough', '{emotion}이면 충분해']
    ];

    // 스토리 기반 제목 동적 생성
    function generateStoryBasedTitle(lang, ingredients) {
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const pickPair = (pairs) => pairs[Math.floor(Math.random() * pairs.length)];

        if (lang === 'korean' || lang === 'mixed') {
            const patterns = BILLBOARD_TITLE_PATTERNS.korean;
            const allPatterns = [...patterns.emotion_image, ...patterns.question, ...patterns.paradox, ...patterns.sentence, ...patterns.sentence];
            const pattern = pick(allPatterns);
            return pattern
                .replace('{emotion}', pick(ingredients.emotions.length > 0 ? ingredients.emotions : ['마음']))
                .replace('{image}', pick(ingredients.images))
                .replace('{time}', pick(ingredients.times))
                .replace('{place}', pick(ingredients.images));
        } else {
            // 영어: 영어 + (자연스러운 한국어 번역) 형식으로 생성
            const pair = pick(ENG_KOR_PATTERN_PAIRS);
            const engPattern = pair[0];
            const korPattern = pair[1];

            const emotionPair = pickPair(ingredients.engEmotionPairs);
            const imagePair = pickPair(ingredients.engImagePairs);
            const timePair = pickPair(ingredients.engTimePairs);

            const engTitle = engPattern
                .replace('{emotion}', emotionPair[0])
                .replace('{image}', imagePair[0])
                .replace('{time}', timePair[0])
                .replace('{place}', imagePair[0]);

            const korTitle = korPattern
                .replace('{emotion}', emotionPair[1])
                .replace('{image}', imagePair[1])
                .replace('{time}', timePair[1])
                .replace('{place}', imagePair[1]);

            return `${engTitle} (${korTitle})`;
        }
    }

    function generateTitles(count) {
        const lang = getSelectedLanguage();
        const gen = state.generations && state.generations.length > 0 ? state.generations[0] : '';
        const ingredients = extractTitleIngredients();
        const hasStory = ingredients.storyDesc.length > 0 || ingredients.emotions.length > 0;

        // 세대별 제목 풀 구성 — 설정 언어에 맞는 제목만 사용
        let pool = [];

        if (gen && GEN_TITLE_STYLE[gen]) {
            const genStyle = GEN_TITLE_STYLE[gen];
            if (lang === 'korean') {
                pool = [...(genStyle.korean || [])];
            } else if (lang === 'english') {
                pool = [...(genStyle.english || [])];
            } else if (lang === 'mixed') {
                pool = [...(genStyle.korean || []), ...(genStyle.english || [])];
            } else {
                pool = [...(TITLE_DB[lang] || [])];
            }
        }

        // 풀이 부족하면 해당 언어 기본 DB로만 보충
        if (pool.length < count * 2) {
            const baseTitles = TITLE_DB[lang] || [];
            pool = [...pool, ...baseTitles.filter(t => !pool.includes(t))];
        }

        // 그래도 부족하면 세대별 한국어 제목을 해당 언어로 변환해서 추가
        if (pool.length < count && gen && GEN_TITLE_STYLE[gen] && lang !== 'korean' && lang !== 'english' && lang !== 'mixed') {
            const korTitles = GEN_TITLE_STYLE[gen].korean || [];
            korTitles.forEach(kt => {
                const translated = translateTitleToLanguage(kt, lang);
                if (translated !== kt && !pool.includes(translated)) {
                    pool.push(translated);
                }
            });
        }

        // 이전에 생성된 제목 + 현재 고정된 제목 제외
        const excluded = new Set([...lockedTitles, ...previouslyGeneratedTitles]);
        const available = pool.filter(t => !excluded.has(t));

        const result = [...lockedTitles];
        const needed = count - lockedTitles.length;
        const used = new Set(lockedTitles);

        // 스토리가 있으면: 절반은 스토리 기반 동적 생성, 절반은 풀에서 선택
        const storyTitleCount = hasStory ? Math.ceil(needed * 0.6) : 0;
        const poolTitleCount = needed - storyTitleCount;

        // 1. 스토리 기반 동적 생성 (매번 새로운 조합 → 중복 거의 없음)
        for (let i = 0; i < storyTitleCount; i++) {
            let title = '';
            let tries = 0;
            do {
                title = generateStoryBasedTitle(lang, ingredients);
                tries++;
            } while ((used.has(title) || previouslyGeneratedTitles.has(title) || isTitleTooSimilar(title)) && tries < 50);
            if (!used.has(title)) {
                result.push(title);
                used.add(title);
                previouslyGeneratedTitles.add(title);
            }
        }

        // 2. 풀에서 선택 (이전에 안 쓴 것만)
        for (let i = 0; i < poolTitleCount && available.length > 0; i++) {
            let idx = Math.floor(Math.random() * available.length);
            let tries = 0;
            while ((used.has(available[idx]) || previouslyGeneratedTitles.has(available[idx]) || isTitleTooSimilar(available[idx])) && tries < 100) {
                idx = Math.floor(Math.random() * available.length);
                tries++;
            }
            if (!used.has(available[idx])) {
                result.push(available[idx]);
                used.add(available[idx]);
                previouslyGeneratedTitles.add(available[idx]);
            }
        }

        // 부족하면 스토리 기반으로 추가 생성 (풀이 소진된 경우)
        while (result.length < count) {
            let title = generateStoryBasedTitle(lang, ingredients);
            let tries = 0;
            while (used.has(title) && tries < 100) {
                title = generateStoryBasedTitle(lang, ingredients);
                tries++;
            }
            if (!used.has(title)) {
                result.push(title);
                used.add(title);
                previouslyGeneratedTitles.add(title);
            } else {
                break; // 무한루프 방지
            }
        }

        return result;
    }

    // 영어 제목 → 한국어 번역
    const TITLE_KOR_MAP = {
        // 영어
        'Midnight': '한밤', 'Starlight': '별빛', 'Daybreak': '새벽녘', 'Moonrise': '달이 뜰 때',
        'Twilight': '황혼', 'Heartbeat': '심장 박동', 'Tears': '눈물', 'Breathe': '숨쉬다',
        'Dream': '꿈', 'Hope': '희망', 'Fading': '사라지는', 'Beautiful Pain': '아름다운 고통',
        'Sweet Goodbye': '달콤한 이별', 'Loud Silence': '시끄러운 침묵', 'Cold Fire': '차가운 불꽃',
        'Rainy Window': '비 오는 창가', 'Neon Lights': '네온 불빛', 'Empty Chair': '빈 의자',
        'Paper Plane': '종이 비행기', 'Last Train': '마지막 기차', 'What If?': '만약에?',
        'Remember?': '기억나?', 'Still Here': '아직 여기에', 'Golden Hour': '황금빛 시간',
        'Ocean Eyes': '바다 같은 눈', 'Sleepless': '잠 못 드는 밤', 'Runaway': '도망자',
        'Better Days': '더 나은 날들', 'Let Go': '놓아주다', 'Rewind': '되감기', 'Stay': '머물러줘',
        'Closer': '더 가까이', 'Unspoken': '말하지 못한', 'Afterglow': '잔광', 'Echoes': '메아리',
        'Midnight Rain': '한밤의 비', 'Burning Low': '타오르는 잔불', 'Quiet Storm': '조용한 폭풍',
        'Fading Light': '사라지는 빛', 'Silent Waves': '고요한 파도', 'Crystal Tears': '수정 같은 눈물',
        'Broken Crown': '부서진 왕관', 'Velvet Sky': '벨벳 하늘', 'Restless Heart': '쉬지 못하는 마음',
        'Shadow Dance': '그림자 춤', 'Winter Sun': '겨울 태양', 'Neon Dreams': '네온 꿈',
        'Glass Heart': '유리 심장', 'Silver Lining': '희망의 빛줄기', 'Frozen Time': '얼어붙은 시간',
        'Bitter Sweet': '달콤 쓴', 'Distant Shore': '먼 해안', 'Falling Stars': '떨어지는 별',
        'Empty Roads': '텅 빈 길', 'Lost Signal': '끊긴 신호', 'Crimson Tide': '진홍빛 물결',
        'Paper Moon': '종이 달', 'Wasted Youth': '낭비된 청춘', 'Blind Faith': '맹목적 믿음',
        'Chasing Dawn': '새벽을 쫓아', 'Endless Blue': '끝없는 푸름', 'Ghost Town': '유령 도시',
        'Iron Rose': '강철 장미',
        // 일본어 (2~3단어)
        '\u5915\u7126\u308C\u306E\u9053': '석양의 길', '\u82B1\u706B\u306E\u591C': '불꽃놀이의 밤', '\u604B\u306E\u6B4C': '사랑의 노래',
        '\u661F\u7A7A\u306E\u4E0B': '별하늘 아래', '\u96E8\u97F3\u306E\u8A18\u61B6': '빗소리의 기억', '\u6D99\u306E\u96E8': '눈물의 비',
        '\u6708\u660E\u304B\u308A\u306E\u7A93': '달빛의 창', '\u3055\u3088\u306A\u3089\u306E\u5F8C': '이별 후에',
        '\u541B\u3078\u306E\u624B\u7D19': '너에게 보내는 편지', '\u5922\u306E\u4E2D\u3067': '꿈속에서',
        '\u6625\u98A8\u306E\u5F8C': '봄바람이 지나고', '\u79CB\u685C\u306E\u8272': '가을벚꽃의 빛깔',
        '\u5FC3\u97F3\u306E\u30EA\u30BA\u30E0': '심장의 리듬', '\u5149\u306E\u5411\u3053\u3046': '빛을 향해',
        '\u6C38\u9060\u306E\u7D04\u675F': '영원한 약속', '\u60F3\u3044\u51FA\u306E\u7BB1': '추억의 상자',
        '\u58CA\u308C\u305F\u7FFC': '부서진 날개', '\u9752\u3044\u9CE5\u306E\u6B4C': '파랑새의 노래',
        '\u5922\u899A\u3081\u306E\u671D': '꿈에서 깬 아침', '\u6700\u5F8C\u306E\u30C0\u30F3\u30B9': '마지막 춤',
        // 스페인어
        'Coraz\u00F3n': '심장', 'Bailando': '춤추며', 'Fuego': '불꽃', 'Lluvia': '비',
        'Sue\u00F1os': '꿈들', 'Amor Eterno': '영원한 사랑', 'Noche': '밤', 'Cielo': '하늘',
        'Libre': '자유로운', 'Esperanza': '희망', 'Destino': '운명', 'Mariposa': '나비',
        'Sol y Luna': '태양과 달', 'Alma': '영혼', 'Silencio': '침묵', 'Camino': '길',
        'Estrella': '별', 'Pasi\u00F3n': '열정', 'Recuerdos': '추억', 'Viento': '바람',
        // 중국어
        '\u6708\u5149': '달빛', '\u661F\u8FB0': '별', '\u68A6\u5883': '꿈나라', '\u5F69\u8679': '무지개',
        '\u65F6\u5149': '시간', '\u5FC3\u8DDF': '마음을 따라', '\u6D77\u6D6A': '파도', '\u6625\u98CE': '봄바람',
        '\u6D41\u661F': '유성', '\u5929\u7A7A': '하늘',
        // 10대 영어
        'Crush': '두근두근', 'Feels': '느낌', 'Obsessed': '빠져듦', 'No Cap': '진심', 'Vibe Check': '바이브 체크',
        'Main Character': '주인공', 'Glow Up': '변신', 'Slay': '완벽해', 'Lowkey': '은근히',
        'Highkey': '완전히', 'For Real': '진짜로', 'No Filter': '필터 없이', 'On Repeat': '무한반복',
        'My Type': '내 취향', 'Catch Me': '잡아봐', 'So Into You': '너에게 빠져', 'Can\'t Stop': '멈출 수 없어',
        'Bad Idea': '나쁜 생각', 'Sweet Chaos': '달콤한 혼돈', 'Plot Twist': '반전',
        // 2030 영어
        'Burnout': '번아웃', 'Adulting': '어른 되기', 'Self Love': '자존감', 'Let It Be': '그냥 둬',
        'On My Own': '혼자서', 'Growing Pains': '성장통', 'Real Talk': '솔직한 말', 'Enough': '충분해',
        'Breathe': '숨쉬다', 'My Pace': '내 속도', 'Late Night': '늦은 밤', 'Quarter Life': '인생 4분의 1',
        'Worth It': '가치 있어', 'Take Your Time': '천천히 해', 'Figure It Out': '알아낼게',
        'Glass Half Full': '반만 찬 잔', 'Raw Deal': '현실', 'Slow Down': '천천히', 'Room to Grow': '성장할 공간', 'Honest': '솔직하게',
        // 5060 영어
        'Worth Every Mile': '모든 길이 가치 있어', 'Standing Strong': '굳건히', 'Golden Years': '황금 시절',
        'Through It All': '모든 것을 겪으며', 'Still Standing': '아직 서 있어', 'Grateful Heart': '감사하는 마음',
        'Time Well Spent': '잘 보낸 시간', 'Built to Last': '영원하도록', 'Rise Again': '다시 일어나',
        'Legacy': '유산', 'Steady Ground': '단단한 땅', 'Unshaken': '흔들리지 않는', 'Proud Heart': '자랑스러운 마음',
        'Long Road Home': '집으로 가는 긴 길', 'Second Wind': '다시 힘을 내어', 'Timeless Bond': '변함없는 유대',
        'Seasons Change': '계절은 변해도', 'Iron Will': '철의 의지', 'Heart of Gold': '황금 같은 마음', 'Homebound': '귀향',
        // 시니어 영어
        'Thank You': '감사합니다', 'Blessed Life': '축복받은 삶', 'Forever Young': '영원히 젊게',
        'Gentle Days': '부드러운 나날', 'Family Song': '가족의 노래', 'Golden Sunset': '황금빛 석양',
        'With Gratitude': '감사를 담아', 'Peaceful Heart': '평화로운 마음', 'Together Always': '항상 함께',
        'Beautiful Life': '아름다운 인생', 'Warm Embrace': '따뜻한 포옹', 'Heart Full': '가득 찬 마음',
        'Grace Notes': '은혜의 음표', 'Simple Joy': '소박한 기쁨', 'Love Remains': '사랑은 남아',
        'Cherished Days': '소중한 날들', 'Held Close': '꼭 안아', 'Soft Morning': '부드러운 아침',
        'Ever Grateful': '항상 감사해', 'Home Sweet Home': '사랑하는 우리 집',
        // 프랑스어
        'Clair de Lune': '달빛', 'Mon Amour': '내 사랑', 'Chanson': '노래', 'R\u00EAve': '꿈',
        '\u00C9toile': '별', 'Soleil': '태양', 'Libert\u00E9': '자유', 'Voyage': '여행',
        'Coeur': '마음', 'Pluie': '비', 'Nuit Blanche': '하얀 밤', 'Belle': '아름다운',
        'Espoir': '희망', '\u00C2me': '영혼', 'Douceur': '부드러움', 'Papillon': '나비',
        'Brume': '안개', 'Aurore': '새벽빛', 'Destin': '운명', 'Harmonie': '조화',
        // 스페인어
        'Coraz\u00F3n': '심장', 'Bailando': '춤추며', 'Fuego': '불꽃', 'Lluvia': '비',
        'Sue\u00F1os': '꿈들', 'Amor Eterno': '영원한 사랑', 'Noche': '밤', 'Cielo': '하늘',
        'Libre': '자유로운', 'Esperanza': '희망', 'Destino': '운명', 'Mariposa': '나비',
        'Sol y Luna': '태양과 달', 'Alma': '영혼', 'Silencio': '침묵', 'Camino': '길',
        'Estrella': '별', 'Pasi\u00F3n': '열정', 'Recuerdos': '추억', 'Viento': '바람',
        // 포르투갈어
        'Saudade': '그리움', 'Cora\u00E7\u00E3o': '심장', 'Sol Nascente': '떠오르는 태양',
        'Mar Azul': '푸른 바다', 'Lua Cheia': '보름달', 'Liberdade': '자유',
        'Sonho': '꿈', 'Tempestade': '폭풍', 'Vida': '인생', 'Aurora': '새벽빛',
        'Esperan\u00E7a': '희망', 'Luz': '빛', 'Chuva': '비', 'Caminho': '길',
        // 독일어
        'Mondlicht': '달빛', 'Sternschnuppe': '별똥별', 'Heimat': '고향', 'Sehnsucht': '그리움',
        'Freiheit': '자유', 'Traumland': '꿈나라', 'Nachtlied': '밤의 노래', 'Stille': '고요',
        'Morgenrot': '아침노을', 'Seele': '영혼', 'Fernweh': '먼 곳의 그리움', 'Zeitlos': '영원한',
        'Herzschlag': '심장박동', 'Grenzenlos': '끝없는', 'Lichtblick': '희망의 빛',
        'Sonnenwende': '하지', 'Sternenstaub': '별먼지', 'Weltschmerz': '세상의 아픔',
        'Geborgenheit': '따뜻한 안식', 'Wanderlust': '방랑벽',
        // 힌디어
        '\u091A\u093E\u0902\u0926\u0928\u0940': '달빛', '\u0938\u092A\u0928\u093E': '꿈',
        '\u092A\u094D\u0930\u0947\u092E': '사랑', '\u0926\u093F\u0932': '마음', '\u0930\u093E\u0924': '밤',
        '\u0938\u0942\u0930\u091C': '태양', '\u092E\u0941\u0938\u094D\u0915\u093E\u0928': '미소',
        '\u0906\u0936\u093E': '희망', '\u091C\u093F\u0902\u0926\u0917\u0940': '인생',
        '\u0916\u0941\u0936\u0940': '행복', '\u0906\u0938\u092E\u093E\u0928': '하늘',
        '\u0924\u093E\u0930\u0947': '별들', '\u092C\u093E\u0930\u093F\u0936': '비',
        '\u0927\u0941\u0928': '안개', '\u092A\u0930\u093F\u0928\u094D\u0926\u093E': '동화',
        '\u0938\u092B\u0930': '여행', '\u0926\u0930\u094D\u092A\u0923': '거울',
        '\u0909\u092E\u094D\u092E\u0940\u0926': '희망', '\u091C\u0928\u094D\u0928\u0924': '천국',
        '\u0930\u094B\u0936\u0928\u0940': '빛',
        // 아랍어
        '\u0642\u0645\u0631': '달', '\u0646\u062C\u0645\u0629': '별', '\u062D\u0644\u0645': '꿈',
        '\u062D\u0628': '사랑', '\u0644\u064A\u0644': '밤', '\u0634\u0645\u0633': '태양',
        '\u0623\u0645\u0644': '희망', '\u0631\u0648\u062D': '영혼', '\u0633\u0644\u0627\u0645': '평화',
        '\u062D\u0631\u064A\u0629': '자유', '\u0633\u0645\u0627\u0621': '하늘', '\u0628\u062D\u0631': '바다',
        '\u0632\u0647\u0631\u0629': '꽃', '\u0645\u0637\u0631': '비', '\u0631\u064A\u062D': '바람',
        '\u0641\u062C\u0631': '새벽', '\u063A\u0631\u0648\u0628': '석양', '\u0642\u0644\u0628': '마음',
        '\u0637\u0631\u064A\u0642': '길', '\u0646\u0648\u0631': '빛'
    };

    // TITLE_KOR_MAP에 없는 외국어 제목도 단어별로 번역 시도
    function findKorTranslation(title) {
        // 1. 전체 매칭
        if (TITLE_KOR_MAP[title]) return TITLE_KOR_MAP[title];
        // 2. 단어별 매칭 (영어/라틴 제목)
        const words = title.trim().split(/\s+/);
        if (words.length >= 1) {
            const korWords = words.map(w => {
                if (TITLE_KOR_MAP[w]) return TITLE_KOR_MAP[w];
                // 대소문자 무시
                const found = Object.entries(TITLE_KOR_MAP).find(([k]) => k.toLowerCase() === w.toLowerCase());
                if (found) return found[1];
                // KOR_BASE 역방향 (영어→한국어)
                const baseFound = Object.entries(KOR_BASE).find(([, eng]) => eng.toLowerCase() === w.toLowerCase());
                if (baseFound) return baseFound[0];
                return null;
            });
            if (korWords.some(w => w !== null)) {
                return korWords.map((w, i) => w || words[i]).join(' ');
            }
        }
        return null;
    }

    // 모든 제목을 [설정 언어] (한국어 번역) 형식으로 통일
    function getTitleWithTranslation(title) {
        // 이미 (번역) 형식이면 그대로
        if (title.includes('(') && title.includes(')')) return title;

        const hasKorean = /[\uAC00-\uD7A3]/.test(title);

        // 한국어 제목이면 그대로
        if (hasKorean) return title;

        // 외국어 제목 → 한국어 번역 추가
        const kor = findKorTranslation(title);
        if (kor) return `${title} (${kor})`;

        return title;
    }

    let editingTitleIdx = -1; // 현재 편집 중인 제목 인덱스 (-1 = 편집 안 함)

    function renderTitles() {
        const container = document.getElementById('titlesList');
        container.innerHTML = state.titles.map((t, i) => {
            const isLocked = lockedTitles.includes(t);
            const displayTitle = getTitleWithTranslation(t);
            const isEditing = editingTitleIdx === i;

            if (isEditing) {
                // 편집 모드
                return `<div class="title-item title-editing" data-idx="${i}">
                    <div class="title-rank">${i+1}</div>
                    <div class="title-edit-area">
                        <input type="text" class="title-edit-input" id="titleEditInput_${i}" value="${t}" maxlength="50">
                        <div class="title-edit-btns">
                            <button class="btn-edit-apply title-edit-apply" data-idx="${i}">\u2713 \uC801\uC6A9\uD558\uAE30</button>
                            <button class="btn-edit-toggle title-edit-cancel" data-idx="${i}">\u2717 \uCDE8\uC18C</button>
                        </div>
                    </div>
                </div>`;
            }

            // 일반 모드
            return `<div class="title-item ${isLocked ? 'selected' : ''}" data-idx="${i}" data-title="${t}">
                <div class="title-rank">${isLocked ? '\uD83D\uDD12' : (i+1)}</div>
                <div class="title-text">${displayTitle}</div>
                <div class="title-item-actions">
                    <button class="title-edit-btn" data-idx="${i}" title="\uC218\uC815">\u270E</button>
                    <span class="title-lock-hint">${isLocked ? '\uACE0\uC815\uB428' : '\uD074\uB9AD\uD558\uBA74 \uACE0\uC815'}</span>
                </div>
            </div>`;
        }).join('');

        // 편집 버튼 이벤트
        container.querySelectorAll('.title-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                editingTitleIdx = parseInt(btn.dataset.idx);
                renderTitles();
                const input = document.getElementById(`titleEditInput_${editingTitleIdx}`);
                if (input) { input.focus(); input.select(); }
            });
        });

        // 적용하기 버튼 이벤트
        container.querySelectorAll('.title-edit-apply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                const input = document.getElementById(`titleEditInput_${idx}`);
                if (input && input.value.trim()) {
                    const oldTitle = state.titles[idx];
                    const newTitle = input.value.trim();
                    state.titles[idx] = newTitle;
                    // 고정 목록도 업데이트
                    const lockIdx = lockedTitles.indexOf(oldTitle);
                    if (lockIdx !== -1) lockedTitles[lockIdx] = newTitle;
                }
                editingTitleIdx = -1;
                renderTitles();
            });
        });

        // 취소 버튼 이벤트
        container.querySelectorAll('.title-edit-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                editingTitleIdx = -1;
                renderTitles();
            });
        });

        // Enter로 적용, Escape로 취소
        container.querySelectorAll('.title-edit-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const idx = parseInt(input.id.split('_')[1]);
                    const applyBtn = container.querySelector(`.title-edit-apply[data-idx="${idx}"]`);
                    if (applyBtn) applyBtn.click();
                } else if (e.key === 'Escape') {
                    editingTitleIdx = -1;
                    renderTitles();
                }
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });

        // 제목 아이템 클릭 = 고정/해제 (편집 모드가 아닐 때만)
        container.querySelectorAll('.title-item:not(.title-editing)').forEach(item => {
            item.addEventListener('click', () => {
                const title = item.dataset.title;
                if (!title) return;
                if (lockedTitles.includes(title)) {
                    lockedTitles = lockedTitles.filter(t => t !== title);
                } else {
                    lockedTitles.push(title);
                }
                renderTitles();
            });
        });

        document.getElementById('titlesResult').style.display = 'block';
        checkDuplicateTitles();
    }

    function checkDuplicateTitles() {
        const lib = JSON.parse(localStorage.getItem('suno-master-library') || '[]');
        const existing = lib.map(i => (i.title || '').toLowerCase()).filter(Boolean);
        const dups = state.titles.filter(t => existing.includes(t.toLowerCase()));
        const el = document.getElementById('duplicateCheck');
        if (dups.length > 0) {
            el.className = 'duplicate-check dup-warn';
            el.textContent = `⚠️ 중복 발견: ${dups.join(', ')}`;
        } else {
            el.className = 'duplicate-check dup-pass';
            el.textContent = '✅ 중복 없음 - 모든 제목이 고유합니다.';
        }
    }

    // === STEP 4: 송폼 + 가사 (전면 수정) ===
    let currentFormat = 'section'; // 'section' or 'meta'

    // 프리셋 버튼
    document.querySelectorAll('.sf-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sf-preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const preset = btn.dataset.preset;
            state.songform = [...(GENRE_SONGFORM[preset] || GENRE_SONGFORM.default)];
            renderSongformEditor();
        });
    });

    // 섹션 추가 버튼
    document.querySelectorAll('.sf-add-btn').forEach(btn => {
        btn.addEventListener('click', () => { state.songform.push(btn.dataset.value); renderSongformEditor(); });
    });

    // 송폼 에디터 렌더링 (위/아래/삭제 버튼 포함)
    function renderSongformEditor() {
        const editor = document.getElementById('songformEditor');
        if (state.songform.length === 0) {
            editor.innerHTML = '<span class="sf-empty">\uC1A1\uD3FC \uAD6C\uC870\uB97C \uC120\uD0DD\uD558\uC138\uC694</span>';
            return;
        }
        const counters = {};
        editor.innerHTML = state.songform.map((s, i) => {
            counters[s] = (counters[s] || 0) + 1;
            const num = counters[s];
            const label = num > 1 ? `${s} ${num}` : s;
            return `<span class="sf-item">` +
                (i > 0 ? `<button class="sf-item-btn" data-action="up" data-idx="${i}">\u25C0</button>` : '') +
                `<span class="sf-item-name">${label}</span>` +
                (i < state.songform.length - 1 ? `<button class="sf-item-btn" data-action="down" data-idx="${i}">\u25B6</button>` : '') +
                `<button class="sf-item-btn" data-action="del" data-idx="${i}">\u00D7</button></span>` +
                (i < state.songform.length - 1 ? '<span class="sf-arrow">\u2192</span>' : '');
        }).join('');

        editor.querySelectorAll('.sf-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                const action = btn.dataset.action;
                if (action === 'del') { state.songform.splice(idx, 1); }
                else if (action === 'up' && idx > 0) { [state.songform[idx], state.songform[idx-1]] = [state.songform[idx-1], state.songform[idx]]; }
                else if (action === 'down' && idx < state.songform.length - 1) { [state.songform[idx], state.songform[idx+1]] = [state.songform[idx+1], state.songform[idx]]; }
                renderSongformEditor();
            });
        });
    }

    function autoRecommendSongform() {
        if (state.songform.length > 0) return;
        const genres = (state.promptData && state.promptData.genres) || [];
        const g = (genres[0] || '').toLowerCase();
        let preset = 'default';
        if (g.includes('ballad')) preset = 'ballad';
        else if (g.includes('k-pop') || g.includes('kpop')) preset = 'kpop';
        else if (g.includes('hip') || g.includes('rap')) preset = 'hiphop';
        else if (g.includes('edm') || g.includes('house') || g.includes('trance')) preset = 'edm';
        else preset = 'pop';
        state.songform = [...(GENRE_SONGFORM[preset] || GENRE_SONGFORM.default)];

        // 프리셋 버튼 활성화
        document.querySelectorAll('.sf-preset-btn').forEach(b => b.classList.remove('active'));
        const presetBtn = document.querySelector(`.sf-preset-btn[data-preset="${preset}"]`);
        if (presetBtn) presetBtn.classList.add('active');

        renderSongformEditor();
    }

    // 세대별 가사 스타일 버튼 (복수 선택, 기본값 = 타겟층)
    lyricsGenBtns.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    function autoSelectLyricsGen() {
        const gens = state.generations || [];
        lyricsGenBtns.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        gens.forEach(g => {
            const btn = lyricsGenBtns.querySelector(`[data-value="${g}"]`);
            if (btn) btn.classList.add('active');
        });
    }

    // 가사 형식 탭 전환 (생성된 가사를 변환)
    let sectionLyricsCache = ''; // 섹션 태그 버전 캐시
    let metaLyricsCache = '';    // 메타태그 버전 캐시

    document.getElementById('tabFormatSection').addEventListener('click', () => {
        currentFormat = 'section';
        document.querySelectorAll('.lyrics-format-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tabFormatSection').classList.add('active');
        document.getElementById('lyricsFormatDesc').textContent = '\uC139\uC158 \uD0DC\uADF8([Verse], [Chorus] \uB4F1)\uB9CC \uD3EC\uD568\uB41C \uAE54\uB054\uD55C \uAC00\uC0AC\uC785\uB2C8\uB2E4.';
        if (Object.keys(titleLyricsMap).length > 0) showTitleLyrics(currentTitleIdx);
        updateLyricsInfo();
    });
    document.getElementById('tabFormatMeta').addEventListener('click', () => {
        currentFormat = 'meta';
        document.querySelectorAll('.lyrics-format-tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tabFormatMeta').classList.add('active');
        document.getElementById('lyricsFormatDesc').textContent = 'Suno AI Lyrics Field\uC5D0 \uBC14\uB85C \uC0AC\uC6A9. \uBA54\uD0C0\uD0DC\uADF8 \uD3EC\uD568 (5,000\uC790 \uC774\uD558)';
        if (Object.keys(titleLyricsMap).length > 0) showTitleLyrics(currentTitleIdx);
        updateLyricsInfo();
    });

    // 제목별 가사 캐시
    let titleLyricsMap = {}; // { title: { section: '...', meta: '...' } }
    let currentTitleIdx = 0;

    // 가사 자동 생성 버튼 - 모든 제목에 대해 가사 생성
    document.getElementById('btnGenerateLyrics').addEventListener('click', () => {
        const titles = state.confirmedTitles.length > 0 ? state.confirmedTitles : state.titles;
        if (titles.length === 0) { alert('\uC81C\uBAA9\uC744 \uBA3C\uC800 \uC0DD\uC131\uD558\uACE0 \uD655\uC815\uD574\uC8FC\uC138\uC694.'); return; }

        titleLyricsMap = {};
        sectionLyricsCache = '';
        metaLyricsCache = '';

        // 각 제목별 가사 생성
        titles.forEach((t, i) => {
            state.selectedTitle = t;
            currentFormat = 'section';
            const sectionVer = generateLyricsText();
            currentFormat = 'meta';
            const metaVer = generateLyricsText();
            titleLyricsMap[i] = { title: t, section: sectionVer, meta: metaVer };
        });

        // 현재 형식 복원
        currentFormat = document.querySelector('.lyrics-format-tab.active').dataset.format || 'section';

        // 탭 생성
        const tabContainer = document.getElementById('titleLyricsTabs');
        tabContainer.innerHTML = titles.map((t, i) =>
            `<button class="title-lyrics-tab ${i === 0 ? 'active' : ''}" data-idx="${i}">${i + 1}. ${t}</button>`
        ).join('');
        tabContainer.style.display = 'flex';

        tabContainer.querySelectorAll('.title-lyrics-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabContainer.querySelectorAll('.title-lyrics-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentTitleIdx = parseInt(tab.dataset.idx);
                showTitleLyrics(currentTitleIdx);
            });
        });

        // 첫 번째 제목 가사 표시
        currentTitleIdx = 0;
        showTitleLyrics(0);
        document.getElementById('lyricsSingleEditor').style.display = 'block';
        state.selectedTitle = titles[0];
    });

    function showTitleLyrics(idx) {
        const data = titleLyricsMap[idx];
        if (!data) return;
        const fmt = document.querySelector('.lyrics-format-tab.active').dataset.format || 'section';
        document.getElementById('lyricsMainTextarea').value = fmt === 'meta' ? data.meta : data.section;
        updateLyricsInfo();
    }

    // 가사 복사
    document.getElementById('btnCopyLyrics').addEventListener('click', () => {
        const text = document.getElementById('lyricsMainTextarea').value;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('btnCopyLyrics');
            btn.textContent = '\u2713 \uBCF5\uC0AC\uB428!'; btn.classList.add('copied');
            setTimeout(() => { btn.textContent = '\uD83D\uDCCB \uAC00\uC0AC \uBCF5\uC0AC'; btn.classList.remove('copied'); }, 2000);
        });
    });

    // 가사 다시 생성
    document.getElementById('btnRegenerateLyrics').addEventListener('click', () => {
        sectionLyricsCache = '';
        metaLyricsCache = '';
        const lyrics = generateLyricsText();
        document.getElementById('lyricsMainTextarea').value = lyrics;
        if (currentFormat === 'section') sectionLyricsCache = lyrics;
        else metaLyricsCache = lyrics;
        updateLyricsInfo();
    });

    // 가사용 제목: 괄호 안 번역 제거 (예: "Hope After Dawn (새벽 후의 희망)" → "Hope After Dawn")
    function cleanTitleForLyrics(t) {
        return t.replace(/\s*\(.*?\)\s*$/, '').trim();
    }

    function generateLyricsText() {
        const titles = state.titles || [];
        const rawTitle = state.selectedTitle || titles[0] || 'Untitled';
        const title = cleanTitleForLyrics(rawTitle);
        const gens = Array.from(lyricsGenBtns.querySelectorAll('.toggle-btn.active')).map(b => b.dataset.value);
        const gen = GEN_GUIDE[gens[0]] || GEN_GUIDE['young-adults'];
        const d = state.promptData || {};
        const moods = (d.mood || []).join(', ');
        const isMeta = currentFormat === 'meta';
        const lang = getSelectedLanguage();

        // === 레퍼런스가 적용되어 있으면 레퍼런스 구조를 그대로 복제 ===
        const refText = state.reference || '';
        if (refText.trim().length > 0) {
            return generateFromReferenceComplete(refText, title, gen, lang, isMeta);
        }

        // === 레퍼런스 없으면 songform 기반 생성 ===
        let lyrics = '';
        const counters = {};

        state.songform.forEach(section => {
            counters[section] = (counters[section] || 0) + 1;
            const num = counters[section];
            const label = num > 1 ? `${section} ${num}` : section;
            const isNoLyrics = NO_LYRICS_SECTIONS.includes(section);

            lyrics += `[${label}]\n`;

            // v5 메타태그 = 스타일 프롬프트 기반
            if (isMeta) {
                const metaTags = buildMetaTagsForSection(section, num);
                if (metaTags) lyrics += metaTags + '\n';
            }

            if (isNoLyrics) {
                lyrics += '(instrumental)\n';
            } else {
                // 세대/분위기 기반 가사 자동 생성 (나중에 GPT API)
                lyrics += generateSectionLyrics(section, num, title, gen, moods);
            }
            lyrics += '\n';
        });

        return lyrics.trim();
    }

    // === 통합 메타태그 빌더 (songform 기반 + 레퍼런스 기반 공용) ===
    // 스타일 프롬프트에서 mood/에너지/악기/보컬 추출 → 섹션별 로컬 메타태그 반환
    function buildMetaTagsForSection(sectionRaw, num) {
        const applied = state.appliedPrompt || {};
        const promptMoods = applied.moodSentence || ['Reflective'];
        const pm = promptMoods[0] || 'Reflective';
        const pm2 = promptMoods[1] || pm; // 두 번째 무드 (변화용)

        // 분위기별 에너지 레벨 결정
        const calmMoods = ['Calm', 'Serene', 'Peaceful', 'Warm', 'Cozy', 'Comfortable', 'Healing', 'Soothing', 'Dreamy', 'Ethereal'];
        const isCalm = calmMoods.some(m => promptMoods.includes(m));
        const eHigh = isCalm ? 'Medium' : 'High';
        const eMid = isCalm ? 'Low' : 'Medium';

        // 프롬프트에서 악기 추출 (전체 범위)
        const pt = (applied.stylePrompt || '').toLowerCase();
        const instrTags = [];
        if (pt.includes('piano')) instrTags.push('piano');
        if (pt.includes('guitar')) instrTags.push('guitar');
        if (pt.includes('strings')) instrTags.push('strings');
        if (pt.includes('synth')) instrTags.push('synth');
        if (pt.includes('drums')) instrTags.push('drums');
        if (pt.includes('bass') && !pt.includes('double bass')) instrTags.push('bass');
        if (pt.includes('saxophone') || pt.includes('sax')) instrTags.push('sax');
        if (pt.includes('violin')) instrTags.push('violin');
        if (pt.includes('organ')) instrTags.push('organ');
        if (pt.includes('trumpet')) instrTags.push('trumpet');
        if (pt.includes('flute')) instrTags.push('flute');
        if (pt.includes('cello')) instrTags.push('cello');
        if (pt.includes('harp')) instrTags.push('harp');
        if (pt.includes('ukulele')) instrTags.push('ukulele');
        const mi = instrTags.length > 0 ? instrTags[0] : '';

        // 프롬프트에서 보컬 스타일 추출
        let vocalStyle = '';
        if (pt.includes('whisper')) vocalStyle = 'whisper';
        else if (pt.includes('falsetto')) vocalStyle = 'falsetto';
        else if (pt.includes('raspy') || pt.includes('husky')) vocalStyle = 'raspy';
        else if (pt.includes('belting') || pt.includes('powerful vocal')) vocalStyle = 'belting';
        else if (pt.includes('soft vocal') || pt.includes('gentle vocal')) vocalStyle = 'soft';
        else if (pt.includes('harmony') || pt.includes('harmonies')) vocalStyle = 'harmonies';
        else if (pt.includes('soulful')) vocalStyle = 'soulful';
        else if (pt.includes('breathy')) vocalStyle = 'breathy';

        // 섹션 이름 정규화
        const section = sectionRaw.replace(/\d+/g, '').trim().toLowerCase();

        // 섹션별 메타태그 조합
        let tags = '';

        if (section === 'intro') {
            tags = `[Mood: ${pm}] [Energy: Low]`;
            if (mi) tags += ` [Instrument: ${mi} gentle]`;
            if (vocalStyle === 'whisper' || vocalStyle === 'breathy') tags += ` [Vocal: ${vocalStyle}]`;
        }
        else if (section === 'verse') {
            // Verse 2 이후 에너지 살짝 상승
            const verseEnergy = num > 1 ? eMid : 'Low';
            tags = `[Mood: ${pm}] [Energy: ${verseEnergy}]`;
            if (mi) tags += ` [${mi} leading]`;
            if (vocalStyle && num === 1) tags += ` [Vocal: ${vocalStyle}]`;
            if (num > 1 && vocalStyle) tags += ` [Vocal: ${vocalStyle} with intensity]`;
        }
        else if (section === 'pre-chorus' || section === 'prechorus') {
            tags = `[Mood: ${pm}] [Energy: Rising]`;
            if (vocalStyle) tags += ` [Vocal: building]`;
        }
        else if (section === 'chorus') {
            tags = `[Mood: ${pm}] [Energy: ${eHigh}]`;
            if (instrTags.length > 1) tags += ` [${instrTags.slice(0, 2).join(' + ')} full arrangement]`;
            else if (mi) tags += ` [${mi} full]`;
            // 코러스 보컬: 장르에 따라 결정 (대중적 장르에서는 powerful 금지)
            const heavyGenres = ['metal', 'rock', 'hard rock', 'punk', 'hardcore', 'power metal', 'nu metal', 'grunge'];
            const isHeavyGenre = heavyGenres.some(g => pt.includes(g));
            if (vocalStyle === 'belting' || vocalStyle === 'soulful') {
                tags += ` [Vocal: ${vocalStyle}]`;
            } else if (isHeavyGenre) {
                tags += ` [Vocal: powerful]`;
            } else if (vocalStyle) {
                // 팝/R&B/재즈/힙합/칠팝/어쿠스틱 등 대중적 장르 → 감성적 보컬
                tags += ` [Vocal: emotional]`;
            }
            // 2번째 코러스 이후 하모니 추가
            if (num > 1) tags += ` [Harmonies]`;
        }
        else if (section === 'post-chorus') {
            tags = `[Energy: ${eMid}] [Harmonies]`;
            if (vocalStyle) tags += ` [Vocal: layered]`;
        }
        else if (section === 'bridge') {
            // 브릿지 = 감정 전환, 다른 무드 사용
            tags = `[Mood: ${pm2}] [Energy: Low]`;
            if (mi) tags += ` [${mi} stripped]`;
            if (vocalStyle === 'falsetto') tags += ` [Vocal: falsetto]`;
            else if (vocalStyle) tags += ` [Vocal: vulnerable]`;
        }
        else if (section === 'drop') {
            tags = `[Energy: ${eHigh}]`;
            if (instrTags.length > 0) tags += ` [${instrTags.slice(0, 2).join(' + ')} drop]`;
        }
        else if (section === 'build up') {
            tags = `[Energy: Rising]`;
            if (mi) tags += ` [${mi} building]`;
        }
        else if (section === 'breakdown') {
            tags = `[Energy: Low] [${mi || 'minimal'} only]`;
        }
        else if (section === 'rap') {
            tags = `[Flow: Rhythmic] [Energy: ${eMid}]`;
        }
        else if (section === 'hook') {
            tags = `[Mood: ${pm}] [Energy: ${eHigh}]`;
            if (vocalStyle) tags += ` [Vocal: catchy]`;
        }
        else if (section === 'ad-lib') {
            tags = `[Vocal: ad-lib] [Energy: ${eMid}]`;
        }
        else if (section === 'key change') {
            tags = '[Key Change Up]';
        }
        else if (section === 'fade out') {
            tags = '[Fade Out]';
        }
        else if (section === 'outro') {
            tags = `[Energy: Fading]`;
            if (mi) tags += ` [${mi} fading]`;
            if (vocalStyle === 'whisper' || vocalStyle === 'breathy') tags += ` [Vocal: ${vocalStyle}]`;
            tags += ` [Fade Out] [End]`;
        }
        else if (section === 'end') {
            tags = '[End]';
        }
        else if (section === 'callback') {
            tags = '[Callback]';
        }
        else if (section === 'solo') {
            tags = `[Instrumental] [Solo: ${mi || 'guitar'}]`;
        }
        else if (section === 'interlude' || section === 'instrumental') {
            tags = `[Instrumental]`;
            if (mi) tags += ` [${mi} interlude]`;
        }

        return tags;
    }

    // === 레퍼런스 전체 구조를 1:1 완벽 복제 ===
    function generateFromReferenceComplete(refText, title, gen, lang, isMeta) {
        const lines = refText.split('\n');
        let result = '';
        const usedLines = new Set();
        let linesInSection = 0;
        let refSectionCounter = '';
        const refSecCounters = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // 빈 줄 → 빈 줄 그대로
            if (trimmed.length === 0) {
                result += '\n';
                continue;
            }

            // 섹션 태그 → 그대로 유지
            if (trimmed.startsWith('[')) {
                result += trimmed + '\n';
                refSectionCounter = trimmed.replace(/[\[\]]/g, '').replace(/\d+/g, '').trim();
                // 섹션 번호 추적 (Verse 2, Chorus 2 등)
                refSecCounters[refSectionCounter] = (refSecCounters[refSectionCounter] || 0) + 1;
                linesInSection = 0;

                // v5 메타태그 = buildMetaTagsForSection 통합 함수 사용
                if (isMeta) {
                    const metaTags = buildMetaTagsForSection(refSectionCounter, refSecCounters[refSectionCounter]);
                    if (metaTags) result += metaTags + '\n';
                }
                continue;
            }

            // 가사 줄 → 같은 단어 수의 새로운 줄 생성
            const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length;
            const charCount = trimmed.length;

            let newLine = '';
            let tries = 0;

            // 현재 섹션 파악 (위에서 가장 가까운 섹션 태그)
            let currentSection = 'Verse';
            for (let j = i - 1; j >= 0; j--) {
                const prev = lines[j].trim();
                if (prev.startsWith('[')) {
                    currentSection = prev.replace(/[\[\]]/g, '').replace(/\d+/g, '').trim();
                    break;
                }
            }

            do {
                if (lang === 'korean') {
                    newLine = generateKoreanByCharCount(charCount, currentSection, title, gen);
                } else if (lang === 'english' || lang === 'mixed') {
                    newLine = generateEnglishByWordCount(wordCount, currentSection, title);
                } else {
                    // 기타 언어
                    newLine = generateLineByLanguage(lang, charCount, currentSection, title, gen);
                }
                tries++;
            } while (usedLines.has(newLine) && tries < 30);

            usedLines.add(newLine);

            // v5 가사 중간 감정 변화 메타태그 (메타 형식일 때, 프롬프트 기반)
            if (isMeta && linesInSection > 0 && linesInSection % 4 === 0) {
                const applied = state.appliedPrompt || {};
                const promptMoods = applied.moodSentence || ['Reflective'];
                const pm = promptMoods[0] || 'Reflective';
                const calmMoods = ['Calm', 'Serene', 'Peaceful', 'Warm', 'Cozy', 'Comfortable', 'Healing', 'Soothing', 'Dreamy', 'Ethereal'];
                const isCalm = calmMoods.some(m => promptMoods.includes(m));
                // 분위기에 따른 중간 태그 선택
                const midTags = isCalm
                    ? [`[Mood: ${pm}]`, `[Energy: Gentle]`, `[Mood: Deeper ${pm}]`]
                    : [`[Energy: Rising]`, `[Mood: Intense ${pm}]`, `[Energy: Building]`];
                result += midTags[Math.floor(Math.random() * midTags.length)] + '\n';
            }
            linesInSection++;

            result += newLine + '\n';
        }

        return result.trim();
    }

    function generateSectionLyrics(section, num, title, gen, moods) {
        const lang = getSelectedLanguage();

        const refEl = document.getElementById('referenceInput');
        const ref = refEl ? refEl.value.trim() : (state.reference || '').trim();

        if (NO_LYRICS_SECTIONS.includes(section)) return '';

        if (ref.length > 0) {
            return generateFromReference(section, num, title, gen, ref, lang);
        }

        return generateByBpmAndGenre(section, num, title, gen, lang);
    }

    // === 레퍼런스 기반: 구조 완벽 복제 ===
    // 레퍼런스 파싱 캐시
    let parsedRefCache = null;
    let parsedRefText = '';

    function generateFromReference(section, num, title, gen, refText, lang) {
        // 파싱 캐시
        if (parsedRefText !== refText) {
            parsedRefCache = parseReferenceSections(refText);
            parsedRefText = refText;
        }
        const refSections = parsedRefCache;

        // 현재 섹션에 해당하는 레퍼런스 찾기
        let matchedRef = null;
        const sectionLower = section.toLowerCase();

        // 1차: 정확한 섹션+번호 매칭
        for (const rs of refSections) {
            const rsLower = rs.name.toLowerCase();
            if (rsLower.includes(sectionLower) && rs.num === num) { matchedRef = rs; break; }
        }

        // 2차: 같은 섹션 이름 첫번째 매칭
        if (!matchedRef) {
            for (const rs of refSections) {
                if (rs.name.toLowerCase().includes(sectionLower)) { matchedRef = rs; break; }
            }
        }

        // 3차: 비슷한 역할 매칭
        if (!matchedRef) {
            const roleMap = { 'Verse': ['verse'], 'Chorus': ['chorus', 'hook'], 'Pre-Chorus': ['pre-chorus', 'pre chorus', 'prechorus'], 'Bridge': ['bridge'], 'Rap': ['rap'], 'Hook': ['hook', 'chorus'] };
            const roles = roleMap[section] || [sectionLower];
            for (const rs of refSections) {
                if (roles.some(r => rs.name.toLowerCase().includes(r))) { matchedRef = rs; break; }
            }
        }

        // 매칭 성공: 레퍼런스의 각 줄을 1:1로 복제
        if (matchedRef && matchedRef.lines.length > 0) {
            const usedLines = new Set(); // 중복 방지
            const newLines = matchedRef.lines.map(refLine => {
                // 레퍼런스 줄 분석
                const wordCount = refLine.trim().split(/\s+/).filter(w => w.length > 0).length;
                const charCount = refLine.trim().length;

                // 같은 단어 수/글자수의 새로운 줄 생성 (중복 방지)
                let newLine = '';
                let tries = 0;
                do {
                    if (lang === 'korean') newLine = generateKoreanByCharCount(charCount, section, title, gen);
                    else if (lang === 'english' || lang === 'mixed') newLine = generateEnglishByWordCount(wordCount, section, title);
                    else newLine = generateLineByLanguage(lang, charCount, section, title, gen);
                    tries++;
                } while (usedLines.has(newLine) && tries < 20);

                usedLines.add(newLine);
                return newLine;
            });
            return newLines.join('\n') + '\n';
        }

        // 매칭 실패 시 BPM 기반 생성
        return generateByBpmAndGenre(section, num, title, gen, lang);
    }

    // 단어 수에 맞는 영어 줄 생성 (모든 단어 1단어씩)
    function generateEnglishByWordCount(targetWords, section, title) {
        // 모든 요소 반드시 1단어
        const w = {
            subj: ['I', 'You', 'We', 'She', 'He', 'They', 'Love', 'Time', 'Rain', 'Stars', 'Light', 'Dreams', 'Hearts', 'Tears', 'Wind', 'Snow', 'Fire', 'Smoke', 'Waves', 'Clouds'],
            verb: ['falls', 'burns', 'fades', 'stays', 'breaks', 'shines', 'flows', 'grows', 'flies', 'runs', 'keeps', 'holds', 'feels', 'turns', 'moves', 'calls', 'waits', 'melts', 'glows', 'breathes', 'drifts', 'spins', 'shifts', 'bends', 'rings'],
            adj: ['soft', 'cold', 'warm', 'bright', 'dark', 'still', 'slow', 'deep', 'wild', 'sweet', 'lost', 'free', 'blue', 'new', 'true', 'right', 'pure', 'raw', 'thin', 'pale', 'clear', 'vast'],
            prep: ['on', 'in', 'by', 'through', 'like', 'with', 'for', 'to', 'of', 'from', 'near', 'past', 'down', 'up'],
            noun: ['you', 'me', 'light', 'night', 'time', 'love', 'fire', 'rain', 'sky', 'room', 'door', 'heart', 'road', 'dream', 'snow', 'sound', 'world', 'hand', 'eyes', 'soul', 'dawn', 'dust', 'glass', 'shade', 'storm', 'flame', 'stone', 'grace']
        };

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // 정확한 단어 수 맞춤
        const parts = [];
        if (targetWords === 1) return pick(w.noun);
        if (targetWords === 2) return `${pick(w.adj)} ${pick(w.noun)}`;
        if (targetWords === 3) {
            const patterns = [
                () => `${pick(w.subj)} ${pick(w.verb)} ${pick(w.adj)}`,
                () => `${pick(w.adj)} ${pick(w.adj)} ${pick(w.noun)}`,
                () => `${pick(w.subj)} ${pick(w.prep)} ${pick(w.noun)}`
            ];
            return patterns[Math.floor(Math.random() * patterns.length)]();
        }
        if (targetWords === 4) {
            const patterns = [
                () => `${pick(w.subj)} ${pick(w.prep)} ${pick(w.adj)} ${pick(w.noun)}`,
                () => `${pick(w.adj)} ${pick(w.noun)} ${pick(w.verb)} ${pick(w.adj)}`,
                () => `${pick(w.subj)} ${pick(w.verb)} ${pick(w.prep)} ${pick(w.noun)}`
            ];
            return patterns[Math.floor(Math.random() * patterns.length)]();
        }
        if (targetWords === 5) {
            const patterns = [
                () => `${pick(w.subj)} ${pick(w.verb)} ${pick(w.prep)} ${pick(w.adj)} ${pick(w.noun)}`,
                () => `${pick(w.adj)} ${pick(w.noun)} ${pick(w.prep)} ${pick(w.adj)} ${pick(w.noun)}`
            ];
            return patterns[Math.floor(Math.random() * patterns.length)]();
        }
        if (targetWords === 6) {
            return `${pick(w.subj)} ${pick(w.verb)} ${pick(w.prep)} ${pick(w.adj)} ${pick(w.adj)} ${pick(w.noun)}`;
        }

        // 7단어 이상: 조합
        let line = `${pick(w.subj)} ${pick(w.verb)} ${pick(w.prep)} ${pick(w.adj)} ${pick(w.noun)}`;
        while (line.split(/\s+/).length < targetWords) {
            line += ` ${pick(w.prep)} ${pick(w.noun)}`;
        }
        // 정확한 단어 수 자르기
        return line.split(/\s+/).slice(0, targetWords).join(' ');
    }

    // 글자 수에 맞는 한국어 줄 생성
    function generateKoreanByCharCount(targetChars, section, title, gen) {
        const parts = {
            subj: ['나는', '너는', '우리', '그대', '하늘', '바람', '세상', '마음', '시간', '오늘', '내일', '어제', '눈물', '미소', '기억', '약속', '새벽', '밤이', '빛이', '길이'],
            verb: ['걷는다', '부른다', '흐른다', '웃는다', '운다', '빛난다', '흔들린다', '멈춘다', '스친다', '닿는다', '내린다', '피어난다', '사라진다', '남겨진다', '물든다'],
            end: ['처럼', '같이', '만큼', '위에', '아래', '속에', '앞에', '너머', '사이로', '함께'],
            adj: ['따뜻한', '차가운', '고요한', '작은', '큰', '푸른', '붉은', '하얀', '깊은', '높은', '먼', '익숙한', '낯선']
        };

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // 코러스에서 제목 삽입
        if ((section === 'Chorus' || section === 'Hook') && title && Math.random() > 0.4) {
            const remaining = targetChars - title.length - 1;
            if (remaining > 2) return `${title} ${pick(parts.verb)}`;
            return title;
        }

        // 글자수에 맞게 조합
        let line = '';
        if (targetChars <= 6) {
            line = `${pick(parts.subj)} ${pick(parts.verb)}`;
        } else if (targetChars <= 10) {
            line = `${pick(parts.adj)} ${pick(parts.subj)} ${pick(parts.verb)}`;
        } else {
            line = `${pick(parts.adj)} ${pick(parts.subj)} ${pick(parts.end)} ${pick(parts.verb)}`;
        }

        // 정확한 글자수 맞춤 (공백 제외)
        const cleaned = line.replace(/\s/g, '');
        if (cleaned.length > targetChars && targetChars > 3) {
            return line.substring(0, targetChars);
        }
        return line;
    }

    // 레퍼런스 텍스트를 섹션별로 파싱
    function parseReferenceSections(refText) {
        const sections = [];
        const lines = refText.split('\n');
        let current = null;
        let sectionCounters = {};

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.length === 0) return; // 빈 줄 건너뛰기

            const tagMatch = trimmed.match(/^\[([^\]]+)\]/);

            if (tagMatch) {
                const rawName = tagMatch[1].trim();
                const baseName = rawName.replace(/\d+/g, '').trim();
                sectionCounters[baseName] = (sectionCounters[baseName] || 0) + 1;
                current = { name: baseName, num: sectionCounters[baseName], lines: [] };
                sections.push(current);
            } else if (current) {
                // 메타태그가 아닌 실제 가사만
                if (!trimmed.startsWith('[')) {
                    current.lines.push(trimmed);
                }
            } else {
                // 태그 없이 시작하는 가사 → Verse로 간주
                current = { name: 'Verse', num: 1, lines: [trimmed] };
                sections.push(current);
            }
        });

        return sections;
    }

    // === BPM/장르 기반: 적절한 분량 자동 결정 ===
    function generateByBpmAndGenre(section, num, title, gen, lang) {
        const d = state.promptData || {};
        const prompt = d.stylePrompt || '';

        // BPM 추출
        const bpmMatch = prompt.match(/(\d+)\s*BPM/i);
        const bpm = bpmMatch ? parseInt(bpmMatch[1]) : 110;

        // BPM에 따른 섹션별 줄 수 결정
        // 느린 BPM = 적은 글자, 짧은 문장 / 빠른 BPM = 많은 글자, 빠른 리듬
        let lineCount, charPerLine;

        if (bpm <= 80) {
            // 발라드/슬로우: 짧고 여유로운 가사
            charPerLine = 7;
            if (section === 'Verse') lineCount = 4;
            else if (section === 'Pre-Chorus') lineCount = 2;
            else if (section === 'Chorus') lineCount = 4;
            else if (section === 'Bridge') lineCount = 2;
            else if (section === 'Rap') lineCount = 4;
            else if (section === 'Hook') lineCount = 2;
            else lineCount = 2;
        } else if (bpm <= 110) {
            // 미디엄: 보통 분량
            charPerLine = 9;
            if (section === 'Verse') lineCount = 4;
            else if (section === 'Pre-Chorus') lineCount = 2;
            else if (section === 'Chorus') lineCount = 4;
            else if (section === 'Bridge') lineCount = 2;
            else if (section === 'Rap') lineCount = 6;
            else if (section === 'Hook') lineCount = 2;
            else lineCount = 2;
        } else if (bpm <= 130) {
            // 업템포: 적당히 빠른 가사
            charPerLine = 10;
            if (section === 'Verse') lineCount = 4;
            else if (section === 'Pre-Chorus') lineCount = 2;
            else if (section === 'Chorus') lineCount = 4;
            else if (section === 'Bridge') lineCount = 3;
            else if (section === 'Rap') lineCount = 8;
            else if (section === 'Hook') lineCount = 2;
            else lineCount = 2;
        } else {
            // 빠른 템포: 많은 글자, 빠른 리듬
            charPerLine = 11;
            if (section === 'Verse') lineCount = 4;
            else if (section === 'Pre-Chorus') lineCount = 2;
            else if (section === 'Chorus') lineCount = 4;
            else if (section === 'Bridge') lineCount = 2;
            else if (section === 'Rap') lineCount = 8;
            else if (section === 'Hook') lineCount = 2;
            else lineCount = 2;
        }

        // 줄 생성
        const result = [];
        for (let i = 0; i < lineCount; i++) {
            result.push(generateLineByLanguage(lang, charPerLine, section, title, gen));
        }

        return result.join('\n') + '\n';
    }

    // 언어별 가사 줄 생성 (모든 언어 지원)
    function generateLineByLanguage(lang, charPerLine, section, title, gen) {
        if (lang === 'korean') return generateNewKoreanLine(charPerLine, section, title, gen);
        if (lang === 'english' || lang === 'mixed') return generateNewEnglishLine(charPerLine, section, title);
        if (lang === 'japanese') return generateJapaneseLine(section, title);
        if (lang === 'spanish') return generateSpanishLine(section, title);
        if (lang === 'chinese') return generateChineseLine(section, title);
        if (lang === 'french') return generateFrenchLine(section, title);
        if (lang === 'german') return generateGermanLine(section, title);
        if (lang === 'portuguese') return generatePortugueseLine(section, title);
        // 기타 언어는 영어로 fallback
        return generateNewEnglishLine(charPerLine, section, title);
    }

    function generateJapaneseLine(section, title) {
        const pools = {
            Verse: ['\u4ECA\u65E5\u3082\u540C\u3058\u7A7A\u306E\u4E0B\u3067', '\u7A93\u306E\u5916\u306B\u96E8\u304C\u964D\u308B', '\u541B\u306E\u3044\u306A\u3044\u670B', '\u6642\u9593\u304C\u6B62\u307E\u3063\u305F\u3088\u3046\u306B', '\u98A8\u304C\u512A\u3057\u304F\u5439\u304F'],
            'Pre-Chorus': ['\u305D\u308C\u3067\u3082\u6B69\u304D\u7D9A\u3051\u308B', '\u3053\u306E\u60F3\u3044\u5C4A\u3051\u305F\u3044'],
            Chorus: [`${title} \u541B\u306B\u5C4A\u304F\u307E\u3067`, `${title} \u3082\u3046\u4E00\u5EA6\u547C\u3076\u3088`, '\u4E16\u754C\u304C\u541B\u3067\u6E80\u305F\u3055\u308C\u308B'],
            Bridge: ['\u9060\u304F\u307E\u308F\u308A\u9053\u3057\u305F\u3051\u3069', '\u7D50\u5C40\u541B\u3060\u3063\u305F']
        };
        const pool = pools[section] || pools.Verse;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function generateSpanishLine(section, title) {
        const pools = {
            Verse: ['Bajo el mismo cielo hoy', 'La lluvia cae en mi ventana', 'Sin ti este lugar se siente', 'El tiempo se detuvo aqui', 'El viento sopla suavemente'],
            'Pre-Chorus': ['Pero sigo caminando', 'Quiero que llegue mi voz'],
            Chorus: [`${title} hasta llegar a ti`, `${title} una vez mas te llamo`, 'El mundo se llena de ti'],
            Bridge: ['Di muchas vueltas pero', 'Al final eras tu']
        };
        const pool = pools[section] || pools.Verse;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function generateChineseLine(section, title) {
        const pools = {
            Verse: ['\u4ECA\u5929\u4E5F\u5728\u540C\u4E00\u7247\u5929\u7A7A\u4E0B', '\u7A97\u5916\u7684\u96E8\u5728\u4E0B', '\u6CA1\u6709\u4F60\u7684\u65E5\u5B50', '\u65F6\u95F4\u4EFF\u4F5B\u505C\u6B62\u4E86', '\u98CE\u8F7B\u8F7B\u5730\u5439'],
            'Pre-Chorus': ['\u4F46\u6211\u8FD8\u5728\u8D70', '\u60F3\u8BA9\u4F60\u542C\u5230'],
            Chorus: [`${title} \u76F4\u5230\u5230\u8FBE\u4F60\u8EAB\u8FB9`, `${title} \u518D\u547C\u5524\u4F60\u4E00\u6B21`, '\u4E16\u754C\u56E0\u4F60\u800C\u5B8C\u6574'],
            Bridge: ['\u7ED5\u4E86\u5F88\u8FDC\u7684\u8DEF', '\u6700\u7EC8\u8FD8\u662F\u4F60']
        };
        const pool = pools[section] || pools.Verse;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function generateFrenchLine(section, title) {
        const pools = {
            Verse: ['Sous le meme ciel aujourd\'hui', 'La pluie tombe sur ma fenetre', 'Sans toi cet endroit est vide', 'Le temps s\'est arrete ici', 'Le vent souffle doucement'],
            Chorus: [`${title} jusqu'a toi`, `${title} encore une fois`, 'Le monde se remplit de toi'],
            Bridge: ['J\'ai fait un long detour', 'C\'etait toi depuis le debut']
        };
        const pool = pools[section] || pools.Verse;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function generateGermanLine(section, title) {
        const pools = {
            Verse: ['Unter dem gleichen Himmel heute', 'Der Regen fallt auf mein Fenster', 'Ohne dich fehlt hier etwas', 'Die Zeit blieb stehen hier', 'Der Wind weht sanft vorbei'],
            Chorus: [`${title} bis ich dich erreiche`, `${title} noch einmal rufe ich`, 'Die Welt wird voll von dir'],
            Bridge: ['Ich ging so weit herum', 'Am Ende warst du es']
        };
        const pool = pools[section] || pools.Verse;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    function generatePortugueseLine(section, title) {
        const pools = {
            Verse: ['Sob o mesmo ceu hoje', 'A chuva cai na janela', 'Sem voce este lugar', 'O tempo parou aqui', 'O vento sopra suave'],
            Chorus: [`${title} ate chegar a voce`, `${title} mais uma vez te chamo`, 'O mundo se enche de voce'],
            Bridge: ['Dei tantas voltas mas', 'No final era voce']
        };
        const pool = pools[section] || pools.Verse;
        return pool[Math.floor(Math.random() * pool.length)];
    }

    // 한국어 가사 풀 (글자수별로 분류, 저작권 없는 오리지널)
    const KOR_POOLS = {
        Verse: {
            short: ['비가 내리는 밤', '혼자인 이 밤에', '너의 빈자리가', '시간이 멈춘 듯', '오늘도 같은 길', '창가에 앉아서', '바람이 불어와'],
            medium: ['오늘도 같은 길을 걷는다', '창밖에 비가 내리는 밤이야', '너의 흔적이 남아있는 곳에', '익숙한 거리가 낯설어져가', '혼자인 밤이 점점 길어지면', '어디선가 들려오는 노래가', '아무 말 없이 걸었던 그 길을', '매일이 조금씩 달라져간다', '새벽 공기가 차갑게 스며와', '아직 끝나지 않은 이야기가'],
            long: ['너를 떠올리면 습관처럼 웃게 돼', '시간이 흘러도 변하지 않는 마음', '지나간 계절이 그리워지는 요즘에', '내일은 좀 달라질까 생각해본다', '작은 위로 하나가 필요한 오늘밤']
        },
        'Pre-Chorus': {
            short: ['그래도 난 괜찮아', '멈추지 않을게', '한 걸음만 더'],
            medium: ['그래도 난 멈추지 않을게', '이 마음을 전할 수 있다면', '눈물 뒤에 웃음이 있잖아'],
            long: ['포기란 없어 나에게는 절대로', '한 걸음만 더 가면 닿을 수 있어']
        },
        Chorus: {
            short: ['너에게 닿을 때', '다시 불러본다', '내 마음을 담아'],
            medium: ['너에게 닿을 때까지 불러', '이 노래가 너에게 전해질 때', '다시 한번 너를 불러본다', '내 마음을 담아서 보내줄게', '이 순간을 영원히 기억할게'],
            long: ['온 세상이 너로 가득 차는 이 순간', '영원히 기억해줘 이 밤의 우리를']
        },
        Bridge: {
            short: ['돌고 돌아 여기', '결국 답은 너야'],
            medium: ['돌고 돌아 여기까지 왔어', '멀리서 바라만 봤던 날들', '이제는 말할 수 있어 너에게'],
            long: ['결국 모든 길은 너에게로 향했어']
        },
        Rap: {
            short: ['멈추지 마 가자', '내 이름을 불러'],
            medium: ['멈추지 마 이 길 위에서 달려', '세상이 뭐라 해도 상관없어', '나만의 리듬으로 걸어가볼게', '내 이름을 불러줘 더 크게'],
            long: ['나만의 리듬으로 이 세상을 걸어가', '세상이 뭐라 하든 나는 나의 길을 가']
        },
        Hook: {
            short: ['느껴봐 이 순간'],
            medium: ['느껴봐 이 순간을 놓치지 마'],
            long: ['이 순간을 영원히 놓치지 마 우리']
        },
        'Post-Chorus': { short: ['Oh oh oh'], medium: ['Oh oh oh oh'], long: ['La la la la la'] },
        'Ad-lib': { short: ['Yeah'], medium: ['Come on yeah'], long: ['One more time yeah'] }
    };

    const ENG_POOLS = {
        Verse: {
            short: ['Empty road ahead', 'Shadows on the wall', 'Silence fills the room', 'Stars above my head', 'Footsteps in the rain'],
            medium: ['Walking down this empty road tonight', 'Shadows dancing slowly on the wall', 'Every word you left still echoes here', 'Searching for a sign beneath the stars', 'Nothing ever stays the same for long', 'Pages turning slowly one by one', 'Lost inside this melody again'],
            long: ['The silence speaks so loud I cannot breathe tonight', 'Counting every star above my head and wondering']
        },
        'Pre-Chorus': {
            short: ['I keep holding on', 'This is where I stand'],
            medium: ['But I keep holding on to this', 'No turning back from here tonight'],
            long: ['I can feel it rising up inside my chest']
        },
        Chorus: {
            short: ['Hear me calling', 'Shining through'],
            medium: ['Hear me calling out your name now', 'Shining through the darkest night', 'This is everything I feel inside', 'Never ever letting go of you'],
            long: ['We are so much more than yesterday could know', 'This moment lasts forever in my heart and soul']
        },
        Bridge: {
            short: ['After all the roads', 'The answer was you'],
            medium: ['After all the winding roads I see', 'Looking back I finally understand'],
            long: ['Every single tear has led me right to here']
        },
        Rap: {
            short: ['Never stopping now', 'Say my name out loud'],
            medium: ['Never stopping on this grind tonight', 'World can talk but I just do not care', 'Walking to my very own beat now'],
            long: ['Say my name into the sky and let it echo']
        },
        Hook: { short: ['Feel it now'], medium: ['Feel it now don\'t let go'], long: ['Feel this moment never let it go'] },
        'Post-Chorus': { short: ['Oh oh oh'], medium: ['Oh oh oh yeah'], long: ['Na na na na na na'] },
        'Ad-lib': { short: ['Yeah'], medium: ['Come on yeah'], long: ['One more time yeah'] }
    };

    function generateNewKoreanLine(targetLen, section, title, gen) {
        const pool = KOR_POOLS[section] || KOR_POOLS.Verse;
        let candidates;

        if (targetLen <= 6) candidates = pool.short || pool.medium;
        else if (targetLen <= 10) candidates = pool.medium || pool.short;
        else candidates = pool.long || pool.medium;

        if (!candidates || candidates.length === 0) candidates = pool.medium || pool.short || [''];

        let line = candidates[Math.floor(Math.random() * candidates.length)];

        // 코러스에 제목 삽입
        if ((section === 'Chorus' || section === 'Hook') && title && Math.random() > 0.5) {
            line = title + ' ' + line.substring(0, Math.max(0, targetLen - title.length));
        }

        // 레퍼런스 기반이면 글자수 맞춤 (12음절 제한 삭제)
        return line;
    }

    function generateNewEnglishLine(targetLen, section, title) {
        const pool = ENG_POOLS[section] || ENG_POOLS.Verse;
        let candidates;

        if (targetLen <= 5) candidates = pool.short || pool.medium;
        else if (targetLen <= 8) candidates = pool.medium || pool.short;
        else candidates = pool.long || pool.medium;

        if (!candidates || candidates.length === 0) candidates = pool.medium || pool.short || [''];

        let line = candidates[Math.floor(Math.random() * candidates.length)];

        if ((section === 'Chorus' || section === 'Hook') && title && Math.random() > 0.5) {
            line = title + ' ' + line;
        }

        return line;
    }

    function updateLyricsInfo() {
        const ta = document.getElementById('lyricsMainTextarea');
        const text = ta.value;
        const lines = text.split('\n').filter(l => l.trim() && !l.trim().startsWith('['));
        const status = document.getElementById('syllableStatus');
        status.innerHTML = `<span style="color:var(--text-secondary);">\uCD1D ${lines.length}\uC904</span>`;
        const maxChars = currentFormat === 'meta' ? 5000 : 99999;
        const charCount = document.getElementById('lyricsCharCount');
        charCount.textContent = currentFormat === 'meta' ? `${text.length} / 5,000\uC790` : `${text.length}\uC790`;
        if (text.length > maxChars) charCount.style.color = 'var(--accent)';
        else charCount.style.color = '';

        // 입력 시 실시간 업데이트
        ta.removeEventListener('input', updateLyricsInfo);
        ta.addEventListener('input', updateLyricsInfo);
    }

    // === STEP 5: 최종 출력 ===
    // === 5단계: 제목별 전체 데이터 출력 ===
    let finalCurrentIdx = 0;
    let finalCurrentVersion = 'a'; // 'a' = 메타태그 포함, 'b' = 섹션 태그만

    function buildFinalOutput() {
        const allTitles = state.confirmedTitles.length > 0 ? state.confirmedTitles : state.titles;
        if (allTitles.length === 0) return;

        // 제목 탭 생성
        const tabContainer = document.getElementById('finalTitleTabs');
        tabContainer.innerHTML = allTitles.map((t, i) =>
            `<button class="final-title-tab ${i === 0 ? 'active' : ''}" data-idx="${i}">${i + 1}. ${getTitleWithTranslation(t)}</button>`
        ).join('');

        tabContainer.querySelectorAll('.final-title-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabContainer.querySelectorAll('.final-title-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                finalCurrentIdx = parseInt(tab.dataset.idx);
                renderFinalForTitle(finalCurrentIdx);
            });
        });

        // 첫 번째 제목 렌더링
        finalCurrentIdx = 0;
        renderFinalForTitle(0);

        // 버전 탭 이벤트
        document.getElementById('tabVersionA').onclick = () => { finalCurrentVersion = 'a'; updateFinalVersionTab(); };
        document.getElementById('tabVersionB').onclick = () => { finalCurrentVersion = 'b'; updateFinalVersionTab(); };
    }

    function renderFinalForTitle(idx) {
        const allTitles = state.confirmedTitles.length > 0 ? state.confirmedTitles : state.titles;
        const title = allTitles[idx] || '';
        const applied = state.appliedPrompt || {};
        const d = state.promptData || {};

        // 1. Style Prompt
        document.getElementById('finalStylePrompt').value = applied.stylePrompt || d.stylePrompt || '';
        autoResizeFinalBox('finalStylePrompt');

        // 2. Exclude Styles
        document.getElementById('finalExcludeStyles').value = applied.excludeStyles || d.excludeStyles || '';
        autoResizeFinalBox('finalExcludeStyles');

        // 3. More Options
        let optHtml = '';
        const w = d.weirdness || applied.weirdness;
        const si = d.styleInfluence || applied.styleInfluence;
        if (w) optHtml += `Weirdness: ${w}%`;
        if (w && si) optHtml += ' | ';
        if (si) optHtml += `Style Influence: ${si}%`;
        if (!optHtml) optHtml = '-';
        document.getElementById('finalMoreOptions').textContent = optHtml;

        // 4. 노래 제목 (설정 언어 + 한국어 번역)
        document.getElementById('finalTitleDisplay').textContent = getTitleWithTranslation(title);

        // 5. 가사 (titleLyricsMap에서 가져오기)
        updateFinalVersionTab();
    }

    function updateFinalVersionTab() {
        // 탭 UI
        document.querySelectorAll('.version-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(finalCurrentVersion === 'a' ? 'tabVersionA' : 'tabVersionB').classList.add('active');
        document.getElementById('versionDesc').textContent = finalCurrentVersion === 'a'
            ? 'Suno AI Lyrics Field\uC5D0 \uBC14\uB85C \uC0AC\uC6A9. \uBA54\uD0C0\uD0DC\uADF8([Mood], [Energy] \uB4F1) \uD3EC\uD568.'
            : '\uAE54\uB054\uD55C \uAC00\uC0AC. \uC139\uC158 \uD0DC\uADF8([Verse], [Chorus] \uB4F1)\uB9CC \uD3EC\uD568.';

        // 가사 내용
        const data = titleLyricsMap[finalCurrentIdx];
        let lyricsText = '';
        if (data) {
            lyricsText = finalCurrentVersion === 'a' ? (data.meta || '') : (data.section || '');
        }
        const box = document.getElementById('finalLyricsBox');
        box.value = lyricsText;
        document.getElementById('finalLyricsCharCount').textContent = `${lyricsText.length} / 5,000\uC790`;
        // 자동 높이
        box.style.height = 'auto';
        box.style.height = Math.max(300, box.scrollHeight) + 'px';
    }

    function autoResizeFinalBox(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = Math.max(42, el.scrollHeight) + 'px';
    }

    // === 5단계 개별 복사 버튼 ===
    function setupFinalCopyBtn(btnId, getTextFn) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', () => {
            const text = getTextFn();
            navigator.clipboard.writeText(text).then(() => {
                const orig = btn.textContent;
                btn.textContent = '\u2713 \uBCF5\uC0AC\uB428!'; btn.classList.add('copied');
                setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
            });
        });
    }
    setupFinalCopyBtn('btnCopyFinalPrompt', () => document.getElementById('finalStylePrompt').value);
    setupFinalCopyBtn('btnCopyFinalExclude', () => document.getElementById('finalExcludeStyles').value);
    setupFinalCopyBtn('btnCopyFinalTitle', () => {
        const allTitles = state.confirmedTitles.length > 0 ? state.confirmedTitles : state.titles;
        return allTitles[finalCurrentIdx] || '';
    });
    setupFinalCopyBtn('btnCopyFinalLyrics', () => document.getElementById('finalLyricsBox').value);

    // === 전체 복사 (한 세트) ===
    document.getElementById('btnCopyAll').addEventListener('click', () => {
        const allTitles = state.confirmedTitles.length > 0 ? state.confirmedTitles : state.titles;
        const title = allTitles[finalCurrentIdx] || '';
        const displayTitle = getTitleWithTranslation(title);
        const applied = state.appliedPrompt || {};
        const d = state.promptData || {};
        const prompt = applied.stylePrompt || d.stylePrompt || '';
        const exclude = applied.excludeStyles || d.excludeStyles || '';
        const w = d.weirdness || applied.weirdness;
        const si = d.styleInfluence || applied.styleInfluence;
        let opts = '';
        if (w) opts += `Weirdness: ${w}%`;
        if (w && si) opts += ' | ';
        if (si) opts += `Style Influence: ${si}%`;

        const lyrics = document.getElementById('finalLyricsBox').value;
        const versionLabel = finalCurrentVersion === 'a' ? '\uBA54\uD0C0\uD0DC\uADF8 \uD3EC\uD568' : '\uC139\uC158 \uD0DC\uADF8\uB9CC';

        let full = `========================================\n`;
        full += `SUNO MASTER PRO 12\n`;
        full += `========================================\n\n`;
        full += `[Style Prompt]\n${prompt}\n\n`;
        if (exclude) full += `[Exclude Styles]\n${exclude}\n\n`;
        if (opts) full += `[More Options]\n${opts}\n\n`;
        full += `[Title]\n${displayTitle}\n\n`;
        full += `[Lyrics - ${versionLabel}]\n${lyrics}\n`;
        full += `\n========================================\n`;

        navigator.clipboard.writeText(full);
        const b = document.getElementById('btnCopyAll');
        b.innerHTML = '<span>\u2713</span> \uBCF5\uC0AC\uC644\uB8CC!';
        setTimeout(() => b.innerHTML = '<span>\uD83D\uDCCB</span> \uC774 \uC81C\uBAA9 \uC804\uCCB4 \uBCF5\uC0AC', 2000);
    });

    // === 전체 저장하기 (모든 제목 포함) ===
    document.getElementById('btnSaveAll').addEventListener('click', () => {
        const allTitles = state.confirmedTitles.length > 0 ? state.confirmedTitles : state.titles;
        const applied = state.appliedPrompt || {};
        const d = state.promptData || {};
        const prompt = applied.stylePrompt || d.stylePrompt || '';
        const exclude = applied.excludeStyles || d.excludeStyles || '';
        const w = d.weirdness || applied.weirdness;
        const si = d.styleInfluence || applied.styleInfluence;
        let opts = '';
        if (w) opts += `Weirdness: ${w}%`;
        if (w && si) opts += ' | ';
        if (si) opts += `Style Influence: ${si}%`;

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;

        let content = `========================================\n`;
        content += `SUNO MASTER PRO 12 - \uB178\uB798\uC81C\uBAA9&\uAC00\uC0AC\n`;
        content += `\uC0DD\uC131\uC77C\uC2DC: ${now.toLocaleString('ko-KR')}\n`;
        content += `========================================\n\n`;
        content += `[Style Prompt]\n${prompt}\n\n`;
        if (exclude) content += `[Exclude Styles]\n${exclude}\n\n`;
        if (opts) content += `[More Options]\n${opts}\n\n`;
        content += `========================================\n`;
        content += `\uCD1D ${allTitles.length}\uAC1C \uB178\uB798\n`;
        content += `========================================\n\n`;

        allTitles.forEach((t, i) => {
            const displayTitle = getTitleWithTranslation(t);
            const data = titleLyricsMap[i];
            content += `----------------------------------------\n`;
            content += `#${i + 1}. ${displayTitle}\n`;
            content += `----------------------------------------\n\n`;
            if (data && data.meta) {
                content += `[\uBA54\uD0C0\uD0DC\uADF8 \uD3EC\uD568 \uBC84\uC804]\n${data.meta}\n\n`;
            }
            if (data && data.section) {
                content += `[\uC139\uC158 \uD0DC\uADF8\uB9CC \uBC84\uC804]\n${data.section}\n\n`;
            }
        });

        content += `========================================\nGenerated by SUNO MASTER PRO 12\n`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `SUNO_Lyrics_${dateStr}.txt`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        const b = document.getElementById('btnSaveAll'); b.innerHTML = '<span>✓</span> 저장완료!'; setTimeout(() => b.innerHTML = '<span>💾</span> 전체 저장하기', 2000);
    });

    // Suno 직접 연동 제거 — 파이프라인 방식으로 대체됨

    // 초기화
    document.getElementById('btnRetry').addEventListener('click', () => {
        Object.keys(state).forEach(k => { if (Array.isArray(state[k])) state[k] = []; else if (typeof state[k] === 'object') state[k] = null; else state[k] = ''; });
        state.titleCount = 5; state.sectionLyrics = {}; state.generations = [];
        step2Initialized = false; lockedTitles = [];
        document.querySelectorAll('.toggle-btn.active').forEach(b => b.classList.remove('active'));
        document.getElementById('loadedPromptPreview').style.display = 'none';
        document.getElementById('titlesResult').style.display = 'none';
        document.getElementById('storyInput').value = '';
        document.getElementById('referenceInput').value = '';
        goToStep(1);
    });
    document.getElementById('btnHome').addEventListener('click', () => { window.location.href = 'index.html'; });

    // 글자/다크모드
    const tsp = document.getElementById('textSizePopup');
    document.getElementById('btnTextSize').addEventListener('click', () => tsp.classList.add('active'));
    document.getElementById('closeTextSize').addEventListener('click', () => tsp.classList.remove('active'));
    tsp.addEventListener('click', (e) => { if (e.target === tsp) tsp.classList.remove('active'); });
    const sizeBtns = document.querySelectorAll('.size-btn');
    const ss = localStorage.getItem('suno-text-size') || 'medium';
    applyS(ss);
    sizeBtns.forEach(b => { b.addEventListener('click', () => { applyS(b.dataset.size); localStorage.setItem('suno-text-size', b.dataset.size); sizeBtns.forEach(x => x.classList.remove('active')); b.classList.add('active'); }); });
    function applyS(s) { document.body.classList.remove('text-small','text-large','text-xlarge'); if (s !== 'medium') document.body.classList.add('text-' + s); sizeBtns.forEach(b => b.classList.toggle('active', b.dataset.size === s)); }
    const bd = document.getElementById('btnDarkMode');
    if (localStorage.getItem('suno-dark-mode') === 'true') { document.body.classList.add('dark-mode'); bd.querySelector('.dark-mode-icon').textContent = '☀'; }
    bd.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); const d = document.body.classList.contains('dark-mode'); bd.querySelector('.dark-mode-icon').textContent = d ? '☀' : '☾'; localStorage.setItem('suno-dark-mode', d); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tsp.classList.remove('active'); });

    function autoResizeAll() { document.querySelectorAll('textarea').forEach(ta => { ta.classList.add('auto-resize'); ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; ta.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; }); }); }
    autoResizeAll();
    new MutationObserver(() => autoResizeAll()).observe(document.body, { childList: true, subtree: true });
    initSectionToggles();

    // === 숨기기/표시하기 토글 ===
    document.querySelectorAll('.btn-collapse-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const stepPage = btn.closest('.step-page');
            if (stepPage) {
                const isCollapsed = stepPage.classList.toggle('collapsed');
                btn.textContent = isCollapsed ? '표시하기' : '숨기기';
            }
        });
    });
});

// ============================================
// SUNO MASTER PRO 12 - 전문가 모드 JavaScript
// 최고 퀄리티 Suno v5 프롬프트 생성
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    let currentStep = 1;
    const selections = {
        freeText: '', target: [], place: [], mood: [],
        mainGenre: '', subGenre: '', key: '', timeSig: '', bpm: 110,
        vocalGender: [], vocalStyle: [], vocalRange: [],
        instruments: [], production: []
    };
    let importedPromptData = null;

    const labelMap = {
        teens: '10대', 'young-adults': '2030세대', 'middle-aged': '5060세대', seniors: '시니어세대',
        cafe: '카페', bar: '바/라운지', club: '클럽', festival: '페스티벌', gym: '헬스장', home: '집',
        office: '사무실', library: '도서관', drive: '드라이브', 'night-drive': 'Night Drive',
        walk: '산책', commute: '출퇴근', travel: '여행', cooking: '요리할때', reading: '독서',
        gaming: '게이밍', coding: '코딩', yoga: '요가', meditation: '명상', morning: '아침루틴',
        date: '데이트', 'home-party': '홈파티', alone: '혼술/혼밥',
        comfortable: '편안한', healing: '힐링', cozy: '포근한', warm: '따뜻한',
        emotional: '감성적', dreamy: '몽환적', calm: '잔잔한', lonely: '쓸쓸한',
        sentimental: '센치한', 'dawn-mood': '새벽감성', nostalgic: '그리운',
        flutter: '설레는', love: '사랑', breakup: '이별', 'feel-good': '기분좋은',
        refreshing: '상쾌한', exciting: '신나는', groovy: '흥겨운', 'tension-up': '텐션업',
        powerful: '파워풀한', confidence: '자신감', focus: '집중', immersive: '몰입',
        sleep: '잠잘때', 'sleep-aid': '수면유도', comfort: '위로', rainy: '비오는날',
        dawn: '새벽', sunset: '일몰', running: '달릴때'
    };

    const vocalGenderMap = { male: 'male vocals', female: 'female vocals', group: 'group vocals', instrumental: 'instrumental, no vocals' };
    const vocalStyleMap = { 'chest-voice': 'chest voice', 'head-voice': 'head voice', falsetto: 'falsetto', belting: 'belting', vibrato: 'vibrato', breathy: 'breathy', grit: 'grit raspy', whisper: 'whisper', rap: 'rap flow', autotune: 'auto-tuned' };
    const vocalRangeMap = { bass: 'bass range', baritone: 'baritone', tenor: 'tenor', alto: 'alto', mezzo: 'mezzo-soprano', soprano: 'soprano' };
    const instrumentMap = { piano: 'piano', 'acoustic-guitar': 'acoustic guitar', 'electric-guitar': 'electric guitar', 'bass-guitar': 'bass guitar', drums: 'drums', synth: 'synthesizer', strings: 'strings', brass: 'brass section', saxophone: 'saxophone', violin: 'violin', cello: 'cello', organ: 'organ', '808': '808 bass', 'drum-machine': 'drum machine', percussion: 'percussion', choir: 'choir harmonies', orchestra: 'full orchestra' };

    // DOM
    const freeInput = document.getElementById('freeInput');
    const btnAnalyze = document.getElementById('btnAnalyze');
    const navButtons = document.getElementById('navButtons');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');

    // === 토글 그룹 ===
    function setupToggleGroup(id, key) {
        const c = document.getElementById(id);
        if (!c) return;
        c.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                const active = c.querySelectorAll('.toggle-btn.active');
                selections[key] = Array.from(active).map(b => b.dataset.value);
            });
        });
    }
    // 단일 선택 토글 그룹 (타겟층용)
    function setupSingleToggleGroup(id, key) {
        const c = document.getElementById(id);
        if (!c) return;
        c.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                } else {
                    c.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
                const active = c.querySelectorAll('.toggle-btn.active');
                selections[key] = Array.from(active).map(b => b.dataset.value);
            });
        });
    }
    function autoActivate(id, key, value) {
        const c = document.getElementById(id);
        if (!c) return;
        const btn = c.querySelector(`[data-value="${value}"]`);
        if (btn && !btn.classList.contains('active')) btn.classList.add('active');
        const active = c.querySelectorAll('.toggle-btn.active');
        selections[key] = Array.from(active).map(b => b.dataset.value);
    }

    setupSingleToggleGroup('targetBtns', 'target');
    setupToggleGroup('placeBtns', 'place');
    setupToggleGroup('moodBtns', 'mood');
    setupToggleGroup('keyBtns', 'key');
    setupToggleGroup('timeSigBtns', 'timeSig');
    setupSingleToggleGroup('vocalGenderBtns', 'vocalGender');
    setupToggleGroup('vocalStyleBtns', 'vocalStyle');
    setupToggleGroup('vocalRangeBtns', 'vocalRange');
    setupToggleGroup('instrumentBtns', 'instruments');
    setupToggleGroup('productionBtns', 'production');

    // Key/TimeSig는 단일 선택 → selections 즉시 업데이트
    // 보컬 성별/음역대도 단일 선택 (duet/group 제외하면 남성+여성 동시 선택은 의미 없음)
    const singleSelectMap = { 'keyBtns': 'key', 'timeSigBtns': 'timeSig', 'vocalGenderBtns': 'vocalGender', 'vocalRangeBtns': 'vocalRange' };
    ['keyBtns', 'timeSigBtns', 'vocalGenderBtns', 'vocalRangeBtns'].forEach(id => {
        const c = document.getElementById(id);
        if (!c) return;
        c.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                c.querySelectorAll('.toggle-btn').forEach(b => { if (b !== btn) b.classList.remove('active'); });
                const active = c.querySelectorAll('.toggle-btn.active');
                selections[singleSelectMap[id]] = Array.from(active).map(b => b.dataset.value);
            });
        });
    });

    // BPM
    const bpmSlider = document.getElementById('bpmSlider');
    const bpmValue = document.getElementById('bpmValue');
    bpmSlider.addEventListener('input', () => { selections.bpm = parseInt(bpmSlider.value); bpmValue.textContent = bpmSlider.value + ' BPM'; });
    document.querySelectorAll('.bpm-preset').forEach(btn => {
        btn.addEventListener('click', () => { const b = parseInt(btn.dataset.bpm); bpmSlider.value = b; selections.bpm = b; bpmValue.textContent = b + ' BPM'; });
    });

    // === 장르 클릭형 드롭다운 ===
    function setupGenreClickDropdown(triggerId, filterId, dropdownId, displayId, selKey) {
        const trigger = document.getElementById(triggerId);
        const filter = document.getElementById(filterId);
        const dropdown = document.getElementById(dropdownId);
        let isOpen = false;

        // 대분류별 그룹핑
        const grouped = {};
        GENRE_DATABASE.forEach(g => {
            if (!grouped[g.main]) grouped[g.main] = [];
            grouped[g.main].push(g);
        });

        function renderDropdown(query) {
            dropdown.innerHTML = '';
            const q = (query || '').toLowerCase();
            for (const [mainCat, genres] of Object.entries(grouped)) {
                const filtered = q ? genres.filter(g =>
                    g.genre.toLowerCase().includes(q) || g.main.toLowerCase().includes(q) || (g.sub || '').toLowerCase().includes(q)
                ) : genres;
                if (filtered.length === 0) continue;

                const header = document.createElement('div');
                header.className = 'genre-dropdown-header';
                header.textContent = mainCat;
                dropdown.appendChild(header);

                filtered.forEach(g => {
                    const item = document.createElement('div');
                    item.className = 'genre-dropdown-item';
                    item.dataset.genre = g.genre;
                    item.innerHTML = `<strong>${g.genre}</strong> <span class="genre-dd-main">${g.sub || ''}</span>`;
                    item.addEventListener('click', () => {
                        selections[selKey] = g.genre;
                        renderSelectedGenre(displayId, selKey, g.genre);
                        trigger.textContent = g.genre + ' \u2714';
                        closeDropdown();
                    });
                    dropdown.appendChild(item);
                });
            }
        }

        function openDropdown() {
            isOpen = true;
            trigger.classList.add('open');
            filter.style.display = 'block';
            filter.value = '';
            filter.focus();
            renderDropdown('');
            dropdown.classList.add('active');
        }

        function closeDropdown() {
            isOpen = false;
            trigger.classList.remove('open');
            filter.style.display = 'none';
            dropdown.classList.remove('active');
        }

        trigger.addEventListener('click', () => { isOpen ? closeDropdown() : openDropdown(); });
        filter.addEventListener('input', () => renderDropdown(filter.value));
        document.addEventListener('click', (e) => {
            if (isOpen && !trigger.contains(e.target) && !filter.contains(e.target) && !dropdown.contains(e.target)) closeDropdown();
        });
    }

    function renderSelectedGenre(displayId, selKey, name) {
        const display = document.getElementById(displayId);
        const isMain = selKey === 'mainGenre';
        display.innerHTML = name ? `<span class="selected-genre-tag ${isMain ? 'main-tag' : 'sub-tag'}">${isMain ? '\u2B50' : '\uD83C\uDFA8'} ${name} <button class="genre-remove-btn" onclick="this.parentElement.remove(); window._proSelections.${selKey}=''; document.getElementById('${isMain ? 'mainGenreTrigger' : 'subGenreTrigger'}').textContent='\uD074\uB9AD\uD558\uC5EC ${isMain ? '\uBA54\uC778' : '\uC11C\uBE0C'} \uC7A5\uB974 \uC120\uD0DD \u25BC';">\u00D7</button></span>` : '';
    }
    window._proSelections = selections;

    setupGenreClickDropdown('mainGenreTrigger', 'mainGenreFilter', 'mainGenreDropdown', 'mainGenreDisplay', 'mainGenre');
    setupGenreClickDropdown('subGenreTrigger', 'subGenreFilter', 'subGenreDropdown', 'subGenreDisplay', 'subGenre');

    // === 악기 드롭다운 추가 ===
    const extraInstruments = [
        { name: 'harmonica', label: '하모니카' }, { name: 'ukulele', label: '우쿨렐레' },
        { name: 'banjo', label: '밴조' }, { name: 'mandolin', label: '만돌린' },
        { name: 'harp', label: '하프' }, { name: 'accordion', label: '아코디언' },
        { name: 'trumpet', label: '트럼펫' }, { name: 'trombone', label: '트롬본' },
        { name: 'french horn', label: '프렌치 호른' }, { name: 'clarinet', label: '클라리넷' },
        { name: 'oboe', label: '오보에' }, { name: 'bassoon', label: '바순' },
        { name: 'sitar', label: '시타르' }, { name: 'tabla', label: '타블라' },
        { name: 'erhu', label: '얼후 (이호)' }, { name: 'kalimba', label: '칼림바' },
        { name: 'steel drums', label: '스틸 드럼' }, { name: 'marimba', label: '마림바' },
        { name: 'xylophone', label: '실로폰' }, { name: 'glockenspiel', label: '글로켄슈필' },
        { name: 'wind chimes', label: '윈드 차임' }, { name: 'singing bowls', label: '싱잉볼' },
        { name: 'electric piano', label: '일렉트릭 피아노' }, { name: 'rhodes', label: '로즈 피아노' },
        { name: 'clavinet', label: '클라비넷' }, { name: 'mellotron', label: '멜로트론' },
        { name: 'vocoder', label: '보코더' }, { name: 'theremin', label: '테레민' },
        { name: 'arpeggiator', label: '아르페지에이터' }, { name: 'pad synth', label: '패드 신스' },
        { name: 'lead synth', label: '리드 신스' }, { name: 'sub bass', label: '서브 베이스' },
        { name: 'slap bass', label: '슬랩 베이스' }, { name: 'fingerstyle guitar', label: '핑거스타일 기타' },
        { name: 'wah guitar', label: '와 기타' }, { name: 'distorted guitar', label: '디스토션 기타' },
        { name: 'hi-hats', label: '하이햇' }, { name: 'snare', label: '스네어' },
        { name: 'kick drum', label: '킥 드럼' }, { name: 'tom drums', label: '톰' },
        { name: 'claps', label: '클랩' }, { name: 'tambourine', label: '탬버린' },
        { name: 'shaker', label: '셰이커' }, { name: 'cowbell', label: '카우벨' },
        { name: 'congas', label: '콩가' }, { name: 'bongos', label: '봉고' }
    ];

    (function setupInstrumentDropdown() {
        const trigger = document.getElementById('instrumentAddTrigger');
        const filter = document.getElementById('instrumentAddFilter');
        const dropdown = document.getElementById('instrumentAddDropdown');
        let isOpen = false;

        function renderList(query) {
            dropdown.innerHTML = '';
            const q = (query || '').toLowerCase();
            const filtered = q ? extraInstruments.filter(i => i.name.includes(q) || i.label.includes(q)) : extraInstruments;
            filtered.forEach(instr => {
                const item = document.createElement('div');
                item.className = 'genre-dropdown-item';
                item.innerHTML = `<strong>${instr.label}</strong> <span class="genre-dd-main">${instr.name}</span>`;
                item.addEventListener('click', () => {
                    // 기존 버튼 그리드에 추가
                    instrumentMap[instr.name] = instr.name;
                    const grid = document.getElementById('instrumentBtns');
                    // 이미 있는지 체크
                    if (grid.querySelector(`[data-value="${instr.name}"]`)) { closeDD(); return; }
                    const btn = document.createElement('button');
                    btn.className = 'toggle-btn active';
                    btn.dataset.value = instr.name;
                    btn.textContent = instr.label;
                    btn.addEventListener('click', () => {
                        btn.classList.toggle('active');
                        const a = grid.querySelectorAll('.toggle-btn.active');
                        selections.instruments = Array.from(a).map(b => b.dataset.value);
                    });
                    grid.appendChild(btn);
                    selections.instruments.push(instr.name);
                    closeDD();
                });
                dropdown.appendChild(item);
            });
        }

        function openDD() { isOpen = true; trigger.classList.add('open'); filter.style.display = 'block'; filter.value = ''; filter.focus(); renderList(''); dropdown.classList.add('active'); }
        function closeDD() { isOpen = false; trigger.classList.remove('open'); filter.style.display = 'none'; dropdown.classList.remove('active'); }

        trigger.addEventListener('click', () => { isOpen ? closeDD() : openDD(); });
        filter.addEventListener('input', () => renderList(filter.value));
        document.addEventListener('click', (e) => { if (isOpen && !trigger.contains(e.target) && !filter.contains(e.target) && !dropdown.contains(e.target)) closeDD(); });
    })();

    // === 자유 입력 ===
    freeInput.addEventListener('input', () => {
        document.getElementById('charCount').textContent = freeInput.value.length + '\uC790';
        btnAnalyze.disabled = freeInput.value.trim().length === 0;
    });
    document.getElementById('btnClearInput').addEventListener('click', () => { freeInput.value = ''; document.getElementById('charCount').textContent = '0\uC790'; btnAnalyze.disabled = true; });
    btnAnalyze.addEventListener('click', () => { selections.freeText = freeInput.value.trim(); goToStep(2); });

    // === 단계 이동 ===
    function goToStep(step) {
        document.querySelectorAll('.step-page').forEach(p => p.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');
        document.querySelectorAll('.step-item').forEach((item, i) => { const n = i + 1; item.classList.remove('active', 'done'); if (n < step) item.classList.add('done'); else if (n === step) item.classList.add('active'); });
        document.querySelectorAll('.step-line').forEach((line, i) => line.classList.toggle('done', i < step - 1));

        if (step === 1) { navButtons.style.display = 'none'; }
        else if (step === 2) { navButtons.style.display = 'flex'; btnPrev.style.visibility = 'visible'; showAnalysis(); }
        else { navButtons.style.display = 'none'; buildFinalPrompt(); }
        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    btnPrev.addEventListener('click', () => { if (currentStep > 1) goToStep(currentStep - 1); });
    btnNext.addEventListener('click', () => { if (currentStep === 2) goToStep(3); });
    document.getElementById('btnPrevStep').addEventListener('click', () => goToStep(2));


    // === 분석 ===
    let analysisInitialized = false;
    function showAnalysis() {
        document.getElementById('originalInput').textContent = '\uD83D\uDCDD \uC785\uB825: ' + selections.freeText;
        // 이미 분석한 적 있으면 기존 선택 유지
        if (analysisInitialized) return;
        analysisInitialized = true;

        const text = selections.freeText.toLowerCase();
        document.querySelectorAll('.toggle-btn.active').forEach(b => b.classList.remove('active'));

        // === 타겟층 ===
        const targetKw = { 'teens': ['10대','학생','teen','teenager','청소년'], 'young-adults': ['20대','30대','2030','청년','young','대학','직장인'], 'middle-aged': ['50대','60대','5060','중년','중장년','부모'], 'seniors': ['시니어','70대','80대','할머니','할아버지','노인','senior','어르신'] };
        autoSelect('targetBtns', 'target', targetKw, text);

        // === 장소/활동 ===
        const placeKw = { 'cafe': ['카페','커피','cafe','coffee'], 'bar': ['바','라운지','bar','lounge','펍'], 'club': ['클럽','club','나이트'], 'festival': ['페스티벌','festival','축제'], 'gym': ['헬스','운동','gym','workout','헬스장'], 'home': ['집','home','거실','방'], 'office': ['사무실','office','회사'], 'library': ['도서관','library','독서실'], 'drive': ['드라이브','운전','drive','자동차'], 'night-drive': ['나이트드라이브','night drive','새벽드라이브','야간운전'], 'walk': ['산책','걷기','walk'], 'commute': ['출퇴근','통근','commute','지하철'], 'travel': ['여행','travel','트립'], 'cooking': ['요리','cooking','주방','밥'], 'cleaning': ['청소','cleaning'], 'reading': ['독서','책','reading'], 'gaming': ['게임','gaming','게이밍'], 'coding': ['코딩','개발','coding','프로그래밍','작업'], 'yoga': ['요가','yoga'], 'meditation': ['명상','meditation'], 'morning': ['아침','morning','모닝'], 'date': ['데이트','date','연인','커플'], 'home-party': ['홈파티','파티','home party'], 'alone': ['혼술','혼밥','혼자','alone'] };
        autoSelect('placeBtns', 'place', placeKw, text);

        // === 분위기 ===
        const moodKw = { 'comfortable': ['편안','릴렉스','relaxing'], 'healing': ['힐링','치유','healing'], 'cozy': ['포근','cozy'], 'warm': ['따뜻','warm'], 'emotional': ['감성','감동','서정','emotional'], 'dreamy': ['몽환','꿈같','dreamy'], 'calm': ['잔잔','평화','고요','차분','calm'], 'lonely': ['쓸쓸','외로','lonely'], 'sentimental': ['센치','센티','sentimental'], 'dawn-mood': ['새벽감성'], 'nostalgic': ['그리운','추억','향수','nostalgic'], 'flutter': ['설레','두근','flutter'], 'love': ['사랑','러브','love','로맨스'], 'breakup': ['이별','헤어','breakup','슬픈','눈물'], 'feel-good': ['기분좋','즐거','feel good','기분이좋'], 'refreshing': ['상쾌','시원','refreshing'], 'exciting': ['신나','활기','밝은','exciting','경쾌'], 'groovy': ['그루브','그루비','groove','groovy'], 'tension-up': ['텐션','열정','tension'], 'powerful': ['파워','강렬','힘찬','powerful','폭발'], 'confidence': ['자신감','당당','confidence'], 'focus': ['집중','focus'], 'immersive': ['몰입','immersive'], 'sleep': ['잠','수면','자장가','sleep','재울때'], 'sleep-aid': ['수면유도','sleep aid'], 'comfort': ['위로','위안','comfort'], 'stress-relief': ['스트레스','해소','stress'], 'rainy': ['비','비오는','rainy','빗소리'], 'snowy': ['눈','눈오는','snowy'], 'dawn': ['새벽','dawn'], 'sunset': ['일몰','노을','sunset','해질녘'], 'running': ['달리','러닝','조깅','running'] };
        autoSelect('moodBtns', 'mood', moodKw, text);

        // === 보컬 성별 ===
        const vgKw = { 'male': ['남성','남자','male','형','오빠'], 'female': ['여성','여자','female','누나','언니'], 'duet': ['듀엣','듀오','duet'], 'group': ['그룹','합창','group'], 'instrumental': ['연주','무보컬','bgm','배경음악','instrumental','no vocal'] };
        autoSelect('vocalGenderBtns', 'vocalGender', vgKw, text);

        // === 보컬 스타일 ===
        const vsKw = { 'chest-voice': ['자연스러운','자연 목소리'], 'breathy': ['부드러운','숨소리','soft','나른','따뜻한 목소리','breathy'], 'belting': ['파워','힘찬','고음 폭발','belting','시원한 고음'], 'falsetto': ['가성','falsetto','하이톤'], 'vibrato': ['비브라토','떨림','vibrato'], 'grit': ['허스키','거친','탁한','raspy','grit','쉰'], 'whisper': ['속삭','whisper','조용한 목소리'], 'rap': ['랩','rap','힙합','래퍼'], 'autotune': ['오토튠','autotune','기계음'] };
        autoSelect('vocalStyleBtns', 'vocalStyle', vsKw, text);

        // === 악기 ===
        const instrKw = { 'piano': ['피아노','piano','건반'], 'acoustic-guitar': ['어쿠스틱','통기타','기타','acoustic guitar'], 'electric-guitar': ['일렉기타','electric guitar','전기기타'], 'bass-guitar': ['베이스기타','bass guitar'], 'drums': ['드럼','drums','비트'], 'synth': ['신디','synth','신스','전자음','신디사이저'], 'strings': ['스트링','현악','strings'], 'brass': ['관악','브라스','brass','트럼펫'], 'saxophone': ['색소폰','sax','saxophone'], 'violin': ['바이올린','violin'], 'cello': ['첼로','cello'], 'organ': ['오르간','organ'], '808': ['808'], 'drum-machine': ['드럼머신','drum machine'], 'percussion': ['퍼커션','타악기','percussion'], 'choir': ['합창','코러스','choir'], 'orchestra': ['오케스트라','orchestra','관현악'] };
        autoSelect('instrumentBtns', 'instruments', instrKw, text);

        // === 프로덕션 ===
        const prodKw = { 'tape saturation': ['테이프','tape','아날로그','analog'], 'plate reverb': ['플레이트','plate reverb'], 'room reverb': ['룸 리버브','room reverb'], 'hall reverb': ['홀 리버브','hall reverb','웅장한 울림'], 'dry and direct': ['드라이','dry','리버브 없'], 'vinyl crackle': ['바이닐','vinyl','lp','레코드'], 'lo-fi texture': ['로파이','lo-fi','lo fi','저음질'], 'clean vocal upfront': ['보컬 전면','clean vocal','깨끗한 보컬'], 'wide stereo': ['와이드','wide stereo','넓은'], 'sidechain pump': ['사이드체인','sidechain','펌핑'], 'analog warmth': ['아날로그 따뜻','analog warmth'], 'crisp highs': ['선명한 고음','crisp'], 'deep sub bass': ['서브 베이스','sub bass','깊은 베이스'], 'gated reverb': ['게이트 리버브','gated reverb','80년대'] };
        autoSelect('productionBtns', 'production', prodKw, text);

        // === 장르 자동 감지 ===
        const genreKw = {};
        GENRE_DATABASE.forEach(g => { genreKw[g.genre] = [g.genre.toLowerCase()]; });
        // 한글 장르명도 추가
        const korGenreMap = { '팝': 'Mainstream Pop', '발라드': 'Pop Ballad', '록': 'Classic Rock', '힙합': 'Boom Bap', '재즈': 'Smooth Jazz', '클래식': 'Classical', '일렉트로닉': 'House', '하우스': 'House', '펑크': 'Funk', '컨트리': 'Classic Country', '블루스': 'Blues', '소울': 'Soul', '알앤비': 'Contemporary R&B', 'r&b': 'Contemporary R&B', '레게': 'Reggae', '라틴': 'Reggaeton', '보사노바': 'Bossa Nova', '케이팝': 'K-Pop', 'k-pop': 'K-Pop', '인디': 'Indie Pop', '어쿠스틱': 'Acoustic Pop', '로파이': 'Lo-fi Hip Hop', 'lo-fi': 'Lo-fi Hip Hop', '트랩': 'Trap', '트랜스': 'Trance', '메탈': 'Metal', '디스코': 'Disco', '앰비언트': 'New Age', '뉴에이지': 'New Age', '시티팝': 'City Pop', '신스팝': 'Synth Pop' };

        let detectedGenre = '';
        // 영어 장르명 직접 감지
        GENRE_DATABASE.forEach(g => { if (text.includes(g.genre.toLowerCase())) { if (!detectedGenre || g.genre.length > detectedGenre.length) detectedGenre = g.genre; } });
        // 한글 장르명 감지
        if (!detectedGenre) {
            for (const [kor, eng] of Object.entries(korGenreMap)) { if (text.includes(kor)) { detectedGenre = eng; break; } }
        }
        if (detectedGenre) {
            selections.mainGenre = detectedGenre;
            renderSelectedGenre('mainGenreDisplay', 'mainGenre', detectedGenre);
        }

        // === 기본값 ===
        if (!selections.target.length) autoActivate('targetBtns', 'target', 'young-adults');
        if (!selections.place.length) autoActivate('placeBtns', 'place', 'home');
        if (!selections.mood.length) autoActivate('moodBtns', 'mood', 'feel-good');
        if (!selections.vocalGender.length) autoActivate('vocalGenderBtns', 'vocalGender', 'female');
        if (!selections.vocalStyle.length) autoActivate('vocalStyleBtns', 'vocalStyle', 'breathy');
        if (!selections.instruments.length) { autoActivate('instrumentBtns', 'instruments', 'piano'); autoActivate('instrumentBtns', 'instruments', 'drums'); }

        // 음역대 자동 추정
        if (!selections.vocalRange.length) {
            if (selections.vocalGender.includes('male')) autoActivate('vocalRangeBtns', 'vocalRange', 'baritone');
            else autoActivate('vocalRangeBtns', 'vocalRange', 'mezzo');
        }

        // === BPM 자동 추정 ===
        const bpmMatch = text.match(/(\d{2,3})\s*bpm/i);
        if (bpmMatch) { const b = parseInt(bpmMatch[1]); bpmSlider.value = b; selections.bpm = b; bpmValue.textContent = b + ' BPM'; }
        else {
            let b = 110;
            if (selections.mood.some(m => ['sleep','sleep-aid','calm','comfortable','healing'].includes(m))) b = 70;
            else if (selections.mood.some(m => ['emotional','love','breakup','lonely','comfort','warm'].includes(m))) b = 80;
            else if (selections.mood.some(m => ['nostalgic','cozy','rainy','sunset'].includes(m))) b = 90;
            else if (selections.mood.some(m => ['feel-good','refreshing','flutter'].includes(m))) b = 110;
            else if (selections.mood.some(m => ['exciting','groovy','confidence'].includes(m))) b = 120;
            else if (selections.mood.some(m => ['tension-up','running'].includes(m))) b = 135;
            else if (selections.mood.some(m => ['powerful','anger'].includes(m))) b = 145;
            bpmSlider.value = b; selections.bpm = b; bpmValue.textContent = b + ' BPM';
        }

        // === 조성/박자 자동 감지 ===
        const keyMatch = text.match(/([A-G][b#]?)\s*(major|minor)/i);
        if (keyMatch) autoActivate('keyBtns', 'key', keyMatch[0]);
        else {
            // 분위기 기반 조성 자동 추천
            if (selections.mood.some(m => ['calm','healing','comfortable','warm','cozy'].includes(m))) autoActivate('keyBtns', 'key', 'C major');
            else if (selections.mood.some(m => ['emotional','lonely','breakup','sentimental','dawn-mood'].includes(m))) autoActivate('keyBtns', 'key', 'A minor');
            else if (selections.mood.some(m => ['exciting','feel-good','confidence'].includes(m))) autoActivate('keyBtns', 'key', 'G major');
            else if (selections.mood.some(m => ['dreamy','nostalgic','sunset'].includes(m))) autoActivate('keyBtns', 'key', 'D minor');
            else if (selections.mood.some(m => ['powerful','tension-up','anger'].includes(m))) autoActivate('keyBtns', 'key', 'E minor');
        }

        const tsMatch = text.match(/([2-7]\/[4-8])/);
        if (tsMatch) autoActivate('timeSigBtns', 'timeSig', tsMatch[1]);
        else {
            // 장르/분위기 기반 박자 자동 추천
            if (selections.mood.some(m => ['calm','healing','sleep','dreamy'].includes(m)) || detectedGenre.includes('Ballad')) {
                autoActivate('timeSigBtns', 'timeSig', '6/8');
            } else {
                autoActivate('timeSigBtns', 'timeSig', '4/4');
            }
        }

        // 프로덕션 기본값
        if (!selections.production.length) {
            if (selections.mood.some(m => ['calm','healing','comfortable','warm'].includes(m))) {
                autoActivate('productionBtns', 'production', 'plate reverb');
                autoActivate('productionBtns', 'production', 'clean vocal upfront');
            } else if (selections.mood.some(m => ['exciting','groovy','tension-up'].includes(m))) {
                autoActivate('productionBtns', 'production', 'crisp highs');
                autoActivate('productionBtns', 'production', 'wide stereo');
            } else {
                autoActivate('productionBtns', 'production', 'clean vocal upfront');
            }
        }
    }

    function autoSelect(containerId, selKey, keywordMap, text) {
        const container = document.getElementById(containerId);
        if (!container) return;
        for (const [value, keywords] of Object.entries(keywordMap)) {
            if (keywords.some(kw => text.includes(kw))) {
                const btn = container.querySelector(`[data-value="${value}"]`);
                if (btn) btn.classList.add('active');
            }
        }
        const active = container.querySelectorAll('.toggle-btn.active');
        selections[selKey] = Array.from(active).map(b => b.dataset.value);
    }

    // === 최종 프롬프트 생성 ===
    let generatedExcludeBase = '', userExcludeTags = [];

    function buildFinalPrompt() {
        // 장르
        const mainG = selections.mainGenre || 'Pop';
        const subG = selections.subGenre || '';
        const mainData = GENRE_DATABASE.find(g => g.genre === mainG) || { genre: mainG, main: '', sub: '', instruments: '', vocal: '', bpm: '100-120', desc: '' };
        const subData = subG ? (GENRE_DATABASE.find(g => g.genre === subG) || null) : null;

        // v5 최적화: 서술형 분위기 문장
        const moodSentences = selections.mood.slice(0, 2).map(m => MOOD_SENTENCE_MAP[m]).filter(Boolean);

        // 보컬 조합
        const vocalParts = [];
        selections.vocalGender.forEach(v => vocalParts.push(vocalGenderMap[v]));
        selections.vocalRange.forEach(v => vocalParts.push(vocalRangeMap[v]));
        selections.vocalStyle.forEach(v => vocalParts.push(vocalStyleMap[v]));
        const instrParts = selections.instruments.map(i => instrumentMap[i] || i);

        // v5 최적 순서: 장르 → BPM+조성+박자 → 감정서술 → 악기 → 보컬4요소 → 구조 → 프로덕션 → 메타태그 → 품질보호
        const promptParts = [];

        // ① 장르 (프론트로드)
        promptParts.push(mainG);
        if (subG) promptParts.push(`${subG} elements`);

        // ② BPM + 조성 + 박자
        let techLine = `${selections.bpm} BPM`;
        if (selections.key.length) techLine += `, ${selections.key[0]}`;
        if (selections.timeSig.length) techLine += `, ${selections.timeSig[0]} time`;
        promptParts.push(techLine);

        // ③ 감정 서술형 문장 (v5 핵심)
        if (moodSentences[0]) promptParts.push(moodSentences[0]);

        // ④ 악기 (2~4개)
        if (instrParts.length) promptParts.push(instrParts.slice(0, 4).join(', '));

        // ⑤ 보컬 4요소
        if (vocalParts.length) promptParts.push(vocalParts.slice(0, 4).join(', '));

        // ⑥ 프로덕션 노트
        if (selections.production.length) promptParts.push(selections.production.slice(0, 3).join(', '));

        // ⑧ 두 번째 분위기 (공간 있으면)
        if (moodSentences[1]) promptParts.push(moodSentences[1]);

        // ⑨ 품질 보호 블록 (마지막 = 프론트로드)
        promptParts.push('professional studio quality, clean and polished production, consistent tonal balance, radio-ready sound');

        // 950자 제한 적용
        let sp = promptParts.join(', ');
        if (sp.length > 950) {
            // 축소: 프로덕션/메타태그/두번째 분위기 제거
            const coreParts = [mainG];
            if (subG) coreParts.push(`${subG} elements`);
            coreParts.push(techLine);
            if (moodSentences[0]) coreParts.push(moodSentences[0]);
            if (instrParts.length) coreParts.push(instrParts.slice(0, 3).join(', '));
            if (vocalParts.length) coreParts.push(vocalParts.slice(0, 3).join(', '));
            coreParts.push('professional studio quality, clean production, radio-ready sound');
            sp = coreParts.join(', ');
            if (sp.length > 950) sp = sp.substring(0, 947) + '...';
        }

        document.getElementById('stylePromptText').value = sp;

        // 한국어 설명
        const moodKor = selections.mood.map(v => labelMap[v]).filter(Boolean);
        const instrKor = instrParts;
        const mainGData = GENRE_DATABASE.find(g => g.genre === mainG);
        const subGData = subG ? GENRE_DATABASE.find(g => g.genre === subG) : null;
        let explanation = `▶ 장르: "${mainG}"(메인)`;
        if (subG) explanation += ` + "${subG}"(블렌딩) 혼합`;
        let descText = '';
        if (mainGData && mainGData.desc) descText += mainGData.desc;
        if (subGData && subGData.desc) descText += ' ' + subGData.desc;
        if (descText) explanation += `\n▶ 설명: ${descText}`;
        explanation += `\n▶ 타겟층: ${selections.target.map(v => labelMap[v]).join(', ')}`;
        explanation += `\n\u25B6 장소: ${selections.place.map(v => labelMap[v]).join(', ')}`;
        explanation += `\n\u25B6 분위기: ${moodKor.join(', ')}`;
        explanation += `\n\u25B6 템포: ${selections.bpm} BPM`;
        if (selections.key.length) explanation += ` | 조성: ${selections.key[0]}`;
        if (selections.timeSig.length) explanation += ` | 박자: ${selections.timeSig[0]}`;
        if (selections.production.length) explanation += `\n\u25B6 프로덕션: ${selections.production.join(', ')}`;
        document.getElementById('promptExplanation').textContent = explanation;

        // Style Prompt 한국어 번역
        let korHtml = '\uD83D\uDCCC <strong>\uD55C\uAD6D\uC5B4 \uBC88\uC5ED:</strong><br>';
        korHtml += `• 장르: "${mainG}"(메인)${subG ? ' + "' + subG + '"(블렌딩) 혼합' : ''}<br>`;
        if (descText) korHtml += `• 설명: ${descText}<br>`;
        korHtml += `• 템포: ${selections.bpm} BPM`;
        if (selections.key.length) korHtml += ` | 조성: ${selections.key[0]}`;
        if (selections.timeSig.length) korHtml += ` | 박자: ${selections.timeSig[0]}`;
        korHtml += '<br>';
        korHtml += `\u2022 분위기: ${moodKor.join(', ')}<br>`;
        if (instrParts.length) korHtml += `\u2022 악기: ${instrParts.join(', ')}<br>`;
        if (vocalParts.length) korHtml += `\u2022 보컬: ${vocalParts.join(', ')}<br>`;
        if (selections.production.length) korHtml += `\u2022 프로덕션: ${selections.production.join(', ')}<br>`;
        korHtml += '\u2022 품질: 프로페셔널 스튜디오 품질, 라디오 방송 수준';
        document.getElementById('stylePromptKor').innerHTML = korHtml;

        // Exclude Styles
        const result = generatePrompt([mainG, subG].filter(Boolean), selections.target, selections.place, selections.mood);
        generatedExcludeBase = result.excludeStyles;
        userExcludeTags = [];
        document.getElementById('excludeStylesText').value = result.excludeStyles;
        document.getElementById('excludeStylesKor').innerHTML = buildExcludeKorDesc(result.excludeStyles);

        // More Options
        const moreOpt = getMoreOptions(mainData, subData, selections.mood, sp);
        document.getElementById('weirdnessFill').style.width = moreOpt.weirdness + '%';
        document.getElementById('weirdnessValue').textContent = moreOpt.weirdness + '%';
        document.getElementById('styleInfluenceFill').style.width = moreOpt.styleInfluence + '%';
        document.getElementById('styleInfluenceValue').textContent = moreOpt.styleInfluence + '%';

        initExcludeToggles();

        // === v5 Plan-and-Execute 검증 ===
        const maxIterations = 3;
        let finalPrompt = sp;
        let score = 0;
        let checks = [];

        for (let i = 0; i < maxIterations; i++) {
            const validation = validateV5Prompt(finalPrompt, selections);
            score = validation.score;
            checks = validation.checks;

            if (score >= 90) break; // 90% 이상이면 통과

            // 실패 항목 자동 수정
            finalPrompt = autoFixPrompt(finalPrompt, validation.checks, selections);
        }

        // 최종 프롬프트 반영
        document.getElementById('stylePromptText').value = finalPrompt;

        // 검증 결과 UI 표시
        renderV5Score(score, checks);

        // 글자수 업데이트
        explanation += `\n\u25B6 \uAE00\uC790\uC218: ${finalPrompt.length} / 950\uC790 | v5 \uC778\uC2DD\uB960: ${score}%`;
        document.getElementById('promptExplanation').textContent = explanation;

        autoSaveToLibrary(finalPrompt, result, moreOpt);
    }

    // === v5 검증 체크리스트 ===
    function validateV5Prompt(prompt, sel) {
        const checks = [];
        let passed = 0;
        const total = 10;

        // 1. 장르 1~2개
        const genreCount = [sel.mainGenre, sel.subGenre].filter(Boolean).length;
        const c1 = genreCount >= 1 && genreCount <= 2;
        checks.push({ name: '\uC7A5\uB974 1~2\uAC1C', pass: c1, detail: c1 ? `${genreCount}\uAC1C \uC801\uC6A9` : '\uC7A5\uB974 \uC5C6\uC74C' });
        if (c1) passed++;

        // 2. BPM 명시
        const c2 = /\d+\s*BPM/i.test(prompt);
        checks.push({ name: 'BPM \uBA85\uC2DC', pass: c2, detail: c2 ? '\u2713' : 'BPM \uC5C6\uC74C' });
        if (c2) passed++;

        // 3. 조성 명시
        const c3 = /[A-G][b#]?\s*(major|minor)/i.test(prompt);
        checks.push({ name: '\uC870\uC131(Key) \uBA85\uC2DC', pass: c3, detail: c3 ? '\u2713' : '\uC870\uC131 \uC5C6\uC74C' });
        if (c3) passed++;

        // 4. 감정 서술형 문장
        const c4 = prompt.length > 80 && /like |as if |the |a |an /i.test(prompt);
        checks.push({ name: '\uAC10\uC815 \uC11C\uC220\uD615 \uBB38\uC7A5', pass: c4, detail: c4 ? '\u2713' : '\uB2E8\uC5B4 \uB098\uC5F4 \uBC29\uC2DD' });
        if (c4) passed++;

        // 5. 악기 2~4개
        const instrWords = ['piano','guitar','bass','drums','synth','strings','brass','saxophone','violin','cello','organ','percussion','orchestra','808','flute','harmonica','ukulele'];
        const instrCount = instrWords.filter(w => prompt.toLowerCase().includes(w)).length;
        const c5 = instrCount >= 2 && instrCount <= 6;
        checks.push({ name: '\uC545\uAE30 2~4\uAC1C', pass: c5, detail: `${instrCount}\uAC1C \uAC10\uC9C0` });
        if (c5) passed++;

        // 6. 보컬 4요소 (성별+음역+톤+창법)
        const vocalWords = ['male','female','vocal','baritone','tenor','soprano','alto','mezzo','breathy','belting','falsetto','grit','whisper','rap','chest voice'];
        const vocalCount = vocalWords.filter(w => prompt.toLowerCase().includes(w)).length;
        const c6 = vocalCount >= 2;
        checks.push({ name: '\uBCF4\uCEEC \uC694\uC18C \uD3EC\uD568', pass: c6, detail: `${vocalCount}\uAC1C \uAC10\uC9C0` });
        if (c6) passed++;

        // 7. 상충 태그 없음
        const hasConflict = (prompt.includes('sad') && prompt.includes('upbeat')) ||
                           (prompt.includes('sleepy') && prompt.includes('energetic')) ||
                           (prompt.includes('calm') && prompt.includes('aggressive'));
        const c7 = !hasConflict;
        checks.push({ name: '\uC0C1\uCDA9 \uD0DC\uADF8 \uC5C6\uC74C', pass: c7, detail: c7 ? '\u2713' : '\uCDA9\uB3CC \uBC1C\uACAC' });
        if (c7) passed++;

        // 8. 품질 보호 블록
        const c8 = prompt.toLowerCase().includes('professional studio') || prompt.toLowerCase().includes('radio-ready');
        checks.push({ name: '\uD488\uC9C8 \uBCF4\uD638 \uBE14\uB85D', pass: c8, detail: c8 ? '\u2713' : '\uD488\uC9C8 \uBCF4\uD638 \uC5C6\uC74C' });
        if (c8) passed++;

        // 9. 950자 이하
        const c9 = prompt.length <= 950;
        checks.push({ name: '950\uC790 \uC774\uD558', pass: c9, detail: `${prompt.length}\uC790` });
        if (c9) passed++;

        // 10. 프론트로드 (장르가 앞에)
        const firstWord = prompt.split(',')[0].trim();
        const c10 = GENRE_DATABASE.some(g => firstWord.includes(g.genre)) || firstWord.length > 3;
        checks.push({ name: '\uC7A5\uB974 \uD504\uB860\uD2B8\uB85C\uB4DC', pass: c10, detail: c10 ? '\u2713' : '\uC7A5\uB974\uAC00 \uC55E\uC5D0 \uC5C6\uC74C' });
        if (c10) passed++;

        return { score: Math.round((passed / total) * 100), checks };
    }

    // === 자동 수정 ===
    function autoFixPrompt(prompt, checks, sel) {
        let fixed = prompt;

        checks.forEach(c => {
            if (c.pass) return;

            if (c.name.includes('BPM') && !c.pass) {
                fixed = fixed.replace(/^([^,]+)/, `$1, ${sel.bpm || 110} BPM`);
            }
            if (c.name.includes('\uC870\uC131') && !c.pass && sel.key && sel.key.length) {
                fixed = fixed.replace(/BPM/, `BPM, ${sel.key[0]}`);
            }
            if (c.name.includes('\uAC10\uC815') && !c.pass) {
                const mood = sel.mood[0] || 'feel-good';
                const sentence = MOOD_SENTENCE_MAP[mood] || 'like a perfect moment captured in sound';
                fixed = fixed.replace(/BPM([^,]*)/, `BPM$1, ${sentence}`);
            }
            if (c.name.includes('\uBCF4\uCEEC') && !c.pass) {
                const hasVocal = fixed.toLowerCase().includes('vocal') || fixed.toLowerCase().includes('baritone') || fixed.toLowerCase().includes('soprano') || fixed.toLowerCase().includes('tenor') || fixed.toLowerCase().includes('breathy') || fixed.toLowerCase().includes('belting');
                if (!hasVocal) {
                    // 사용자 선택 기반 보컬 추가
                    const userVocal = [];
                    if (sel.vocalGender && sel.vocalGender.length) userVocal.push(vocalGenderMap[sel.vocalGender[0]] || 'female vocals');
                    if (sel.vocalRange && sel.vocalRange.length) userVocal.push(vocalRangeMap[sel.vocalRange[0]] || 'mezzo-soprano');
                    if (sel.vocalStyle && sel.vocalStyle.length) userVocal.push(vocalStyleMap[sel.vocalStyle[0]] || 'breathy');
                    if (userVocal.length === 0) userVocal.push('female vocals', 'mezzo-soprano', 'breathy');
                    fixed = fixed.replace(', professional', `, ${userVocal.join(', ')}, professional`);
                }
            }
            if (c.name.includes('\uD488\uC9C8') && !c.pass) {
                fixed += ', professional studio quality, clean production, radio-ready sound';
            }
            if (c.name.includes('950') && !c.pass) {
                const cut = fixed.lastIndexOf(', ', 947);
                fixed = fixed.substring(0, cut > 0 ? cut : 947);
                if (!fixed.includes('radio-ready')) fixed += ', radio-ready sound';
            }
        });

        return fixed;
    }

    // === 검증 결과 UI 렌더링 ===
    function renderV5Score(score, checks) {
        document.getElementById('v5ScoreValue').textContent = score + '%';

        const fill = document.getElementById('v5ScoreFill');
        fill.style.width = score + '%';
        fill.style.background = score >= 90 ? 'linear-gradient(90deg, #00B894, #55EFC4)' :
                                score >= 70 ? 'linear-gradient(90deg, #FDCB6E, #F39C12)' :
                                'linear-gradient(90deg, #FF6B6B, #E17055)';

        const checklist = document.getElementById('v5Checklist');
        checklist.innerHTML = checks.map(c =>
            `<div class="v5-check-item ${c.pass ? 'v5-check-pass' : 'v5-check-fail'}">
                ${c.pass ? '\u2705' : '\u274C'} ${c.name} <span style="opacity:0.7">(${c.detail})</span>
            </div>`
        ).join('');
    }

    const excludeEngToKor = { 'metal': '메탈', 'hardcore': '하드코어', 'screamo': '스크리모', 'thrash': '스래쉬', 'deathcore': '데스코어', 'industrial': '인더스트리얼', 'aggressive': '공격적인', 'distorted': '왜곡된', 'screaming': '비명', 'harsh noise': '거친 노이즈', 'heavy metal': '헤비메탈', 'ambient': '앰비언트', 'meditation': '명상', 'lullaby': '자장가', 'drone': '드론', 'spa': '스파', 'sleepy': '졸린', 'intro': '인트로', 'reverb': '리버브', 'distortion': '디스토션', 'noise': '노이즈', 'echo': '에코', 'choir': '합창', 'sound effects': '효과음', 'four-on-the-floor kick': '4비트 킥' };

    function buildExcludeKorDesc(text) {
        if (!text) return '';
        const parts = text.split(', ').filter(Boolean);
        const kor = parts.map(eng => { const k = Object.keys(excludeEngToKor).find(key => eng.toLowerCase().includes(key)); return k ? `${excludeEngToKor[k]}(${eng})` : eng; });
        return `\uD83D\uDCCC <strong>한국어 번역:</strong> ${kor.join(', ')} — 이 스타일들을 제외하면 AI가 더 정확한 음악을 만들어줍니다.`;
    }

    // Exclude 토글
    let excludeInit = false;
    function initExcludeToggles() {
        if (excludeInit) return; excludeInit = true;
        document.querySelectorAll('.exclude-tag-btn').forEach(btn => {
            const v = btn.dataset.value;
            // 이미 generatedExcludeBase에 있는 항목은 활성화 상태로 표시
            if (generatedExcludeBase) {
                const baseParts = generatedExcludeBase.split(', ').map(p => p.trim().toLowerCase());
                if (baseParts.includes(v.toLowerCase())) btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                if (btn.classList.contains('active')) { if (!userExcludeTags.includes(v)) userExcludeTags.push(v); }
                else {
                    userExcludeTags = userExcludeTags.filter(t => t !== v);
                    if (generatedExcludeBase) { const bp = generatedExcludeBase.split(', ').filter(Boolean); generatedExcludeBase = bp.filter(p => p.toLowerCase() !== v.toLowerCase()).join(', '); }
                }
                updateExclude();
            });
            btn.title = btn.dataset.kor;
        });
        document.getElementById('btnAddExclude').addEventListener('click', () => addExcl());
        document.getElementById('excludeCustomInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') addExcl(); });
    }
    function addExcl() { const i = document.getElementById('excludeCustomInput'); const v = i.value.trim().toLowerCase(); if (!v || userExcludeTags.includes(v)) { i.value = ''; return; } userExcludeTags.push(v); const g = document.querySelector('.exclude-btn-grid'); const b = document.createElement('button'); b.className = 'exclude-tag-btn active'; b.dataset.value = v; b.textContent = v; b.addEventListener('click', () => { b.classList.toggle('active'); if (b.classList.contains('active')) { if (!userExcludeTags.includes(v)) userExcludeTags.push(v); } else userExcludeTags = userExcludeTags.filter(t => t !== v); updateExclude(); }); g.appendChild(b); i.value = ''; updateExclude(); }
    function updateExclude() { const base = generatedExcludeBase ? generatedExcludeBase.split(', ').filter(Boolean) : []; const full = [...new Set([...base, ...userExcludeTags])].join(', '); document.getElementById('excludeStylesText').value = full; document.getElementById('excludeStylesKor').innerHTML = buildExcludeKorDesc(full); }

    // 복사/저장/다시만들기
    document.querySelectorAll('.btn-copy').forEach(btn => { btn.addEventListener('click', () => { const el = document.getElementById(btn.dataset.target); navigator.clipboard.writeText(el.value || el.textContent).then(() => { btn.textContent = '\u2713 복사됨!'; btn.classList.add('copied'); setTimeout(() => { btn.textContent = '복사하기'; btn.classList.remove('copied'); }, 2000); }); }); });
    document.getElementById('btnCopyAll').addEventListener('click', () => { const s = document.getElementById('stylePromptText').value; const e = document.getElementById('excludeStylesText').value; const w = document.getElementById('weirdnessValue').textContent; const si = document.getElementById('styleInfluenceValue').textContent; navigator.clipboard.writeText(`[Style Prompt]\n${s}\n\n[Exclude Styles]\n${e}\n\n[More Options]\nWeirdness: ${w}\nStyle Influence: ${si}`); const b = document.getElementById('btnCopyAll'); b.innerHTML = '<span>\u2713</span> 복사완료!'; setTimeout(() => b.innerHTML = '<span>\uD83D\uDCCB</span> 전체 복사', 2000); });
    document.getElementById('btnSaveAll').addEventListener('click', () => { const s = document.getElementById('stylePromptText').value; const e = document.getElementById('excludeStylesText').value; const w = document.getElementById('weirdnessValue').textContent; const si = document.getElementById('styleInfluenceValue').textContent; const exp = document.getElementById('promptExplanation').textContent; const now = new Date(); const d = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`; const content = `========================================\nSUNO MASTER PRO 12 - 전문가 모드\n생성일시: ${now.toLocaleString('ko-KR')}\n========================================\n\n[한국어 설명]\n${exp}\n\n========================================\n[Style Prompt]\n${s}\n\n========================================\n[Exclude Styles]\n${e}\n\n========================================\n[More Options]\nWeirdness: ${w}\nStyle Influence: ${si}\n\n========================================\n선택 정보:\n- 타겟층: ${selections.target.map(v=>labelMap[v]||v).join(', ')}\n- 장소: ${selections.place.map(v=>labelMap[v]||v).join(', ')}\n- 분위기: ${selections.mood.map(v=>labelMap[v]||v).join(', ')}\n- 장르: ${selections.mainGenre}${selections.subGenre ? ' + ' + selections.subGenre : ''}\n========================================\nGenerated by SUNO MASTER PRO 12\n`; const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `SUNO_Pro_${d}.txt`; document.body.appendChild(a); a.click(); document.body.removeChild(a); const b = document.getElementById('btnSaveAll'); b.innerHTML = '<span>\u2713</span> 저장완료!'; setTimeout(() => b.innerHTML = '<span>\uD83D\uDCBE</span> 전체 저장하기', 2000); });
    // === 적용하기 (파이프라인 저장) ===
    const btnApply = document.getElementById('btnApply');
    const btnGotoLyrics = document.getElementById('btnGotoLyrics');
    btnApply.addEventListener('click', () => {
        const style = document.getElementById('stylePromptText').value || '';
        const excludeStyles = document.getElementById('excludeStylesText').value || '';
        const weirdness = parseInt(document.getElementById('weirdnessValue').textContent) || null;
        const styleInfluence = parseInt(document.getElementById('styleInfluenceValue').textContent) || null;
        const explanation = document.getElementById('promptExplanation').textContent || '';
        if (!style.trim()) { alert('먼저 프롬프트를 생성해주세요.'); return; }
        const genreName = [selections.mainGenre, selections.subGenre].filter(Boolean).join(' + ');
        const fileName = (importedPromptData && importedPromptData.fileName ? importedPromptData.fileName : null)
            || (genreName ? genreName + ' - 전문가 모드' : null)
            || '전문가 모드 결과';
        const pipelineData = {
            stylePrompt: style, excludeStyles, weirdness, styleInfluence, explanation,
            genres: [selections.mainGenre, selections.subGenre].filter(Boolean),
            target: selections.target.slice(), place: selections.place.slice(), mood: selections.mood.slice(),
            createdAt: new Date().toISOString(), source: 'pro', fileName
        };
        localStorage.setItem('suno-pipeline-pro', JSON.stringify(pipelineData));
        const msgEl = document.getElementById('applyCompleteMsg');
        if (msgEl) { msgEl.textContent = '✅ 스타일 프롬프트 적용 완료! 다음 단계에 반영됩니다.'; msgEl.classList.add('visible'); }
        btnGotoLyrics.disabled = false;
        btnGotoLyrics.classList.add('active');
    });
    btnGotoLyrics.addEventListener('click', () => { window.location.href = 'lyrics.html'; });
    // 초기화 함수 (공통)
    function resetAll() {
        Object.keys(selections).forEach(k => { if (Array.isArray(selections[k])) selections[k] = []; else selections[k] = ''; });
        selections.bpm = 110;
        freeInput.value = '';
        bpmSlider.value = 110;
        bpmValue.textContent = '110 BPM';
        document.querySelectorAll('.toggle-btn.active').forEach(b => b.classList.remove('active'));
        document.getElementById('mainGenreDisplay').innerHTML = '';
        document.getElementById('subGenreDisplay').innerHTML = '';
        document.getElementById('mainGenreTrigger').textContent = '\uD074\uB9AD\uD558\uC5EC \uBA54\uC778 \uC7A5\uB974 \uC120\uD0DD \u25BC';
        document.getElementById('subGenreTrigger').textContent = '\uD074\uB9AD\uD558\uC5EC \uC11C\uBE0C \uC7A5\uB974 \uC120\uD0DD \u25BC';
        analysisInitialized = false;
        excludeInit = false;
        document.getElementById('charCount').textContent = '0\uC790';
        btnAnalyze.disabled = true;
        goToStep(1);
    }
    // btnRetry 제거됨 — pro.html에서 초기화 버튼 삭제
    document.getElementById('btnHome').addEventListener('click', () => { window.location.href = 'index.html'; });

    function autoSaveToLibrary(sp, result, moreOpt) {
        const K = 'suno-master-library'; let lib = []; try { lib = JSON.parse(localStorage.getItem(K)) || []; } catch {}
        lib.push({ id: 'pro_' + Date.now() + '_' + Math.random().toString(36).substr(2,6), createdAt: new Date().toISOString(), target: selections.target.map(v=>labelMap[v]||v), place: selections.place.map(v=>labelMap[v]||v), mood: selections.mood.map(v=>labelMap[v]||v), genres: [selections.mainGenre, selections.subGenre].filter(Boolean), stylePrompt: sp, excludeStyles: result.excludeStyles, weirdness: moreOpt.weirdness, styleInfluence: moreOpt.styleInfluence, explanation: document.getElementById('promptExplanation').textContent, favorite: false, memo: '' });
        localStorage.setItem(K, JSON.stringify(lib));
    }

    // 파일 불러오기
    document.getElementById('fileImport').addEventListener('change', (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => { const c = ev.target.result; const sm = c.match(/\[Style Prompt\]\s*\n([\s\S]*?)(?=\n={3,})/); if (sm) { importedPromptData = { stylePrompt: sm[1].trim() }; const em = c.match(/\[Exclude Styles\]\s*\n([\s\S]*?)(?=\n={3,})/); if (em) importedPromptData.excludeStyles = em[1].trim(); freeInput.value = sm[1].trim(); document.getElementById('charCount').textContent = freeInput.value.length + '자'; btnAnalyze.disabled = false; document.getElementById('importBox').classList.add('success'); document.getElementById('importBox').querySelector('.import-title').textContent = '\u2713 불러오기 완료!'; } }; r.readAsText(f, 'UTF-8'); e.target.value = ''; });

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
    if (localStorage.getItem('suno-dark-mode') === 'true') { document.body.classList.add('dark-mode'); bd.querySelector('.dark-mode-icon').textContent = '\u2600'; }
    bd.addEventListener('click', () => { document.body.classList.toggle('dark-mode'); const d = document.body.classList.contains('dark-mode'); bd.querySelector('.dark-mode-icon').textContent = d ? '\u2600' : '\u263E'; localStorage.setItem('suno-dark-mode', d); });
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

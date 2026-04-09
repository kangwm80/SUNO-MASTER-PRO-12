// ============================================
// SUNO MASTER PRO 12 - 직접 만들기 JavaScript
// 6단계 흐름: 자유입력 → 타겟층 → 장소/상황 → 분위기 → 장르선택 → 완성
// ============================================

// 파트 파일 병합
if (typeof SITUATION_DATA !== 'undefined') {
    if (typeof SITUATION_DATA_PART2 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART2);
    if (typeof SITUATION_DATA_PART3 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART3);
    if (typeof SITUATION_DATA_PART4 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART4);
    if (typeof SITUATION_DATA_PART5 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART5);
    if (typeof SITUATION_DATA_PART6 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART6);
    if (typeof SITUATION_DATA_PART7 !== 'undefined') Object.assign(SITUATION_DATA, SITUATION_DATA_PART7);
}

document.addEventListener('DOMContentLoaded', () => {
    // === 상태 관리 ===
    let currentStep = 1;
    const totalSteps = 5; // 1~5단계 (6단계는 결과)
    const selections = {
        freeText: '',
        target: [],
        place: [],
        mood: [],
        genres: [],
        vocalType: '',
        vocalAge: '',
        vocalRange: '',
        vocalStyles: []
    };
    let recommendedGenres = [];
    let customGenres = [];
    let _lastStep3Target = '';
    const confirmed = { step2: false, step3: false, step4: false, step5: false, vocal: false };
    let confirmedSituationText = '';
    let importedPromptData = null;

    // 한글 매핑
    const labelMap = {
        teens: '10대', 'young-adults': '2030세대', 'middle-aged': '5060세대', seniors: '시니어세대',
        cafe: '카페', bar: '바/라운지', club: '클럽', festival: '페스티벌',
        gym: '헬스장', home: '집', office: '사무실', library: '도서관',
        drive: '드라이브', 'night-drive': 'Night Drive', walk: '산책', commute: '출퇴근',
        travel: '여행', airplane: '비행기안', cooking: '요리할때', cleaning: '청소할때',
        reading: '독서', gaming: '게이밍', coding: '코딩', yoga: '요가',
        meditation: '명상', morning: '아침루틴', 'afternoon-tea': '오후티타임', dinner: '저녁식사',
        night: '밤', date: '데이트', 'home-party': '홈파티', alone: '혼술/혼밥',
        comfortable: '편안한', healing: '힐링', cozy: '포근한', warm: '따뜻한', snug: '아늑한',
        emotional: '감성적', dreamy: '몽환적', calm: '잔잔한', lonely: '쓸쓸한',
        sentimental: '센치한', 'dawn-mood': '새벽감성', nostalgic: '그리운',
        flutter: '설레는', love: '사랑', breakup: '이별',
        'feel-good': '기분좋은', refreshing: '상쾌한', exciting: '신나는', groovy: '흥겨운',
        'tension-up': '텐션업', powerful: '파워풀한', confidence: '자신감', anger: '분노',
        focus: '집중', study: '공부할때', immersive: '몰입',
        sleep: '잠잘때', 'sleep-aid': '수면유도', comfort: '위로', 'stress-relief': '스트레스해소',
        rainy: '비오는날', snowy: '눈오는날', dawn: '새벽', sunset: '일몰', running: '달릴때'
    };

    // === DOM ===
    const stepPages = document.querySelectorAll('.step-page');
    const stepItems = document.querySelectorAll('.step-item');
    const stepLines = document.querySelectorAll('.step-line');
    const navButtons = document.getElementById('navButtons');

    // === 프롬프트 생성 버튼 표시/숨김 ===
    function showGeneratePromptBtn(show) {
        const genBtn = document.getElementById('btnGeneratePrompt');
        const applyBtn = document.getElementById('btnApplyStep5');
        if (show) { genBtn.style.display = ''; applyBtn.style.display = 'none'; }
        else { genBtn.style.display = 'none'; applyBtn.style.display = ''; }
    }

    // ============================================================
    // STEP 1: 자유 입력
    // ============================================================
    const freeInput = document.getElementById('freeInput');
    const btnAnalyze = document.getElementById('btnAnalyze');
    const btnNextStep1 = document.getElementById('btnNextStep1');

    freeInput.addEventListener('input', () => {
        const len = freeInput.value.trim().length;
        document.getElementById('charCount').textContent = freeInput.value.length + '자';
        btnAnalyze.disabled = len === 0;
        btnNextStep1.disabled = len === 0;
    });

    document.getElementById('btnClearInput').addEventListener('click', () => {
        freeInput.value = '';
        document.getElementById('charCount').textContent = '0자';
        btnAnalyze.disabled = true;
        btnNextStep1.disabled = true;
    });

    function goToStep2FromInput() {
        if (freeInput.value.trim().length === 0) return;
        selections.freeText = freeInput.value.trim();
        autoFillFromText(selections.freeText);
        goToStep(2);
    }

    btnAnalyze.addEventListener('click', goToStep2FromInput);
    btnNextStep1.addEventListener('click', goToStep2FromInput);

    // === 자유 입력 텍스트 분석 → 단계별 자동 채우기 ===
    function autoFillFromText(text) {
        const lower = text.toLowerCase();

        // 타겟층 자동 분석
        const targetKeywords = {
            'teens': ['10대', '학생', '청소년', '학교', 'teen', '아이', '어린이', '키즈', 'kid'],
            'young-adults': ['20대', '30대', '2030', '청년', '대학', '직장인', 'young'],
            'middle-aged': ['50대', '60대', '5060', '중년', '중장년', '부모'],
            'seniors': ['시니어', '어르신', '70대', '80대', '할머니', '할아버지', '노인', 'senior']
        };
        for (const [key, keywords] of Object.entries(targetKeywords)) {
            if (keywords.some(kw => lower.includes(kw))) {
                selections.target = [key];
                break;
            }
        }

        // 상황 카테고리 자동 매핑 (SITUATION_DATA 실제 키 기준, 우선순위 높은 것 먼저)
        const themeKeywords = [
            ['카페',           ['카페', '커피', 'cafe', 'coffee', '카페에서']],
            ['데이트',         ['데이트', '연인과', '커플']],
            ['사랑과 연애',    ['사랑', '짝사랑', '고백', '연애', 'love', '설레']],
            ['이별과 상실',    ['이별', '헤어짐', '헤어지', '실연', 'breakup', '슬픈 이별']],
            ['운동/산책',      ['헬스', '운동', '산책', 'gym', '달리기', '조깅', '런닝', '뛰기', '헬스장', '워킹']],
            ['드라이브',       ['드라이브', '운전', 'drive', '자동차', '차 안에서']],
            ['힐링',           ['힐링', '치유', '쉬고 싶', '릴렉스', 'healing', '휴식']],
            ['공부/시험',      ['공부', '시험', '학습', 'study', '집중해서']],
            ['새벽감성',       ['새벽 3시', '새벽 4시', '새벽에 혼자']],
            ['밤과 새벽의 감정', ['새벽', '밤에', '밤하늘', 'night', '야심한', '깊은 밤']],
            ['수면/잠잘때',    ['잠', '수면', '자장가', 'sleep', '졸린', '잠들기', '불면']],
            ['비오는 날',      ['비오는', '비내리', '빗소리', 'rainy', '비가 오']],
            ['눈오는 날',      ['눈오는', '눈내리', '눈이 오', 'snowy', '눈 오는']],
            ['파티와 자유',    ['파티', '축제', 'party', '클럽', '신나는 파티']],
            ['클럽/나이트',    ['클럽', '나이트', '클러빙']],
            ['여행과 떠남',    ['여행', 'travel', '떠나고', '여행가']],
            ['캠핑/야외',      ['캠핑', '야외', '등산', '트레킹']],
            ['출퇴근길',       ['출퇴근', '지하철', '버스에서', '통근']],
            ['업무/집중',      ['업무', '일할 때', '일하면서', '집중', '작업할 때']],
            ['집/사무실',      ['집에서', '홈', '거실에서', '사무실에서']],
            ['아침루틴',       ['아침', '기상', '모닝', '아침에']],
            ['독서',           ['독서', '책 읽', '책을 읽', '도서관']],
            ['요리/음식',      ['요리', '음식', '먹을 때', '요리하면서']],
            ['게이밍',         ['게임', '게이밍', 'gaming']],
            ['명상/마음챙김',  ['명상', '마음챙김', '요가', '마인드풀']],
            ['혼자만의 시간',  ['혼자', '혼술', '혼밥', '나 혼자']],
            ['기념일/축하',    ['생일', '기념일', '축하', '결혼기념']],
            ['봄',             ['봄', '벚꽃', '꽃피는', '봄바람']],
            ['여름',           ['여름', '더운 날', '바닷가', '해변']],
            ['가을',           ['가을', '단풍', '선선한', '낙엽']],
            ['겨울',           ['겨울', '크리스마스', '눈사람', '겨울바람']],
            ['그리움과 향수',  ['그리운', '추억', '그리움', '보고 싶']],
            ['가족이라는 이름',['가족', '부모님', '엄마', '아빠', '할머니', '할아버지']],
            ['위로와 치유',    ['위로', '위안', '힘들', '고통', '상처']],
            ['꿈과 미래',      ['꿈', '미래', '목표', '희망']],
            ['자신감/도전',    ['도전', '자신감', '용기', '파이팅']],
            ['응원/격려',      ['응원', '격려', '힘내']],
            ['우정과 인연',    ['친구', '우정', '인연', '절친']],
            ['외로움과 고독',  ['외로운', '외로움', '고독', '쓸쓸']],
            ['나를 찾아가는 여정', ['나를 찾', '자아', '정체성', '내 자신']],
        ];
        selections._autoTheme = '';
        for (const [theme, keywords] of themeKeywords) {
            if (keywords.some(kw => lower.includes(kw))) { selections._autoTheme = theme; break; }
        }

        // 분위기 자동 분석
        const moodKwMap = {
            'comfortable': ['편안', '편하게', '릴렉스', '느긋'],
            'healing': ['힐링', '치유', 'healing'],
            'cozy': ['포근', 'cozy'],
            'warm': ['따뜻', 'warm'],
            'calm': ['잔잔', '평화', '차분', '조용', 'calm'],
            'emotional': ['감성', '감동', '서정', 'emotional'],
            'dreamy': ['몽환', '꿈같', 'dreamy'],
            'lonely': ['쓸쓸', '외로', '고독', 'lonely'],
            'flutter': ['설레', '두근', '떨림', 'flutter'],
            'love': ['사랑', '러브', 'love', '로맨스'],
            'breakup': ['이별', '헤어', '슬픈', '눈물', 'breakup'],
            'feel-good': ['기분좋', '즐거', 'feel good'],
            'exciting': ['신나', '신남', '흥겨', 'exciting', '활기', '경쾌'],
            'groovy': ['그루브', 'groovy', '흥'],
            'powerful': ['파워', '강렬', '폭발', 'powerful', '힘찬'],
            'confidence': ['자신감', '자신있', '당당', 'confidence'],
            'focus': ['집중', 'focus'],
            'sleep': ['잠', '수면', '자장가', 'sleep'],
            'comfort': ['위로', '위안', 'comfort'],
            'rainy': ['비오', '빗소리', '비오는날', 'rainy'],
            'snowy': ['눈오', '눈오는날', 'snowy'],
            'nostalgic': ['그리운', '추억', '그리움', 'nostalgic']
        };
        const autoMoods = [];
        for (const [moodKey, kws] of Object.entries(moodKwMap)) {
            if (kws.some(kw => lower.includes(kw)) && autoMoods.length < 3) autoMoods.push(moodKey);
        }
        if (autoMoods.length > 0) selections._autoFillMoods = autoMoods;
    }

    // 2단계 진입 시 option-card 자동 선택 적용
    function applyAutoFillToStep2() {
        if (selections.target.length === 0) return;
        const step2 = document.getElementById('step2');
        step2.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        selections.target.forEach(val => {
            const card = step2.querySelector(`.option-card[data-value="${val}"]`);
            if (card) card.classList.add('selected');
        });
        const step2Area = document.getElementById('step2ApplyArea');
        if (step2Area) step2Area.style.display = 'block';
    }

    // ============================================================
    // 옵션 카드 선택 (2단계=타겟층, 4단계=분위기)
    // ============================================================
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            if (currentStep === 2) {
                const stepPage = document.getElementById('step2');
                const prevTarget = selections.target[0] || '';
                if (card.classList.contains('selected')) {
                    card.classList.remove('selected');
                } else {
                    stepPage.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                }
                const newTarget = card.classList.contains('selected') ? card.dataset.value : '';
                if (prevTarget !== newTarget) {
                    selections.place = [];
                    selections._themeMoods = [];
                    confirmed.step2 = false;
                    confirmed.step3 = false;
                    confirmed.step4 = false;
                    confirmed.step5 = false;
                }
            } else if (currentStep === 4) {
                card.classList.toggle('selected');
                confirmed.step4 = false;
                confirmed.step5 = false;
            } else {
                card.classList.toggle('selected');
            }
            updateSelections();
            updateApplyButtons();
        });
    });

    function updateSelections() {
        const stepPage = document.getElementById(`step${currentStep}`);
        if (!stepPage) return;
        const selected = stepPage.querySelectorAll('.option-card.selected');
        const values = Array.from(selected).map(c => c.dataset.value);
        if (currentStep === 2) selections.target = values;
        else if (currentStep === 4) selections.mood = values;
    }

    // ============================================================
    // 적용하기 버튼 표시/숨김 관리
    // ============================================================
    function updateApplyButtons() {
        if (currentStep === 2) {
            const step2Area = document.getElementById('step2ApplyArea');
            const hasTarget = document.querySelectorAll('#step2 .option-card.selected').length > 0;
            step2Area.style.display = hasTarget ? 'block' : 'none';
            const btn2 = document.getElementById('btnApplyStep2');
            if (confirmed.step2) { btn2.innerHTML = '<span>✓</span> 적용완료'; btn2.classList.add('applied'); }
            else { btn2.innerHTML = '<span>✓</span> 적용하기'; btn2.classList.remove('applied'); }
        }
        if (currentStep === 4) {
            const step4Area = document.getElementById('step4ApplyArea');
            const hasMood = document.querySelectorAll('#step4 .option-card.selected').length > 0;
            step4Area.style.display = hasMood ? 'block' : 'none';
            const btn4 = document.getElementById('btnApplyStep4');
            if (confirmed.step4) { btn4.innerHTML = '<span>✓</span> 적용완료'; btn4.classList.add('applied'); }
            else { btn4.innerHTML = '<span>✓</span> 적용하기'; btn4.classList.remove('applied'); }
        }
        if (currentStep === 5) {
            const step5Area = document.getElementById('step5ApplyArea');
            const hasGenre = selections.genres.length > 0;
            step5Area.style.display = hasGenre ? 'block' : 'none';
            const btn5 = document.getElementById('btnApplyStep5');
            if (confirmed.step5) {
                btn5.innerHTML = '<span>✓</span> 적용완료'; btn5.classList.add('applied');
                if (confirmed.vocal) showGeneratePromptBtn(true);
            } else {
                btn5.innerHTML = '<span>✓</span> 적용하기'; btn5.classList.remove('applied');
                showGeneratePromptBtn(false);
            }
        }
    }

    // ============================================================
    // 2단계 적용하기 (타겟층)
    // ============================================================
    document.getElementById('btnApplyStep2').addEventListener('click', () => {
        updateSelections();
        if (selections.target.length === 0) return;
        confirmed.step2 = true;
        confirmed.step3 = false; confirmed.step4 = false; confirmed.step5 = false;
        const targetName = selections.target.map(v => labelMap[v]).join(', ');
        const fb = document.getElementById('step2Feedback');
        fb.innerHTML = '✅ <strong>"' + targetName + '"</strong> 타겟층이 적용되었습니다. 3단계에 반영됩니다.';
        fb.classList.add('active');
        updateApplyButtons();
    });

    // ============================================================
    // 3단계: 상황 미리보기 + 수정/적용
    // ============================================================
    const situationPreview = document.getElementById('situationPreview');
    const situationPreviewText = document.getElementById('situationPreviewText');
    const situationEditArea = document.getElementById('situationEditArea');
    const situationEditInput = document.getElementById('situationEditInput');
    const btnSituationEdit = document.getElementById('btnSituationEdit');
    const btnApplyStep3 = document.getElementById('btnApplyStep3');
    let isEditingSituation = false;

    function showSituationPreview(text) {
        situationPreviewText.textContent = text;
        situationPreviewText.style.display = 'flex';
        situationEditArea.style.display = 'none';
        isEditingSituation = false;
        btnSituationEdit.innerHTML = '<span>✎</span> 수정하기';
        btnSituationEdit.classList.remove('editing');
        situationPreview.style.display = 'block';
        confirmed.step3 = false; confirmed.step4 = false; confirmed.step5 = false;
        document.getElementById('step3Feedback').classList.remove('active');
        btnApplyStep3.innerHTML = '✅ 적용하기';
        btnApplyStep3.classList.remove('applied');
    }

    btnSituationEdit.addEventListener('click', () => {
        if (!isEditingSituation) {
            isEditingSituation = true;
            situationEditInput.value = situationPreviewText.textContent;
            situationPreviewText.style.display = 'none';
            situationEditArea.style.display = 'block';
            situationEditInput.focus();
            btnSituationEdit.innerHTML = '<span>❌</span> 취소';
            btnSituationEdit.classList.add('editing');
        } else {
            isEditingSituation = false;
            situationPreviewText.style.display = 'flex';
            situationEditArea.style.display = 'none';
            btnSituationEdit.innerHTML = '<span>✎</span> 수정하기';
            btnSituationEdit.classList.remove('editing');
        }
    });

    btnApplyStep3.addEventListener('click', () => {
        let finalText;
        if (isEditingSituation) {
            finalText = situationEditInput.value.trim();
            if (!finalText) return;
        } else {
            finalText = situationPreviewText.textContent;
        }
        if (!finalText) return;

        confirmedSituationText = finalText;
        confirmed.step3 = true; confirmed.step4 = false; confirmed.step5 = false;

        if (isEditingSituation) {
            situationPreviewText.textContent = finalText;
            situationPreviewText.style.display = 'flex';
            situationEditArea.style.display = 'none';
            isEditingSituation = false;
            btnSituationEdit.innerHTML = '<span>✎</span> 수정하기';
            btnSituationEdit.classList.remove('editing');
        }

        recalcThemeMoodsFromText(finalText);

        const fb = document.getElementById('step3Feedback');
        fb.innerHTML = '✅ 상황 <strong>"' + finalText + '"</strong> 이(가) 적용되었습니다. 4단계 분위기에 반영됩니다.';
        fb.classList.add('active');
        fb.style.display = '';
        btnApplyStep3.innerHTML = '✅ 적용완료';
        btnApplyStep3.classList.add('applied');
    });

    // ============================================================
    // 4단계 적용하기 (분위기)
    // ============================================================
    document.getElementById('btnApplyStep4').addEventListener('click', () => {
        const step4 = document.getElementById('step4');
        const selected = step4.querySelectorAll('.option-card.selected');
        selections.mood = Array.from(selected).map(c => c.dataset.value);
        if (selections.mood.length === 0) return;
        confirmed.step4 = true; confirmed.step5 = false;
        const moodNames = selections.mood.map(v => labelMap[v]).join(', ');
        const fb = document.getElementById('step4Feedback');
        fb.innerHTML = '✅ 분위기 <strong>"' + moodNames + '"</strong> 이(가) 적용되었습니다. 5단계 장르 추천에 반영됩니다.';
        fb.classList.add('active');
        updateApplyButtons();
    });

    // ============================================================
    // 5단계 적용하기 (장르)
    // ============================================================
    document.getElementById('btnApplyStep5').addEventListener('click', () => {
        if (selections.genres.length === 0) return;
        confirmed.step5 = true; confirmed.vocal = false;
        const genreNames = selections.genres.join(' + ');
        const fb = document.getElementById('step5Feedback');
        fb.innerHTML = '✅ 장르 <strong>"' + genreNames + '"</strong> 적용! 아래에서 보컬을 설정해주세요.';
        fb.classList.add('active');
        updateApplyButtons();
        document.getElementById('vocalSettingsArea').style.display = 'block';
        showGeneratePromptBtn(false);
        initVocalSettings();
    });

    document.getElementById('btnGeneratePrompt').addEventListener('click', () => {
        if (!confirmed.step5 || !confirmed.vocal) return;
        goToStep(6);
    });

    // ============================================================
    // 장르 드롭다운 초기화
    // ============================================================
    (function initGenreDropdowns() {
        const mainDD = document.getElementById('mainGenreDropdown');
        const subDD = document.getElementById('subGenreDropdown');
        const detailDD = document.getElementById('detailGenreDropdown');

        const mainCategories = [...new Set(GENRE_DATABASE.map(g => g.main))];
        mainCategories.forEach(main => {
            const opt = document.createElement('option');
            opt.value = main; opt.textContent = main;
            mainDD.appendChild(opt);
        });

        mainDD.addEventListener('change', () => {
            const sel = mainDD.value;
            subDD.innerHTML = '<option value="">-- 서브 장르 선택 --</option>';
            detailDD.innerHTML = '<option value="">-- 상세 장르 선택 --</option>';
            detailDD.disabled = true;
            const dsc = document.getElementById('dropdownSelectedCard');
            if (dsc) dsc.style.display = 'none';
            if (!sel) { subDD.disabled = true; return; }
            subDD.disabled = false;
            [...new Set(GENRE_DATABASE.filter(g => g.main === sel).map(g => g.sub))].forEach(sub => {
                const opt = document.createElement('option'); opt.value = sub; opt.textContent = sub;
                subDD.appendChild(opt);
            });
        });

        subDD.addEventListener('change', () => {
            const mainVal = mainDD.value, subVal = subDD.value;
            detailDD.innerHTML = '<option value="">-- 상세 장르 선택 --</option>';
            const dsc = document.getElementById('dropdownSelectedCard');
            if (dsc) dsc.style.display = 'none';
            if (!subVal) { detailDD.disabled = true; return; }
            detailDD.disabled = false;
            GENRE_DATABASE.filter(g => g.main === mainVal && g.sub === subVal).forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.genre; opt.textContent = g.genre; opt.title = buildGenreDescription(g);
                detailDD.appendChild(opt);
            });
        });

        detailDD.addEventListener('change', () => {
            const genreName = detailDD.value;
            const cardContainer = document.getElementById('dropdownSelectedCard');
            if (!genreName) { cardContainer.style.display = 'none'; return; }
            const genreData = GENRE_DATABASE.find(g => g.genre === genreName);
            if (!genreData) return;
            const fullDesc = buildGenreDescription(genreData);
            const placeTagsHtml = (genreData.place || []).map(p => `<span class="genre-rec-tag">📍 ${p}</span>`).join('');
            const moodTagsHtml = (genreData.mood || []).map(m => `<span class="genre-rec-tag">🎵 ${m}</span>`).join('');
            const ageTagsHtml = (genreData.age || []).map(a => `<span class="genre-rec-tag">👤 ${a}</span>`).join('');
            const selIdx = selections.genres.indexOf(genreName);
            const isAlreadySelected = selIdx > -1;
            let roleHtml = '', cardSelClass = '';
            if (selIdx === 0) { roleHtml = '<span class="genre-rec-role main-role">⭐ 메인 장르</span>'; cardSelClass = 'selected main-genre'; }
            else if (selIdx === 1) { roleHtml = '<span class="genre-rec-role blend-role">🎨 블렌딩 장르</span>'; cardSelClass = 'selected blend-genre'; }
            cardContainer.innerHTML = `
                <div class="genre-rec-card ${cardSelClass}" data-genre="${genreData.genre}" style="cursor:pointer;">
                    <div class="genre-rec-rank">🎵</div>
                    <div class="genre-rec-content">
                        <div class="genre-rec-name">${genreData.genre} ${isAlreadySelected ? roleHtml : '<span style="color:#999;font-size:0.85em;">👆 클릭하면 선택됩니다</span>'}</div>
                        <div class="genre-rec-main">${genreData.main || ''} ${genreData.sub ? '> ' + genreData.sub : ''}</div>
                        <div class="genre-rec-desc">${fullDesc}</div>
                        <div class="genre-rec-tags">${ageTagsHtml} ${placeTagsHtml} ${moodTagsHtml}</div>
                    </div>
                </div>`;
            cardContainer.style.display = 'block';
            cardContainer.querySelector('.genre-rec-card').addEventListener('click', () => {
                toggleGenreSelection(genreName, genreData);
                detailDD.dispatchEvent(new Event('change'));
            });
        });

        detailDD.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'OPTION' && e.target.value) {
                const g = GENRE_DATABASE.find(genre => genre.genre === e.target.value);
                if (g) e.target.title = buildGenreDescription(g);
            }
        });
    })();

    // ============================================================
    // 보컬 설정
    // ============================================================
    const genreVocalStyleMap = {
        'Pop': ['chest voice','breathy tone','belting','vibrato','staccato'],
        'Rock': ['chest voice','belting','grit','rasp','mixed voice','vibrato'],
        'Metal': ['belting','grit','rasp','screaming','growling','chest voice'],
        'Country / Folk': ['chest voice','vibrato','breathy tone','whisper tone','legato'],
        'Hip Hop / Rap': ['chest voice','spoken word','rhythmic flow','ad-libs','grit'],
        'Electronic / House': ['breathy tone','whisper tone','processed vocals','auto-tune','falsetto'],
        'Jazz': ['head voice','vibrato','scat','breathy tone','legato','mixed voice'],
        'R&B / Soul': ['mixed voice','falsetto','runs','melisma','breathy tone','vibrato','ad-libs'],
        'Funk / Disco': ['chest voice','falsetto','staccato','rhythmic attack','belting'],
        'Latin': ['chest voice','vibrato','belting','mixed voice','passionate delivery'],
        'Cinematic / Soundtrack': ['head voice','legato','vibrato','soaring vocals','whisper tone'],
        'Classical / Orchestral': ['head voice','vibrato','legato','soprano','falsetto'],
        'Ambient / New Age': ['breathy tone','whisper tone','ethereal vocals','head voice'],
        'Religious / Spiritual': ['belting','chest voice','vibrato','gospel runs','mixed voice'],
        "Kid's / Special": ['chest voice','bright tone','staccato','playful delivery'],
        'African / Caribbean': ['chest voice','rhythmic chanting','call and response','belting'],
        'World / Ethnic': ['chest voice','vibrato','traditional techniques','melisma']
    };

    const allVocalStyles = [
        { value: 'chest voice', label: '진성 (Chest Voice)', desc: '자연스러운 말하기 음역의 보컬' },
        { value: 'head voice', label: '두성 (Head Voice)', desc: '높은 음역의 밝고 가벼운 톤' },
        { value: 'mixed voice', label: '믹스 보이스', desc: '진성과 두성의 자연스러운 혼합' },
        { value: 'falsetto', label: '팔세토', desc: '얇고 공기감 있는 고음역' },
        { value: 'belting', label: '벨팅', desc: '파워풀한 고음 폭발' },
        { value: 'vibrato', label: '비브라토', desc: '음정을 떨어 감정을 표현' },
        { value: 'runs', label: '런/멜리스마', desc: '빠른 음 이동 기법' },
        { value: 'melisma', label: '멜리스마', desc: '한 음절에 여러 음 연결' },
        { value: 'breathy tone', label: '브레시 (Breathy)', desc: '공기감 있는 감성적 톤' },
        { value: 'grit', label: '그릿/라스프', desc: '거칠고 파워풀한 음색' },
        { value: 'rasp', label: '라스프', desc: '허스키한 거친 질감' },
        { value: 'staccato', label: '스타카토', desc: '짧고 끊어지는 리듬감' },
        { value: 'legato', label: '레가토', desc: '부드럽게 이어지는 프레이징' },
        { value: 'whisper tone', label: '속삭임 (Whisper)', desc: '속삭이듯 부드러운 보컬' },
        { value: 'scat', label: '스캣', desc: '재즈 스타일의 즉흥 보컬' },
        { value: 'ad-libs', label: '애드립', desc: '즉흥적인 장식음' },
        { value: 'spoken word', label: '스포큰 워드', desc: '말하듯 전달하는 보컬' },
        { value: 'rhythmic flow', label: '리듬 플로우', desc: '리듬감 있는 랩/보컬' },
        { value: 'screaming', label: '스크리밍', desc: '극한의 고성 표현' },
        { value: 'growling', label: '그로울링', desc: '낮고 거친 으르렁 톤' },
        { value: 'soaring vocals', label: '고음 비상', desc: '높이 치솟는 감동적 고음' },
        { value: 'processed vocals', label: '프로세스드', desc: '효과 처리된 전자적 보컬' },
        { value: 'auto-tune', label: '오토튠', desc: '피치 보정된 현대적 보컬' },
        { value: 'passionate delivery', label: '열정적 전달', desc: '감정을 최대로 실은 보컬' },
        { value: 'gospel runs', label: '가스펠 런', desc: '가스펠 스타일의 화려한 런' },
        { value: 'ethereal vocals', label: '에테리얼', desc: '몽환적이고 신비로운 보컬' },
        { value: 'humming', label: '허밍', desc: '부드럽게 흥얼거리는 보컬' },
        { value: 'vocal harmonies', label: '하모니', desc: '화음을 쌓아 풍성한 사운드' },
        { value: 'layered vocals', label: '레이어드 보컬', desc: '여러 겹으로 쌓은 두꺼운 보컬' },
        { value: 'call and response', label: '콜앤리스폰스', desc: '선창과 후창이 교차하는 방식' },
        { value: 'portamento', label: '포르타멘토', desc: '음 사이를 부드럽게 미끄러지듯 연결' },
        { value: 'tremolo', label: '트레몰로', desc: '빠르게 떨리는 음색 변화' },
        { value: 'vocal cry', label: '보컬 크라이', desc: '울먹이듯 감정을 터뜨리는 창법' },
        { value: 'nasal tone', label: '비음 (코소리)', desc: '코를 통한 독특한 음색' },
        { value: 'powerful belting', label: '파워 벨팅', desc: '한계까지 끌어올리는 극한의 고음' },
        { value: 'soft crooning', label: '크루닝', desc: '부드럽고 감미로운 속삭임 창법' }
    ];

    const maleRanges = [
        { value: 'deep bass, E2~E3', label: '저음 (E2~E3)', desc: '깊고 묵직한 저음, 몸을 울리는 진동감' },
        { value: 'low baritone, G2~G3', label: '중저음 (G2~G3)', desc: '따뜻하고 안정감 있는 중저음' },
        { value: 'mid baritone, C3~C4', label: '중음 (C3~C4)', desc: '가장 자연스러운 남성 음역대' },
        { value: 'high tenor, G3~G4', label: '중고음 (G3~G4)', desc: '힘 있고 감동적인 중고음' },
        { value: 'power tenor, C4~C5', label: '고음 (C4~C5)', desc: '폭발적인 고음 파워' }
    ];
    const femaleRanges = [
        { value: 'low alto, A3~A4', label: '저음 (A3~A4)', desc: '깊고 풍부한 여성 저음' },
        { value: 'mid mezzo, C4~C5', label: '중저음 (C4~C5)', desc: '따뜻하고 감성적인 중저음' },
        { value: 'mezzo soprano, E4~E5', label: '중음 (E4~E5)', desc: '밝고 선명한 중음역' },
        { value: 'high soprano, G4~G5', label: '중고음 (G4~G5)', desc: '투명하고 아름다운 중고음' },
        { value: 'power soprano, C5~C6', label: '고음 (C5~C6)', desc: '전율을 주는 초고음' }
    ];

    let vocalSelections = { type: '', age: '', range: '', styles: [] };

    function initVocalSettings() {
        vocalSelections = { type: '', age: '', range: '', styles: [] };
        confirmed.vocal = false;
        document.querySelectorAll('#vocalTypeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
        document.getElementById('vocalAgeGroup').style.display = 'none';
        document.getElementById('vocalRangeGroup').style.display = 'none';
        document.getElementById('vocalStyleGroup').style.display = 'none';
        document.getElementById('vocalApplyArea').style.display = 'none';
        showGeneratePromptBtn(false);

        // === 보컬 자동 추천: 장르/타겟/분위기 기반 ===
        const mainGenre = selections.genres[0] || '';
        const genreEntry = GENRE_DATABASE.find(g => g.genre === mainGenre);
        const mainCategory = genreEntry ? (genreEntry.main || '') : '';
        const targetList = selections.target || [];
        const moodList = selections.mood || [];

        // 보컬 타입 추천 로직
        let recommendedType = 'female vocals'; // 기본값
        const maleGenres = ['Hip Hop / Rap', 'Metal', 'Rock'];
        const femaleGenres = ['Pop', 'R&B / Soul', 'Jazz', 'Ambient / New Age'];
        if (maleGenres.includes(mainCategory)) recommendedType = 'male vocals';
        else if (femaleGenres.includes(mainCategory)) recommendedType = 'female vocals';
        // 타겟층 기반 보정
        if (targetList.includes('male-20s') || targetList.includes('male-30s') || targetList.includes('male-40s')) recommendedType = 'male vocals';
        if (targetList.includes('female-20s') || targetList.includes('female-30s') || targetList.includes('female-40s')) recommendedType = 'female vocals';
        // 분위기 기반 보정
        if (moodList.includes('powerful') || moodList.includes('confidence') || moodList.includes('anger')) recommendedType = 'male vocals';
        if (moodList.includes('dreamy') || moodList.includes('healing') || moodList.includes('cozy')) recommendedType = 'female vocals';

        // DB에서 보컬 힌트 확인
        if (genreEntry && genreEntry.vocal) {
            const dbVocal = genreEntry.vocal.toLowerCase();
            if (/\bmale\b/.test(dbVocal) && !/female/.test(dbVocal)) recommendedType = 'male vocals';
            else if (/female/.test(dbVocal)) recommendedType = 'female vocals';
        }

        // 추천 보컬 타입 자동 선택
        const typeBtn = document.querySelector(`#vocalTypeOptions .vocal-option-btn[data-value="${recommendedType}"]`);
        if (typeBtn) {
            typeBtn.classList.add('selected');
            vocalSelections.type = recommendedType;
            document.getElementById('vocalAgeGroup').style.display = 'block';

            // 연령대 자동 추천
            let recommendedAge = 'young adult vocals';
            if (targetList.some(t => t.includes('50s') || t.includes('60s'))) recommendedAge = 'veteran vocals';
            else if (targetList.some(t => t.includes('40s'))) recommendedAge = 'seasoned vocals';
            else if (targetList.some(t => t.includes('30s'))) recommendedAge = 'mature vocals';
            else if (targetList.some(t => t.includes('teen'))) recommendedAge = 'teen vocals';

            const ageBtn = document.querySelector(`#vocalAgeOptions .vocal-option-btn[data-value="${recommendedAge}"]`);
            if (ageBtn) {
                ageBtn.classList.add('selected');
                vocalSelections.age = recommendedAge;
                renderVocalRanges();
                document.getElementById('vocalRangeGroup').style.display = 'block';

                // 음역대 자동 추천 (첫 번째 중간 옵션)
                const isMale = recommendedType.includes('male') && !recommendedType.includes('female');
                const ranges = isMale ? maleRanges : femaleRanges;
                const midRange = ranges[Math.floor(ranges.length / 2)];
                const rangeBtn = document.querySelector(`#vocalRangeOptions .vocal-option-btn[data-value="${midRange.value}"]`);
                if (rangeBtn) {
                    rangeBtn.classList.add('selected');
                    vocalSelections.range = midRange.value;
                    renderVocalStyles();
                    document.getElementById('vocalStyleGroup').style.display = 'block';
                    document.getElementById('vocalApplyArea').style.display = 'block';
                }
            }
        }
    }

    document.querySelectorAll('#vocalTypeOptions .vocal-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#vocalTypeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            vocalSelections.type = btn.dataset.value;
            vocalSelections.range = ''; vocalSelections.styles = [];
            confirmed.vocal = false;
            if (vocalSelections.type === 'instrumental') {
                document.getElementById('vocalAgeGroup').style.display = 'none';
                document.getElementById('vocalRangeGroup').style.display = 'none';
                document.getElementById('vocalStyleGroup').style.display = 'none';
                document.getElementById('vocalApplyArea').style.display = 'block';
            } else {
                document.getElementById('vocalAgeGroup').style.display = 'block';
                document.getElementById('vocalRangeGroup').style.display = 'none';
                document.getElementById('vocalStyleGroup').style.display = 'none';
                document.getElementById('vocalApplyArea').style.display = 'none';
            }
            showGeneratePromptBtn(false);
        });
    });

    document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            vocalSelections.age = btn.dataset.value;
            confirmed.vocal = false;
            renderVocalRanges();
            document.getElementById('vocalRangeGroup').style.display = 'block';
            document.getElementById('vocalStyleGroup').style.display = 'none';
            document.getElementById('vocalApplyArea').style.display = 'none';
            showGeneratePromptBtn(false);
        });
    });

    function renderVocalRanges() {
        const container = document.getElementById('vocalRangeOptions');
        container.innerHTML = '';
        const isMale = vocalSelections.type.includes('male') && !vocalSelections.type.includes('female');
        const isDuet = vocalSelections.type.includes('duet');
        const ranges = isDuet ? [...maleRanges, ...femaleRanges] : (isMale ? maleRanges : femaleRanges);
        ranges.forEach(r => {
            const btn = document.createElement('button');
            btn.className = 'vocal-option-btn'; btn.dataset.value = r.value;
            btn.textContent = r.label; btn.title = r.desc;
            btn.addEventListener('click', () => {
                container.querySelectorAll('.vocal-option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                vocalSelections.range = r.value; vocalSelections.styles = [];
                confirmed.vocal = false;
                renderVocalStyles();
                document.getElementById('vocalStyleGroup').style.display = 'block';
            });
            container.appendChild(btn);
        });
    }

    function renderVocalStyles() {
        const container = document.getElementById('vocalStyleTags');
        container.innerHTML = '';
        const mainGenre = selections.genres[0] || '';
        const genreEntry = GENRE_DATABASE.find(g => g.genre === mainGenre);
        const mainCategory = genreEntry ? genreEntry.main : '';
        const recommended = genreVocalStyleMap[mainCategory] || [];
        allVocalStyles.forEach(style => {
            const tag = document.createElement('button');
            const isRecommended = recommended.includes(style.value);
            tag.className = 'vocal-style-tag' + (isRecommended ? ' recommended selected' : '');
            tag.dataset.value = style.value; tag.textContent = style.label; tag.title = style.desc;
            if (isRecommended) vocalSelections.styles.push(style.value);
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
                const idx = vocalSelections.styles.indexOf(style.value);
                if (idx > -1) vocalSelections.styles.splice(idx, 1);
                else vocalSelections.styles.push(style.value);
                confirmed.vocal = false; showGeneratePromptBtn(false);
                document.getElementById('vocalApplyArea').style.display = vocalSelections.styles.length > 0 ? 'block' : 'none';
            });
            container.appendChild(tag);
        });
        if (recommended.length > 0) document.getElementById('vocalApplyArea').style.display = 'block';
    }

    document.getElementById('btnApplyVocal').addEventListener('click', () => {
        confirmed.vocal = true;
        const fb = document.getElementById('vocalFeedback');
        const typeLabel = vocalSelections.type === 'instrumental' ? '연주곡' :
            (vocalSelections.type.includes('male') && !vocalSelections.type.includes('female') ? '남성' :
             vocalSelections.type.includes('female') ? '여성' : '듀엣');
        let msg = '✅ 보컬 설정 완료: <strong>' + typeLabel + '</strong>';
        if (vocalSelections.range) msg += ' / ' + vocalSelections.range;
        if (vocalSelections.styles.length > 0) msg += ' / 스타일 ' + vocalSelections.styles.length + '개';
        fb.innerHTML = msg; fb.classList.add('active');
        showGeneratePromptBtn(true); updateApplyButtons();
        selections.vocalType = vocalSelections.type;
        selections.vocalAge = vocalSelections.age;
        selections.vocalRange = vocalSelections.range;
        selections.vocalStyles = [...vocalSelections.styles];
    });

    // ============================================================
    // 상황 텍스트 기반 _themeMoods 재계산
    // ============================================================
    function recalcThemeMoodsFromText(text) {
        const themeVal = easySituationTheme ? easySituationTheme.value : '';
        const ageKey = selections.target[0] || 'young-adults';
        const themeEntry = themeMoodMap[themeVal];
        let baseMoods = themeEntry ? (themeEntry[ageKey] || themeEntry['young-adults'] || []) : [];
        const situationText = text.toLowerCase();
        const textMoods = [];
        for (const [moodKey, keywords] of Object.entries(situationMoodKeywords)) {
            if (keywords.some(kw => situationText.includes(kw))) textMoods.push(moodKey);
        }
        const moodAssociations = {
            'stress-relief':['comfort','sentimental'],'anger':['stress-relief','powerful'],
            'breakup':['lonely','sentimental','comfort'],'lonely':['sentimental','comfort','calm'],
            'comfort':['healing','warm'],'immersive':['calm','emotional'],
            'tension-up':['focus','confidence'],'flutter':['love','feel-good'],
            'nostalgic':['sentimental','warm','emotional'],'emotional':['warm','comfort'],
            'calm':['comfortable','healing'],'dreamy':['calm','emotional'],
            'healing':['comfortable','calm','warm'],'feel-good':['refreshing','exciting'],
            'exciting':['groovy','tension-up'],'sleep':['calm','sleep-aid'],
            'rainy':['calm','emotional','sentimental'],'snowy':['cozy','warm','dreamy'],
            'sunset':['emotional','nostalgic','calm']
        };
        const conflictPairs = [
            ['exciting','calm'],['exciting','sleep'],['exciting','lonely'],
            ['tension-up','comfortable'],['tension-up','sleep'],['tension-up','healing'],
            ['powerful','calm'],['powerful','sleep'],['powerful','healing'],
            ['anger','comfortable'],['anger','flutter'],['anger','love'],
            ['groovy','sleep'],['groovy','lonely'],
            ['feel-good','lonely'],['feel-good','breakup'],['feel-good','anger'],
            ['refreshing','sleep'],['refreshing','lonely'],
            ['stress-relief','exciting'],['stress-relief','feel-good'],
            ['snowy','exciting'],['rainy','exciting'],
            ['sleep','exciting'],['sleep','tension-up'],['sleep','anger'],
            ['confidence','lonely'],['confidence','breakup'],
            ['immersive','exciting'],['immersive','groovy']
        ];
        const enriched = [...textMoods];
        textMoods.forEach(m => {
            if (moodAssociations[m]) moodAssociations[m].forEach(a => { if (!enriched.includes(a)) enriched.push(a); });
        });
        const filteredBase = baseMoods.filter(baseMood =>
            !enriched.some(tm => conflictPairs.some(([a,b]) => (a===tm&&b===baseMood)||(b===tm&&a===baseMood)))
        );
        const combined = [];
        enriched.forEach(m => { if (!combined.includes(m) && combined.length < 3) combined.push(m); });
        filteredBase.forEach(m => {
            const hasConflict = combined.some(ex => conflictPairs.some(([a,b]) => (a===ex&&b===m)||(b===ex&&a===m)));
            if (!hasConflict && !combined.includes(m) && combined.length < 3) combined.push(m);
        });
        selections._themeMoods = combined.length > 0 ? combined : baseMoods.slice(0, 3);
    }

    function recalcThemeMoods() {
        const themeVal = easySituationTheme ? easySituationTheme.value : '';
        const ageKey = selections.target[0] || 'young-adults';
        const themeEntry = themeMoodMap[themeVal];
        selections._themeMoods = themeEntry ? (themeEntry[ageKey] || themeEntry['young-adults'] || []) : [];
    }

    // ============================================================
    // 3단계: 연령대별 장소/상황 드롭다운
    // ============================================================
    const AGE_LABEL_TO_KEY = { 'teens': '10대', 'young-adults': '2030세대', 'middle-aged': '5060세대', 'seniors': '시니어세대' };
    const easySituationTheme = document.getElementById('easySituationTheme');
    const easySituationSelect = document.getElementById('easySituationSelect');

    const themePlaceMap = {
        '출퇴근길':{'teens':['walk','commute'],'_default':['commute']},
        '카페':{'_default':['cafe']},
        '업무/집중':{'teens':['library','home'],'_default':['office','library']},
        '집/사무실':{'_default':['home','office']},
        '운동/산책':{'_default':['gym','walk']},
        '드라이브':{'teens':['drive'],'_default':['drive','night-drive']},
        '여행':{'_default':['travel']},
        '힐링':{'_default':['yoga','meditation','home']},
        '독서':{'_default':['library','reading']},
        '사랑과 연애':{'_default':['date','home','cafe']},
        '이별과 상실':{'_default':['home','alone','walk']},
        '그리움과 향수':{'_default':['home','walk','cafe']},
        '외로움과 고독':{'teens':['home','alone','night'],'_default':['home','alone','night']},
        '밤과 새벽의 감정':{'teens':['night','home'],'_default':['night','night-drive','bar']},
        '위로와 치유':{'_default':['cafe','walk','home']},
        '파티와 자유':{'teens':['home-party','festival'],'_default':['club','festival','home-party','bar']},
        '요리/음식':{'_default':['home','cooking']},
        '게이밍':{'_default':['home','gaming']},
        '코딩/작업':{'_default':['home','office','cafe']},
        '아침루틴':{'_default':['home','morning']},
        '오후 티타임':{'_default':['cafe','home']},
        '저녁식사':{'teens':['home','dinner'],'_default':['home','dinner']},
        '데이트':{'teens':['cafe','walk','home'],'_default':['cafe','bar','date','drive']},
        '혼자만의 시간':{'teens':['home','alone'],'_default':['home','alone','bar','cafe']},
        '비오는 날':{'_default':['home','cafe']},
        '눈오는 날':{'_default':['home','cafe']},
        '새벽감성':{'teens':['home','night'],'_default':['home','night','bar']},
        '일몰/석양':{'_default':['walk','drive']},
        '캠핑/야외':{'_default':['travel','walk']},
        '수면/잠잘때':{'_default':['home']},
        '공부/시험':{'_default':['library','home','cafe']},
        '졸업/입학':{'_default':['home','cafe']},
        '기념일/축하':{'teens':['home','cafe','home-party'],'_default':['home','cafe','bar','home-party']},
        '봄':{'_default':['walk','cafe','drive']},
        '여름':{'_default':['travel','drive','festival']},
        '가을':{'_default':['cafe','walk','drive']},
        '겨울':{'_default':['home','cafe']},
        '감사와 고마움':{'_default':['home','cafe']},
        '자신감/도전':{'_default':['gym','home','office']},
        '명상/마음챙김':{'_default':['home','yoga','meditation']},
        '클럽/나이트':{'teens':['home-party','festival'],'_default':['club','bar','festival']},
        '페스티벌':{'_default':['festival']},
        '결혼/웨딩':{'_default':['home','cafe']},
        '육아/가족':{'_default':['home']},
        '반려동물':{'_default':['home','walk']},
        '출발/시작':{'_default':['home','commute']},
        '응원/격려':{'_default':['gym','home','festival']},
        '회상/추억여행':{'_default':['home','cafe','drive']},
        '일상/루틴':{'_default':['home','office','cafe']},
        '특별한 하루':{'teens':['home','cafe','festival'],'_default':['home','cafe','bar','festival']}
    };

    const themeMoodMap = {
        '출퇴근길':{'teens':['feel-good','exciting','refreshing'],'young-adults':['feel-good','focus','immersive'],'middle-aged':['comfortable','calm','focus'],'seniors':['comfortable','calm','healing']},
        '카페':{'teens':['feel-good','comfortable','flutter'],'young-adults':['comfortable','calm','emotional'],'middle-aged':['comfortable','calm','healing'],'seniors':['comfortable','healing','warm']},
        '업무/집중':{'teens':['focus','study','immersive'],'young-adults':['focus','immersive','study'],'middle-aged':['focus','immersive','calm'],'seniors':['focus','calm','comfortable']},
        '집/사무실':{'teens':['comfortable','cozy','feel-good'],'young-adults':['comfortable','calm','cozy'],'middle-aged':['comfortable','calm','healing'],'seniors':['comfortable','warm','healing']},
        '운동/산책':{'teens':['exciting','refreshing','tension-up'],'young-adults':['refreshing','exciting','powerful'],'middle-aged':['refreshing','comfortable','healing'],'seniors':['comfortable','healing','calm']},
        '드라이브':{'teens':['exciting','feel-good','groovy'],'young-adults':['feel-good','exciting','emotional'],'middle-aged':['comfortable','emotional','nostalgic'],'seniors':['comfortable','nostalgic','calm']},
        '여행':{'teens':['exciting','feel-good','refreshing'],'young-adults':['feel-good','refreshing','exciting'],'middle-aged':['feel-good','comfortable','emotional'],'seniors':['comfortable','healing','nostalgic']},
        '힐링':{'teens':['comfortable','cozy','calm'],'young-adults':['healing','comfortable','calm'],'middle-aged':['healing','comfortable','calm'],'seniors':['healing','warm','comfortable']},
        '독서':{'teens':['focus','calm','immersive'],'young-adults':['calm','focus','immersive'],'middle-aged':['calm','focus','comfortable'],'seniors':['calm','comfortable','warm']},
        '사랑과 연애':{'teens':['flutter','love','exciting'],'young-adults':['love','flutter','emotional'],'middle-aged':['love','emotional','warm'],'seniors':['love','warm','nostalgic']},
        '이별과 상실':{'teens':['breakup','lonely','emotional'],'young-adults':['breakup','lonely','sentimental'],'middle-aged':['breakup','sentimental','comfort'],'seniors':['sentimental','comfort','nostalgic']},
        '그리움과 향수':{'teens':['nostalgic','sentimental','emotional'],'young-adults':['nostalgic','sentimental','emotional'],'middle-aged':['nostalgic','sentimental','warm'],'seniors':['nostalgic','warm','comfort']},
        '외로움과 고독':{'teens':['lonely','sentimental','emotional'],'young-adults':['lonely','sentimental','dawn-mood'],'middle-aged':['lonely','sentimental','comfort'],'seniors':['lonely','comfort','warm']},
        '밤과 새벽의 감정':{'teens':['emotional','dreamy','sentimental'],'young-adults':['dawn-mood','emotional','dreamy'],'middle-aged':['emotional','calm','nostalgic'],'seniors':['calm','nostalgic','warm']},
        '위로와 치유':{'teens':['comfort','warm','healing'],'young-adults':['comfort','healing','warm'],'middle-aged':['comfort','healing','warm'],'seniors':['comfort','warm','healing']},
        '파티와 자유':{'teens':['exciting','groovy','tension-up'],'young-adults':['exciting','groovy','tension-up'],'middle-aged':['feel-good','groovy','exciting'],'seniors':['feel-good','comfortable','groovy']},
        '요리/음식':{'teens':['feel-good','exciting','comfortable'],'young-adults':['comfortable','feel-good','cozy'],'middle-aged':['comfortable','warm','cozy'],'seniors':['warm','comfortable','nostalgic']},
        '게이밍':{'teens':['exciting','tension-up','confidence'],'young-adults':['exciting','tension-up','focus'],'middle-aged':['exciting','focus','feel-good'],'seniors':['feel-good','focus','comfortable']},
        '코딩/작업':{'teens':['focus','immersive','study'],'young-adults':['focus','immersive','calm'],'middle-aged':['focus','immersive','calm'],'seniors':['focus','calm','comfortable']},
        '아침루틴':{'teens':['refreshing','feel-good','exciting'],'young-adults':['refreshing','feel-good','calm'],'middle-aged':['refreshing','comfortable','calm'],'seniors':['comfortable','calm','healing']},
        '오후 티타임':{'teens':['comfortable','feel-good','calm'],'young-adults':['comfortable','calm','cozy'],'middle-aged':['comfortable','calm','healing'],'seniors':['comfortable','warm','healing']},
        '저녁식사':{'teens':['comfortable','feel-good','cozy'],'young-adults':['comfortable','cozy','warm'],'middle-aged':['comfortable','warm','calm'],'seniors':['warm','comfortable','nostalgic']},
        '데이트':{'teens':['flutter','love','exciting'],'young-adults':['love','flutter','emotional'],'middle-aged':['love','emotional','warm'],'seniors':['love','warm','nostalgic']},
        '혼자만의 시간':{'teens':['calm','emotional','dreamy'],'young-adults':['calm','emotional','comfortable'],'middle-aged':['calm','comfortable','healing'],'seniors':['calm','warm','nostalgic']},
        '비오는 날':{'teens':['emotional','calm','dreamy'],'young-adults':['rainy','emotional','calm'],'middle-aged':['rainy','calm','nostalgic'],'seniors':['rainy','calm','warm']},
        '눈오는 날':{'teens':['emotional','dreamy','flutter'],'young-adults':['snowy','emotional','calm'],'middle-aged':['snowy','nostalgic','warm'],'seniors':['snowy','warm','nostalgic']},
        '새벽감성':{'teens':['emotional','dreamy','sentimental'],'young-adults':['dawn-mood','emotional','dreamy'],'middle-aged':['dawn-mood','calm','nostalgic'],'seniors':['calm','nostalgic','warm']},
        '일몰/석양':{'teens':['emotional','calm','dreamy'],'young-adults':['sunset','emotional','calm'],'middle-aged':['sunset','nostalgic','warm'],'seniors':['sunset','warm','nostalgic']},
        '캠핑/야외':{'teens':['exciting','feel-good','refreshing'],'young-adults':['refreshing','feel-good','healing'],'middle-aged':['healing','refreshing','comfortable'],'seniors':['healing','comfortable','warm']},
        '수면/잠잘때':{'teens':['sleep','sleep-aid','calm'],'young-adults':['sleep','sleep-aid','calm'],'middle-aged':['sleep','sleep-aid','comfortable'],'seniors':['sleep','sleep-aid','warm']},
        '공부/시험':{'teens':['focus','study','immersive'],'young-adults':['focus','study','immersive'],'middle-aged':['focus','calm','immersive'],'seniors':['focus','calm','comfortable']},
        '졸업/입학':{'teens':['exciting','flutter','emotional'],'young-adults':['emotional','nostalgic','feel-good'],'middle-aged':['nostalgic','emotional','warm'],'seniors':['nostalgic','warm','emotional']},
        '기념일/축하':{'teens':['exciting','feel-good','groovy'],'young-adults':['feel-good','exciting','love'],'middle-aged':['feel-good','warm','emotional'],'seniors':['warm','nostalgic','feel-good']},
        '봄':{'teens':['flutter','refreshing','exciting'],'young-adults':['refreshing','flutter','feel-good'],'middle-aged':['refreshing','comfortable','emotional'],'seniors':['comfortable','warm','nostalgic']},
        '여름':{'teens':['exciting','refreshing','tension-up'],'young-adults':['exciting','refreshing','feel-good'],'middle-aged':['refreshing','feel-good','comfortable'],'seniors':['comfortable','healing','calm']},
        '가을':{'teens':['emotional','nostalgic','calm'],'young-adults':['emotional','nostalgic','sentimental'],'middle-aged':['nostalgic','calm','warm'],'seniors':['nostalgic','warm','comfortable']},
        '겨울':{'teens':['cozy','warm','emotional'],'young-adults':['cozy','warm','emotional'],'middle-aged':['warm','cozy','nostalgic'],'seniors':['warm','comfortable','nostalgic']},
        '감사와 고마움':{'teens':['warm','emotional','feel-good'],'young-adults':['warm','emotional','comfort'],'middle-aged':['warm','emotional','nostalgic'],'seniors':['warm','nostalgic','comfort']},
        '자신감/도전':{'teens':['confidence','exciting','tension-up'],'young-adults':['confidence','powerful','exciting'],'middle-aged':['confidence','powerful','feel-good'],'seniors':['confidence','feel-good','warm']},
        '명상/마음챙김':{'teens':['calm','comfortable','healing'],'young-adults':['calm','healing','comfortable'],'middle-aged':['healing','calm','comfortable'],'seniors':['healing','calm','warm']},
        '클럽/나이트':{'teens':['exciting','groovy','tension-up'],'young-adults':['exciting','groovy','tension-up'],'middle-aged':['groovy','exciting','feel-good'],'seniors':['feel-good','groovy','comfortable']},
        '페스티벌':{'teens':['exciting','tension-up','groovy'],'young-adults':['exciting','tension-up','groovy'],'middle-aged':['exciting','feel-good','groovy'],'seniors':['feel-good','comfortable','exciting']},
        '결혼/웨딩':{'teens':['flutter','love','exciting'],'young-adults':['love','flutter','emotional'],'middle-aged':['love','warm','emotional'],'seniors':['love','warm','nostalgic']},
        '육아/가족':{'teens':['warm','comfortable','feel-good'],'young-adults':['warm','comfortable','cozy'],'middle-aged':['warm','comfortable','emotional'],'seniors':['warm','nostalgic','emotional']},
        '반려동물':{'teens':['feel-good','warm','comfortable'],'young-adults':['warm','feel-good','comfortable'],'middle-aged':['warm','comfortable','healing'],'seniors':['warm','healing','comfortable']},
        '출발/시작':{'teens':['exciting','refreshing','confidence'],'young-adults':['refreshing','exciting','confidence'],'middle-aged':['refreshing','feel-good','confidence'],'seniors':['comfortable','warm','feel-good']},
        '응원/격려':{'teens':['exciting','confidence','powerful'],'young-adults':['confidence','powerful','exciting'],'middle-aged':['confidence','warm','comfort'],'seniors':['warm','comfort','confidence']},
        '회상/추억여행':{'teens':['nostalgic','emotional','sentimental'],'young-adults':['nostalgic','emotional','sentimental'],'middle-aged':['nostalgic','warm','emotional'],'seniors':['nostalgic','warm','comfort']},
        '일상/루틴':{'teens':['feel-good','comfortable','calm'],'young-adults':['comfortable','calm','feel-good'],'middle-aged':['comfortable','calm','warm'],'seniors':['comfortable','warm','calm']},
        '특별한 하루':{'teens':['exciting','feel-good','flutter'],'young-adults':['feel-good','exciting','emotional'],'middle-aged':['feel-good','emotional','warm'],'seniors':['warm','feel-good','nostalgic']}
    };

    const situationMoodKeywords = {
        'feel-good':['최고','행복','즐거','웃음','기분좋','맛있','재밌','재미있','승진','합격','성공','당첨','뿌듯','보람','만족','축하','칭찬','대견','자랑','선물받','감사','고마워','감격','잘했','대박','행운','기적','보너스','월급날'],
        'exciting':['신나','에너지','축제','파티','춤추','댄스','환호','응원','열광','떼창','불꽃','놀이공원','워터파크','모험','탐험','놀러','놀자','신난','흥분','열정','광란'],
        'comfortable':['편안','편하게','릴렉스','느긋','여유로','한가','누워서','소파','이불','낮잠','나른','늘어지','뒹굴','아무것도','느릿','천천히','쉬는','쉬고'],
        'calm':['조용','고요','평화','차분','잔잔','가만히','명상','적막','멍때리','바라보며','가만','고요한','정적','평온','평온한'],
        'healing':['힐링','치유','회복','충전','안식','치유되','치유의'],
        'warm':['따뜻','따스','온기','감싸','훈훈','온정','온기가','정이가'],
        'cozy':['포근','아늑','촛불','담요','벽난로','핫초코','모닥불','불멍','이불속','이불밖'],
        'emotional':['감동','울컥','뭉클','찡하','벅차','소름','전율','감격','가슴이','가슴뭉클','목놓아','목이메','눈시울','깊은감동'],
        'dreamy':['몽환','구름위','별빛','달빛','은하','우주','떠다니','비현실','신비','환상','동화','마법','꿈같','꿈속','꿈꾸'],
        'sentimental':['센치','감상적','씁쓸','아련','희미한','서글','묘한','형용할수없','말로표현','감상에'],
        'dawn-mood':['새벽감','밤새워','뜬 눈','잠 안 오','해뜨기전','여명','동틀녘','새벽3','새벽4','새벽5'],
        'flutter':['설레','두근','떨려','반하','좋아하는','고백','짝사랑','눈맞','손잡','썸타','심쿵','첫사랑','첫만남','첫눈에'],
        'love':['사랑','연인','커플','데이트','키스','포옹','안기','허그','영원히','프러포즈','결혼식','신혼','사랑해'],
        'lonely':['혼자서','외로','쓸쓸','텅 빈','고독','아무도없','홀로','공허','허전','비어있는','텅빈'],
        'breakup':['이별','헤어지','떠나가','잊지못','울면서','돌아서','마지막으로','놓아주','보내줘','안녕히','다시는'],
        'nostalgic':['추억','그때그','옛날','어릴때','어린시절','그립다','돌아가고','예전에','지난날','돌이키','회상','기억나','잊혀','세월이','시간이'],
        'focus':['집중하','몰두','공부하','과제','마감','데드라인','준비하','연습하','훈련','정신통일'],
        'immersive':['몰입','빠져들','정신없이','시간가는','잊고서','푹빠져','코딩','작곡','창작','클래식','오케스트라','콘서트홀','감상','연주','음악감상','음악듣','틀어놓고','눈감','귀기울'],
        'study':['공부','시험','수능','내신','기말','중간고사','암기','노트정리','도서관에서','자습'],
        'tension-up':['긴장','조마조마','초조','불안한','걱정되','무대위','발표하','면접','오디션','경기전','시합','대결','승부','떨리는마음'],
        'powerful':['파워풀','강렬한','폭발적','레전드','역대급','대단한','엄청난','최강','압도','위압'],
        'confidence':['자신감','할수있','해내','도전하','이겨내','극복','승리','챔피언','우승','당당','떳떳','나를믿','자신있'],
        'anger':['화나','분노','열받아','빡쳐서','때리고','부수고','폭발할','싸우','억울','불공평','짜증나','미워','배신'],
        'stress-relief':['지각','놓쳐','늦잠','짜증','스트레스','미치겠','죽겠','피곤한','지쳐서','힘든','빡쳐','열받아','망했','폭망','실수로','야근하','밤샘','잠못자','불면','안풀리','꼬여서','재수없','최악','엉망','퇴짜','거절당','탈락','불합격','실패'],
        'comfort':['위로','힘내','괜찮아','버텨','견뎌','아프다','아픔','상처받','슬퍼','서러워','눈물이','울었','응원','격려','토닥','안아줘','옆에있','곁에있','지켜줘'],
        'refreshing':['상쾌','시원한','산뜻','맑은','깨끗한','가뿐','개운','리프레시','새출발','리셋','재시작'],
        'groovy':['리듬','그루브','비트','춤을','흔들','박자','노래방','떼창','흥겨','흥이나'],
        'rainy':['비오는','비내리','빗소리','빗방울','우산을','장마','소나기','촉촉한','비가오','비가와','비올때'],
        'snowy':['눈오는','눈내리','눈이오','첫눈','눈송이','눈꽃','설경','눈사람','눈싸움','눈이와','눈이내'],
        'sunset':['석양','노을','일몰','해질녘','황혼','해넘이','해지는','주황빛','붉은하늘','해가지'],
        'sleep':['잠자','자장가','꿈나라','졸리','꾸벅','선잠','깊은잠','잠에','잠이들','잠잘'],
        'sleep-aid':['수면유도','불면증','뒤척이','잠들기','숙면','잠이안와','잠못드는']
    };

    function renderEasySituations() {
        const themeVal = easySituationTheme ? easySituationTheme.value : '';
        const ageKey = AGE_LABEL_TO_KEY[selections.target[0]] || '2030세대';
        if (!themeVal || typeof SITUATION_DATA === 'undefined') {
            if (easySituationSelect) {
                easySituationSelect.innerHTML = '<option value="">-- 위에서 카테고리를 먼저 선택하세요 --</option>';
                easySituationSelect.disabled = true;
            }
            return;
        }
        const pool = (SITUATION_DATA[themeVal] && SITUATION_DATA[themeVal][ageKey]) || [];
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 50);
        if (easySituationSelect) {
            easySituationSelect.innerHTML = '<option value="">-- 장소/상황 선택 --</option>';
            shuffled.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.label; opt.textContent = `${s.emoji} ${s.label}`;
                easySituationSelect.appendChild(opt);
            });
            easySituationSelect.disabled = false;
        }
    }

    // 1단계 입력 텍스트 기반으로 두 번째 드롭다운(장소/상황) 자동 선택
    function autoSelectSituation() {
        if (!easySituationSelect || easySituationSelect.options.length <= 1) return;
        const lower = (selections.freeText || '').toLowerCase();
        const words = lower.split(/[\s,\.]+/).filter(w => w.length >= 2);
        let bestIdx = 1; // 기본: 첫 번째 실제 항목
        // 사용자 입력 텍스트에 포함된 단어가 상황 라벨에 있으면 우선 선택
        for (let i = 1; i < easySituationSelect.options.length; i++) {
            const optText = easySituationSelect.options[i].textContent.toLowerCase();
            if (words.some(w => w.length >= 3 && optText.includes(w))) {
                bestIdx = i;
                break;
            }
        }
        easySituationSelect.selectedIndex = bestIdx;
        const themeVal = easySituationTheme ? easySituationTheme.value : '';
        const ageKey = selections.target[0] || 'young-adults';
        const placeEntry = themePlaceMap[themeVal];
        selections.place = (placeEntry && (placeEntry[ageKey] || placeEntry['_default'])) || ['home'];
        const selectedOpt = easySituationSelect.options[bestIdx];
        if (selectedOpt) showSituationPreview(selectedOpt.textContent.trim());
        recalcThemeMoods();
    }

    if (easySituationTheme) {
        easySituationTheme.addEventListener('change', () => {
            renderEasySituations();
            if (easySituationSelect) easySituationSelect.value = '';
            selections.place = []; selections._themeMoods = [];
            situationPreview.style.display = 'none';
            confirmed.step3 = false; confirmed.step4 = false; confirmed.step5 = false;
            confirmedSituationText = '';
            document.getElementById('step3Feedback').classList.remove('active');
        });
    }
    if (easySituationSelect) {
        easySituationSelect.addEventListener('change', () => {
            const themeVal = easySituationTheme ? easySituationTheme.value : '';
            if (easySituationSelect.value && themeVal) {
                const ageKey = selections.target[0] || 'young-adults';
                const placeEntry = themePlaceMap[themeVal];
                selections.place = (placeEntry && (placeEntry[ageKey] || placeEntry['_default'])) || ['home'];
                const selectedOption = easySituationSelect.options[easySituationSelect.selectedIndex];
                showSituationPreview(selectedOption.textContent.trim());
            } else {
                selections.place = []; selections._themeMoods = [];
                situationPreview.style.display = 'none';
            }
        });
    }

    // ============================================================
    // 단계 이동 (goToStep)
    // ============================================================
    function goToStep(step) {
        stepPages.forEach(p => p.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');

        stepItems.forEach((item, i) => {
            const n = i + 1;
            item.classList.remove('active', 'done');
            if (n < step) item.classList.add('done');
            else if (n === step) item.classList.add('active');
        });
        stepLines.forEach((line, i) => line.classList.toggle('done', i < step - 1));

        if (navButtons) navButtons.style.display = 'none';
        currentStep = step;
        updateApplyButtons();

        if (step === 2) {
            applyAutoFillToStep2();
            if (_lastStep3Target !== (selections.target[0] || '')) {
                // target changed — will reset step3 on entry to step3
            }
            updateApplyButtons();
        }

        if (step === 3) {
            if (_lastStep3Target !== (selections.target[0] || '')) {
                _lastStep3Target = selections.target[0] || '';
                selections.place = []; selections._themeMoods = [];
                situationPreview.style.display = 'none';
                confirmed.step3 = false; confirmedSituationText = '';
                document.getElementById('step3Feedback').classList.remove('active');
            }
            // 1단계 입력 분석 결과로 카테고리 + 상황 자동 선택
            if (selections._autoTheme && easySituationTheme && !confirmed.step3) {
                easySituationTheme.value = selections._autoTheme;
                renderEasySituations();
                autoSelectSituation();
            }
        }

        if (step === 4) {
            const ctxEl = document.getElementById('step3SituationContext');
            const txtEl = document.getElementById('step3SituationText');
            if (ctxEl && txtEl && confirmedSituationText) {
                txtEl.textContent = confirmedSituationText; ctxEl.style.display = 'block';
            } else if (ctxEl) { ctxEl.style.display = 'none'; }
            if (confirmedSituationText) recalcThemeMoodsFromText(confirmedSituationText);
            else recalcThemeMoods();
            autoRecommendMoods();
            updateApplyButtons();
        }

        if (step === 5) {
            _shownGenreHistory = [];
            buildGenreRecommendations();
            updateApplyButtons();
        }

        if (step === 6) buildFinalPrompt();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 4단계 분위기 자동 추천
    let _lastAutoMoods = [];
    function autoRecommendMoods() {
        const fillMoods = selections._autoFillMoods || [];
        const themeMoods = selections._themeMoods || [];
        const allMoods = [...new Set([...fillMoods, ...themeMoods])];
        if (allMoods.length === 0) return;
        const step4 = document.getElementById('step4');
        _lastAutoMoods.forEach(moodKey => {
            const btn = step4.querySelector(`.option-card[data-value="${moodKey}"]`);
            if (btn && btn.classList.contains('selected') && _lastAutoMoods.includes(moodKey)) btn.classList.remove('selected');
        });
        const toSelect = allMoods.slice(0, 3);
        toSelect.forEach(moodKey => {
            const btn = step4.querySelector(`.option-card[data-value="${moodKey}"]`);
            if (btn && !btn.classList.contains('selected')) btn.classList.add('selected');
        });
        _lastAutoMoods = toSelect.slice();
        const selected = step4.querySelectorAll('.option-card.selected');
        selections.mood = Array.from(selected).map(c => c.dataset.value);
    }

    // 단계별 nav 버튼 이벤트
    document.getElementById('btnNextStep2')?.addEventListener('click', () => {
        if (confirmed.step2) { updateSelections(); goToStep(3); }
        else { alert('먼저 타겟층을 선택하고 적용하기를 눌러주세요.'); }
    });
    document.getElementById('btnNextStep3')?.addEventListener('click', () => {
        if (confirmed.step3) goToStep(4);
        else { alert('먼저 상황을 선택하고 적용하기를 눌러주세요.'); }
    });
    document.getElementById('btnNextStep4')?.addEventListener('click', () => {
        if (confirmed.step4) { updateSelections(); goToStep(5); }
        else { alert('먼저 분위기를 선택하고 적용하기를 눌러주세요.'); }
    });
    document.getElementById('btnNextStep5')?.addEventListener('click', () => {
        if (confirmed.step5 && confirmed.vocal) goToStep(6);
        else if (!confirmed.step5) { alert('먼저 장르를 선택하고 적용하기를 눌러주세요.'); }
        else { alert('보컬 설정을 완료해주세요.'); }
    });

    document.getElementById('btnPrevStep2')?.addEventListener('click', () => goToStep(1));
    document.getElementById('btnPrevStep3')?.addEventListener('click', () => goToStep(2));
    document.getElementById('btnPrevStep4')?.addEventListener('click', () => goToStep(3));
    document.getElementById('btnPrevStep5')?.addEventListener('click', () => goToStep(4));
    document.getElementById('btnPrevStep')?.addEventListener('click', () => goToStep(5));

    // ============================================================
    // STEP 5: 장르 추천 + 선택
    // ============================================================
    let _shownGenreHistory = [];

    function buildGenreRecommendations() {
        const targetText = selections.target.map(v => labelMap[v]).join(', ');
        const placeText = selections.place.map(v => labelMap[v] || v).join(', ');
        const moodText = selections.mood.map(v => labelMap[v]).join(', ');
        document.getElementById('miniTarget').textContent = '👤 ' + targetText;
        document.getElementById('miniPlace').textContent = '📍 ' + placeText;
        document.getElementById('miniMood').textContent = '🎵 ' + moodText;

        const selectedNames = selections.genres.slice();
        const excludeNames = selectedNames.concat(customGenres.map(g => g.genre));
        const neededCount = 5 - selectedNames.length - customGenres.filter(g => selections.genres.includes(g.genre)).length;
        const newRecs = recommendGenresExcluding(selections.target, selections.place, selections.mood, excludeNames, Math.max(0, neededCount));
        const selectedData = selectedNames.map(name => GENRE_DATABASE.find(g => g.genre === name) || customGenres.find(g => g.genre === name) || null).filter(Boolean).map(g => ({...g}));
        const unselectedCustom = customGenres.filter(g => !selections.genres.includes(g.genre));
        recommendedGenres = [...selectedData, ...unselectedCustom, ...newRecs].slice(0, Math.max(5, selectedData.length + unselectedCustom.length));
        renderGenreCards();
        updateGenreSelectInfo();
    }

    function recommendGenresExcluding(targetAges, places, moods, excludeNames, count) {
        if (count <= 0) return [];
        const allMoods = [...moods];
        if (selections._themeMoods) selections._themeMoods.forEach(m => { if (!allMoods.includes(m)) allMoods.push(m); });
        const mappedAges = targetAges.flatMap(t => AGE_MAP[t] || []);
        const mappedPlaces = places.map(p => PLACE_MAP[p]).filter(Boolean);
        const moodKeywords = [];
        allMoods.forEach(moodKey => { (MOOD_TO_GENRE_MAP[moodKey] || []).forEach(v => { if (!moodKeywords.includes(v)) moodKeywords.push(v); }); });
        const genreConflicts = [
            ['집중','신나는'],['집중','텐션업'],['집중','흥겨운'],['집중','파워풀한'],
            ['공부할때','신나는'],['공부할때','텐션업'],['공부할때','흥겨운'],
            ['몰입','신나는'],['몰입','흥겨운'],
            ['잠잘때','신나는'],['잠잘때','텐션업'],['잠잘때','파워풀한'],['잠잘때','흥겨운'],
            ['수면유도','신나는'],['수면유도','텐션업'],['수면유도','파워풀한'],
            ['편안한','분노'],['편안한','텐션업'],
            ['힐링','분노'],['힐링','텐션업'],['힐링','파워풀한'],
            ['쓸쓸한','신나는'],['쓸쓸한','기분좋은'],['쓸쓸한','흥겨운'],
            ['위로','신나는'],['위로','텐션업'],['감성적','분노'],
            ['잔잔한','텐션업'],['잔잔한','파워풀한'],['잔잔한','분노']
        ];
        const allExcludes = [...new Set([...excludeNames, ..._shownGenreHistory])];

        function scoreGenres(excludeList, requireMoodMatch, useConflictFilter) {
            const scores = {};
            GENRE_DATABASE.forEach(genre => {
                if (excludeList.includes(genre.genre)) return;
                let score = 0;
                if (mappedAges.length > 0 && !genre.age.some(a => mappedAges.includes(a))) return;
                score += 3;
                if (mappedPlaces.length > 0 && genre.place.some(p => mappedPlaces.includes(p))) score += 4;
                if (moodKeywords.length > 0) {
                    const moodHits = genre.mood.filter(m => moodKeywords.includes(m)).length;
                    if (requireMoodMatch && moodHits === 0) return;
                    score += moodHits * 5;
                }
                if (useConflictFilter) {
                    const moodKorNames = allMoods.map(v => labelMap[v]).filter(Boolean);
                    const hasConflict = genreConflicts.some(([a,b]) => (moodKorNames.includes(a) && genre.mood.includes(b)) || (moodKorNames.includes(b) && genre.mood.includes(a)));
                    if (hasConflict) return;
                }
                score += Math.random() * 1.5;
                scores[genre.genre] = { genreData: genre, score };
            });
            return Object.values(scores).sort((a,b) => b.score - a.score).map(e => e.genreData);
        }

        let results = scoreGenres(allExcludes, true, true);
        if (results.length < count) results = [...results, ...scoreGenres(allExcludes, false, true).filter(g => !results.includes(g))];
        if (results.length < count) results = [...results, ...scoreGenres(allExcludes, false, false).filter(g => !results.includes(g))];
        if (results.length < count) results = [...results, ...scoreGenres(excludeNames, false, false).filter(g => !results.includes(g))];
        const top = results.slice(0, count);
        top.forEach(g => _shownGenreHistory.push(g.genre));
        return top;
    }

    function buildGenreDescription(g) {
        const parts = [];
        if (g.desc) parts.push(g.desc);
        if (g.age && g.age.length) parts.push('연령: ' + g.age.join(', '));
        if (g.place && g.place.length) parts.push('장소: ' + g.place.slice(0, 3).join(', '));
        if (g.mood && g.mood.length) parts.push('분위기: ' + g.mood.slice(0, 3).join(', '));
        return parts.join(' | ');
    }

    function buildRecommendReason(g, sel) {
        const parts = [];
        const ageKor = sel.target.map(v => labelMap[v]).filter(Boolean);
        if (ageKor.length && g.age.some(a => sel.target.flatMap(t => AGE_MAP[t] || []).includes(a))) parts.push(ageKor.join('/') + ' 연령대에 잘 맞음');
        if (sel.place.length && g.place.some(p => sel.place.map(v => PLACE_MAP[v]).includes(p))) parts.push(sel.place.map(v => labelMap[v] || v).join('/') + ' 장소에 어울림');
        if (sel.mood.length) {
            const overlap = g.mood.filter(m => sel.mood.flatMap(v => MOOD_TO_GENRE_MAP[v] || []).includes(m));
            if (overlap.length) parts.push(overlap.join(', ') + ' 분위기 매칭');
        }
        return parts.length ? parts.join('. ') + '.' : '다양한 상황에 어울리는 장르';
    }

    function renderGenreCards() {
        const container = document.getElementById('genreRecommendList');
        container.innerHTML = '';
        recommendedGenres.forEach((g, i) => {
            const isSelected = selections.genres.includes(g.genre);
            const isDisabled = !isSelected && selections.genres.length >= 2;
            const selIdx = selections.genres.indexOf(g.genre);
            let roleHtml = '', cardClass = 'genre-rec-card';
            if (selIdx === 0) { roleHtml = '<span class="genre-rec-role main-role">⭐ 메인 장르</span>'; cardClass += ' selected main-genre'; }
            else if (selIdx === 1) { roleHtml = '<span class="genre-rec-role blend-role">🎨 블렌딩 장르</span>'; cardClass += ' selected blend-genre'; }
            if (isDisabled) cardClass += ' disabled';
            const reason = buildRecommendReason(g, selections);
            const ageTagsHtml = (g.age || []).map(a => `<span class="genre-rec-tag">👤 ${a}</span>`).join('');
            const placeTagsHtml = (g.place || []).map(p => `<span class="genre-rec-tag">📍 ${p}</span>`).join('');
            const moodTagsHtml = (g.mood || []).map(m => `<span class="genre-rec-tag">🎵 ${m}</span>`).join('');
            const card = document.createElement('div');
            card.className = cardClass; card.dataset.genre = g.genre;
            card.innerHTML = `
                <div class="genre-rec-rank">${selIdx === 0 ? '⭐' : selIdx === 1 ? '🎨' : i + 1}</div>
                <div class="genre-rec-content">
                    <div class="genre-rec-name">${g.genre} ${roleHtml}</div>
                    <div class="genre-rec-main">${g.main || ''} ${g.sub ? '> ' + g.sub : ''}</div>
                    <div class="genre-rec-desc">${g.desc || ''}</div>
                    ${reason ? `<div class="genre-rec-desc" style="color:var(--primary);font-weight:500;">💡 <strong>추천 이유:</strong> ${reason}</div>` : ''}
                    <div class="genre-rec-tags">${ageTagsHtml} ${placeTagsHtml} ${moodTagsHtml}</div>
                </div>`;
            if (!isDisabled) {
                card.addEventListener('click', () => {
                    toggleGenreSelection(g.genre, g);
                    renderGenreCards(); refreshSearchResultCards(); updateGenreSelectInfo(); updateApplyButtons();
                });
            }
            container.appendChild(card);
        });
    }

    function toggleGenreSelection(genreName, genreData) {
        const idx = selections.genres.indexOf(genreName);
        if (idx > -1) selections.genres.splice(idx, 1);
        else if (selections.genres.length < 2) selections.genres.push(genreName);
        confirmed.step5 = false; confirmed.vocal = false;
        showGeneratePromptBtn(false);
        updateGenreSelectInfo(); updateApplyButtons();
    }

    function updateGenreSelectInfo() {
        const info = document.getElementById('genreSelectInfo');
        if (!info) return;
        if (selections.genres.length === 0) {
            info.innerHTML = '<p>장르를 선택해주세요 (최대 2개)</p>'; info.className = 'genre-select-info';
        } else if (selections.genres.length === 1) {
            info.innerHTML = `<p>✅ 메인 장르: <strong>${selections.genres[0]}</strong> | 블렌딩 장르 1개 더 선택 가능 (선택 안 해도 됩니다)</p>`;
            info.className = 'genre-select-info has-selection';
        } else {
            info.innerHTML = `<p>✅ 메인: <strong>${selections.genres[0]}</strong> + 블렌딩: <strong>${selections.genres[1]}</strong> | 아래 적용하기를 눌러주세요</p>`;
            info.className = 'genre-select-info max-selection';
        }
    }

    document.getElementById('btnRegenerate')?.addEventListener('click', () => {
        _shownGenreHistory = _shownGenreHistory.filter(name => selections.genres.includes(name));
        buildGenreRecommendations();
    });

    // 장르 검색
    const customInput = document.getElementById('customGenreInput');
    const btnSearchGenre = document.getElementById('btnSearchGenre');
    const searchResultsArea = document.getElementById('searchResultsArea');
    if (customInput && btnSearchGenre && searchResultsArea) {
        let lastSearchQuery = '', searchShownGenres = [];

        btnSearchGenre.addEventListener('click', () => {
            const query = customInput.value.trim();
            if (!query) return;
            if (btnSearchGenre.classList.contains('is-retry') && query === lastSearchQuery) {
                searchShownGenres = searchShownGenres.slice(0, searchShownGenres.length - 5);
                renderSearchResults(query, searchShownGenres); return;
            }
            lastSearchQuery = query; searchShownGenres = [];
            renderSearchResults(query, searchShownGenres);
        });
        customInput.addEventListener('keydown', e => { if (e.key === 'Enter') btnSearchGenre.click(); });
        document.getElementById('btnCloseSearch')?.addEventListener('click', () => {
            searchResultsArea.style.display = 'none'; customInput.value = '';
            btnSearchGenre.textContent = '검색'; btnSearchGenre.classList.remove('is-retry');
            lastSearchQuery = ''; searchShownGenres = [];
        });
        document.getElementById('btnSearchMore')?.addEventListener('click', () => renderSearchResults(lastSearchQuery, searchShownGenres));

        function renderSearchResults(rawQuery, alreadyShown) {
            const query = rawQuery.toLowerCase();
            const mainGenreName = selections.genres[0] || '';
            const mainGenreData = GENRE_DATABASE.find(g => g.genre === mainGenreName) || null;
            const scored = GENRE_DATABASE.filter(g => !alreadyShown.includes(g.genre)).map(g => {
                let score = 0;
                const gl = g.genre.toLowerCase(), ml = (g.main||'').toLowerCase(), sl = (g.sub||'').toLowerCase(), dl = (g.desc||'').toLowerCase();
                if (gl === query) score += 100; else if (gl.startsWith(query)) score += 50; else if (gl.includes(query)) score += 30;
                if (ml.includes(query)) score += 20; if (sl.includes(query)) score += 15; if (dl.includes(query)) score += 5;
                if (mainGenreData) {
                    score += g.mood.filter(m => mainGenreData.mood.includes(m)).length * 3;
                    score += g.place.filter(p => mainGenreData.place.includes(p)).length * 2;
                    if (g.main === mainGenreData.main) score += 10;
                }
                return { genre: g, score };
            }).filter(e => e.score > 0).sort((a,b) => b.score - a.score);

            const top5 = scored.slice(0, 5).map(e => e.genre);
            const btnMore = document.getElementById('btnSearchMore');
            const noMoreEl = document.getElementById('searchNoMore');
            if (top5.length === 0) {
                noMoreEl.style.display = 'block'; btnMore.style.display = 'none';
                searchResultsArea.style.display = 'block';
                document.getElementById('searchResultsTitle').textContent = `"${rawQuery}" 검색 결과가 없습니다`;
                document.getElementById('searchResultsList').innerHTML = '';
                return;
            }
            top5.forEach(g => searchShownGenres.push(g.genre));
            if (scored.length - 5 > 0) { btnMore.style.display = ''; noMoreEl.style.display = 'none'; }
            else { btnMore.style.display = 'none'; noMoreEl.style.display = top5.length > 0 ? 'none' : 'block'; }

            const titleText = mainGenreName ? `"${rawQuery}" 검색 결과 — "${mainGenreName}"과(와) 잘 어울리는 장르` : `"${rawQuery}" 검색 결과`;
            document.getElementById('searchResultsTitle').textContent = titleText;
            const container = document.getElementById('searchResultsList');
            container.innerHTML = '';
            top5.forEach((g, i) => {
                const isSelected = selections.genres.includes(g.genre);
                const isDisabled = !isSelected && selections.genres.length >= 2;
                let blendReason = '';
                if (mainGenreData) {
                    const parts = [];
                    if (g.main === mainGenreData.main) parts.push('같은 장르 계열로 자연스러운 블렌딩 가능');
                    else parts.push('크로스오버로 독특한 사운드 가능');
                    const moo = g.mood.filter(m => mainGenreData.mood.includes(m));
                    if (moo.length) parts.push(moo.join(', ') + ' 분위기가 공통됨');
                    blendReason = parts.join('. ') + '.';
                } else { blendReason = buildRecommendReason(g, selections); }
                const ageTagsHtml = g.age.map(a => `<span class="genre-rec-tag">👤 ${a}</span>`).join('');
                const placeTagsHtml = g.place.map(p => `<span class="genre-rec-tag">📍 ${p}</span>`).join('');
                const moodTagsHtml = g.mood.map(m => `<span class="genre-rec-tag">🎵 ${m}</span>`).join('');
                const card = document.createElement('div');
                card.className = 'genre-rec-card' + (isSelected ? ' selected' : '') + (isDisabled ? ' disabled' : '');
                card.dataset.genre = g.genre;
                card.innerHTML = `<div class="genre-rec-rank">${i+1}</div><div class="genre-rec-content">
                    <div class="genre-rec-name">${g.genre}</div>
                    <div class="genre-rec-main">${g.main} > ${g.sub||''}</div>
                    <div class="genre-rec-desc">${g.desc}</div>
                    <div class="genre-rec-desc" style="color:var(--primary);font-weight:500;">💡 <strong>블렌딩 추천 이유:</strong> ${blendReason}</div>
                    <div class="genre-rec-tags">${ageTagsHtml} ${placeTagsHtml} ${moodTagsHtml}</div>
                </div>`;
                if (!isDisabled) {
                    card.addEventListener('click', () => {
                        toggleGenreSelection(g.genre, g); renderGenreCards(); refreshSearchResultCards();
                    });
                }
                container.appendChild(card);
            });
            searchResultsArea.style.display = 'block'; customInput.value = '';
            btnSearchGenre.textContent = '🔄 다시 검색'; btnSearchGenre.classList.add('is-retry');
            searchResultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function refreshSearchResultCards() {
            document.querySelectorAll('#searchResultsList .genre-rec-card').forEach(card => {
                const name = card.dataset.genre, selIdx = selections.genres.indexOf(name);
                card.classList.toggle('selected', selIdx > -1);
                card.classList.toggle('main-genre', selIdx === 0);
                card.classList.toggle('blend-genre', selIdx === 1);
                card.classList.toggle('disabled', selIdx === -1 && selections.genres.length >= 2);
                const nameEl = card.querySelector('.genre-rec-name');
                if (selIdx === 0) nameEl.innerHTML = `${name} <span class="genre-rec-role main-role">⭐ 메인 장르</span>`;
                else if (selIdx === 1) nameEl.innerHTML = `${name} <span class="genre-rec-role blend-role">🎨 블렌딩 장르</span>`;
                else nameEl.innerHTML = name;
            });
        }

        customInput.addEventListener('input', () => {
            if (customInput.value.trim() !== lastSearchQuery) { btnSearchGenre.textContent = '검색'; btnSearchGenre.classList.remove('is-retry'); }
        });
    }

    // ============================================================
    // STEP 6: 최종 프롬프트 생성
    // ============================================================
    let generatedExcludeBase = '', userExcludeTags = [];

    function buildFinalPrompt() {
      try {
        if (importedPromptData) {
            const data = importedPromptData;
            document.getElementById('promptExplanation').textContent = data.explanation || '불러온 프롬프트입니다. 아래에서 수정 후 사용하세요.';
            document.getElementById('stylePromptText').value = data.stylePrompt;
            document.getElementById('stylePromptKor').innerHTML = '📌 <strong>한국어 설명:</strong> 이전에 저장한 프롬프트를 불러왔습니다.';
            generatedExcludeBase = data.excludeStyles; userExcludeTags = [];
            updateExcludeStylesText();
            document.querySelectorAll('.exclude-tag-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('excludeStylesKor').textContent = '📌 불러온 Exclude Styles입니다.';
            const w = data.weirdness, s = data.styleInfluence;
            document.getElementById('weirdnessFill').style.width = w + '%'; document.getElementById('weirdnessValue').textContent = w + '%';
            document.getElementById('styleInfluenceFill').style.width = s + '%'; document.getElementById('styleInfluenceValue').textContent = s + '%';
            document.getElementById('moreOptionsKor').innerHTML = buildMoreOptionsKorDesc(w, s);
            initExcludeToggles(); updateVocalTypeBadge(data.stylePrompt);
            document.getElementById('simplePromptText').value = data.simplePrompt || data.stylePrompt.substring(0, 490);
            document.getElementById('simplePromptKor').innerHTML = '📌 <strong>Simple 모드용:</strong> 불러온 프롬프트의 Simple 버전입니다.';
            importedPromptData = null; return;
        }

        const vocalOpts = selections.vocalType ? { type: selections.vocalType, age: selections.vocalAge, range: selections.vocalRange, styles: selections.vocalStyles } : undefined;
        const result = generatePrompt(selections.genres, selections.target, selections.place, selections.mood, vocalOpts);

        document.getElementById('promptExplanation').textContent = result.korExplanation;
        document.getElementById('stylePromptText').value = result.stylePrompt;
        document.getElementById('stylePromptKor').innerHTML = buildStyleKorDesc(result);
        document.getElementById('simplePromptText').value = result.simplePrompt;
        document.getElementById('simplePromptKor').innerHTML = '📌 <strong>Simple 모드용:</strong> Suno AI Simple 모드에서 바로 사용할 수 있는 500자 미만 프롬프트입니다. (' + result.simplePrompt.length + '자)';

        generatedExcludeBase = result.excludeStyles; userExcludeTags = [];
        updateExcludeStylesText();
        document.querySelectorAll('.exclude-tag-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('excludeStylesKor').innerHTML = buildExcludeKorDesc(result.excludeStyles);

        const { weirdness, styleInfluence } = result.moreOptions;
        document.getElementById('weirdnessFill').style.width = weirdness + '%'; document.getElementById('weirdnessValue').textContent = weirdness + '%';
        document.getElementById('styleInfluenceFill').style.width = styleInfluence + '%'; document.getElementById('styleInfluenceValue').textContent = styleInfluence + '%';
        document.getElementById('moreOptionsKor').innerHTML = buildMoreOptionsKorDesc(weirdness, styleInfluence);

        initExcludeToggles(); updateVocalTypeBadge(result.stylePrompt, result.mainGenre);
        autoSaveToLibrary(result);
      } catch(e) {
        console.error('buildFinalPrompt error:', e);
        document.getElementById('promptExplanation').textContent = '프롬프트 생성 중 오류가 발생했습니다: ' + e.message;
        document.getElementById('stylePromptText').value = '오류: ' + e.message;
      }
    }

    function updateVocalTypeBadge(stylePrompt, mainGenreData) {
        const badge = document.getElementById('vocalTypeBadge');
        if (!badge) return;
        const prompt = (stylePrompt || '').toLowerCase();
        const vf = (mainGenreData && mainGenreData.vocal) ? mainGenreData.vocal.toLowerCase() : '';
        const combined = prompt + ' ' + vf;
        const hasMale = /\bmale\s*vocal/.test(combined) && !/female\s*vocal/.test(combined);
        const hasFemale = /female\s*vocal/.test(combined);
        const hasBoth = /\bmale\s*vocal/.test(combined) && /female\s*vocal/.test(combined);
        badge.className = 'vocal-type-badge';
        if (hasBoth) { badge.textContent = '🎤 남녀 보컬'; badge.classList.add('unspecified'); }
        else if (hasFemale) { badge.textContent = '🎤 여성 보컬'; badge.classList.add('female'); }
        else if (hasMale) { badge.textContent = '🎤 남성 보컬'; badge.classList.add('male'); }
        else { badge.textContent = '🎤 보컬 미지정'; badge.classList.add('unspecified'); }
    }

    function autoSaveToLibrary(result) {
        const STORAGE_KEY = 'suno-master-library';
        let lib = [];
        try { lib = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch {}
        lib.push({
            id: 'prompt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            createdAt: new Date().toISOString(),
            freeText: selections.freeText,
            target: selections.target.map(v => labelMap[v] || v),
            place: selections.place.map(v => labelMap[v] || v),
            mood: selections.mood.map(v => labelMap[v] || v),
            genres: selections.genres,
            stylePrompt: result.stylePrompt,
            excludeStyles: result.excludeStyles,
            weirdness: result.moreOptions.weirdness,
            styleInfluence: result.moreOptions.styleInfluence,
            explanation: result.korExplanation,
            favorite: false, memo: ''
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lib));
    }

    let excludeTogglesInitialized = false;
    function initExcludeToggles() {
        if (excludeTogglesInitialized) return;
        excludeTogglesInitialized = true;
        document.querySelectorAll('.exclude-tag-btn').forEach(btn => {
            const value = btn.dataset.value;

            // 이미 generatedExcludeBase에 있는 항목은 활성화 상태로 표시
            if (generatedExcludeBase) {
                const baseParts = generatedExcludeBase.split(', ').map(p => p.trim().toLowerCase());
                if (baseParts.includes(value.toLowerCase())) {
                    btn.classList.add('active');
                }
            }

            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                if (btn.classList.contains('active')) { if (!userExcludeTags.includes(value)) userExcludeTags.push(value); }
                else {
                    userExcludeTags = userExcludeTags.filter(t => t !== value);
                    // 기본 생성 항목에서도 제거
                    if (generatedExcludeBase) {
                        const baseParts = generatedExcludeBase.split(', ').filter(Boolean);
                        generatedExcludeBase = baseParts.filter(p => p.toLowerCase() !== value.toLowerCase()).join(', ');
                    }
                }
                updateExcludeStylesText();
            });
            btn.title = btn.dataset.kor;
        });
        const excludeInput = document.getElementById('excludeCustomInput');
        const btnAddExclude = document.getElementById('btnAddExclude');
        btnAddExclude.addEventListener('click', () => addExcludeCustom(excludeInput));
        excludeInput.addEventListener('keydown', e => { if (e.key === 'Enter') addExcludeCustom(excludeInput); });
    }

    function addExcludeCustom(input) {
        const value = input.value.trim().toLowerCase();
        if (!value || userExcludeTags.includes(value)) { input.value = ''; return; }
        userExcludeTags.push(value);
        const grid = document.querySelector('.exclude-btn-grid');
        const btn = document.createElement('button');
        btn.className = 'exclude-tag-btn active'; btn.dataset.value = value;
        btn.dataset.kor = '사용자 추가 항목'; btn.title = '사용자 추가 항목'; btn.textContent = value;
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) { if (!userExcludeTags.includes(value)) userExcludeTags.push(value); }
            else { userExcludeTags = userExcludeTags.filter(t => t !== value); }
            updateExcludeStylesText();
        });
        grid.appendChild(btn); input.value = ''; updateExcludeStylesText();
    }

    function updateExcludeStylesText() {
        const baseParts = generatedExcludeBase ? generatedExcludeBase.split(', ').filter(Boolean) : [];
        const allParts = [...new Set([...baseParts, ...userExcludeTags])];
        const fullText = allParts.join(', ');
        document.getElementById('excludeStylesText').value = fullText;
        document.getElementById('excludeStylesKor').innerHTML = buildExcludeKorDesc(fullText);
    }

    const excludeEngToKor = {
        'metal':'메탈','hardcore':'하드코어','screamo':'스크리모','thrash':'스래쉬','deathcore':'데스코어',
        'industrial':'인더스트리얼','aggressive':'공격적인','distorted':'왜곡된','screaming':'비명',
        'harsh noise':'거친 노이즈','heavy metal':'헤비메탈',
        'ambient':'앰비언트','meditation':'명상','lullaby':'자장가','drone':'드론',
        'spa':'스파','sleepy':'졸린','minimal ambient':'미니멀 앰비언트',
        'intro':'인트로','reverb':'리버브','fade in':'페이드인','distortion':'디스토션',
        'noise':'노이즈','falsetto':'팔세토','echo':'에코','choir':'합창',
        'sound effects':'사운드 이펙트','four-on-the-floor kick':'4비트 킥'
    };

    function buildExcludeKorDesc(excludeText) {
        if (!excludeText) return '';
        const parts = excludeText.split(', ').filter(Boolean);
        const korParts = parts.map(eng => {
            const key = Object.keys(excludeEngToKor).find(k => eng.toLowerCase().includes(k));
            return key ? `${excludeEngToKor[key]}(${eng})` : eng;
        });
        return `📌 <strong>한국어 번역:</strong> ${korParts.join(', ')} — 이 스타일들을 제외하면 AI가 더 정확한 음악을 만들어줍니다.`;
    }

    const instrumentEngToKor = {
        'piano':'피아노','acoustic guitar':'어쿠스틱 기타','electric guitar':'일렉트릭 기타',
        'bass guitar':'베이스 기타','bass':'베이스','drums':'드럼','drum':'드럼',
        'synthesizer':'신디사이저','synth':'신디사이저','strings':'현악기','brass':'관악기',
        'saxophone':'색소폰','sax':'색소폰','flute':'플루트','violin':'바이올린',
        'cello':'첼로','organ':'오르간','harmonica':'하모니카','ukulele':'우쿨렐레',
        'percussion':'타악기','choir':'합창','orchestra':'오케스트라',
        'guitar':'기타','horn':'호른','trumpet':'트럼펫','harp':'하프',
        'claps':'클랩','tambourine':'탬버린','shaker':'셰이커'
    };
    const vocalEngToKor = {
        'male vocals':'남성 보컬','female vocals':'여성 보컬','male vocal':'남성 보컬','female vocal':'여성 보컬',
        'airy vocals':'공기감 있는 보컬','smooth vocals':'부드러운 보컬','powerful vocals':'파워풀한 보컬',
        'emotional vocals':'감성적인 보컬','soulful vocals':'소울풀한 보컬','warm vocals':'따뜻한 보컬',
        'breathy':'숨소리 섞인','belting':'시원한 고음','falsetto':'가성',
        'vibrato':'비브라토','whisper':'속삭임','rap':'랩','raspy':'허스키',
        'intimate':'친밀한','soaring':'치솟는','catchy':'중독성 있는','hook':'훅',
        'harmonies':'화음','chorus':'코러스','verse':'벌스'
    };

    function buildStyleKorDesc(result) {
        const mainGenre = result.mainGenre, subGenre = result.subGenre;
        let html = '📌 <strong>한국어 번역:</strong><br>';
        if (mainGenre && subGenre) html += `• 장르: "${mainGenre.genre}"(메인) + "${subGenre.genre}"(블렌딩) 혼합<br>`;
        else if (mainGenre) html += `• 장르: "${mainGenre.genre}"<br>`;
        let descParts = [];
        if (mainGenre && mainGenre.desc) descParts.push(mainGenre.desc);
        if (subGenre && subGenre.desc) descParts.push(subGenre.desc);
        if (descParts.length) html += `• 설명: ${descParts.join(' ')}<br>`;
        const bpmMatch = result.stylePrompt.match(/(\d+)\s*BPM/);
        const bpm = bpmMatch ? parseInt(bpmMatch[1]) : 110;
        const bpmDesc = bpm < 80 ? '느린 속도' : bpm < 110 ? '보통 속도' : bpm < 130 ? '약간 빠른 속도' : '빠른 속도';
        html += `• 템포: ${bpm} BPM (${bpmDesc})<br>`;
        const moodKor = selections.mood.map(v => labelMap[v]).filter(Boolean);
        if (moodKor.length) html += `• 분위기: ${moodKor.join(', ')}<br>`;
        if (mainGenre && mainGenre.instruments) {
            const korInstr = mainGenre.instruments.split(', ').map(eng => {
                const key = Object.keys(instrumentEngToKor).find(k => eng.toLowerCase().includes(k));
                return key ? instrumentEngToKor[key] : eng;
            });
            html += `• 악기: ${korInstr.slice(0, 5).join(', ')}<br>`;
        }
        if (mainGenre && mainGenre.vocal) {
            const korVocal = mainGenre.vocal.split(', ').map(eng => {
                const key = Object.keys(vocalEngToKor).find(k => eng.toLowerCase().includes(k));
                return key ? vocalEngToKor[key] : eng;
            });
            html += `• 보컬: ${korVocal.slice(0, 4).join(', ')}<br>`;
        }
        html += '• 품질: 프로페셔널 스튜디오 품질, 깨끗하고 밸런스 있는 사운드, 라디오 방송 수준';
        return html;
    }

    function buildMoreOptionsKorDesc(weirdness, styleInfluence) {
        let desc = '📌 <strong>한국어 설명:</strong> ';
        if (weirdness <= 35) desc += 'Weirdness를 낮게 설정하여 안정적이고 익숙한 사운드를 만듭니다. ';
        else if (weirdness <= 55) desc += 'Weirdness를 보통으로 설정하여 적당한 창의성을 부여합니다. ';
        else desc += 'Weirdness를 높게 설정하여 독특하고 실험적인 사운드를 만듭니다. ';
        if (styleInfluence >= 60) desc += 'Style Influence를 높게 설정하여 장르 특성을 강하게 반영합니다.';
        else if (styleInfluence >= 40) desc += 'Style Influence를 보통으로 설정하여 장르간 자연스러운 융합을 만듭니다.';
        else desc += 'Style Influence를 낮게 설정하여 AI의 창의적 해석 여지를 늘립니다.';
        return desc;
    }

    // 복사 기능
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const el = document.getElementById(btn.dataset.target);
            const text = el.value !== undefined ? el.value : el.textContent;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '✓ 복사됨!'; btn.classList.add('copied');
                setTimeout(() => { btn.textContent = '복사하기'; btn.classList.remove('copied'); }, 2000);
            });
        });
    });

    document.getElementById('btnCopyAll').addEventListener('click', () => {
        const style = document.getElementById('stylePromptText').value;
        const exclude = document.getElementById('excludeStylesText').value;
        const weirdness = document.getElementById('weirdnessValue').textContent;
        const influence = document.getElementById('styleInfluenceValue').textContent;
        navigator.clipboard.writeText(`[Style Prompt]\n${style}\n\n[Exclude Styles]\n${exclude}\n\n[More Options]\nWeirdness: ${weirdness}\nStyle Influence: ${influence}`).then(() => {
            const btn = document.getElementById('btnCopyAll');
            btn.innerHTML = '<span>✓</span> 복사완료!';
            setTimeout(() => { btn.innerHTML = '<span>📋</span> 전체 복사'; }, 2000);
        });
    });

    // 전체 저장
    document.getElementById('btnSaveAll').addEventListener('click', () => {
        const style = document.getElementById('stylePromptText').value;
        const exclude = document.getElementById('excludeStylesText').value;
        const weirdness = document.getElementById('weirdnessValue').textContent;
        const influence = document.getElementById('styleInfluenceValue').textContent;
        const explanation = document.getElementById('promptExplanation').textContent;
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
        const content = `========================================\nSUNO MASTER PRO 12 - 프롬프트 저장 (직접 만들기)\n생성일시: ${now.toLocaleString('ko-KR')}\n========================================\n\n[한국어 설명]\n${explanation}\n\n========================================\n[Style Prompt]\n${style}\n\n========================================\n[Exclude Styles]\n${exclude}\n\n========================================\n[More Options]\nWeirdness: ${weirdness}\nStyle Influence: ${influence}\n\n========================================\n선택 정보:\n- 입력 내용: ${selections.freeText}\n- 타겟층: ${selections.target.map(v => labelMap[v]).join(', ')}\n- 장소: ${selections.place.map(v => labelMap[v]).join(', ')}\n- 분위기: ${selections.mood.map(v => labelMap[v]).join(', ')}\n- 장르: ${selections.genres.join(' + ')}\n========================================\nGenerated by SUNO MASTER PRO 12\n`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `SUNO_Prompt_${dateStr}.txt`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        const btn = document.getElementById('btnSaveAll');
        btn.innerHTML = '<span>✓</span> 저장완료!';
        setTimeout(() => { btn.innerHTML = '<span>💾</span> 전체 저장하기'; }, 2000);
    });

    // 적용하기 (파이프라인 저장)
    const btnApply = document.getElementById('btnApply');
    const btnGotoLyrics = document.getElementById('btnGotoLyrics');
    btnApply.addEventListener('click', () => {
        const style = document.getElementById('stylePromptText').value || '';
        if (!style.trim()) { alert('먼저 프롬프트를 생성해주세요.'); return; }
        const pipelineData = {
            stylePrompt: style,
            excludeStyles: document.getElementById('excludeStylesText').value || '',
            weirdness: parseInt(document.getElementById('weirdnessValue').textContent) || null,
            styleInfluence: parseInt(document.getElementById('styleInfluenceValue').textContent) || null,
            explanation: document.getElementById('promptExplanation').textContent || '',
            genres: selections.genres.slice(), target: selections.target.slice(),
            place: selections.place.slice(), mood: selections.mood.slice(),
            vocalType: selections.vocalType, vocalAge: selections.vocalAge,
            vocalRange: selections.vocalRange, vocalStyles: selections.vocalStyles.slice(),
            freeText: selections.freeText,
            createdAt: new Date().toISOString(), source: 'custom',
            fileName: (selections.genres.length > 0 ? selections.genres.join(' + ') + ' - 직접 만들기' : '직접 만들기 결과')
        };
        localStorage.setItem('suno-pipeline-custom', JSON.stringify(pipelineData));
        const msgEl = document.getElementById('applyCompleteMsg');
        if (msgEl) { msgEl.textContent = '✅ 스타일 프롬프트 적용 완료! 다음 단계에 반영됩니다.'; msgEl.classList.add('visible'); }
        btnGotoLyrics.disabled = false; btnGotoLyrics.classList.add('active');
    });
    btnGotoLyrics.addEventListener('click', () => { window.location.href = 'lyrics.html'; });
    document.getElementById('btnHome').addEventListener('click', () => { window.location.href = 'index.html'; });

    // 글자 크기 조절
    const textSizePopup = document.getElementById('textSizePopup');
    const btnTextSize = document.getElementById('btnTextSize');
    const sizeBtns = document.querySelectorAll('.size-btn');
    const savedSize = localStorage.getItem('suno-text-size') || 'medium';
    applyTextSize(savedSize);
    btnTextSize.addEventListener('click', () => textSizePopup.classList.add('active'));
    document.getElementById('closeTextSize').addEventListener('click', () => textSizePopup.classList.remove('active'));
    textSizePopup.addEventListener('click', e => { if (e.target === textSizePopup) textSizePopup.classList.remove('active'); });
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.dataset.size; applyTextSize(size);
            localStorage.setItem('suno-text-size', size);
            sizeBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        });
    });
    function applyTextSize(size) {
        document.body.classList.remove('text-small', 'text-large', 'text-xlarge');
        if (size !== 'medium') document.body.classList.add('text-' + size);
        sizeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.size === size));
    }

    // 다크모드
    const btnDarkMode = document.getElementById('btnDarkMode');
    if (localStorage.getItem('suno-dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        btnDarkMode.querySelector('.dark-mode-icon').textContent = '☀';
    }
    btnDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        btnDarkMode.querySelector('.dark-mode-icon').textContent = isDark ? '☀' : '☾';
        localStorage.setItem('suno-dark-mode', isDark);
    });

    // 프롬프트 파일 불러오기
    const fileImport = document.getElementById('fileImport');
    const importBox = document.getElementById('importBox');
    const importFilenameEl = document.getElementById('importFilename');

    fileImport.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        importFilenameEl.textContent = `선택 중: ${file.name}`;
        importFilenameEl.style.display = 'block';
        const reader = new FileReader();
        reader.onload = event => {
            const content = event.target.result;
            const parsed = parsePromptFile(content);
            if (parsed) {
                applyImportedData(parsed);
                importBox.classList.add('success');
                importBox.querySelector('.import-title').textContent = '불러오기 완료!';
                importBox.querySelector('.import-desc').textContent = `"${file.name}" 파일에서 프롬프트를 불러왔습니다. 6단계로 이동합니다.`;
                setTimeout(() => goToStep(6), 1500);
            } else {
                importBox.querySelector('.import-title').textContent = '파일을 읽을 수 없습니다';
                importBox.querySelector('.import-desc').textContent = 'SUNO MASTER PRO 12에서 저장한 txt 파일만 불러올 수 있습니다.';
            }
            fileImport.value = '';
            importFilenameEl.style.display = 'none';
        };
        reader.readAsText(file, 'UTF-8');
    });

    function parsePromptFile(content) {
        try {
            const result = { stylePrompt: '', excludeStyles: '', weirdness: 50, styleInfluence: 50, explanation: '', target: [], place: [], mood: [], genres: [] };
            const sm = content.match(/\[Style Prompt\]\s*\n([\s\S]*?)(?=\n={3,})/); if (sm) result.stylePrompt = sm[1].trim();
            const em = content.match(/\[Exclude Styles\]\s*\n([\s\S]*?)(?=\n={3,})/); if (em) result.excludeStyles = em[1].trim();
            const wm = content.match(/Weirdness:\s*(\d+)%/); if (wm) result.weirdness = parseInt(wm[1]);
            const im = content.match(/Style Influence:\s*(\d+)%/); if (im) result.styleInfluence = parseInt(im[1]);
            const xm = content.match(/\[한국어 설명\]\s*\n([\s\S]*?)(?=\n={3,})/); if (xm) result.explanation = xm[1].trim();
            const tm = content.match(/- 타겟층:\s*(.+)/); if (tm) result.target = parseSelectionLine(tm[1], 'target');
            const pm = content.match(/- 장소:\s*(.+)/); if (pm) result.place = parseSelectionLine(pm[1], 'place');
            const mm = content.match(/- 분위기:\s*(.+)/); if (mm) result.mood = parseSelectionLine(mm[1], 'mood');
            const gm = content.match(/- 장르:\s*(.+)/); if (gm) result.genres = gm[1].trim().split(/\s*\+\s*/);
            if (!result.stylePrompt) return null;
            return result;
        } catch(e) { return null; }
    }

    function parseSelectionLine(line, type) {
        const reverseMap = {};
        for (const [key, val] of Object.entries(labelMap)) reverseMap[val] = key;
        return line.trim().split(/,\s*/).map(label => reverseMap[label.trim()] || label.trim()).filter(Boolean);
    }

    function applyImportedData(data) {
        importedPromptData = { stylePrompt: data.stylePrompt, excludeStyles: data.excludeStyles, weirdness: data.weirdness, styleInfluence: data.styleInfluence, explanation: data.explanation };
        if (data.genres && data.genres.length > 0) selections.genres = data.genres.filter(g => GENRE_DATABASE.some(db => db.genre === g));
        if (data.target && data.target.length > 0) selections.target = data.target;
        if (data.place && data.place.length > 0) selections.place = data.place;
        if (data.mood && data.mood.length > 0) selections.mood = data.mood;
    }

    // 숨기기/펼치기 버튼
    document.querySelectorAll('.btn-collapse-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const section = document.getElementById(targetId);
            if (!section) return;
            section.classList.toggle('collapsed');
            btn.textContent = section.classList.contains('collapsed') ? '펼치기' : '숨기기';
        });
    });

});

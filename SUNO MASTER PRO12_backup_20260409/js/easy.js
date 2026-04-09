// ============================================
// SUNO MASTER PRO 12 - 쉽게 만들기 JavaScript
// 5단계 흐름: 타겟층 → 장소/상황 → 분위기 → 장르선택 → 완성
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
    const totalSteps = 4; // 1~4단계 (5단계는 결과)
    const selections = {
        target: [],
        place: [],
        mood: [],
        genres: [],    // 사용자가 선택한 장르 (최대 2개, 순서 = 메인 → 블렌딩)
        vocalType: '',     // male vocals / female vocals / duet vocals / instrumental
        vocalAge: '',      // teen vocals / young adult vocals / mature vocals / etc.
        vocalRange: '',    // deep bass, E2~E3 / low baritone, G2~G3 / etc.
        vocalStyles: []    // ['chest voice', 'belting', ...]
    };
    let recommendedGenres = []; // 추천된 장르 5개
    let customGenres = [];       // 사용자 직접 입력한 장르들
    let _lastStep2Target = '';
    const confirmed = { step1: false, step2: false, step3: false, step4: false, vocal: false };
    let confirmedSituationText = '';

    // === 프롬프트 생성 버튼 표시/숨김 헬퍼 ===
    function showGeneratePromptBtn(show) {
        const genBtn = document.getElementById('btnGeneratePrompt');
        const applyBtn = document.getElementById('btnApplyStep4');
        if (show) {
            genBtn.style.display = '';
            applyBtn.style.display = 'none';
        } else {
            genBtn.style.display = 'none';
            applyBtn.style.display = '';
        }
    }

    // 한글 매핑
    const labelMap = {
        teens: '10대', 'young-adults': '2030세대', 'middle-aged': '5060세대', seniors: '시니어세대',
        // 장소 (28개)
        cafe: '카페', bar: '바/라운지', club: '클럽', festival: '페스티벌',
        gym: '헬스장', home: '집', office: '사무실', library: '도서관',
        drive: '드라이브', 'night-drive': 'Night Drive', walk: '산책', commute: '출퇴근',
        travel: '여행', airplane: '비행기안', cooking: '요리할때', cleaning: '청소할때',
        reading: '독서', gaming: '게이밍', coding: '코딩', yoga: '요가',
        meditation: '명상', morning: '아침루틴', 'afternoon-tea': '오후티타임', dinner: '저녁식사',
        night: '밤', date: '데이트', 'home-party': '홈파티', alone: '혼술/혼밥',
        // 분위기 (35개)
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

    // === DOM 요소 ===
    const stepPages = document.querySelectorAll('.step-page');
    const stepItems = document.querySelectorAll('.step-item');
    const stepLines = document.querySelectorAll('.step-line');
    const btnNext = document.getElementById('btnNext'); // 하단 sticky nav 제거됨 — null 가능
    const navInfo = document.getElementById('navInfo'); // 하단 sticky nav 제거됨 — null 가능
    const navButtons = document.getElementById('navButtons'); // 하단 sticky nav 제거됨 — null 가능

    // === 옵션 카드 선택 (1~3단계) ===
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            if (currentStep === 1) {
                const stepPage = document.getElementById('step1');
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
                    confirmed.step1 = false;
                    confirmed.step2 = false;
                    confirmed.step3 = false;
                    confirmed.step4 = false;
                }
            } else if (currentStep === 3) {
                card.classList.toggle('selected');
                confirmed.step3 = false;
                confirmed.step4 = false;
            } else {
                card.classList.toggle('selected');
            }
            updateSelections();
            updateApplyButtons();
            updateNextButton();
        });
    });

    function updateSelections() {
        const stepPage = document.getElementById(`step${currentStep}`);
        const selected = stepPage.querySelectorAll('.option-card.selected');
        const values = Array.from(selected).map(c => c.dataset.value);

        if (currentStep === 1) selections.target = values;
        else if (currentStep === 2) {
            // 2단계: 드롭다운 선택 → place는 easySituationSelect change에서 이미 설정됨
        }
        else if (currentStep === 3) selections.mood = values;
    }

    function updateNextButton() {
        if (!btnNext) return; // 하단 sticky nav 제거됨
        if (currentStep === 1) {
            btnNext.disabled = !confirmed.step1;
        } else if (currentStep === 2) {
            btnNext.disabled = !confirmed.step2;
        } else if (currentStep === 3) {
            btnNext.disabled = !confirmed.step3;
        } else if (currentStep === 4) {
            btnNext.disabled = true;
        }
    }

    // === 적용하기 버튼 표시/숨김 관리 ===
    function updateApplyButtons() {
        const step1Area = document.getElementById('step1ApplyArea');
        if (currentStep === 1) {
            const hasTarget = document.querySelectorAll('#step1 .option-card.selected').length > 0;
            step1Area.style.display = hasTarget ? 'block' : 'none';
            const btn1 = document.getElementById('btnApplyStep1');
            if (confirmed.step1) {
                btn1.innerHTML = '<span>✓</span> 적용완료';
                btn1.classList.add('applied');
            } else {
                btn1.innerHTML = '<span>✓</span> 적용하기';
                btn1.classList.remove('applied');
            }
        }

        const step3Area = document.getElementById('step3ApplyArea');
        if (currentStep === 3) {
            const hasMood = document.querySelectorAll('#step3 .option-card.selected').length > 0;
            step3Area.style.display = hasMood ? 'block' : 'none';
            const btn3 = document.getElementById('btnApplyStep3');
            if (confirmed.step3) {
                btn3.innerHTML = '<span>✓</span> 적용완료';
                btn3.classList.add('applied');
            } else {
                btn3.innerHTML = '<span>✓</span> 적용하기';
                btn3.classList.remove('applied');
            }
        }

        const step4Area = document.getElementById('step4ApplyArea');
        if (currentStep === 4) {
            const hasGenre = selections.genres.length > 0;
            step4Area.style.display = hasGenre ? 'block' : 'none';
            const btn4 = document.getElementById('btnApplyStep4');
            if (confirmed.step4) {
                btn4.innerHTML = '<span>✓</span> 적용완료';
                btn4.classList.add('applied');
                // 보컬도 적용되었을 때만 프롬프트 생성 표시
                if (confirmed.vocal) {
                    showGeneratePromptBtn(true);
                }
            } else {
                btn4.innerHTML = '<span>✓</span> 적용하기';
                btn4.classList.remove('applied');
                showGeneratePromptBtn(false);
            }
        }

        // 하단 nav 적용 버튼 동기화
        updateNavApplyButton();
    }

    // === 1단계 적용하기 ===
    document.getElementById('btnApplyStep1').addEventListener('click', () => {
        updateSelections();
        if (selections.target.length === 0) return;
        confirmed.step1 = true;
        confirmed.step2 = false;
        confirmed.step3 = false;
        confirmed.step4 = false;
        const targetName = selections.target.map(v => labelMap[v]).join(', ');
        const fb = document.getElementById('step1Feedback');
        fb.innerHTML = '✅ <strong>"' + targetName + '"</strong> 타겟층이 적용되었습니다. 2단계에 반영됩니다.';
        fb.classList.add('active');
        updateApplyButtons();
        updateNextButton();
    });

    // === 2단계: 상황 미리보기 + 수정/적용 ===
    const situationPreview = document.getElementById('situationPreview');
    const situationPreviewText = document.getElementById('situationPreviewText');
    const situationEditArea = document.getElementById('situationEditArea');
    const situationEditInput = document.getElementById('situationEditInput');
    const btnSituationEdit = document.getElementById('btnSituationEdit');
    const btnApplyStep2 = document.getElementById('btnApplyStep2');
    let isEditingSituation = false;

    function showSituationPreview(text) {
        situationPreviewText.textContent = text;
        situationPreviewText.style.display = 'flex';
        situationEditArea.style.display = 'none';
        isEditingSituation = false;
        btnSituationEdit.innerHTML = '<span>✎</span> 수정하기';
        btnSituationEdit.classList.remove('editing');
        situationPreview.style.display = 'block';
        confirmed.step2 = false;
        confirmed.step3 = false;
        confirmed.step4 = false;
        const fb2 = document.getElementById('step2Feedback');
        fb2.classList.remove('active');
        btnApplyStep2.innerHTML = '✅ 적용하기';
        btnApplyStep2.classList.remove('applied');
        updateNextButton();
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

    btnApplyStep2.addEventListener('click', () => {
        let finalText;
        if (isEditingSituation) {
            finalText = situationEditInput.value.trim();
            if (!finalText) return;
        } else {
            finalText = situationPreviewText.textContent;
        }
        if (!finalText) return;

        confirmedSituationText = finalText;
        confirmed.step2 = true;
        confirmed.step3 = false;
        confirmed.step4 = false;

        if (isEditingSituation) {
            situationPreviewText.textContent = finalText;
            situationPreviewText.style.display = 'flex';
            situationEditArea.style.display = 'none';
            isEditingSituation = false;
            btnSituationEdit.innerHTML = '<span>✎</span> 수정하기';
            btnSituationEdit.classList.remove('editing');
        }

        recalcThemeMoodsFromText(finalText);

        const fb = document.getElementById('step2Feedback');
        fb.innerHTML = '✅ 상황 <strong>"' + finalText + '"</strong> 이(가) 적용되었습니다. 3단계 분위기에 반영됩니다.';
        fb.classList.add('active');
        fb.style.display = '';

        btnApplyStep2.innerHTML = '✅ 적용완료';
        btnApplyStep2.classList.add('applied');
        updateNextButton();
    });

    // === 3단계 적용하기 ===
    document.getElementById('btnApplyStep3').addEventListener('click', () => {
        const step3 = document.getElementById('step3');
        const selected = step3.querySelectorAll('.option-card.selected');
        selections.mood = Array.from(selected).map(c => c.dataset.value);
        if (selections.mood.length === 0) return;

        confirmed.step3 = true;
        confirmed.step4 = false;

        const moodNames = selections.mood.map(v => labelMap[v]).join(', ');
        const fb = document.getElementById('step3Feedback');
        fb.innerHTML = '✅ 분위기 <strong>"' + moodNames + '"</strong> 이(가) 적용되었습니다. 4단계 장르 추천에 반영됩니다.';
        fb.classList.add('active');
        updateApplyButtons();
        updateNextButton();
    });

    // === 4단계 적용하기 ===
    document.getElementById('btnApplyStep4').addEventListener('click', () => {
        if (selections.genres.length === 0) return;
        confirmed.step4 = true;
        confirmed.vocal = false; // 보컬 미확정 상태
        const genreNames = selections.genres.join(' + ');
        const fb = document.getElementById('step4Feedback');
        fb.innerHTML = '✅ 장르 <strong>"' + genreNames + '"</strong> 적용! 아래에서 보컬을 설정해주세요.';
        fb.classList.add('active');
        updateApplyButtons();

        // 보컬 설정 영역 표시
        document.getElementById('vocalSettingsArea').style.display = 'block';
        showGeneratePromptBtn(false);
        initVocalSettings();
    });

    // === 4단계 프롬프트 생성 ===
    document.getElementById('btnGeneratePrompt').addEventListener('click', () => {
        if (!confirmed.step4 || !confirmed.vocal) return;
        goToStep(5);
    });

    // ═══════════════════════════════════════════════
    // 장르 드롭다운 초기화
    // ═══════════════════════════════════════════════
    (function initGenreDropdowns() {
        const mainDD = document.getElementById('mainGenreDropdown');
        const subDD = document.getElementById('subGenreDropdown');
        const detailDD = document.getElementById('detailGenreDropdown');
        const tooltip = document.getElementById('genreTooltip');

        // 메인 카테고리 채우기
        const mainCategories = [...new Set(GENRE_DATABASE.map(g => g.main))];
        mainCategories.forEach(main => {
            const opt = document.createElement('option');
            opt.value = main;
            opt.textContent = main;
            // 해당 카테고리의 첫 번째 장르 설명으로 툴팁
            const firstGenre = GENRE_DATABASE.find(g => g.main === main);
            opt.title = firstGenre ? `${main} 카테고리 (${GENRE_DATABASE.filter(g => g.main === main).length}개 장르)` : '';
            mainDD.appendChild(opt);
        });

        // 메인 선택 → 서브 채우기
        mainDD.addEventListener('change', () => {
            const selected = mainDD.value;
            subDD.innerHTML = '<option value="">-- 서브 장르 선택 --</option>';
            detailDD.innerHTML = '<option value="">-- 상세 장르 선택 --</option>';
            detailDD.disabled = true;
            if (tooltip) tooltip.style.display = 'none';
            const dsc = document.getElementById('dropdownSelectedCard');
            if (dsc) dsc.style.display = 'none';

            if (!selected) { subDD.disabled = true; return; }
            subDD.disabled = false;

            const subs = [...new Set(GENRE_DATABASE.filter(g => g.main === selected).map(g => g.sub))];
            subs.forEach(sub => {
                const opt = document.createElement('option');
                opt.value = sub;
                opt.textContent = sub;
                subDD.appendChild(opt);
            });
        });

        // 서브 선택 → 상세 채우기
        subDD.addEventListener('change', () => {
            const mainVal = mainDD.value;
            const subVal = subDD.value;
            detailDD.innerHTML = '<option value="">-- 상세 장르 선택 --</option>';
            if (tooltip) tooltip.style.display = 'none';
            const dsc = document.getElementById('dropdownSelectedCard');
            if (dsc) dsc.style.display = 'none';

            if (!subVal) { detailDD.disabled = true; return; }
            detailDD.disabled = false;

            const details = GENRE_DATABASE.filter(g => g.main === mainVal && g.sub === subVal);
            details.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.genre;
                opt.textContent = g.genre;
                opt.title = buildGenreDescription(g);
                detailDD.appendChild(opt);
            });
        });

        // 상세 선택 → 카드로 미리보기만 표시 (자동 선택 안 함, 클릭해야 선택)
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

            // 역할 결정 (추천 카드와 동일)
            let roleHtml = '';
            let cardSelClass = '';
            if (selIdx === 0) {
                roleHtml = '<span class="genre-rec-role main-role">⭐ 메인 장르</span>';
                cardSelClass = 'selected main-genre';
            } else if (selIdx === 1) {
                roleHtml = '<span class="genre-rec-role blend-role">🎨 블렌딩 장르</span>';
                cardSelClass = 'selected blend-genre';
            }

            cardContainer.innerHTML = `
                <div class="genre-rec-card ${cardSelClass}" data-genre="${genreData.genre}" title="${fullDesc}" style="cursor:pointer;">
                    <div class="genre-rec-rank">🎵</div>
                    <div class="genre-rec-content">
                        <div class="genre-rec-name">${genreData.genre} ${isAlreadySelected ? roleHtml : '<span style="color:#999;font-size:0.85em;">👆 클릭하면 선택됩니다</span>'}</div>
                        <div class="genre-rec-main">${genreData.main || ''} ${genreData.sub ? '> ' + genreData.sub : ''}</div>
                        <div class="genre-rec-desc">${fullDesc}</div>
                        <div class="genre-rec-tags">${ageTagsHtml} ${placeTagsHtml} ${moodTagsHtml}</div>
                    </div>
                </div>
            `;
            cardContainer.style.display = 'block';

            // 카드 클릭 시 장르 선택/해제
            cardContainer.querySelector('.genre-rec-card').addEventListener('click', () => {
                toggleGenreSelection(genreName, genreData);
                // 선택 상태 업데이트
                detailDD.dispatchEvent(new Event('change'));
            });
        });

        // 드롭다운 option hover 시 장르 설명 표시 (mouseover)
        detailDD.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'OPTION' && e.target.value) {
                const g = GENRE_DATABASE.find(genre => genre.genre === e.target.value);
                if (g) e.target.title = buildGenreDescription(g);
            }
        });
    })();

    // ═══════════════════════════════════════════════
    // 보컬 설정 로직
    // ═══════════════════════════════════════════════

    // 장르 → 보컬 스타일 자동 추천 매핑
    const genreVocalStyleMap = {
        'Pop': ['chest voice', 'breathy tone', 'belting', 'vibrato', 'staccato'],
        'Rock': ['chest voice', 'belting', 'grit', 'rasp', 'mixed voice', 'vibrato'],
        'Metal': ['belting', 'grit', 'rasp', 'screaming', 'growling', 'chest voice'],
        'Country / Folk': ['chest voice', 'vibrato', 'breathy tone', 'whisper tone', 'legato'],
        'Hip Hop / Rap': ['chest voice', 'spoken word', 'rhythmic flow', 'ad-libs', 'grit'],
        'Electronic / House': ['breathy tone', 'whisper tone', 'processed vocals', 'auto-tune', 'falsetto'],
        'Jazz': ['head voice', 'vibrato', 'scat', 'breathy tone', 'legato', 'mixed voice'],
        'R&B / Soul': ['mixed voice', 'falsetto', 'runs', 'melisma', 'breathy tone', 'vibrato', 'ad-libs'],
        'Funk / Disco': ['chest voice', 'falsetto', 'staccato', 'rhythmic attack', 'belting'],
        'Latin': ['chest voice', 'vibrato', 'belting', 'mixed voice', 'passionate delivery'],
        'Cinematic / Soundtrack': ['head voice', 'legato', 'vibrato', 'soaring vocals', 'whisper tone'],
        'Classical / Orchestral': ['head voice', 'vibrato', 'legato', 'soprano', 'falsetto'],
        'Ambient / New Age': ['breathy tone', 'whisper tone', 'ethereal vocals', 'head voice'],
        'Religious / Spiritual': ['belting', 'chest voice', 'vibrato', 'gospel runs', 'mixed voice'],
        "Kid's / Special": ['chest voice', 'bright tone', 'staccato', 'playful delivery'],
        'African / Caribbean': ['chest voice', 'rhythmic chanting', 'call and response', 'belting'],
        'World / Ethnic': ['chest voice', 'vibrato', 'traditional techniques', 'melisma']
    };

    // 전체 보컬 스타일 목록 (12가지 창법 + 추가)
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
        { value: 'humming', label: '허밍', desc: '입을 다물고 부드럽게 흥얼거리는 보컬' },
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

    // 보컬 음역대 데이터 (1옥타브 단위, 한글 표기)
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

        document.querySelectorAll('#vocalTypeOptions .vocal-option-btn').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('vocalAgeGroup').style.display = 'none';
        document.getElementById('vocalRangeGroup').style.display = 'none';
        document.getElementById('vocalStyleGroup').style.display = 'none';
        document.getElementById('vocalApplyArea').style.display = 'none';
        showGeneratePromptBtn(false);
    }

    // 보컬 타입 선택
    document.querySelectorAll('#vocalTypeOptions .vocal-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#vocalTypeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            vocalSelections.type = btn.dataset.value;
            vocalSelections.range = '';
            vocalSelections.styles = [];
            confirmed.vocal = false;

            if (vocalSelections.type === 'instrumental') {
                document.getElementById('vocalAgeGroup').style.display = 'none';
                document.getElementById('vocalRangeGroup').style.display = 'none';
                document.getElementById('vocalStyleGroup').style.display = 'none';
                document.getElementById('vocalApplyArea').style.display = 'block';
            } else {
                // 보컬 → 연령대 표시
                document.getElementById('vocalAgeGroup').style.display = 'block';
                document.getElementById('vocalRangeGroup').style.display = 'none';
                document.getElementById('vocalStyleGroup').style.display = 'none';
                document.getElementById('vocalApplyArea').style.display = 'none';
            }
            showGeneratePromptBtn(false);
        });
    });

    // 보컬 연령대 선택 이벤트
    document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            vocalSelections.age = btn.dataset.value;
            confirmed.vocal = false;

            // 음역대 표시
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
            btn.className = 'vocal-option-btn';
            btn.dataset.value = r.value;
            btn.textContent = r.label;
            btn.title = r.desc;
            btn.addEventListener('click', () => {
                container.querySelectorAll('.vocal-option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                vocalSelections.range = r.value;
                vocalSelections.styles = [];
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

        // 장르 기반 추천 스타일 찾기
        const mainGenre = selections.genres[0] || '';
        const genreEntry = GENRE_DATABASE.find(g => g.genre === mainGenre);
        const mainCategory = genreEntry ? genreEntry.main : '';
        const recommended = genreVocalStyleMap[mainCategory] || [];

        allVocalStyles.forEach(style => {
            const tag = document.createElement('button');
            const isRecommended = recommended.includes(style.value);
            tag.className = 'vocal-style-tag' + (isRecommended ? ' recommended selected' : '');
            tag.dataset.value = style.value;
            tag.textContent = style.label;
            tag.title = style.desc;

            // 추천 스타일은 자동 선택
            if (isRecommended) {
                vocalSelections.styles.push(style.value);
            }

            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
                const idx = vocalSelections.styles.indexOf(style.value);
                if (idx > -1) {
                    vocalSelections.styles.splice(idx, 1);
                } else {
                    vocalSelections.styles.push(style.value);
                }
                confirmed.vocal = false;
                showGeneratePromptBtn(false);

                // 1개 이상 선택하면 적용 버튼 표시
                if (vocalSelections.styles.length > 0) {
                    document.getElementById('vocalApplyArea').style.display = 'block';
                } else {
                    document.getElementById('vocalApplyArea').style.display = 'none';
                }
            });
            container.appendChild(tag);
        });

        // 추천 스타일이 있으면 자동으로 적용 버튼 표시
        if (recommended.length > 0) {
            document.getElementById('vocalApplyArea').style.display = 'block';
        }
    }

    // 보컬 적용하기
    document.getElementById('btnApplyVocal').addEventListener('click', () => {
        confirmed.vocal = true;
        const fb = document.getElementById('vocalFeedback');
        const typeLabel = vocalSelections.type === 'instrumental' ? '연주곡' :
            (vocalSelections.type.includes('male') && !vocalSelections.type.includes('female') ? '남성' :
             vocalSelections.type.includes('female') ? '여성' : '듀엣');
        const rangeLabel = vocalSelections.range || '';
        const styleCount = vocalSelections.styles.length;

        let msg = '✅ 보컬 설정 완료: <strong>' + typeLabel + '</strong>';
        if (rangeLabel) msg += ' / ' + rangeLabel;
        if (styleCount > 0) msg += ' / 스타일 ' + styleCount + '개';
        fb.innerHTML = msg;
        fb.classList.add('active');

        // 프롬프트 생성 버튼 활성화
        showGeneratePromptBtn(true);
        updateApplyButtons();

        // selections에 보컬 데이터 저장
        selections.vocalType = vocalSelections.type;
        selections.vocalAge = vocalSelections.age;
        selections.vocalRange = vocalSelections.range;
        selections.vocalStyles = [...vocalSelections.styles];
    });

    // === 확정된 상황 텍스트 기반 _themeMoods 재계산 ===
    function recalcThemeMoodsFromText(text) {
        const themeVal = easySituationTheme ? easySituationTheme.value : '';
        const ageKey = selections.target[0] || 'young-adults';
        const themeEntry = themeMoodMap[themeVal];
        let baseMoods = [];
        if (themeEntry) {
            baseMoods = themeEntry[ageKey] || themeEntry['young-adults'] || [];
        }

        const situationText = text.toLowerCase();
        const textMoods = [];
        for (const [moodKey, keywords] of Object.entries(situationMoodKeywords)) {
            if (keywords.some(kw => situationText.includes(kw))) {
                textMoods.push(moodKey);
            }
        }

        const moodAssociations = {
            'stress-relief': ['comfort','sentimental'], 'anger': ['stress-relief','powerful'],
            'breakup': ['lonely','sentimental','comfort'], 'lonely': ['sentimental','comfort','calm'],
            'comfort': ['healing','warm'], 'immersive': ['calm','emotional'],
            'tension-up': ['focus','confidence'], 'flutter': ['love','feel-good'],
            'nostalgic': ['sentimental','warm','emotional'], 'emotional': ['warm','comfort'],
            'calm': ['comfortable','healing'], 'dreamy': ['calm','emotional'],
            'healing': ['comfortable','calm','warm'], 'feel-good': ['refreshing','exciting'],
            'exciting': ['groovy','tension-up'], 'sleep': ['calm','sleep-aid'],
            'rainy': ['calm','emotional','sentimental'], 'snowy': ['cozy','warm','dreamy'],
            'sunset': ['emotional','nostalgic','calm']
        };

        const conflictPairs = [
            ['exciting','calm'], ['exciting','sleep'], ['exciting','lonely'],
            ['tension-up','comfortable'], ['tension-up','sleep'], ['tension-up','healing'],
            ['powerful','calm'], ['powerful','sleep'], ['powerful','healing'],
            ['anger','comfortable'], ['anger','flutter'], ['anger','love'],
            ['groovy','sleep'], ['groovy','lonely'],
            ['feel-good','lonely'], ['feel-good','breakup'], ['feel-good','anger'],
            ['refreshing','sleep'], ['refreshing','lonely'],
            ['stress-relief','exciting'], ['stress-relief','feel-good'],
            ['snowy','exciting'], ['rainy','exciting'],
            ['sleep','exciting'], ['sleep','tension-up'], ['sleep','anger'],
            ['confidence','lonely'], ['confidence','breakup'],
            ['immersive','exciting'], ['immersive','groovy']
        ];

        const enriched = [...textMoods];
        textMoods.forEach(m => {
            if (moodAssociations[m]) {
                moodAssociations[m].forEach(assoc => {
                    if (!enriched.includes(assoc)) enriched.push(assoc);
                });
            }
        });

        const filteredBase = baseMoods.filter(baseMood => {
            return !enriched.some(textMood => {
                return conflictPairs.some(([a, b]) =>
                    (a === textMood && b === baseMood) || (b === textMood && a === baseMood)
                );
            });
        });

        const combined = [];
        enriched.forEach(m => { if (!combined.includes(m) && combined.length < 3) combined.push(m); });
        filteredBase.forEach(m => {
            const hasConflict = combined.some(existing =>
                conflictPairs.some(([a, b]) =>
                    (a === existing && b === m) || (b === existing && a === m)
                )
            );
            if (!hasConflict && !combined.includes(m) && combined.length < 3) combined.push(m);
        });

        selections._themeMoods = combined.length > 0 ? combined : baseMoods.slice(0, 3);
    }

    // === 2단계: 연령대별 장소/상황 드롭다운 ===
    const AGE_LABEL_TO_KEY = { 'teens': '10대', 'young-adults': '2030세대', 'middle-aged': '5060세대', 'seniors': '시니어세대' };
    const easySituationTheme = document.getElementById('easySituationTheme');
    const easySituationSelect = document.getElementById('easySituationSelect');


    // 상황 카테고리에서 장소 키워드 매핑 (장르추천 연결용)
    // 카테고리 → 장소키 매핑 (PLACE_MAP에 존재하는 키만 사용)
    // + 분위기키 매핑 (MOOD_TO_GENRE_MAP에 존재하는 키)
    // 카테고리 → 연령대별 장소 매핑
    // 원칙: 10대만 바/클럽 제한, 성인(20대 이상)은 모든 장소 유지
    const themePlaceMap = {
        '출퇴근길': { 'teens': ['walk','commute'], '_default': ['commute'] },
        '카페': { '_default': ['cafe'] },
        '업무/집중': { 'teens': ['library','home'], '_default': ['office','library'] },
        '집/사무실': { '_default': ['home','office'] },
        '운동/산책': { '_default': ['gym','walk'] },
        '드라이브': { 'teens': ['drive'], '_default': ['drive','night-drive'] },
        '여행': { '_default': ['travel'] },
        '힐링': { '_default': ['yoga','meditation','home'] },
        '독서': { '_default': ['library','reading'] },
        '사랑과 연애': { '_default': ['date','home','cafe'] },
        '이별과 상실': { '_default': ['home','alone','walk'] },
        '그리움과 향수': { '_default': ['home','walk','cafe'] },
        '외로움과 고독': { 'teens': ['home','alone','night'], '_default': ['home','alone','night'] },
        '밤과 새벽의 감정': { 'teens': ['night','home'], '_default': ['night','night-drive','bar'] },
        '위로와 치유': { '_default': ['cafe','walk','home'] },
        '파티와 자유': { 'teens': ['home-party','festival'], '_default': ['club','festival','home-party','bar'] },
        '요리/음식': { '_default': ['home','cooking'] },
        '게이밍': { '_default': ['home','gaming'] },
        '코딩/작업': { '_default': ['home','office','cafe'] },
        '아침루틴': { '_default': ['home','morning'] },
        '오후 티타임': { '_default': ['cafe','home'] },
        '저녁식사': { 'teens': ['home','dinner'], '_default': ['home','dinner'] },
        '데이트': { 'teens': ['cafe','walk','home'], '_default': ['cafe','bar','date','drive'] },
        '혼자만의 시간': { 'teens': ['home','alone'], '_default': ['home','alone','bar','cafe'] },
        '비오는 날': { '_default': ['home','cafe'] },
        '눈오는 날': { '_default': ['home','cafe'] },
        '새벽감성': { 'teens': ['home','night'], '_default': ['home','night','bar'] },
        '일몰/석양': { '_default': ['walk','drive'] },
        '캠핑/야외': { '_default': ['travel','walk'] },
        '수면/잠잘때': { '_default': ['home'] },
        '공부/시험': { '_default': ['library','home','cafe'] },
        '졸업/입학': { '_default': ['home','cafe'] },
        '기념일/축하': { 'teens': ['home','cafe','home-party'], '_default': ['home','cafe','bar','home-party'] },
        '봄': { '_default': ['walk','cafe','drive'] },
        '여름': { '_default': ['travel','drive','festival'] },
        '가을': { '_default': ['cafe','walk','drive'] },
        '겨울': { '_default': ['home','cafe'] },
        '감사와 고마움': { '_default': ['home','cafe'] },
        '자신감/도전': { '_default': ['gym','home','office'] },
        '명상/마음챙김': { '_default': ['home','yoga','meditation'] },
        '클럽/나이트': { 'teens': ['home-party','festival'], '_default': ['club','bar','festival'] },
        '페스티벌': { '_default': ['festival'] },
        '결혼/웨딩': { '_default': ['home','cafe'] },
        '육아/가족': { '_default': ['home'] },
        '반려동물': { '_default': ['home','walk'] },
        '출발/시작': { '_default': ['home','commute'] },
        '응원/격려': { '_default': ['gym','home','festival'] },
        '회상/추억여행': { '_default': ['home','cafe','drive'] },
        '일상/루틴': { '_default': ['home','office','cafe'] },
        '특별한 하루': { 'teens': ['home','cafe','festival'], '_default': ['home','cafe','bar','festival'] }
    };
    // 카테고리 → 연령대별 분위기 매핑 (50개 카테고리)
    // 같은 카테고리라도 연령대에 따라 어울리는 분위기가 다름
    const themeMoodMap = {
        '출퇴근길': {
            'teens': ['feel-good','exciting','refreshing'],
            'young-adults': ['feel-good','focus','immersive'],
            'middle-aged': ['comfortable','calm','focus'],
            'seniors': ['comfortable','calm','healing']
        },
        '카페': {
            'teens': ['feel-good','comfortable','flutter'],
            'young-adults': ['comfortable','calm','emotional'],
            'middle-aged': ['comfortable','calm','healing'],
            'seniors': ['comfortable','healing','warm']
        },
        '업무/집중': {
            'teens': ['focus','study','immersive'],
            'young-adults': ['focus','immersive','study'],
            'middle-aged': ['focus','immersive','calm'],
            'seniors': ['focus','calm','comfortable']
        },
        '집/사무실': {
            'teens': ['comfortable','cozy','feel-good'],
            'young-adults': ['comfortable','calm','cozy'],
            'middle-aged': ['comfortable','calm','healing'],
            'seniors': ['comfortable','warm','healing']
        },
        '운동/산책': {
            'teens': ['exciting','refreshing','tension-up'],
            'young-adults': ['refreshing','exciting','powerful'],
            'middle-aged': ['refreshing','comfortable','healing'],
            'seniors': ['comfortable','healing','calm']
        },
        '드라이브': {
            'teens': ['exciting','feel-good','groovy'],
            'young-adults': ['feel-good','exciting','emotional'],
            'middle-aged': ['comfortable','emotional','nostalgic'],
            'seniors': ['comfortable','nostalgic','calm']
        },
        '여행': {
            'teens': ['exciting','feel-good','refreshing'],
            'young-adults': ['feel-good','refreshing','exciting'],
            'middle-aged': ['feel-good','comfortable','emotional'],
            'seniors': ['comfortable','healing','nostalgic']
        },
        '힐링': {
            'teens': ['comfortable','cozy','calm'],
            'young-adults': ['healing','comfortable','calm'],
            'middle-aged': ['healing','comfortable','calm'],
            'seniors': ['healing','warm','comfortable']
        },
        '독서': {
            'teens': ['focus','calm','immersive'],
            'young-adults': ['calm','focus','immersive'],
            'middle-aged': ['calm','focus','comfortable'],
            'seniors': ['calm','comfortable','warm']
        },
        '사랑과 연애': {
            'teens': ['flutter','love','exciting'],
            'young-adults': ['love','flutter','emotional'],
            'middle-aged': ['love','emotional','warm'],
            'seniors': ['love','warm','nostalgic']
        },
        '이별과 상실': {
            'teens': ['breakup','lonely','emotional'],
            'young-adults': ['breakup','lonely','sentimental'],
            'middle-aged': ['breakup','sentimental','comfort'],
            'seniors': ['sentimental','comfort','nostalgic']
        },
        '그리움과 향수': {
            'teens': ['nostalgic','sentimental','emotional'],
            'young-adults': ['nostalgic','sentimental','emotional'],
            'middle-aged': ['nostalgic','sentimental','warm'],
            'seniors': ['nostalgic','warm','comfort']
        },
        '외로움과 고독': {
            'teens': ['lonely','sentimental','emotional'],
            'young-adults': ['lonely','sentimental','dawn-mood'],
            'middle-aged': ['lonely','sentimental','comfort'],
            'seniors': ['lonely','comfort','warm']
        },
        '밤과 새벽의 감정': {
            'teens': ['emotional','dreamy','sentimental'],
            'young-adults': ['dawn-mood','emotional','dreamy'],
            'middle-aged': ['emotional','calm','nostalgic'],
            'seniors': ['calm','nostalgic','warm']
        },
        '위로와 치유': {
            'teens': ['comfort','warm','healing'],
            'young-adults': ['comfort','healing','warm'],
            'middle-aged': ['comfort','healing','warm'],
            'seniors': ['comfort','warm','healing']
        },
        '파티와 자유': {
            'teens': ['exciting','groovy','tension-up'],
            'young-adults': ['exciting','groovy','tension-up'],
            'middle-aged': ['feel-good','groovy','exciting'],
            'seniors': ['feel-good','comfortable','groovy']
        },
        // ===== 새로 추가된 카테고리 (18~50) =====
        '요리/음식': {
            'teens': ['feel-good','exciting','comfortable'],
            'young-adults': ['comfortable','feel-good','cozy'],
            'middle-aged': ['comfortable','warm','cozy'],
            'seniors': ['warm','comfortable','nostalgic']
        },
        '게이밍': {
            'teens': ['exciting','tension-up','confidence'],
            'young-adults': ['exciting','tension-up','focus'],
            'middle-aged': ['exciting','focus','feel-good'],
            'seniors': ['feel-good','focus','comfortable']
        },
        '코딩/작업': {
            'teens': ['focus','immersive','study'],
            'young-adults': ['focus','immersive','calm'],
            'middle-aged': ['focus','immersive','calm'],
            'seniors': ['focus','calm','comfortable']
        },
        '아침루틴': {
            'teens': ['refreshing','feel-good','exciting'],
            'young-adults': ['refreshing','feel-good','calm'],
            'middle-aged': ['refreshing','comfortable','calm'],
            'seniors': ['comfortable','calm','healing']
        },
        '오후 티타임': {
            'teens': ['comfortable','feel-good','calm'],
            'young-adults': ['comfortable','calm','cozy'],
            'middle-aged': ['comfortable','calm','healing'],
            'seniors': ['comfortable','warm','healing']
        },
        '저녁식사': {
            'teens': ['comfortable','feel-good','cozy'],
            'young-adults': ['comfortable','cozy','warm'],
            'middle-aged': ['comfortable','warm','calm'],
            'seniors': ['warm','comfortable','nostalgic']
        },
        '데이트': {
            'teens': ['flutter','love','exciting'],
            'young-adults': ['love','flutter','emotional'],
            'middle-aged': ['love','emotional','warm'],
            'seniors': ['love','warm','nostalgic']
        },
        '혼자만의 시간': {
            'teens': ['calm','emotional','dreamy'],
            'young-adults': ['calm','emotional','comfortable'],
            'middle-aged': ['calm','comfortable','healing'],
            'seniors': ['calm','warm','nostalgic']
        },
        '비오는 날': {
            'teens': ['emotional','calm','dreamy'],
            'young-adults': ['rainy','emotional','calm'],
            'middle-aged': ['rainy','calm','nostalgic'],
            'seniors': ['rainy','calm','warm']
        },
        '눈오는 날': {
            'teens': ['emotional','dreamy','flutter'],
            'young-adults': ['snowy','emotional','calm'],
            'middle-aged': ['snowy','nostalgic','warm'],
            'seniors': ['snowy','warm','nostalgic']
        },
        '새벽감성': {
            'teens': ['emotional','dreamy','sentimental'],
            'young-adults': ['dawn-mood','emotional','dreamy'],
            'middle-aged': ['dawn-mood','calm','nostalgic'],
            'seniors': ['calm','nostalgic','warm']
        },
        '일몰/석양': {
            'teens': ['emotional','calm','dreamy'],
            'young-adults': ['sunset','emotional','calm'],
            'middle-aged': ['sunset','nostalgic','warm'],
            'seniors': ['sunset','warm','nostalgic']
        },
        '캠핑/야외': {
            'teens': ['exciting','feel-good','refreshing'],
            'young-adults': ['refreshing','feel-good','healing'],
            'middle-aged': ['healing','refreshing','comfortable'],
            'seniors': ['healing','comfortable','warm']
        },
        '수면/잠잘때': {
            'teens': ['sleep','sleep-aid','calm'],
            'young-adults': ['sleep','sleep-aid','calm'],
            'middle-aged': ['sleep','sleep-aid','comfortable'],
            'seniors': ['sleep','sleep-aid','warm']
        },
        '공부/시험': {
            'teens': ['focus','study','immersive'],
            'young-adults': ['focus','study','immersive'],
            'middle-aged': ['focus','calm','immersive'],
            'seniors': ['focus','calm','comfortable']
        },
        '졸업/입학': {
            'teens': ['exciting','flutter','emotional'],
            'young-adults': ['emotional','nostalgic','feel-good'],
            'middle-aged': ['nostalgic','emotional','warm'],
            'seniors': ['nostalgic','warm','emotional']
        },
        '기념일/축하': {
            'teens': ['exciting','feel-good','groovy'],
            'young-adults': ['feel-good','exciting','love'],
            'middle-aged': ['feel-good','warm','emotional'],
            'seniors': ['warm','nostalgic','feel-good']
        },
        '봄': {
            'teens': ['flutter','refreshing','exciting'],
            'young-adults': ['refreshing','flutter','feel-good'],
            'middle-aged': ['refreshing','comfortable','emotional'],
            'seniors': ['comfortable','warm','nostalgic']
        },
        '여름': {
            'teens': ['exciting','refreshing','tension-up'],
            'young-adults': ['exciting','refreshing','feel-good'],
            'middle-aged': ['refreshing','feel-good','comfortable'],
            'seniors': ['comfortable','healing','calm']
        },
        '가을': {
            'teens': ['emotional','nostalgic','calm'],
            'young-adults': ['emotional','nostalgic','sentimental'],
            'middle-aged': ['nostalgic','calm','warm'],
            'seniors': ['nostalgic','warm','comfortable']
        },
        '겨울': {
            'teens': ['cozy','warm','emotional'],
            'young-adults': ['cozy','warm','emotional'],
            'middle-aged': ['warm','cozy','nostalgic'],
            'seniors': ['warm','comfortable','nostalgic']
        },
        '감사와 고마움': {
            'teens': ['warm','emotional','feel-good'],
            'young-adults': ['warm','emotional','comfort'],
            'middle-aged': ['warm','emotional','nostalgic'],
            'seniors': ['warm','nostalgic','comfort']
        },
        '자신감/도전': {
            'teens': ['confidence','exciting','tension-up'],
            'young-adults': ['confidence','powerful','exciting'],
            'middle-aged': ['confidence','powerful','feel-good'],
            'seniors': ['confidence','feel-good','warm']
        },
        '명상/마음챙김': {
            'teens': ['calm','comfortable','healing'],
            'young-adults': ['calm','healing','comfortable'],
            'middle-aged': ['healing','calm','comfortable'],
            'seniors': ['healing','calm','warm']
        },
        '클럽/나이트': {
            'teens': ['exciting','groovy','tension-up'],
            'young-adults': ['exciting','groovy','tension-up'],
            'middle-aged': ['groovy','exciting','feel-good'],
            'seniors': ['feel-good','groovy','comfortable']
        },
        '페스티벌': {
            'teens': ['exciting','tension-up','groovy'],
            'young-adults': ['exciting','tension-up','groovy'],
            'middle-aged': ['exciting','feel-good','groovy'],
            'seniors': ['feel-good','comfortable','exciting']
        },
        '결혼/웨딩': {
            'teens': ['flutter','love','exciting'],
            'young-adults': ['love','flutter','emotional'],
            'middle-aged': ['love','warm','emotional'],
            'seniors': ['love','warm','nostalgic']
        },
        '육아/가족': {
            'teens': ['warm','comfortable','feel-good'],
            'young-adults': ['warm','comfortable','cozy'],
            'middle-aged': ['warm','comfortable','emotional'],
            'seniors': ['warm','nostalgic','emotional']
        },
        '반려동물': {
            'teens': ['feel-good','warm','comfortable'],
            'young-adults': ['warm','feel-good','comfortable'],
            'middle-aged': ['warm','comfortable','healing'],
            'seniors': ['warm','healing','comfortable']
        },
        '출발/시작': {
            'teens': ['exciting','refreshing','confidence'],
            'young-adults': ['refreshing','exciting','confidence'],
            'middle-aged': ['refreshing','feel-good','confidence'],
            'seniors': ['comfortable','warm','feel-good']
        },
        '응원/격려': {
            'teens': ['exciting','confidence','powerful'],
            'young-adults': ['confidence','powerful','exciting'],
            'middle-aged': ['confidence','warm','comfort'],
            'seniors': ['warm','comfort','confidence']
        },
        '회상/추억여행': {
            'teens': ['nostalgic','emotional','sentimental'],
            'young-adults': ['nostalgic','emotional','sentimental'],
            'middle-aged': ['nostalgic','warm','emotional'],
            'seniors': ['nostalgic','warm','comfort']
        },
        '일상/루틴': {
            'teens': ['feel-good','comfortable','calm'],
            'young-adults': ['comfortable','calm','feel-good'],
            'middle-aged': ['comfortable','calm','warm'],
            'seniors': ['comfortable','warm','calm']
        },
        '특별한 하루': {
            'teens': ['exciting','feel-good','flutter'],
            'young-adults': ['feel-good','exciting','emotional'],
            'middle-aged': ['feel-good','emotional','warm'],
            'seniors': ['warm','feel-good','nostalgic']
        }
    };

    // 상황 텍스트에서 분위기 키워드를 감지하여 추가 보정
    // === 상황 텍스트 → 분위기 매핑 키워드 ===
    // 주의: 짧은 단어(1글자)는 오매칭 위험 → 최소 2글자 이상 사용
    // "눈" → "눈오는/눈이오/눈 내리/첫눈" (눈 감다와 구분)
    // "비" → "비오는/비 내리/빗소리" (비행기/비밀과 구분)
    // "콘서트" → exciting이 아닌 immersive로 (조용히 감상하는 맥락)
    const situationMoodKeywords = {
        // === 긍정/기분 ===
        'feel-good': ['최고','행복','즐거','웃음','기분좋','맛있','재밌','재미있','승진','합격','성공','당첨','뿌듯','보람','만족','축하','칭찬','대견','자랑','선물받','감사','고마워','감격','잘했','대박','행운','기적','보너스','월급날'],
        'exciting': ['신나','에너지','축제','파티','춤추','댄스','환호','응원','열광','떼창','불꽃','놀이공원','워터파크','모험','탐험','놀러','놀자','신난','흥분','열정','광란'],
        // === 편안/안정 ===
        'comfortable': ['편안','편하게','릴렉스','느긋','여유로','한가','누워서','소파','이불','낮잠','나른','늘어지','뒹굴','아무것도','느릿','천천히','쉬는','쉬고'],
        'calm': ['조용','고요','평화','차분','잔잔','가만히','명상','적막','멍때리','바라보며','가만','고요한','정적','평온','평온한'],
        'healing': ['힐링','치유','회복','충전','안식','치유되','치유의'],
        'warm': ['따뜻','따스','온기','감싸','훈훈','온정','온기가','정이가'],
        'cozy': ['포근','아늑','촛불','담요','벽난로','핫초코','모닥불','불멍','이불속','이불밖'],
        // === 감성/몽환 ===
        'emotional': ['감동','울컥','뭉클','찡하','벅차','소름','전율','감격','가슴이','가슴뭉클','목놓아','목이메','눈시울','깊은감동'],
        'dreamy': ['몽환','구름위','별빛','달빛','은하','우주','떠다니','비현실','신비','환상','동화','마법','꿈같','꿈속','꿈꾸'],
        'sentimental': ['센치','감상적','씁쓸','아련','희미한','서글','묘한','형용할수없','말로표현','감상에'],
        'dawn-mood': ['새벽감','밤새워','뜬 눈','잠 안 오','해뜨기전','여명','동틀녘','새벽3','새벽4','새벽5'],
        // === 설렘/사랑 ===
        'flutter': ['설레','두근','떨려','반하','좋아하는','고백','짝사랑','눈맞','손잡','썸타','심쿵','첫사랑','첫만남','첫눈에'],
        'love': ['사랑','연인','커플','데이트','키스','포옹','안기','허그','영원히','프러포즈','결혼식','신혼','사랑해'],
        // === 슬픔/외로움 ===
        'lonely': ['혼자서','외로','쓸쓸','텅 빈','고독','아무도없','홀로','공허','허전','비어있는','텅빈'],
        'breakup': ['이별','헤어지','떠나가','잊지못','울면서','돌아서','마지막으로','놓아주','보내줘','안녕히','다시는'],
        'nostalgic': ['추억','그때그','옛날','어릴때','어린시절','그립다','돌아가고','예전에','지난날','돌이키','회상','기억나','잊혀','세월이','시간이'],
        // === 집중/학습/몰입 ===
        'focus': ['집중하','몰두','공부하','과제','마감','데드라인','준비하','연습하','훈련','정신통일'],
        'immersive': ['몰입','빠져들','정신없이','시간가는','잊고서','푹빠져','코딩','작곡','창작','클래식','오케스트라','콘서트홀','감상','연주','음악감상','음악듣','틀어놓고','눈감','귀기울'],
        'study': ['공부','시험','수능','내신','기말','중간고사','암기','노트정리','도서관에서','자습'],
        // === 에너지/파워 ===
        'tension-up': ['긴장','조마조마','초조','불안한','걱정되','무대위','발표하','면접','오디션','경기전','시합','대결','승부','떨리는마음'],
        'powerful': ['파워풀','강렬한','폭발적','레전드','역대급','대단한','엄청난','최강','압도','위압'],
        'confidence': ['자신감','할수있','해내','도전하','이겨내','극복','승리','챔피언','우승','당당','떳떳','나를믿','자신있'],
        'anger': ['화나','분노','열받아','빡쳐서','때리고','부수고','폭발할','싸우','억울','불공평','짜증나','미워','배신'],
        // === 스트레스/부정 ===
        'stress-relief': ['지각','놓쳐','늦잠','짜증','스트레스','미치겠','죽겠','피곤한','지쳐서','힘든','빡쳐','열받아','망했','폭망','실수로','야근하','밤샘','잠못자','불면','안풀리','꼬여서','재수없','최악','엉망','퇴짜','거절당','탈락','불합격','실패'],
        // === 위로/치유 ===
        'comfort': ['위로','힘내','괜찮아','버텨','견뎌','아프다','아픔','상처받','슬퍼','서러워','눈물이','울었','응원','격려','토닥','안아줘','옆에있','곁에있','지켜줘'],
        // === 활동/상쾌 ===
        'refreshing': ['상쾌','시원한','산뜻','맑은','깨끗한','가뿐','개운','리프레시','새출발','리셋','재시작'],
        'groovy': ['리듬','그루브','비트','춤을','흔들','박자','노래방','떼창','흥겨','흥이나'],
        // === 날씨/시간 (문맥 충돌 방지: 구체적 표현만) ===
        'rainy': ['비오는','비내리','빗소리','빗방울','우산을','장마','소나기','촉촉한','비가오','비가와','비올때'],
        'snowy': ['눈오는','눈내리','눈이오','첫눈','눈송이','눈꽃','설경','눈사람','눈싸움','눈이와','눈이내'],
        'sunset': ['석양','노을','일몰','해질녘','황혼','해넘이','해지는','주황빛','붉은하늘','해가지'],
        // === 수면 ===
        'sleep': ['잠자','자장가','꿈나라','졸리','꾸벅','선잠','깊은잠','잠에','잠이들','잠잘'],
        'sleep-aid': ['수면유도','불면증','뒤척이','잠들기','숙면','잠이안와','잠못드는']
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
                opt.value = s.label;
                opt.textContent = `${s.emoji} ${s.label}`;
                easySituationSelect.appendChild(opt);
            });
            easySituationSelect.disabled = false;
        }

    }

    if (easySituationTheme) {
        easySituationTheme.addEventListener('change', () => {
            renderEasySituations();
            if (easySituationSelect) easySituationSelect.value = '';
            selections.place = [];
            selections._themeMoods = [];
            situationPreview.style.display = 'none';
            confirmed.step2 = false;
            confirmed.step3 = false;
            confirmed.step4 = false;
            confirmedSituationText = '';
            const fb2 = document.getElementById('step2Feedback');
            fb2.classList.remove('active');
            updateNextButton();
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
                selections.place = [];
                selections._themeMoods = [];
                situationPreview.style.display = 'none';
            }
            updateNextButton();
        });
    }

    // === 단계 이동 ===
    function goToStep(step) {
        stepPages.forEach(p => p.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');

        stepItems.forEach((item, i) => {
            const stepNum = i + 1;
            item.classList.remove('active', 'done');
            if (stepNum < step) item.classList.add('done');
            else if (stepNum === step) item.classList.add('active');
        });

        stepLines.forEach((line, i) => {
            line.classList.toggle('done', i < step - 1);
        });

        if (step <= totalSteps) {
            if (btnNext) btnNext.innerHTML = '다음 <span>→</span>';
            if (navInfo) navInfo.textContent = `${step} / ${totalSteps} 단계`;
            if (navButtons) navButtons.style.display = 'none';
            updateNextButton();
            updateNavApplyButton();
        } else {
            // Step 5: 결과 페이지
            if (navButtons) navButtons.style.display = 'none';
        }

        currentStep = step;
        updateApplyButtons();

        // 2단계 진입 시 타겟 변경 감지 → 리셋
        if (step === 2) {
            if (_lastStep2Target !== (selections.target[0] || '')) {
                _lastStep2Target = selections.target[0] || '';
                selections.place = [];
                selections._themeMoods = [];
                situationPreview.style.display = 'none';
                confirmed.step2 = false;
                confirmedSituationText = '';
                const fb2 = document.getElementById('step2Feedback');
                fb2.classList.remove('active');
            }
        }
        // 3단계 진입 시 1~2단계 데이터 기반 분위기 자동 추천
        if (step === 3) {
            // 2단계에서 확정한 상황 문장을 3단계에 표시
            const ctxEl = document.getElementById('step3SituationContext');
            const txtEl = document.getElementById('step3SituationText');
            if (ctxEl && txtEl && confirmedSituationText) {
                txtEl.textContent = confirmedSituationText;
                ctxEl.style.display = 'block';
            } else if (ctxEl) {
                ctxEl.style.display = 'none';
            }
            if (confirmedSituationText) {
                recalcThemeMoodsFromText(confirmedSituationText);
            } else {
                recalcThemeMoods();
            }
            autoRecommendMoods();
            updateApplyButtons();
        }
        if (step === 4) {
            _shownGenreHistory = []; // 4단계 진입 시 추천 이력 초기화
            buildGenreRecommendations();
            updateApplyButtons();
        }
        if (step === 5) buildFinalPrompt();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3단계 진입 시 1~2단계 데이터 기반 분위기 자동 추천
    let _lastAutoMoods = []; // 이전에 AI가 자동 선택한 분위기 추적
    function autoRecommendMoods() {
        const themeMoods = selections._themeMoods || [];
        if (themeMoods.length === 0) return;

        const step3 = document.getElementById('step3');

        // 이전에 AI가 자동 선택한 것만 해제 (사용자가 직접 추가한 것은 유지)
        _lastAutoMoods.forEach(moodKey => {
            const btn = step3.querySelector(`.option-card[data-value="${moodKey}"]`);
            if (btn && btn.classList.contains('selected')) {
                // 사용자가 수동으로 추가 선택한 분위기는 유지
                if (!selections.mood.includes(moodKey) || _lastAutoMoods.includes(moodKey)) {
                    btn.classList.remove('selected');
                }
            }
        });

        // 새로 추천할 분위기 2~3개 자동 선택
        const toSelect = themeMoods.slice(0, 3);
        toSelect.forEach(moodKey => {
            const btn = step3.querySelector(`.option-card[data-value="${moodKey}"]`);
            if (btn && !btn.classList.contains('selected')) {
                btn.classList.add('selected');
            }
        });
        _lastAutoMoods = toSelect.slice();

        // selections.mood 업데이트
        const selected = step3.querySelectorAll('.option-card.selected');
        selections.mood = Array.from(selected).map(c => c.dataset.value);
        updateNextButton();
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (currentStep <= 3) updateSelections();
            if (currentStep === 1 && confirmed.step1) goToStep(2);
            else if (currentStep === 2 && confirmed.step2) goToStep(3);
            else if (currentStep === 3 && confirmed.step3) goToStep(4);
        });
    }

    // 단계별 "다음" 버튼 이벤트
    document.getElementById('btnNextStep1')?.addEventListener('click', () => {
        if (confirmed.step1) { updateSelections(); goToStep(2); }
        else { alert('먼저 타겟층을 선택하고 적용하기를 눌러주세요.'); }
    });

    document.getElementById('btnNextStep2')?.addEventListener('click', () => {
        if (confirmed.step2) { updateSelections(); goToStep(3); }
        else { alert('먼저 상황을 선택하고 적용하기를 눌러주세요.'); }
    });

    document.getElementById('btnNextStep3')?.addEventListener('click', () => {
        if (confirmed.step3) { updateSelections(); goToStep(4); }
        else { alert('먼저 분위기를 선택하고 적용하기를 눌러주세요.'); }
    });

    // 4단계 다음 → 보컬 설정 완료 후 5단계
    document.getElementById('btnNextStep4')?.addEventListener('click', () => {
        if (confirmed.step4 && confirmed.vocal) { goToStep(5); }
        else if (!confirmed.step4) { alert('먼저 장르를 선택하고 적용하기를 눌러주세요.'); }
        else { alert('보컬 설정을 완료해주세요.'); }
    });

    // 이전 버튼 이벤트
    document.getElementById('btnPrevStep2')?.addEventListener('click', () => goToStep(1));
    document.getElementById('btnPrevStep3')?.addEventListener('click', () => goToStep(2));
    document.getElementById('btnPrevStep4')?.addEventListener('click', () => goToStep(3));

    // 적용 상태에 따라 step-nav 버튼 업데이트
    function updateNavApplyButton() {
        // 각 단계의 적용 버튼 텍스트 동기화
        document.querySelectorAll('.step-nav-apply').forEach(btn => {
            const stepKey = 'step' + currentStep;
            if (confirmed[stepKey]) {
                btn.innerHTML = '<span>✓</span> 적용완료';
                btn.classList.add('applied');
            }
        });
    }

    // =============================================
    // STEP 4: 장르 추천 + 선택 (통합)
    // =============================================
    function buildGenreRecommendations() {
        // 미니 요약 표시
        const targetText = selections.target.map(v => labelMap[v]).join(', ');
        const placeText = selections.place.map(v => labelMap[v] || v).join(', ');
        const moodText = selections.mood.map(v => labelMap[v]).join(', ');
        document.getElementById('miniTarget').textContent = '\uD83D\uDC64 ' + targetText;
        document.getElementById('miniPlace').textContent = '\uD83D\uDCCD ' + placeText;
        document.getElementById('miniMood').textContent = '\uD83C\uDFB5 ' + moodText;

        // 선택된 장르 이름들 (다시생성 시 유지)
        const selectedNames = selections.genres.slice();
        const excludeNames = selectedNames.concat(customGenres.map(g => g.genre));

        // 추천 엔진: 선택된 장르 제외하고 나머지 추천
        const neededCount = 5 - selectedNames.length - customGenres.filter(g => selections.genres.includes(g.genre)).length;
        const newRecs = recommendGenresExcluding(
            selections.target, selections.place, selections.mood, excludeNames, Math.max(0, neededCount)
        );

        // 선택된 장르 데이터 복원 + 새 추천 합치기
        const selectedData = selectedNames
            .map(name => {
                // DB에서 찾거나 커스텀에서 찾기
                return GENRE_DATABASE.find(g => g.genre === name)
                    || customGenres.find(g => g.genre === name)
                    || null;
            })
            .filter(Boolean)
            .map(g => ({ ...g, genre: g.genre }));

        // 커스텀 중 선택 안 된 것
        const unselectedCustom = customGenres.filter(g => !selections.genres.includes(g.genre));

        recommendedGenres = [...selectedData, ...unselectedCustom, ...newRecs].slice(0, Math.max(5, selectedData.length + unselectedCustom.length));

        renderGenreCards();
        updateGenreSelectInfo();
        updateNextButton();
    }

    // 이전에 추천했던 장르 이력 (다시 추천 시 제외용)
    let _shownGenreHistory = [];

    function recommendGenresExcluding(targetAges, places, moods, excludeNames, count) {
        if (count <= 0) return [];

        // 2단계 카테고리에서 자동 부여된 분위기도 합산
        const allMoods = [...moods];
        if (selections._themeMoods) {
            selections._themeMoods.forEach(m => {
                if (!allMoods.includes(m)) allMoods.push(m);
            });
        }

        const mappedAges = targetAges.flatMap(t => AGE_MAP[t] || []);
        const mappedPlaces = places.map(p => PLACE_MAP[p]).filter(Boolean);

        // 선택된 분위기의 v4 키워드로 변환
        const moodKeywords = [];
        allMoods.forEach(moodKey => {
            const vals = MOOD_TO_GENRE_MAP[moodKey] || [];
            vals.forEach(v => { if (!moodKeywords.includes(v)) moodKeywords.push(v); });
        });

        // 분위기 상충 쌍
        const genreConflicts = [
            ['집중','신나는'], ['집중','텐션업'], ['집중','흥겨운'], ['집중','파워풀한'],
            ['공부할때','신나는'], ['공부할때','텐션업'], ['공부할때','흥겨운'],
            ['몰입','신나는'], ['몰입','흥겨운'],
            ['잠잘때','신나는'], ['잠잘때','텐션업'], ['잠잘때','파워풀한'], ['잠잘때','흥겨운'],
            ['수면유도','신나는'], ['수면유도','텐션업'], ['수면유도','파워풀한'],
            ['편안한','분노'], ['편안한','텐션업'],
            ['힐링','분노'], ['힐링','텐션업'], ['힐링','파워풀한'],
            ['쓸쓸한','신나는'], ['쓸쓸한','기분좋은'], ['쓸쓸한','흥겨운'],
            ['위로','신나는'], ['위로','텐션업'],
            ['감성적','분노'],
            ['잔잔한','텐션업'], ['잔잔한','파워풀한'], ['잔잔한','분노']
        ];

        // 이전 추천 이력 + 현재 선택된 장르를 합쳐서 제외 대상 구성
        const allExcludes = [...new Set([...excludeNames, ..._shownGenreHistory])];

        function scoreGenres(excludeList, requireMoodMatch, useConflictFilter) {
            const scores = {};
            GENRE_DATABASE.forEach(genre => {
                if (excludeList.includes(genre.genre)) return;

                // 연령대 필터
                if (mappedAges.length > 0) {
                    const ageMatch = mappedAges.some(age => genre.age.includes(age));
                    if (!ageMatch) return;
                }

                // 상충 필터
                if (useConflictFilter && moodKeywords.length > 0) {
                    const hasConflict = moodKeywords.some(sm =>
                        genre.mood.some(gm =>
                            genreConflicts.some(([a, b]) =>
                                (a === sm && b === gm) || (b === sm && a === gm)
                            )
                        )
                    );
                    if (hasConflict) return;
                }

                let placeScore = 0;
                let moodScore = 0;
                mappedPlaces.forEach(p => { if (genre.place.includes(p)) placeScore++; });
                moodKeywords.forEach(mk => { if (genre.mood.includes(mk)) moodScore++; });

                // 분위기 매칭 필수 여부
                if (requireMoodMatch && moodKeywords.length > 0 && moodScore === 0) return;

                const score = moodScore * 1000 + placeScore * 100 + Math.random() * 10;
                scores[genre.genre] = { score, data: genre };
            });
            return Object.entries(scores)
                .sort((a, b) => b[1].score - a[1].score)
                .slice(0, count)
                .map(([name, { score, data }]) => ({ genre: name, score, ...data }));
        }

        // 1차: 엄격 필터 (이력 제외 + 상충 제외 + 분위기 필수)
        let results = scoreGenres(allExcludes, true, true);

        // 2차 fallback: 이력 무시하고 엄격 필터 (선택된 장르만 제외)
        if (results.length < count) {
            results = scoreGenres(excludeNames, true, true);
        }

        // 3차 fallback: 상충 필터만 적용 (분위기 매칭 0도 허용)
        if (results.length < count) {
            results = scoreGenres(excludeNames, false, true);
        }

        // 4차 fallback: 연령대 + 장소/분위기 점수만 (모든 필터 해제)
        if (results.length < count) {
            results = scoreGenres(excludeNames, false, false);
        }

        // 추천된 장르를 이력에 추가
        results.forEach(r => {
            if (!_shownGenreHistory.includes(r.genre)) _shownGenreHistory.push(r.genre);
        });

        return results;
    }

    function renderGenreCards() {
        const container = document.getElementById('genreRecommendList');
        container.innerHTML = '';

        recommendedGenres.forEach((g, i) => {
            const selIdx = selections.genres.indexOf(g.genre);
            const isSelected = selIdx > -1;
            const isCustom = customGenres.some(cg => cg.genre === g.genre);
            const isDisabled = !isSelected && selections.genres.length >= 2;

            // 역할 결정
            let roleHtml = '';
            if (selIdx === 0) {
                roleHtml = '<span class="genre-rec-role main-role">\u2B50 메인 장르</span>';
            } else if (selIdx === 1) {
                roleHtml = '<span class="genre-rec-role blend-role">\uD83C\uDFA8 블렌딩 장르</span>';
            }

            // CSS 클래스
            let cardClass = 'genre-rec-card';
            if (isSelected && selIdx === 0) cardClass += ' selected main-genre';
            else if (isSelected && selIdx === 1) cardClass += ' selected blend-genre';
            if (isCustom) cardClass += ' custom-genre';
            if (isDisabled) cardClass += ' disabled';

            const placeTagsHtml = (g.place || []).map(p => `<span class="genre-rec-tag">\uD83D\uDCCD ${p}</span>`).join('');
            const moodTagsHtml = (g.mood || []).map(m => `<span class="genre-rec-tag">\uD83C\uDFB5 ${m}</span>`).join('');
            const ageTagsHtml = (g.age || []).map(a => `<span class="genre-rec-tag">\uD83D\uDC64 ${a}</span>`).join('');
            const reasons = buildRecommendReason(g, selections);
            const fullDesc = buildGenreDescription(g);

            const rankDisplay = isSelected ? (selIdx === 0 ? '⭐' : '🎨') : (i + 1);

            const card = document.createElement('div');
            card.className = cardClass;
            card.dataset.genre = g.genre;
            card.title = fullDesc;
            card.innerHTML = `
                <div class="genre-rec-rank">${rankDisplay}</div>
                <div class="genre-rec-content">
                    <div class="genre-rec-name">${g.genre} ${roleHtml} ${isCustom ? '<span style="color: var(--text-secondary); font-size: 0.8em;">(직접 입력)</span>' : ''}</div>
                    <div class="genre-rec-main">${g.main || 'Custom'} ${g.sub ? '> ' + g.sub : ''}</div>
                    <div class="genre-rec-desc">${fullDesc}</div>
                    <div class="genre-rec-desc" style="color: var(--primary); font-weight: 500;">
                        💡 <strong>${isCustom ? '입력 장르' : '추천 이유'}:</strong> ${reasons}
                    </div>
                    <div class="genre-rec-tags">
                        ${ageTagsHtml} ${placeTagsHtml} ${moodTagsHtml}
                    </div>
                </div>
            `;

            if (!isDisabled) {
                card.addEventListener('click', () => toggleGenreSelection(g.genre, g));
            }

            container.appendChild(card);
        });
    }

    // 장르 설명 2문장 생성 (desc + 악기/BPM/보컬 정보 결합)
    function buildGenreDescription(g) {
        if (!g) return '';
        const parts = [];

        // 1문장: 기본 설명
        if (g.desc) {
            parts.push(g.desc);
        } else {
            parts.push(`${g.genre}은(는) ${g.main || ''} 카테고리의 장르입니다.`);
        }

        // 2문장: 악기/BPM/보컬 기반 추가 설명
        const extras = [];
        if (g.bpm) extras.push(`템포는 ${g.bpm} BPM`);
        if (g.instruments) {
            const instrList = g.instruments.split(', ').slice(0, 3);
            const instrMap = {
                'acoustic guitar': '어쿠스틱 기타', 'electric guitar': '일렉 기타', 'piano': '피아노',
                'synth': '신디사이저', 'bass': '베이스', 'drums': '드럼', 'strings': '스트링',
                'brass': '브라스', 'saxophone': '색소폰', 'violin': '바이올린', 'banjo': '밴조',
                'mandolin': '만돌린', 'harmonica': '하모니카', 'organ': '오르간', 'flute': '플루트'
            };
            const korInstr = instrList.map(i => {
                const key = Object.keys(instrMap).find(k => i.toLowerCase().includes(k));
                return key ? instrMap[key] : i;
            });
            extras.push(`${korInstr.join(', ')} 중심의 사운드`);
        }
        if (g.vocal) {
            const vocalShort = g.vocal.split(', ').slice(0, 2).join(', ');
            extras.push(`${vocalShort} 보컬`);
        }

        if (extras.length > 0) {
            parts.push(extras.join('이며, ') + '가 특징입니다.');
        }

        return parts.join(' ');
    }

    function toggleGenreSelection(genreName, genreData) {
        const idx = selections.genres.indexOf(genreName);

        if (idx > -1) {
            // 선택 해제
            selections.genres.splice(idx, 1);
            confirmed.step4 = false;
        } else if (selections.genres.length < 2) {
            // 선택 추가 (먼저 선택한 장르 = 메인)
            selections.genres.push(genreName);
            confirmed.step4 = false;
        } else {
            return; // 이미 2개
        }

        renderGenreCards();
        updateGenreSelectInfo();
        updateApplyButtons();
        updateNextButton();
    }

    function updateGenreSelectInfo() {
        const info = document.getElementById('genreSelectInfo');
        const count = selections.genres.length;
        if (count === 0) {
            info.innerHTML = '<p>추천된 장르 중 마음에 드는 장르를 <strong>클릭</strong>하세요 (최대 2개)</p>';
        } else if (count === 1) {
            info.innerHTML = `<p>\u2B50 <strong>${selections.genres[0]}</strong> (메인 장르) \u2014 1개 더 선택하면 장르가 블렌딩됩니다</p>`;
        } else {
            info.innerHTML = `<p>\u2B50 <strong>${selections.genres[0]}</strong> (메인) + \uD83C\uDFA8 <strong>${selections.genres[1]}</strong> (블렌딩)</p>`;
        }
    }

    function updateRegenerateHint() {
        const hint = document.getElementById('regenerateHint');
        const count = selections.genres.length;
        if (count === 0) {
            hint.textContent = '다시 추천받기를 누르면 새로운 5개 장르를 추천해요.';
        } else {
            hint.textContent = `선택한 ${count}개 장르는 유지하고, 나머지만 새로 추천해요.`;
        }
    }

    function buildRecommendReason(genre, sel) {
        if (!genre.age && !genre.place && !genre.mood) {
            return '사용자가 직접 입력한 장르입니다. 메인 또는 블렌딩 장르로 사용할 수 있습니다.';
        }

        const parts = [];
        const matchedAges = sel.target.flatMap(t => AGE_MAP[t] || []);
        const ageMatches = matchedAges.filter(a => (genre.age || []).includes(a));
        if (ageMatches.length > 0) {
            parts.push(`${ageMatches.join(', ')} 연령대에서 인기 있는 장르입니다`);
        } else if (sel.target.includes('everyone') || sel.target.includes('family')) {
            parts.push('모든 연령대가 편하게 즐길 수 있는 장르입니다');
        }

        const matchedPlaces = sel.place.map(p => PLACE_MAP[p]).filter(Boolean);
        const placeMatches = matchedPlaces.filter(p => (genre.place || []).includes(p));
        if (placeMatches.length > 0) {
            parts.push(`${placeMatches.join(', ')}에서 듣기 좋습니다`);
        }

        const moodNames = sel.mood.map(m => labelMap[m]).filter(Boolean);
        if (moodNames.length > 0) {
            parts.push(`${moodNames.join(', ')} 분위기와 잘 어울립니다`);
        }

        return parts.length > 0 ? parts.join('. ') + '.' : '추천 조건에 부합하는 장르입니다.';
    }

    // === 다시생성 버튼 ===
    document.getElementById('btnRegenerate').addEventListener('click', () => {
        updateRegenerateHint();
        buildGenreRecommendations();
    });

    // === 장르 검색 기능 (HTML에서 삭제됨 — null 안전 처리) ===
    const customInput = document.getElementById('customGenreInput');
    const btnSearchGenre = document.getElementById('btnSearchGenre');
    const searchResultsArea = document.getElementById('searchResultsArea');
    if (!customInput || !btnSearchGenre || !searchResultsArea) {
        // 검색 영역이 삭제된 상태 — 이하 검색 관련 코드 스킵
        console.log('[Easy] 검색 영역 없음 — 드롭다운 방식 사용');
    } else {

    // 한글 → 영어 키워드 매핑
    const korToEngMap = {
        '팝': 'pop', '발라드': 'ballad', '록': 'rock', '락': 'rock',
        '힙합': 'hip hop', '랩': 'rap', '트랩': 'trap', '재즈': 'jazz',
        '클래식': 'classical', '클레식': 'classical', '오케스트라': 'orchestral',
        '일렉': 'electronic', '일렉트로닉': 'electronic', '전자': 'electronic',
        '하우스': 'house', '디스코': 'disco', '펑크': 'funk', '펑키': 'funk',
        '컨트리': 'country', '포크': 'folk', '블루스': 'blues',
        '소울': 'soul', '알앤비': 'r&b', '알엔비': 'r&b',
        '앰비언트': 'ambient', '뉴에이지': 'new age', '명상': 'meditation',
        '스파': 'spa', '힐링': 'new age', '치유': 'meditation',
        '레게': 'reggae', '레개': 'reggae', '라틴': 'latin',
        '보사노바': 'bossa nova', '삼바': 'latin', '탱고': 'tango',
        '아프로': 'afro', '케이팝': 'k-pop', '케이퍼': 'k-pop',
        '제이팝': 'j-pop', '인디': 'indie', '어쿠스틱': 'acoustic',
        '신스': 'synth', '신디사이저': 'synth', '복고': 'retro',
        '레트로': 'retro', '시티팝': 'city pop', '드럼': 'drum',
        '베이스': 'bass', '트로피컬': 'tropical', '칠': 'chill',
        '로파이': 'lo-fi', '로파': 'lo-fi', '다운템포': 'downtempo',
        '트랜스': 'trance', '덥스텝': 'dubstep', '메탈': 'metal',
        '가스펠': 'gospel', '찬양': 'gospel', 'ccm': 'christian',
        '피아노': 'piano', '바이올린': 'violin', '오르간': 'organ',
        '기타': 'guitar', '색소폰': 'sax', '플루트': 'flute',
        '영화': 'cinematic', '영화음악': 'cinematic', '사운드트랙': 'soundtrack',
        '에픽': 'epic', '웅장': 'epic', '공포': 'horror',
        '무서운': 'horror', '몽환': 'dream', '꿈': 'dream',
        '슬픈': 'ballad', '감성': 'emotional', '신나는': 'dance',
        '운동': 'workout', '카페': 'cafe', '수면': 'sleep',
        '공부': 'study', '집중': 'focus', '파티': 'party',
        '클럽': 'club', '웨딩': 'wedding', '결혼': 'wedding',
        '어린이': "kid's", '키즈': "kid's", '동요': "kid's",
        '월드': 'world', '민속': 'ethnic', '플라멩코': 'flamenco',
        '스카': 'ska', '펑크록': 'punk', '그런지': 'grunge',
        '슈게이즈': 'shoegaze', '프로그레시브': 'progressive',
        '하드코어': 'hardcore', '트로트': 'trot', '스무스': 'smooth'
    };

    // 검색 상태 관리
    let lastSearchQuery = '';
    let searchShownGenres = []; // 이미 보여준 장르들

    btnSearchGenre.addEventListener('click', () => {
        // "다시 검색" 모드: 같은 키워드로 다음 5개
        if (btnSearchGenre.classList.contains('is-retry')) {
            performSearch(lastSearchQuery);
            return;
        }

        const query = customInput.value.trim();
        if (!query) return;
        // 새 검색어면 초기화
        searchShownGenres = [];
        lastSearchQuery = query;
        performSearch(query);
    });

    customInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnSearchGenre.click();
    });

    document.getElementById('btnCloseSearch').addEventListener('click', () => {
        searchResultsArea.style.display = 'none';
    });

    // 다시 검색 버튼
    document.getElementById('btnSearchMore').addEventListener('click', () => {
        if (lastSearchQuery) {
            performSearch(lastSearchQuery);
        }
    });

    function performSearch(rawQuery) {
        const query = rawQuery.toLowerCase().trim();

        // 한글 → 영어 변환
        let searchTerms = [query];
        // 한글 키워드 매핑 확인
        for (const [kor, eng] of Object.entries(korToEngMap)) {
            if (query.includes(kor)) {
                searchTerms.push(eng);
            }
        }
        // 영어 입력은 그대로 사용
        searchTerms = [...new Set(searchTerms)];

        // 메인 장르 데이터
        const mainGenreName = selections.genres.length > 0 ? selections.genres[0] : null;
        const mainGenreData = mainGenreName
            ? GENRE_DATABASE.find(g => g.genre === mainGenreName)
            : null;

        // DB에서 매칭되는 장르 찾기
        const matchedGenres = GENRE_DATABASE.filter(g => {
            // 이미 보여준 장르 제외
            if (searchShownGenres.includes(g.genre)) return false;
            // 이미 추천 목록에 선택된 장르 제외
            if (selections.genres.includes(g.genre)) return false;

            const name = g.genre.toLowerCase();
            const main = g.main.toLowerCase();
            const sub = (g.sub || '').toLowerCase();
            const desc = (g.desc || '').toLowerCase();

            return searchTerms.some(term =>
                name.includes(term) ||
                main.includes(term) ||
                sub.includes(term) ||
                desc.includes(term) ||
                term.includes(name.split(' ')[0])
            );
        });

        // 메인 장르와의 융합 점수 계산
        const scored = matchedGenres.map(g => {
            let blendScore = 0;

            if (mainGenreData) {
                if (g.main === mainGenreData.main) blendScore += 5;
                blendScore += g.mood.filter(m => mainGenreData.mood.includes(m)).length * 3;
                blendScore += g.age.filter(a => mainGenreData.age.includes(a)).length * 2;
                blendScore += g.place.filter(p => mainGenreData.place.includes(p)).length;
                if (g.main !== mainGenreData.main) blendScore += 2;
            }

            // 검색어 정확도 보너스
            searchTerms.forEach(term => {
                if (g.genre.toLowerCase() === term) blendScore += 10;
                else if (g.genre.toLowerCase().startsWith(term)) blendScore += 5;
                else if (g.genre.toLowerCase().includes(term)) blendScore += 3;
            });

            return { ...g, blendScore };
        });

        scored.sort((a, b) => b.blendScore - a.blendScore);
        const top5 = scored.slice(0, 5);

        const noMoreEl = document.getElementById('searchNoMore');
        const btnMore = document.getElementById('btnSearchMore');

        // 결과 없음
        if (top5.length === 0 && searchShownGenres.length === 0) {
            searchResultsArea.style.display = 'block';
            document.getElementById('searchResultsTitle').textContent =
                `"${rawQuery}" 검색 결과가 없습니다. 다른 키워드로 검색해보세요.`;
            document.getElementById('searchResultsList').innerHTML = '';
            btnMore.style.display = 'none';
            noMoreEl.style.display = 'none';
            return;
        }

        if (top5.length === 0 && searchShownGenres.length > 0) {
            // 더 이상 추천할 장르 없음
            noMoreEl.style.display = 'block';
            btnMore.style.display = 'none';
            return;
        }

        // 보여준 장르 기록
        top5.forEach(g => searchShownGenres.push(g.genre));

        // 아직 더 있는지 확인
        const remainingCount = scored.length - 5;
        if (remainingCount > 0) {
            btnMore.style.display = '';
            noMoreEl.style.display = 'none';
        } else {
            btnMore.style.display = 'none';
            noMoreEl.style.display = top5.length > 0 ? 'none' : 'block';
        }

        const titleText = mainGenreName
            ? `"${rawQuery}" 검색 결과 — "${mainGenreName}"과(와) 잘 어울리는 장르`
            : `"${rawQuery}" 검색 결과`;

        document.getElementById('searchResultsTitle').textContent = titleText;

        const container = document.getElementById('searchResultsList');
        container.innerHTML = '';

        top5.forEach((g, i) => {
            const isSelected = selections.genres.includes(g.genre);
            const isDisabled = !isSelected && selections.genres.length >= 2;

            let blendReason = '';
            if (mainGenreData) {
                const moodOverlap = g.mood.filter(m => mainGenreData.mood.includes(m));
                const placeOverlap = g.place.filter(p => mainGenreData.place.includes(p));
                const parts = [];
                if (g.main === mainGenreData.main) parts.push('같은 장르 계열로 자연스러운 블렌딩 가능');
                else parts.push('크로스오버로 독특한 사운드 가능');
                if (moodOverlap.length > 0) parts.push(`${moodOverlap.join(', ')} 분위기가 공통됨`);
                if (placeOverlap.length > 0) parts.push(`${placeOverlap.join(', ')} 장소에서 함께 어울림`);
                blendReason = parts.join('. ') + '.';
            } else {
                blendReason = buildRecommendReason(g, selections);
            }

            const ageTagsHtml = g.age.map(a => `<span class="genre-rec-tag">\uD83D\uDC64 ${a}</span>`).join('');
            const placeTagsHtml = g.place.map(p => `<span class="genre-rec-tag">\uD83D\uDCCD ${p}</span>`).join('');
            const moodTagsHtml = g.mood.map(m => `<span class="genre-rec-tag">\uD83C\uDFB5 ${m}</span>`).join('');

            let cardClass = 'genre-rec-card';
            if (isSelected) cardClass += ' selected';
            if (isDisabled) cardClass += ' disabled';

            const card = document.createElement('div');
            card.className = cardClass;
            card.dataset.genre = g.genre;
            card.innerHTML = `
                <div class="genre-rec-rank">${i + 1}</div>
                <div class="genre-rec-content">
                    <div class="genre-rec-name">${g.genre}</div>
                    <div class="genre-rec-main">${g.main} > ${g.sub || ''}</div>
                    <div class="genre-rec-desc">${g.desc}</div>
                    <div class="genre-rec-desc" style="color: var(--primary); font-weight: 500;">
                        \uD83D\uDCA1 <strong>블렌딩 추천 이유:</strong> ${blendReason}
                    </div>
                    <div class="genre-rec-tags">
                        ${ageTagsHtml} ${placeTagsHtml} ${moodTagsHtml}
                    </div>
                </div>
            `;

            if (!isDisabled) {
                card.addEventListener('click', () => {
                    toggleGenreSelection(g.genre, g);
                    renderGenreCards();
                    // 검색 결과 카드 선택 상태 반영
                    refreshSearchResultCards();
                });
            }

            container.appendChild(card);
        });

        searchResultsArea.style.display = 'block';
        customInput.value = '';

        // 검색 버튼을 "다시 검색"으로 변경
        btnSearchGenre.textContent = '\uD83D\uDD04 \uB2E4\uC2DC \uAC80\uC0C9';
        btnSearchGenre.classList.add('is-retry');

        searchResultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 검색 결과 카드의 선택 상태만 갱신
    function refreshSearchResultCards() {
        const cards = document.querySelectorAll('#searchResultsList .genre-rec-card');
        cards.forEach(card => {
            const name = card.dataset.genre;
            const selIdx = selections.genres.indexOf(name);
            const isSelected = selIdx > -1;
            const isDisabled = !isSelected && selections.genres.length >= 2;

            card.classList.toggle('selected', isSelected);
            card.classList.toggle('main-genre', selIdx === 0);
            card.classList.toggle('blend-genre', selIdx === 1);
            card.classList.toggle('disabled', isDisabled);

            // 역할 표시 업데이트
            const nameEl = card.querySelector('.genre-rec-name');
            const baseName = name;
            if (selIdx === 0) {
                nameEl.innerHTML = `${baseName} <span class="genre-rec-role main-role">\u2B50 \uBA54\uC778 \uC7A5\uB974</span>`;
            } else if (selIdx === 1) {
                nameEl.innerHTML = `${baseName} <span class="genre-rec-role blend-role">\uD83C\uDFA8 \uBE14\uB80C\uB529 \uC7A5\uB974</span>`;
            } else {
                nameEl.innerHTML = baseName;
            }

            // 순위 표시
            const rankEl = card.querySelector('.genre-rec-rank');
            if (selIdx === 0) rankEl.textContent = '\u2B50';
            else if (selIdx === 1) rankEl.textContent = '\uD83C\uDFA8';
        });
    }

    // 입력창에 새 텍스트 입력 시 버튼을 "검색"으로 복원
    customInput.addEventListener('input', () => {
        if (customInput.value.trim() !== lastSearchQuery) {
            btnSearchGenre.textContent = '\uAC80\uC0C9';
            btnSearchGenre.classList.remove('is-retry');
        }
    });
    } // if (!customInput || !btnSearchGenre || !searchResultsArea) else 블록 끝

    // =============================================
    // STEP 5: 최종 프롬프트 생성
    // =============================================
    let generatedExcludeBase = ''; // AI가 자동 생성한 기본 제외 스타일
    let userExcludeTags = [];       // 사용자가 추가한 제외 항목

    function buildFinalPrompt() {
        // 불러온 파일이 있으면 해당 데이터 사용
        if (importedPromptData) {
            const data = importedPromptData;

            document.getElementById('promptExplanation').textContent = data.explanation || '\uBD88\uB7EC\uC628 \uD504\uB86C\uD504\uD2B8\uC785\uB2C8\uB2E4. \uC544\uB798\uC5D0\uC11C \uC218\uC815 \uD6C4 \uC0AC\uC6A9\uD558\uC138\uC694.';
            document.getElementById('stylePromptText').textContent = data.stylePrompt;
            document.getElementById('stylePromptKor').innerHTML =
                '\uD83D\uDCCC <strong>\uD55C\uAD6D\uC5B4 \uC124\uBA85:</strong> \uC774\uC804\uC5D0 \uC800\uC7A5\uD55C \uD504\uB86C\uD504\uD2B8\uB97C \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4. \uC218\uC815 \uD6C4 \uBCF5\uC0AC\uD558\uAC70\uB098 \uBC14\uB85C \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.';

            generatedExcludeBase = data.excludeStyles;
            userExcludeTags = [];
            updateExcludeStylesText();

            document.querySelectorAll('.exclude-tag-btn').forEach(btn => btn.classList.remove('active'));

            document.getElementById('excludeStylesKor').textContent =
                '\uD83D\uDCCC \uD55C\uAD6D\uC5B4 \uC124\uBA85: \uBD88\uB7EC\uC628 Exclude Styles\uC785\uB2C8\uB2E4. \uC544\uB798 \uBC84\uD2BC\uC73C\uB85C \uD56D\uBAA9\uC744 \uCD94\uAC00/\uC81C\uAC70\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.';

            const w = data.weirdness;
            const s = data.styleInfluence;
            document.getElementById('weirdnessFill').style.width = w + '%';
            document.getElementById('weirdnessValue').textContent = w + '%';
            document.getElementById('styleInfluenceFill').style.width = s + '%';
            document.getElementById('styleInfluenceValue').textContent = s + '%';
            document.getElementById('moreOptionsKor').innerHTML = buildMoreOptionsKorDesc(w, s);

            initExcludeToggles();
            updateVocalTypeBadge(data.stylePrompt);

            // 불러온 프롬프트의 Simple 버전 생성
            document.getElementById('simplePromptText').textContent = data.simplePrompt || data.stylePrompt.substring(0, 490);
            document.getElementById('simplePromptKor').innerHTML =
                '\uD83D\uDCCC <strong>Simple \uBAA8\uB4DC\uC6A9:</strong> \uBD88\uB7EC\uC628 \uD504\uB86C\uD504\uD2B8\uC758 Simple \uBC84\uC804\uC785\uB2C8\uB2E4.';

            importedPromptData = null;
            return;
        }

        const vocalOpts = (selections.vocalType) ? {
            type: selections.vocalType,
            age: selections.vocalAge,
            range: selections.vocalRange,
            styles: selections.vocalStyles
        } : undefined;
        const result = generatePrompt(selections.genres, selections.target, selections.place, selections.mood, vocalOpts);

        document.getElementById('promptExplanation').textContent = result.korExplanation;
        document.getElementById('stylePromptText').textContent = result.stylePrompt;
        document.getElementById('stylePromptKor').innerHTML = buildStyleKorDesc(result);

        // Simple Prompt 렌더링
        document.getElementById('simplePromptText').textContent = result.simplePrompt;
        document.getElementById('simplePromptKor').innerHTML =
            '\uD83D\uDCCC <strong>Simple \uBAA8\uB4DC\uC6A9:</strong> Suno AI Simple \uBAA8\uB4DC\uC5D0\uC11C \uBC14\uB85C \uC0AC\uC6A9\uD560 \uC218 \uC788\uB294 500\uC790 \uBBF8\uB9CC \uD504\uB86C\uD504\uD2B8\uC785\uB2C8\uB2E4. Full \uD504\uB86C\uD504\uD2B8\uC640 \uB3D9\uC77C\uD55C \uC74C\uC545\uC801 \uC758\uB3C4\uB97C \uC555\uCD95\uD55C \uBC84\uC804\uC785\uB2C8\uB2E4. (' + result.simplePrompt.length + '\uC790)';

        // Exclude Styles 기본값 저장
        generatedExcludeBase = result.excludeStyles;
        userExcludeTags = [];
        updateExcludeStylesText();

        // 토글 버튼 초기화
        document.querySelectorAll('.exclude-tag-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.getElementById('excludeStylesKor').innerHTML = buildExcludeKorDesc(result.excludeStyles);

        const { weirdness, styleInfluence } = result.moreOptions;
        document.getElementById('weirdnessFill').style.width = weirdness + '%';
        document.getElementById('weirdnessValue').textContent = weirdness + '%';
        document.getElementById('styleInfluenceFill').style.width = styleInfluence + '%';
        document.getElementById('styleInfluenceValue').textContent = styleInfluence + '%';
        document.getElementById('moreOptionsKor').innerHTML = buildMoreOptionsKorDesc(weirdness, styleInfluence);

        // Exclude 토글 버튼 이벤트 (한 번만 등록)
        initExcludeToggles();

        // 보컬 타입 뱃지 표시
        updateVocalTypeBadge(result.stylePrompt, result.mainGenre);

        // === 보관함에 자동 저장 ===
        autoSaveToLibrary(result);
    }

    // === 보컬 타입 뱃지 표시 ===
    function updateVocalTypeBadge(stylePrompt, mainGenreData) {
        const badge = document.getElementById('vocalTypeBadge');
        if (!badge) return;

        const prompt = (stylePrompt || '').toLowerCase();
        const vocalField = (mainGenreData && mainGenreData.vocal) ? mainGenreData.vocal.toLowerCase() : '';
        const combined = prompt + ' ' + vocalField;

        const hasMale = /\bmale\s*vocal/.test(combined) && !/female\s*vocal/.test(combined);
        const hasFemale = /female\s*vocal/.test(combined);
        const hasBoth = /\bmale\s*vocal/.test(combined) && /female\s*vocal/.test(combined);

        badge.className = 'vocal-type-badge';

        if (hasBoth) {
            badge.textContent = '\uD83C\uDFA4 \uB0A8\uB140 \uBCF4\uCEEC';
            badge.classList.add('unspecified');
        } else if (hasFemale) {
            badge.textContent = '\uD83C\uDFA4 \uC5EC\uC131 \uBCF4\uCEEC';
            badge.classList.add('female');
        } else if (hasMale) {
            badge.textContent = '\uD83C\uDFA4 \uB0A8\uC131 \uBCF4\uCEEC';
            badge.classList.add('male');
        } else {
            badge.textContent = '\uD83C\uDFA4 \uBCF4\uCEEC \uBBF8\uC9C0\uC815';
            badge.classList.add('unspecified');
        }
    }

    function autoSaveToLibrary(result) {
        const STORAGE_KEY = 'suno-master-library';
        let lib = [];
        try { lib = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch {}

        const newItem = {
            id: 'prompt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            createdAt: new Date().toISOString(),
            target: selections.target.map(v => labelMap[v] || v),
            place: selections.place.map(v => labelMap[v] || v),
            mood: selections.mood.map(v => labelMap[v] || v),
            genres: selections.genres,
            stylePrompt: result.stylePrompt,
            excludeStyles: result.excludeStyles,
            weirdness: result.moreOptions.weirdness,
            styleInfluence: result.moreOptions.styleInfluence,
            explanation: result.korExplanation,
            favorite: false,
            memo: ''
        };

        lib.push(newItem);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lib));
    }

    let excludeTogglesInitialized = false;
    function initExcludeToggles() {
        if (excludeTogglesInitialized) return;
        excludeTogglesInitialized = true;

        // 토글 버튼 클릭
        document.querySelectorAll('.exclude-tag-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                const value = btn.dataset.value;
                const kor = btn.dataset.kor;

                if (btn.classList.contains('active')) {
                    if (!userExcludeTags.includes(value)) {
                        userExcludeTags.push(value);
                    }
                } else {
                    userExcludeTags = userExcludeTags.filter(t => t !== value);
                }

                updateExcludeStylesText();
            });

            // 호버 시 한국어 설명 표시
            btn.title = btn.dataset.kor;
        });

        // 직접 입력
        const excludeInput = document.getElementById('excludeCustomInput');
        const btnAddExclude = document.getElementById('btnAddExclude');

        btnAddExclude.addEventListener('click', () => addExcludeCustom(excludeInput));
        excludeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') addExcludeCustom(excludeInput);
        });
    }

    function addExcludeCustom(input) {
        const value = input.value.trim().toLowerCase();
        if (!value) return;
        if (userExcludeTags.includes(value)) {
            input.value = '';
            return;
        }

        userExcludeTags.push(value);

        // 동적 버튼 추가
        const grid = document.querySelector('.exclude-btn-grid');
        const btn = document.createElement('button');
        btn.className = 'exclude-tag-btn active';
        btn.dataset.value = value;
        btn.dataset.kor = '사용자 추가 항목';
        btn.title = '사용자 추가 항목';
        btn.textContent = value;
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) {
                if (!userExcludeTags.includes(value)) userExcludeTags.push(value);
            } else {
                userExcludeTags = userExcludeTags.filter(t => t !== value);
            }
            updateExcludeStylesText();
        });
        grid.appendChild(btn);

        input.value = '';
        updateExcludeStylesText();
    }

    function updateExcludeStylesText() {
        const baseParts = generatedExcludeBase ? generatedExcludeBase.split(', ').filter(Boolean) : [];
        const allParts = [...new Set([...baseParts, ...userExcludeTags])];
        const fullText = allParts.join(', ');
        document.getElementById('excludeStylesText').textContent = fullText;
        document.getElementById('excludeStylesKor').innerHTML = buildExcludeKorDesc(fullText);
    }

    // 악기 영→한 매핑
    const instrumentEngToKor = {
        'piano': '피아노', 'acoustic guitar': '어쿠스틱 기타', 'electric guitar': '일렉트릭 기타',
        'bass guitar': '베이스 기타', 'bass': '베이스', 'drums': '드럼', 'drum': '드럼',
        'synthesizer': '신디사이저', 'synth': '신디사이저', 'strings': '현악기', 'brass': '관악기',
        'saxophone': '색소폰', 'sax': '색소폰', 'flute': '플루트', 'violin': '바이올린',
        'cello': '첼로', 'organ': '오르간', 'harmonica': '하모니카', 'ukulele': '우쿨렐레',
        'percussion': '타악기', 'choir': '합창', 'orchestra': '오케스트라',
        'guitar': '기타', 'horn': '호른', 'trumpet': '트럼펫', 'harp': '하프',
        'claps': '클랩', 'tambourine': '탬버린', 'shaker': '셰이커'
    };

    // 보컬 영→한 매핑
    const vocalEngToKor = {
        'male vocals': '남성 보컬', 'female vocals': '여성 보컬', 'male vocal': '남성 보컬', 'female vocal': '여성 보컬',
        'airy vocals': '공기감 있는 보컬', 'smooth vocals': '부드러운 보컬', 'powerful vocals': '파워풀한 보컬',
        'emotional vocals': '감성적인 보컬', 'soulful vocals': '소울풀한 보컬', 'warm vocals': '따뜻한 보컬',
        'breathy': '숨소리 섞인', 'belting': '시원한 고음', 'falsetto': '가성',
        'vibrato': '비브라토', 'whisper': '속삭임', 'rap': '랩', 'raspy': '허스키',
        'intimate': '친밀한', 'soaring': '치솟는', 'catchy': '중독성 있는', 'hook': '훅',
        'harmonies': '화음', 'chorus': '코러스', 'verse': '벌스'
    };

    function buildStyleKorDesc(result) {
        const mainGenre = result.mainGenre;
        const subGenre = result.subGenre;
        let html = '\uD83D\uDCCC <strong>\uD55C\uAD6D\uC5B4 \uBC88\uC5ED:</strong><br>';

        // 장르
        if (mainGenre && subGenre) {
            html += `• 장르: "${mainGenre.genre}"(메인) + "${subGenre.genre}"(블렌딩) 혼합<br>`;
        } else if (mainGenre) {
            html += `• 장르: "${mainGenre.genre}"<br>`;
        }

        // 장르 설명
        let descParts = [];
        if (mainGenre && mainGenre.desc) descParts.push(mainGenre.desc);
        if (subGenre && subGenre.desc) descParts.push(subGenre.desc);
        if (descParts.length) html += `• 설명: ${descParts.join(' ')}<br>`;

        // BPM
        const bpmMatch = result.stylePrompt.match(/(\d+)\s*BPM/);
        const bpm = bpmMatch ? parseInt(bpmMatch[1]) : 110;
        const bpmDesc = bpm < 80 ? '\uB290\uB9B0 \uC18D\uB3C4' : bpm < 110 ? '\uBCF4\uD1B5 \uC18D\uB3C4' : bpm < 130 ? '\uC57D\uAC04 \uBE60\uB978 \uC18D\uB3C4' : '\uBE60\uB978 \uC18D\uB3C4';
        html += `\u2022 \uD15C\uD3EC: ${bpm} BPM (${bpmDesc})<br>`;

        // 분위기
        const moodKor = selections.mood.map(v => labelMap[v]).filter(Boolean);
        if (moodKor.length) html += `\u2022 \uBD84\uC704\uAE30: ${moodKor.join(', ')}<br>`;

        // 악기 번역
        if (mainGenre && mainGenre.instruments) {
            const instrParts = mainGenre.instruments.split(', ');
            const korInstr = instrParts.map(eng => {
                const key = Object.keys(instrumentEngToKor).find(k => eng.toLowerCase().includes(k));
                return key ? instrumentEngToKor[key] : eng;
            });
            html += `\u2022 \uC545\uAE30: ${korInstr.slice(0, 5).join(', ')}<br>`;
        }

        // 보컬 번역
        if (mainGenre && mainGenre.vocal) {
            const vocalParts = mainGenre.vocal.split(', ');
            const korVocal = vocalParts.map(eng => {
                const key = Object.keys(vocalEngToKor).find(k => eng.toLowerCase().includes(k));
                return key ? vocalEngToKor[key] : eng;
            });
            html += `\u2022 \uBCF4\uCEEC: ${korVocal.slice(0, 4).join(', ')}<br>`;
        }

        html += '\u2022 \uD488\uC9C8: \uD504\uB85C\uD398\uC154\uB110 \uC2A4\uD29C\uB514\uC624 \uD488\uC9C8, \uAE68\uB057\uD558\uACE0 \uBC38\uB7F0\uC2A4 \uC788\uB294 \uC0AC\uC6B4\uB4DC, \uB77C\uB514\uC624 \uBC29\uC1A1 \uC218\uC900';
        return html;
    }

    // Exclude Styles 한국어 번역
    const excludeEngToKor = {
        'metal': '메탈', 'hardcore': '하드코어', 'screamo': '스크리모', 'thrash': '스래쉬', 'deathcore': '데스코어',
        'industrial': '인더스트리얼', 'aggressive': '공격적인', 'distorted': '왜곡된', 'screaming': '비명',
        'harsh noise': '거친 노이즈', 'heavy metal': '헤비메탈',
        'ambient': '앰비언트', 'meditation': '명상', 'lullaby': '자장가', 'drone': '드론',
        'spa': '스파', 'sleepy': '졸린', 'minimal ambient': '미니멀 앰비언트',
        'intro': '인트로', 'reverb': '리버브', 'fade in': '페이드인', 'distortion': '디스토션',
        'noise': '노이즈', 'falsetto': '팔세토', 'echo': '에코', 'choir': '합창',
        'sound effects': '사운드 이펙트', 'four-on-the-floor kick': '4비트 킥'
    };

    function buildExcludeKorDesc(excludeText) {
        if (!excludeText) return '';
        const parts = excludeText.split(', ').filter(Boolean);
        const korParts = parts.map(eng => {
            const key = Object.keys(excludeEngToKor).find(k => eng.toLowerCase().includes(k));
            return key ? `${excludeEngToKor[key]}(${eng})` : eng;
        });
        return `\uD83D\uDCCC <strong>\uD55C\uAD6D\uC5B4 \uBC88\uC5ED:</strong> ${korParts.join(', ')} \u2014 \uC774 \uC2A4\uD0C0\uC77C\uB4E4\uC744 \uC81C\uC678\uD558\uBA74 AI\uAC00 \uB354 \uC815\uD655\uD55C \uC74C\uC545\uC744 \uB9CC\uB4E4\uC5B4\uC90D\uB2C8\uB2E4.`;
    }

    function buildMoreOptionsKorDesc(weirdness, styleInfluence) {
        let desc = '\uD83D\uDCCC <strong>\uD55C\uAD6D\uC5B4 \uC124\uBA85:</strong> ';

        if (weirdness <= 35) {
            desc += 'Weirdness\uB97C \uB0AE\uAC8C \uC124\uC815\uD558\uC5EC \uC548\uC815\uC801\uC774\uACE0 \uC775\uC219\uD55C \uC0AC\uC6B4\uB4DC\uB97C \uB9CC\uB4ED\uB2C8\uB2E4. ';
        } else if (weirdness <= 55) {
            desc += 'Weirdness\uB97C \uBCF4\uD1B5\uC73C\uB85C \uC124\uC815\uD558\uC5EC \uC801\uB2F9\uD55C \uCC3D\uC758\uC131\uC744 \uBD80\uC5EC\uD569\uB2C8\uB2E4. ';
        } else {
            desc += 'Weirdness\uB97C \uB192\uAC8C \uC124\uC815\uD558\uC5EC \uB3C5\uD2B9\uD558\uACE0 \uC2E4\uD5D8\uC801\uC778 \uC0AC\uC6B4\uB4DC\uB97C \uB9CC\uB4ED\uB2C8\uB2E4. ';
        }

        if (styleInfluence >= 60) {
            desc += 'Style Influence\uB97C \uB192\uAC8C \uC124\uC815\uD558\uC5EC \uC7A5\uB974 \uD2B9\uC131\uC744 \uAC15\uD558\uAC8C \uBC18\uC601\uD569\uB2C8\uB2E4.';
        } else if (styleInfluence >= 40) {
            desc += 'Style Influence\uB97C \uBCF4\uD1B5\uC73C\uB85C \uC124\uC815\uD558\uC5EC \uC7A5\uB974\uAC04 \uC790\uC5F0\uC2A4\uB7EC\uC6B4 \uC735\uD569\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.';
        } else {
            desc += 'Style Influence\uB97C \uB0AE\uAC8C \uC124\uC815\uD558\uC5EC AI\uC758 \uCC3D\uC758\uC801 \uD574\uC11D \uC5EC\uC9C0\uB97C \uB291\uB9BD\uB2C8\uB2E4.';
        }

        return desc;
    }

    // === 복사 기능 ===
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const text = document.getElementById(targetId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '✓ \uBCF5\uC0AC\uB428!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '\uBCF5\uC0AC\uD558\uAE30';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    document.getElementById('btnCopyAll').addEventListener('click', () => {
        const style = document.getElementById('stylePromptText').textContent;
        const exclude = document.getElementById('excludeStylesText').textContent;
        const weirdness = document.getElementById('weirdnessValue').textContent;
        const influence = document.getElementById('styleInfluenceValue').textContent;

        const fullText = `[Style Prompt]\n${style}\n\n[Exclude Styles]\n${exclude}\n\n[More Options]\nWeirdness: ${weirdness}\nStyle Influence: ${influence}`;

        navigator.clipboard.writeText(fullText).then(() => {
            const btn = document.getElementById('btnCopyAll');
            btn.innerHTML = '<span>✓</span> \uBCF5\uC0AC\uC644\uB8CC!';
            setTimeout(() => {
                btn.innerHTML = '<span>\uD83D\uDCCB</span> \uC804\uCCB4 \uBCF5\uC0AC';
            }, 2000);
        });
    });

    // === 이전 단계 (5단계에서) ===
    document.getElementById('btnPrevStep').addEventListener('click', () => {
        goToStep(4);
    });

    // === 전체 저장하기 (txt 파일 다운로드) ===
    document.getElementById('btnSaveAll').addEventListener('click', () => {
        const style = document.getElementById('stylePromptText').textContent;
        const exclude = document.getElementById('excludeStylesText').textContent;
        const weirdness = document.getElementById('weirdnessValue').textContent;
        const influence = document.getElementById('styleInfluenceValue').textContent;
        const explanation = document.getElementById('promptExplanation').textContent;

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;

        const content = `========================================
SUNO MASTER PRO 12 - 프롬프트 저장
생성일시: ${now.toLocaleString('ko-KR')}
========================================

[한국어 설명]
${explanation}

========================================
[Style Prompt]
${style}

========================================
[Exclude Styles]
${exclude}

========================================
[More Options]
Weirdness: ${weirdness}
Style Influence: ${influence}

========================================
선택 정보:
- 타겟층: ${selections.target.map(v => labelMap[v]).join(', ')}
- 장소: ${selections.place.map(v => labelMap[v]).join(', ')}
- 분위기: ${selections.mood.map(v => labelMap[v]).join(', ')}
- 장르: ${selections.genres.join(' + ')}
========================================
Generated by SUNO MASTER PRO 12
`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SUNO_Prompt_${dateStr}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 버튼 피드백
        const btn = document.getElementById('btnSaveAll');
        btn.innerHTML = '<span>✓</span> \uC800\uC7A5\uC644\uB8CC!';
        setTimeout(() => {
            btn.innerHTML = '<span>\uD83D\uDCBE</span> \uC804\uCCB4 \uC800\uC7A5\uD558\uAE30';
        }, 2000);
    });

    // === 적용하기 (파이프라인 확정 → localStorage 저장) ===
    const btnApply = document.getElementById('btnApply');
    const btnGotoLyrics = document.getElementById('btnGotoLyrics');

    btnApply.addEventListener('click', () => {
        const style = document.getElementById('stylePromptText').textContent || '';
        if (!style.trim()) {
            alert('먼저 프롬프트를 생성해주세요.');
            return;
        }
        const excludeStyles = document.getElementById('excludeStylesText').textContent || '';
        const weirdnessText = document.getElementById('weirdnessValue').textContent || '';
        const styleInfluenceText = document.getElementById('styleInfluenceValue').textContent || '';
        const explanation = document.getElementById('promptExplanation').textContent || '';

        // 파일명: 불러온 파일 > 장르명 > 기본값
        const importedName = importedPromptData && importedPromptData.fileName
            ? importedPromptData.fileName
            : null;
        const genreName = selections.genres.length > 0
            ? selections.genres.join(' + ') + ' - 쉽게 만들기'
            : null;
        const fileName = importedName || genreName || '쉽게 만들기 결과';

        const pipelineData = {
            stylePrompt: style,
            excludeStyles: excludeStyles,
            weirdness: parseInt(weirdnessText) || null,
            styleInfluence: parseInt(styleInfluenceText) || null,
            explanation: explanation,
            genres: selections.genres.slice(),
            target: selections.target.slice(),
            place: selections.place.slice(),
            mood: selections.mood.slice(),
            vocalType: selections.vocalType,
            vocalAge: selections.vocalAge,
            vocalRange: selections.vocalRange,
            vocalStyles: selections.vocalStyles.slice(),
            createdAt: new Date().toISOString(),
            source: 'easy',
            fileName: fileName
        };

        localStorage.setItem('suno-pipeline-easy', JSON.stringify(pipelineData));

        // 완료 메시지 표시 (버튼 아래 고정)
        const msgEl = document.getElementById('applyCompleteMsg');
        if (msgEl) {
            msgEl.textContent = '✅ 스타일 프롬프트 적용 완료! 다음 단계에 반영됩니다.';
            msgEl.classList.add('visible');
        }

        // 노래제목&가사생성 버튼 활성화
        btnGotoLyrics.disabled = false;
        btnGotoLyrics.classList.add('active');
    });

    // === 노래제목&가사생성 이동 ===
    btnGotoLyrics.addEventListener('click', () => {
        window.location.href = 'lyrics.html';
    });

    document.getElementById('btnHome').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // === 글자 크기 조절 ===
    const textSizePopup = document.getElementById('textSizePopup');
    const btnTextSize = document.getElementById('btnTextSize');
    const closeTextSize = document.getElementById('closeTextSize');
    const sizeBtns = document.querySelectorAll('.size-btn');

    const savedSize = localStorage.getItem('suno-text-size') || 'medium';
    applyTextSize(savedSize);

    btnTextSize.addEventListener('click', () => textSizePopup.classList.add('active'));
    closeTextSize.addEventListener('click', () => textSizePopup.classList.remove('active'));
    textSizePopup.addEventListener('click', (e) => {
        if (e.target === textSizePopup) textSizePopup.classList.remove('active');
    });

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.dataset.size;
            applyTextSize(size);
            localStorage.setItem('suno-text-size', size);
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    function applyTextSize(size) {
        document.body.classList.remove('text-small', 'text-large', 'text-xlarge');
        if (size !== 'medium') document.body.classList.add('text-' + size);
        sizeBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.size === size));
    }

    // === 다크모드 ===
    const btnDarkMode = document.getElementById('btnDarkMode');
    const savedDark = localStorage.getItem('suno-dark-mode') === 'true';

    if (savedDark) {
        document.body.classList.add('dark-mode');
        btnDarkMode.querySelector('.dark-mode-icon').textContent = '\u2600';
    }

    btnDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        btnDarkMode.querySelector('.dark-mode-icon').textContent = isDark ? '\u2600' : '\u263E';
        localStorage.setItem('suno-dark-mode', isDark);
    });

    // === 프롬프트 불러오기 ===
    const fileImport = document.getElementById('fileImport');
    const importBox = document.getElementById('importBox');

    // 파일 선택 시: 파일명 표시 + "자료 불러오기" 버튼 노출
    let pendingImportFile = null;
    const importFilenameEl = document.getElementById('importFilename');
    const btnLoadFile = document.getElementById('btnLoadFile');

    fileImport.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        pendingImportFile = file;
        importFilenameEl.textContent = `선택된 파일: ${file.name}`;
        importFilenameEl.style.display = 'block';
        btnLoadFile.style.display = 'inline-flex';
    });

    // "자료 불러오기" 버튼 클릭 시: 실제 로드
    btnLoadFile.addEventListener('click', () => {
        if (!pendingImportFile) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const parsed = parsePromptFile(content);

            if (parsed) {
                applyImportedData(parsed);
                importBox.classList.add('success');
                importBox.querySelector('.import-title').textContent = '불러오기 완료!';
                importBox.querySelector('.import-desc').textContent =
                    `"${pendingImportFile.name}" 파일에서 프롬프트를 불러왔습니다. 5단계로 이동합니다.`;
                setTimeout(() => goToStep(5), 1500);
            } else {
                importBox.querySelector('.import-title').textContent = '파일을 읽을 수 없습니다';
                importBox.querySelector('.import-desc').textContent =
                    'SUNO MASTER PRO 12에서 저장한 txt 파일만 불러올 수 있습니다.';
            }
            pendingImportFile = null;
            fileImport.value = '';
            importFilenameEl.style.display = 'none';
            btnLoadFile.style.display = 'none';
        };
        reader.readAsText(pendingImportFile, 'UTF-8');
    });

    function parsePromptFile(content) {
        try {
            const result = {
                stylePrompt: '',
                excludeStyles: '',
                weirdness: 50,
                styleInfluence: 50,
                explanation: '',
                target: [],
                place: [],
                mood: [],
                genres: []
            };

            // [Style Prompt] 파싱
            const styleMatch = content.match(/\[Style Prompt\]\s*\n([\s\S]*?)(?=\n={3,})/);
            if (styleMatch) result.stylePrompt = styleMatch[1].trim();

            // [Exclude Styles] 파싱
            const excludeMatch = content.match(/\[Exclude Styles\]\s*\n([\s\S]*?)(?=\n={3,})/);
            if (excludeMatch) result.excludeStyles = excludeMatch[1].trim();

            // [More Options] 파싱
            const weirdMatch = content.match(/Weirdness:\s*(\d+)%/);
            if (weirdMatch) result.weirdness = parseInt(weirdMatch[1]);

            const influenceMatch = content.match(/Style Influence:\s*(\d+)%/);
            if (influenceMatch) result.styleInfluence = parseInt(influenceMatch[1]);

            // [한국어 설명] 파싱
            const explMatch = content.match(/\[\uD55C\uAD6D\uC5B4 \uC124\uBA85\]\s*\n([\s\S]*?)(?=\n={3,})/);
            if (explMatch) result.explanation = explMatch[1].trim();

            // 선택 정보 파싱
            const targetMatch = content.match(/- \uD0C0\uAC9F\uCE35:\s*(.+)/);
            if (targetMatch) {
                result.target = parseSelectionLine(targetMatch[1], 'target');
            }

            const placeMatch = content.match(/- \uC7A5\uC18C:\s*(.+)/);
            if (placeMatch) {
                result.place = parseSelectionLine(placeMatch[1], 'place');
            }

            const moodMatch = content.match(/- \uBD84\uC704\uAE30:\s*(.+)/);
            if (moodMatch) {
                result.mood = parseSelectionLine(moodMatch[1], 'mood');
            }

            const genreMatch = content.match(/- \uC7A5\uB974:\s*(.+)/);
            if (genreMatch) {
                result.genres = genreMatch[1].trim().split(/\s*\+\s*/);
            }

            // 최소한 Style Prompt가 있어야 유효
            if (!result.stylePrompt) return null;

            return result;
        } catch (e) {
            return null;
        }
    }

    // 한글 라벨 → data-value 역변환
    function parseSelectionLine(line, type) {
        const items = line.split(',').map(s => s.trim());
        const reverseMap = {};

        // labelMap 역변환 만들기
        for (const [key, val] of Object.entries(labelMap)) {
            if (!reverseMap[val]) reverseMap[val] = key;
        }

        return items.map(item => reverseMap[item] || item).filter(Boolean);
    }

    function applyImportedData(data) {
        // 선택 정보 복원
        selections.target = data.target;
        selections.place = data.place;
        selections.mood = data.mood;
        selections.genres = data.genres;

        // 5단계에서 사용할 imported 데이터 저장
        importedPromptData = data;
    }

    // imported 데이터 저장 변수
    let importedPromptData = null;

    // === 보관함에서 "다시 사용하기"로 온 경우 ===
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reuse') === 'true') {
        try {
            const reuseData = JSON.parse(localStorage.getItem('suno-reuse-prompt'));
            if (reuseData) {
                importedPromptData = {
                    stylePrompt: reuseData.stylePrompt || '',
                    excludeStyles: reuseData.excludeStyles || '',
                    weirdness: reuseData.weirdness || 50,
                    styleInfluence: reuseData.styleInfluence || 50,
                    explanation: reuseData.explanation || '',
                    target: reuseData.target || [],
                    place: reuseData.place || [],
                    mood: reuseData.mood || [],
                    genres: reuseData.genres || []
                };
                selections.target = reuseData.target || [];
                selections.place = reuseData.place || [];
                selections.mood = reuseData.mood || [];
                selections.genres = reuseData.genres || [];

                localStorage.removeItem('suno-reuse-prompt');

                // 바로 5단계로 이동
                setTimeout(() => goToStep(5), 500);
            }
        } catch {}
    }

    // === ESC로 팝업 닫기 ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') textSizePopup.classList.remove('active');
    });

    // textarea 자동 높이 + 섹션 토글
    function autoResizeAll() {
        document.querySelectorAll('textarea').forEach(ta => {
            ta.classList.add('auto-resize');
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 'px';
            ta.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; });
        });
    }
    autoResizeAll();
    new MutationObserver(() => autoResizeAll()).observe(document.body, { childList: true, subtree: true });

    // 섹션 숨기기/표시하기
    document.querySelectorAll('.setting-title').forEach(title => {
        const group = title.closest('.setting-group');
        if (!group) return;
        const content = group.querySelector('.btn-grid, .option-grid, .bpm-row, .songform-presets, .songform-editor, .songform-add, .lyrics-format-tabs, .genre-recommend-list, .genre-custom-area, .search-results-area, .regenerate-area, .genre-select-info, .free-input-area, .v5-guide, .analyze-area, .import-area, .or-divider, .loaded-prompt-preview, .lyrics-load-options, .story-recommend-list, .selected-story-display, .storyEditArea, .generation-guide, .custom-count-row, .titles-list, .title-actions-row, .title-confirmed, .title-rules-card, .lyrics-rules-card, .lyrics-single-editor, .songform-add, .more-options-box, .exclude-toggles, .prompt-box, .prompt-desc-kor');
        // 모든 자식 요소를 감싸는 wrapper
        const children = Array.from(group.children).filter(c => c !== title);
        if (children.length === 0) return;

        title.addEventListener('click', (e) => {
            if (e.target.closest('.auto-badge, .pro-badge, .toggle-btn, button')) return;
            const isCollapsed = title.dataset.collapsed === 'true';
            title.dataset.collapsed = isCollapsed ? 'false' : 'true';
            children.forEach(c => {
                if (isCollapsed) { c.style.display = ''; c.style.maxHeight = ''; c.style.opacity = ''; }
                else { c.style.display = 'none'; }
            });
        });
    });

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

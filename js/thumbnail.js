// ============================================
// SUNO MASTER PRO 12 - 썸네일 이미지 만들기
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // === 선택 상태 ===
    const selections = {
        keyword: '',
        gender: 'female',
        emotion: 'shock',
        background: 'cafe',
        style: 'cinematic'
    };

    // === 옵션 라벨 매핑 (프롬프트 생성용) ===
    const labelMap = {
        gender: {
            male: 'Solo Male character',
            female: 'Solo Female character',
            couple: 'Couple (man and woman)',
            none: 'No character (object/scene only)'
        },
        emotion: {
            shock: 'shocked expression with wide eyes',
            smile: 'bright cheerful smile',
            serious: 'intense serious look',
            angry: 'frustrated angry expression'
        },
        background: {
            cafe: 'luxury cafe interior',
            mountain: 'majestic mountain nature',
            airplane: 'airplane interior cabin',
            car: 'driving inside a car',
            night: 'city night view',
            studio: 'professional studio backdrop'
        },
        style: {
            cinematic: 'cinematic realism, photorealistic, 8K detail',
            anime: 'high-quality anime illustration',
            render3d: '3D render, Unreal Engine 5 style',
            cyberpunk: 'cyberpunk neon aesthetic',
            vintage: 'vintage film photography',
            watercolor: 'soft watercolor painting'
        }
    };

    // === 옵션 버튼 선택 처리 ===
    document.querySelectorAll('[data-option-group]').forEach(group => {
        const groupName = group.dataset.optionGroup;
        group.querySelectorAll('.thumb-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                group.querySelectorAll('.thumb-option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selections[groupName] = btn.dataset.value;
            });
        });
    });

    // === 입력/셀렉트 변경 감지 ===
    const keywordInput = document.getElementById('thumbKeyword');
    keywordInput.addEventListener('input', () => {
        selections.keyword = keywordInput.value.trim();
    });

    document.querySelectorAll('[data-select-group]').forEach(sel => {
        const name = sel.dataset.selectGroup;
        sel.addEventListener('change', () => {
            selections[name] = sel.value;
        });
    });

    // === 프롬프트 생성 ===
    function buildPrompt() {
        const parts = [];
        const keyword = selections.keyword || '(키워드 미입력)';

        parts.push(`YouTube thumbnail, ${keyword}`);
        parts.push(labelMap.gender[selections.gender]);
        if (selections.gender !== 'none') {
            parts.push(labelMap.emotion[selections.emotion]);
        }
        parts.push(labelMap.background[selections.background]);
        parts.push(labelMap.style[selections.style]);
        parts.push('vivid colors, high contrast, attention-grabbing composition');
        parts.push('clear focal point, no text overlay, 16:9 aspect ratio');

        return parts.join(', ');
    }

    // === 생성 버튼 ===
    const preview = document.getElementById('thumbPreview');
    const btnGenerate = document.getElementById('btnGenerate');
    const btnRetry = document.getElementById('btnRetry');
    const btnUpscale = document.getElementById('btnUpscale');
    const btnSave = document.getElementById('btnSave');

    let lastPrompt = '';

    function setActionsEnabled(enabled) {
        [btnRetry, btnUpscale, btnSave].forEach(b => { b.disabled = !enabled; });
    }
    setActionsEnabled(false);

    function showLoading() {
        preview.innerHTML = `
            <div class="thumb-spinner-wrap">
                <div class="thumb-spinner"></div>
                <p class="thumb-spinner-text">프롬프트를 생성하는 중입니다...</p>
            </div>
        `;
    }

    function showResult(prompt) {
        preview.innerHTML = `
            <div class="thumb-result-prompt">
                <p class="thumb-result-title">&#10003; 프롬프트가 만들어졌습니다!</p>
                <div class="thumb-result-box">${escapeHtml(prompt)}</div>
                <p class="thumb-result-note">※ API 설정에서 키를 등록하면 실제 이미지를 자동 생성합니다.</p>
            </div>
        `;
    }

    function showEmpty() {
        preview.innerHTML = `
            <div class="thumb-preview-empty">
                <div class="thumb-preview-icon">&#127912;</div>
                <p class="thumb-preview-text">생성 버튼을 누르면<br>썸네일용 이미지 프롬프트가 만들어집니다.</p>
            </div>
        `;
    }

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    btnGenerate.addEventListener('click', () => {
        if (!selections.keyword) {
            keywordInput.focus();
            keywordInput.style.borderColor = 'var(--accent)';
            setTimeout(() => { keywordInput.style.borderColor = ''; }, 1500);
            return;
        }
        showLoading();
        setActionsEnabled(false);
        setTimeout(() => {
            lastPrompt = buildPrompt();
            showResult(lastPrompt);
            setActionsEnabled(true);
        }, 1200);
    });

    btnRetry.addEventListener('click', () => {
        if (!selections.keyword) return;
        showLoading();
        setTimeout(() => {
            lastPrompt = buildPrompt();
            showResult(lastPrompt);
        }, 800);
    });

    btnUpscale.addEventListener('click', () => {
        if (!lastPrompt) return;
        const upscaled = lastPrompt + ', ultra-detailed, 8K resolution, sharp focus';
        lastPrompt = upscaled;
        showResult(upscaled);
    });

    btnSave.addEventListener('click', () => {
        if (!lastPrompt) return;
        const blob = new Blob([lastPrompt], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `SUNO_Thumbnail_${ts}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    showEmpty();

    // === API 설정 모달 ===
    const apiModal = document.getElementById('apiModal');
    const btnOpenApi = document.getElementById('btnOpenApi');
    const btnCancelApi = document.getElementById('btnCancelApi');
    const btnSaveApi = document.getElementById('btnSaveApi');
    const inputMj = document.getElementById('apiMidjourney');
    const inputNb = document.getElementById('apiNanobanana');
    const apiStatus = document.getElementById('apiStatus');

    const API_KEY_STORE = 'suno-thumbnail-api';

    function loadApiKeys() {
        try {
            const saved = JSON.parse(localStorage.getItem(API_KEY_STORE) || '{}');
            if (saved.midjourney) inputMj.value = saved.midjourney;
            if (saved.nanobanana) inputNb.value = saved.nanobanana;
        } catch {}
    }

    btnOpenApi.addEventListener('click', () => {
        loadApiKeys();
        apiStatus.textContent = '';
        apiModal.classList.add('active');
    });

    function closeApi() {
        apiModal.classList.remove('active');
    }

    btnCancelApi.addEventListener('click', closeApi);
    apiModal.addEventListener('click', (e) => {
        if (e.target === apiModal) closeApi();
    });

    btnSaveApi.addEventListener('click', () => {
        const payload = {
            midjourney: inputMj.value.trim(),
            nanobanana: inputNb.value.trim()
        };
        localStorage.setItem(API_KEY_STORE, JSON.stringify(payload));
        apiStatus.textContent = '저장되었습니다.';
        setTimeout(closeApi, 700);
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
        btnDarkMode.querySelector('.dark-mode-icon').textContent = '☀';
    }

    btnDarkMode.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        btnDarkMode.querySelector('.dark-mode-icon').textContent = isDark ? '☀' : '☾';
        localStorage.setItem('suno-dark-mode', isDark);
    });

    // === ESC로 팝업 닫기 ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            textSizePopup.classList.remove('active');
            apiModal.classList.remove('active');
        }
    });
});

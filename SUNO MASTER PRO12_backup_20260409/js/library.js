// ============================================
// SUNO MASTER PRO 12 - 내 음악 보관함 JavaScript
// localStorage 기반 프롬프트 관리
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'suno-master-library';
    let currentFilter = 'all';
    let currentDetailId = null;

    // === 데이터 관리 ===
    function getLibrary() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveLibrary(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function deleteItem(id) {
        const lib = getLibrary().filter(item => item.id !== id);
        saveLibrary(lib);
        render();
    }

    function toggleFavorite(id) {
        const lib = getLibrary();
        const item = lib.find(i => i.id === id);
        if (item) {
            item.favorite = !item.favorite;
            saveLibrary(lib);
            render();
        }
    }

    function updateMemo(id, memo) {
        const lib = getLibrary();
        const item = lib.find(i => i.id === id);
        if (item) {
            item.memo = memo;
            saveLibrary(lib);
        }
    }

    // === 통계 업데이트 ===
    function updateStats() {
        const lib = getLibrary();
        document.getElementById('statTotal').textContent = lib.length;
        document.getElementById('statFavorite').textContent = lib.filter(i => i.favorite).length;

        const genres = new Set();
        lib.forEach(item => {
            (item.genres || []).forEach(g => genres.add(g));
        });
        document.getElementById('statGenres').textContent = genres.size;

        const now = new Date();
        const thisMonth = lib.filter(item => {
            const d = new Date(item.createdAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        document.getElementById('statThisMonth').textContent = thisMonth;
    }

    // === 렌더링 ===
    function render() {
        let lib = getLibrary();
        const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();

        // 검색 필터
        if (searchQuery) {
            lib = lib.filter(item =>
                (item.stylePrompt || '').toLowerCase().includes(searchQuery) ||
                (item.excludeStyles || '').toLowerCase().includes(searchQuery) ||
                (item.memo || '').toLowerCase().includes(searchQuery) ||
                (item.genres || []).join(' ').toLowerCase().includes(searchQuery) ||
                (item.target || []).join(' ').toLowerCase().includes(searchQuery) ||
                (item.mood || []).join(' ').toLowerCase().includes(searchQuery) ||
                (item.place || []).join(' ').toLowerCase().includes(searchQuery)
            );
        }

        // 필터
        if (currentFilter === 'favorite') {
            lib = lib.filter(i => i.favorite);
        } else if (currentFilter === 'recent') {
            lib.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (currentFilter === 'oldest') {
            lib.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else {
            lib.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        const listEl = document.getElementById('libList');
        const emptyEl = document.getElementById('libEmpty');

        if (lib.length === 0 && !searchQuery) {
            listEl.style.display = 'none';
            emptyEl.style.display = 'block';
        } else {
            listEl.style.display = 'flex';
            emptyEl.style.display = 'none';
        }

        listEl.innerHTML = '';

        if (lib.length === 0 && searchQuery) {
            listEl.innerHTML = '<p style="text-align:center; color: var(--text-secondary); padding: 40px;">검색 결과가 없습니다.</p>';
        }

        lib.forEach(item => {
            const date = new Date(item.createdAt);
            const dateStr = `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

            const genreTags = (item.genres || []).map(g =>
                `<span class="lib-meta-tag">\uD83C\uDFB5 ${g}</span>`
            ).join('');

            const moodTags = (item.mood || []).slice(0, 2).map(m =>
                `<span class="lib-meta-tag">${m}</span>`
            ).join('');

            const el = document.createElement('div');
            el.className = 'lib-item' + (item.favorite ? ' favorite' : '');
            el.innerHTML = `
                <button class="lib-fav-btn" data-id="${item.id}" title="즐겨찾기">
                    ${item.favorite ? '\u2B50' : '\u2606'}
                </button>
                <div class="lib-content" data-id="${item.id}">
                    <div class="lib-item-title">${(item.genres || []).join(' + ') || '프롬프트'} ${item.memo ? '- ' + item.memo : ''}</div>
                    <div class="lib-item-meta">${genreTags}${moodTags}</div>
                    <div class="lib-item-preview">${(item.stylePrompt || '').substring(0, 100)}...</div>
                    <div class="lib-item-date">${dateStr}</div>
                </div>
                <div class="lib-item-actions">
                    <button class="lib-mini-btn" data-copy="${item.id}" title="복사">\uD83D\uDCCB</button>
                    <button class="lib-mini-btn" data-detail="${item.id}" title="상세보기">\uD83D\uDD0D</button>
                </div>
            `;

            // 즐겨찾기 토글
            el.querySelector('.lib-fav-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(item.id);
            });

            // 상세보기
            el.querySelector('.lib-content').addEventListener('click', () => openDetail(item.id));
            el.querySelector('[data-detail]').addEventListener('click', (e) => {
                e.stopPropagation();
                openDetail(item.id);
            });

            // 빠른 복사
            el.querySelector('[data-copy]').addEventListener('click', (e) => {
                e.stopPropagation();
                const text = `[Style Prompt]\n${item.stylePrompt}\n\n[Exclude Styles]\n${item.excludeStyles}`;
                navigator.clipboard.writeText(text).then(() => {
                    const btn = e.target;
                    btn.textContent = '\u2713';
                    setTimeout(() => btn.textContent = '\uD83D\uDCCB', 1500);
                });
            });

            listEl.appendChild(el);
        });

        updateStats();
    }

    // === 상세 보기 ===
    function openDetail(id) {
        const lib = getLibrary();
        const item = lib.find(i => i.id === id);
        if (!item) return;

        currentDetailId = id;

        document.getElementById('detailTitle').textContent =
            (item.genres || []).join(' + ') || '\uD504\uB86C\uD504\uD2B8 \uC0C1\uC138';

        const body = document.getElementById('detailBody');
        body.innerHTML = `
            <div class="detail-section">
                <div class="detail-label">\uD83D\uDCCC \uC120\uD0DD \uC815\uBCF4</div>
                <div class="detail-value" style="font-family: 'Noto Sans KR', sans-serif;">
                    \uD0C0\uAC9F\uCE35: ${(item.target || []).join(', ') || '-'}<br>
                    \uC7A5\uC18C: ${(item.place || []).join(', ') || '-'}<br>
                    \uBD84\uC704\uAE30: ${(item.mood || []).join(', ') || '-'}<br>
                    \uC7A5\uB974: ${(item.genres || []).join(' + ') || '-'}
                </div>
            </div>
            <div class="detail-section">
                <div class="detail-label">\uD83C\uDFB5 Style Prompt</div>
                <div class="detail-value">${item.stylePrompt || '-'}</div>
            </div>
            <div class="detail-section">
                <div class="detail-label">\uD83D\uDEAB Exclude Styles</div>
                <div class="detail-value">${item.excludeStyles || '-'}</div>
            </div>
            <div class="detail-section">
                <div class="detail-label">\u2699 More Options</div>
                <div class="detail-value" style="font-family: 'Noto Sans KR', sans-serif;">
                    Weirdness: ${item.weirdness || 50}% &nbsp;&nbsp;|&nbsp;&nbsp; Style Influence: ${item.styleInfluence || 50}%
                </div>
            </div>
            <div class="detail-section">
                <div class="detail-label">\uD83D\uDCDD \uBA54\uBAA8</div>
                <textarea class="detail-memo" id="detailMemo" placeholder="\uBA54\uBAA8\uB97C \uC785\uB825\uD558\uC138\uC694 (\uC608: \uCE74\uD398 \uBC30\uACBD\uC74C\uC545\uC6A9, \uBC84\uC804 2)">${item.memo || ''}</textarea>
            </div>
        `;

        document.getElementById('detailPopup').classList.add('active');
    }

    // 상세 팝업 닫기
    document.getElementById('detailClose').addEventListener('click', closeDetail);
    document.getElementById('detailPopup').addEventListener('click', (e) => {
        if (e.target.id === 'detailPopup') closeDetail();
    });

    function closeDetail() {
        // 메모 자동 저장
        if (currentDetailId) {
            const memo = document.getElementById('detailMemo');
            if (memo) updateMemo(currentDetailId, memo.value);
        }
        document.getElementById('detailPopup').classList.remove('active');
        currentDetailId = null;
        render();
    }

    // 상세 - 전체 복사
    document.getElementById('detailCopy').addEventListener('click', () => {
        const item = getLibrary().find(i => i.id === currentDetailId);
        if (!item) return;
        const text = `[Style Prompt]\n${item.stylePrompt}\n\n[Exclude Styles]\n${item.excludeStyles}\n\n[More Options]\nWeirdness: ${item.weirdness || 50}%\nStyle Influence: ${item.styleInfluence || 50}%`;
        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById('detailCopy');
            btn.innerHTML = '<span>\u2713</span> \uBCF5\uC0AC\uC644\uB8CC!';
            setTimeout(() => btn.innerHTML = '<span>\uD83D\uDCCB</span> \uC804\uCCB4 \uBCF5\uC0AC', 2000);
        });
    });

    // 상세 - 파일 저장
    document.getElementById('detailExport').addEventListener('click', () => {
        const item = getLibrary().find(i => i.id === currentDetailId);
        if (!item) return;
        exportItemAsText(item);
    });

    // 상세 - 다시 사용하기 (easy.html로 이동)
    document.getElementById('detailReuse').addEventListener('click', () => {
        const item = getLibrary().find(i => i.id === currentDetailId);
        if (!item) return;
        // localStorage에 임시 저장 후 easy.html로 이동
        localStorage.setItem('suno-reuse-prompt', JSON.stringify(item));
        window.location.href = 'easy.html?reuse=true';
    });

    // 상세 - 삭제
    document.getElementById('detailDelete').addEventListener('click', () => {
        if (confirm('\uC774 \uD504\uB86C\uD504\uD2B8\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?')) {
            deleteItem(currentDetailId);
            closeDetail();
        }
    });

    // === 파일 내보내기 ===
    function exportItemAsText(item) {
        const date = new Date(item.createdAt);
        const content = `========================================
SUNO MASTER PRO 12 - \uD504\uB86C\uD504\uD2B8 \uC800\uC7A5
\uC0DD\uC131\uC77C\uC2DC: ${date.toLocaleString('ko-KR')}
========================================

[\uD55C\uAD6D\uC5B4 \uC124\uBA85]
${item.explanation || ''}

========================================
[Style Prompt]
${item.stylePrompt}

========================================
[Exclude Styles]
${item.excludeStyles}

========================================
[More Options]
Weirdness: ${item.weirdness || 50}%
Style Influence: ${item.styleInfluence || 50}%

========================================
\uC120\uD0DD \uC815\uBCF4:
- \uD0C0\uAC9F\uCE35: ${(item.target || []).join(', ')}
- \uC7A5\uC18C: ${(item.place || []).join(', ')}
- \uBD84\uC704\uAE30: ${(item.mood || []).join(', ')}
- \uC7A5\uB974: ${(item.genres || []).join(' + ')}
========================================
Generated by SUNO MASTER PRO 12
`;
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
        a.download = `SUNO_Prompt_${dateStr}_${(item.genres || ['prompt']).join('_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // === 전체 내보내기 (JSON) ===
    document.getElementById('btnExportAll').addEventListener('click', () => {
        const lib = getLibrary();
        if (lib.length === 0) {
            alert('\uBCF4\uAD00\uD568\uC774 \uBE44\uC5B4\uC788\uC2B5\uB2C8\uB2E4.');
            return;
        }
        const blob = new Blob([JSON.stringify(lib, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SUNO_Library_Backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // === 불러오기 (JSON + TXT) ===
    document.getElementById('btnImportLib').addEventListener('click', () => {
        document.getElementById('fileImportLib').click();
    });

    document.getElementById('fileImportLib').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const isJson = file.name.toLowerCase().endsWith('.json');
        const isTxt = file.name.toLowerCase().endsWith('.txt');

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;

            if (isJson) {
                importFromJson(content);
            } else if (isTxt) {
                importFromTxt(content, file.name);
            } else {
                alert('\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uD30C\uC77C \uD615\uC2DD\uC785\uB2C8\uB2E4. JSON \uB610\uB294 TXT \uD30C\uC77C\uB9CC \uAC00\uB2A5\uD569\uB2C8\uB2E4.');
            }
        };
        reader.readAsText(file, 'UTF-8');
        e.target.value = '';
    });

    // JSON 불러오기
    function importFromJson(content) {
        try {
            const imported = JSON.parse(content);
            if (!Array.isArray(imported)) throw new Error();

            const lib = getLibrary();
            const existingIds = new Set(lib.map(i => i.id));
            let addedCount = 0;

            imported.forEach(item => {
                if (!existingIds.has(item.id)) {
                    lib.push(item);
                    addedCount++;
                }
            });

            saveLibrary(lib);
            render();
            alert(`${addedCount}\uAC1C\uC758 \uD504\uB86C\uD504\uD2B8\uB97C \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4. (\uC911\uBCF5 ${imported.length - addedCount}\uAC1C \uC81C\uC678)`);
        } catch {
            alert('JSON \uD30C\uC77C \uD615\uC2DD\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.');
        }
    }

    // TXT 불러오기 (SUNO MASTER PRO 12 저장 형식 파싱)
    function importFromTxt(content, fileName) {
        try {
            const item = {
                id: 'prompt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                createdAt: new Date().toISOString(),
                favorite: false,
                memo: '',
                target: [],
                place: [],
                mood: [],
                genres: [],
                stylePrompt: '',
                excludeStyles: '',
                weirdness: 50,
                styleInfluence: 50,
                explanation: ''
            };

            // Style Prompt 파싱
            const styleMatch = content.match(/\[Style Prompt\]\s*\n([\s\S]*?)(?=\n={3,})/);
            if (styleMatch) item.stylePrompt = styleMatch[1].trim();

            // Exclude Styles 파싱
            const excludeMatch = content.match(/\[Exclude Styles\]\s*\n([\s\S]*?)(?=\n={3,})/);
            if (excludeMatch) item.excludeStyles = excludeMatch[1].trim();

            // More Options 파싱
            const weirdMatch = content.match(/Weirdness:\s*(\d+)%/);
            if (weirdMatch) item.weirdness = parseInt(weirdMatch[1]);

            const influenceMatch = content.match(/Style Influence:\s*(\d+)%/);
            if (influenceMatch) item.styleInfluence = parseInt(influenceMatch[1]);

            // 한국어 설명 파싱
            const explMatch = content.match(/\[\uD55C\uAD6D\uC5B4 \uC124\uBA85\]\s*\n([\s\S]*?)(?=\n={3,})/);
            if (explMatch) item.explanation = explMatch[1].trim();

            // 선택 정보 파싱
            const targetMatch = content.match(/-\s*\uD0C0\uAC9F\uCE35:\s*(.+)/);
            if (targetMatch) item.target = targetMatch[1].trim().split(',').map(s => s.trim());

            const placeMatch = content.match(/-\s*\uC7A5\uC18C:\s*(.+)/);
            if (placeMatch) item.place = placeMatch[1].trim().split(',').map(s => s.trim());

            const moodMatch = content.match(/-\s*\uBD84\uC704\uAE30:\s*(.+)/);
            if (moodMatch) item.mood = moodMatch[1].trim().split(',').map(s => s.trim());

            const genreMatch = content.match(/-\s*\uC7A5\uB974:\s*(.+)/);
            if (genreMatch) item.genres = genreMatch[1].trim().split(/\s*\+\s*/);

            // 생성일시 파싱
            const dateMatch = content.match(/\uC0DD\uC131\uC77C\uC2DC:\s*(.+)/);
            if (dateMatch) {
                const parsed = new Date(dateMatch[1].trim());
                if (!isNaN(parsed)) item.createdAt = parsed.toISOString();
            }

            // 최소한 Style Prompt가 있어야 유효
            if (!item.stylePrompt) {
                alert('\uD30C\uC77C\uC5D0\uC11C Style Prompt\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.\nSUNO MASTER PRO 12\uC5D0\uC11C \uC800\uC7A5\uD55C txt \uD30C\uC77C\uB9CC \uBD88\uB7EC\uC62C \uC218 \uC788\uC2B5\uB2C8\uB2E4.');
                return;
            }

            const lib = getLibrary();
            lib.push(item);
            saveLibrary(lib);
            render();
            alert(`"${fileName}" \uD30C\uC77C\uC5D0\uC11C \uD504\uB86C\uD504\uD2B8 1\uAC1C\uB97C \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4.`);
        } catch {
            alert('TXT \uD30C\uC77C\uC744 \uD30C\uC2F1\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.\nSUNO MASTER PRO 12\uC5D0\uC11C \uC800\uC7A5\uD55C \uD30C\uC77C\uC778\uC9C0 \uD655\uC778\uD574\uC8FC\uC138\uC694.');
        }
    }

    // === 전체 삭제 ===
    document.getElementById('btnClearAll').addEventListener('click', () => {
        const lib = getLibrary();
        if (lib.length === 0) return;
        if (confirm(`\uBCF4\uAD00\uD568\uC758 \uBAA8\uB4E0 \uD504\uB86C\uD504\uD2B8(${lib.length}\uAC1C)\uB97C \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?\n\uC774 \uC791\uC5C5\uC740 \uB418\uB3CC\uB9B4 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.`)) {
            saveLibrary([]);
            render();
        }
    });

    // === 검색 ===
    document.getElementById('searchInput').addEventListener('input', render);

    // === 필터 ===
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    // === 글자 크기 ===
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

    // === ESC ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            textSizePopup.classList.remove('active');
            closeDetail();
        }
    });

    // 초기 렌더
    render();

    function autoResizeAll() { document.querySelectorAll('textarea').forEach(ta => { ta.classList.add('auto-resize'); ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; ta.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px'; }); }); }
    autoResizeAll();
    new MutationObserver(() => autoResizeAll()).observe(document.body, { childList: true, subtree: true });

    // === 숨기기/표시하기 토글 (보관함) ===
    const btnCollapseLib = document.getElementById('btnCollapseLib');
    if (btnCollapseLib) {
        btnCollapseLib.addEventListener('click', () => {
            const main = document.querySelector('main.main');
            if (main) {
                const isCollapsed = main.classList.toggle('lib-collapsed');
                btnCollapseLib.textContent = isCollapsed ? '표시하기' : '숨기기';
            }
        });
    }
});

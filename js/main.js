// ============================================
// SUNO MASTER PRO 12 - 메인 JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // === 시계 업데이트 ===
    function updateTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('currentTime').textContent =
            now.toLocaleDateString('ko-KR', options);
    }
    updateTime();
    setInterval(updateTime, 30000);

    // === 글자 크기 조절 ===
    const textSizePopup = document.getElementById('textSizePopup');
    const btnTextSize = document.getElementById('btnTextSize');
    const closeTextSize = document.getElementById('closeTextSize');
    const sizeBtns = document.querySelectorAll('.size-btn');

    // 저장된 글자 크기 불러오기
    const savedSize = localStorage.getItem('suno-text-size') || 'medium';
    applyTextSize(savedSize);

    btnTextSize.addEventListener('click', () => {
        textSizePopup.classList.add('active');
    });

    closeTextSize.addEventListener('click', () => {
        textSizePopup.classList.remove('active');
    });

    textSizePopup.addEventListener('click', (e) => {
        if (e.target === textSizePopup) {
            textSizePopup.classList.remove('active');
        }
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
        if (size !== 'medium') {
            document.body.classList.add('text-' + size);
        }

        sizeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === size);
        });
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

    // === 도움말 팝업 ===
    const helpPopup = document.getElementById('helpPopup');
    const btnHelp = document.getElementById('btnHelp');
    const closeHelp = document.getElementById('closeHelp');

    btnHelp.addEventListener('click', () => {
        helpPopup.classList.add('active');
    });

    closeHelp.addEventListener('click', () => {
        helpPopup.classList.remove('active');
    });

    helpPopup.addEventListener('click', (e) => {
        if (e.target === helpPopup) {
            helpPopup.classList.remove('active');
        }
    });

    // === 카드 클릭 효과 ===
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // 카드 클릭 시 리플 효과
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);

            // 각 카드별 페이지 연결
            const label = card.getAttribute('aria-label');
            const pageMap = {
                '쉽게 만들기': 'easy.html',
                '직접 만들기': 'custom.html',
                '전문가 모드': 'pro.html',
                '노래제목&가사 만들기': 'lyrics.html',
                '썸네일 이미지 만들기': 'coming-soon.html?menu=썸네일 이미지 만들기',
                'Tools': 'coming-soon.html?menu=Tools',
                '영상제작': 'coming-soon.html?menu=영상제작',
                '내 음악 보관함': 'library.html'
            };
            if (pageMap[label]) {
                setTimeout(() => {
                    window.location.href = pageMap[label];
                }, 200);
            }
        });

        // 키보드 접근성: Enter/Space로 클릭
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // === 분위기 버튼 클릭 ===
    const moodBtns = document.querySelectorAll('.mood-btn');
    moodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 클릭 애니메이션
            btn.style.transform = 'scale(0.92)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);

            const mood = btn.textContent.trim();
            console.log(`[SUNO MASTER PRO 12] 분위기 선택: ${mood}`);
        });
    });

    // === ESC 키로 팝업 닫기 ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            textSizePopup.classList.remove('active');
            helpPopup.classList.remove('active');
        }
    });
});

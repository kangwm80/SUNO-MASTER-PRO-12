// ============================================
// SUNO MASTER PRO 12 - 전문가 모드 JavaScript
// 3단계 흐름: 입력 → 전문가 설정 → 완성
// ============================================

// === 머니코드 진행 데이터 (장르별 10개) ===
const MONEY_CHORD_PROGRESSIONS = {
    pop: {
        label: 'Pop / K-Pop',
        chords: [
            { name: 'Axis (캐논 진행)', value: 'I - V - vi - IV', desc: 'Let It Be, 축가, K-Pop 대부분' },
            { name: 'Sensitive (감성 팝)', value: 'vi - IV - I - V', desc: 'Someone Like You, 봄날' },
            { name: '50s (올디스)', value: 'I - vi - IV - V', desc: 'Stand By Me, 500 Miles' },
            { name: 'Royal Road (왕도)', value: 'IV - V - iii - vi', desc: 'J-Pop/K-Pop 발라드 정석' },
            { name: 'Pachelbel', value: 'I - V - vi - iii - IV - I - IV - V', desc: '캐논 변주, 졸업송' },
            { name: 'Andalusian', value: 'vi - V - IV - III', desc: '긴장감 있는 팝, 플라멩코 팝' },
            { name: 'Pop Punk', value: 'I - V - vi - IV - I - V - I', desc: 'Avril Lavigne, Green Day' },
            { name: 'Descending Bass', value: 'I - V/7 - vi - V - IV - iii - ii - V', desc: 'My Heart Will Go On' },
            { name: 'Plagal (아멘)', value: 'I - IV - I - IV', desc: '찬송가, 밝고 단순한 팝' },
            { name: 'Modern Pop Loop', value: 'vi - IV - V - V', desc: '2020년대 K-Pop, 미니멀 팝' }
        ]
    },
    rock: {
        label: 'Rock / Alternative',
        chords: [
            { name: 'Classic Rock', value: 'I - IV - V - I', desc: 'Johnny B. Goode, 12마디 록' },
            { name: 'Power Ballad', value: 'I - V - vi - IV', desc: 'Don\'t Stop Believin\'' },
            { name: 'Grunge', value: 'i - VI - III - VII', desc: 'Smells Like Teen Spirit' },
            { name: 'Blues Rock', value: 'I - I - IV - I - V - IV - I - V', desc: '12마디 블루스 변형' },
            { name: 'Modal Rock', value: 'i - VII - VI - VII', desc: 'Smoke On The Water' },
            { name: 'Brit Rock', value: 'I - iii - IV - V', desc: 'Oasis, Coldplay 스타일' },
            { name: 'Hard Rock', value: 'i - VII - VI - V', desc: 'AC/DC, Led Zeppelin' },
            { name: 'Punk Rock', value: 'I - IV - V - IV', desc: 'Ramones, 빠른 3코드' },
            { name: 'Post Rock', value: 'I - vi - ii - V', desc: 'Radiohead, 진행형 빌드업' },
            { name: 'Arena Rock', value: 'I - V - IV - V - I', desc: 'We Will Rock You, 스타디움' }
        ]
    },
    hiphop: {
        label: 'Hip Hop / Trap',
        chords: [
            { name: 'Trap Minor', value: 'i - VI - III - VII', desc: '트랩 기본, 808 베이스' },
            { name: 'Boom Bap', value: 'ii - V - i - i', desc: '올드스쿨 힙합 정석' },
            { name: 'Dark Trap', value: 'i - i - iv - V', desc: 'Travis Scott, 어두운 무드' },
            { name: 'Chill Hop', value: 'vi - IV - I - V', desc: 'Lo-fi, 감성 힙합' },
            { name: 'Melodic Rap', value: 'I - vi - IV - V', desc: 'Drake, Post Malone' },
            { name: 'Soul Sample', value: 'IV - iv - I - I', desc: 'Kanye, 소울 샘플링 느낌' },
            { name: 'Drill', value: 'i - i - iv - iv', desc: 'UK Drill, 시카고 드릴' },
            { name: 'Cloud Rap', value: 'I - III - IV - iv', desc: 'Yung Lean, 몽환 랩' },
            { name: 'G-Funk', value: 'i - IV - i - V', desc: 'Dr. Dre, 웨스트코스트' },
            { name: 'Jazz Rap', value: 'ii - V - I - vi', desc: 'A Tribe Called Quest' }
        ]
    },
    rnb: {
        label: 'R&B / Soul',
        chords: [
            { name: 'Neo Soul', value: 'IVmaj7 - iii7 - vi7 - V7', desc: 'Erykah Badu, D\'Angelo' },
            { name: 'Classic R&B', value: 'I - vi - ii - V', desc: 'Motown 정석' },
            { name: 'Modern R&B', value: 'vi - IV - I - V', desc: 'The Weeknd, SZA' },
            { name: 'Slow Jam', value: 'Imaj7 - IVmaj7 - iii7 - vi7', desc: 'Boyz II Men' },
            { name: 'Gospel R&B', value: 'I - I7 - IV - iv', desc: '교회 소울, 감동적' },
            { name: 'Funk Soul', value: 'I7 - IV7 - I7 - V7', desc: 'James Brown, Prince' },
            { name: 'PB R&B', value: 'vi - V - IV - V', desc: 'Daniel Caesar, 인디 R&B' },
            { name: 'Jazzy R&B', value: 'IVmaj7 - V7 - iii7 - vi7', desc: 'Sade, Norah Jones' },
            { name: 'Retro Soul', value: 'I - IV - V - IV', desc: '60s Motown, Amy Winehouse' },
            { name: 'Bedroom Pop R&B', value: 'Imaj7 - vi7 - IVmaj7 - V7', desc: 'Frank Ocean, Brent Faiyaz' }
        ]
    },
    jazz: {
        label: 'Jazz',
        chords: [
            { name: 'ii-V-I (재즈 정석)', value: 'ii7 - V7 - Imaj7', desc: '재즈 스탠다드 기본' },
            { name: 'Autumn Leaves', value: 'ii7 - V7 - Imaj7 - IVmaj7 - vii°7 - III7 - vi', desc: '가을 잎 진행' },
            { name: 'Rhythm Changes', value: 'I - vi - ii - V', desc: 'I Got Rhythm, 비밥 정석' },
            { name: 'Modal Jazz', value: 'i7 - i7 - i7 - i7', desc: 'So What, 마일스 데이비스' },
            { name: 'Bossa Nova', value: 'Imaj7 - ii7 - iii7 - VI7', desc: 'Girl From Ipanema' },
            { name: 'Blues Jazz', value: 'I7 - IV7 - I7 - V7', desc: '재즈 블루스 12마디' },
            { name: 'Tritone Sub', value: 'ii7 - bII7 - Imaj7', desc: '트라이톤 대리코드' },
            { name: 'Coltrane Changes', value: 'Imaj7 - bIII7 - Vmaj7 - VII7', desc: 'Giant Steps' },
            { name: 'Latin Jazz', value: 'i7 - IV7 - VII7 - IIImaj7', desc: '라틴 재즈 진행' },
            { name: 'Cool Jazz', value: 'Imaj7 - vi7 - ii7 - V7', desc: 'Chet Baker, 부드러운 재즈' }
        ]
    },
    edm: {
        label: 'EDM / Electronic',
        chords: [
            { name: 'Festival Anthem', value: 'I - V - vi - IV', desc: '페스티벌 앤섬, Avicii' },
            { name: 'Trance Gate', value: 'vi - IV - I - V', desc: 'Armin, 트랜스 빌드업' },
            { name: 'Future Bass', value: 'I - iii - vi - IV', desc: 'Flume, Marshmello' },
            { name: 'Deep House', value: 'i - iv - VII - III', desc: '딥 하우스 루프' },
            { name: 'Techno Minimal', value: 'i - i - iv - i', desc: '미니멀 테크노, 반복' },
            { name: 'Dubstep Drop', value: 'i - VI - VII - i', desc: 'Skrillex, 드롭 구간' },
            { name: 'Progressive', value: 'I - V - vi - iii - IV', desc: 'Deadmau5, 점진적 빌드' },
            { name: 'Tropical House', value: 'I - IV - vi - V', desc: 'Kygo, 열대 바이브' },
            { name: 'Synthwave', value: 'i - VI - III - VII', desc: '80년대 신스웨이브' },
            { name: 'Lo-fi House', value: 'vi - IV - vi - V', desc: '로파이 하우스 루프' }
        ]
    },
    ballad: {
        label: 'Ballad / 발라드',
        chords: [
            { name: '한국 발라드 정석', value: 'IV - V - iii - vi', desc: '이소라, 성시경, 거의 모든 K-발라드' },
            { name: 'Sensitive', value: 'vi - IV - I - V', desc: 'Adele, 서정적 발라드' },
            { name: 'Emotional Build', value: 'I - V - vi - iii - IV - I - ii - V', desc: '웅장한 빌드업 발라드' },
            { name: 'Piano Ballad', value: 'I - iii - IV - V', desc: '피아노 중심 발라드' },
            { name: 'R&B Ballad', value: 'Imaj7 - vi7 - IVmaj7 - V7', desc: '소울 발라드' },
            { name: 'Acoustic Ballad', value: 'I - V/7 - vi - IV', desc: '어쿠스틱 기타 발라드' },
            { name: 'Dramatic', value: 'vi - V - IV - III', desc: '드라마틱 클라이맥스' },
            { name: 'Waltz Ballad', value: 'I - IV - V - I', desc: '3/4 왈츠 발라드' },
            { name: 'Minor Ballad', value: 'i - iv - V - i', desc: '단조 슬픈 발라드' },
            { name: 'Gospel Ballad', value: 'I - I7 - IV - iv - I', desc: '감동적 가스펠 발라드' }
        ]
    },
    country: {
        label: 'Country / Folk',
        chords: [
            { name: 'Nashville (3코드)', value: 'I - IV - V - I', desc: '컨트리 기본 3코드' },
            { name: 'Country Waltz', value: 'I - V - I - IV - I - V - I', desc: '3/4 컨트리 왈츠' },
            { name: 'Country Pop', value: 'I - V - vi - IV', desc: 'Taylor Swift 초기' },
            { name: 'Bluegrass', value: 'I - IV - I - V', desc: '블루그래스 잼' },
            { name: 'Folk Ballad', value: 'I - iii - IV - V', desc: 'Bob Dylan, 포크 서사' },
            { name: 'Country Blues', value: 'I - I - IV - I - V - IV - I', desc: '컨트리 블루스' },
            { name: 'Outlaw Country', value: 'i - VII - VI - V', desc: 'Johnny Cash 스타일' },
            { name: 'Country Rock', value: 'I - IV - V - IV', desc: 'Eagles, 컨트리록' },
            { name: 'Celtic Folk', value: 'I - VII - IV - I', desc: '켈틱/아이리시 포크' },
            { name: 'Americana', value: 'I - vi - IV - V', desc: '아메리카나, 루츠 록' }
        ]
    },
    latin: {
        label: 'Latin / Reggaeton',
        chords: [
            { name: 'Reggaeton', value: 'i - iv - VII - VI', desc: 'Despacito, 레게톤 기본' },
            { name: 'Bossa Nova', value: 'Imaj7 - ii7 - iii7 - VI7', desc: 'Girl From Ipanema' },
            { name: 'Salsa', value: 'I - IV - V - I', desc: '살사 기본 몬투노' },
            { name: 'Bachata', value: 'i - V - i - iv', desc: '바차타 로맨틱' },
            { name: 'Tango', value: 'i - iv - V - i', desc: '아르헨티나 탱고' },
            { name: 'Latin Pop', value: 'I - V - vi - IV', desc: 'Shakira, Enrique' },
            { name: 'Cumbia', value: 'I - IV - V - IV', desc: '쿰비아 파티' },
            { name: 'Flamenco', value: 'vi - V - IV - III', desc: '안달루시안, 플라멩코' },
            { name: 'Samba', value: 'I - vi - ii - V', desc: '브라질 삼바' },
            { name: 'Afrobeat Latin', value: 'i - iv - VII - III', desc: '아프로비트 + 라틴 퓨전' }
        ]
    },
    blues: {
        label: 'Blues / Funk',
        chords: [
            { name: '12-Bar Blues', value: 'I7 - I7 - I7 - I7 - IV7 - IV7 - I7 - I7 - V7 - IV7 - I7 - V7', desc: '블루스 정석 12마디' },
            { name: 'Minor Blues', value: 'i7 - iv7 - i7 - V7', desc: '마이너 블루스' },
            { name: 'Jazz Blues', value: 'I7 - IV7 - I7 - vi7 - ii7 - V7 - I7', desc: '재즈 블루스 변형' },
            { name: 'Funk', value: 'I7 - IV7 - I7 - I7', desc: 'James Brown, 펑키' },
            { name: 'Delta Blues', value: 'I - IV - I - V', desc: '델타 블루스, 어쿠스틱' },
            { name: 'Chicago Blues', value: 'I7 - IV7 - I7 - ii7 - V7 - I7', desc: '시카고 일렉 블루스' },
            { name: 'Boogie', value: 'I - I - IV - I - V - IV - I - I', desc: '부기우기 피아노' },
            { name: 'Slow Blues', value: 'I7 - IV7 - I7 - V7 - IV7 - I7', desc: 'BB King, 느린 블루스' },
            { name: 'Funk Rock', value: 'i7 - IV7 - i7 - V7', desc: 'RHCP, 펑크록' },
            { name: 'Neo Funk', value: 'I7 - iii7 - IV7 - iv7', desc: 'Vulfpeck, 네오 펑크' }
        ]
    },
    classical: {
        label: 'Classical / Cinematic',
        chords: [
            { name: 'Classical (정통)', value: 'I - IV - V - I', desc: '고전 정격 종지' },
            { name: 'Romantic', value: 'I - vi - IV - V', desc: '로맨틱 시대 진행' },
            { name: 'Epic Cinematic', value: 'i - VI - III - VII', desc: '영화 OST, 에픽 트레일러' },
            { name: 'Neoclassical', value: 'i - iv - V - i', desc: '네오클래식, 현대 클래식' },
            { name: 'Baroque Sequence', value: 'I - V - vi - iii - IV - I - IV - V', desc: '바로크 시퀀스' },
            { name: 'Waltz', value: 'I - V - I - IV - I - V - I', desc: '왈츠 3/4 클래식' },
            { name: 'Suspense', value: 'i - bII - V - i', desc: '서스펜스, 스릴러' },
            { name: 'Pastoral', value: 'I - IV - I - V - I', desc: '목가적, 평화로운' },
            { name: 'Film Score Rise', value: 'i - III - VI - IV - V', desc: '영화 클라이맥스 상승' },
            { name: 'Ambient Pad', value: 'Imaj7 - IVmaj7 - Imaj7 - Vmaj7', desc: '앰비언트, 패드 사운드' }
        ]
    },
    reggae: {
        label: 'Reggae / Ska',
        chords: [
            { name: 'One Drop', value: 'I - IV - I - V', desc: 'Bob Marley, 원드롭' },
            { name: 'Roots Reggae', value: 'I - V - vi - IV', desc: '루츠 레게' },
            { name: 'Dub', value: 'i - iv - i - V', desc: '더브 레게, 에코' },
            { name: 'Ska', value: 'I - IV - V - IV', desc: '스카 업비트' },
            { name: 'Lover\'s Rock', value: 'I - vi - IV - V', desc: '러버스 록, 로맨틱' },
            { name: 'Dancehall', value: 'i - VII - VI - V', desc: '댄스홀, 자메이카' },
            { name: 'Reggae Pop', value: 'I - V - vi - IV', desc: 'Rihanna, 레게 팝' },
            { name: 'Mento', value: 'I - IV - V - I', desc: '멘토, 자메이카 포크' },
            { name: 'Rocksteady', value: 'I - vi - ii - V', desc: '록스테디' },
            { name: 'Modern Reggae', value: 'vi - IV - I - V', desc: '모던 레게 퓨전' }
        ]
    },
    ambient: {
        label: 'Ambient / New Age',
        chords: [
            { name: 'Floating', value: 'Imaj7 - IVmaj7', desc: 'Brian Eno, 부유하는 사운드' },
            { name: 'Dream Pad', value: 'Imaj7 - vi7 - IVmaj7 - V7', desc: '꿈같은 패드' },
            { name: 'Meditation', value: 'I - I - IV - I', desc: '명상, 단순 반복' },
            { name: 'Cinematic Ambient', value: 'i - VI - III - VII', desc: '시네마틱 앰비언트' },
            { name: 'Healing', value: 'I - iii - IV - I', desc: '힐링 뮤직' },
            { name: 'Space', value: 'i - bVII - bVI - V', desc: '우주적 공간감' },
            { name: 'Nature', value: 'I - IV - I - IV', desc: '자연 사운드스케이프' },
            { name: 'Ethereal', value: 'vi - IV - I - iii', desc: '에테리얼, Enya' },
            { name: 'Dark Ambient', value: 'i - bII - i - bII', desc: '다크 앰비언트' },
            { name: 'Chillout', value: 'Imaj7 - vi7 - ii7 - V7', desc: '칠아웃, 라운지' }
        ]
    },
    metal: {
        label: 'Metal / Punk',
        chords: [
            { name: 'Power Metal', value: 'i - VI - VII - i', desc: '파워 메탈, 에픽' },
            { name: 'Thrash', value: 'i - bII - i - bII', desc: '스래쉬 메탈, Metallica' },
            { name: 'Doom', value: 'i - iv - i - V', desc: '둠 메탈, 느리고 무거운' },
            { name: 'Nu Metal', value: 'i - bVII - bVI - V', desc: 'Linkin Park, 뉴메탈' },
            { name: 'Metalcore', value: 'i - VI - IV - VII', desc: '메탈코어 브레이크다운' },
            { name: 'Progressive Metal', value: 'i - bVII - bVI - bVII - i', desc: 'Dream Theater' },
            { name: 'Black Metal', value: 'i - bII - bVII - i', desc: '블랙메탈 트레몰로' },
            { name: 'Punk', value: 'I - IV - V - I', desc: '3코드 펑크' },
            { name: 'Post Punk', value: 'i - VII - VI - V', desc: 'Joy Division 스타일' },
            { name: 'Melodic Death', value: 'i - III - VII - VI', desc: '멜로딕 데스메탈' }
        ]
    }
};

// === 매핑 상수 ===
const labelMap = {
    comfortable: '편안한', healing: '힐링', cozy: '포근한', warm: '따뜻한',
    emotional: '감성적', dreamy: '몽환적', calm: '잔잔한', lonely: '쓸쓸한',
    sentimental: '센치한', 'dawn-mood': '새벽감성', nostalgic: '그리운',
    flutter: '설레는', love: '사랑', breakup: '이별', 'feel-good': '기분좋은',
    refreshing: '상쾌한', exciting: '신나는', groovy: '흥겨운', 'tension-up': '텐션업',
    powerful: '파워풀한', confidence: '자신감', focus: '집중', immersive: '몰입',
    sleep: '잠잘때', 'sleep-aid': '수면유도', comfort: '위로', rainy: '비오는날',
    dawn: '새벽', sunset: '일몰', running: '달릴때'
};

const vocalGenderMap = {
    male: 'male vocals', female: 'female vocals',
    duet: 'male and female duet', group: 'group vocals',
    instrumental: 'instrumental, no vocals'
};
const vocalStyleMap = {
    'chest-voice': 'chest voice', 'head-voice': 'head voice',
    falsetto: 'falsetto', belting: 'belting', vibrato: 'vibrato',
    breathy: 'breathy', grit: 'grit raspy', whisper: 'whisper',
    rap: 'rap flow', autotune: 'auto-tuned'
};
const vocalRangeMap = {
    bass: 'bass range', baritone: 'baritone', tenor: 'tenor',
    alto: 'alto', mezzo: 'mezzo-soprano', soprano: 'soprano'
};
const instrumentMap = {
    piano: 'piano', 'acoustic-guitar': 'acoustic guitar',
    'electric-guitar': 'electric guitar', 'bass-guitar': 'bass guitar',
    drums: 'drums', synth: 'synthesizer', strings: 'strings',
    brass: 'brass section', saxophone: 'saxophone', violin: 'violin',
    cello: 'cello', organ: 'organ', '808': '808 bass',
    'drum-machine': 'drum machine', percussion: 'percussion',
    choir: 'choir harmonies', orchestra: 'full orchestra'
};

// === 장르→머니코드 카테고리 매핑 ===
const GENRE_TO_CHORD_CATEGORY = {
    'Pop': 'pop', 'K-Pop': 'pop', 'Mainstream Pop': 'pop', 'Synth Pop': 'pop',
    'Indie Pop': 'pop', 'Acoustic Pop': 'pop', 'City Pop': 'pop', 'Dance Pop': 'pop',
    'Rock': 'rock', 'Classic Rock': 'rock', 'Alternative': 'rock', 'Indie Rock': 'rock',
    'Punk Rock': 'rock', 'Grunge': 'rock', 'Post Rock': 'rock', 'Prog Rock': 'rock',
    'Hip Hop': 'hiphop', 'Trap': 'hiphop', 'Boom Bap': 'hiphop', 'Lo-fi Hip Hop': 'hiphop',
    'R&B': 'rnb', 'Contemporary R&B': 'rnb', 'Soul': 'rnb', 'Neo Soul': 'rnb',
    'Jazz': 'jazz', 'Smooth Jazz': 'jazz', 'Bossa Nova': 'jazz', 'Swing': 'jazz',
    'House': 'edm', 'Trance': 'edm', 'Techno': 'edm', 'EDM': 'edm', 'Dubstep': 'edm',
    'Future Bass': 'edm', 'Drum and Bass': 'edm', 'Ambient': 'ambient', 'New Age': 'ambient',
    'Pop Ballad': 'ballad', 'Ballad': 'ballad', 'Power Ballad': 'ballad',
    'Country': 'country', 'Classic Country': 'country', 'Folk': 'country', 'Bluegrass': 'country',
    'Reggaeton': 'latin', 'Latin': 'latin', 'Salsa': 'latin', 'Bachata': 'latin',
    'Blues': 'blues', 'Funk': 'blues', 'Delta Blues': 'blues',
    'Classical': 'classical', 'Cinematic': 'classical', 'Orchestral': 'classical',
    'Reggae': 'reggae', 'Ska': 'reggae', 'Dub': 'reggae',
    'Metal': 'metal', 'Heavy Metal': 'metal', 'Punk': 'metal', 'Metalcore': 'metal',
    'Disco': 'blues'
};

// ============================================
// DOMContentLoaded — 메인 실행
// ============================================
document.addEventListener('DOMContentLoaded', () => {

    // === 상태 관리 ===
    let currentStep = 1;
    let isUpgradeMode = false;   // false=새로만들기, true=프롬프트 업그레이드
    let analysisInitialized = false;
    let importedPromptData = null;

    const selections = {
        freeText: '',
        upgradeText: '',        // 업그레이드 모드 원본 프롬프트
        mood: [],
        genres: [],             // 무제한 배열 (제한 없음)
        chordProgression: '',   // 선택한 머니코드
        key: '',
        timeSig: '',
        bpm: 110,
        vocalGender: [],
        vocalStyle: [],
        vocalRange: [],
        customVocal: '',        // 보컬 직접 입력 텍스트
        instruments: [],
        production: []
    };

    // === DOM 참조 ===
    const freeInput = document.getElementById('freeInput');
    const upgradeInput = document.getElementById('upgradeInput');
    const btnAnalyze = document.getElementById('btnAnalyze');
    const bpmSlider = document.getElementById('bpmSlider');
    const bpmValue = document.getElementById('bpmValue');

    // === 모드 전환 탭 ===
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const mode = tab.dataset.mode;
            isUpgradeMode = (mode === 'upgrade');

            document.getElementById('modeNewCreate').style.display = isUpgradeMode ? 'none' : '';
            document.getElementById('modeUpgrade').style.display = isUpgradeMode ? '' : 'none';

            const hint = document.getElementById('analyzeHint');
            hint.textContent = isUpgradeMode
                ? '기존 프롬프트를 분석하여 v5 구조로 자동 업그레이드합니다'
                : '만들고 싶은 음악을 입력하면 AI가 자동으로 설정합니다';

            // 활성 입력의 내용으로 버튼 활성화 판단
            const activeInput = isUpgradeMode ? upgradeInput : freeInput;
            btnAnalyze.disabled = activeInput.value.trim().length === 0;
        });
    });

    // === 자유 입력 핸들러 (새로 만들기) ===
    freeInput.addEventListener('input', () => {
        document.getElementById('charCount').textContent = freeInput.value.length + '자';
        if (!isUpgradeMode) btnAnalyze.disabled = freeInput.value.trim().length === 0;
    });
    document.getElementById('btnClearInput').addEventListener('click', () => {
        freeInput.value = '';
        document.getElementById('charCount').textContent = '0자';
        if (!isUpgradeMode) btnAnalyze.disabled = true;
    });

    // === 업그레이드 입력 핸들러 ===
    upgradeInput.addEventListener('input', () => {
        document.getElementById('upgradeCharCount').textContent = upgradeInput.value.length + '자';
        if (isUpgradeMode) btnAnalyze.disabled = upgradeInput.value.trim().length === 0;
    });
    document.getElementById('btnClearUpgrade').addEventListener('click', () => {
        upgradeInput.value = '';
        document.getElementById('upgradeCharCount').textContent = '0자';
        if (isUpgradeMode) btnAnalyze.disabled = true;
    });

    // === 분석 버튼 ===
    btnAnalyze.addEventListener('click', () => {
        if (isUpgradeMode) {
            selections.upgradeText = upgradeInput.value.trim();
            selections.freeText = selections.upgradeText;
        } else {
            selections.freeText = freeInput.value.trim();
        }
        if (!selections.freeText) return;
        analysisInitialized = false;
        goToStep(2);
    });

    // === 토글 그룹 (복수 선택) ===
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

    // === 단일 선택 토글 (Key, 박자, 보컬성별, 음역대) ===
    function setupSingleToggle(id, key) {
        const c = document.getElementById(id);
        if (!c) return;
        c.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const wasActive = btn.classList.contains('active');
                c.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                if (!wasActive) btn.classList.add('active');
                const active = c.querySelectorAll('.toggle-btn.active');
                selections[key] = Array.from(active).map(b => b.dataset.value);
            });
        });
    }

    // === 자동 활성화 헬퍼 ===
    function autoActivate(id, key, value) {
        const c = document.getElementById(id);
        if (!c) return;
        const btn = c.querySelector(`[data-value="${value}"]`);
        if (btn && !btn.classList.contains('active')) btn.classList.add('active');
        const active = c.querySelectorAll('.toggle-btn.active');
        selections[key] = Array.from(active).map(b => b.dataset.value);
    }

    // 토글 그룹 초기화
    setupToggleGroup('moodBtns', 'mood');
    setupToggleGroup('vocalStyleBtns', 'vocalStyle');
    setupToggleGroup('instrumentBtns', 'instruments');
    setupToggleGroup('productionBtns', 'production');
    setupSingleToggle('keyBtns', 'key');
    setupSingleToggle('timeSigBtns', 'timeSig');
    setupSingleToggle('vocalGenderBtns', 'vocalGender');
    setupSingleToggle('vocalRangeBtns', 'vocalRange');

    // === BPM 슬라이더 + 프리셋 ===
    bpmSlider.addEventListener('input', () => {
        selections.bpm = parseInt(bpmSlider.value);
        bpmValue.textContent = bpmSlider.value + ' BPM';
    });
    document.querySelectorAll('.bpm-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const b = parseInt(btn.dataset.bpm);
            bpmSlider.value = b;
            selections.bpm = b;
            bpmValue.textContent = b + ' BPM';
        });
    });

    // === 보컬 직접 입력 ===
    const customVocalInput = document.getElementById('customVocalInput');
    if (customVocalInput) {
        customVocalInput.addEventListener('input', () => {
            selections.customVocal = customVocalInput.value.trim();
        });
    }

    // === 단계 이동 ===
    function goToStep(step) {
        document.querySelectorAll('.step-page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById('step' + step);
        if (target) target.classList.add('active');

        document.querySelectorAll('.step-item').forEach((item, i) => {
            const n = i + 1;
            item.classList.remove('active', 'done');
            if (n < step) item.classList.add('done');
            else if (n === step) item.classList.add('active');
        });
        document.querySelectorAll('.step-line').forEach((line, i) => {
            line.classList.toggle('done', i < step - 1);
        });

        if (step === 2) showAnalysis();
        if (step === 3) buildFinalPrompt();
        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 네비게이션 버튼
    document.getElementById('btnPrevStep2').addEventListener('click', () => goToStep(1));
    document.getElementById('btnGeneratePrompt').addEventListener('click', () => goToStep(3));
    document.getElementById('btnPrevStep').addEventListener('click', () => goToStep(2));

    // === placeholder: 이후 섹션에서 채울 함수들 ===
    function showAnalysis() { /* 섹션 4에서 구현 */ }
    function buildFinalPrompt() { /* 섹션 5에서 구현 */ }

}); // DOMContentLoaded 끝

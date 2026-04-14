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

    // ============================================
    // 장르 무제한 선택 (드롭다운 + 태그)
    // ============================================
    (function setupGenreUnlimited() {
        const trigger = document.getElementById('genreTrigger');
        const filter = document.getElementById('genreFilter');
        const dropdown = document.getElementById('genreDropdown');
        const display = document.getElementById('selectedGenresDisplay');
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
                    g.genre.toLowerCase().includes(q) ||
                    g.main.toLowerCase().includes(q) ||
                    (g.sub || '').toLowerCase().includes(q)
                ) : genres;
                if (filtered.length === 0) continue;

                const header = document.createElement('div');
                header.className = 'genre-dropdown-header';
                header.textContent = mainCat;
                dropdown.appendChild(header);

                filtered.forEach(g => {
                    const item = document.createElement('div');
                    item.className = 'genre-dropdown-item';
                    if (selections.genres.includes(g.genre)) item.classList.add('selected');
                    item.innerHTML = `<strong>${g.genre}</strong> <span class="genre-dd-main">${g.sub || ''}</span>`;
                    item.addEventListener('click', () => {
                        if (selections.genres.includes(g.genre)) {
                            removeGenre(g.genre);
                            item.classList.remove('selected');
                        } else {
                            selections.genres.push(g.genre);
                            item.classList.add('selected');
                        }
                        renderGenreTags();
                        updateChordDropdown();
                        updateTriggerText();
                    });
                    dropdown.appendChild(item);
                });
            }
        }

        function renderGenreTags() {
            display.innerHTML = '';
            selections.genres.forEach((genre, idx) => {
                const tag = document.createElement('span');
                tag.className = 'selected-genre-tag' + (idx === 0 ? ' main-tag' : '');
                tag.innerHTML = `${idx === 0 ? '&#11088;' : '&#127912;'} ${genre} <button class="genre-remove-btn" data-genre="${genre}">&times;</button>`;
                tag.querySelector('.genre-remove-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeGenre(genre);
                    renderGenreTags();
                    updateChordDropdown();
                    updateTriggerText();
                    // 드롭다운 열려있으면 갱신
                    if (isOpen) renderDropdown(filter.value);
                });
                display.appendChild(tag);
            });
        }

        function removeGenre(genre) {
            selections.genres = selections.genres.filter(g => g !== genre);
        }

        function updateTriggerText() {
            if (selections.genres.length === 0) {
                trigger.textContent = '클릭하여 장르 추가 \u25BC';
            } else {
                trigger.textContent = selections.genres.length + '개 장르 선택됨 \u25BC';
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

        // 외부에서 장르 추가할 수 있도록 노출
        window._proAddGenre = function(genre) {
            if (!selections.genres.includes(genre)) {
                selections.genres.push(genre);
                renderGenreTags();
                updateChordDropdown();
                updateTriggerText();
            }
        };
    })();

    // ============================================
    // 머니코드 진행 드롭다운
    // ============================================
    const chordSelect = document.getElementById('chordProgressionSelect');
    const chordDisplay = document.getElementById('chordDisplay');

    function updateChordDropdown() {
        chordSelect.innerHTML = '';

        if (selections.genres.length === 0) {
            chordSelect.innerHTML = '<option value="">-- 장르를 먼저 선택하면 코드 진행이 표시됩니다 --</option>';
            chordDisplay.innerHTML = '';
            selections.chordProgression = '';
            return;
        }

        // 선택된 장르들의 카테고리 수집 (중복 제거)
        const categories = new Set();
        selections.genres.forEach(genre => {
            // 정확한 매핑 먼저
            if (GENRE_TO_CHORD_CATEGORY[genre]) {
                categories.add(GENRE_TO_CHORD_CATEGORY[genre]);
            } else {
                // DB에서 main 카테고리로 매핑 시도
                const dbEntry = GENRE_DATABASE.find(g => g.genre === genre);
                if (dbEntry && dbEntry.main) {
                    const mainLower = dbEntry.main.toLowerCase();
                    for (const [key, cat] of Object.entries(GENRE_TO_CHORD_CATEGORY)) {
                        if (key.toLowerCase() === mainLower) { categories.add(cat); break; }
                    }
                }
                // 못 찾으면 pop 기본
                if (categories.size === 0) categories.add('pop');
            }
        });

        // 기본 옵션
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '-- 코드 진행을 선택하세요 --';
        chordSelect.appendChild(defaultOpt);

        // 카테고리별 코드 진행 추가
        categories.forEach(cat => {
            const data = MONEY_CHORD_PROGRESSIONS[cat];
            if (!data) return;

            const optGroup = document.createElement('optgroup');
            optGroup.label = data.label;

            data.chords.forEach(chord => {
                const opt = document.createElement('option');
                opt.value = chord.value;
                opt.textContent = `${chord.name}: ${chord.value}`;
                opt.title = chord.desc;
                optGroup.appendChild(opt);
            });

            chordSelect.appendChild(optGroup);
        });
    }

    chordSelect.addEventListener('change', () => {
        selections.chordProgression = chordSelect.value;
        if (chordSelect.value) {
            // 선택한 코드 진행 상세 표시
            let found = null;
            for (const cat of Object.values(MONEY_CHORD_PROGRESSIONS)) {
                found = cat.chords.find(c => c.value === chordSelect.value);
                if (found) break;
            }
            if (found) {
                chordDisplay.innerHTML = `<div class="chord-info"><strong>${found.name}</strong><br><span class="chord-value">${found.value}</span><br><span class="chord-desc">${found.desc}</span></div>`;
            }
        } else {
            chordDisplay.innerHTML = '';
        }
    });

    // ============================================
    // 악기 추가 드롭다운
    // ============================================
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
        if (!trigger || !filter || !dropdown) return;
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
                    instrumentMap[instr.name] = instr.name;
                    const grid = document.getElementById('instrumentBtns');
                    if (grid.querySelector(`[data-value="${instr.name}"]`)) { closeDD(); return; }
                    const btn = document.createElement('button');
                    btn.className = 'toggle-btn active';
                    btn.dataset.value = instr.name;
                    btn.textContent = instr.label;
                    btn.addEventListener('click', () => {
                        btn.classList.toggle('active');
                        selections.instruments = Array.from(grid.querySelectorAll('.toggle-btn.active')).map(b => b.dataset.value);
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

    // ============================================
    // showAnalysis — Step 2 진입 시 텍스트 자동 분석
    // ============================================
    function autoSelect(containerId, selKey, keywordMap, text) {
        const container = document.getElementById(containerId);
        if (!container) return;
        for (const [value, keywords] of Object.entries(keywordMap)) {
            if (keywords.some(kw => text.includes(kw))) {
                const btn = container.querySelector(`[data-value="${value}"]`);
                if (btn) btn.classList.add('active');
            }
        }
        selections[selKey] = Array.from(container.querySelectorAll('.toggle-btn.active')).map(b => b.dataset.value);
    }

    function showAnalysis() {
        document.getElementById('originalInput').textContent = '\uD83D\uDCDD 입력: ' + selections.freeText;
        if (analysisInitialized) return;
        analysisInitialized = true;

        const text = selections.freeText.toLowerCase();

        // 기존 활성 초기화
        document.querySelectorAll('#step2 .toggle-btn.active').forEach(b => b.classList.remove('active'));

        // === 분위기 ===
        const moodKw = {
            'comfortable': ['편안','릴렉스','relaxing'], 'healing': ['힐링','치유','healing'],
            'cozy': ['포근','cozy'], 'warm': ['따뜻','warm'],
            'emotional': ['감성','감동','서정','emotional'], 'dreamy': ['몽환','꿈같','dreamy'],
            'calm': ['잔잔','평화','고요','차분','calm'], 'lonely': ['쓸쓸','외로','lonely'],
            'sentimental': ['센치','센티','sentimental'], 'dawn-mood': ['새벽감성'],
            'nostalgic': ['그리운','추억','향수','nostalgic'], 'flutter': ['설레','두근','flutter'],
            'love': ['사랑','러브','love','로맨스'], 'breakup': ['이별','헤어','breakup','슬픈','눈물'],
            'feel-good': ['기분좋','즐거','feel good'], 'refreshing': ['상쾌','시원','refreshing'],
            'exciting': ['신나','활기','밝은','exciting','경쾌'], 'groovy': ['그루브','groove','groovy'],
            'tension-up': ['텐션','열정','tension'], 'powerful': ['파워','강렬','힘찬','powerful'],
            'confidence': ['자신감','당당','confidence'], 'focus': ['집중','focus'],
            'immersive': ['몰입','immersive'], 'sleep': ['잠','수면','자장가','sleep'],
            'sleep-aid': ['수면유도','sleep aid'], 'comfort': ['위로','위안','comfort'],
            'rainy': ['비','비오는','rainy','빗소리'], 'dawn': ['새벽','dawn'],
            'sunset': ['일몰','노을','sunset'], 'running': ['달리','러닝','조깅','running']
        };
        autoSelect('moodBtns', 'mood', moodKw, text);

        // === 보컬 성별 ===
        const vgKw = {
            'male': ['남성','남자','male','형','오빠'], 'female': ['여성','여자','female','누나','언니'],
            'duet': ['듀엣','듀오','duet'], 'group': ['그룹','합창','group'],
            'instrumental': ['연주','무보컬','bgm','배경음악','instrumental','no vocal']
        };
        autoSelect('vocalGenderBtns', 'vocalGender', vgKw, text);

        // === 보컬 스타일 ===
        const vsKw = {
            'chest-voice': ['자연스러운','자연 목소리'], 'breathy': ['부드러운','숨소리','soft','breathy'],
            'belting': ['파워','힘찬','고음 폭발','belting'], 'falsetto': ['가성','falsetto','하이톤'],
            'vibrato': ['비브라토','떨림','vibrato'], 'grit': ['허스키','거친','raspy','grit'],
            'whisper': ['속삭','whisper'], 'rap': ['랩','rap','힙합'], 'autotune': ['오토튠','autotune']
        };
        autoSelect('vocalStyleBtns', 'vocalStyle', vsKw, text);

        // === 악기 ===
        const instrKw = {
            'piano': ['피아노','piano','건반'], 'acoustic-guitar': ['어쿠스틱','통기타','acoustic guitar'],
            'electric-guitar': ['일렉기타','electric guitar'], 'bass-guitar': ['베이스기타','bass guitar'],
            'drums': ['드럼','drums','비트'], 'synth': ['신디','synth','신스','전자음'],
            'strings': ['스트링','현악','strings'], 'brass': ['관악','브라스','brass'],
            'saxophone': ['색소폰','sax'], 'violin': ['바이올린','violin'],
            'cello': ['첼로','cello'], 'organ': ['오르간','organ'],
            '808': ['808'], 'drum-machine': ['드럼머신','drum machine'],
            'percussion': ['퍼커션','타악기'], 'choir': ['합창','코러스','choir'],
            'orchestra': ['오케스트라','orchestra']
        };
        autoSelect('instrumentBtns', 'instruments', instrKw, text);

        // === 프로덕션 ===
        const prodKw = {
            'tape saturation': ['테이프','tape','아날로그'], 'plate reverb': ['플레이트','plate reverb'],
            'room reverb': ['룸 리버브','room reverb'], 'hall reverb': ['홀 리버브','hall reverb','웅장'],
            'dry and direct': ['드라이','dry','리버브 없'], 'vinyl crackle': ['바이닐','vinyl','lp'],
            'lo-fi texture': ['로파이','lo-fi','lo fi'], 'clean vocal upfront': ['보컬 전면','clean vocal'],
            'wide stereo': ['와이드','wide stereo','넓은'], 'sidechain pump': ['사이드체인','sidechain'],
            'analog warmth': ['아날로그 따뜻','analog warmth'], 'crisp highs': ['선명한 고음','crisp'],
            'deep sub bass': ['서브 베이스','sub bass'], 'gated reverb': ['게이트 리버브','gated reverb','80년대']
        };
        autoSelect('productionBtns', 'production', prodKw, text);

        // === 장르 자동 감지 ===
        const korGenreMap = {
            '팝': 'Mainstream Pop', '발라드': 'Pop Ballad', '록': 'Classic Rock',
            '힙합': 'Boom Bap', '재즈': 'Smooth Jazz', '클래식': 'Classical',
            '하우스': 'House', '펑크': 'Funk', '컨트리': 'Classic Country',
            '블루스': 'Blues', '소울': 'Soul', '알앤비': 'Contemporary R&B',
            'r&b': 'Contemporary R&B', '레게': 'Reggae', '라틴': 'Reggaeton',
            '보사노바': 'Bossa Nova', '케이팝': 'K-Pop', 'k-pop': 'K-Pop',
            '인디': 'Indie Pop', '어쿠스틱': 'Acoustic Pop', '로파이': 'Lo-fi Hip Hop',
            'lo-fi': 'Lo-fi Hip Hop', '트랩': 'Trap', '트랜스': 'Trance',
            '메탈': 'Metal', '디스코': 'Disco', '앰비언트': 'New Age',
            '뉴에이지': 'New Age', '시티팝': 'City Pop', '신스팝': 'Synth Pop',
            '네오소울': 'Neo Soul', '트로트': 'Trot', '가스펠': 'Gospel'
        };

        // 영어 장르명 직접 감지 (긴 이름 우선)
        const detected = [];
        const sortedGenres = [...GENRE_DATABASE].sort((a, b) => b.genre.length - a.genre.length);
        sortedGenres.forEach(g => {
            if (text.includes(g.genre.toLowerCase()) && !detected.includes(g.genre)) {
                detected.push(g.genre);
            }
        });
        // 한글 장르명 감지
        if (detected.length === 0) {
            for (const [kor, eng] of Object.entries(korGenreMap)) {
                if (text.includes(kor) && !detected.includes(eng)) detected.push(eng);
            }
        }
        // 감지된 장르 추가
        detected.forEach(g => {
            if (window._proAddGenre) window._proAddGenre(g);
        });

        // === 기본값 ===
        if (!selections.mood.length) autoActivate('moodBtns', 'mood', 'feel-good');
        if (!selections.vocalGender.length) autoActivate('vocalGenderBtns', 'vocalGender', 'female');
        if (!selections.vocalStyle.length) autoActivate('vocalStyleBtns', 'vocalStyle', 'breathy');
        if (!selections.instruments.length) {
            autoActivate('instrumentBtns', 'instruments', 'piano');
            autoActivate('instrumentBtns', 'instruments', 'drums');
        }
        if (!selections.vocalRange.length) {
            if (selections.vocalGender.includes('male')) autoActivate('vocalRangeBtns', 'vocalRange', 'baritone');
            else autoActivate('vocalRangeBtns', 'vocalRange', 'mezzo');
        }

        // === BPM 자동 추정 ===
        const bpmMatch = text.match(/(\d{2,3})\s*bpm/i);
        if (bpmMatch) {
            const b = parseInt(bpmMatch[1]);
            bpmSlider.value = b; selections.bpm = b; bpmValue.textContent = b + ' BPM';
        } else {
            let b = 110;
            if (selections.mood.some(m => ['sleep','sleep-aid','calm','comfortable','healing'].includes(m))) b = 70;
            else if (selections.mood.some(m => ['emotional','love','breakup','lonely','comfort','warm'].includes(m))) b = 80;
            else if (selections.mood.some(m => ['nostalgic','cozy','rainy','sunset'].includes(m))) b = 90;
            else if (selections.mood.some(m => ['feel-good','refreshing','flutter'].includes(m))) b = 110;
            else if (selections.mood.some(m => ['exciting','groovy','confidence'].includes(m))) b = 120;
            else if (selections.mood.some(m => ['tension-up','running'].includes(m))) b = 135;
            else if (selections.mood.some(m => ['powerful'].includes(m))) b = 145;
            bpmSlider.value = b; selections.bpm = b; bpmValue.textContent = b + ' BPM';
        }

        // === 조성/박자 자동 감지 ===
        const keyMatch = text.match(/([A-G][b#]?)\s*(major|minor)/i);
        if (keyMatch) autoActivate('keyBtns', 'key', keyMatch[0]);
        else {
            if (selections.mood.some(m => ['calm','healing','comfortable','warm','cozy'].includes(m))) autoActivate('keyBtns', 'key', 'C major');
            else if (selections.mood.some(m => ['emotional','lonely','breakup','sentimental'].includes(m))) autoActivate('keyBtns', 'key', 'A minor');
            else if (selections.mood.some(m => ['exciting','feel-good','confidence'].includes(m))) autoActivate('keyBtns', 'key', 'G major');
            else if (selections.mood.some(m => ['dreamy','nostalgic','sunset'].includes(m))) autoActivate('keyBtns', 'key', 'D minor');
            else if (selections.mood.some(m => ['powerful','tension-up'].includes(m))) autoActivate('keyBtns', 'key', 'E minor');
        }

        const tsMatch = text.match(/([2-7]\/[4-8])/);
        if (tsMatch) autoActivate('timeSigBtns', 'timeSig', tsMatch[1]);
        else {
            if (selections.mood.some(m => ['calm','healing','sleep','dreamy'].includes(m))) autoActivate('timeSigBtns', 'timeSig', '6/8');
            else autoActivate('timeSigBtns', 'timeSig', '4/4');
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

    // === placeholder: 이후 섹션에서 채울 함수 ===
    function buildFinalPrompt() { /* 섹션 5에서 구현 */ }

}); // DOMContentLoaded 끝

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
    let isUpgradeMode = false;   // 입력 내용이 기존 프롬프트인지 자동 감지
    let analysisInitialized = false;
    let importedPromptData = null;

    const selections = {
        freeText: '',
        upgradeText: '',        // 업그레이드 감지 시 원본 프롬프트
        mood: [],
        genres: [],             // 무제한 배열 (제한 없음)
        chordProgression: '',   // 선택한 머니코드
        key: '',
        timeSig: '',
        bpm: 110,
        vocalGender: [],
        vocalAge: '',           // 보컬 연령대
        vocalStyle: [],
        vocalRange: [],
        customVocal: '',        // 보컬 직접 입력 텍스트
        instruments: [],
        production: []
    };

    // === DOM 참조 ===
    const freeInput = document.getElementById('freeInput');
    const btnAnalyze = document.getElementById('btnAnalyze');
    const bpmSlider = document.getElementById('bpmSlider');
    const bpmValue = document.getElementById('bpmValue');

    // === 기존 프롬프트 자동 감지 ===
    function detectExistingPrompt(text) {
        const lower = text.toLowerCase();
        let score = 0;
        if (/\d{2,3}\s*bpm/i.test(lower)) score += 2;
        if (/[A-G][b#]?\s*(major|minor)/i.test(text)) score += 2;
        if (/(vocal|baritone|tenor|soprano|alto|mezzo|breathy|belting|falsetto)/i.test(lower)) score += 1;
        if (/(piano|guitar|drums|synth|bass|strings|brass|saxophone)/i.test(lower)) score += 1;
        const commaCount = (text.match(/,/g) || []).length;
        if (commaCount >= 3) score += 1;
        // 영어 비중이 높으면 기존 프롬프트일 가능성
        const engRatio = (text.match(/[a-zA-Z]/g) || []).length / text.length;
        if (engRatio > 0.5) score += 1;
        return score >= 4; // 4점 이상이면 기존 프롬프트로 판단
    }

    // === 자유 입력 핸들러 ===
    freeInput.addEventListener('input', () => {
        document.getElementById('charCount').textContent = freeInput.value.length + '자';
        btnAnalyze.disabled = freeInput.value.trim().length === 0;
    });
    document.getElementById('btnClearInput').addEventListener('click', () => {
        freeInput.value = '';
        document.getElementById('charCount').textContent = '0자';
        btnAnalyze.disabled = true;
    });

    // === 분석 버튼 ===
    btnAnalyze.addEventListener('click', () => {
        const text = freeInput.value.trim();
        if (!text) return;

        // 기존 프롬프트 자동 감지
        isUpgradeMode = detectExistingPrompt(text);
        if (isUpgradeMode) {
            selections.upgradeText = text;
        }
        selections.freeText = text;
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
    setupToggleGroup('instrumentBtns', 'instruments');
    setupToggleGroup('productionBtns', 'production');
    setupSingleToggle('keyBtns', 'key');
    setupSingleToggle('timeSigBtns', 'timeSig');

    // ============================================
    // 보컬 4단계 순차 선택 (직접만들기와 동일)
    // ============================================
    const MALE_RANGES = [
        { value: 'low bass, G2~G3', label: '저음 (G2~G3)', title: '깊고 무게감 있는 저음' },
        { value: 'mid baritone, C3~C4', label: '중음 (C3~C4)', title: '가장 자연스러운 남성 음역대' },
        { value: 'high tenor, G3~G4', label: '중고음 (G3~G4)', title: '힘 있고 감동적인 중고음' },
        { value: 'power tenor, C4~C5', label: '고음 (C4~C5)', title: '폭발적인 고음 파워' }
    ];
    const FEMALE_RANGES = [
        { value: 'low alto, A3~A4', label: '저음 (A3~A4)', title: '깊고 풍부한 여성 저음' },
        { value: 'mid mezzo, C4~C5', label: '중저음 (C4~C5)', title: '따뜻하고 감성적인 중저음' },
        { value: 'mezzo soprano, E4~E5', label: '중음 (E4~E5)', title: '밝고 선명한 중음역' },
        { value: 'high soprano, G4~G5', label: '중고음 (G4~G5)', title: '투명하고 아름다운 중고음' },
        { value: 'power soprano, C5~C6', label: '고음 (C5~C6)', title: '전율을 주는 초고음' }
    ];
    const VOCAL_STYLE_OPTIONS = [
        { value: 'chest-voice', label: '자연스러운 목소리' },
        { value: 'head-voice', label: '맑은 고음' },
        { value: 'falsetto', label: '가성' },
        { value: 'belting', label: '파워 고음' },
        { value: 'vibrato', label: '목소리 떨림' },
        { value: 'breathy', label: '숨소리 섞인' },
        { value: 'grit', label: '허스키한' },
        { value: 'whisper', label: '속삭임' },
        { value: 'rap', label: '랩' },
        { value: 'autotune', label: '오토튠' }
    ];

    // 1) 보컬 선택 (성별)
    document.querySelectorAll('#vocalTypeOptions .vocal-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#vocalTypeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            const val = btn.dataset.value;
            selections.vocalGender = [val];

            const ageGroup = document.getElementById('vocalAgeGroup');
            const rangeGroup = document.getElementById('vocalRangeGroup');
            const styleGroup = document.getElementById('vocalStyleGroup');

            if (val === 'instrumental') {
                ageGroup.style.display = 'none';
                rangeGroup.style.display = 'none';
                styleGroup.style.display = 'none';
                selections.vocalAge = '';
                selections.vocalRange = [];
                selections.vocalStyle = [];
            } else {
                ageGroup.style.display = '';
                document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
                rangeGroup.style.display = 'none';
                styleGroup.style.display = 'none';
                selections.vocalAge = '';
                selections.vocalRange = [];
                selections.vocalStyle = [];
            }
        });
    });

    // 2) 보컬 연령대
    document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#vocalAgeOptions .vocal-option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selections.vocalAge = btn.dataset.value;

            const gender = selections.vocalGender[0] || '';
            const isMale = gender === 'male vocals';
            const isFemale = gender === 'female vocals';
            const ranges = isMale ? MALE_RANGES : (isFemale ? FEMALE_RANGES : [...MALE_RANGES, ...FEMALE_RANGES]);

            const rangeContainer = document.getElementById('vocalRangeOptions');
            rangeContainer.innerHTML = '';
            ranges.forEach(r => {
                const b = document.createElement('button');
                b.className = 'vocal-option-btn';
                b.dataset.value = r.value;
                b.title = r.title;
                b.textContent = r.label;
                b.addEventListener('click', () => {
                    rangeContainer.querySelectorAll('.vocal-option-btn').forEach(x => x.classList.remove('selected'));
                    b.classList.add('selected');
                    selections.vocalRange = [r.value];
                    showVocalStyles();
                });
                rangeContainer.appendChild(b);
            });

            document.getElementById('vocalRangeGroup').style.display = '';
            document.getElementById('vocalStyleGroup').style.display = 'none';
            selections.vocalRange = [];
            selections.vocalStyle = [];
        });
    });

    // 4) 보컬 스타일 — 장르 기반 자동 추천 + 추가 선택
    function showVocalStyles() {
        const container = document.getElementById('vocalStyleTags');
        container.innerHTML = '';

        const recommended = new Set();
        if (typeof VOCAL_ENHANCEMENT_MAP !== 'undefined' && selections.genres.length) {
            selections.genres.forEach(genre => {
                const dbEntry = GENRE_DATABASE.find(g => g.genre === genre);
                if (dbEntry) {
                    const cat = (dbEntry.main || '').toLowerCase();
                    for (const [key, val] of Object.entries(VOCAL_ENHANCEMENT_MAP)) {
                        if (cat.includes(key) || key.includes(cat)) {
                            const parts = val.split(',').map(s => s.trim().toLowerCase());
                            parts.forEach(p => {
                                VOCAL_STYLE_OPTIONS.forEach(opt => {
                                    if (p.includes(opt.value) || p.includes(opt.label)) recommended.add(opt.value);
                                });
                            });
                        }
                    }
                }
            });
        }
        if (recommended.size === 0) { recommended.add('breathy'); recommended.add('vibrato'); }

        VOCAL_STYLE_OPTIONS.forEach(opt => {
            const tag = document.createElement('button');
            tag.className = 'vocal-style-tag';
            if (recommended.has(opt.value)) tag.classList.add('selected', 'recommended');
            tag.dataset.value = opt.value;
            tag.textContent = opt.label + (recommended.has(opt.value) ? ' \u2605' : '');
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
                selections.vocalStyle = Array.from(container.querySelectorAll('.vocal-style-tag.selected')).map(b => b.dataset.value);
            });
            container.appendChild(tag);
        });

        selections.vocalStyle = Array.from(recommended);
        document.getElementById('vocalStyleGroup').style.display = '';
    }

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
                tag.className = 'selected-genre-tag ' + (idx === 0 ? 'main-tag' : 'sub-tag');
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
    const chordTrigger = document.getElementById('chordTrigger');
    const chordFilter = document.getElementById('chordFilter');
    const chordDropdownEl = document.getElementById('chordDropdown');
    const chordDisplay = document.getElementById('chordDisplay');
    let chordOpen = false;

    function updateChordDropdown() {
        if (selections.genres.length === 0) {
            chordTrigger.textContent = '장르를 먼저 선택하면 코드 진행이 표시됩니다 \u25BC';
            chordDisplay.innerHTML = '';
            selections.chordProgression = '';
            return;
        }
        if (!selections.chordProgression) {
            chordTrigger.textContent = '클릭하여 코드 진행 선택 \u25BC';
        }
    }

    function getChordCategories() {
        const categories = new Set();
        selections.genres.forEach(genre => {
            if (GENRE_TO_CHORD_CATEGORY[genre]) {
                categories.add(GENRE_TO_CHORD_CATEGORY[genre]);
            } else {
                const dbEntry = GENRE_DATABASE.find(g => g.genre === genre);
                if (dbEntry && dbEntry.main) {
                    const mainLower = dbEntry.main.toLowerCase();
                    for (const [key, cat] of Object.entries(GENRE_TO_CHORD_CATEGORY)) {
                        if (key.toLowerCase() === mainLower) { categories.add(cat); break; }
                    }
                }
            }
        });
        if (categories.size === 0) categories.add('pop');
        return categories;
    }

    function renderChordDropdown(query) {
        chordDropdownEl.innerHTML = '';
        const q = (query || '').toLowerCase();
        const categories = getChordCategories();

        categories.forEach(cat => {
            const data = MONEY_CHORD_PROGRESSIONS[cat];
            if (!data) return;

            const filtered = q ? data.chords.filter(c =>
                c.name.toLowerCase().includes(q) || c.value.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
            ) : data.chords;
            if (filtered.length === 0) return;

            const header = document.createElement('div');
            header.className = 'genre-dropdown-header';
            header.textContent = data.label;
            chordDropdownEl.appendChild(header);

            filtered.forEach(chord => {
                const item = document.createElement('div');
                item.className = 'genre-dropdown-item';
                if (selections.chordProgression === chord.value) item.classList.add('selected');
                item.innerHTML = '<strong>' + chord.name + '</strong> <span class="genre-dd-main">' + chord.value + '</span>';
                item.title = chord.desc;
                item.addEventListener('click', () => {
                    selections.chordProgression = chord.value;
                    chordTrigger.textContent = chord.name + ': ' + chord.value + ' \u2714';
                    chordDisplay.innerHTML = '<div class="chord-info"><strong>' + chord.name + '</strong><br><span class="chord-value">' + chord.value + '</span><br><span class="chord-desc">' + chord.desc + '</span></div>';
                    closeChord();
                });
                chordDropdownEl.appendChild(item);
            });
        });
    }

    function openChord() {
        if (selections.genres.length === 0) return;
        chordOpen = true;
        chordTrigger.classList.add('open');
        chordFilter.style.display = 'block';
        chordFilter.value = '';
        chordFilter.focus();
        renderChordDropdown('');
        chordDropdownEl.classList.add('active');
    }
    function closeChord() {
        chordOpen = false;
        chordTrigger.classList.remove('open');
        chordFilter.style.display = 'none';
        chordDropdownEl.classList.remove('active');
    }

    chordTrigger.addEventListener('click', () => { chordOpen ? closeChord() : openChord(); });
    chordFilter.addEventListener('input', () => renderChordDropdown(chordFilter.value));
    document.addEventListener('click', (e) => {
        if (chordOpen && !chordTrigger.contains(e.target) && !chordFilter.contains(e.target) && !chordDropdownEl.contains(e.target)) closeChord();
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

        // === 보컬 자동 감지 (순차 선택 구조) ===
        const vgKw = {
            'male vocals': ['남성','남자','male','형','오빠'],
            'female vocals': ['여성','여자','female','누나','언니'],
            'duet vocals': ['듀엣','듀오','duet'],
            'instrumental': ['연주','무보컬','bgm','배경음악','instrumental','no vocal']
        };
        let detectedVocal = '';
        for (const [val, kws] of Object.entries(vgKw)) {
            if (kws.some(kw => text.includes(kw))) { detectedVocal = val; break; }
        }
        if (detectedVocal) {
            const btn = document.querySelector('#vocalTypeOptions [data-value="' + detectedVocal + '"]');
            if (btn) btn.click();
        }

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
        // 한글 장르명도 항상 감지 (영어와 병행)
        for (const [kor, eng] of Object.entries(korGenreMap)) {
            if (text.includes(kor) && !detected.includes(eng)) detected.push(eng);
        }
        // 감지된 장르 추가
        detected.forEach(g => {
            if (window._proAddGenre) window._proAddGenre(g);
        });

        // === 기본값 ===
        if (!selections.mood.length) autoActivate('moodBtns', 'mood', 'feel-good');
        if (!selections.vocalGender.length) {
            const femaleBtn = document.querySelector('#vocalTypeOptions [data-value="female vocals"]');
            if (femaleBtn) femaleBtn.click();
        }
        if (!selections.instruments.length) {
            autoActivate('instrumentBtns', 'instruments', 'piano');
            autoActivate('instrumentBtns', 'instruments', 'drums');
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

    // ============================================
    // 프롬프트 업그레이드 — 기존 프롬프트 파싱 → v5 재구성
    // ============================================
    function upgradeExistingPrompt(originalPrompt) {
        const text = originalPrompt.toLowerCase();
        const parsed = { genres: [], bpm: '', key: '', timeSig: '', mood: '', instruments: [], vocal: [], production: [] };

        // 장르 감지
        const sortedG = [...GENRE_DATABASE].sort((a, b) => b.genre.length - a.genre.length);
        sortedG.forEach(g => {
            if (text.includes(g.genre.toLowerCase()) && !parsed.genres.includes(g.genre)) parsed.genres.push(g.genre);
        });

        // BPM 감지
        const bpmM = text.match(/(\d{2,3})\s*bpm/i);
        if (bpmM) parsed.bpm = bpmM[1] + ' BPM';

        // 조성 감지
        const keyM = originalPrompt.match(/([A-G][b#]?)\s*(major|minor)/i);
        if (keyM) parsed.key = keyM[0];

        // 박자 감지
        const tsM = text.match(/([2-7]\/[4-8])/);
        if (tsM) parsed.timeSig = tsM[1] + ' time';

        // 악기 감지
        const instrWords = ['piano','guitar','bass','drums','synth','synthesizer','strings','brass','saxophone','violin','cello','organ','808','percussion','orchestra','flute','harmonica','ukulele','trumpet','harp','rhodes','choir'];
        instrWords.forEach(w => { if (text.includes(w)) parsed.instruments.push(w); });

        // 보컬 감지
        const vocalWords = ['male vocal','female vocal','male and female','duet','group vocal','baritone','tenor','soprano','alto','mezzo','breathy','belting','falsetto','grit','raspy','whisper','rap','chest voice','vibrato','auto-tuned','autotune'];
        vocalWords.forEach(w => { if (text.includes(w)) parsed.vocal.push(w); });

        // 프로덕션 감지
        const prodWords = ['reverb','delay','tape','analog','vinyl','lo-fi','stereo','sidechain','warm','crisp','clean','compressed'];
        prodWords.forEach(w => { if (text.includes(w)) parsed.production.push(w); });

        // 감정/분위기 감지 (원본에서 추출)
        const moodWords = ['warm','dark','bright','melancholic','upbeat','chill','energetic','dreamy','nostalgic','emotional','groovy','soulful','haunting','ethereal','aggressive','gentle','intimate','epic'];
        const detectedMoods = moodWords.filter(w => text.includes(w));

        // === v5 8단계 구조로 재조립 ===
        const parts = [];

        // ① 장르 (프론트로드)
        if (parsed.genres.length) parts.push(parsed.genres.slice(0, 3).join(', '));
        else parts.push('Pop');

        // ② BPM + 조성 + 박자
        const techParts = [];
        if (parsed.bpm) techParts.push(parsed.bpm);
        if (parsed.key) techParts.push(parsed.key);
        if (parsed.timeSig) techParts.push(parsed.timeSig);
        if (techParts.length) parts.push(techParts.join(', '));

        // ③ 감정 서술형 문장
        if (detectedMoods.length) {
            const moodKey = detectedMoods[0];
            const sentence = (typeof MOOD_SENTENCE_MAP !== 'undefined' && MOOD_SENTENCE_MAP[moodKey])
                ? MOOD_SENTENCE_MAP[moodKey]
                : 'like a perfect moment captured in sound';
            parts.push(sentence);
        }

        // ④ 악기
        if (parsed.instruments.length) parts.push(parsed.instruments.slice(0, 4).join(', '));

        // ⑤ 보컬
        if (parsed.vocal.length) parts.push(parsed.vocal.slice(0, 4).join(', '));

        // ⑥ 빌보드 구조 요소
        if (typeof BILLBOARD_ELEMENTS !== 'undefined') {
            const hook = BILLBOARD_ELEMENTS.hook[Math.floor(Math.random() * BILLBOARD_ELEMENTS.hook.length)];
            const rhythm = BILLBOARD_ELEMENTS.rhythm[Math.floor(Math.random() * BILLBOARD_ELEMENTS.rhythm.length)];
            parts.push(hook + ', ' + rhythm);
        }

        // ⑦ 프로덕션
        if (parsed.production.length) parts.push(parsed.production.slice(0, 3).join(', '));

        // ⑧ 품질 보호 블록
        parts.push('professional studio quality, clean and polished production, radio-ready sound');

        let upgraded = parts.join(', ');
        if (upgraded.length > 950) upgraded = upgraded.substring(0, 947) + '...';

        return { upgraded, parsed };
    }

    // ============================================
    // buildFinalPrompt — Step 3 최종 프롬프트 생성
    // ============================================
    let generatedExcludeBase = '';
    let userExcludeTags = [];

    function buildFinalPrompt() {
        // === 업그레이드 모드 ===
        if (isUpgradeMode && selections.upgradeText) {
            const { upgraded, parsed } = upgradeExistingPrompt(selections.upgradeText);

            document.getElementById('stylePromptText').value = upgraded;

            // 한국어 설명
            let explanation = '\u25B6 모드: 프롬프트 업그레이드\n';
            explanation += '\u25B6 원본: ' + selections.upgradeText.substring(0, 100) + (selections.upgradeText.length > 100 ? '...' : '') + '\n';
            explanation += '\u25B6 감지된 장르: ' + (parsed.genres.length ? parsed.genres.join(', ') : '자동 추정') + '\n';
            explanation += '\u25B6 글자수: ' + upgraded.length + ' / 950자';
            document.getElementById('promptExplanation').textContent = explanation;

            // Exclude / More Options
            const genres = parsed.genres.length ? parsed.genres : ['Pop'];
            finishPromptGeneration(upgraded, genres);
            return;
        }

        // === 새로 만들기 모드 ===
        const genres = selections.genres.length ? selections.genres : ['Pop'];
        const mainG = genres[0];
        const mainData = GENRE_DATABASE.find(g => g.genre === mainG) || { genre: mainG, bpm: '100-120', instruments: '', vocal: '', desc: '', main: '', sub: '', mood: [] };

        // 서술형 분위기 문장
        const moodSentences = selections.mood.slice(0, 2).map(m => MOOD_SENTENCE_MAP[m]).filter(Boolean);

        // 보컬 조합 (커스텀 보컬 우선 → 4단계 순차 선택 결과)
        const vocalParts = [];
        if (selections.customVocal) {
            vocalParts.push(selections.customVocal);
        } else {
            // 성별
            selections.vocalGender.forEach(v => vocalParts.push(v));
            // 연령대
            if (selections.vocalAge) vocalParts.push(selections.vocalAge);
            // 음역대
            selections.vocalRange.forEach(v => vocalParts.push(vocalRangeMap[v] || v));
            // 스타일
            selections.vocalStyle.forEach(v => vocalParts.push(vocalStyleMap[v] || v));
        }

        const instrParts = selections.instruments.map(i => instrumentMap[i] || i);

        // === v5 8단계 구조 ===
        const promptParts = [];

        // ① 장르 (프론트로드, 무제한)
        promptParts.push(genres.join(', '));

        // ② BPM + 조성 + 박자 (조성이 없으면 분위기 기반 기본값)
        let techLine = selections.bpm + ' BPM';
        let keyValue = selections.key.length ? selections.key[0] : '';
        if (!keyValue) {
            const m = selections.mood || [];
            if (m.some(v => ['emotional','lonely','breakup','sentimental'].includes(v))) keyValue = 'A minor';
            else if (m.some(v => ['exciting','feel-good','confidence'].includes(v))) keyValue = 'G major';
            else if (m.some(v => ['dreamy','nostalgic','sunset'].includes(v))) keyValue = 'D minor';
            else if (m.some(v => ['powerful','tension-up'].includes(v))) keyValue = 'E minor';
            else if (m.some(v => ['calm','healing','comfortable','warm','cozy'].includes(v))) keyValue = 'C major';
            else keyValue = 'C major';
        }
        techLine += ', ' + keyValue;
        if (selections.timeSig.length) techLine += ', ' + selections.timeSig[0] + ' time';
        promptParts.push(techLine);

        // 머니코드 진행 (선택된 경우)
        if (selections.chordProgression) {
            promptParts.push('chord progression: ' + selections.chordProgression);
        }

        // ③ 감정 서술형 문장
        if (moodSentences[0]) promptParts.push(moodSentences[0]);

        // ④ 악기
        if (instrParts.length) promptParts.push(instrParts.slice(0, 4).join(', '));

        // ⑤ 보컬 4요소
        if (vocalParts.length) promptParts.push(vocalParts.slice(0, 4).join(', '));

        // ⑥ 프로덕션 노트
        if (selections.production.length) promptParts.push(selections.production.slice(0, 3).join(', '));

        // ⑦ 두 번째 분위기 (공간 있으면)
        if (moodSentences[1]) promptParts.push(moodSentences[1]);

        // ⑧ 품질 보호 블록
        promptParts.push('professional studio quality, clean and polished production, radio-ready sound');

        // 950자 제한
        let sp = promptParts.join(', ');
        if (sp.length > 950) {
            const coreParts = [genres.join(', '), techLine];
            if (selections.chordProgression) coreParts.push('chord progression: ' + selections.chordProgression);
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
        let explanation = '\u25B6 장르: ' + genres.join(' + ');
        if (mainData.desc) explanation += '\n\u25B6 설명: ' + mainData.desc;
        explanation += '\n\u25B6 분위기: ' + moodKor.join(', ');
        explanation += '\n\u25B6 템포: ' + selections.bpm + ' BPM';
        if (selections.key.length) explanation += ' | 조성: ' + selections.key[0];
        if (selections.timeSig.length) explanation += ' | 박자: ' + selections.timeSig[0];
        if (selections.chordProgression) explanation += '\n\u25B6 코드 진행: ' + selections.chordProgression;
        if (selections.customVocal) explanation += '\n\u25B6 보컬 (직접입력): ' + selections.customVocal;
        if (selections.production.length) explanation += '\n\u25B6 프로덕션: ' + selections.production.join(', ');
        document.getElementById('promptExplanation').textContent = explanation;

        // Style Prompt 한국어 번역
        let korHtml = '\uD83D\uDCCC <strong>한국어 번역:</strong><br>';
        korHtml += '\u2022 장르: ' + genres.join(' + ') + '<br>';
        korHtml += '\u2022 템포: ' + selections.bpm + ' BPM';
        if (selections.key.length) korHtml += ' | 조성: ' + selections.key[0];
        if (selections.timeSig.length) korHtml += ' | 박자: ' + selections.timeSig[0];
        korHtml += '<br>';
        if (selections.chordProgression) korHtml += '\u2022 코드 진행: ' + selections.chordProgression + '<br>';
        korHtml += '\u2022 분위기: ' + moodKor.join(', ') + '<br>';
        if (instrParts.length) korHtml += '\u2022 악기: ' + instrParts.join(', ') + '<br>';
        if (vocalParts.length) korHtml += '\u2022 보컬: ' + vocalParts.join(', ') + '<br>';
        if (selections.production.length) korHtml += '\u2022 프로덕션: ' + selections.production.join(', ') + '<br>';
        korHtml += '\u2022 품질: 프로페셔널 스튜디오 품질, 라디오 방송 수준';
        document.getElementById('stylePromptKor').innerHTML = korHtml;

        finishPromptGeneration(sp, genres);
    }

    // === 공통 마무리: Exclude + Simple + More Options ===
    function finishPromptGeneration(stylePrompt, genres) {
        // Exclude Styles (genre-data.js의 generatePrompt 활용)
        const result = generatePrompt(genres, [], [], selections.mood);
        generatedExcludeBase = result.excludeStyles;
        userExcludeTags = [];
        document.getElementById('excludeStylesText').value = result.excludeStyles;
        document.getElementById('excludeStylesKor').innerHTML = buildExcludeKorDesc(result.excludeStyles);

        // Simple Prompt
        const mainG = genres[0];
        const mainData = GENRE_DATABASE.find(g => g.genre === mainG) || { genre: mainG, main: '', sub: '' };
        const subData = genres[1] ? (GENRE_DATABASE.find(g => g.genre === genres[1]) || null) : null;
        if (typeof generateSimplePrompt === 'function') {
            const simple = generateSimplePrompt(stylePrompt, mainData, subData, selections.mood, selections.bpm, selections.key[0] || '');
            document.getElementById('simplePromptText').value = simple;
            document.getElementById('simplePromptKor').innerHTML = '\uD83D\uDCCC Suno Simple 모드에 바로 붙여넣기 가능한 축약 버전입니다.';
        }

        // More Options
        const moreOpt = getMoreOptions(mainData, subData, selections.mood, stylePrompt);
        document.getElementById('weirdnessFill').style.width = moreOpt.weirdness + '%';
        document.getElementById('weirdnessValue').textContent = moreOpt.weirdness + '%';
        document.getElementById('styleInfluenceFill').style.width = moreOpt.styleInfluence + '%';
        document.getElementById('styleInfluenceValue').textContent = moreOpt.styleInfluence + '%';

        // 보컬 타입 배지
        const badge = document.getElementById('vocalTypeBadge');
        if (badge) {
            if (selections.vocalGender.includes('instrumental')) badge.textContent = 'Instrumental';
            else if (selections.vocalGender.length) badge.textContent = vocalGenderMap[selections.vocalGender[0]] || '';
            else badge.textContent = '';
        }

        initExcludeToggles();

        // v5 검증은 섹션 6에서 구현 — 여기서는 호출만 준비
        if (typeof validateV5Prompt === 'function') {
            runV5Validation(stylePrompt);
        }

        autoSaveToLibrary(stylePrompt, result, moreOpt);
    }

    // ============================================
    // v5 검증 + 자동수정 + 점수 렌더링
    // ============================================
    function runV5Validation(prompt) {
        const maxIterations = 3;
        let finalPrompt = prompt;
        let score = 0;
        let checks = [];

        for (let i = 0; i < maxIterations; i++) {
            const validation = validateV5Prompt(finalPrompt);
            score = validation.score;
            checks = validation.checks;
            if (score >= 90) break;
            finalPrompt = autoFixPrompt(finalPrompt, validation.checks);
        }

        // 최종 프롬프트 반영
        document.getElementById('stylePromptText').value = finalPrompt;
        renderV5Score(score, checks);

        // 글자수 업데이트
        const expEl = document.getElementById('promptExplanation');
        expEl.textContent += '\n\u25B6 글자수: ' + finalPrompt.length + ' / 950자 | v5 인식률: ' + score + '%';
    }

    function validateV5Prompt(prompt) {
        const checks = [];
        let passed = 0;
        const total = 10;

        // 1. 장르 1개 이상
        const genreCount = selections.genres.length || 1;
        const c1 = genreCount >= 1;
        checks.push({ name: '장르 포함', pass: c1, detail: c1 ? genreCount + '개 적용' : '장르 없음' });
        if (c1) passed++;

        // 2. BPM 명시
        const c2 = /\d+\s*BPM/i.test(prompt);
        checks.push({ name: 'BPM 명시', pass: c2, detail: c2 ? '\u2713' : 'BPM 없음' });
        if (c2) passed++;

        // 3. 조성 명시
        const c3 = /[A-G][b#]?\s*(major|minor)/i.test(prompt);
        checks.push({ name: '조성(Key) 명시', pass: c3, detail: c3 ? '\u2713' : '조성 없음' });
        if (c3) passed++;

        // 4. 감정 서술형 문장
        const c4 = prompt.length > 80 && /like |as if |the |a |an |with /i.test(prompt);
        checks.push({ name: '감정 서술형 문장', pass: c4, detail: c4 ? '\u2713' : '단어 나열 방식' });
        if (c4) passed++;

        // 5. 악기 2~6개
        const instrDetect = ['piano','guitar','bass','drums','synth','strings','brass','saxophone','violin','cello','organ','percussion','orchestra','808','flute','harmonica','ukulele'];
        const instrCount = instrDetect.filter(w => prompt.toLowerCase().includes(w)).length;
        const c5 = instrCount >= 2 && instrCount <= 6;
        checks.push({ name: '악기 2~6개', pass: c5, detail: instrCount + '개 감지' });
        if (c5) passed++;

        // 6. 보컬 요소 포함
        const vocalDetect = ['male','female','vocal','baritone','tenor','soprano','alto','mezzo','breathy','belting','falsetto','grit','whisper','rap','chest voice','instrumental'];
        const vocalCount = vocalDetect.filter(w => prompt.toLowerCase().includes(w)).length;
        const c6 = vocalCount >= 2;
        checks.push({ name: '보컬 요소 포함', pass: c6, detail: vocalCount + '개 감지' });
        if (c6) passed++;

        // 7. 상충 태그 없음
        const hasConflict = (prompt.includes('sad') && prompt.includes('upbeat')) ||
                           (prompt.includes('sleepy') && prompt.includes('energetic')) ||
                           (prompt.includes('calm') && prompt.includes('aggressive'));
        const c7 = !hasConflict;
        checks.push({ name: '상충 태그 없음', pass: c7, detail: c7 ? '\u2713' : '충돌 발견' });
        if (c7) passed++;

        // 8. 품질 보호 블록
        const c8 = prompt.toLowerCase().includes('professional studio') || prompt.toLowerCase().includes('radio-ready');
        checks.push({ name: '품질 보호 블록', pass: c8, detail: c8 ? '\u2713' : '품질 보호 없음' });
        if (c8) passed++;

        // 9. 950자 이하
        const c9 = prompt.length <= 950;
        checks.push({ name: '950자 이하', pass: c9, detail: prompt.length + '자' });
        if (c9) passed++;

        // 10. 프론트로드 (장르가 앞에)
        const firstPart = prompt.split(',')[0].trim();
        const c10 = GENRE_DATABASE.some(g => firstPart.includes(g.genre)) || firstPart.length > 3;
        checks.push({ name: '장르 프론트로드', pass: c10, detail: c10 ? '\u2713' : '장르가 앞에 없음' });
        if (c10) passed++;

        return { score: Math.round((passed / total) * 100), checks };
    }

    function autoFixPrompt(prompt, checks) {
        let fixed = prompt;

        checks.forEach(c => {
            if (c.pass) return;

            if (c.name.includes('BPM')) {
                fixed = fixed.replace(/^([^,]+)/, '$1, ' + (selections.bpm || 110) + ' BPM');
            }
            if (c.name.includes('조성') && !c.pass) {
                let autoKey = selections.key.length ? selections.key[0] : 'C major';
                if (!selections.key.length) {
                    const m = selections.mood || [];
                    if (m.some(v => ['emotional','lonely','breakup','sentimental'].includes(v))) autoKey = 'A minor';
                    else if (m.some(v => ['exciting','feel-good','confidence'].includes(v))) autoKey = 'G major';
                    else if (m.some(v => ['dreamy','nostalgic','sunset'].includes(v))) autoKey = 'D minor';
                    else if (m.some(v => ['powerful','tension-up'].includes(v))) autoKey = 'E minor';
                }
                fixed = fixed.replace(/BPM/, 'BPM, ' + autoKey);
            }
            if (c.name.includes('감정')) {
                const mood = selections.mood[0] || 'feel-good';
                const sentence = MOOD_SENTENCE_MAP[mood] || 'like a perfect moment captured in sound';
                fixed = fixed.replace(/BPM([^,]*)/, 'BPM$1, ' + sentence);
            }
            if (c.name.includes('보컬')) {
                const hasV = /vocal|baritone|soprano|tenor|breathy|belting/i.test(fixed);
                if (!hasV) {
                    const userV = [];
                    if (selections.customVocal) {
                        userV.push(selections.customVocal);
                    } else {
                        if (selections.vocalGender.length) userV.push(vocalGenderMap[selections.vocalGender[0]] || 'female vocals');
                        if (selections.vocalRange.length) userV.push(vocalRangeMap[selections.vocalRange[0]] || 'mezzo-soprano');
                        if (selections.vocalStyle.length) userV.push(vocalStyleMap[selections.vocalStyle[0]] || 'breathy');
                    }
                    if (userV.length === 0) userV.push('female vocals', 'mezzo-soprano', 'breathy');
                    fixed = fixed.replace(', professional', ', ' + userV.join(', ') + ', professional');
                }
            }
            if (c.name.includes('품질')) {
                fixed += ', professional studio quality, clean production, radio-ready sound';
            }
            if (c.name.includes('950')) {
                const cut = fixed.lastIndexOf(', ', 947);
                fixed = fixed.substring(0, cut > 0 ? cut : 947);
                if (!fixed.includes('radio-ready')) fixed += ', radio-ready sound';
            }
        });

        return fixed;
    }

    function renderV5Score(score, checks) {
        document.getElementById('v5ScoreValue').textContent = score + '%';

        const fill = document.getElementById('v5ScoreFill');
        fill.style.width = score + '%';
        fill.style.background = score >= 90 ? 'linear-gradient(90deg, #00B894, #55EFC4)' :
                                score >= 70 ? 'linear-gradient(90deg, #FDCB6E, #F39C12)' :
                                'linear-gradient(90deg, #FF6B6B, #E17055)';

        const checklist = document.getElementById('v5Checklist');
        checklist.innerHTML = checks.map(c =>
            '<div class="v5-check-item ' + (c.pass ? 'v5-check-pass' : 'v5-check-fail') + '">' +
            (c.pass ? '\u2705' : '\u274C') + ' ' + c.name + ' <span style="opacity:0.7">(' + c.detail + ')</span></div>'
        ).join('');
    }
    // ============================================
    // Exclude 토글
    // ============================================
    const excludeEngToKor = {
        'metal': '메탈', 'hardcore': '하드코어', 'screamo': '스크리모', 'thrash': '스래쉬',
        'deathcore': '데스코어', 'industrial': '인더스트리얼', 'aggressive': '공격적인',
        'distorted': '왜곡된', 'screaming': '비명', 'harsh noise': '거친 노이즈',
        'heavy metal': '헤비메탈', 'ambient': '앰비언트', 'meditation': '명상',
        'lullaby': '자장가', 'drone': '드론', 'spa': '스파', 'sleepy': '졸린',
        'intro': '인트로', 'reverb': '리버브', 'distortion': '디스토션', 'noise': '노이즈',
        'echo': '에코', 'choir': '합창', 'sound effects': '효과음',
        'four-on-the-floor kick': '4비트 킥', 'fade in': '페이드인', 'falsetto': '극단고음'
    };

    function buildExcludeKorDesc(text) {
        if (!text) return '';
        const parts = text.split(', ').filter(Boolean);
        const kor = parts.map(eng => {
            const k = Object.keys(excludeEngToKor).find(key => eng.toLowerCase().includes(key));
            return k ? excludeEngToKor[k] + '(' + eng + ')' : eng;
        });
        return '\uD83D\uDCCC <strong>한국어 번역:</strong> ' + kor.join(', ') + ' \u2014 이 스타일들을 제외하면 AI가 더 정확한 음악을 만들어줍니다.';
    }

    let excludeInit = false;
    function initExcludeToggles() {
        if (excludeInit) return;
        excludeInit = true;

        document.querySelectorAll('.exclude-tag-btn').forEach(btn => {
            const v = btn.dataset.value;
            if (generatedExcludeBase) {
                const baseParts = generatedExcludeBase.split(', ').map(p => p.trim().toLowerCase());
                if (baseParts.includes(v.toLowerCase())) btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                if (btn.classList.contains('active')) {
                    if (!userExcludeTags.includes(v)) userExcludeTags.push(v);
                } else {
                    userExcludeTags = userExcludeTags.filter(t => t !== v);
                    if (generatedExcludeBase) {
                        const bp = generatedExcludeBase.split(', ').filter(Boolean);
                        generatedExcludeBase = bp.filter(p => p.toLowerCase() !== v.toLowerCase()).join(', ');
                    }
                }
                updateExclude();
            });
            if (btn.dataset.kor) btn.title = btn.dataset.kor;
        });

        document.getElementById('btnAddExclude').addEventListener('click', () => addExcl());
        document.getElementById('excludeCustomInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') addExcl(); });
    }

    function addExcl() {
        const input = document.getElementById('excludeCustomInput');
        const v = input.value.trim().toLowerCase();
        if (!v || userExcludeTags.includes(v)) { input.value = ''; return; }
        userExcludeTags.push(v);
        const grid = document.querySelector('.exclude-btn-grid');
        const btn = document.createElement('button');
        btn.className = 'exclude-tag-btn active';
        btn.dataset.value = v;
        btn.textContent = v;
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            if (btn.classList.contains('active')) { if (!userExcludeTags.includes(v)) userExcludeTags.push(v); }
            else userExcludeTags = userExcludeTags.filter(t => t !== v);
            updateExclude();
        });
        grid.appendChild(btn);
        input.value = '';
        updateExclude();
    }

    function updateExclude() {
        const base = generatedExcludeBase ? generatedExcludeBase.split(', ').filter(Boolean) : [];
        const full = [...new Set([...base, ...userExcludeTags])].join(', ');
        document.getElementById('excludeStylesText').value = full;
        document.getElementById('excludeStylesKor').innerHTML = buildExcludeKorDesc(full);
    }

    // ============================================
    // 복사 / 저장 / 적용 / 홈
    // ============================================

    // 개별 복사
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const el = document.getElementById(btn.dataset.target);
            const text = el.value !== undefined ? el.value : el.textContent;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '\u2713 복사됨!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = '복사하기'; btn.classList.remove('copied'); }, 2000);
            });
        });
    });

    // 전체 복사
    document.getElementById('btnCopyAll').addEventListener('click', () => {
        const s = document.getElementById('stylePromptText').value;
        const e = document.getElementById('excludeStylesText').value;
        const w = document.getElementById('weirdnessValue').textContent;
        const si = document.getElementById('styleInfluenceValue').textContent;
        navigator.clipboard.writeText('[Style Prompt]\n' + s + '\n\n[Exclude Styles]\n' + e + '\n\n[More Options]\nWeirdness: ' + w + '\nStyle Influence: ' + si);
        const b = document.getElementById('btnCopyAll');
        b.innerHTML = '<span>\u2713</span> 복사완료!';
        setTimeout(() => { b.innerHTML = '<span>\uD83D\uDCCB</span> 전체 복사'; }, 2000);
    });

    // 전체 저장
    document.getElementById('btnSaveAll').addEventListener('click', () => {
        const s = document.getElementById('stylePromptText').value;
        const e = document.getElementById('excludeStylesText').value;
        const w = document.getElementById('weirdnessValue').textContent;
        const si = document.getElementById('styleInfluenceValue').textContent;
        const exp = document.getElementById('promptExplanation').textContent;
        const now = new Date();
        const d = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + '_' + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');

        const content = '========================================\n'
            + 'SUNO MASTER PRO 12 - 전문가 모드\n'
            + '생성일시: ' + now.toLocaleString('ko-KR') + '\n'
            + '========================================\n\n'
            + '[한국어 설명]\n' + exp + '\n\n'
            + '========================================\n'
            + '[Style Prompt]\n' + s + '\n\n'
            + '========================================\n'
            + '[Exclude Styles]\n' + e + '\n\n'
            + '========================================\n'
            + '[More Options]\nWeirdness: ' + w + '\nStyle Influence: ' + si + '\n\n'
            + '========================================\n'
            + '선택 정보:\n'
            + '- 모드: ' + (isUpgradeMode ? '프롬프트 업그레이드' : '새로 만들기') + '\n'
            + '- 분위기: ' + selections.mood.map(v => labelMap[v] || v).join(', ') + '\n'
            + '- 장르: ' + selections.genres.join(' + ') + '\n'
            + (selections.chordProgression ? '- 코드 진행: ' + selections.chordProgression + '\n' : '')
            + (selections.customVocal ? '- 보컬 (직접입력): ' + selections.customVocal + '\n' : '')
            + '========================================\n'
            + 'Generated by SUNO MASTER PRO 12\n';

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'SUNO_Pro_' + d + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        const btn = document.getElementById('btnSaveAll');
        btn.innerHTML = '<span>\u2713</span> 저장완료!';
        setTimeout(() => { btn.innerHTML = '<span>\uD83D\uDCBE</span> 전체 저장하기'; }, 2000);
    });

    // 적용하기
    document.getElementById('btnApply').addEventListener('click', () => {
        const style = document.getElementById('stylePromptText').value || '';
        const excludeStyles = document.getElementById('excludeStylesText').value || '';
        const weirdness = parseInt(document.getElementById('weirdnessValue').textContent) || null;
        const styleInfluence = parseInt(document.getElementById('styleInfluenceValue').textContent) || null;
        const explanation = document.getElementById('promptExplanation').textContent || '';
        if (!style.trim()) { alert('먼저 프롬프트를 생성해주세요.'); return; }

        const genreName = selections.genres.join(' + ') || '전문가 모드';
        const fileName = (importedPromptData && importedPromptData.fileName)
            || genreName + ' - 전문가 모드';

        const pipelineData = {
            stylePrompt: style, excludeStyles, weirdness, styleInfluence, explanation,
            genres: selections.genres.slice(),
            mood: selections.mood.slice(),
            chordProgression: selections.chordProgression,
            customVocal: selections.customVocal,
            createdAt: new Date().toISOString(), source: 'pro', fileName
        };
        localStorage.setItem('suno-pipeline-pro', JSON.stringify(pipelineData));

        const msgEl = document.getElementById('applyCompleteMsg');
        if (msgEl) {
            msgEl.textContent = '\u2705 스타일 프롬프트 적용 완료! 다음 단계에 반영됩니다.';
            msgEl.classList.add('visible');
        }

        const btnLyrics = document.getElementById('btnGotoLyrics');
        btnLyrics.disabled = false;
        btnLyrics.classList.add('active');
    });

    // 노래제목&가사 이동
    document.getElementById('btnGotoLyrics').addEventListener('click', () => { window.location.href = 'lyrics.html'; });

    // 메인으로
    document.getElementById('btnHome').addEventListener('click', () => { window.location.href = 'index.html'; });

    // ============================================
    // 자동 보관함 저장
    // ============================================
    function autoSaveToLibrary(sp, result, moreOpt) {
        const K = 'suno-master-library';
        let lib = [];
        try { lib = JSON.parse(localStorage.getItem(K)) || []; } catch (e) { lib = []; }
        lib.push({
            id: 'pro_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            createdAt: new Date().toISOString(),
            mood: selections.mood.map(v => labelMap[v] || v),
            genres: selections.genres.slice(),
            stylePrompt: sp,
            excludeStyles: result.excludeStyles,
            weirdness: moreOpt.weirdness,
            styleInfluence: moreOpt.styleInfluence,
            explanation: document.getElementById('promptExplanation').textContent,
            favorite: false, memo: ''
        });
        localStorage.setItem(K, JSON.stringify(lib));
    }

    // ============================================
    // 파일 불러오기
    // ============================================
    document.getElementById('fileImport').addEventListener('change', (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const c = ev.target.result;
            if (!c || !c.trim()) return;

            // SUNO MASTER PRO 저장 파일 형식 ([Style Prompt] 헤더 있음)
            const sm = c.match(/\[Style Prompt\]\s*\n([\s\S]*?)(?=\n={3,})/);
            let loadedText = '';

            if (sm) {
                loadedText = sm[1].trim();
                importedPromptData = { stylePrompt: loadedText, fileName: f.name.replace('.txt', '') };
                const em = c.match(/\[Exclude Styles\]\s*\n([\s\S]*?)(?=\n={3,})/);
                if (em) importedPromptData.excludeStyles = em[1].trim();
            } else {
                // 일반 텍스트 파일 — 내용 전체를 프롬프트로 사용
                loadedText = c.trim();
                importedPromptData = { stylePrompt: loadedText, fileName: f.name.replace('.txt', '') };
            }

            // 자유입력에 반영
            freeInput.value = loadedText;
            document.getElementById('charCount').textContent = freeInput.value.length + '자';
            btnAnalyze.disabled = false;

            document.getElementById('importBox').classList.add('success');
            document.getElementById('importBox').querySelector('.import-title').textContent = '\u2713 불러오기 완료!';
            const fnEl = document.getElementById('importFilename');
            if (fnEl) { fnEl.textContent = f.name; fnEl.style.display = ''; }
        };
        reader.readAsText(f, 'UTF-8');
        e.target.value = '';
    });

    // ============================================
    // UI 유틸: 다크모드 / 글자크기 / textarea 리사이즈
    // ============================================

    // 글자 크기
    const tsp = document.getElementById('textSizePopup');
    document.getElementById('btnTextSize').addEventListener('click', () => tsp.classList.add('active'));
    document.getElementById('closeTextSize').addEventListener('click', () => tsp.classList.remove('active'));
    tsp.addEventListener('click', (e) => { if (e.target === tsp) tsp.classList.remove('active'); });

    const sizeBtns = document.querySelectorAll('.size-btn');
    const savedSize = localStorage.getItem('suno-text-size') || 'medium';
    applySize(savedSize);
    sizeBtns.forEach(b => {
        b.addEventListener('click', () => {
            applySize(b.dataset.size);
            localStorage.setItem('suno-text-size', b.dataset.size);
            sizeBtns.forEach(x => x.classList.remove('active'));
            b.classList.add('active');
        });
    });
    function applySize(s) {
        document.body.classList.remove('text-small', 'text-large', 'text-xlarge');
        if (s !== 'medium') document.body.classList.add('text-' + s);
        sizeBtns.forEach(b => b.classList.toggle('active', b.dataset.size === s));
    }

    // 다크 모드
    const bd = document.getElementById('btnDarkMode');
    if (localStorage.getItem('suno-dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        bd.querySelector('.dark-mode-icon').textContent = '\u2600';
    }
    bd.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        bd.querySelector('.dark-mode-icon').textContent = isDark ? '\u2600' : '\u263E';
        localStorage.setItem('suno-dark-mode', isDark);
    });

    // ESC로 팝업 닫기
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') tsp.classList.remove('active'); });

    // textarea 자동 리사이즈
    function autoResizeAll() {
        document.querySelectorAll('textarea').forEach(ta => {
            ta.classList.add('auto-resize');
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 'px';
            ta.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        });
    }
    autoResizeAll();
    new MutationObserver(() => autoResizeAll()).observe(document.body, { childList: true, subtree: true });

    // 섹션 토글 (genre-data.js)
    if (typeof initSectionToggles === 'function') initSectionToggles();

}); // DOMContentLoaded 끝

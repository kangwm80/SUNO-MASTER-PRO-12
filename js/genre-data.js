// ============================================
// SUNO MASTER PRO 12 - 장르 데이터베이스
// SUNO_Genre_Classification_v4.pdf 기반
// 3-Tier: Main Genre > Sub Genre > Detail Genre
// + Age / Place / Mood 태그 (v4: 35 Mood · 28 Place · 63 Keywords)
// 17 Main · 60+ Sub · 170+ Detail Genres
// ============================================

const GENRE_DATABASE = [
    // ========== 01. POP (25 genres) ==========
    // -- Mainstream / Dance Pop --
    { genre: "Mainstream Pop", main: "Pop", sub: "Mainstream / Dance Pop", age: ["10대","20대","30대"], place: ["카페","드라이브","집","출퇴근","아침루틴"], mood: ["기분좋은","상쾌한","신나는"], bpm: "110-130", desc: "대중적이고 친숙한 멜로디의 팝 음악. 밝고 캐치한 훅이 특징입니다.", instruments: "modern synth leads, warm polysynths, tight electronic drums, clean deep bass", vocal: "airy vocals, intimate verses, soaring belted chorus, stacked harmonies" },
    { genre: "Dance Pop", main: "Pop", sub: "Mainstream / Dance Pop", age: ["10대","20대","30대"], place: ["클럽","헬스장","페스티벌","홈파티","청소할때"], mood: ["신나는","텐션업","파워풀한"], bpm: "118-132", desc: "춤추기 좋은 리듬감 있는 팝. 에너지 넘치는 비트가 특징입니다.", instruments: "punchy kick, synth bass, electronic drums, bright synth leads, claps", vocal: "powerful vocals, catchy hook, belted chorus, layered harmonies" },
    { genre: "Electro Pop", main: "Pop", sub: "Mainstream / Dance Pop", age: ["10대","20대"], place: ["클럽","페스티벌","헬스장"], mood: ["신나는","텐션업","파워풀한"], bpm: "120-135", desc: "전자음이 강조된 팝 음악. 신디사이저와 일렉트로닉 사운드가 특징입니다.", instruments: "heavy synths, electronic beats, vocoder, bass drops, arpeggiated synths", vocal: "processed vocals, auto-tuned harmonies, breathy verses, powerful chorus" },
    { genre: "EuroPop", main: "Pop", sub: "Mainstream / Dance Pop", age: ["20대","30대"], place: ["클럽","드라이브","홈파티"], mood: ["신나는","기분좋은","흥겨운"], bpm: "120-135", desc: "유럽 스타일의 팝 음악. 밝고 경쾌한 멜로디가 특징입니다.", instruments: "bright synths, four-on-the-floor kick, trance pads, euro bass", vocal: "bright female vocals, catchy melody, sing-along chorus" },
    // -- Ballad / Acoustic Pop --
    { genre: "Pop Ballad", main: "Pop", sub: "Ballad / Acoustic Pop", age: ["20대","30대","40대"], place: ["집","카페","도서관"], mood: ["감성적","잔잔한","위로","이별","비오는날"], bpm: "66-80", desc: "감성적인 멜로디와 가사가 돋보이는 발라드. 서정적이고 따뜻한 느낌입니다.", instruments: "piano, soft strings, acoustic guitar, gentle percussion, warm pads", vocal: "emotional vocals, breathy verses, powerful chorus, vibrato" },
    { genre: "Acoustic Pop", main: "Pop", sub: "Ballad / Acoustic Pop", age: ["20대","30대","40대"], place: ["카페","집","사무실","산책","아침루틴","요리할때","독서"], mood: ["편안한","따뜻한","잔잔한"], bpm: "90-120", desc: "어쿠스틱 기타 중심의 따뜻한 팝. 자연스럽고 편안한 사운드입니다.", instruments: "acoustic guitar, light percussion, piano, soft bass, strings", vocal: "warm natural vocals, intimate delivery, gentle harmonies" },
    { genre: "Singer Songwriter", main: "Pop", sub: "Ballad / Acoustic Pop", age: ["20대","30대","40대"], place: ["카페","집","드라이브","산책","독서","오후티타임"], mood: ["감성적","따뜻한","그리운"], bpm: "85-115", desc: "직접 작사작곡한 진솔한 음악. 개인적인 이야기와 감정이 담겨 있습니다.", instruments: "acoustic guitar, piano, minimal percussion, subtle strings", vocal: "sincere vocals, storytelling delivery, raw emotion, natural tone" },
    // -- Indie / Alternative Pop --
    { genre: "Indie Pop", main: "Pop", sub: "Indie / Alternative Pop", age: ["10대","20대","30대"], place: ["카페","집","드라이브","산책","아침루틴"], mood: ["감성적","설레는","기분좋은"], bpm: "100-130", desc: "독립적이고 개성 있는 팝 음악. 독특한 사운드와 감성이 매력입니다.", instruments: "jangly guitars, vintage synths, indie drums, warm bass, glockenspiel", vocal: "dreamy vocals, layered harmonies, lo-fi texture, indie delivery" },
    { genre: "Bedroom Pop", main: "Pop", sub: "Indie / Alternative Pop", age: ["10대","20대"], place: ["집"], mood: ["포근한","감성적","새벽감성","잔잔한"], bpm: "85-110", desc: "방에서 만든 듯한 lo-fi 감성의 팝. 몽환적이고 나른한 분위기입니다.", instruments: "lo-fi guitar, soft synth pads, drum machine, warm reverb, tape effects", vocal: "soft breathy vocals, whispered delivery, reverb-heavy, intimate" },
    { genre: "Dream Pop", main: "Pop", sub: "Indie / Alternative Pop", age: ["20대","30대"], place: ["집","카페","독서"], mood: ["몽환적","잔잔한","비오는날","새벽감성"], bpm: "80-110", desc: "몽환적이고 꿈같은 분위기의 팝. 풍성한 리버브와 에코가 특징입니다.", instruments: "shimmering guitars, lush reverb pads, ethereal synths, soft drums", vocal: "ethereal vocals, heavy reverb, dreamy delivery, layered whispers" },
    { genre: "Dark Pop", main: "Pop", sub: "Indie / Alternative Pop", age: ["10대","20대"], place: ["집","바/라운지","Night Drive"], mood: ["몽환적","쓸쓸한","새벽감성","새벽"], bpm: "90-120", desc: "어둡고 미스터리한 분위기의 팝. 깊은 감정과 독특한 사운드가 매력입니다.", instruments: "dark synths, heavy bass, minimal percussion, atmospheric pads", vocal: "sultry vocals, whispered verses, haunting chorus, processed effects" },
    { genre: "Avant-Pop", main: "Pop", sub: "Indie / Alternative Pop", age: ["20대","30대"], place: ["집","코딩"], mood: ["몰입","몽환적","감성적"], bpm: "90-130", desc: "실험적이고 전위적인 팝. 독창적인 구성과 사운드 디자인이 특징입니다.", instruments: "experimental synths, unconventional samples, glitchy textures, abstract percussion", vocal: "art-pop vocals, unconventional phrasing, layered processing" },
    { genre: "Hyper Pop", main: "Pop", sub: "Indie / Alternative Pop", age: ["10대","20대"], place: ["집","클럽"], mood: ["신나는","텐션업","파워풀한"], bpm: "140-180", desc: "극단적으로 과장된 팝. 빠르고 실험적인 사운드가 특징입니다.", instruments: "distorted synths, glitchy beats, pitch-shifted bass, chaotic effects", vocal: "pitch-shifted vocals, auto-tuned, screaming chorus, distorted" },
    { genre: "Internet Pop", main: "Pop", sub: "Indie / Alternative Pop", age: ["10대","20대"], place: ["집","게이밍"], mood: ["기분좋은","신나는","상쾌한"], bpm: "110-135", desc: "인터넷 문화에서 탄생한 팝. 밈적 요소와 캐치한 멜로디가 특징입니다.", instruments: "bright synths, bubbly beats, 8-bit textures, playful bass, digital effects", vocal: "cute vocals, pitch-shifted, playful delivery, internet culture references" },
    // -- Synth / Retro Pop --
    { genre: "Synth Pop", main: "Pop", sub: "Synth / Retro Pop", age: ["20대","30대","40대"], place: ["드라이브","클럽","바/라운지","Night Drive"], mood: ["감성적","그리운","설레는","일몰"], bpm: "110-130", desc: "신디사이저 중심의 레트로 팝. 80년대 복고풍 느낌이 매력입니다.", instruments: "analog synths, drum machine, arpeggiators, synth bass, gated reverb", vocal: "smooth vocals, new wave delivery, catchy melodies, harmonized chorus" },
    { genre: "City Pop", main: "Pop", sub: "Synth / Retro Pop", age: ["20대","30대"], place: ["카페","드라이브","바/라운지","Night Drive","요리할때"], mood: ["감성적","그리운","일몰"], bpm: "100-125", desc: "일본 시티팝 스타일. 세련되고 도시적인 분위기의 레트로 사운드입니다.", instruments: "funky guitar, electric piano, slap bass, brass section, lush synths", vocal: "smooth silky vocals, jazzy phrasing, warm tone, effortless delivery" },
    { genre: "Y2K Pop", main: "Pop", sub: "Synth / Retro Pop", age: ["10대","20대"], place: ["클럽","집","홈파티"], mood: ["신나는","기분좋은","그리운"], bpm: "110-130", desc: "2000년대 초반 감성의 팝. Y2K 미래주의적 사운드가 특징입니다.", instruments: "futuristic synths, R&B beats, vocoder, glittery production, pop bass", vocal: "breathy pop vocals, R&B influenced, catchy hooks, processed harmonies" },
    { genre: "2010's Pop", main: "Pop", sub: "Synth / Retro Pop", age: ["20대","30대"], place: ["드라이브","헬스장","홈파티","청소할때"], mood: ["기분좋은","신나는","그리운"], bpm: "110-130", desc: "2010년대 히트곡 스타일의 팝. EDM 요소와 캐치한 드롭이 특징입니다.", instruments: "EDM-influenced synths, four-on-the-floor kick, tropical elements, drop builds", vocal: "powerful pop vocals, catchy chorus, anthemic delivery, layered harmonies" },
    // -- Regional Pop --
    { genre: "K-Pop", main: "Pop", sub: "Regional Pop", age: ["10대","20대"], place: ["집","클럽","헬스장","홈파티"], mood: ["신나는","텐션업","설레는","기분좋은"], bpm: "100-140", desc: "한국 대중음악. 중독성 있는 멜로디와 퍼포먼스가 특징입니다.", instruments: "heavy synths, trap beats, EDM drops, layered production, brass hits", vocal: "powerful vocals, rap verse, group harmonies, ad-libs, belted high notes" },
    { genre: "J-Pop", main: "Pop", sub: "Regional Pop", age: ["10대","20대"], place: ["집","카페","게이밍"], mood: ["감성적","기분좋은","상쾌한"], bpm: "110-140", desc: "일본 대중음악. 밝고 에너지 넘치는 멜로디가 특징입니다.", instruments: "bright guitars, piano, electronic beats, orchestral accents", vocal: "bright clear vocals, energetic delivery, anime-style expression" },
    { genre: "Latin Pop", main: "Pop", sub: "Regional Pop", age: ["20대","30대"], place: ["클럽","드라이브","페스티벌","데이트"], mood: ["신나는","흥겨운","설레는"], bpm: "95-120", desc: "라틴 리듬과 팝 멜로디가 결합된 음악. 열정적이고 로맨틱합니다.", instruments: "latin guitar, congas, synth pads, latin percussion, bass", vocal: "passionate vocals, Spanish-English mix, melodic hooks, romantic delivery" },
    // -- Pop Crossover --
    { genre: "Pop Rock", main: "Pop", sub: "Pop Crossover", age: ["20대","30대","40대"], place: ["드라이브","헬스장","출퇴근","청소할때"], mood: ["신나는","파워풀한","상쾌한"], bpm: "110-140", desc: "록의 에너지와 팝의 멜로디가 결합된 장르입니다.", instruments: "electric guitars, driving drums, bass guitar, piano, power chords", vocal: "powerful vocals, belted chorus, rock energy, melodic verses" },
    { genre: "Pop Punk", main: "Pop", sub: "Pop Crossover", age: ["10대","20대","30대"], place: ["헬스장","드라이브","페스티벌"], mood: ["신나는","텐션업","파워풀한","분노"], bpm: "150-180", desc: "펑크의 반항적 에너지와 팝의 캐치한 멜로디가 결합된 장르입니다.", instruments: "distorted power chords, fast drums, punk bass, palm mutes", vocal: "nasal punk vocals, sing-along chorus, energetic delivery, gang vocals" },
    { genre: "Pop Rap", main: "Pop", sub: "Pop Crossover", age: ["10대","20대"], place: ["클럽","헬스장","드라이브","홈파티"], mood: ["신나는","텐션업","자신감"], bpm: "100-130", desc: "팝과 랩이 결합된 장르. 캐치한 훅과 랩 벌스가 특징입니다.", instruments: "pop synths, trap hi-hats, 808 bass, catchy melody loops, claps", vocal: "melodic rap, catchy hook singing, auto-tune, energetic delivery" },
    { genre: "Pop Country", main: "Pop", sub: "Pop Crossover", age: ["20대","30대","40대"], place: ["드라이브","집","아침루틴"], mood: ["따뜻한","감성적","상쾌한"], bpm: "100-130", desc: "컨트리와 팝의 크로스오버. 따뜻한 어쿠스틱과 팝 멜로디가 어우러집니다.", instruments: "acoustic guitar, steel guitar, pop drums, bass, fiddle accents", vocal: "warm country-pop vocals, storytelling, catchy chorus, slight twang" },

    // ========== 02. ROCK (31 genres) ==========
    // -- Classic / Mainstream Rock --
    { genre: "Classic Rock", main: "Rock", sub: "Classic / Mainstream Rock", age: ["30대","40대","50대+"], place: ["드라이브","바/라운지","집","청소할때"], mood: ["파워풀한","감성적","그리운"], bpm: "100-140", desc: "70~80년대 전통 록. 강렬한 기타 리프와 파워풀한 사운드가 특징입니다.", instruments: "electric guitar riffs, Hammond organ, bass guitar, acoustic drums, piano", vocal: "powerful male vocals, raspy delivery, raw emotion, blues influence" },
    { genre: "Radio Rock", main: "Rock", sub: "Classic / Mainstream Rock", age: ["20대","30대","40대"], place: ["드라이브","사무실","출퇴근","아침루틴"], mood: ["기분좋은","상쾌한","신나는"], bpm: "105-135", desc: "라디오 친화적인 대중 록. 깔끔한 사운드와 캐치한 멜로디가 특징입니다.", instruments: "clean electric guitars, steady drums, bass, piano accents, light distortion", vocal: "clear strong vocals, melodic chorus, radio-friendly delivery" },
    { genre: "Hard Rock", main: "Rock", sub: "Classic / Mainstream Rock", age: ["20대","30대","40대"], place: ["헬스장","드라이브"], mood: ["파워풀한","텐션업","분노"], bpm: "120-150", desc: "강렬한 기타 리프와 파워풀한 드럼이 특징인 하드록입니다.", instruments: "heavy distorted guitars, power drums, bass guitar, wah pedal", vocal: "powerful raspy vocals, screaming chorus, aggressive delivery" },
    { genre: "Southern Rock", main: "Rock", sub: "Classic / Mainstream Rock", age: ["30대","40대","50대+"], place: ["드라이브","바/라운지","여행"], mood: ["감성적","따뜻한","그리운"], bpm: "100-135", desc: "미국 남부 감성의 록. 블루스와 컨트리 영향이 녹아 있습니다.", instruments: "dual lead guitars, slide guitar, Hammond organ, bass, drums", vocal: "soulful southern vocals, storytelling, raw honest delivery" },
    // -- Alternative / Indie --
    { genre: "Alternative Rock", main: "Rock", sub: "Alternative / Indie", age: ["20대","30대"], place: ["드라이브","집","페스티벌","산책"], mood: ["감성적","파워풀한","몰입"], bpm: "110-140", desc: "주류와 다른 독립적인 록 음악. 실험적이고 개성 있는 사운드입니다.", instruments: "distorted guitars, alternative drums, moody bass, effects pedals", vocal: "emotional vocals, dynamic range, intimate verses, explosive chorus" },
    { genre: "Indie Rock", main: "Rock", sub: "Alternative / Indie", age: ["20대","30대"], place: ["카페","드라이브","집","산책","독서"], mood: ["감성적","잔잔한","따뜻한"], bpm: "100-135", desc: "독립 레이블의 감성적인 록 음악. 진솔하고 개성 있는 사운드입니다.", instruments: "jangly guitars, indie drums, warm bass, vintage amps, subtle keys", vocal: "indie vocal style, imperfect charm, emotional storytelling" },
    { genre: "Grunge", main: "Rock", sub: "Alternative / Indie", age: ["20대","30대","40대"], place: ["헬스장","집"], mood: ["파워풀한","분노","쓸쓸한"], bpm: "100-140", desc: "90년대 시애틀 사운드. 거칠고 투박한 기타와 감정적 보컬이 특징입니다.", instruments: "heavy distorted guitars, sludgy bass, crashing drums, feedback", vocal: "raw screaming vocals, angst-filled delivery, dynamic quiet-loud" },
    { genre: "Shoegaze", main: "Rock", sub: "Alternative / Indie", age: ["20대","30대"], place: ["집","카페","독서"], mood: ["몽환적","잔잔한","비오는날","감성적"], bpm: "80-120", desc: "벽처럼 두꺼운 기타 사운드와 몽환적 분위기의 록입니다.", instruments: "wall of guitars, heavy reverb, tremolo, washed-out bass, dream drums", vocal: "buried vocals, whispered delivery, reverb-drenched, ethereal" },
    // -- Punk --
    { genre: "Punk Rock", main: "Rock", sub: "Punk", age: ["10대","20대","30대"], place: ["헬스장","페스티벌","청소할때"], mood: ["파워풀한","텐션업","분노"], bpm: "160-200", desc: "빠르고 거친 에너지의 펑크. 반항적 정신과 단순한 코드 진행이 특징입니다.", instruments: "distorted power chords, fast drums, punk bass, raw production", vocal: "shouted vocals, aggressive delivery, gang vocals, raw energy" },
    { genre: "Emo Rock", main: "Rock", sub: "Punk", age: ["10대","20대"], place: ["집","드라이브","Night Drive"], mood: ["감성적","쓸쓸한","센치한","비오는날"], bpm: "110-150", desc: "감정적이고 내성적인 록. 솔직한 가사와 멜로디가 특징입니다.", instruments: "clean-to-distorted guitars, emotional riffs, bass, expressive drums", vocal: "emotional vocals, confessional lyrics, dynamic range, emo delivery" },
    { genre: "Post Punk", main: "Rock", sub: "Punk", age: ["20대","30대"], place: ["집","바/라운지","클럽","Night Drive"], mood: ["몽환적","쓸쓸한","새벽감성"], bpm: "110-140", desc: "펑크의 에너지와 실험적 사운드가 결합된 장르입니다.", instruments: "angular guitars, driving bass, mechanical drums, chorus effects, synths", vocal: "detached cool vocals, baritone delivery, artistic phrasing" },
    { genre: "Ska Punk", main: "Rock", sub: "Punk", age: ["20대","30대"], place: ["페스티벌","헬스장","홈파티"], mood: ["신나는","흥겨운","기분좋은"], bpm: "150-180", desc: "스카 리듬과 펑크가 결합된 에너지 넘치는 장르입니다.", instruments: "brass section, offbeat guitar skank, fast drums, walking bass", vocal: "energetic vocals, call and response, gang vocals, horn hooks" },
    { genre: "Celtic Punk", main: "Rock", sub: "Punk", age: ["20대","30대","40대"], place: ["바/라운지","페스티벌","홈파티"], mood: ["흥겨운","신나는","기분좋은"], bpm: "140-170", desc: "아일랜드 전통 음악과 펑크의 결합. 축제 같은 분위기입니다.", instruments: "tin whistle, fiddle, banjo, punk guitar, accordion, fast drums", vocal: "rowdy group vocals, irish-accented, sing-along, pub choir" },
    // -- Retro / Vintage Rock --
    { genre: "Rockabilly", main: "Rock", sub: "Retro / Vintage Rock", age: ["30대","40대","50대+"], place: ["바/라운지","드라이브"], mood: ["흥겨운","기분좋은","그리운"], bpm: "130-180", desc: "50년대 로큰롤 스타일. 경쾌한 기타와 스윙 리듬이 특징입니다.", instruments: "twangy guitar, upright bass, slap bass, rockabilly drums, piano", vocal: "elvis-style vocals, hiccup singing, energetic delivery, vintage vibe" },
    { genre: "Surf Rock", main: "Rock", sub: "Retro / Vintage Rock", age: ["20대","30대","40대"], place: ["드라이브","카페","여행","아침루틴"], mood: ["상쾌한","기분좋은","신나는"], bpm: "120-160", desc: "서핑 문화에서 탄생한 록. 리버브 기타와 밝은 에너지가 특징입니다.", instruments: "reverb-drenched guitar, tremolo picking, surf drums, bass", vocal: "clean harmonies, beach boy style, or instrumental" },
    { genre: "50's Doo Wop", main: "Rock", sub: "Retro / Vintage Rock", age: ["40대","50대+"], place: ["집","바/라운지","요리할때"], mood: ["그리운","따뜻한","감성적"], bpm: "70-130", desc: "50년대 두왑 하모니. 아카펠라 코러스와 따뜻한 보컬이 특징입니다.", instruments: "finger snaps, upright bass, light piano, doo-wop percussion", vocal: "group harmonies, bass vocals, falsetto lead, vintage doo-wop style" },
    { genre: "Psychedelic Rock", main: "Rock", sub: "Retro / Vintage Rock", age: ["20대","30대","40대"], place: ["집","페스티벌"], mood: ["몽환적","감성적","몰입"], bpm: "90-140", desc: "환각적이고 실험적인 록. 독특한 효과와 확장된 즉흥연주가 특징입니다.", instruments: "wah guitar, phaser, reverse reverb, sitar, mellotron, fuzz bass", vocal: "psychedelic vocals, echo effects, dreamy delivery, experimental" },
    // -- Progressive / Art Rock --
    { genre: "Progressive Rock", main: "Rock", sub: "Progressive / Art Rock", age: ["30대","40대","50대+"], place: ["집","도서관","독서"], mood: ["몰입","감성적","집중"], bpm: "80-140", desc: "복잡한 구성과 긴 곡 형식이 특징인 프로그레시브 록입니다.", instruments: "keyboards, complex guitar, odd-time drums, bass, mellotron, synths", vocal: "theatrical vocals, wide range, progressive phrasing, storytelling" },
    { genre: "Math Rock", main: "Rock", sub: "Progressive / Art Rock", age: ["20대","30대"], place: ["집","코딩"], mood: ["몰입","집중","감성적"], bpm: "100-160", desc: "복잡한 박자와 기타 태핑이 특징인 테크니컬 록입니다.", instruments: "tapping guitars, complex time signatures, angular riffs, technical bass", vocal: "minimal vocals, spoken word, or instrumental" },
    // -- Dark / Heavy Rock --
    { genre: "Stoner Rock", main: "Rock", sub: "Dark / Heavy Rock", age: ["20대","30대"], place: ["집","바/라운지","Night Drive"], mood: ["몽환적","새벽감성","몰입"], bpm: "70-120", desc: "느리고 무거운 퍼즈 기타의 록. 반복적 리프와 트랜스적 분위기입니다.", instruments: "heavy fuzz guitar, thick bass, slow drums, analog effects, wah", vocal: "laid-back vocals, deep delivery, psychedelic phrasing" },
    { genre: "Industrial Rock", main: "Rock", sub: "Dark / Heavy Rock", age: ["20대","30대"], place: ["헬스장","클럽","게이밍"], mood: ["파워풀한","분노","텐션업"], bpm: "110-150", desc: "기계적 비트와 공격적 기타가 결합된 인더스트리얼 록입니다.", instruments: "industrial beats, distorted guitar, metallic percussion, synth noise", vocal: "aggressive vocals, distorted, screaming, mechanical delivery" },
    { genre: "Goth Rock", main: "Rock", sub: "Dark / Heavy Rock", age: ["20대","30대"], place: ["집","클럽","바/라운지","Night Drive"], mood: ["몽환적","쓸쓸한","새벽"], bpm: "100-130", desc: "어둡고 우울한 분위기의 고딕 록. 신비로운 사운드가 특징입니다.", instruments: "chorus-effect guitar, deep bass, tribal drums, synth pads, reverb", vocal: "deep baritone vocals, gothic delivery, haunting, dramatic" },
    { genre: "Hair Metal", main: "Rock", sub: "Dark / Heavy Rock", age: ["30대","40대","50대+"], place: ["헬스장","드라이브"], mood: ["파워풀한","신나는","그리운"], bpm: "120-150", desc: "80년대 글램 메탈. 화려한 기타 솔로와 파워 발라드가 특징입니다.", instruments: "shredding guitar, power chords, arena drums, synth accents, bass", vocal: "high-pitched vocals, power ballad delivery, screams, harmonies" },
    // -- Roots / Acoustic Rock --
    { genre: "Blues", main: "Rock", sub: "Roots / Acoustic Rock", age: ["30대","40대","50대+"], place: ["바/라운지","집","카페","혼술/혼밥"], mood: ["감성적","쓸쓸한","비오는날","위로"], bpm: "70-120", desc: "블루스 기타와 깊은 감정이 특징인 음악. 슬프면서도 따뜻한 느낌입니다.", instruments: "blues guitar, harmonica, upright bass, shuffle drums, piano", vocal: "soulful vocals, blues phrasing, raw emotion, call and response" },
    { genre: "Acoustic Rock", main: "Rock", sub: "Roots / Acoustic Rock", age: ["20대","30대","40대"], place: ["카페","드라이브","집","산책","아침루틴","요리할때"], mood: ["따뜻한","편안한","잔잔한"], bpm: "90-130", desc: "어쿠스틱 기타 중심의 록 음악. 자연스럽고 진솔한 사운드입니다.", instruments: "acoustic guitar, light electric guitar, bass, brushed drums, harmonica", vocal: "warm natural vocals, folk-rock delivery, sing-along quality" },
    { genre: "Yacht Rock", main: "Rock", sub: "Roots / Acoustic Rock", age: ["30대","40대","50대+"], place: ["드라이브","집","바/라운지","요리할때"], mood: ["편안한","기분좋은","일몰"], bpm: "85-120", desc: "70-80년대 소프트 록. 세련되고 편안한 사운드가 특징입니다.", instruments: "clean guitar, electric piano, smooth bass, soft drums, sax", vocal: "smooth vocals, falsetto harmonies, laid-back delivery" },
    { genre: "Country Rock", main: "Rock", sub: "Roots / Acoustic Rock", age: ["30대","40대","50대+"], place: ["드라이브","바/라운지","여행"], mood: ["감성적","따뜻한","그리운"], bpm: "100-140", desc: "컨트리와 록이 결합된 장르. 따뜻한 기타와 록 에너지가 어우러집니다.", instruments: "twangy electric guitar, steel guitar, bass, country drums, fiddle", vocal: "country-rock vocals, storytelling, southern charm, harmonies" },
    // -- Ska --
    { genre: "Ska", main: "Rock", sub: "Ska", age: ["20대","30대"], place: ["페스티벌","바/라운지","홈파티"], mood: ["흥겨운","기분좋은","신나는"], bpm: "130-160", desc: "자메이카 기원의 업비트 음악. 경쾌한 오프비트 기타가 특징입니다.", instruments: "offbeat guitar, brass section, organ, walking bass, upbeat drums", vocal: "energetic vocals, toasting style, sing-along, horn-driven hooks" },
    // -- Rock Crossover --
    { genre: "Latin Rock", main: "Rock", sub: "Rock Crossover", age: ["20대","30대","40대"], place: ["페스티벌","바/라운지","여행"], mood: ["신나는","감성적","흥겨운"], bpm: "100-140", desc: "라틴 리듬과 록 기타가 결합된 장르. 열정적인 에너지가 특징입니다.", instruments: "latin-rock guitar, congas, timbales, bass, rock drums, brass", vocal: "passionate vocals, Spanish influence, rock energy, emotional delivery" },

    // ========== 03. METAL (10 genres) ==========
    // -- Traditional Metal --
    { genre: "Metal", main: "Metal", sub: "Traditional Metal", age: ["20대","30대","40대"], place: ["헬스장","게이밍"], mood: ["파워풀한","분노","텐션업"], bpm: "120-160", desc: "강렬한 리프와 파워풀한 사운드의 메탈. 헤비한 기타가 특징입니다.", instruments: "heavy distorted guitars, double bass drums, bass guitar, palm mutes", vocal: "powerful metal vocals, screaming, growling, high-pitched wails" },
    // -- Extreme Metal --
    { genre: "Thrash Metal", main: "Metal", sub: "Extreme Metal", age: ["20대","30대"], place: ["헬스장","게이밍"], mood: ["파워풀한","분노","텐션업"], bpm: "160-220", desc: "빠르고 공격적인 메탈. 스래싱 리프와 고속 드럼이 특징입니다.", instruments: "thrash riffs, rapid-fire drums, bass guitar, aggressive palm mutes", vocal: "aggressive shouting, rapid-fire delivery, thrash vocals" },
    { genre: "Deathcore", main: "Metal", sub: "Extreme Metal", age: ["10대","20대","30대"], place: ["헬스장","게이밍"], mood: ["파워풀한","분노","텐션업"], bpm: "130-200", desc: "데스메탈과 하드코어의 결합. 브레이크다운과 블라스트 비트가 특징입니다.", instruments: "drop-tuned guitars, breakdown riffs, blast beats, bass drops", vocal: "guttural growls, pig squeals, screaming, inhale vocals" },
    { genre: "Doom Metal", main: "Metal", sub: "Extreme Metal", age: ["20대","30대"], place: ["집","독서"], mood: ["몽환적","쓸쓸한","몰입"], bpm: "50-80", desc: "느리고 무거운 메탈. 암울한 분위기와 거대한 리프가 특징입니다.", instruments: "slow heavy riffs, deep bass, funeral drums, organ, feedback", vocal: "deep clean vocals, doom chanting, or instrumental" },
    // -- Modern Metal --
    { genre: "Nu Metal", main: "Metal", sub: "Modern Metal", age: ["20대","30대","40대"], place: ["헬스장","드라이브"], mood: ["파워풀한","분노","텐션업"], bpm: "100-140", desc: "힙합과 메탈의 결합. DJ 스크래치와 랩 보컬이 특징입니다.", instruments: "down-tuned guitars, DJ scratches, heavy bass, nu-metal drums, turntables", vocal: "rap-metal vocals, screaming chorus, aggressive rapping" },
    { genre: "Metalcore", main: "Metal", sub: "Modern Metal", age: ["10대","20대","30대"], place: ["헬스장","페스티벌","게이밍"], mood: ["파워풀한","텐션업","분노"], bpm: "120-160", desc: "메탈과 하드코어의 결합. 멜로딕 파트와 브레이크다운이 교차합니다.", instruments: "metalcore riffs, breakdowns, blast beats, melodic leads, bass", vocal: "screaming verses, clean chorus, dynamic vocal switches" },
    { genre: "Groove Metal", main: "Metal", sub: "Modern Metal", age: ["20대","30대"], place: ["헬스장"], mood: ["파워풀한","텐션업","분노"], bpm: "100-140", desc: "그루비한 리프 중심의 메탈. 몸이 절로 움직이는 리듬이 특징입니다.", instruments: "groovy heavy riffs, tight drums, bass guitar, palm-muted rhythms", vocal: "aggressive vocals, groove delivery, shouting, rhythmic phrasing" },
    // -- Progressive / Symphonic --
    { genre: "Progressive Metal", main: "Metal", sub: "Progressive / Symphonic", age: ["20대","30대","40대"], place: ["집","게이밍"], mood: ["몰입","감성적","파워풀한"], bpm: "100-160", desc: "복잡한 구성과 테크니컬 연주의 프로그레시브 메탈입니다.", instruments: "technical guitars, odd-time drums, keyboards, bass, orchestral elements", vocal: "wide-range vocals, operatic passages, progressive phrasing" },
    { genre: "Symphonic Metal", main: "Metal", sub: "Progressive / Symphonic", age: ["20대","30대"], place: ["집","헬스장","게이밍"], mood: ["감성적","파워풀한","몰입"], bpm: "110-150", desc: "오케스트라와 메탈의 결합. 웅장하고 드라마틱한 사운드가 특징입니다.", instruments: "orchestral strings, metal guitars, choir, epic drums, synth orchestra", vocal: "operatic female vocals, male growls, choral harmonies, dramatic" },

    // ========== 04. HIP HOP / RAP (20 genres) ==========
    // -- Old School / Boom Bap --
    { genre: "Boom Bap", main: "Hip Hop / Rap", sub: "Old School / Boom Bap", age: ["20대","30대","40대"], place: ["드라이브","집","헬스장"], mood: ["감성적","자신감","그리운"], bpm: "85-100", desc: "올드스쿨 힙합의 정석. 묵직한 드럼과 샘플링이 특징입니다.", instruments: "sampled loops, boom bap drums, vinyl scratches, bass, jazz samples", vocal: "confident rap delivery, lyrical flow, storytelling, old school style" },
    { genre: "East Coast Hip Hop", main: "Hip Hop / Rap", sub: "Old School / Boom Bap", age: ["20대","30대","40대"], place: ["드라이브","헬스장"], mood: ["파워풀한","자신감","몰입"], bpm: "85-100", desc: "뉴욕 중심의 이스트코스트 힙합. 리리컬한 랩과 샘플링이 특징입니다.", instruments: "hard-hitting drums, piano samples, bass, vinyl scratches, horn stabs", vocal: "lyrical complex rap, aggressive delivery, storytelling, braggadocio" },
    { genre: "West Coast Hip Hop", main: "Hip Hop / Rap", sub: "Old School / Boom Bap", age: ["20대","30대","40대"], place: ["드라이브","헬스장"], mood: ["기분좋은","자신감","편안한"], bpm: "90-105", desc: "캘리포니아 웨스트코스트 힙합. G-Funk 영향의 느긋한 그루브입니다.", instruments: "synth leads, funk bass, laid-back drums, talk box, G-funk whistle", vocal: "laid-back flow, west coast drawl, smooth delivery, gangsta style" },
    { genre: "Conscious Rap", main: "Hip Hop / Rap", sub: "Old School / Boom Bap", age: ["20대","30대"], place: ["집","드라이브","산책"], mood: ["감성적","위로","몰입"], bpm: "80-100", desc: "사회적 메시지와 의식 있는 가사의 힙합입니다.", instruments: "soulful samples, jazzy piano, conscious beats, bass, live drums", vocal: "thoughtful rap delivery, poetic flow, conscious lyrics, storytelling" },
    // -- Trap --
    { genre: "Trap", main: "Hip Hop / Rap", sub: "Trap", age: ["10대","20대"], place: ["클럽","헬스장","드라이브","게이밍"], mood: ["텐션업","자신감","파워풀한"], bpm: "130-170", desc: "강렬한 808 베이스와 하이햇이 특징인 현대 힙합입니다.", instruments: "808 bass, hi-hat rolls, snare, dark synths, ambient pads", vocal: "auto-tuned vocals, ad-libs, trap flow, aggressive delivery" },
    { genre: "Memphis Trap", main: "Hip Hop / Rap", sub: "Trap", age: ["10대","20대"], place: ["클럽","헬스장"], mood: ["텐션업","파워풀한","분노"], bpm: "130-160", desc: "멤피스 기원의 어두운 트랩. 로파이한 프로덕션이 특징입니다.", instruments: "dark 808, lo-fi samples, Memphis drums, eerie synths, cowbell", vocal: "aggressive rap, triple flow, ad-libs, Memphis style" },
    { genre: "Atlanta Trap", main: "Hip Hop / Rap", sub: "Trap", age: ["10대","20대"], place: ["클럽","헬스장","홈파티"], mood: ["텐션업","신나는","자신감"], bpm: "130-160", desc: "애틀랜타 스타일 트랩. 멜로딕한 훅과 바운시한 비트가 특징입니다.", instruments: "melodic 808, bouncy hi-hats, atmospheric pads, flute loops, snare", vocal: "melodic rap-singing, auto-tune, catchy hooks, Atlanta flow" },
    // -- Drill --
    { genre: "Chicago Drill", main: "Hip Hop / Rap", sub: "Drill", age: ["10대","20대"], place: ["클럽","헬스장"], mood: ["파워풀한","텐션업","분노"], bpm: "130-145", desc: "시카고 기원의 드릴. 어둡고 공격적인 프로덕션이 특징입니다.", instruments: "sliding 808, drill hi-hats, dark piano, aggressive bass, eerie pads", vocal: "aggressive rap, drill flow, ad-libs, raw delivery" },
    { genre: "UK Drill", main: "Hip Hop / Rap", sub: "Drill", age: ["10대","20대"], place: ["클럽","헬스장"], mood: ["파워풀한","텐션업","분노"], bpm: "138-145", desc: "영국식 드릴. 슬라이딩 베이스와 독특한 플로우가 특징입니다.", instruments: "sliding 808, UK drill pattern, dark synths, aggressive percussion", vocal: "UK drill flow, rapid delivery, British accent, ad-libs" },
    // -- Alternative / Emo --
    { genre: "Cloud Rap", main: "Hip Hop / Rap", sub: "Alternative / Emo", age: ["10대","20대"], place: ["집"], mood: ["몽환적","쓸쓸한","비오는날","새벽감성"], bpm: "60-80", desc: "몽환적이고 부유하는 듯한 힙합. 느리고 dreamy한 분위기가 특징입니다.", instruments: "ethereal synths, spacey reverb, slow 808, ambient pads, cloud textures", vocal: "auto-tuned melodic vocals, dreamy delivery, whispered verses" },
    { genre: "Emo Rap", main: "Hip Hop / Rap", sub: "Alternative / Emo", age: ["10대","20대"], place: ["집","드라이브","Night Drive"], mood: ["쓸쓸한","위로","이별","센치한"], bpm: "75-100", desc: "이모 록과 힙합의 결합. 감정적 가사와 멜로디가 특징입니다.", instruments: "emo guitar, 808 bass, emotional piano, lo-fi drums, reverb pads", vocal: "emotional rap-singing, emo delivery, raw lyrics, auto-tune sadness" },
    { genre: "Alternative Hip Hop", main: "Hip Hop / Rap", sub: "Alternative / Emo", age: ["20대","30대"], place: ["집","카페","드라이브","산책","코딩"], mood: ["감성적","몰입","잔잔한"], bpm: "80-110", desc: "실험적이고 다양한 장르를 넘나드는 얼터너티브 힙합입니다.", instruments: "eclectic samples, live instruments, unique beats, jazzy elements", vocal: "creative rap delivery, poetic flow, genre-bending vocals" },
    // -- Phonk --
    { genre: "Memphis Phonk", main: "Hip Hop / Rap", sub: "Phonk", age: ["10대","20대"], place: ["헬스장","드라이브","클럽","Night Drive","게이밍"], mood: ["텐션업","파워풀한","자신감"], bpm: "130-160", desc: "90년대 멤피스 힙합 기반의 퐁크. 카우벨과 어두운 샘플이 특징입니다.", instruments: "cowbell, dark 808, Memphis samples, distorted bass, phonk drums", vocal: "chopped vocal samples, aggressive rapping, Memphis style, ad-libs" },
    // -- Lo-fi / Chill --
    { genre: "Lo-fi Hip Hop", main: "Hip Hop / Rap", sub: "Lo-fi / Chill", age: ["10대","20대","30대"], place: ["카페","집","사무실","도서관","독서","코딩"], mood: ["집중","공부할때","잔잔한","비오는날"], bpm: "70-90", desc: "따뜻하고 편안한 힙합. 공부나 작업할 때 집중하기 좋은 음악입니다.", instruments: "vinyl crackle, jazzy piano chords, mellow bass, lo-fi drums, tape saturation", vocal: "vocal samples, chopped vocals, minimal vocals, ambient vocal textures" },
    { genre: "Chillhop", main: "Hip Hop / Rap", sub: "Lo-fi / Chill", age: ["20대","30대"], place: ["카페","집","사무실","요리할때","아침루틴","오후티타임"], mood: ["편안한","집중","잔잔한"], bpm: "75-95", desc: "재즈와 힙합이 결합된 편안한 음악. 카페나 작업 시 배경음악으로 좋습니다.", instruments: "jazz piano, mellow guitar, lo-fi drums, warm bass, vinyl texture", vocal: "minimal or no vocals, occasional vocal samples" },
    // -- Funk Rap --
    { genre: "G Funk", main: "Hip Hop / Rap", sub: "Funk Rap", age: ["20대","30대","40대"], place: ["드라이브","바/라운지","일몰"], mood: ["기분좋은","흥겨운","편안한"], bpm: "90-105", desc: "펑크 기반의 웨스트코스트 힙합. 신스 리드와 펑키한 그루브가 특징입니다.", instruments: "synth leads, funk bass, talk box, G-funk whistle, laid-back drums", vocal: "smooth rap delivery, west coast flow, melodic hooks" },
    // -- Crossover --
    { genre: "Mumble Rap", main: "Hip Hop / Rap", sub: "Crossover", age: ["10대","20대"], place: ["클럽","헬스장"], mood: ["텐션업","신나는","자신감"], bpm: "130-160", desc: "멈블 스타일의 래핑. 오토튠과 반복적 훅이 특징입니다.", instruments: "trap 808, hi-hat rolls, ambient synths, heavy bass, minimal melody", vocal: "mumbled auto-tune rap, repetitive hooks, ad-libs, slurred delivery" },
    { genre: "Trip Hop", main: "Hip Hop / Rap", sub: "Crossover", age: ["20대","30대"], place: ["집","바/라운지","카페","Night Drive","코딩"], mood: ["몽환적","잔잔한","비오는날","새벽"], bpm: "80-100", desc: "힙합 비트와 일렉트로닉, 앰비언트가 결합된 트립합입니다.", instruments: "downtempo beats, atmospheric samples, vinyl crackle, deep bass, strings", vocal: "ethereal female vocals, spoken word, sampled vocals, haunting delivery" },
    { genre: "Latin Trap", main: "Hip Hop / Rap", sub: "Crossover", age: ["10대","20대"], place: ["클럽","페스티벌"], mood: ["신나는","텐션업","흥겨운"], bpm: "130-155", desc: "라틴 리듬과 트랩이 결합된 장르. 레게톤 영향이 있습니다.", instruments: "latin 808, dembow-trap hybrid, latin percussion, dark synths", vocal: "Spanish rap, auto-tune, latin trap flow, aggressive delivery" },

    // ========== 05. R&B / SOUL (8 genres) ==========
    // -- R&B --
    { genre: "Contemporary R&B", main: "R&B / Soul", sub: "R&B", age: ["20대","30대"], place: ["집","바/라운지","드라이브","Night Drive","데이트"], mood: ["감성적","설레는","따뜻한","새벽감성"], bpm: "70-100", desc: "현대적인 R&B. 부드러운 보컬과 그루비한 리듬이 매력입니다.", instruments: "smooth synth pads, R&B guitar, 808 bass, finger snaps, lush chords", vocal: "silky smooth vocals, runs and riffs, falsetto, intimate delivery" },
    { genre: "90s R&B", main: "R&B / Soul", sub: "R&B", age: ["30대","40대"], place: ["집","바/라운지","드라이브","요리할때","데이트"], mood: ["그리운","감성적","따뜻한"], bpm: "75-105", desc: "90년대 황금기 R&B. 그루비한 뉴잭스윙 영향의 사운드입니다.", instruments: "new jack swing drums, synth bass, R&B keys, finger snaps, pad chords", vocal: "soulful R&B vocals, melismatic runs, group harmonies, smooth delivery" },
    { genre: "Gospel R&B", main: "R&B / Soul", sub: "R&B", age: ["30대","40대","50대+"], place: ["집"], mood: ["따뜻한","위로","힐링"], bpm: "70-110", desc: "가스펠과 R&B가 결합된 장르. 영적인 감동과 소울풀한 보컬이 특징입니다.", instruments: "organ, piano, gospel choir, bass, drums, strings", vocal: "powerful gospel-R&B vocals, runs, belting, spiritual delivery" },
    // -- Soul --
    { genre: "Soul", main: "R&B / Soul", sub: "Soul", age: ["30대","40대","50대+"], place: ["바/라운지","카페","집","요리할때","저녁식사"], mood: ["따뜻한","감성적","위로"], bpm: "70-110", desc: "깊은 감정과 파워풀한 보컬이 특징인 소울 음악입니다.", instruments: "organ, brass section, rhythm guitar, bass, drums, strings", vocal: "powerful soulful vocals, gospel influence, emotional belting, vibrato" },
    { genre: "Motown Soul", main: "R&B / Soul", sub: "Soul", age: ["40대","50대+"], place: ["드라이브","바/라운지","집","요리할때","청소할때"], mood: ["기분좋은","그리운","따뜻한"], bpm: "100-130", desc: "모타운 레이블 스타일의 소울. 밝고 캐치한 팝-소울입니다.", instruments: "tambourine, bass guitar, Motown drums, piano, brass, strings", vocal: "sweet group vocals, call and response, catchy melodies, Motown style" },
    { genre: "Neo Soul", main: "R&B / Soul", sub: "Soul", age: ["20대","30대"], place: ["카페","바/라운지","집","요리할때","데이트","코딩"], mood: ["감성적","따뜻한","편안한"], bpm: "75-100", desc: "재즈, R&B, 힙합이 결합된 현대적 소울. 세련되고 따뜻한 사운드입니다.", instruments: "Rhodes piano, jazzy chords, warm bass, neo soul guitar, soft drums", vocal: "warm soulful vocals, jazz-influenced phrasing, natural vibrato" },
    { genre: "Trap Soul", main: "R&B / Soul", sub: "Soul", age: ["10대","20대"], place: ["집","바/라운지","Night Drive","데이트"], mood: ["감성적","설레는","새벽감성","몽환적"], bpm: "60-85", desc: "트랩 비트와 R&B 보컬의 결합. 몽환적이고 섹시한 분위기입니다.", instruments: "trap hi-hats, 808 bass, R&B pads, ambient synths, soft snare", vocal: "auto-tuned R&B vocals, falsetto, intimate delivery, breathy" },
    // -- Swing --
    { genre: "New Jack Swing", main: "R&B / Soul", sub: "Swing", age: ["30대","40대"], place: ["클럽","바/라운지","홈파티"], mood: ["흥겨운","기분좋은","그리운"], bpm: "100-120", desc: "80-90년대 뉴잭스윙. R&B와 힙합, 댄스 팝이 결합된 그루브입니다.", instruments: "drum machine, synth bass, R&B keys, horn stabs, claps", vocal: "smooth R&B vocals, rap breaks, new jack swing delivery, harmonies" },

    // ========== 06. COUNTRY / FOLK (9 genres) ==========
    // -- Traditional Country --
    { genre: "Classic Country", main: "Country / Folk", sub: "Traditional Country", age: ["40대","50대+"], place: ["드라이브","집","바/라운지"], mood: ["감성적","그리운","따뜻한"], bpm: "90-130", desc: "전통 컨트리 음악. 따뜻한 기타와 진솔한 가사가 특징입니다.", instruments: "acoustic guitar, steel guitar, fiddle, bass, brushed drums", vocal: "warm country vocals, twang, storytelling delivery, harmonies" },
    { genre: "Honky Tonk", main: "Country / Folk", sub: "Traditional Country", age: ["30대","40대","50대+"], place: ["바/라운지"], mood: ["흥겨운","신나는","기분좋은"], bpm: "120-160", desc: "선술집 분위기의 활기찬 컨트리. 흥겨운 피아노와 기타가 특징입니다.", instruments: "honky-tonk piano, twangy guitar, fiddle, upright bass, drums", vocal: "twangy country vocals, barroom delivery, sing-along, rowdy energy" },
    { genre: "Outlaw Country", main: "Country / Folk", sub: "Traditional Country", age: ["30대","40대","50대+"], place: ["드라이브","바/라운지"], mood: ["감성적","자신감","파워풀한"], bpm: "90-130", desc: "반항적 정신의 아웃로 컨트리. 거친 보컬과 진솔한 가사가 특징입니다.", instruments: "acoustic guitar, electric guitar, bass, drums, harmonica, steel guitar", vocal: "rough country vocals, outlaw attitude, storytelling, raw delivery" },
    // -- Roots / Americana --
    { genre: "Americana", main: "Country / Folk", sub: "Roots / Americana", age: ["30대","40대","50대+"], place: ["드라이브","집","카페","여행","아침루틴","독서"], mood: ["따뜻한","감성적","잔잔한"], bpm: "85-120", desc: "미국 전통 음악의 뿌리를 가진 장르. 포크, 컨트리, 블루스가 결합됩니다.", instruments: "acoustic guitar, banjo, mandolin, upright bass, harmonica, fiddle", vocal: "earthy vocals, folk storytelling, raw honest delivery" },
    { genre: "Bluegrass", main: "Country / Folk", sub: "Roots / Americana", age: ["30대","40대","50대+"], place: ["집","바/라운지","드라이브","여행"], mood: ["기분좋은","따뜻한","흥겨운"], bpm: "110-160", desc: "빠른 핑거피킹과 밴조가 특징인 블루그래스입니다.", instruments: "banjo, mandolin, fiddle, upright bass, acoustic guitar, dobro", vocal: "high lonesome vocals, tight harmonies, bluegrass yodel, nasal delivery" },
    { genre: "Country Folk", main: "Country / Folk", sub: "Roots / Americana", age: ["30대","40대","50대+"], place: ["카페","집","드라이브","산책","독서","아침루틴"], mood: ["잔잔한","따뜻한","편안한"], bpm: "80-120", desc: "포크와 컨트리가 결합된 장르. 소박하고 따뜻한 어쿠스틱 사운드입니다.", instruments: "acoustic guitar, harmonica, gentle fiddle, upright bass, banjo", vocal: "gentle folk vocals, warm storytelling, intimate delivery" },
    // -- Country Gospel --
    { genre: "Country Gospel", main: "Country / Folk", sub: "Country Gospel", age: ["40대","50대+"], place: ["집"], mood: ["따뜻한","위로","힐링"], bpm: "80-120", desc: "컨트리와 가스펠이 결합된 찬양 음악입니다.", instruments: "acoustic guitar, piano, steel guitar, gentle drums, choir", vocal: "warm country-gospel vocals, heartfelt delivery, harmonies" },

    // ========== 07. ELECTRONIC / HOUSE (43 genres) ==========
    // -- House --
    { genre: "House", main: "Electronic / House", sub: "House", age: ["20대","30대"], place: ["클럽","페스티벌"], mood: ["신나는","흥겨운","몰입"], bpm: "120-130", desc: "4/4 비트 기반의 댄스 음악. 반복적이고 그루비한 리듬이 특징입니다.", instruments: "four-on-the-floor kick, hi-hats, synth stabs, deep bass, claps", vocal: "vocal chops, house diva vocals, filtered vocals, vocal hooks" },
    { genre: "90's House", main: "Electronic / House", sub: "House", age: ["30대","40대"], place: ["클럽","바/라운지"], mood: ["그리운","흥겨운","신나는"], bpm: "120-128", desc: "90년대 클래식 하우스. 피아노 코드와 소울풀한 보컬이 특징입니다.", instruments: "piano chords, classic house beats, soulful pads, bass, organ stabs", vocal: "soulful house vocals, diva hooks, gospel-influenced harmonies" },
    { genre: "Progressive House", main: "Electronic / House", sub: "House", age: ["20대","30대"], place: ["클럽","페스티벌","헬스장"], mood: ["텐션업","몰입","달릴때"], bpm: "126-132", desc: "점진적으로 빌드업되는 하우스. 웅장한 드롭이 특징입니다.", instruments: "building synths, epic pads, driving bass, riser FX, pluck leads", vocal: "ethereal vocal chops, pitched vocal samples, emotional hooks" },
    { genre: "Big Room House", main: "Electronic / House", sub: "House", age: ["10대","20대"], place: ["페스티벌","클럽","헬스장"], mood: ["텐션업","파워풀한","신나는"], bpm: "126-132", desc: "페스티벌용 대형 하우스. 거대한 드롭과 빌드업이 특징입니다.", instruments: "massive synth leads, big room kicks, riser FX, crash builds, stabs", vocal: "vocal shouts, crowd chants, one-shot vocal samples" },
    { genre: "Future House", main: "Electronic / House", sub: "House", age: ["10대","20대"], place: ["클럽","페스티벌","헬스장"], mood: ["텐션업","신나는","흥겨운"], bpm: "124-128", desc: "미래적 사운드의 하우스. 메탈릭한 베이스와 팝적 멜로디가 특징입니다.", instruments: "metallic bass, future house leads, crisp drums, vocal chops, plucks", vocal: "pitched vocal chops, processed vocals, catchy hooks" },
    { genre: "Bass House", main: "Electronic / House", sub: "House", age: ["10대","20대"], place: ["클럽","헬스장"], mood: ["텐션업","파워풀한","신나는"], bpm: "124-130", desc: "무거운 베이스가 강조된 하우스. UK 베이스라인 영향이 있습니다.", instruments: "wobble bass, heavy kicks, bass house synths, crisp hi-hats", vocal: "chopped vocal samples, MC-style vocals, processed shouts" },
    { genre: "Deep House", main: "Electronic / House", sub: "House", age: ["20대","30대"], place: ["바/라운지","카페","집","Night Drive","요리할때","데이트"], mood: ["편안한","감성적","일몰"], bpm: "118-125", desc: "깊고 따뜻한 하우스 음악. 편안하면서도 그루비한 사운드입니다.", instruments: "warm pads, deep bass, jazzy chords, subtle percussion, ambient textures", vocal: "soft filtered vocals, soulful samples, whispered delivery" },
    { genre: "Tech House", main: "Electronic / House", sub: "House", age: ["20대","30대"], place: ["클럽","바/라운지"], mood: ["흥겨운","몰입","집중"], bpm: "122-128", desc: "테크노와 하우스의 결합. 미니멀하고 그루비한 사운드입니다.", instruments: "minimal kicks, tech percussion, subtle acid bass, groove loops", vocal: "minimal vocal samples, tech house vocal chops" },
    { genre: "Tropical House", main: "Electronic / House", sub: "House", age: ["20대","30대"], place: ["카페","드라이브","집","여행","아침루틴","요리할때"], mood: ["기분좋은","상쾌한","편안한"], bpm: "100-115", desc: "열대 느낌의 밝고 경쾌한 하우스. 여름과 휴양지 분위기입니다.", instruments: "steel drums, marimba, bright synths, tropical percussion, light bass", vocal: "breezy vocals, relaxed delivery, summer vibes, catchy melody" },
    { genre: "Acid House", main: "Electronic / House", sub: "House", age: ["20대","30대","40대"], place: ["클럽"], mood: ["몰입","흥겨운","신나는"], bpm: "120-130", desc: "TB-303 신디사이저의 독특한 사운드가 특징인 애시드 하우스입니다.", instruments: "TB-303 acid bass, Roland TR-808/909, acid squelch, minimal synths", vocal: "minimal or no vocals, occasional vocal shouts" },
    { genre: "Afro House", main: "Electronic / House", sub: "House", age: ["20대","30대"], place: ["클럽","페스티벌"], mood: ["흥겨운","몰입","따뜻한"], bpm: "118-128", desc: "아프리카 리듬과 하우스의 결합. 유기적인 퍼커션이 특징입니다.", instruments: "african percussion, house beats, tribal drums, marimba, deep bass", vocal: "African vocal chants, tribal vocals, call and response" },
    // -- Trance --
    { genre: "Trance", main: "Electronic / House", sub: "Trance", age: ["20대","30대","40대"], place: ["클럽","페스티벌","헬스장","달릴때"], mood: ["몰입","텐션업","달릴때"], bpm: "130-150", desc: "반복적 멜로디와 빌드업이 특징인 트랜스. 몰입감이 뛰어납니다.", instruments: "trance leads, supersaw synths, rolling bass, epic breakdowns, pads", vocal: "ethereal female vocals, trance vocal hooks, uplifting delivery" },
    { genre: "Psytrance", main: "Electronic / House", sub: "Trance", age: ["20대","30대"], place: ["페스티벌","클럽"], mood: ["몽환적","몰입","텐션업"], bpm: "138-150", desc: "사이키델릭 트랜스. 트위스티드 사운드와 빠른 리듬이 특징입니다.", instruments: "psychedelic synths, rolling bass, acid lines, tribal percussion, FX", vocal: "psychedelic vocal samples, tribal chants, processed effects" },
    { genre: "Hard Trance", main: "Electronic / House", sub: "Trance", age: ["20대","30대"], place: ["클럽","헬스장","달릴때"], mood: ["텐션업","파워풀한","달릴때"], bpm: "140-155", desc: "하드한 킥과 강렬한 리드가 특징인 하드 트랜스입니다.", instruments: "hard kicks, distorted leads, rolling bass, hard trance stabs", vocal: "aggressive vocal shouts, trance hooks, energetic samples" },
    // -- Bass Music / Dubstep --
    { genre: "Dubstep", main: "Electronic / House", sub: "Bass Music / Dubstep", age: ["10대","20대"], place: ["클럽","페스티벌","헬스장","게이밍"], mood: ["텐션업","파워풀한","분노"], bpm: "140-150", desc: "무거운 워블 베이스와 하프타임 리듬이 특징인 덥스텝입니다.", instruments: "wobble bass, heavy sub, dubstep snare, risers, LFO modulation", vocal: "vocal chops, distorted vocal samples, MC shouts" },
    { genre: "Future Bass", main: "Electronic / House", sub: "Bass Music / Dubstep", age: ["10대","20대"], place: ["클럽","페스티벌","헬스장","게이밍"], mood: ["텐션업","설레는","신나는"], bpm: "140-160", desc: "감성적인 코드와 워블 베이스가 결합된 퓨처 베이스입니다.", instruments: "supersaws, wobble chords, future bass drums, side-chain bass, bright leads", vocal: "emotional pitched vocals, chopped vocal hooks, uplifting delivery" },
    { genre: "Trap EDM", main: "Electronic / House", sub: "Bass Music / Dubstep", age: ["10대","20대"], place: ["클럽","페스티벌","헬스장","게이밍"], mood: ["텐션업","파워풀한","신나는"], bpm: "140-160", desc: "EDM과 트랩이 결합된 장르. 강렬한 드롭과 808 베이스가 특징입니다.", instruments: "808 bass, EDM builds, trap hi-hats, massive drops, brass stabs", vocal: "vocal shouts, trap vocal chops, hype delivery" },
    { genre: "Jersey Club", main: "Electronic / House", sub: "Bass Music / Dubstep", age: ["10대","20대"], place: ["클럽"], mood: ["흥겨운","신나는","텐션업"], bpm: "130-140", desc: "뉴저지 클럽 음악. 빠른 비트와 보컬 샘플링이 특징입니다.", instruments: "rapid-fire kicks, bed-squeak samples, vocal chops, bouncy bass", vocal: "chopped R&B vocal samples, club shouts, rapid-fire chops" },
    { genre: "Moombahton", main: "Electronic / House", sub: "Bass Music / Dubstep", age: ["20대","30대"], place: ["클럽","페스티벌"], mood: ["흥겨운","신나는","기분좋은"], bpm: "108-112", desc: "레게톤 리듬과 하우스의 결합. 느릿한 바운스가 특징입니다.", instruments: "dembow kick pattern, dutch house synths, latin percussion, bass", vocal: "latin vocal samples, hype vocals, dancehall influence" },
    // -- Drum & Bass --
    { genre: "Drum and Bass", main: "Electronic / House", sub: "Drum & Bass", age: ["20대","30대"], place: ["클럽","헬스장","게이밍","달릴때"], mood: ["텐션업","파워풀한","달릴때"], bpm: "160-180", desc: "빠른 브레이크비트와 깊은 베이스가 특징인 드럼 앤 베이스입니다.", instruments: "breakbeats, deep sub bass, reese bass, amen break, synth stabs", vocal: "MC vocals, chopped vocals, jungle vocal samples" },
    { genre: "Liquid DnB", main: "Electronic / House", sub: "Drum & Bass", age: ["20대","30대"], place: ["집","사무실","코딩"], mood: ["잔잔한","편안한","감성적"], bpm: "170-176", desc: "부드럽고 서정적인 드럼 앤 베이스. 재즈 영향의 따뜻한 사운드입니다.", instruments: "smooth breakbeats, jazzy piano, warm bass, atmospheric pads, strings", vocal: "soulful female vocals, smooth delivery, jazzy phrasing" },
    { genre: "Jump Up DnB", main: "Electronic / House", sub: "Drum & Bass", age: ["10대","20대"], place: ["클럽","페스티벌"], mood: ["텐션업","신나는","달릴때"], bpm: "170-180", desc: "점핑하는 베이스라인이 특징인 에너지 넘치는 DnB입니다.", instruments: "bouncy bass, jump-up reese, rapid breakbeats, stabs, risers", vocal: "MC shouts, hype vocals, crowd interaction samples" },
    { genre: "Neurofunk", main: "Electronic / House", sub: "Drum & Bass", age: ["20대","30대"], place: ["클럽","헬스장","게이밍"], mood: ["파워풀한","몰입","텐션업"], bpm: "170-178", desc: "테크니컬하고 복잡한 베이스 디자인의 뉴로펑크 DnB입니다.", instruments: "neuro bass, complex breakbeats, metallic synths, sci-fi FX", vocal: "processed vocal samples, robotic vocals, minimal" },
    { genre: "Jungle", main: "Electronic / House", sub: "Drum & Bass", age: ["20대","30대","40대"], place: ["클럽"], mood: ["흥겨운","몰입","텐션업"], bpm: "155-170", desc: "레게와 브레이크비트가 결합된 정글. DnB의 뿌리가 되는 장르입니다.", instruments: "chopped breakbeats, ragga bass, jungle pads, amen breaks, dub FX", vocal: "ragga vocals, reggae-influenced, MC toasting, vocal samples" },
    // -- Breakbeat / Garage --
    { genre: "Breakbeat", main: "Electronic / House", sub: "Breakbeat / Garage", age: ["20대","30대","40대"], place: ["클럽"], mood: ["흥겨운","몰입","신나는"], bpm: "120-140", desc: "불규칙한 브레이크비트가 특징인 전자 음악입니다.", instruments: "funky breakbeats, acid bass, synth stabs, sampled loops, FX", vocal: "vocal samples, funk-influenced vocals, DJ shouts" },
    { genre: "UK Garage", main: "Electronic / House", sub: "Breakbeat / Garage", age: ["20대","30대"], place: ["클럽","바/라운지"], mood: ["흥겨운","기분좋은","신나는"], bpm: "130-140", desc: "2스텝 리듬의 UK 개러지. 스윙감 있는 비트가 특징입니다.", instruments: "2-step beats, shuffled hi-hats, deep bass, R&B-influenced pads", vocal: "R&B-style vocals, pitched vocal chops, garage MC, smooth delivery" },
    // -- Hardcore / Hardstyle --
    { genre: "Hardstyle", main: "Electronic / House", sub: "Hardcore / Hardstyle", age: ["10대","20대"], place: ["페스티벌","헬스장","게이밍"], mood: ["텐션업","파워풀한","달릴때"], bpm: "150-160", desc: "강렬한 킥과 멜로딕한 리드가 특징인 하드스타일입니다.", instruments: "hardstyle kick, reverse bass, epic leads, screeches, hard drums", vocal: "epic vocal hooks, pitched screams, crowd chants" },
    { genre: "Happy Hardcore", main: "Electronic / House", sub: "Hardcore / Hardstyle", age: ["10대","20대"], place: ["페스티벌","헬스장"], mood: ["텐션업","신나는","기분좋은"], bpm: "160-180", desc: "밝고 행복한 하드코어. 빠른 비트와 유포릭한 멜로디가 특징입니다.", instruments: "happy synth leads, fast kicks, piano riffs, euphoric pads, stabs", vocal: "pitched-up female vocals, happy hooks, euphoric delivery" },
    { genre: "Dariacore", main: "Electronic / House", sub: "Hardcore / Hardstyle", age: ["10대","20대"], place: ["집","게이밍"], mood: ["신나는","텐션업","파워풀한"], bpm: "170-200", desc: "매시업 기반의 실험적 하드코어. 인터넷 문화 영향이 강합니다.", instruments: "mashup samples, breakcore beats, pitch-shifted songs, chaotic edits", vocal: "pitched-shifted vocal samples, mashup vocals, internet culture references" },
    // -- Dance / Club --
    { genre: "Eurodance", main: "Electronic / House", sub: "Dance / Club", age: ["20대","30대","40대"], place: ["클럽","드라이브","헬스장","홈파티","청소할때"], mood: ["신나는","흥겨운","그리운"], bpm: "130-150", desc: "90년대 유로댄스. 캐치한 멜로디와 랩 브릿지가 특징입니다.", instruments: "eurodance synths, four-on-the-floor, catchy riffs, euro bass, stabs", vocal: "female pop vocals, male rap, catchy chorus, euro-style delivery" },
    { genre: "Nu Disco", main: "Electronic / House", sub: "Dance / Club", age: ["20대","30대"], place: ["클럽","바/라운지","카페","요리할때","데이트"], mood: ["흥겨운","기분좋은","신나는"], bpm: "110-125", desc: "디스코 리바이벌. 현대적 프로덕션으로 재해석된 디스코입니다.", instruments: "disco bass, modern drums, funky guitar, synth strings, filter sweeps", vocal: "disco-influenced vocals, filtered delivery, funky hooks" },
    // -- Wave / Synth --
    { genre: "Synthwave", main: "Electronic / House", sub: "Wave / Synth", age: ["20대","30대"], place: ["드라이브","집","헬스장","Night Drive","코딩","게이밍"], mood: ["감성적","그리운","새벽","몰입"], bpm: "80-118", desc: "80년대 레트로 퓨처 사운드. 네온 느낌의 신디사이저가 특징입니다.", instruments: "retro analog synths, arpeggiators, gated drums, 80s bass, neon pads", vocal: "vocoder vocals, retro delivery, or instrumental" },
    { genre: "Darkwave", main: "Electronic / House", sub: "Wave / Synth", age: ["20대","30대"], place: ["집","클럽","바/라운지","Night Drive"], mood: ["몽환적","쓸쓸한","새벽"], bpm: "100-130", desc: "고딕과 신스팝이 결합된 다크웨이브. 어둡고 분위기 있는 사운드입니다.", instruments: "dark synths, drum machine, deep bass, chorus guitar, cold pads", vocal: "deep goth vocals, cold delivery, haunting melodies" },
    { genre: "Coldwave", main: "Electronic / House", sub: "Wave / Synth", age: ["20대","30대"], place: ["집","바/라운지","Night Drive"], mood: ["쓸쓸한","몽환적","새벽"], bpm: "100-130", desc: "미니멀하고 차가운 분위기의 포스트펑크 전자음악입니다.", instruments: "minimal synths, cold bass, mechanical drums, sparse arrangements", vocal: "detached cool vocals, monotone delivery, minimalist" },
    { genre: "Ethereal Wave", main: "Electronic / House", sub: "Wave / Synth", age: ["20대","30대"], place: ["집"], mood: ["몽환적","잔잔한","비오는날","잠잘때"], bpm: "80-120", desc: "천상의 분위기를 가진 에테리얼 웨이브입니다.", instruments: "shimmering guitars, ethereal synths, light drums, reverb-heavy pads", vocal: "angelic female vocals, heavenly harmonies, floating delivery" },
    // -- Experimental / IDM --
    { genre: "Glitch", main: "Electronic / House", sub: "Experimental / IDM", age: ["20대","30대"], place: ["집","코딩"], mood: ["몰입","집중","몽환적"], bpm: "90-140", desc: "디지털 오류 사운드를 활용한 실험적 전자 음악입니다.", instruments: "glitch effects, granular synthesis, broken beats, digital artifacts", vocal: "processed vocal glitches, stuttered samples, or instrumental" },
    { genre: "Glitch Hop", main: "Electronic / House", sub: "Experimental / IDM", age: ["20대","30대"], place: ["집","클럽"], mood: ["몰입","흥겨운","기분좋은"], bpm: "100-120", desc: "글리치와 힙합이 결합된 장르. 펑키한 비트와 글리치 효과가 특징입니다.", instruments: "glitchy beats, funky bass, wonky synths, hip-hop drums, digital FX", vocal: "rap vocals, glitched vocal samples, funky delivery" },
    { genre: "IDM", main: "Electronic / House", sub: "Experimental / IDM", age: ["20대","30대"], place: ["집","사무실","코딩"], mood: ["몰입","집중","몽환적"], bpm: "80-160", desc: "지적이고 실험적인 전자 음악. 복잡한 리듬과 텍스처가 특징입니다.", instruments: "complex rhythms, granular textures, abstract synths, evolving pads", vocal: "minimal or no vocals, processed abstract samples" },
    { genre: "Chiptune", main: "Electronic / House", sub: "Experimental / IDM", age: ["10대","20대"], place: ["집","게이밍","코딩"], mood: ["기분좋은","신나는","몰입"], bpm: "120-160", desc: "8비트 게임기 사운드의 칩튠. 레트로 게임 느낌이 특징입니다.", instruments: "8-bit synths, square wave, triangle wave, NES/Game Boy sounds, pulse bass", vocal: "chiptune vocal samples, or instrumental, 8-bit voice" },
    // -- Downtempo / Chill --
    { genre: "Chillout Electronic", main: "Electronic / House", sub: "Downtempo / Chill", age: ["20대","30대","40대"], place: ["집","카페","사무실","비행기안","여행"], mood: ["편안한","힐링","비오는날","잠잘때"], bpm: "80-110", desc: "편안한 전자 음악. 긴장을 풀고 쉬기 좋은 앰비언트 사운드입니다.", instruments: "ambient pads, soft beats, warm synths, gentle bass, nature sounds", vocal: "whispered vocals, airy delivery, or instrumental" },
    { genre: "Downtempo", main: "Electronic / House", sub: "Downtempo / Chill", age: ["20대","30대"], place: ["집","카페","바/라운지","코딩"], mood: ["잔잔한","몽환적","비오는날","집중"], bpm: "70-100", desc: "느리고 깊은 전자 음악. 세련되고 사색적인 분위기입니다.", instruments: "deep bass, atmospheric synths, ethnic samples, downtempo beats", vocal: "ethereal vocals, processed samples, ambient vocal textures" },
    { genre: "Lounge", main: "Electronic / House", sub: "Downtempo / Chill", age: ["30대","40대"], place: ["바/라운지","카페","집","요리할때","저녁식사","데이트"], mood: ["편안한","아늑한","따뜻한"], bpm: "90-120", desc: "라운지 분위기의 세련된 음악. 고급스럽고 편안한 사운드입니다.", instruments: "smooth sax, lounge piano, soft beats, warm bass, bossa elements", vocal: "smooth lounge vocals, jazzy phrasing, intimate delivery" },

    // ========== 08. AMBIENT / NEW AGE (10 genres) ==========
    // -- Ambient --
    { genre: "Dark Ambient", main: "Ambient / New Age", sub: "Ambient", age: ["20대","30대"], place: ["집","게이밍"], mood: ["몽환적","새벽","쓸쓸한","몰입"], bpm: "40-80", desc: "어둡고 불안한 분위기의 앰비언트. 공포 게임 같은 느낌입니다.", instruments: "dark drones, eerie textures, industrial noise, deep sub, horror FX", vocal: "no vocals, occasional ghostly whispers" },
    { genre: "Drone Ambient", main: "Ambient / New Age", sub: "Ambient", age: ["20대","30대"], place: ["집","도서관","명상"], mood: ["수면유도","집중","편안한"], bpm: "0-60", desc: "지속음(드론)이 중심인 앰비언트. 깊은 명상에 적합합니다.", instruments: "sustained drones, harmonic overtones, subtle modulation, deep bass", vocal: "no vocals" },
    { genre: "Space Ambient", main: "Ambient / New Age", sub: "Ambient", age: ["20대","30대"], place: ["집","사무실","코딩"], mood: ["집중","수면유도","몽환적"], bpm: "50-80", desc: "우주적 분위기의 앰비언트. 광활한 공간감이 특징입니다.", instruments: "spacey pads, cosmic synths, granular textures, deep reverb, sub bass", vocal: "no vocals, or distant processed whispers" },
    { genre: "Ambient Orchestral", main: "Ambient / New Age", sub: "Ambient", age: ["30대","40대"], place: ["집","사무실","도서관","독서"], mood: ["집중","잔잔한","수면유도"], bpm: "50-80", desc: "오케스트라 요소가 가미된 앰비언트. 잔잔하고 집중하기 좋습니다.", instruments: "ambient strings, soft piano, orchestral pads, gentle woodwinds", vocal: "no vocals, or ethereal choir textures" },
    // -- New Age --
    { genre: "New Age", main: "Ambient / New Age", sub: "New Age", age: ["30대","40대","50대+"], place: ["집","사무실","명상","요가"], mood: ["힐링","수면유도","편안한","스트레스해소"], bpm: "60-90", desc: "편안하고 치유적인 음악. 명상이나 휴식에 적합합니다.", instruments: "crystal bowls, soft pads, nature sounds, gentle piano, harp", vocal: "no vocals or ethereal chants, ambient vocal textures" },
    { genre: "Celtic New Age", main: "Ambient / New Age", sub: "New Age", age: ["30대","40대","50대+"], place: ["집","독서"], mood: ["힐링","포근한","수면유도"], bpm: "60-90", desc: "켈틱 요소가 가미된 뉴에이지. 따뜻하고 신비로운 분위기입니다.", instruments: "celtic harp, tin whistle, soft strings, nature sounds, gentle piano", vocal: "gaelic-influenced vocals, ethereal female voice, whispered" },
    // -- Wellness --
    { genre: "Meditation Music", main: "Ambient / New Age", sub: "Wellness", age: ["30대","40대","50대+"], place: ["집","명상","요가"], mood: ["힐링","수면유도","스트레스해소"], bpm: "50-70", desc: "명상과 마음 챙김을 위한 음악. 고요하고 평화로운 사운드입니다.", instruments: "singing bowls, soft drones, nature sounds, gentle bells, ambient pads", vocal: "no vocals, occasional om chanting" },
    { genre: "Yoga Music", main: "Ambient / New Age", sub: "Wellness", age: ["20대","30대","40대"], place: ["집","헬스장","요가","명상"], mood: ["힐링","편안한","스트레스해소"], bpm: "60-90", desc: "요가 수련을 위한 음악. 호흡과 함께하는 부드러운 사운드입니다.", instruments: "sitar, tabla, ambient pads, nature sounds, gentle flute, soft bells", vocal: "Sanskrit chanting, or instrumental, mantra vocals" },
    { genre: "Spa Music", main: "Ambient / New Age", sub: "Wellness", age: ["30대","40대","50대+"], place: ["집"], mood: ["힐링","편안한","수면유도","스트레스해소"], bpm: "50-70", desc: "스파와 휴식을 위한 음악. 물소리와 자연음이 어우러집니다.", instruments: "water sounds, soft piano, gentle strings, nature ambience, wind chimes", vocal: "no vocals" },

    // ========== 09. JAZZ (5 genres) ==========
    // -- Modern Jazz --
    { genre: "Smooth Jazz", main: "Jazz", sub: "Modern Jazz", age: ["30대","40대","50대+"], place: ["카페","바/라운지","사무실","요리할때","저녁식사","아침루틴","독서"], mood: ["편안한","따뜻한","감성적"], bpm: "80-120", desc: "부드럽고 세련된 재즈. 카페나 라운지 분위기에 잘 어울립니다.", instruments: "smooth sax, jazz guitar, electric piano, walking bass, brushed drums", vocal: "smooth jazz vocals or instrumental, scat singing" },
    { genre: "Nu Jazz", main: "Jazz", sub: "Modern Jazz", age: ["20대","30대"], place: ["카페","바/라운지","요리할때","데이트","코딩"], mood: ["감성적","몰입","편안한"], bpm: "90-130", desc: "전자 음악 요소가 가미된 현대적 재즈. 세련된 그루브가 특징입니다.", instruments: "jazz keys, electronic beats, upright bass, synth textures, sax", vocal: "jazz vocals, or instrumental, modern jazz phrasing" },
    { genre: "Jazz Fusion", main: "Jazz", sub: "Modern Jazz", age: ["20대","30대","40대"], place: ["카페","바/라운지","집","요리할때","독서"], mood: ["감성적","몰입","집중"], bpm: "90-140", desc: "재즈와 록, 펑크의 결합. 테크니컬한 연주와 즉흥이 특징입니다.", instruments: "fusion guitar, electric piano, bass, jazz-rock drums, synths", vocal: "jazz-rock vocals, or instrumental, improvisational" },
    // -- Traditional Jazz --
    { genre: "Bebop", main: "Jazz", sub: "Traditional Jazz", age: ["30대","40대","50대+"], place: ["바/라운지","집","카페","독서"], mood: ["몰입","감성적","집중"], bpm: "140-280", desc: "빠르고 복잡한 즉흥연주가 특징인 비밥 재즈입니다.", instruments: "bebop sax, piano, upright bass, ride cymbal, rapid trumpet", vocal: "scat singing, or instrumental, jazz virtuosity" },
    { genre: "Big Band", main: "Jazz", sub: "Traditional Jazz", age: ["40대","50대+"], place: ["바/라운지","집","홈파티","요리할때","저녁식사"], mood: ["기분좋은","흥겨운","신나는"], bpm: "120-180", desc: "대편성 재즈 밴드. 화려한 브라스 앙상블이 특징입니다.", instruments: "brass section, saxes, trombones, piano, bass, big band drums", vocal: "big band crooner vocals, swing delivery, or instrumental" },

    // ========== 10. FUNK / DISCO (4 genres) ==========
    { genre: "Funk", main: "Funk / Disco", sub: "Funk", age: ["20대","30대","40대"], place: ["클럽","바/라운지","드라이브","홈파티","요리할때","청소할때"], mood: ["흥겨운","기분좋은","신나는"], bpm: "100-130", desc: "그루비한 베이스와 리듬이 중독적인 음악. 몸이 절로 움직입니다.", instruments: "slap bass, wah guitar, brass section, clavinet, funky drums", vocal: "funky vocals, call and response, energetic delivery, ad-libs" },
    { genre: "Disco", main: "Funk / Disco", sub: "Disco", age: ["30대","40대","50대+"], place: ["클럽","바/라운지","드라이브","홈파티","청소할때","요리할때"], mood: ["신나는","흥겨운","그리운"], bpm: "110-130", desc: "70년대 디스코. 화려한 스트링과 4-on-the-floor 비트가 특징입니다.", instruments: "strings, four-on-the-floor kick, hi-hats, bass guitar, brass, piano", vocal: "disco diva vocals, falsetto, sing-along chorus, harmonies" },

    // ========== 11. LATIN (17 genres) ==========
    // -- Urban Latin --
    { genre: "Reggaeton", main: "Latin", sub: "Urban Latin", age: ["10대","20대","30대"], place: ["클럽","페스티벌","헬스장","홈파티"], mood: ["신나는","텐션업","흥겨운"], bpm: "88-100", desc: "라틴 아메리카의 댄스 음악. 독특한 뎀보우 리듬이 특징입니다.", instruments: "dembow rhythm, 808 bass, reggaeton snare, latin percussion, synths", vocal: "Spanish rap-singing, melodic hooks, ad-libs, auto-tune" },
    { genre: "Dembow", main: "Latin", sub: "Urban Latin", age: ["10대","20대"], place: ["클럽","페스티벌"], mood: ["신나는","텐션업","흥겨운"], bpm: "115-130", desc: "도미니카 기원의 댄스 음악. 빠른 뎀보우 리듬이 특징입니다.", instruments: "rapid dembow beat, heavy bass, synth stabs, latin percussion", vocal: "Spanish rap, energetic delivery, call and response, ad-libs" },
    // -- Mexican --
    { genre: "Regional Mexican", main: "Latin", sub: "Mexican", age: ["20대","30대","40대"], place: ["드라이브","바/라운지","집"], mood: ["감성적","그리운","따뜻한"], bpm: "90-130", desc: "멕시코 지역 음악. 아코디언과 기타가 중심인 전통 사운드입니다.", instruments: "accordion, bajo sexto, bass, regional percussion, tuba", vocal: "passionate Mexican vocals, ranchera style, emotional delivery" },
    { genre: "Corridos", main: "Latin", sub: "Mexican", age: ["20대","30대"], place: ["드라이브","바/라운지"], mood: ["감성적","자신감","그리운"], bpm: "100-130", desc: "멕시코 서사 발라드. 스토리텔링과 밴드 사운드가 특징입니다.", instruments: "accordion, tuba, bajo sexto, corrido drums, bass", vocal: "storytelling vocals, corrido style, group harmonies, narrative delivery" },
    { genre: "Mariachi", main: "Latin", sub: "Mexican", age: ["30대","40대","50대+"], place: ["바/라운지","집","홈파티","여행"], mood: ["감성적","따뜻한","파워풀한"], bpm: "90-140", desc: "멕시코 마리아치. 트럼펫과 바이올린의 화려한 앙상블이 특징입니다.", instruments: "trumpet, violin, guitarron, vihuela, guitar, harp", vocal: "powerful mariachi vocals, grito shouts, passionate delivery, harmonies" },
    // -- Caribbean Latin --
    { genre: "Bachata", main: "Latin", sub: "Caribbean Latin", age: ["20대","30대","40대"], place: ["클럽","바/라운지","데이트"], mood: ["설레는","감성적","사랑"], bpm: "120-140", desc: "도미니카 공화국의 로맨틱 음악. 기타와 봉고가 특징입니다.", instruments: "bachata guitar, bongo, bass, guira, requinto, synth accents", vocal: "romantic Spanish vocals, smooth delivery, emotional expression" },
    { genre: "Salsa", main: "Latin", sub: "Caribbean Latin", age: ["20대","30대","40대"], place: ["클럽","바/라운지","페스티벌","홈파티","요리할때"], mood: ["신나는","흥겨운","기분좋은"], bpm: "150-250", desc: "라틴 살사. 빠른 리듬과 화려한 브라스가 특징입니다.", instruments: "congas, timbales, brass section, piano montuno, bass, cowbell", vocal: "energetic Spanish vocals, call and response, improvisation, coro" },
    { genre: "Merengue", main: "Latin", sub: "Caribbean Latin", age: ["20대","30대","40대"], place: ["클럽","페스티벌","홈파티"], mood: ["신나는","흥겨운","기분좋은"], bpm: "120-160", desc: "도미니카의 메렝게. 빠르고 경쾌한 2/4 리듬이 특징입니다.", instruments: "tambora, guira, accordion, bass, brass, synths", vocal: "energetic Spanish vocals, party delivery, call and response" },
    // -- South American --
    { genre: "Tango", main: "Latin", sub: "South American", age: ["30대","40대","50대+"], place: ["바/라운지","집","데이트"], mood: ["감성적","설레는","몰입"], bpm: "60-130", desc: "아르헨티나 탱고. 정열적이고 드라마틱한 음악입니다.", instruments: "bandoneon, violin, piano, double bass, tango guitar", vocal: "dramatic tango vocals, passionate delivery, or instrumental" },
    { genre: "Bossa Nova", main: "Latin", sub: "South American", age: ["20대","30대","40대"], place: ["카페","바/라운지","집","요리할때","독서","아침루틴","오후티타임","데이트"], mood: ["편안한","잔잔한","비오는날"], bpm: "120-140", desc: "브라질 보사노바. 부드러운 기타와 리듬이 매력적인 라틴 재즈입니다.", instruments: "nylon guitar, soft percussion, upright bass, piano, light drums", vocal: "soft breathy vocals, Portuguese-style phrasing, intimate delivery" },
    // -- Brazilian --
    { genre: "Baile Funk", main: "Latin", sub: "Brazilian", age: ["10대","20대"], place: ["클럽","페스티벌"], mood: ["신나는","텐션업","흥겨운"], bpm: "130-150", desc: "브라질 빈민가 파티 음악. 강렬한 베이스와 샘플링이 특징입니다.", instruments: "heavy bass, baile funk beats, sampled vocals, atabaque, synth stabs", vocal: "Portuguese rap, MC vocals, party chants, call and response" },
    { genre: "Brasil Funk", main: "Latin", sub: "Brazilian", age: ["10대","20대"], place: ["클럽","페스티벌"], mood: ["신나는","텐션업","흥겨운"], bpm: "130-150", desc: "현대적 브라질 펑크. 강렬한 비트와 멜로딕한 후크가 특징입니다.", instruments: "brazil funk beats, heavy 808, synth melodies, atabaque samples", vocal: "Portuguese rap-singing, melodic hooks, party delivery" },
    { genre: "Brazilian Phonk", main: "Latin", sub: "Brazilian", age: ["10대","20대"], place: ["헬스장","클럽","드라이브","게이밍"], mood: ["텐션업","파워풀한","자신감"], bpm: "130-160", desc: "브라질 스타일의 퐁크. 강렬한 베이스와 운동용으로 인기 있습니다.", instruments: "distorted 808, brazilian phonk drums, cowbell, dark synths, bass drops", vocal: "chopped vocal samples, aggressive MC, Portuguese ad-libs" },
    // -- Latin Crossover --
    { genre: "Kizomba", main: "Latin", sub: "Latin Crossover", age: ["20대","30대"], place: ["클럽","바/라운지","데이트"], mood: ["설레는","감성적","사랑"], bpm: "80-100", desc: "앙골라 기원의 로맨틱 댄스 음악. 느린 비트와 관능적 분위기입니다.", instruments: "zouk bass, kizomba beats, guitar, soft synth pads, percussion", vocal: "Portuguese/French vocals, smooth romantic delivery, intimate" },

    // ========== 12. AFRICAN / CARIBBEAN (7 genres) ==========
    // -- African --
    { genre: "Afrobeats", main: "African / Caribbean", sub: "African", age: ["10대","20대","30대"], place: ["클럽","페스티벌","드라이브","홈파티","여행"], mood: ["신나는","흥겨운","기분좋은"], bpm: "100-120", desc: "아프리카 비트 기반의 현대 음악. 리듬감이 넘치고 흥겨운 사운드입니다.", instruments: "afro percussion, log drums, guitar, brass, shakers, talking drum", vocal: "melodic vocals, Afrobeat flow, pidgin English, call and response" },
    { genre: "Afro Fusion", main: "African / Caribbean", sub: "African", age: ["20대","30대"], place: ["클럽","집","드라이브","여행"], mood: ["감성적","흥겨운","따뜻한"], bpm: "95-120", desc: "아프로비트와 다양한 장르의 퓨전. R&B, 팝, 레게 요소가 섞입니다.", instruments: "afro guitar, percussion, R&B pads, bass, talking drum, synths", vocal: "melodic Afro vocals, smooth delivery, genre-crossing style" },
    { genre: "Amapiano", main: "African / Caribbean", sub: "African", age: ["10대","20대","30대"], place: ["클럽","페스티벌","드라이브","홈파티","여행"], mood: ["흥겨운","기분좋은","편안한"], bpm: "110-120", desc: "남아프리카 아마피아노. 로그 드럼과 재즈 요소가 특징입니다.", instruments: "log drums, jazz piano, deep bass, shakers, amapiano percussion", vocal: "Zulu/English vocals, smooth delivery, vocal chops, melodic hooks" },
    // -- Caribbean --
    { genre: "Dancehall", main: "African / Caribbean", sub: "Caribbean", age: ["10대","20대","30대"], place: ["클럽","페스티벌","홈파티"], mood: ["신나는","흥겨운","텐션업"], bpm: "90-110", desc: "자메이카 댄스홀. 디지털 리듬과 DJ 스타일이 특징입니다.", instruments: "dancehall riddim, digital bass, DJ effects, synth stabs, percussion", vocal: "dancehall toasting, patois rap-singing, energetic delivery" },
    { genre: "Reggae", main: "African / Caribbean", sub: "Caribbean", age: ["20대","30대","40대"], place: ["카페","집","드라이브","바/라운지","산책","아침루틴","요리할때","여행"], mood: ["편안한","힐링","따뜻한","스트레스해소"], bpm: "70-90", desc: "자메이카 레게 음악. 여유롭고 평화로운 느낌이 특징입니다.", instruments: "offbeat guitar skank, bass guitar, one drop drums, organ, percussion", vocal: "relaxed vocals, Jamaican patois influence, rootsy delivery" },
    { genre: "Calypso", main: "African / Caribbean", sub: "Caribbean", age: ["30대","40대","50대+"], place: ["바/라운지","집","홈파티","요리할때","여행"], mood: ["기분좋은","따뜻한","흥겨운"], bpm: "100-130", desc: "트리니다드 칼립소. 밝고 흥겨운 카리브해 음악입니다.", instruments: "steel drums, calypso guitar, bass, latin percussion, horns", vocal: "Caribbean vocals, calypso style, storytelling, cheerful delivery" },

    // ========== 13. CLASSICAL / ORCHESTRAL (9 genres) ==========
    // -- Classical --
    { genre: "Classical", main: "Classical / Orchestral", sub: "Classical", age: ["30대","40대","50대+"], place: ["집","사무실","도서관","독서"], mood: ["집중","공부할때","몰입","감성적"], bpm: "60-120", desc: "클래식 음악. 오케스트라의 풍성한 사운드가 특징입니다.", instruments: "full orchestra, strings, woodwinds, brass, timpani, piano", vocal: "instrumental or operatic vocals" },
    { genre: "Contemporary Classical", main: "Classical / Orchestral", sub: "Classical", age: ["20대","30대","40대"], place: ["집","사무실","코딩","독서"], mood: ["집중","감성적","몰입"], bpm: "50-120", desc: "현대 클래식. 실험적 요소와 전통이 결합된 음악입니다.", instruments: "modern strings, prepared piano, electronic accents, minimal ensemble", vocal: "instrumental, or contemporary vocal techniques" },
    { genre: "Baroque", main: "Classical / Orchestral", sub: "Classical", age: ["30대","40대","50대+"], place: ["집","사무실","도서관","독서"], mood: ["집중","공부할때","몰입"], bpm: "60-130", desc: "바로크 시대 음악. 정교한 대위법과 하프시코드가 특징입니다.", instruments: "harpsichord, baroque strings, recorder, lute, organ, continuo", vocal: "baroque vocal style, or instrumental, ornamental singing" },
    { genre: "Indian Classical", main: "Classical / Orchestral", sub: "Classical", age: ["30대","40대","50대+"], place: ["집","명상","요가"], mood: ["힐링","몰입","몽환적"], bpm: "40-120", desc: "인도 전통 음악. 라가와 탈라의 깊은 음악적 전통입니다.", instruments: "sitar, tabla, tanpura, sarangi, bansuri, veena", vocal: "Indian classical singing, raga vocals, alap, or instrumental" },
    // -- Chamber / Solo --
    { genre: "Chamber Music", main: "Classical / Orchestral", sub: "Chamber / Solo", age: ["30대","40대","50대+"], place: ["집","사무실","도서관","독서"], mood: ["집중","잔잔한","감성적"], bpm: "60-120", desc: "소규모 앙상블의 실내악. 섬세하고 친밀한 연주가 특징입니다.", instruments: "string quartet, piano trio, wind quintet, chamber ensemble", vocal: "instrumental, or art song vocals" },
    { genre: "Piano Solo", main: "Classical / Orchestral", sub: "Chamber / Solo", age: ["20대","30대","40대","50대+"], place: ["집","카페","사무실","도서관"], mood: ["잔잔한","집중","감성적","위로","비오는날"], bpm: "60-120", desc: "피아노 독주. 순수하고 아름다운 피아노 선율입니다.", instruments: "solo piano, grand piano, sustain pedal, dynamic expression", vocal: "instrumental only" },
    { genre: "Violin Concerto", main: "Classical / Orchestral", sub: "Chamber / Solo", age: ["30대","40대","50대+"], place: ["집","독서"], mood: ["감성적","잔잔한","몰입"], bpm: "60-140", desc: "바이올린 협주곡. 깊은 감정과 테크닉이 어우러진 연주입니다.", instruments: "solo violin, orchestra accompaniment, strings, woodwinds", vocal: "instrumental only" },
    // -- Orchestral --
    { genre: "Symphonic Orchestral", main: "Classical / Orchestral", sub: "Orchestral", age: ["30대","40대","50대+"], place: ["집","공부할때"], mood: ["감성적","몰입","파워풀한"], bpm: "60-140", desc: "교향곡 스타일의 오케스트라. 웅장하고 감동적인 사운드입니다.", instruments: "full symphony orchestra, strings, brass, woodwinds, percussion, timpani", vocal: "instrumental, or operatic choir" },

    // ========== 14. CINEMATIC / SOUNDTRACK (9 genres) ==========
    // -- Epic / Orchestral --
    { genre: "Epic Orchestral", main: "Cinematic / Soundtrack", sub: "Epic / Orchestral", age: ["10대","20대","30대","40대"], place: ["집","헬스장","공부할때","게이밍"], mood: ["파워풀한","몰입","감성적"], bpm: "80-140", desc: "영화 같은 웅장한 오케스트라 음악. 감동적이고 장대한 스케일입니다.", instruments: "full orchestra, epic percussion, brass fanfare, choir, strings, timpani", vocal: "epic choir, wordless vocals, orchestral vocal textures" },
    { genre: "Cinematic Orchestral", main: "Cinematic / Soundtrack", sub: "Epic / Orchestral", age: ["20대","30대","40대"], place: ["집","사무실","공부할때","코딩"], mood: ["감성적","몰입","잔잔한"], bpm: "70-120", desc: "영화 사운드트랙 스타일의 음악. 감정을 깊이 전달하는 오케스트라입니다.", instruments: "orchestral strings, piano, woodwinds, subtle percussion, atmospheric pads", vocal: "no vocals or ethereal choir" },
    { genre: "Trailer Music", main: "Cinematic / Soundtrack", sub: "Epic / Orchestral", age: ["10대","20대","30대"], place: ["집","헬스장","게이밍"], mood: ["텐션업","파워풀한","몰입"], bpm: "100-150", desc: "영화 예고편 음악. 극적인 빌드업과 강렬한 임팩트가 특징입니다.", instruments: "epic brass, percussion hits, risers, choir, hybrid orchestra, bass drops", vocal: "dramatic choir, sound design vocals, epic chants" },
    { genre: "Hybrid Orchestral", main: "Cinematic / Soundtrack", sub: "Epic / Orchestral", age: ["20대","30대"], place: ["집","헬스장","게이밍","코딩"], mood: ["파워풀한","몰입","집중"], bpm: "90-140", desc: "오케스트라와 전자 음악의 하이브리드. 현대적이고 파워풀합니다.", instruments: "orchestra + synths, hybrid percussion, electronic bass, epic strings", vocal: "processed choir, electronic vocal textures, or instrumental" },
    { genre: "Fantasy Orchestral", main: "Cinematic / Soundtrack", sub: "Epic / Orchestral", age: ["10대","20대","30대"], place: ["집","게이밍","독서"], mood: ["몽환적","몰입","감성적"], bpm: "70-130", desc: "판타지 세계관의 오케스트라. 신비롭고 모험적인 분위기입니다.", instruments: "celtic harp, orchestral strings, flute, choir, bells, fantasy percussion", vocal: "ethereal choir, elvish-style vocals, mythical chanting" },
    // -- Genre Soundtrack --
    { genre: "Horror Soundtrack", main: "Cinematic / Soundtrack", sub: "Genre Soundtrack", age: ["10대","20대","30대"], place: ["집","게이밍"], mood: ["몰입","쓸쓸한","새벽"], bpm: "60-120", desc: "공포 영화 사운드트랙. 불안하고 긴장감 넘치는 사운드입니다.", instruments: "dissonant strings, eerie piano, horror FX, dark ambient, metallic hits", vocal: "ghostly whispers, screaming samples, or instrumental" },
    { genre: "Sci Fi Soundtrack", main: "Cinematic / Soundtrack", sub: "Genre Soundtrack", age: ["20대","30대"], place: ["집","사무실","코딩"], mood: ["몽환적","몰입","집중"], bpm: "70-130", desc: "SF 영화 사운드트랙. 미래적이고 우주적인 분위기입니다.", instruments: "sci-fi synths, granular textures, space pads, electronic percussion", vocal: "processed robotic vocals, or instrumental, alien textures" },
    { genre: "Comedy Soundtrack", main: "Cinematic / Soundtrack", sub: "Genre Soundtrack", age: ["20대","30대","40대"], place: ["집","요리할때"], mood: ["기분좋은","상쾌한","따뜻한"], bpm: "100-140", desc: "코미디 영화 사운드트랙. 밝고 유쾌한 분위기의 음악입니다.", instruments: "playful woodwinds, pizzicato strings, funny percussion, xylophone, tuba", vocal: "or instrumental, comedic vocal expressions" },
    { genre: "Anime Score", main: "Cinematic / Soundtrack", sub: "Genre Soundtrack", age: ["10대","20대"], place: ["집","게이밍","공부할때"], mood: ["감성적","몰입","설레는"], bpm: "80-160", desc: "애니메이션 OST 스타일. 감동적인 선율과 다이나믹한 전개가 특징입니다.", instruments: "orchestral strings, piano, rock elements, electronic accents, choir", vocal: "Japanese-style emotional vocals, or instrumental, anime delivery" },

    // ========== 15. WORLD / ETHNIC (4 genres) ==========
    { genre: "Flamenco", main: "World / Ethnic", sub: "World / Ethnic", age: ["30대","40대","50대+"], place: ["바/라운지","카페","집","여행"], mood: ["감성적","파워풀한","몰입"], bpm: "80-180", desc: "스페인 플라멩코. 정열적인 기타와 리듬이 특징입니다.", instruments: "flamenco guitar, cajon, palmas, castanets, bass", vocal: "passionate flamenco vocals, cante jondo, gypsy delivery" },
    { genre: "Arabic Pop", main: "World / Ethnic", sub: "World / Ethnic", age: ["20대","30대"], place: ["집","클럽","여행"], mood: ["감성적","몽환적","흥겨운"], bpm: "90-130", desc: "아랍 팝 음악. 중동의 선율과 현대적 프로덕션이 결합됩니다.", instruments: "oud, darbuka, arabic strings, synth pads, middle-eastern percussion", vocal: "Arabic singing, melismatic delivery, passionate, quarter-tone" },
    { genre: "Bollywood", main: "World / Ethnic", sub: "World / Ethnic", age: ["10대","20대","30대","40대"], place: ["집","클럽","홈파티","여행"], mood: ["신나는","감성적","흥겨운"], bpm: "90-140", desc: "인도 영화 음악. 화려한 편곡과 드라마틱한 선율이 특징입니다.", instruments: "bollywood orchestra, tabla, sitar, synths, dhol, strings", vocal: "Indian pop vocals, Bollywood delivery, dramatic, melodic" },
    { genre: "World Music", main: "World / Ethnic", sub: "World / Ethnic", age: ["30대","40대","50대+"], place: ["카페","집","산책","독서","여행"], mood: ["힐링","따뜻한","편안한"], bpm: "80-120", desc: "세계 각국의 전통 음악 요소가 담긴 월드뮤직입니다.", instruments: "ethnic instruments, world percussion, flutes, strings, traditional drums", vocal: "world vocal styles, ethnic singing, traditional melodies" },

    // ========== 16. RELIGIOUS / SPIRITUAL (5 genres) ==========
    { genre: "Gospel", main: "Religious / Spiritual", sub: "Christian", age: ["30대","40대","50대+"], place: ["집","아침루틴"], mood: ["따뜻한","위로","힐링"], bpm: "70-130", desc: "찬양과 영적인 메시지가 담긴 가스펠 음악입니다.", instruments: "organ, piano, choir, bass, drums, tambourine, claps", vocal: "powerful gospel vocals, choir harmonies, belting, call and response" },
    { genre: "Contemporary Christian", main: "Religious / Spiritual", sub: "Christian", age: ["20대","30대","40대"], place: ["집","아침루틴"], mood: ["따뜻한","위로","힐링"], bpm: "70-120", desc: "현대적인 CCM. 따뜻하고 희망적인 메시지가 담긴 음악입니다.", instruments: "acoustic guitar, piano, soft drums, strings, ambient pads", vocal: "warm sincere vocals, worship delivery, gentle harmonies" },
    { genre: "Christmas Music", main: "Religious / Spiritual", sub: "Christian", age: ["10대","20대","30대","40대","50대+"], place: ["집","카페","사무실","홈파티"], mood: ["따뜻한","포근한","아늑한","눈오는날"], bpm: "80-130", desc: "크리스마스 음악. 따뜻하고 축제적인 분위기입니다.", instruments: "sleigh bells, orchestra, piano, choir, guitar, celesta, strings", vocal: "warm Christmas vocals, caroling style, festive harmonies" },

    // ========== 17. KID'S / SPECIAL (1 genre) ==========
    { genre: "Kid's Music", main: "Kid's / Special", sub: "Kid's / Special", age: ["10대"], place: ["집"], mood: ["기분좋은","상쾌한","신나는"], bpm: "100-130", desc: "어린이를 위한 밝고 즐거운 음악입니다.", instruments: "playful piano, xylophone, ukulele, claps, simple drums, recorder", vocal: "cheerful singing, simple lyrics, educational, fun delivery" }
];

// ========== 분위기 → v4 키워드 매핑 (35개 키워드) ==========
const MOOD_TO_GENRE_MAP = {
    "comfortable": ["편안한"],         // 편안한
    "healing": ["힐링"],               // 힐링
    "cozy": ["포근한"],                // 포근한
    "warm": ["따뜻한"],                // 따뜻한
    "snug": ["아늑한"],                // 아늑한
    "emotional": ["감성적"],           // 감성적
    "dreamy": ["몽환적"],              // 몽환적
    "calm": ["잔잔한"],                // 잔잔한
    "lonely": ["쓸쓸한"],              // 쓸쓸한
    "sentimental": ["센치한"],         // 센치한
    "dawn-mood": ["새벽감성"],         // 새벽감성
    "nostalgic": ["그리운"],           // 그리운
    "flutter": ["설레는"],             // 설레는
    "love": ["사랑"],                  // 사랑 (v4에 없지만 호환용)
    "breakup": ["이별"],               // 이별
    "feel-good": ["기분좋은"],         // 기분좋은
    "refreshing": ["상쾌한"],          // 상쾌한
    "exciting": ["신나는"],            // 신나는
    "groovy": ["흥겨운"],              // 흥겨운
    "tension-up": ["텐션업"],          // 텐션업
    "powerful": ["파워풀한"],          // 파워풀한
    "confidence": ["자신감"],          // 자신감
    "anger": ["분노"],                 // 분노
    "focus": ["집중"],                 // 집중
    "study": ["공부할때"],             // 공부할때
    "immersive": ["몰입"],             // 몰입
    "sleep": ["잠잘때"],               // 잠잘때
    "sleep-aid": ["수면유도"],         // 수면유도
    "comfort": ["위로"],               // 위로
    "stress-relief": ["스트레스해소"], // 스트레스해소
    "rainy": ["비오는날"],             // 비오는날
    "snowy": ["눈오는날"],             // 눈오는날
    "dawn": ["새벽"],                  // 새벽
    "sunset": ["일몰"],                // 일몰
    "running": ["달릴때"]              // 달릴때
};

// ========== 연령대 매핑 ==========
const AGE_MAP = {
    "teens": ["10대"],
    "young-adults": ["20대", "30대"],
    "middle-aged": ["40대", "50대+"],
    "seniors": ["50대+"]
};

// ========== 장소/활동 매핑 (v4: 28개 키워드) ==========
const PLACE_MAP = {
    "cafe": "카페",
    "bar": "바/라운지",
    "club": "클럽",
    "festival": "페스티벌",
    "gym": "헬스장",
    "home": "집",
    "office": "사무실",
    "library": "도서관",
    "drive": "드라이브",
    "night-drive": "Night Drive",
    "walk": "산책",
    "commute": "출퇴근",
    "travel": "여행",
    "airplane": "비행기안",
    "cooking": "요리할때",
    "cleaning": "청소할때",
    "reading": "독서",
    "gaming": "게이밍",
    "coding": "코딩",
    "yoga": "요가",
    "meditation": "명상",
    "morning": "아침루틴",
    "afternoon-tea": "오후티타임",
    "dinner": "저녁식사",
    "night": "밤",
    "date": "데이트",
    "home-party": "홈파티",
    "alone": "혼술/혼밥"
};

// ========== 장르 추천 엔진 ==========
// 1순위: 연령대(필수 일치), 2순위: 장소, 3순위: 분위기
function recommendGenres(targetAges, places, moods) {
    const scores = {};
    const mappedAges = targetAges.flatMap(t => AGE_MAP[t] || []);
    const mappedPlaces = places.map(p => PLACE_MAP[p]).filter(Boolean);

    GENRE_DATABASE.forEach(genre => {
        // 1순위: 연령대 — 선택된 연령대가 있으면 반드시 일치해야 함
        if (mappedAges.length > 0) {
            const ageMatch = mappedAges.some(age => genre.age.includes(age));
            if (!ageMatch) return; // 연령대 불일치 시 제외
        }

        let placeScore = 0;
        let moodScore = 0;

        // 2순위: 장소 매칭 수
        mappedPlaces.forEach(place => {
            if (genre.place.includes(place)) placeScore += 1;
        });

        // 3순위: 분위기 매칭 수
        moods.forEach(moodKey => {
            const moodValues = MOOD_TO_GENRE_MAP[moodKey] || [];
            moodValues.forEach(mv => {
                if (genre.mood.includes(mv)) moodScore += 1;
            });
        });

        // 장소 우선, 분위기 그 다음, 동점 시 랜덤
        const score = placeScore * 1000 + moodScore * 100 + Math.random() * 10;
        scores[genre.genre] = { score, data: genre };
    });

    // 점수 높은 순 정렬 후 상위 5개
    const sorted = Object.entries(scores)
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, 5);

    return sorted.map(([name, { score, data }]) => ({
        genre: name,
        score,
        ...data
    }));
}

// ========== Suno v5 최적화 프롬프트 생성 엔진 ==========
// 규칙: 장르(1~2) → BPM+조성+박자 → 감정서술문장 → 악기(2~4) → 보컬4요소 → 프로덕션 → 품질보호
// 제한: 950자 이하
const MAX_PROMPT_LENGTH = 950;

// 분위기 → 서술형 문장 변환 (v5 핵심: 단어 나열 ❌ → 서술형 ✅)
const MOOD_SENTENCE_MAP = {
    comfortable: "like settling into a warm couch on a quiet evening",
    healing: "like a gentle breeze healing the soul",
    cozy: "wrapped in a soft blanket on a winter night",
    warm: "warm sunlight through a window on a lazy afternoon",
    snug: "cozy and intimate like a candlelit room",
    emotional: "like a letter you never sent, full of unspoken feelings",
    dreamy: "floating through clouds in a half-awake dream",
    calm: "still water reflecting a clear morning sky",
    lonely: "walking alone on an empty street after midnight",
    sentimental: "bittersweet memories of days that won't return",
    'dawn-mood': "the quiet loneliness of 3am with city lights outside",
    nostalgic: "like finding an old photograph that brings tears",
    flutter: "butterflies in your stomach before a first date",
    love: "whispered promises under a starlit sky",
    breakup: "the ache of watching someone walk away forever",
    'feel-good': "sunshine after rain, everything feels right",
    refreshing: "crisp morning air on the first day of spring",
    exciting: "the rush of energy when the lights go on",
    groovy: "head-nodding rhythm that moves your whole body",
    'tension-up': "building anticipation before the big moment",
    powerful: "thundering energy that shakes your chest",
    confidence: "walking into a room like you own it",
    anger: "raw fury channeled into pure sonic force",
    focus: "laser-sharp concentration blocking everything else",
    study: "steady ambient flow for deep concentration",
    immersive: "completely absorbed, losing track of time",
    sleep: "drifting into peaceful sleep on a cloud",
    'sleep-aid': "gentle waves lulling you into deep rest",
    comfort: "a warm embrace saying everything will be okay",
    'stress-relief': "tension melting away with every breath",
    rainy: "raindrops tapping on the window, world fading away",
    snowy: "silent snowfall covering the world in white",
    dawn: "the stillness of dawn before the world wakes up",
    sunset: "golden hour glow painting the sky in warmth",
    running: "steady heartbeat rhythm pushing you forward"
};

// ============================================================
// v5 프롬프트 생성 (참고 자료 7개 반영)
// - Suno AI v5 전용 최고 수준 프롬프트 완전 가이드
// - Suno AI v5 메타태그 완전 정복 가이드
// - 10000_SUNO_Prompts 패턴 참고
// - Suno AI v5 음질 문제 완전 해결 가이드
// - Suno v5 전용 음질 최적화(믹싱마스터링) 프롬프트 공식
// - 빌보드급 메가 히트곡 구조 완전 분석가이드
// - 음악 장르별 보컬 완전 가이드
// ============================================================

// 장르별 조성(Key) 추천 맵
const GENRE_KEY_MAP = {
    // 감성/발라드 → 마이너 키
    '편안한': ['C major','G major','F major'],
    '감성적': ['A minor','D minor','E minor'],
    '잔잔한': ['C major','G major','D major'],
    '몽환적': ['F# minor','Bb minor','Eb major'],
    '쓸쓸한': ['A minor','E minor','B minor'],
    '센치한': ['D minor','G minor','C minor'],
    '이별': ['A minor','D minor','G minor'],
    '사랑': ['C major','F major','Bb major'],
    '설레는': ['D major','A major','E major'],
    '신나는': ['E major','A major','B major'],
    '파워풀한': ['E minor','A minor','D minor'],
    '분노': ['E minor','B minor','F# minor'],
    '그리운': ['G major','D major','A minor'],
    '_default': ['C major','G major','A minor','D major','E minor']
};

// 장르별 프로덕션 스타일 맵
const PRODUCTION_STYLE_MAP = {
    'pop': 'polished pop production, tight low-end, bright vocal presence',
    'rock': 'punchy rock mix, guitar-forward, dynamic drum compression',
    'hip hop': 'heavy 808 bass, crisp hi-hats, spacious vocal mix',
    'r&b': 'warm analog feel, smooth bass, silky vocal reverb',
    'electronic': 'wide stereo image, deep sub-bass, precise synth layering',
    'jazz': 'warm natural room tone, minimal compression, live instrument feel',
    'classical': 'concert hall ambience, natural dynamics, orchestral depth',
    'folk': 'organic acoustic recording, natural room reverb, warm tape feel',
    'metal': 'high-gain guitar wall, tight drum triggering, aggressive compression',
    'reggae': 'dub-style delay, heavy bass, laid-back groove mix',
    'latin': 'vibrant percussion mix, warm brass, rhythmic clarity',
    'country': 'Nashville production, warm acoustic, steel guitar shimmer',
    '_default': 'balanced professional mix, clear frequency separation'
};

// 장르별 보컬 강화 맵 (보컬 완전 가이드 반영)
const VOCAL_ENHANCEMENT_MAP = {
    'pop': { style: 'clean polished vocals, pitch-perfect delivery', technique: 'catchy melodic hooks, layered harmonies' },
    'ballad': { style: 'emotional expressive vocals, dynamic breath control', technique: 'powerful chorus belting, intimate verse whisper' },
    'r&b': { style: 'soulful smooth vocals, warm chest voice', technique: 'melodic runs, subtle vibrato, breathy intimacy' },
    'rock': { style: 'powerful raw vocals, gritty edge', technique: 'belted chorus, dynamic range from whisper to scream' },
    'hip hop': { style: 'confident rhythmic delivery, sharp articulation', technique: 'tight flow, punchy cadence, ad-libs' },
    'jazz': { style: 'sophisticated vocal phrasing, jazzy scatting', technique: 'behind-the-beat timing, warm vibrato, improvised runs' },
    'folk': { style: 'warm storytelling vocals, natural unpolished tone', technique: 'gentle fingerpicking-matched delivery, honest expression' },
    'electronic': { style: 'ethereal processed vocals, airy texture', technique: 'reverb-heavy delivery, layered vocal chops' },
    'metal': { style: 'powerful aggressive vocals, controlled intensity', technique: 'screaming chorus, clean verse contrast, growl accents' },
    '_default': { style: 'natural human vocals, controlled emotional delivery', technique: 'professional delivery, consistent tone' }
};

// 빌보드급 히트곡 구조 요소 (곡 구조 가이드 반영)
const BILLBOARD_ELEMENTS = {
    energy: [
        'dynamic build from verse to chorus',
        'emotional crescendo into chorus',
        'verse-chorus energy contrast'
    ],
    rhythm: [
        'syncopated groove with pocket feel',
        'tight rhythmic precision with human micro-timing',
        'groove-driven rhythm section'
    ],
    hook: [
        'memorable melodic hook',
        'catchy singalong chorus',
        'anthemic chorus melody'
    ]
};

function generatePrompt(selectedGenres, targetAges, places, moods, vocalOptions) {
    // vocalOptions = { type: 'male vocals', range: 'tenor', styles: ['belting', 'vibrato'] } (선택적)
    const mainGenre = selectedGenres[0];
    const subGenre = selectedGenres[1] || null;

    const mainData = GENRE_DATABASE.find(g => g.genre === mainGenre) || { genre: mainGenre, bpm: '100-120', instruments: '', vocal: '', desc: '', main: '', sub: '', mood: [] };
    const subData = subGenre ? (GENRE_DATABASE.find(g => g.genre === subGenre) || null) : null;

    // BPM 결정 (약간의 변동 추가)
    const bpmRange = mainData.bpm.split("-");
    const bpmMin = parseInt(bpmRange[0]);
    const bpmMax = parseInt(bpmRange[1]);
    const bpm = Math.round(bpmMin + (bpmMax - bpmMin) * (0.4 + Math.random() * 0.2));

    // 조성(Key) 결정 — 장르 분위기 기반
    const moodForKey = moods[0] || '_default';
    const korMoodMap = { comfortable:'편안한', healing:'힐링', calm:'잔잔한', emotional:'감성적', dreamy:'몽환적', lonely:'쓸쓸한', sentimental:'센치한', breakup:'이별', love:'사랑', flutter:'설레는', exciting:'신나는', powerful:'파워풀한', anger:'분노', nostalgic:'그리운' };
    const korMood = korMoodMap[moodForKey] || '_default';
    const keyOptions = GENRE_KEY_MAP[korMood] || GENRE_KEY_MAP['_default'];
    const selectedKey = keyOptions[Math.floor(Math.random() * keyOptions.length)];

    // 프로덕션 스타일 결정
    const mainCategory = (mainData.main || '').toLowerCase();
    const productionStyle = PRODUCTION_STYLE_MAP[mainCategory] || PRODUCTION_STYLE_MAP['_default'];

    // 보컬 강화 결정
    const vocalCategory = mainCategory.includes('ballad') ? 'ballad' : mainCategory;
    const vocalEnhance = VOCAL_ENHANCEMENT_MAP[vocalCategory] || VOCAL_ENHANCEMENT_MAP['_default'];

    // 빌보드 구조 요소 랜덤 선택
    const billboardEnergy = BILLBOARD_ELEMENTS.energy[Math.floor(Math.random() * BILLBOARD_ELEMENTS.energy.length)];
    const billboardRhythm = BILLBOARD_ELEMENTS.rhythm[Math.floor(Math.random() * BILLBOARD_ELEMENTS.rhythm.length)];
    const billboardHook = BILLBOARD_ELEMENTS.hook[Math.floor(Math.random() * BILLBOARD_ELEMENTS.hook.length)];

    // =============================================
    // v5 Style Prompt 조립 (프론트로드 원칙)
    // 구조: 장르 → BPM+Key → 감정묘사 → 악기 → 보컬 → 구조/리듬 → 프로덕션 → 품질보호
    // =============================================
    const parts = [];

    // === ① 장르 (1~2개, 프론트로드 맨 앞) ===
    parts.push(mainData.genre);
    if (subData) parts.push(`${subData.genre} fusion`);

    // === ② BPM + 조성 + 박자 ===
    parts.push(`${bpm} BPM`);
    parts.push(selectedKey);
    parts.push('4/4 time');

    // === ③ 감정 서술형 문장 (v5 핵심: 장면묘사) ===
    const moodSentences = moods.slice(0, 2).map(m => MOOD_SENTENCE_MAP[m]).filter(Boolean);
    if (moodSentences.length > 0) {
        parts.push(moodSentences[0]);
    }

    // === ④ 악기 (주악기 2~3개 + 블렌딩 1개, 질감 명시) ===
    if (mainData.instruments) {
        const mainInstr = mainData.instruments.split(', ').slice(0, 3);
        if (subData && subData.instruments) {
            const subInstr = subData.instruments.split(', ').slice(0, 1);
            parts.push([...mainInstr, ...subInstr].join(', '));
        } else {
            parts.push(mainInstr.join(', '));
        }
    }

    // === ⑤ 보컬 (사용자 선택 우선 → DB 보컬 + 장르별 강화) ===
    // 듀엣/남녀 혼합 보컬 절대 금지: 단일 보컬만 허용
    if (vocalOptions && vocalOptions.type) {
        const vParts = [];
        if (vocalOptions.type !== 'instrumental') {
            // duet vocals → 사용하지 않고 단일 보컬로 대체
            let vocalType = vocalOptions.type;
            if (/duet|male and female|남녀/i.test(vocalType)) {
                vocalType = 'female vocals';
            }
            // male + female 동시 포함 방지
            if (/male.*female|female.*male/i.test(vocalType)) {
                vocalType = vocalType.replace(/,?\s*(fe)?male\s*vocals?\s*/i, '').trim() || 'female vocals';
            }
            vParts.push(vocalType);
            if (vocalOptions.age) vParts.push(vocalOptions.age);
            if (vocalOptions.range) vParts.push(vocalOptions.range);
            if (vocalOptions.styles && vocalOptions.styles.length > 0) {
                vParts.push(...vocalOptions.styles.slice(0, 4));
            }
        }
        if (vParts.length > 0) {
            parts.push(vParts.join(', '));
        } else if (vocalOptions.type === 'instrumental') {
            parts.push('instrumental, no vocals');
        }
    } else if (mainData.vocal) {
        // DB 보컬에서도 듀엣/남녀 혼합 제거
        let dbVocal = mainData.vocal.split(', ').slice(0, 3).join(', ');
        dbVocal = dbVocal.replace(/,?\s*(male and female duet|duet vocals?)/gi, '').trim();
        parts.push(`${dbVocal || vocalEnhance.style}, ${vocalEnhance.technique}`);
    } else {
        parts.push(`${vocalEnhance.style}, ${vocalEnhance.technique}`);
    }

    // === ⑥ 두 번째 감정 서술 (공간 있으면) ===
    if (moodSentences.length > 1) {
        parts.push(moodSentences[1]);
    }

    // === ⑦ 빌보드급 구조/리듬 요소 ===
    parts.push(billboardHook);
    parts.push(billboardRhythm);
    parts.push(billboardEnergy);

    // === ⑧ 프로덕션 스타일 (장르별 맞춤) ===
    parts.push(productionStyle);

    // === ⑨ 품질 보호 블록 (프론트로드: 마지막=높은 가중치) ===
    // 음질 최적화 가이드 반영: 보컬 안전 + 노이즈 방지 + 라디오 레디
    parts.push('professional studio quality, clean production, consistent tonal balance throughout, no background noise, controlled reverb, pitch-perfect vocals, radio-ready sound');

    // === 950자 제한 적용 (우선순위 기반 축소) ===
    let stylePrompt = parts.join(', ');
    if (stylePrompt.length > MAX_PROMPT_LENGTH) {
        // 우선순위: 장르 > BPM/Key > 감정묘사 > 보컬 > 악기 > 품질보호
        const qualityBlock = 'professional studio quality, clean production, consistent tonal balance, no background noise, radio-ready sound';
        const coreParts = [parts[0]]; // 장르
        if (subData) coreParts.push(`${subData.genre} fusion`);
        coreParts.push(`${bpm} BPM`);
        coreParts.push(selectedKey);
        if (moodSentences[0]) coreParts.push(moodSentences[0]);
        if (mainData.vocal) coreParts.push(mainData.vocal.split(', ').slice(0, 3).join(', '));
        if (mainData.instruments) coreParts.push(mainData.instruments.split(', ').slice(0, 2).join(', '));
        coreParts.push(billboardHook);
        coreParts.push(qualityBlock);
        stylePrompt = coreParts.join(', ');

        if (stylePrompt.length > MAX_PROMPT_LENGTH) {
            stylePrompt = stylePrompt.substring(0, MAX_PROMPT_LENGTH - 3) + '...';
        }
    }

    // === Exclude Styles 생성 ===
    const excludeStyles = getExcludeStyles(mainData, subData, moods);

    // === More Options 생성 ===
    const moreOptions = getMoreOptions(mainData, subData, moods, stylePrompt);

    // === 한국어 설명 생성 ===
    const moodKorMap = { comfortable:'편안한', healing:'힐링', cozy:'포근한', warm:'따뜻한', snug:'아늑한', emotional:'감성적', dreamy:'몽환적', calm:'잔잔한', lonely:'쓸쓸한', sentimental:'센치한', 'dawn-mood':'새벽감성', nostalgic:'그리운', flutter:'설레는', love:'사랑', breakup:'이별', 'feel-good':'기분좋은', refreshing:'상쾌한', exciting:'신나는', groovy:'흥겨운', 'tension-up':'텐션업', powerful:'파워풀한', confidence:'자신감', anger:'분노', focus:'집중', study:'공부할때', immersive:'몰입', sleep:'잠잘때', 'sleep-aid':'수면유도', comfort:'위로', 'stress-relief':'스트레스해소', rainy:'비오는날', snowy:'눈오는날', dawn:'새벽', sunset:'일몰', running:'달릴때' };
    const moodKorTexts = moods.map(m => moodKorMap[m] || m).join(', ');

    let korExplanation = `\u25B6 장르: "${mainData.genre}"(메인)`;
    if (subData) korExplanation += ` + "${subData.genre}"(블렌딩) 혼합`;
    korExplanation += `\n\u25B6 설명: ${mainData.desc || ''}`;
    if (subData && subData.desc) korExplanation += ` ${subData.desc}`;
    korExplanation += `\n\u25B6 분위기: ${moodKorTexts}`;
    korExplanation += `\n\u25B6 템포: ${bpm} BPM (${bpm < 80 ? '느린' : bpm < 110 ? '보통' : bpm < 130 ? '약간 빠른' : '빠른'} 속도)`;
    korExplanation += `\n\u25B6 조성: ${selectedKey}`;
    korExplanation += `\n\u25B6 프로덕션: ${mainCategory || '범용'} 전용 믹싱`;
    // === Simple Prompt 생성 (500자 미만) ===
    const simplePrompt = generateSimplePrompt(stylePrompt, mainData, subData, moods, bpm, selectedKey);

    korExplanation += `\n\u25B6 글자수: Full ${stylePrompt.length}자 / Simple ${simplePrompt.length}자`;

    return {
        stylePrompt,
        simplePrompt,
        excludeStyles,
        moreOptions,
        korExplanation,
        mainGenre: mainData,
        subGenre: subData
    };
}

// ============================================================
// Simple Mode 프롬프트 생성 (Suno AI Simple 모드용, 450자 이하)
// Full 프롬프트의 모든 요소를 유지하되, Suno v5 인식 키워드로 압축
// ============================================================

// Full→Simple 압축 맵 (Suno v5에서 100% 인식되는 단축 키워드)
const SIMPLE_COMPRESS_MAP = {
    // 품질 보호 압축
    'professional studio quality': 'studio quality',
    'clean production': 'clean mix',
    'consistent tonal balance throughout': 'balanced tone',
    'no background noise': 'no noise',
    'controlled reverb': 'tight reverb',
    'pitch-perfect vocals': 'pitch-perfect vocal',
    'radio-ready sound': 'radio-ready',
    'clean and polished production': 'clean mix',
    // 프로덕션 스타일 압축
    'polished pop production, tight low-end, bright vocal presence': 'polished pop mix',
    'punchy rock mix, guitar-forward, dynamic drum compression': 'punchy rock mix',
    'heavy 808 bass, crisp hi-hats, spacious vocal mix': '808 bass, crisp hi-hats',
    'warm analog feel, smooth bass, silky vocal reverb': 'warm analog mix',
    'wide stereo image, deep sub-bass, precise synth layering': 'wide stereo, deep bass',
    'warm natural room tone, minimal compression, live instrument feel': 'natural live room',
    'concert hall ambience, natural dynamics, orchestral depth': 'concert hall sound',
    'organic acoustic recording, natural room reverb, warm tape feel': 'organic acoustic',
    'high-gain guitar wall, tight drum triggering, aggressive compression': 'high-gain guitars, tight drums',
    'dub-style delay, heavy bass, laid-back groove mix': 'dub delay, heavy bass',
    'vibrant percussion mix, warm brass, rhythmic clarity': 'vibrant percussion, warm brass',
    'Nashville production, warm acoustic, steel guitar shimmer': 'Nashville sound, steel guitar',
    'balanced professional mix, clear frequency separation': 'balanced pro mix',
    // 빌보드 구조 압축
    'dynamic build from verse to chorus': 'verse-to-chorus build',
    'emotional crescendo into chorus': 'emotional chorus crescendo',
    'verse-chorus energy contrast': 'verse-chorus contrast',
    'syncopated groove with pocket feel': 'syncopated groove',
    'tight rhythmic precision with human micro-timing': 'tight human groove',
    'groove-driven rhythm section': 'groove rhythm',
    'memorable melodic hook': 'melodic hook',
    'catchy singalong chorus': 'singalong chorus',
    'anthemic chorus melody': 'anthemic chorus',
    // 보컬 강화 압축
    'catchy melodic hooks, layered harmonies': 'catchy hooks, harmonies',
    'powerful chorus belting, intimate verse whisper': 'belted chorus, whispered verse',
    'melodic runs, subtle vibrato, breathy intimacy': 'melodic runs, vibrato',
    'belted chorus, dynamic range from whisper to scream': 'belted chorus, dynamic range',
    'tight flow, punchy cadence, ad-libs': 'tight flow, ad-libs',
    'behind-the-beat timing, warm vibrato, improvised runs': 'behind-beat phrasing, vibrato',
    'gentle fingerpicking-matched delivery, honest expression': 'gentle honest delivery',
    'reverb-heavy delivery, layered vocal chops': 'reverb vocals, vocal chops',
    'screaming chorus, clean verse contrast, growl accents': 'scream chorus, clean verse',
    'professional delivery, consistent tone': 'pro delivery',
    // 감정 서술 압축
    'like settling into a warm couch on a quiet evening': 'warm cozy evening mood',
    'like a gentle breeze healing the soul': 'gentle healing breeze',
    'wrapped in a soft blanket on a winter night': 'soft winter night',
    'warm sunlight through a window on a lazy afternoon': 'warm lazy afternoon',
    'cozy and intimate like a candlelit room': 'candlelit intimate mood',
    'like a letter you never sent, full of unspoken feelings': 'unspoken emotional depth',
    'floating through clouds in a half-awake dream': 'dreamy floating clouds',
    'still water reflecting a clear morning sky': 'calm morning stillness',
    'walking alone on an empty street after midnight': 'lonely midnight walk',
    'bittersweet memories of days that won\'t return': 'bittersweet nostalgia',
    'the quiet loneliness of 3am with city lights outside': 'lonely 3am city lights',
    'like finding an old photograph that brings tears': 'tearful old memories',
    'butterflies in your stomach before a first date': 'first date butterflies',
    'whispered promises under a starlit sky': 'starlit whispered love',
    'the ache of watching someone walk away forever': 'heartbreak farewell ache',
    'sunshine after rain, everything feels right': 'sunshine after rain',
    'crisp morning air on the first day of spring': 'crisp spring morning',
    'the rush of energy when the lights go on': 'energetic rush, lights on',
    'head-nodding rhythm that moves your whole body': 'head-nodding groove',
    'building anticipation before the big moment': 'building anticipation',
    'thundering energy that shakes your chest': 'thundering chest energy',
    'walking into a room like you own it': 'confident swagger',
    'raw fury channeled into pure sonic force': 'raw fury sonic force',
    'laser-sharp concentration blocking everything else': 'laser-sharp focus',
    'steady ambient flow for deep concentration': 'ambient focus flow',
    'completely absorbed, losing track of time': 'deep immersion',
    'drifting into peaceful sleep on a cloud': 'peaceful sleep drift',
    'gentle waves lulling you into deep rest': 'gentle sleep waves',
    'a warm embrace saying everything will be okay': 'warm comforting embrace',
    'tension melting away with every breath': 'tension melting away',
    'raindrops tapping on the window, world fading away': 'raindrops on window',
    'silent snowfall covering the world in white': 'silent white snowfall',
    'the stillness of dawn before the world wakes up': 'still dawn silence',
    'golden hour glow painting the sky in warmth': 'golden hour glow',
    'steady heartbeat rhythm pushing you forward': 'heartbeat running rhythm'
};

function generateSimplePrompt(fullStylePrompt, mainData, subData, moods, bpm, key) {
    const MAX_SIMPLE = 450;

    // Full 프롬프트를 압축 맵으로 치환 (긴 표현 → 짧은 v5 키워드)
    let simple = fullStylePrompt;

    // 긴 표현부터 먼저 치환 (부분 매칭 방지)
    const sortedEntries = Object.entries(SIMPLE_COMPRESS_MAP)
        .sort((a, b) => b[0].length - a[0].length);

    for (const [longForm, shortForm] of sortedEntries) {
        if (simple.includes(longForm)) {
            simple = simple.replace(longForm, shortForm);
        }
    }

    // 450자 이하면 바로 반환
    if (simple.length <= MAX_SIMPLE) return simple;

    // 아직 초과 시: 추가 압축 (중복 쉼표 정리 + 불필요 공백 제거)
    simple = simple.replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ').trim();

    // 그래도 초과 시: 4/4 time 제거
    if (simple.length > MAX_SIMPLE) {
        simple = simple.replace(/, 4\/4 time/, '');
    }

    // 그래도 초과 시: 마지막 쉼표 기준으로 자르기 (완전한 키워드 유지)
    if (simple.length > MAX_SIMPLE) {
        const cut = simple.substring(0, MAX_SIMPLE);
        const lastComma = cut.lastIndexOf(',');
        simple = lastComma > 0 ? cut.substring(0, lastComma).trim() : cut.trim();
    }

    return simple;
}

// Exclude Styles (음질 문제 해결 가이드 반영)
// ============================================================
function getExcludeStyles(mainData, subData, moods) {
    const excludes = [];

    // === 장르 분위기 기반 상반 스타일 제외 ===
    const calmMoods = ["편안한","힐링","잔잔한","잠잘때","수면유도"];
    const energyMoods = ["신나는","텐션업","파워풀한","분노"];

    if (mainData.mood && mainData.mood.some(m => calmMoods.includes(m))) {
        excludes.push("metal", "hardcore", "screamo", "thrash", "deathcore", "industrial", "aggressive");
    }
    if (mainData.mood && mainData.mood.some(m => energyMoods.includes(m))) {
        excludes.push("ambient", "meditation", "lullaby", "drone", "spa", "sleepy");
    }

    // === 사용자 분위기 기반 제외 ===
    const hasCalmMood = moods.some(m => ["calm", "sleep", "sleep-aid", "comfortable", "healing"].includes(m));
    const hasEnergeticMood = moods.some(m => ["exciting", "powerful", "tension-up", "anger", "running"].includes(m));
    const hasDreamyMood = moods.some(m => ["dreamy", "dawn-mood", "dawn"].includes(m));
    const hasFocusMood = moods.some(m => ["focus", "study", "immersive"].includes(m));

    if (hasCalmMood) {
        excludes.push("distorted", "screaming", "harsh noise", "heavy metal", "aggressive drums");
    }
    if (hasEnergeticMood) {
        excludes.push("lullaby", "meditation", "minimal ambient", "ASMR");
    }
    if (hasDreamyMood) {
        excludes.push("harsh", "aggressive", "distorted", "heavy percussion");
    }
    if (hasFocusMood) {
        excludes.push("vocal ad-libs", "sudden dynamics", "crowd noise");
    }

    // === 음질 보호 기본 제외 (음질 가이드 반영) ===
    // 과도한 프로세싱 방지
    excludes.push("excessive reverb", "clipping", "lo-fi artifacts");

    // === 장르 간 충돌 방지 ===
    if (subData) {
        const mainCat = (mainData.main || '').toLowerCase();
        const subCat = (subData.main || '').toLowerCase();
        // 큰 차이의 크로스오버 시 중간 지대 스타일 제외
        if (mainCat !== subCat) {
            if (mainCat.includes('electronic') && subCat.includes('folk')) {
                excludes.push("heavy bass drops", "extreme synthesizers");
            }
            if (mainCat.includes('classical') && subCat.includes('hip hop')) {
                excludes.push("trap bass", "auto-tune");
            }
        }
    }

    // 중복 제거
    return [...new Set(excludes)].join(", ");
}

// ============================================================
// More Options (v5 가이드 슬라이더 추천값 반영)
// ============================================================
function getMoreOptions(mainData, subData, moods, stylePrompt) {
    let weirdness = 50;
    let styleInfluence = 50;

    const prompt = (stylePrompt || '').toLowerCase();
    const mainGenre = (mainData.main || '').toLowerCase();

    // ===== WEIRDNESS 계산 (v5 가이드 추천값 기반) =====
    // 팝/발라드: 10~25 / 록: 20~40 / 재즈: 40~60 / 실험적: 60~80
    const experimentalGenres = ['hyper pop', 'glitch', 'idm', 'avant', 'psychedelic', 'dark pop', 'darkwave', 'industrial'];
    const traditionalGenres = ['classical', 'country', 'folk', 'gospel', 'blues', 'new age', 'ballad', 'acoustic'];
    const jazzGenres = ['jazz', 'bebop', 'smooth jazz', 'fusion'];
    const rockGenres = ['rock', 'alternative', 'punk', 'grunge', 'metal'];
    const mainstreamGenres = ['mainstream pop', 'dance pop', 'k-pop', 'pop rock', 'reggaeton', 'pop'];

    if (experimentalGenres.some(g => prompt.includes(g))) {
        weirdness = 60 + Math.round(Math.random() * 20); // 60-80
    } else if (jazzGenres.some(g => prompt.includes(g))) {
        weirdness = 40 + Math.round(Math.random() * 20); // 40-60
    } else if (rockGenres.some(g => prompt.includes(g))) {
        weirdness = 20 + Math.round(Math.random() * 20); // 20-40
    } else if (traditionalGenres.some(g => prompt.includes(g))) {
        weirdness = 10 + Math.round(Math.random() * 15); // 10-25
    } else if (mainstreamGenres.some(g => prompt.includes(g))) {
        weirdness = 10 + Math.round(Math.random() * 15); // 10-25
    }

    // 분위기 보정
    if (moods.includes("dreamy")) weirdness += 15;
    if (moods.includes("calm") || moods.includes("sleep") || moods.includes("sleep-aid")) weirdness -= 10;
    if (moods.includes("feel-good") || moods.includes("exciting")) weirdness -= 5;
    if (moods.includes("emotional") || moods.includes("flutter")) weirdness -= 8;

    // 장르 블렌딩 시 크로스오버 → weirdness 상승
    if (subData && mainData.main !== subData.main) {
        weirdness += 10;
    }

    // ===== STYLE INFLUENCE 계산 (v5 가이드 기반) =====
    // 새 스타일 탐색: 40~60% / 정확한 재현: 70~85%
    if (!subData) {
        styleInfluence = 70 + Math.round(Math.random() * 15); // 70-85 (단일 장르: 정확한 재현)
    } else if (mainData.main === subData.main) {
        styleInfluence = 55 + Math.round(Math.random() * 15); // 55-70 (같은 계열)
    } else {
        styleInfluence = 40 + Math.round(Math.random() * 20); // 40-60 (크로스오버: 탐색 여지)
    }

    // 장르별 보정
    if (mainGenre.includes('electronic') || mainGenre.includes('hip hop')) {
        styleInfluence -= 5;
    }
    if (mainGenre.includes('classical') || mainGenre.includes('jazz')) {
        styleInfluence += 5;
    }

    // 범위 제한 (5~95)
    weirdness = Math.max(5, Math.min(95, Math.round(weirdness)));
    styleInfluence = Math.max(5, Math.min(95, Math.round(styleInfluence)));

    return { weirdness, styleInfluence };
}

// ========== 공통: 섹션 숨기기/표시하기 토글 ==========
function initSectionToggles() {
    document.querySelectorAll('.setting-title, .step-title').forEach(title => {
        const group = title.closest('.setting-group') || title.closest('.step-header');
        if (!group) return;
        if (title.dataset.toggleInit) return;
        title.dataset.toggleInit = 'true';

        const parent = group.parentElement || group;
        const children = Array.from(group.parentElement === group ? group.children : parent.children).filter(c => c !== group && c !== title && !c.classList.contains('step-header'));

        title.style.cursor = 'pointer';
        title.addEventListener('click', (e) => {
            if (e.target.closest('.auto-badge, .pro-badge, .toggle-btn, button, a, input, select')) return;
            const isHidden = title.dataset.collapsed === 'true';
            title.dataset.collapsed = isHidden ? 'false' : 'true';

            const siblings = Array.from(group.children).filter(c => c !== title);
            siblings.forEach(c => { c.style.display = isHidden ? '' : 'none'; });
        });
    });
}

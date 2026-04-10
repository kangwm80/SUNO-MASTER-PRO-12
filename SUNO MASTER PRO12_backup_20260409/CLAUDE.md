# SUNO MASTER PRO 12 - 프로젝트 지시서

## 프로젝트 개요
- Suno AI로 음악 만들기를 쉽게 도와주는 웹 도구 (시니어 친화)
- 순수 HTML/CSS/JS 프론트엔드 앱 (백엔드 없음, localStorage 사용)
- 3가지 모드(쉽게/직접/전문가) + 가사작업 + 보관함

## 참고 자료 경로
모든 자료는 GitHub 저장소 루트에 업로드되어 있다.
추가 자료: `이것만보면_음악장르마스터Ver3.pdf` (196개 장르 · 406개 프롬프트 예시)

## 자료별 용도 — 작업할 때 해당 파일을 읽어서 반영할 것

### 장르 분류 체계
- `SUNO_Genre_Classification_v4.pdf` → genre-data.js의 원본. 장르 추가/수정 시 참고

### 프롬프트 생성 관련 (Style Prompt 만들 때)
- `Suno AI v5 전용 최고 수준 프롬프트 완전 가이드.txt` → 프롬프트 작성 규칙/공식
- `Suno AI v5 메타태그 완전 정복 가이드.txt` → 메타태그 사용법
- `10000_SUNO_Prompts_Part_1~3.txt` → 실제 프롬프트 예시 1만개 (패턴 참고용)

### 음질/믹싱 관련 (품질 보호 블록, Exclude Styles 만들 때)
- `Suno AI v5 음질 문제 완전 해결 가이드.txt` → 음질 문제 원인과 해결법
- `Suno v5 전용 음질 최적화(믹싱마스터링) 프롬프트 공식.txt` → 믹싱/마스터링 프롬프트

### 보컬 관련 (보컬 프롬프트 만들 때)
- `음악 장르별 보컬 완전 가이드.txt` → 장르별 보컬 스타일/톤/창법

### 곡 구조 관련 (Song Form, 곡 구성 설정할 때)
- `음악 장르별 송폼(Song Form) 구조 완전 가이드.txt` → 장르별 곡 구조
- `빌보드급 메가 히트곡 구조 완전 분석가이드.txt` → 히트곡 구조 분석

### 가사/제목 관련 (lyrics.html 작업할 때)
- `빌보드급 음악 제작 & 작사 완전 가이드 (글로벌 장르 확장판).txt` → 작사 가이드
- `세대별 언어 완전 가이드 & 노래 가사·제목 적용법.txt` → 세대별 가사 언어 스타일
- `Song_Themes_FINAL_v5.pdf` → 노래 테마 데이터 (song-themes.js의 원본)

### 연령/타겟 관련 (타겟층 설정, 장르 추천할 때)
- `전 세계 연령대별 음악 장르 선호도 분석.txt` → 연령별 장르 선호도 데이터

## 테스트 결과물 (건드리지 말 것)
프로젝트 폴더 안의 아래 파일들은 사용자가 테스트할 때 생성된 결과물이다:
- `SUNO_Custom_*.txt`
- `SUNO_Prompt_*.txt`
- `레퍼런스 노래가사.txt`

## UI 패턴 규칙
- 쉽게/직접/전문가/노래제목&가사 메뉴의 단계별 흐름 → 반드시 **Wizard Pattern + Cascading Selection** 적용
- 각 단계에 "적용하기" 버튼 → 확정 후 다음 단계에 데이터 전파
- 상위 단계 변경 시 하위 단계 확정 자동 해제

## 프롬프트 생성 규칙 (generatePrompt 함수 — genre-data.js)
모든 프롬프트 생성 메뉴(쉽게/직접/전문가)에 동일 적용. 아래 참고 자료를 반드시 반영할 것.

### Style Prompt 구조 (v5 프론트로드 원칙 + 10000 Prompts 패턴)
1. **장르** (1~2개, 맨 앞 배치) → 프롬프트 가이드 + 장르 분류 체계
2. **BPM + 조성(Key) + 박자** → 프롬프트 가이드
3. **Mood Atmosphere** (2~3개 무드 형용사 조합) → 10000 Prompts 패턴
4. **감정 서술형 문장** (단어 나열 ❌ → 장면 묘사 ✅) → 프롬프트 가이드
5. **악기** (주악기 2~3개 + 블렌딩 1개) → 장르 분류 체계 + 장르마스터 PDF
6. **보컬** (DB 필드 + 장르별 창법 강화) → 보컬 완전 가이드
7. **빌보드 구조 요소** (hook + rhythm + energy build) → 히트곡 구조 가이드
8. **프로덕션 스타일** (장르별 맞춤 믹싱/마스터링) → 음질 최적화 공식
9. **퍼포먼스 노트** (breath, phrasing, micro-timing 등) → 프롬프트 가이드 + 10000 Prompts
10. **품질 보호 블록** (shimmer/noise/reverb/pitch 방지) → 음질 문제 해결 가이드
11. **스토리 테마** ("song about X" 엔딩) → 10000 Prompts 패턴

### Exclude Styles 규칙
- 장르 분위기 상반 스타일 제외 → 음질 문제 해결 가이드
- 음질 보호 기본 제외 (excessive reverb, clipping, lo-fi artifacts)
- 장르 간 충돌 방지 (크로스오버 시)

### More Options 슬라이더
- **Weirdness**: 팝/발라드 10~25 / 록 20~40 / 재즈 40~60 / 실험적 60~80 → 프롬프트 가이드
- **Style Influence**: 정확한 재현 70~85% / 탐색 40~60% → 프롬프트 가이드

## 참고 자료 반영 상태 (2026-04-10 기준)
| 자료 | 반영 위치 | 상태 |
|------|-----------|------|
| SUNO_Genre_Classification_v4.pdf | genre-data.js GENRE_DATABASE (202개 장르) | ✅ |
| 프롬프트 완전 가이드 | genre-data.js (프롬프트 구조, Performance Notes) | ✅ |
| 메타태그 가이드 | lyrics.js buildMetaTagsForSection() | ✅ |
| 10000_SUNO_Prompts 1~3 | genre-data.js (MOOD_ATMOSPHERE_MAP, STORY_THEME_MAP, PERFORMANCE_NOTES) | ✅ |
| 음질 문제 해결 가이드 | genre-data.js (품질 보호 블록, getExcludeStyles) | ✅ |
| 음질 최적화 프롬프트 공식 | genre-data.js PRODUCTION_STYLE_MAP (14개 장르) | ✅ |
| 보컬 완전 가이드 | genre-data.js VOCAL_ENHANCEMENT_MAP (15개 장르) | ✅ |
| 히트곡 구조 분석가이드 | genre-data.js BILLBOARD_ELEMENTS | ✅ |
| 송폼 구조 가이드 | lyrics.js GENRE_SONGFORM (24개 장르) | ✅ |
| 작사 완전 가이드 | lyrics.js BILLBOARD_TITLE_PATTERNS, LYRICS_DENSITY | ✅ |
| 세대별 언어 가이드 | lyrics.js GEN_GUIDE (4세대 + 선호장르/작사팁) | ✅ |
| Song_Themes_FINAL_v5.pdf | song-themes.js (22주제 600스토리) | ✅ |
| 연령대별 장르 선호도 | genre-data.js AGE_GENRE_PREFERENCE (10개 타겟) | ✅ |
| 이것만보면_음악장르마스터Ver3.pdf | genre-data.js (196개 장르 커버 확인, 프롬프트 패턴 반영) | ✅ |

## 작업 규칙
- 구현 시 1-2개 빠뜨리는 실수 절대 금지 (빠짐없이 작업할 것)
- 장소/상황은 템플릿 조합 금지, 진심·공감 담긴 장면 직접 창작
- 코드 수정 완료 후 반드시 시나리오 시뮬레이션 + 엣지케이스 검증 후 결과 제공
- 수정/추가 요청 시 더 좋은 의견이나 아이디어가 있으면 먼저 제안할 것
- 업그레이드된 내용은 CLAUDE.md에 반영할 것

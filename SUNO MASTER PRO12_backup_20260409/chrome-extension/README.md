# AI Service Connector v2 (서버 없이 동작)

## 작동 원리 (아주 쉽게)

```
내 프로그램 (localhost:8080)
  ↓ "Suno 곡 생성" 버튼 클릭
  ↓
크롬 확장프로그램이 중간에서 처리
  ↓
suno.com/create 페이지가 자동으로 열림
  ↓
가사, 스타일, 제목이 자동으로 입력됨
  ↓
직접 확인 후 Create 버튼 클릭 (또는 자동)
```

---

## 설치 방법

### 1단계: 기존 확장프로그램 제거

이전 v1 확장프로그램이 설치되어 있다면:
1. chrome://extensions/ 접속
2. "AI Service Connector" 찾아서 제거

### 2단계: v2 설치

1. 이 폴더(ai-cookie-connector-v2)를 PC에 저장
2. chrome://extensions/ 접속
3. "개발자 모드" 켜기
4. "압축 해제된 확장프로그램을 로드합니다" 클릭
5. ai-cookie-connector-v2 폴더 선택

### 3단계: Suno 로그인

1. 크롬에서 suno.com 접속
2. 본인 계정으로 로그인
3. 확장프로그램 아이콘 클릭 → 초록색 점 확인

---

## 내 프로그램(HTML)에 연동하는 방법

localhost:8080에서 돌아가는 내 HTML 프로그램에
아래 코드를 추가하면 됩니다.

### Claude Code에게 이렇게 말하세요:

"기존 프로그램에 Suno 곡 생성 버튼을 추가해줘.
버튼을 누르면 아래 코드처럼 window.postMessage를 보내도록 해줘.

window.postMessage({
  type: 'SUNO_GENERATE',
  title: '제목 변수',
  lyrics: '가사 변수',
  style: '스타일 변수'
}, '*');

기존에 생성된 가사, 제목, 스타일 데이터를 위 메시지에 담아서 보내줘."

---

## 파일 설명

- manifest.json → 확장프로그램 설정
- popup.html / popup.js → 확장프로그램 팝업 (Suno 연결 상태 확인)
- background.js → Suno 탭 열기 처리
- content-localhost.js → 내 프로그램(localhost)에 자동 주입, 하단 바 추가
- content-suno.js → suno.com에 자동 주입, 폼 자동 입력
- example-integration.html → 내 프로그램에 추가할 코드 예시

---

## 주의사항

- Suno에 로그인된 상태에서만 작동합니다
- Suno UI가 업데이트되면 content-suno.js의 선택자 수정이 필요합니다
- 현재는 자동 입력까지만 하고, Create 클릭은 직접 해야 합니다
  (자동 클릭을 원하면 content-suno.js에서 주석 해제)

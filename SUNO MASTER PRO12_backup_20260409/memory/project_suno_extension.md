---
name: Suno 확장 프로그램 통합 방향
description: 현재 크롬 확장 프로그램 사용 중이나 향후 앱 전환 시 직접 API 호출 방식으로 변경 예정
type: project
---

현재 Suno 곡 생성 기능은 크롬 확장 프로그램(chrome-extension/)을 통해 동작.
**Why:** 웹앱(localhost)에서 suno.com의 쿠키/세션에 직접 접근할 수 없어서 확장 프로그램이 중계 역할.
**How to apply:** 향후 앱(데스크톱/모바일)으로 전환할 때 확장 프로그램 제거하고 Suno API 직접 호출 방식(옵션 3)으로 전환해야 함. 앱에서는 세션 관리를 자체적으로 처리.

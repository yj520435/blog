# 포트폴리오

![portfolio](https://github.com/user-attachments/assets/40cc5479-420f-4003-9afe-2d3e6d73db9e)

## 프로젝트 소개

Vue3 기반으로 구현한 포트폴리오입니다.

* 기술스택: 보유 기술 리스트
* 경력사항: 근무 이력 및 진행 프로젝트 리스트
* 프로젝트: 개인 프로젝트 리스트
* 아카이브: 문서 기록

## 작업 내용

### 구글 드라이브 연동

Google Drive API를 이용해 아카이브 섹션의 파일들을 로드합니다.  
별도의 인증 과정을 거치지 않고 누구나 파일에 접근할 수 있도록 하기 위해 다음 두 가지 방법을 이용합니다.

1. Google Drive API 호출 - Google Cloud Console에서 발급한 API KEY를 파라미터로 전달
2. Google App Script 배포 URL 호출

### 컨텐츠 로드

* markdown - html 변환: [vue-showdown](https://vue-showdown.js.org/)
* 코드블록 하이라이트: [highlightjs](https://highlightjs.org/)

### Pinia를 이용한 상태 관리

로드한 폴더 정보를 저장하여 API 호출 횟수를 최소화합니다.

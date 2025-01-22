# 포트폴리오

![portfolio_ez](https://github.com/user-attachments/assets/1effe6a7-5e7e-4a40-9fba-20b975d25235)

## 프로젝트 소개

Vue3 기반으로 구현한 포트폴리오입니다.

* 기술스택: 보유 기술 리스트
* 경력사항: 근무 이력 및 진행 프로젝트 리스트
* 아카이브: 학습 파일 (정리중)
* 프로젝트: 개인 프로젝트 리스트

## 동적 컨텐츠 로드

구글 드라이브에 저장된 파일을 로드하는 방식을 사용하여 **추가 커밋 없이도 문서 컨텐츠를 변경할 수 있습니다.**<br>
별도의 인증 과정을 거치지 않고 누구나 파일에 접근할 수 있도록 하기 위해 다음 두 가지 방법을 이용합니다.

1. Google Drive API 호출 - Google Cloud Console에서 발급한 API KEY를 파라미터로 전달
2. Google App Script 배포 URL 호출

```typescript
export async function loadFolder(id: string) {
  const url = `.../drive/v3/files?q="${id}"+in+parents&key=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = (await response.json()).files;
      return data;
    } else {
      // except for network error (ex. 403, 404)
      const data = await reloadFolder(id);
      return data;
    }
  } catch (e) {
    console.error(e);
    const data = await reloadFolder(id);
    return data;
  }
}
```

```typescript
async function reloadFolder(id: string) {
  try {
    const response = await axios({
      url: API_URL,
      method: 'get',
      params: /*...*/
    });
    return response.data?.result;
  } catch (e) {
    console.error(e);
    return [];
  }
}
```

## Pinia를 이용한 상태 관리

로드한 폴더 정보를 저장하여 API 호출 횟수를 최소화합니다.

```typescript
export const useStore = defineStore('store', () => {
  const folderItemsMap: Ref<{ id: string; items: any }[]> = ref([]);

  function setFolder(id: string, items: any) {
    folderItemsMap.value.push({ id, items });
  }

  return {
    setFolder,
  };
})
```

## 진행중 작업

* Google Cloud Console에 등록된 **OAuth 2.0 클라이언트 정보**를 이용하여 포트폴리오 웹에서 구글 드라이브 파일을 관리할 수 있도록 추가 작업중입니다.
  * [vue3-google-login](https://devbaji.github.io/vue3-google-login/) 라이브러리를 사용합니다.
* 그동안 작성한 구글 문서(Docs)를 포트폴리오 웹에서 로드 가능한 마크다운 형식으로 정리하고 있습니다.
  * [vue-showdown](https://vue-showdown.js.org/) 라이브러리를 사용하여 마크다운 컨텐츠를 HTML로 변환합니다.

import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useStore = defineStore('store', () => {
  // 폴더, 하위 아이템 저장
  const folderItemsMap: Ref<{ id: string; items: any }[]> = ref([]);

  function setFolder(id: string, items: any) {
    folderItemsMap.value.push({ id, items });
  }

  function getFolder(id: string) {
    return folderItemsMap.value.find((v) => v.id === id);
  }

  // 파일, 컨텐츠 저장
  const fileContentsMap: Ref<{ id: string; contents: any }[]> = ref([]);

  function setFile(id: string, contents: any) {
    fileContentsMap.value.push({ id, contents });
  }

  function getFile(id: string) {
    return fileContentsMap.value.find((v) => v.id === id);
  }

  // 이력 페이지 체크박스 상태 저장
  const checkboxStatus = ref({
    keyword: true,
    period: false,
  });

  return {
    setFolder,
    getFolder,
    setFile,
    getFile,
    checkboxStatus,
  };
});

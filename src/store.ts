import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useStore = defineStore('store', () => {
  // Folder & Sub-folder
  const folderItemsMap: Ref<{ id: string; items: any }[]> = ref([]);

  function setFolder(id: string, items: any) {
    folderItemsMap.value.push({ id, items });
  }

  function getFolder(id: string) {
    return folderItemsMap.value.find((v) => v.id === id);
  }

  // File & Contents
  const fileContentsMap: Ref<{ id: string; contents: any }[]> = ref([]);

  function setFile(id: string, contents: any) {
    fileContentsMap.value.push({ id, contents });
  }

  function getFile(id: string) {
    return fileContentsMap.value.find((v) => v.id === id);
  }

  return {
    setFolder,
    getFolder,
    setFile,
    getFile,
  };
});

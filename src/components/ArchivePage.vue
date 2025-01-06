<script setup lang="ts">
import { FOLDER_MIME_TYPE } from '@/constants';
import { useStore } from '@/store';
import { File, MimeType } from '@/types/base';
import { loadFolder, sortAlphabetically } from '@/utils';
import { onMounted, Ref, ref, defineEmits, watch, computed } from 'vue';

const emits = defineEmits(['load'])

const store = useStore()
const ROOT = '101ySHAx1_ay6MZQy-69klLcz8l_vf_X2'

const loading: Ref<boolean> = ref(true)

function filterAndSort(data: any) {
  // Filter
  const filteredDirectories = data.filter(
    (v: File) => v.mimeType === FOLDER_MIME_TYPE
  )
  const filteredFiles = data.filter(
    (v: File) => v.mimeType !== FOLDER_MIME_TYPE
  )

  // Sort
  const sortedDirectories = filteredDirectories.sort(
    (a: File, b: File) => sortAlphabetically(a.name, b.name)
  )
  files.value = sortedDirectories
  const sortedFiles = filteredFiles.sort(
    (a: File, b: File) => sortAlphabetically(a.name, b.name)
  )

  return sortedDirectories.concat(sortedFiles)
}

const files: Ref<File[]> = ref([])
async function load(id: string) {
  files.value = []
  loading.value = true

  const storedFiles = store.getFolder(id)
  if (storedFiles) {
    files.value = storedFiles.items
  }
  else {
    const result = await loadFolder(id)
    if (result.length > 0) {
      files.value = filterAndSort(result)
    }
    store.setFolder(id, files.value)
  }

  loading.value = false
}

const sectionRef = ref()
const computedGap = ref(0)

function computeGap() {
  const width = sectionRef.value.offsetWidth
  const itemCnt = Math.trunc(width / 110)
  computedGap.value = (width % 110) / (itemCnt - 1)
}


onMounted(async () => {
  computeGap()
  await load(ROOT)
})

function getIcon(mimeType: MimeType) {
  switch (mimeType) {
    case 'text/x-markdown':
      return 'file'
    case 'application/vnd.google-apps.folder':
      return 'folder'
    default:
      return ''
  }
}

const paths: Ref<File[]> = ref([])

async function open(file: File) {
  // Folder
  if (file.mimeType === FOLDER_MIME_TYPE) {
    paths.value.push(file)
    await load(file.id)
  }
  // File
  else {
    emits('load', file)
  }
}

const computedPaths = computed(() => paths.value.length)

watch(computedPaths, async () => {
  await reload()
})

async function reload() {
  const id = paths.value.length > 0 ? paths.value[paths.value.length - 1].id : ROOT
  await load(id)
}

const searchWord: Ref<string> = ref('')

watch(searchWord, (v) => {

})
</script>

<template>
  <main id="archive" class="component">
    <header>
      <div class="lt">
        <button @click="paths.pop()">
          <img :src="require('@/assets/icons/arrow-up.svg')" alt="">
        </button>
        <button @click="reload">
          <img :src="require('@/assets/icons/refresh.svg')" alt="">
        </button>
        <button @click="paths = []">
          <img :src="require('@/assets/icons/home.svg')" alt="">
        </button>
      </div>
      <div class="ct">
        <img :src="require('@/assets/icons/archive.svg')" alt=""/>
        <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        <span v-for="path of paths" :key="path.id">
          <span>{{ path.name }}</span>
          <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        </span>
      </div>
      <div class="rt disabled">
        <img :src="require('@/assets/icons/search.svg')" alt=""/>
        <input type="text" disabled>
      </div>
    </header>
    <section ref="sectionRef">
      <div v-if="loading" class="loading">
        <img :src="require('@/assets/icons/search.svg')" alt="search"/>
      </div>
      <div
        v-else
        class="wrapper"
        :style="`column-gap: ${computedGap}px`"
      >
        <div
          class="icon"
          v-for="file of files"
          :key="file.id"
          @click="open(file)"
        >
          <img
            :src="require(`@/assets/icons/${getIcon(file.mimeType)}.svg`)"
            alt="icon"
          />
          <span>{{ file.name }}</span>
        </div>
        <div
          v-if="files.length === 0"
          class="empty"
        >
          이 폴더는 비어있습니다.
        </div>
      </div>
    </section>
  </main>
</template>
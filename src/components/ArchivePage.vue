<script setup>
import { sortAlphabetically } from '@/utils';
import axios from 'axios';
import { computed, onMounted, onUnmounted, ref, defineEmits } from 'vue';

const emits = defineEmits('load')

const files = ref([])
const selected = ref()
const paths = ref([])
const loading = ref(true)

const ROOT = '1CtcKoif-fUsgMpV-4C9lglTkUDy29Vil'
const API_KEY = 'AIzaSyBgjHhLJ-4KpONdeY4zzxSbb5jZ2KDcQvA'
const DIRECTORY_MIME_TYPE = 'application/vnd.google-apps.folder'

async function load(id) {
  files.value = []
  loading.value = true
  let url = `https://www.googleapis.com/drive/v3/files?q="${id}"+in+parents&key=${API_KEY}`;
  const response = await fetch(url)
  const json = await response.json()

  // Sort
  const filteredDirectories = json.files.filter((v) => v.mimeType === DIRECTORY_MIME_TYPE)
  const filteredFiles = json.files.filter((v) => v.mimeType !== DIRECTORY_MIME_TYPE)

  const sortedDirectories = filteredDirectories.sort((a, b) => sortAlphabetically(a.name, b.name))
  files.value = sortedDirectories
 
  const sortedFiles = filteredFiles.sort((a, b) => sortAlphabetically(a.name, b.name))
  files.value = sortedDirectories.concat(sortedFiles)
  
  loading.value = false
  console.log(files.value)
}

const bodyRef = ref()
const computedGap = ref(0)

function icon(mimeType) {
  switch (mimeType) {
    case 'text/x-markdown':
      return 'file'
    case 'application/vnd.google-apps.folder':
      return 'folder'
    default:
      return ''
  }
}

function computeGap() {
  const width = bodyRef.value.offsetWidth
  const itemCnt = Math.trunc(width / 110)
  computedGap.value = (width % 110) / (itemCnt - 1)
}

onMounted(async () => {
  computeGap()
  window.addEventListener('resize', computeGap)
  await load(ROOT)
})

onUnmounted(() => {
  window.removeEventListener('resize', computeGap)
})

async function open(item) {
  // Directory
  if (item.mimeType === 'application/vnd.google-apps.folder') {
    await load(item.id)
    paths.value.push(item)
  }
  // File
  else {
    emits('load', item)
  }
}

async function back() {
  paths.value.pop()
  const id = paths.value.length > 0 ? paths.value[paths.value.length - 1].id : ROOT
  await load(id)
}

</script>

<template>
  <main id="archive">
    <section class="header">
      <div class="lt">
        <button @click="back">
          <img :src="require('@/assets/icons/arrow-left.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/arrow-right.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/reset.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/home.svg')" alt="">
        </button>
      </div>
      <div class="rt">
        <img :src="require('@/assets/icons/monitor.svg')" alt=""/>
        <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        <span v-for="path of paths" :key="path">
          {{ path.name }}
          <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        </span>
      </div>
    </section>
    <section ref="bodyRef" class="body">
      <div v-if="loading" class="before-loading">
        <img :src="require('@/assets/icons/search.svg')" alt=""/>
      </div>
      <div
        v-else
        class="after-loading"
        :style="`column-gap: ${computedGap}px`"
      >
        <div
          class="icon"
          v-for="file of files"
          :key="file.id"
          @click="open(file)"
        >
          <img :src="require(`@/assets/icons/${icon(file.mimeType)}.svg`)" alt=""/>
          <span>{{ file.name }}</span>
        </div>
        <div v-if="files.length === 0" class="empty">
          이 폴더는 비어있습니다.
        </div>
      </div>
    </section>
  </main>
</template>
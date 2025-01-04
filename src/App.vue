<script setup>
import { onMounted, onUnmounted, ref, toRaw, watch } from 'vue';
import { initDir, loadFile, resetDir } from './utils';
import EditorPage from './components/EditorPage.vue';
import Popup from './components/Popup.vue';
import { usePopup } from './store';
import HistoryPage from './components/HistoryPage.vue';
import ArchivePage from './components/ArchivePage.vue';
import dayjs from 'dayjs';
import { Converter } from 'showdown';
import Loading from './components/Loading.vue';
import GalleryPage from './components/GalleryPage.vue';
import ProfilePage from './components/ProfilePage.vue';

const left = ref()
const right = ref()

const loading = ref(false)
const popup = usePopup()

const interactParams = ref()
const items = ref([])
const mainRef = ref()
const show = ref(false)

const selected = ref()

const markdown = ref()
const html = ref()

const API_KEY = 'AIzaSyBgjHhLJ-4KpONdeY4zzxSbb5jZ2KDcQvA'

const converter = new Converter({ tables: true })
async function load(item) {
  loading.value = true
  show.value = true
  try {
    let url = `https://www.googleapis.com/drive/v3/files/${item.id}?key=${API_KEY}&alt=media`;
    const response = await fetch(url)
    markdown.value = await response.text()
    html.value = converter.makeHtml(`${markdown.value}`)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(show, (v) => {
  if (v) {
    init.value = false
  }
})

function write() {
  right.value = EditorPage
  interactParams.value = {
    action: 'create',
    target: selected.value
  }
  show.value = true
  //mainRef.value.scrollTo({
    // left: 500,
    // behavior: 'smooth'
  // })
}

const gapi = window.gapi

async function onInit() {
  // gapi.client.init({
  //   apiKey: 'AIzaSyBgjHhLJ-4KpONdeY4zzxSbb5jZ2KDcQvA',
  // })
  // .then(function() {
  //   gapi.client.load('drive', 'v3', () => {
  //     // console.log(gapi.client.drive)
  //     gapi.client.drive.files.list({
  //       params: {
  //         q: '1CtcKoif-fUsgMpV-4C9lglTkUDy29Vil in parent'
  //       }
  //     })
  //     .then(function() {
  //       console.log(gapi)
  //     })
  //   })
  // })

  // await gapi.auth2.init({
  //   apiKey: 'AIzaSyBgjHhLJ-4KpONdeY4zzxSbb5jZ2KDcQvA',
  //   clientId: '827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com',
  //   scope: 'https://www.googleapis.com/auth/drive'
  // })

  // console.log(gapi.client)

  // await gapi.client.load('drive', 'v3', () => {
  //   const drive = gapi.client.drive.files.list({
  //     params: {
  //       corpora: 'drive',
  //       driveId: '1CtcKoif-fUsgMpV-4C9lglTkUDy29Vil'
  //     }
  //   })
  //   console.log(drive.then())
  // })

  // gapi.client.init({
  //   apiKey: 'AIzaSyBgjHhLJ-4KpONdeY4zzxSbb5jZ2KDcQvA',
  // })
  // .then(() => {
  //   console.log(gapi.client)
  //   gapi.client.request({
  //     path: 'https://www.googleapis.com/drive/v3/files?driveId=1CtcKoif-fUsgMpV-4C9lglTkUDy29Vil'
  //   })
  //   .then((v) => {
  //     console.log(v)
  //   })
    // gapi.client.request({
    //   path: 'https://www.googleapis.com/drive/v3/files/1CtcKoif-fUsgMpV-4C9lglTkUDy29Vil',
    // })
    // .then((v) => {
    //   console.log('PRINT!')
    //   console.log(v)
    // })
  // })
}

const tabs = ref([
  { id: 'career', name: '이력', component: HistoryPage },
  // { id: 'galary', name: '갤러리', component: GalleryPage },
  { id: 'archive', name: '아카이브', component: ArchivePage },
  { id: 'profile', name: '프로필', component: ProfilePage }
])
const selectedTab = ref(tabs.value[0])

function login() {
  console.log('>> login')
  // let google = window.google
  // console.log('>> google', google)
  // google.accounts.id.initialize({
  //   client_id: '827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com',
  //   callback: handleCredentialResponse
  // })
  // google.accounts.id.prompt()
}

const init = ref(true)

function onScrollTo(index) {
  const height = mainRef.value.offsetHeight
  console.log('## ', height)
  mainRef.value.scrollTo(0, index * height);
  currentPage.value = index
}

const currentPage = ref(0);

const wheelVar = ref(true)

function onOpenTab(tab) {
  selectedTab.value = tab
  component.value = tab.component
}

watch(currentPage, (v) => {
  wheelVar.value = false
  setTimeout(() => {
    wheelVar.value = true
  }, 1000)
})

const component = ref(HistoryPage);

const date = ref(0)

const opacity = ref(0)

function changeOpacity() {
  opacity.value = (window.innerWidth / 1920)
}

onMounted(() => {
  const today = dayjs()
  const firstDay = dayjs('2018-06-18')
  date.value = today.diff(firstDay, 'day')
  changeOpacity()

  window.addEventListener('resize', changeOpacity)
})

onUnmounted(() => {
  window.removeEventListener('resize', changeOpacity)
})
</script>

<template>
  <main id="main">
    <!-- Left -->
    <section id="section">
      <!-- Title -->
      <section class="title">
        <h1>유진의 아카이브</h1>
        <h2>Programming With Me +{{ date }} Days</h2>
      </section>
      <!-- Window -->
      <section class="window">
        <div class="tabs">
          <div>
            <button
              v-for="tab of tabs"
              :key="tab.id"
              @click="onOpenTab(tab)"
              :class="{ selected : tab.id === selectedTab.id }"
            >
              {{ tab.name }}
            </button>
          </div>
          <div>
            <button><img :src="require('@/assets/icons/minimize.svg')" alt=""></button>
            <button><img :src="require('@/assets/icons/close.svg')" alt=""></button>
          </div>
        </div>
        <div class="body">
          <component :is="toRaw(component)" @load="load" />
        </div>
        <div class="footer">
          <div v-for="i of 4" :key="i"></div>
        </div>
      </section>
    </section>
    <!-- Right -->
    <!-- <section class="rt" /> -->
  </main>
  <main id="background" :style="`opacity: ${opacity}`"></main>
  <div
    id="slide"
    :class="{ in : show && !init, out : !show && !init }"
    class="scroll"
  >
    <section class="buttons">
      <button @click="show = false; init = true">
        <img :src="require('@/assets/icons/close.svg')" alt="">
      </button>
    </section>
    <Loading :loading="loading" />
    <section v-if="!loading" class="article">
      <article v-html="html"></article>
    </section>
  </div>
  <Popup />
</template>

<style scoped>
@import 'assets/style.css';
@import 'assets/fonts.css';
</style>
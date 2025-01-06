<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, toRaw } from 'vue';
import WindowView from './components/WindowView.vue';
import TitleView from './components/TitleView.vue';
import { File, Project, Tab } from './types/base';
import CareerPage from './components/CareerPage.vue';
import ArchivePage from './components/ArchivePage.vue';
import ProfilePage from './components/ProfilePage.vue';
import ArticlePage from './components/ArticlePage.vue';
import dayjs from 'dayjs';



const init: Ref<boolean> = ref(true)
const show: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)
const opacity: Ref<number> = ref(0)
const date: Ref<number> = ref(0)

function onCalculateDate() {
  const today = dayjs()
  const firstDay = dayjs('2021-06-01')
  date.value = today.diff(firstDay, 'day')
}
function changeOpacity() {
  opacity.value = (window.innerWidth / 1920)
}

onMounted(() => {
  onCalculateDate()
  changeOpacity()
  window.addEventListener('resize', changeOpacity)
})

onUnmounted(() => {
  window.removeEventListener('resize', changeOpacity)
})

  const tabs: Ref<Tab[]> = ref([
    {
      id: 'career',
      name: '이력',
      component: CareerPage
    },
    {
      id: 'archive',
      name: '보관함',
      component: ArchivePage
    },
    {
    id: 'profile',
    name: '프로필',
    component: ProfilePage
  }
])
const selectedTab: Ref<Tab> = ref(tabs.value[0])

const file: Ref<File | undefined> = ref()
const flag: Ref<boolean> = ref(false)

// const markdown: Ref<string> = ref('')
// const html: any = ref()
// async function onLoad(item: Project) {
//   loading.value = true
//   show.value = true
//   try {
//     let url = `https://www.googleapis.com/drive/v3/files/${item.id}?key=${API_KEY}&alt=media`;
//     const response = await fetch(url)
//     markdown.value = await response.text()
//     html.value = converter.makeHtml(`${markdown.value}`)
//   } catch (e) {
//     console.error(e)
//   } finally {
//     loading.value = false
//   }
// }

function onOpenTab(tab: Tab) {
  selectedTab.value = tab
}

function load(item: File, storeYn: boolean) {
  if (item.id.startsWith('-'))
    return
  
  file.value = item
  flag.value = storeYn
}

function close() {
  file.value = undefined;
  flag.value = false
}

</script>

<template>
  <main id="main">
    <section id="title">
      <h2>Front-End Developer</h2>
      <h1>김유진의 아카이브</h1>
    </section>
    <section id="window">
      <header>
        <div class="lt">
          <button
            v-for="tab of tabs"
            :key="tab.id"
            @click="onOpenTab(tab)"
            :class="{ selected : tab.id === selectedTab.id }"
          >
            {{ tab.name }}
          </button>
        </div>
        <div class="rt">
          <button>
            <img
              :src="require('@/assets/icons/minimize.svg')"
              alt="minimize"
            >
          </button>
          <button>
            <img
              :src="require('@/assets/icons/close.svg')"
              alt="close"
            >
          </button>
        </div>
      </header>
      <section>
        <component
          :is="toRaw(selectedTab.component)"
          @load="load"
        />
      </section>
      <footer></footer>
    </section>
  </main>
  <!-- Background Image -->
  <main
    id="background"
    :style="`opacity: ${opacity}`"
  />
  <!-- Slide View -->
  <ArticlePage
    :file="file"
    :flag="flag"
    @close="close"
  />
</template>

<!-- <script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from './components/HelloWorld.vue';

@Options({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {}
</script> -->

<style lang="scss">
@import 'assets/style.scss';
@import 'assets/fonts.scss';
@import 'assets/media.scss';
@import 'assets/animation.scss';
/*
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
*/
</style>

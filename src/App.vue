<script setup lang="ts">
import { onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import { File, Tab } from './types';
import IndexPage from './components/IndexPage.vue';
import ArticlePage from './components/ArticlePage.vue';
import dayjs from 'dayjs';

const tabs: Ref<Tab[]> = ref([{
  id: 'base', name: '포트폴리오 (P:)'
}])
const selectedTab: Ref<Tab> = ref(tabs.value[0])

// File Loading
let interval: number | undefined = undefined
const count: Ref<number> = ref(0)
const loading: Ref<boolean> = ref(false)

function onCount() {
  count.value = count.value < 3 ? count.value + 1 : 0
}

watch(loading, (v: boolean) => {
  if (v) {
    count.value = 0
    interval = setInterval(onCount, 500)
  } else {
    clearInterval(interval)
    interval = undefined
  }
})

const file: Ref<File | undefined> = ref()
function load(item: File) {
  // Invalid file
  if (item.id.startsWith('-'))
    return

  // Already opened file
  if (file.value && file.value.id === item.id)
    return

  file.value = item
  loading.value = true
}

// Background Opacity
const opacity: Ref<number> = ref(0)
function changeOpacity() {
  opacity.value = (window.innerWidth / 1920)
}

onMounted(() => {
  changeOpacity()
  window.addEventListener('resize', changeOpacity)
})

onUnmounted(() => {
  window.removeEventListener('resize', changeOpacity)
})
</script>

<template>
  <!-- Main Area -->
  <main id="main">
    <section id="title">
      <h1>KIM YUJIN</h1>
      <h2>Junior Web Developer</h2>
    </section>
    <section id="window">
      <header>
        <div class="lt">
          <button
            v-for="tab of tabs"
            :key="tab.id"
            @click="selectedTab = tab"
            :class="{ selected : tab.id === selectedTab.id }"
          >
            {{ tab.name }}
          </button>
        </div>
        <div class="rt">
          <button><img :src="require('@/assets/icons/minimize.svg')" alt="minimize"></button>
          <button><img :src="require('@/assets/icons/close.svg')" alt="close"></button>
        </div>
      </header>
      <section>
        <IndexPage @load="load" />
        <!-- <component :is="toRaw(selectedTab.component)" @load="load" /> -->
      </section>
      <footer></footer>
      <section v-if="loading" id="loading">
        <div>
          <span v-for="i of count" :key="i"></span>
        </div>
        로딩중
      </section>
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
    @close="file = undefined;"
    @ready="loading = false"
  />
</template>

<style lang="scss">
@import 'assets/fonts', 'assets/style', 'assets/media', 'assets/animation';
</style>

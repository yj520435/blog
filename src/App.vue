<script setup>
import { ref, watch, onMounted } from 'vue';
import TaskBar from '@/components/TaskBar.vue'
import MyFolder from './components/MyFolder.vue';
import WindowFrame from './components/WindowFrame.vue';
import NotePad from './components/NotePad.vue'
import UserInfo from './components/UserInfo.vue';
import InternetExplorer from './components/InternetExplorer.vue'
import PaintTool from './components/PaintTool.vue';
import { useStore } from './store';
import { highlightCode } from './assets/highlighter';
import MyComputer from './components/MyComputer.vue';

const store = useStore()

const focused = ref('')

const desktopPrograms = ref([
  // {
  //   id: 'myPc',
  //   name: '내 컴퓨터',
  //   icon: 'monitor.svg',
  //   component: MyComputer,
  // },
  {
    id: 'myFolder',
    name: '내 폴더',
    icon: 'folder.svg',
    component: MyFolder,
    index: 0
  },
  {
    id: 'user',
    name: '시스템 유저',
    icon: 'user.svg',
    component: UserInfo,
    index: 1
  },
  {
    id: 'internet',
    name: '블로그',
    icon: 'blog.svg',
    component: InternetExplorer,
    index: 2
  },
  {
    id: 'paint',
    name: '그림판',
    icon: 'brush.svg',
    component: PaintTool,
    index: 3
  }
  // {
  //   id: 'paintTool',
  //   name: '그림판',
  //   icon: 'paint_old-0.png',
  //   items: ['menu'],
  //   component: PaintTool
  // }
])

onMounted(() => {
  // for (const [index, program] of desktopPrograms.value.entries()) {
  //   setTimeout(() => {
  //     store.open(program);
  //   }, 300 * index)  
  // }
  const sections = document.querySelector('section')
})
</script>

<template>
  <main>
    <section id="background">
      <div
        v-for="program of desktopPrograms"
        :key="program.id"
        class="icon"
        @click="focused = program.id"
        @dblclick="store.open(program)"
      >
        <img
          :src="require(`@/assets/icons/${focused === program.id ? 'fill' : 'line'}/${program.icon}`)"
          alt="program.id"
          class="filter"
        >
        <span
          :class="{ focused: focused === program.id }"
        >{{ program.name }}</span>
      </div>
    </section>
    <!-- <TaskBar
      :programs="store.programs"
      :activatedProgram="store.activatedProgram"
      @open="store.open"
    /> -->
    <WindowFrame
      v-for="program of store.programs"
      :key="program.id"
      :program="program"
      :activated="store.activatedProgram === program.id"
      :style="`z-index: ${store.sortedPrograms.findIndex(
        v => v === program.id
      )}`"
      @mousedown="store.sort(program.id);"
      @close="store.close"
    />
  </main>
</template>

<style scoped>
@import 'assets/style.css';
@import 'assets/highligher.css';

main {
  display: grid;
  grid-template-rows: 1fr 44px;
  height: 100vh;

  #background {
    height: 100%;
    padding: 10px;

    .icon {
      margin: 10px 0px;
      display: flex;
      flex-direction: column;
      color: var(--main-color);
      font-family: 'Galmuri9';
      font-weight: bold;
      width: 100px;
      height: 90px;
      padding: 5px;
      justify-content: center;
      align-items: center;
      text-align: center;

      span {
        padding: 3px 5px;
        cursor: inherit;
      }
      
      img {
        height: 40px;
        cursor: inherit;
      }

      &:hover {
        cursor: var(--point-cursor) !important;
      }
    }
  }
}
</style>
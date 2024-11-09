<script setup>
import { ref, watch, onMounted } from 'vue';
import TaskBar from '@/components/TaskBar.vue'
import MyFolder from './components/MyFolder.vue';
import WindowFrame from './components/WindowFrame.vue';
import NotePad from './components/NotePad.vue'
import UserInfo from './components/UserInfo.vue';
import InternetExplorer from './components/InternetExplorer.vue'
import PaintTool from './components/PaintTool.vue';
import { usePopup, useStore } from './store';
import { highlightCode } from './assets/highlighter';
import MyComputer from './components/MyComputer.vue';
import { Octokit } from 'octokit';
import { loadDir } from './utils';
import Popup from './components/Popup.vue';
import axios from 'axios';

const store = useStore()
const popup = usePopup()

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
    name: 'My Folder',
    icon: 'folder.svg',
    component: MyFolder,
    feature: { x: 0, y: 0, width: 600, height: 450 }
  },
  {
    id: 'user',
    name: 'Admin',
    icon: 'user.svg',
    component: UserInfo,
    index: 1
  },
  {
    id: 'internet',
    name: 'YJ520435',
    icon: 'blog.svg',
    component: InternetExplorer,
    index: 2
  },
  {
    id: 'notepad',
    name: 'NotePad',
    icon: 'paper.svg',
    component: NotePad
  },
  {
    id: 'paint',
    name: 'Painting',
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

const mainRef = ref()

onMounted(async () => {
  // for (const [index, program] of desktopPrograms.value.entries()) {
  //   setTimeout(() => {
  //     store.open(program);
  //   }, 300 * index)  
  // }

  console.log('APP START')
  mainRef.value.addEventListener('mousemove', (e) => {
    // console.log(e.target)

})

// const result = await axios({
//   url: 'https://api.github.com/repos/yj520435/yj520435.github.io/contents/README.md',
//   method: 'get'
// })
// console.log(result)

function onMouseDown(event, program) {
  console.log(event, program)
}



})

function test() {
  console.log(1)
}
</script>

<template>
  <main ref="mainRef">
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
      @mousedown="(event) => onMouseDown(event, program)"
      @mouseover="test"
    />
    <!--
      @mousedown="store.sort(program.id);"
      @close="store.close"
    -->
    <Popup />
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
      color: var(--text-color);
      width: 110px;
      height: 90px;
      padding: 5px;
      justify-content: center;
      align-items: center;
      text-align: center;

      span {
        padding: 2px 5px;
        cursor: inherit;
      }
      
      img {
        height: 40px;
        cursor: inherit;
      }

      &:hover {
        cursor: var(--pointer-cursor) !important;
      }
    }
  }
}
</style>
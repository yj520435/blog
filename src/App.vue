<script setup>
import { ref, onMounted, computed } from 'vue';
import TaskBar from '@/components/TaskBar.vue'
import MyFolder from './components/MyFolder.vue';
import WindowFrame from './components/WindowFrame.vue';
import NotePad from './components/NotePad.vue'
import UserInfo from './components/UserInfo.vue';
import InternetExplorer from './components/InternetExplorer.vue'
import PaintTool from './components/PaintTool.vue';
import { useProgram } from './store';
import Popup from './components/Popup.vue';

const MIN_WIDTH = 450
const MIN_HEIGHT = 450
const BASE_FEATURE = { x: 50, y: 50, width: 600, height: 450 }

const store = useProgram()

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
    feature: BASE_FEATURE
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
    component: NotePad,
    feature: BASE_FEATURE
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

const target = ref()
const backup = ref()

const move = ref(false)
const resize = ref({ n: false, s: false, w: false, e: false })

const isMouseDown = ref(false)

function initResize() {
  resize.value = { n: false, s: false, e: false, w: false }
}

function onMouseDown(event) {
  if (target.value) {
    isMouseDown.value = true
    backup.value = {
      mouse: { x: event.x, y: event.y },
      target: { ...target.value.feature }
    }
  }
}

function onMouseMove(event) {
  if (isMouseDown.value) {
    const diff = {
      x: event.x - backup.value.mouse.x,
      y: event.y - backup.value.mouse.y
    }

    if (move.value) {
      target.value.feature.x = backup.value.target.x + diff.x;
      target.value.feature.y = backup.value.target.y + diff.y;
    }

    if (resize.value.n) {
      target.value.feature.y = backup.value.target.y + diff.y;
      target.value.feature.height = backup.value.target.height - diff.y;
    }

    if (resize.value.s) {
      target.value.feature.height = backup.value.target.height + diff.y;
    }

    if (resize.value.e) {
      target.value.feature.width = backup.value.target.width + diff.x;
    }

    if (resize.value.w) {
      target.value.feature.x = backup.value.target.x + diff.x;
      target.value.feature.width = backup.value.target.width - diff.x;
    }
    
  }
  else {
    if (target.value) {
      const diff = {
        top: event.y - target.value.feature.y,
        left: event.x - target.value.feature.x,
        bottom: event.y - (target.value.feature.y + target.value.feature.height),
        right: event.x - (target.value.feature.x + target.value.feature.width)
      }

      resize.value = {
        n: diff.top < 4,
        s: diff.bottom > -10 && diff.bottom < 0,
        e: diff.right > -13 && diff.right < 0,
        w: diff.left < 4
      }
    }
    else {
      initResize()
    }
  }
}

function onMouseUp() {
  isMouseDown.value = false
  initResize()

  if (target.value) {
    if (target.value.feature.width < MIN_WIDTH)
      target.value.feature.width = MIN_WIDTH

    if (target.value.feature.height < MIN_HEIGHT)
      target.value.feature.height = MIN_HEIGHT
  }
}

const cursorStyle = computed(() => {
  if (resize.value.s || resize.value.n)
    return 'vertical'
  else if (resize.value.e || resize.value.w)
    return 'horizontal'
  else
    return 'default'
})

function onWindowMove(params) {
  if (!isMouseDown.value)
    move.value = params
}

function onWindowCtrl(p, program) {
  if (!isMouseDown.value)
    target.value = p ? program : null
}

onMounted(async () => {
  // for (const [index, program] of desktopPrograms.value.entries()) {
  //   setTimeout(() => {
  //     store.open(program);
  //   }, 300 * index)  
  // }
})
</script>

<template>
  <main
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    :class="cursorStyle"
  >
    <section class="background">
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
      )};
      `"
      @move="(p) => onWindowMove(p)"
      @ctrl="(p) => onWindowCtrl(p, program)"
    />
    <Popup />
  </main>
</template>

<style scoped>
@import 'assets/style.css';

main {
  display: grid;
  grid-template-rows: 1fr 44px;
  height: 100vh;

  .background {
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
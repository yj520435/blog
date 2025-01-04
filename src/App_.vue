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
import Popup from './components/Popup_.vue';
import { createFile, loadDir } from './utils';

const MIN_WIDTH = 450
const MIN_HEIGHT = 450

const program = useProgram()

const focused = ref('')
const items = ref([
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
  },
  {
    id: 'user',
    name: 'Admin',
    icon: 'user.svg',
    component: UserInfo,
  },
  {
    id: 'internet',
    name: 'YJ520435',
    icon: 'blog.svg',
    component: InternetExplorer,
  },
  {
    id: 'notepad',
    name: 'NotePad',
    icon: 'paper.svg',
    component: NotePad,
    options: {
      ready: true
    }
  },
  {
    id: 'paint',
    name: 'Painting',
    icon: 'brush.svg',
    component: PaintTool,
  }
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
  // await loadDir()
  console.log('✅ Initiate.')
  // await createFile()
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
        v-for="item of items"
        :key="item.id"
        class="icon"
        @click="focused = item.id"
        @dblclick="program.open(item)"
      >
        <img
          :src="require(`@/assets/icons/${focused === item.id ? 'fill' : 'line'}/${item.icon}`)"
          alt="item.id"
          class="filter"
        >
        <span
          :class="{ focused: focused === item.id }"
        >{{ item.name }}</span>
      </div>
    </section>
    <!-- <TaskBar
      :programs="store.programs"
      :activatedProgram="store.activatedProgram"
      @open="store.open"
    /> -->
    <WindowFrame
      v-for="item of program.items"
      :key="item.id"
      :program="item"
      :activated="program.focused === item.id"
      @move="(p) => onWindowMove(p)"
      @ctrl="(p) => onWindowCtrl(p, item)"
      @close="(p) => program.close(p)"
    />
    <Popup />
  </main>
</template>

<style scoped>
@import 'assets/style_.css';

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
      color: var(--base-color);
      width: 110px;
      height: 90px;
      padding: 5px;
      justify-content: center;
      align-items: center;
      text-align: center;

      span {
        /* padding: 2px 5px; */
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
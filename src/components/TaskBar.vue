<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import NotePad from './NotePad.vue';
import InternetExplorer from './InternetExplorer.vue';
import PaintTool from './PaintTool.vue';

const props = defineProps(['programs', 'activatedProgram']);
const emit = defineEmits(['open'])

const isStartButtonClicked = ref(false);
const isHovered = ref(false)

const startPrograms = ref([
    // { id: 'disk', name: '디스크 조각모음', icon: 'defragment-0.png' },
    // { id: 'windowUpdate', name: '윈도우 업데이트', icon: 'windows_update_large-2.png' },
    {
    id: 'paintTool',
    name: '그림판',
    icon: 'brush.svg',
    items: [],
    component: PaintTool
  },
  { id: 'myMusic', name: '내 음악', icon: 'music-note.svg' },
  {
    id: 'notepad',
    name: '메모장',
    icon: 'file.svg',
    items: ['menu'],
    component: NotePad
  },
  {
    id: 'internet',
    name: '인터넷 익스플로러',
    // icon: 'msie1-2.png',
    icon: 'internet-explorer.svg',
    items: ['menu', 'address'],
    component: InternetExplorer
  },
  // { id: 'package', name: '실행 프로그램', icon: 'package-1.png' },
  { id: 'settings', name: '설정', icon: 'tool.svg' },
  { id: 'search', name: '검색', icon: 'search.svg' },
  // { id: 'help', name: '도움말', icon: 'help_book_cool-4.png' }
])

function onMouseDown() {
  if (isStartButtonClicked.value && !isHovered.value) {
    isStartButtonClicked.value = false
  }
}

window.addEventListener('click', onMouseDown)

</script>

<template>
  <section id="task-bar">
    <!-- START BUTTON -->
    <button
      @mousedown="isStartButtonClicked = !isStartButtonClicked"
      @mouseenter="isHovered = true"
    >
      <img :src="require('@/assets/icons/fill/sparkling.svg')" alt="" class="filter" />시작
    </button>
    <!-- ACTIVATED PROGRAM LIST -->
    <div id="tasks">
      <div
        v-for="program of programs"
        :key="program.id"
        :class="{ outline: activatedProgram === program.id }"
      >
        <img
          :src="require(`@/assets/icons/fill/${program.icon}`)"
          alt=""
          class="filter"
        > {{ program.name }}
      </div>
    </div>
    <!-- 상태 표시 영역 -->
    <div id="status" class="inset">
      <!-- <div>
        <img :src="require('@/assets/icons/computer_taskmgr-0.png')" alt="" />
        <img :src="require('@/assets/icons/loudspeaker_rays-0.png')" alt="" />
        <img :src="require('@/assets/icons/calendar-3.png')" alt="" />
      </div> -->
      <span>오전 12:37</span>
    </div>
  </section>
  <!-- 시작 프로그램 -->
  <div
    v-if="isStartButtonClicked" 
    id="start-programs"
  >
    <ul
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      >
      <li
        v-for="(program, index) of startPrograms"
        :key="program.id"
        :style="`animation-delay: ${0.6 - (0.1 * index)}s;`"
        class="outline"
      >
        <span class="item">
          <img :src="require(`@/assets/icons/${program.icon}`)" alt="icon"> {{ program.name }}
        </span>
      </li>
      <!-- <li
        v-for="program of startPrograms"
        :key="program.id"
        @click="
          emit('open', program);
          isStartButtonClicked = false
        "
      >
        <span class="item">
          <img :src="require(`@/assets/icons/${program.icon}`)" alt="icon"> {{ program.name }}
        </span>
      </li> -->
    </ul>
  </div>
</template>

<style scoped>

@keyframes appear {
  0% {
    opacity: 0;
    left: -200px;
  }

  100% {
    opacity: 1;
    left: 0;
  }
}

#task-bar {
  box-shadow: 0px -2px 0px var(--base-color);
  display: grid;
  grid-template-columns: 88px 1fr 206px;

  button {
    height: 36px;
    margin: 4px;
    background-color: var(--system-color);
    font-family: 'Noto Sans KR';
    font-weight: bold;
    font-size: 14px;
    gap: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    outline: none;
    border: none !important;
    color: var(--base-color);

    img {
      width: 26px;
      height: 26px;
      /* filter: invert(100%) sepia(0%) saturate(17%) hue-rotate(334deg) brightness(105%) contrast(105%); */
    }
  }

  #tasks {
    display: flex;
    width: 100%;

    div {
      height: 36px;
      margin: 4px;
      font-family: 'Noto Sans KR';
      font-size: 14px;
      display: flex;
      align-items: center;
      font-weight: bold;
      padding: 0 10px;
      width: 30%;
      min-width: 100px;
      max-width: 200px;
      color: var(--base-color);
   
      &.activated {
        border-color: var(--base-color);
      }

      img {
        width: 20px;
        margin-right: 5px;
      }
    }
  }
}

#status {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  height: 36px;
  margin: 4px;
  font-family: 'Noto Sans KR';
  font-weight: bold;
  font-size: 14px;

  div:nth-child(1) {
    display: flex;
    gap: 5px;
  }

  img {
    width: 20px;
    height: 20px;
  }
  
  span {
    padding-bottom: 3px;
  }
}

#start-programs {
  position: absolute;
  font-family: 'Noto Sans KR';
  font-size: 14px;
  font-weight: bold;
  bottom: 43px;
  width: 360px;
  z-index: 10;
  margin: 6px 3px;
  background-color: transparent;

  aside {
    background: black; /* linear-gradient(black, white); */
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    width: 260px;

    li {
      position: relative;
      margin: 2px 0;
      opacity: 0;
      background-color: var(--system-color);
      animation: appear 0.5s forwards;

      span.item {
        display: inline-flex;
        width: 100%;
        height: 50px;
        align-items: center;
        padding: 0 15px;

        img {
          width: 26px;
          height: 26px;
          margin-right: 15px;
        }

        &:hover {
          background-color: navy;
          color: white;
        }
      }

      /* height: 65px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      img {
        width: 40px;
        margin-right: 20px;
      }

      &:hover {
        background-color: navy;
        color: white;
      } */
    }
  }
}
</style>

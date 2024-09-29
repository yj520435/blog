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
  { id: 'disk', name: '디스크 조각모음', icon: 'defragment-0.png' },
  { id: 'windowUpdate', name: '윈도우 업데이트', icon: 'windows_update_large-2.png' },
  {
    id: 'paintTool',
    name: '그림판',
    icon: 'paint_old-0.png',
    items: [],
    component: PaintTool
  },
  { id: 'myMusic', name: '내 음악', icon: 'cd_audio_cd_a-4.png' },
  {
    id: 'notepad',
    name: '메모장',
    icon: 'notepad-5.png',
    items: ['menu'],
    component: NotePad
  },
  {
    id: 'internet',
    name: '인터넷 익스플로러',
    icon: 'msie1-2.png',
    items: ['menu', 'address'],
    component: InternetExplorer
  },
  { id: 'package', name: '실행 프로그램', icon: 'package-1.png' },
  { id: 'settings', name: '설정', icon: 'gears_tweakui_b.png' },
  { id: 'search', name: '검색', icon: 'search_directory-5.png' },
  { id: 'help', name: '도움말', icon: 'help_book_cool-4.png' }
])

function onMouseDown() {
  if (isStartButtonClicked.value && !isHovered.value) {
    isStartButtonClicked.value = false
  }
}

window.addEventListener('click', onMouseDown)

</script>

<template>
  <!-- 작업표시줄 -->
  <section id="task-bar">
    <!-- 시작 버튼 -->
    <button
      @mousedown="isStartButtonClicked = !isStartButtonClicked"
      @mouseenter="isHovered = true"
      :class="isStartButtonClicked ? 'inset' : 'outset'"
    >
      <img :src="require('@/assets/icons/windows-0.png')" alt="" />시작
    </button>
    <hr>
    <!-- 활성화된 프로그램 목록 -->
    <div id="tasks">
      <div
        v-for="program of programs"
        :key="program.id"
        :class="activatedProgram === program.id ? 'inset' : 'outset'"
      >
        <img
          :src="require(`@/assets/icons/${program.icon}`)"
          alt=""
        > {{ program.name }}
      </div>
    </div>
    <!-- 상태 표시 영역 -->
    <hr>
    <div id="status" class="inset">
      <div>
        <img :src="require('@/assets/icons/computer_taskmgr-0.png')" alt="" />
        <img :src="require('@/assets/icons/loudspeaker_rays-0.png')" alt="" />
        <img :src="require('@/assets/icons/calendar-3.png')" alt="" />
      </div>
      <span>오전 12:37</span>
    </div>
  </section>
  <!-- 시작 프로그램 -->
  <div
    v-if="isStartButtonClicked" 
    id="start-programs"
    class="outset"
  >
    <aside />
    <ul
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <li
        v-for="(program, index) of startPrograms"
        :key="program.id"
        @click="
          emit('open', program);
          isStartButtonClicked = false
        "
      >
        <span v-if="[2, 7].includes(index)" class="hr"><hr /></span>
        <span class="item">
          <img :src="require(`@/assets/icons/${program.icon}`)" alt="icon"> {{ program.name }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
#task-bar {
  background-color: var(--system-color);
  box-shadow: 0px -2px 0px white;
  display: grid;
  grid-template-columns: 88px 10px 1fr 10px 206px;

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

    img {
      width: 25px;
      height: 25px;
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
   
      &.inset {
        background-color: #dddddd;
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
  background-color: var(--system-color);
  font-family: 'Noto Sans KR';
  font-size: 14px;
  font-weight: bold;
  bottom: 43px;
  width: 360px;
  display: grid;
  grid-template-columns: 30px 1fr;
  z-index: 10;

  aside {
    background: linear-gradient(navy, blue);
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    /* hr {
      border: 2px inset white;
      margin: 7px 10px;
    } */

    li {
      span.hr {
        hr {
          margin: 7px 10px;
        }
      }

      span.item {
        display: inline-flex;
        width: 100%;
        height: 60px;
        align-items: center;
        padding: 0 15px;

        img {
          width: 40px;
          height: 40px;
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

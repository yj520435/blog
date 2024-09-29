<script setup>
import { ref, watch } from 'vue';
import TaskBar from '@/components/TaskBar.vue'
import MyFolder from './components/MyFolder.vue';
import WindowFrame from './components/WindowFrame.vue';
import NotePad from './components/NotePad.vue'
import UserInfo from './components/UserInfo.vue';
import InternetExplorer from './components/InternetExplorer.vue'
import PaintTool from './components/PaintTool.vue';
import { useStore } from './store';
import { highlightCode } from './assets/highlighter';

const store = useStore()

const focused = ref('')

const desktopPrograms = ref([
  {
    id: 'myPc',
    name: '내 컴퓨터',
    icon: 'computer_explorer-5.png',
    items: [],
    component: null,
  },
  {
    id: 'myFolder',
    name: '내 폴더',
    icon: 'directory_open_file_mydocs_2k-4.png',
    items: ['menu', 'logo', 'tools', 'address'],
    component: MyFolder
  },
  {
    id: 'user',
    name: '시스템 유저',
    icon: 'users-2.png',
    items: [],
    component: UserInfo
  },
  // {
  //   id: 'paintTool',
  //   name: '그림판',
  //   icon: 'paint_old-0.png',
  //   items: ['menu'],
  //   component: PaintTool
  // }
])
</script>

<template>
  <main>
    <section id="background">
      <div
        v-for="program of desktopPrograms"
        :key="program.id"
        class="icon"
        :class="{ focused: focused === program.id}"
        @click="focused = program.id"
        @dblclick="store.open(program)"
      >
        <img
          :src="require(`@/assets/icons/${program.icon}`)"
          alt="program.id"
        >
        <span>{{ program.name }}</span>
      </div>
      <!-- 
      <div
        class="icon"
        @click="focused = 'myPc'"
        :class="{ focused: focused === 'myPc' }"
      >
        <img :src="require('@/assets/icons/computer_explorer-5.png')" alt="">
        <span>내 컴퓨터</span>
      </div>
      <div
        class="icon"
        @click="focused = 'folder'"
        :class="{ focused: focused === 'folder' }"
        @dblclick="openMyFolder = true"
      >
        <img :src="require('@/assets/icons/directory_open_file_mydocs_2k-4.png')" alt="">
        <span>내 폴더</span>
      </div>
      <div class="icon">
        <img :src="require('@/assets/icons/users-2.png')" alt="">
        <span>내 정보</span>
      </div>
      <div class="icon">
        <img :src="require('@/assets/icons/msie1-2.png')" alt="">
        <span>인터넷</span>
      </div>
      <div class="icon">
        <img :src="require('@/assets/icons/notepad_file-2.png')" alt="">
        <span>메모장</span>
      </div>
      <div class="icon">
        <img :src="require('@/assets/icons/recycle_bin_full-2.png')" alt="">
        <span>휴지통</span>
      </div>
       -->
    </section>
    <TaskBar
      :programs="store.programs"
      :activatedProgram="store.activatedProgram"
      @open="store.open"
    />
    <WindowFrame
      v-for="program of store.programs"
      :key="program.id"
      :program="program"
      :activated="store.activatedProgram === program.id"
      :style="`z-index: ${store.sortedPrograms.findIndex(
        v => v === program.id
      )}`"
      @align="store.sort"
      @close="store.close"
    />
    <!-- <WindowFrame
      :on="false"
      :title="'내 폴더'"
      :icon="'directory_open_file_mydocs_2k-4.png'"
      :items="['menu', 'address', 'logo']"
      :target="MyFolder"
    />
    <WindowFrame
      :on="false"
      :title="'메모장'"
      :icon="'notepad_file-2.png'"
      :items="['menu']"
      :target="NotePad"
    />
    <WindowFrame
      :on="false"
      :title="'사용자 정보'"
      :icon="'notepad_file-2.png'"
      :items="[]"
      :target="UserInfo"
    />
    <WindowFrame
      :on="false"
      :title="'인터넷'"
      :icon="'msie1-2.png'"
      :items="['menu', 'address']"
      :target="InternetExplorer"
    /> -->

    <!-- <MyFolder
      :on="openMyFolder"
    /> -->
    <!--
      @off="openMyFolder = false"
      @minimize="tasks.push('myFolder')"
    -->
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
    background-color: #378181;

    .icon {
      margin: 10px 0px;
      display: flex;
      flex-direction: column;
      color: white;
      font-family: 'Noto Sans KR';
      font-weight: bold;
      font-size: 14px;
      width: 90px;
      height: 80px;
      padding: 5px;
      justify-content: center;
      align-items: center;
      text-align: center;
      cursor: pointer;

      span {
        border: 1px solid transparent;
        padding-bottom: 2px;
      }

      &.focused {
        span {
          background-color: navy;
          padding: 0 3px 2px 3px;
          border: 1px dotted lightgrey;
        }
      }
    }

    img {
      width: 50px;
    }
  }
}
.border-inset {
  border-style: inset !important;
}
</style>
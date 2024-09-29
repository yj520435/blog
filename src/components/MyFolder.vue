<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, ref, defineProps, defineEmits, computed, watch } from 'vue';
import WindowFrame from '@/components/WindowFrame.vue'
import { Folder, getFile, NotePadFile } from './Program';
import { useStore } from '@/store';
import dayjs from 'dayjs';
import { getFiles } from '@/utils';
import WindowMenu from './WindowMenu.vue';
import WindowPath from './WindowPath.vue';

const props = defineProps(['on']);

const mainRef = ref();

const path = ref('archive')
const clickedFile = ref()

const iconStyle = computed(() => {
  let marginLeftRight = 0;
  if (mainRef.value) {
    const fullWidth = mainRef.value.clientWidth - 10;
    const itemCount = Math.floor(fullWidth / 80);
    const remainWidth = fullWidth - 80 * itemCount;
    marginLeftRight = remainWidth / (itemCount * 2);
  }
  return `margin: 10px ${marginLeftRight}px`;
});

const myFiles = ref([])

// async function getFiles(path) {
//   const response = await fetch(path)
//   const text = await response.text()

//   const parser = new DOMParser()
//   const dom = parser.parseFromString(text, 'text/html')

//   console.log(dom)
//   const files = dom.getElementById('files')
  

//   for (const file of files.children) {
//     let object = {};
//     ['name', 'size', 'date'].forEach(v => {
//       object[v] = file.getElementsByClassName(v)[0].innerHTML
//     })

//     if (object.name === '..')
//       continue

//     // 폴더
//     if (object.size === '') {
//       myFiles.value.push((new Folder(object.name).self))
//     }
//     else {
//       const name = object.name.split('.')[0]
//       const extension = object.name.split('.')[1]
      
//       const date = object.date.includes('오전')
//         ? object.date.replace('오전', '').concat(' AM')
//         : object.date.replace('오후', '').concat(' PM')
//       const convertedDate = dayjs(date, 'YYYY. M. DD. h:mm:ss A', true).unix()
//       myFiles.value.push(getFile(name, extension, convertedDate))
      
      
//     }

//     // const name = file.getElementsByClassName('name')[0].innerHTML.split('.')
//     // const date = file.getElementsByClassName('date')[0].innerHTML
//     // if (array[0] !== '') {
//     //   const convertedDate = date.includes('오전')
//     //     ? date.replace('오전', '').concat(' AM')
//     //     : date.replace('오후', '').concat(' PM')
//     //   const program = new Program(array[0], array[1], dayjs(convertedDate, 'YYYY. M. DD. h:mm:ss A', true).unix())
//     //   myFiles.value.push(program.self)
//     // }
//   }
//   console.log('>> myFiles', myFiles.value)
// }

const store = useStore()

async function open(file) {
  if (file.component) {
    store.open(file)
  }
  else {
    path.value += `/${file.name}`
    myFiles.value = []
    myFiles.value = await getFiles(path.value)
  }
}

onMounted(async () => {
  myFiles.value = await getFiles(path.value)
})

const menu = ref([
  {
    id: 'file',
    name: '파일',
    submenu: [
      {
        id: 'a',
        name: '리스트A',
        icon: 'fa-user',
      },
    ],
  },
  {
    id: 'show',
    name: '보기',
    submenu: [
      {
        id: 'list',
        name: '리스트',
        icon: 'fa-list',
      },
      {
        id: 'icon_big',
        name: '큰 아이콘',
        icon: 'fa-cube',
      },
      {
        id: 'icon_small',
        name: '작은 아이콘',
        icon: 'fa-cubes',
      },
    ],
  },
]);
</script>

<template>
  <WindowMenu :menu="menu"/>
  <WindowPath />
  <main
    ref="mainRef"
    class="inset scroll"
  >
    <!-- 큰 아이콘 -->
    <section class="icon-lg">
      <div
        v-for="file of myFiles"
        :key="file.id"
        :style="iconStyle"
        :class="{ clicked: clickedFile === file.id }"
        :title="file.name"
        class="icon"
        @click="clickedFile = file.id"
        @dblclick="open(file)"
      >
        <img
          :src="require(`@/assets/icons/${file.icon}`)"
          alt="file.title"
        />
        <span>{{ file.name }}</span>
      </div>
      <!-- <div
        v-for="i of 3"
        :key="i"
        class="icon"
        :style="iconStyle"
      >
        <img :src="require('@/assets/icons/notepad_file-2.png')" alt="" />
        <span>메모장</span>
      </div> -->
    </section>
  </main>
  <!-- <div class="bubble outset">
    <ul>
      <li>HTML로 열기</li>
    </ul>
  </div> -->
  <!-- <WindowFrame
    v-if="props.on" 
    :title="title"
    menu
    address
    @off="() => {
      console.log('off')
    }"
  /> -->
</template>

<style scoped>

main {
  margin: 2px;
  height: calc(100% - 73px);
  background-color: white;
}

section {
  width: 100%;
  padding: 5px;
}

.icon {
  /* margin: 10px 0px; */
  display: flex;
  flex-direction: column;
  color: black;
  font-family: 'Noto Sans KR';
  font-size: 14px;
  gap: 5px;
  font-weight: bold;
  width: 80px;
  padding: 5px;
  justify-content: start;
  align-items: center;
  text-align: center;
  cursor: pointer;
  border: 1px solid transparent;

  span {
    display: inline-block;
    border: 1px solid transparent;
    padding-bottom: 2px;
    max-width: 80px;
    /* text-wrap: wrap; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.clicked {
    span {
      background-color: navy;
      padding: 0 3px 2px 3px;
      border: 1px dotted lightgrey;
      color: white;
      overflow: visible;
      text-overflow: unset;
      white-space: unset;
      position: relative;
    }
  }
}

section.icon-lg {
  display: flex;
  flex-wrap: wrap;
}

.bubble {
  position: absolute;
  background-color: var(--system-color);
  z-index: 11;
  width: 160px;

  ul {
    margin: 6px 0;
    padding: 0 6px;
    list-style: none;
  }
}
</style>
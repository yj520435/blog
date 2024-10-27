<script setup>
import { onMounted, ref, defineProps, defineExpose, computed, watch } from 'vue';
import { useStore } from '@/store';
import { getFiles, loadDir } from '@/utils';

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
    myFiles.value = await loadDir(path.value)
  }
}

onMounted(async () => {
  myFiles.value = await loadDir(path.value)
})

const menu = ref([
  {
    id: 'file',
    name: 'File',
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
    name: 'View',
    submenu: [
      {
        id: 'list',
        name: '리스트',
        icon: 'list.svg',
      },
      {
        id: 'icon_big',
        name: '큰 아이콘',
        icon: 'layout-grid-large.svg',
      },
      {
        id: 'icon_small',
        name: '작은 아이콘',
        icon: 'layout-grid-small.svg',
      },
    ],
  },
]);

defineExpose({
  menu,
  tools: true,
  state: true,
  path: path.value
})
</script>

<template>
  <main
    ref="mainRef"
    class="outline scroll"
  >
    <!-- 큰 아이콘 -->
    <section class="icon-lg">
      <div
        v-for="file of myFiles"
        :key="file.id"
        :style="iconStyle"
        :class="{
          clicked: clickedFile === file.id
        }"
        :title="file.name"
        class="icon"
        @click="clickedFile = file.id"
        @dblclick="open(file)"
      >
        <img
          :src="require(`@/assets/icons/line/${file.icon}`)"
          alt="file.title"
          class="filter"
        />
        <span>{{ file.name }}</span>
      </div>
    </section>
  </main>
</template>

<style scoped>

main {
  height: 100%;
  background-color: black;

  section.icon-lg {
    display: flex;
    flex-wrap: wrap;

    .icon {
      display: flex;
      flex-direction: column;
      color: var(--main-color);
      gap: 5px;
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

      img {
        width: 40px;
        height: 40px;
        /* filter: invert(22%) sepia(95%) saturate(2040%) hue-rotate(95deg) brightness(100%) contrast(108%); */
      }

      &.clicked {
        span {
          background-color: black;
          padding: 0 3px 2px 3px;
          /* border: 1px dotted lightgrey; */
          /* border-radius: 9px; */
          color: white;
          overflow: visible;
          text-overflow: unset;
          white-space: unset;
          position: relative;
        }
      }
    }
  }
}

.bubble {
  position: absolute;
  background-color: var(--system-light-color);
  z-index: 11;
  width: 160px;

  ul {
    margin: 6px 0;
    padding: 0 6px;
    list-style: none;
  }
}
</style>
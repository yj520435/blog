<script setup>
import { onMounted, ref, defineProps, defineExpose, computed, watch } from 'vue';
import { useStore } from '@/store';
import { getFiles, loadDir, loadFile } from '@/utils';

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

const items = ref([])

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

async function open(item) {
  if (item.component) {
    const contents = await loadFile(item)
    store.open({ ...item, params: contents })
  }
  else {
    items.value = []
    items.value = await loadDir(item.id)
  }
}

onMounted(async () => {
  items.value = await loadDir()
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
        v-for="item of items"
        :key="item.id"
        :style="iconStyle"
        :class="{ clicked: clickedFile === item.id }"
        :title="item.name"
        class="icon"
        @click="clickedFile = item.id"
        @dblclick="open(item)"
      >
        <img
          :src="require(`@/assets/icons/line/${item.icon}`)"
          alt="item.title"
          class="filter"
        />
        <div>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

main {
  height: 100%;
  background-color: black;
  overflow: auto;

  section.icon-lg {
    display: flex;
    flex-wrap: wrap;

    .icon {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      color: var(--main-color);
      gap: 5px;
      width: 90px;
      height: 70px;
      padding: 5px;
      cursor: pointer;
      border: 1px solid transparent;

      div {
        margin: 0 auto;
        width: 70px;
        height: 16px;
        text-align: center;
      }

      span {
        display: inline-block;
        position: relative;
        max-width: 70px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 1px;
        /* position: absolute;
        max-width: 70px;
        padding: 0 3px 2px 3px;
 */
      }

      img {
        margin: 0 auto;
        width: 40px;
        height: 40px;
      }

      &.clicked {
        div {
          span {
            background-color: var(--main-color);
            color: var(--background-color);
            height: auto;
            text-wrap: unset;
            overflow-wrap: anywhere;
            z-index: 2;
          }
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
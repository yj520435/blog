<script setup>
import { onMounted, ref, defineProps, defineExpose, computed, watch } from 'vue';
import { usePopup, useStore } from '@/store';
import { getFiles, loadDir, loadFile } from '@/utils';
import Popup from './Popup.vue';
import { Base64, decode, toBase64 } from 'js-base64';

const props = defineProps(['on']);

const mainRef = ref();

const path = ref('archive')
const clickedFile = ref()

const loading = ref(true)
const progress = ref(0)
const apiCallSuccess = ref(false)

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
const popup = usePopup()

async function open(item) {
  if (item && item.component) {
    const file = await loadFile(item)
    const contents = decode(file.data.content)
    store.open({ ...item, params: contents })
  }
  else {
    loading.value = true
    progress.value = 0
    const onLoading = setInterval(() => {
      progress.value = (progress.value < 10) ? progress.value + 1 : 10
    }, 50)
    items.value = []
    try {
      items.value = await loadDir(!item ? 'src/archive' : item.id)
    } catch (error) {
      console.error(error)
      popup.on({ message: 'Cannot Access Directory Now' })
    } finally {
      loading.value = false
      clearInterval(onLoading)
    }
  }
}

onMounted(async () => {
  open()
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
      {
        id: 'B',
        name: '리스트B',
        icon: 'fa-user',
      },
      {
        id: 'C',
        name: '리스트C',
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
    <section class="loading" v-if="loading">
      <h3>Loading</h3>
      <div>
        <div v-for="i of progress" :key="i"></div>
      </div>
    </section>
    <!-- <Popup v-if="!apiCallSuccess"/> -->
  </main>
</template>

<style scoped>
main {
  height: 100%;
  overflow: auto;
  padding: 2px;
  background-color: #ffffffaa;
  
  section.icon-lg {
    display: flex;
    flex-wrap: wrap;

    .icon {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      color: var(--line-color);
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
            background-color: var(--text-color);
            color: #ffffff;
            padding: 0 3px 2px 3px;
            height: auto;
            text-wrap: unset;
            overflow-wrap: anywhere;
            z-index: 2;
          }
        }
      }
    }
  }

  section.loading {
    width: calc(100% - 8px);
    height: calc(100% - 129px);
    position: absolute;
    top: 98px;
    left: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--shadow-color);
    gap: 10px;

    h3 {
      color: var(--text-color);
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }

    > div {
      border: 3px solid var(--text-color);
      width: 140px;
      height: 30px;
      display: flex;
      padding: 3px;
      gap: 2px;

      div {
        width: 11px;
        height: 18px;
        background-color: var(--text-color);

        &.p-70 {
          animation: progress-70 1s forwards;
        }
        
        &.p-100 {
          animation: progress-100 0.5s forwards;
        }
      }
    }
  }
}

@keyframes progress-70 {
  0% {
    width: 0%;
  }

  100% {
    width: 80%;
  }
}

@keyframes progress-100 {
  0% {
    width: 80%;
  }

  100% {
    width: 100%;
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
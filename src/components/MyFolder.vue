<script setup>
import { onMounted, ref, defineProps, defineExpose, computed, watch, defineEmits } from 'vue';
import { useProgram, usePopup, useDrive } from '@/store';
import { loadDir, loadDirFromGDrive, loadFile } from '@/utils';
import { decode } from 'js-base64';

const props = defineProps(['on']);

const PID = 'myFolder'

const program = useProgram()
const drive = useDrive()
const popup = usePopup()

const mainRef = ref();

const options = ref({
  menu: [
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
  ],
  state: true,
  path: []
})

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
const footprints = ref([])
const path = ref('/')

const clickedFile = ref()

const loading = ref(true)
const progress = ref(0)

async function openFile(item) {
  if (item && item.component) {
    program.open(item)
    const file = await loadFile(item)
    // const contents = decode(file)
  }
}

async function openDir(item) {
  items.value = []
  items.value = item.items
  footprints.value.push(items.value)
  options.value.path.push(item.name)

  // if (_items == undefined) {
  //   try {
  //     items.value = await loadDir(item);
  //   } catch (error) {
  //     // 에러
  //   } finally {
  //     program.afterExecute('myFolder')
  //   }
  // }
  // else {
  //   items.value = _items
  //   program.afterExecute('myFolder')
  // }
}

const menu = ref();

defineExpose({
  options: options.value,
  goRoot: () => {
    items.value = footprints.value[0]
    options.value.path = []
  },
  goBack: () => {
    footprints.value.pop()
    options.value.path.pop()
    items.value = footprints.value[footprints.value.length - 1]
  }
})

onMounted(async () => {
  program.ready('myFolder', async () => {
    items.value = await loadDir()
    footprints.value.push(items.value)
  }, { message: 'Loading Archive' })
  // program.ready('myFolder', async () => {
  //   items.value = await loadDir()
  //   footprints.value.push(items.value)
  //   console.log('> items', items.value)
  // }, { message: 'Loading Archive' })
})
</script>

<template>
  <main
    ref="mainRef"
    class="outline scroll"
  >
    <!-- BIG ICON -->
    <section class="icon-lg">
      <div
        v-for="item of items"
        :key="item.id"
        :style="iconStyle"
        :class="{ clicked: clickedFile === item.id }"
        :title="item.name"
        class="icon"
        @click="clickedFile = item.id"
        
      ><!-- @dblclick="!item.component ? openDir(item) : openFile(item)" -->
        <img
          :src="require(`@/assets/icons/line/${item.type === 'dir' ? 'folder.svg' : 'file.svg'}`)"
          alt="item.name"
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
  overflow: auto;
  padding: 2px;
  background-color: var(--shadow-color);
  
  section.icon-lg {
    display: flex;
    flex-wrap: wrap;

    .icon {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      color: var(--text-color);
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
}
</style>
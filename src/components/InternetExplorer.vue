<script setup>
import { computed, onMounted, ref, watch, defineProps, defineExpose, toRefs, toRef, toRaw } from 'vue';
import { highlightCode } from '@/assets/highlighter';
import { loadDir } from '@/utils';
import { Converter } from 'showdown';
import WindowButton from './WindowButton.vue';

const props = defineProps(['size'])

const divStyle = ''

const { size } = toRefs(props)

const iframe = ref()

const dirs = ref([])
const posts = ref([])
const dirsRef = ref()
const dirHierarchy = ref('')
const openedDir = ref([])

const isNavExpanded = ref()
const post = ref()

const focused = ref({ path: '', item: null })

const path = ref('archive')
const subpath = ref()

const currentPath = ref('')
const currentItem = ref()

function createUl(tab) {
  const ul = document.createElement('ul')
  ul.style.cssText = `
    margin: 0; 
    padding: 0; 
    list-style: none;
    margin-left: ${tab}px;
  `
  return ul
}

function createDiv() {
  const div = document.createElement('div')
  div.style.cssText = `
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `
  return div
}

function createImg(init) {
  const img = document.createElement('img')
  img.src = require(`@/assets/icons/${init}`)
  img.style.cssText = `
    width: 16px;
    height: 16px;
  `
  return img
}

function createSpan(text) {
  const span = document.createElement('span')
  span.innerText = text
  span.style.cssText = `
    border: 1px dotted transparent;
  `
  return span
}


async function loadFile() {
  const tempPost = await fetch(`${currentPath.value}/${currentItem.value.name}`)
  const markdown = await tempPost.text()

  const converter = new Converter()
  post.value = converter.makeHtml(markdown)
}

async function loadDirHierarchy(path, target, depth) {
  const items = await loadDir(path)

  for (const item of items) {
    const isFolder = !item.component

    if (isFolder) {
      const ul = createUl(depth * 20)
      const div = createDiv()
      const img = createImg('folder.svg')
      const span = createSpan(item.name)

      div.onclick = () => {
        if (!div.classList.contains('opened')) {
          loadDirHierarchy(`${path}/${item.name}`, ul, depth + 1)
          img.src = require('@/assets/icons/folder-open.svg')
          div.classList = 'opened'
        } else {
          const copiedDiv = ul.childNodes[0]
          ul.innerHTML = ''
          ul.appendChild(copiedDiv)
          img.src = require('@/assets/icons/folder.svg')
          div.classList = ''
        }
      }

      div.appendChild(img)
      div.appendChild(span)

      ul.appendChild(div)
      target.appendChild(ul)

    }
    else {
      const li = document.createElement('li')
      li.style.marginLeft = depth ? '20px' : '0'

      const div = createDiv()
      const img = createImg('file-lines.svg')
      const span = createSpan(item.name)

      div.onclick = () => {
        span.classList = span.classList.contains('focused') ? '' : 'focused'
        currentPath.value = path
        currentItem.value = item
      }

      div.appendChild(img)
      div.appendChild(span)
      
      li.appendChild(div)
      target.appendChild(li)
    }
  }
}

const ulRef = ref()


onMounted(async () => {
  if (ulRef.value) {
    loadDirHierarchy(path.value, ulRef.value, 0)
  }
})

const sectionRef = ref()


watch(sectionRef, (v) => {
  console.log('>>>>', v)
}, {
  deep: true
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
        onClick: () => isShowPopup.value = true
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

defineExpose({
  menu
})

// const computedWidth = computed(() => {
//   if (sectionRef.value) {
//     console.log('>>', sectionRef.value.scrollWidth)
//     return sectionRef.value.scrollWidth
//   }
//   else {
//     return 1
//   }
// })

// watch(computedWidth, (v) => {
//   console.log('computedWidth', v)
// })

// onMounted(() => {
//   if (sectionRef.value)
//     computedWidth.value = sectionRef.value.scrollWidth
//   // const ref = document.getElementsByClassName('ie-section')[0]
//   // console.log('>> Ref', ref)
//   // ref.addEventListener('resize', (v) => {
//   //   console.log(v)
//   // })
// })

const isActiveCancelButton = ref(false)
const isActiveSubmitButton = ref(false)

const isShowPopup = ref(false)
</script>

<template>
  <main class="inset scroll">
    <section ref="sectionRef">
      <article v-html="post"></article>
      <div class="shade"></div>
    </section>
    <div class="popup" v-if="isShowPopup">
      <section class="outset">
        <div class="title">검색</div>
        <input class="inset" placeholder="찾아보세요...">
        <ul class="dirs inset scroll" ref="ulRef"></ul>
        <div class="buttons">
          <WindowButton
            name="취소"
          />
          <WindowButton
            name="확인"
            :disabled="!currentPath || !currentItem"
            @click="loadFile"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@keyframes slide-down {
  0% {
    height: 58px;
  }

  100% {
    height: 150px;
  }
}

@keyframes slide-up {
  0% {
    height: 150px;
  }

  100% {
    height: 58px;
  }
}

.slide-up {
  animation: 0.6s slide-up forwards;
}

.slide-down {
  animation: 0.6s slide-down forwards;
}

main {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-weight: normal;
  background-color: white;
}

main > section {
  margin-top: 40px;
  padding: 20px;
}

main div.popup {
  position: absolute;
  top: 67px;
  left: 0;
  background-color: transparent;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
  width: calc(100% - 8px);
  height: calc(100% - 74px);
  font-family: 'Noto Sans KR';
}

div.popup section {
  width: 300px;
  height: 300px;
  background-color: var(--system-color);
  position: absolute;
}

div.popup section div.title {
  background-color: navy;
  width: 100%;
  height: 30px;
  color: white;
  font-family: 'Noto Sans KR';
  display: flex;
  align-items: center;
  font-weight: bold;
  padding-left: 10px;
}

div.popup section input {
  width: calc(100% - 20px);
  height: 30px;
  margin: 10px;
  outline: none;
}

div.popup section div.buttons {
  display: flex;
  justify-content: space-between;
  margin: 0 10px 10px 10px;
}

div.popup section div.buttons button {
  width: 133px;
  height: 30px;
  background-color: var(--system-color);
  font-family: 'Noto Sans KR';
  font-size: 14px;
}

div.popup section ul.dirs {
  background-color: white;
  padding: 3px 10px;
  height: calc(100% - 130px);
  margin: 0 10px 10px 10px;
  overflow: auto;
}
</style>
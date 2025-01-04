<script setup>
import { useDrive, usePopup } from '@/store';
import axios from 'axios';  
import { encode } from 'js-base64';
import { Octokit } from 'octokit';
import { Converter } from 'showdown';
import { ref, defineExpose, watch, onMounted, computed } from 'vue';
import MyFolder from './MyFolder.vue';
import Modal from './Modal.vue';
import { loadDir, loadDirHierarchy } from '@/utils';

const drive = useDrive()

const viewMode = ref('double')
const isSingleMode = computed(() => viewMode.value === 'single')

const markdown = ref('')
const html = ref('')

const options = ref({
  menu: [
    {
      id: 'file',
      name: 'File',
      submenu: [
        {
          id: 'save',
          name: 'Save',
          onClick: save
        },
      ]
    },
    {
      id: 'view',
      name: 'View',
      submenu: [
        {
          id: 'markdown',
          name: 'Markdown',
          onClick: () => viewMode.value = 'single'
        },
        {
          id: 'html',
          name: 'Markdown/HTML',
          onClick: viewHTML
        }
      ]
    }
  ]
})

const popup = usePopup()

const divRef = ref()
const ulRef = ref()

const init = ref(true)


const targetDir = ref({
  id: 'ROOT',
  name: '(Root)'
})
const title = ref('')



// const isModalOn = ref(false)
const isSelectOn = ref(false)

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

function createLi(item, tab) {
  const li = document.createElement('li')
  li.style.cssText = `
    margin: 0; 
    padding: 0; 
    list-style: none;
    margin-left: ${tab}px;
  `
  return li
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
  img.src = require(`@/assets/icons/line/${init}`)
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

// async function loadDirHierarchy(path, target, depth) {

//   // ROOT
//   const li = createLi(0)
//   const img = createImg('folder.svg')
//   const span = createSpan('archive')

//   li.appendChild(img)
//   li.appendChild(span)
//   target.appendChild(li)
  
// }


async function save() {
  // isModalOn.value = true
  modalOn.value = true
  // popup.on({
  //   type: 'prompt',
  //   icon: 'key.svg',
  //   message: 'API Key',
  // })



  // console.log(text)
  // const octokit = new Octokit({
  //   auth: ''
  // })

  // await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
  //   owner: 'yj520435',
  //   repo: 'yj520435.github.io',
  //   path: 'archive/test.md',
  //   message: 'Create new file',
  //   committer: {
  //     name: 'yj520435',
  //     email: 'yj520435@gmail.com'
  //   },
  //   content: encode('테스트'),
  //   headers: {
  //     'X-GitHub-Api-Version': '2022-11-28'
  //   }
  // })
}

function viewHTML() {
  const converter = new Converter()
  html.value = converter.makeHtml(markdown.value)
  viewMode.value = 'double'
}

defineExpose({
  options,
})

watch(markdown, (v) => {
  const converter = new Converter()
  html.value = converter.makeHtml(markdown.value)
})

function createHierarchy(target, tab) {
  const dirItems = target.filter((v) => v.type === 'dir')

  for (const item of dirItems) {
    items.value.push({
      ...item,
      tab
    })
    if (Object.keys(item).includes('items'))
      createHierarchy(item.items, tab + 1)
  }
}

const items = ref([])
onMounted(async () => {
  const storedItems = await loadDir()

  items.value.push({
    id: 'ROOT',
    name: '(Root)',
    type: 'dir',
    tab: 0
  })

  createHierarchy(storedItems, 1)
  // for (const item of storedItems)
  //   items.value.push(item)
  // directory.value = await loadDirHierarchy('archive', 0)
  // for (const item of list)
  //   ulRef.value.appendChild(item)
  // loadDirHierarchy('archive', ulRef.value, 0)
  // console.log(divRef.value.scrollHeight, divRef.value)
})

const modalOn = ref(false)

</script>

<template>
  <main :class="`grid-${viewMode}-mode`">
    <textarea
      autofocus
      v-model="markdown"
      class="outline scroll"
    />
    <article
      v-if="viewMode === 'double'"
      v-html="html"
      class="outline scroll"
    />
  </main>
  <Modal v-if="modalOn" width="400" icon="save-fill.svg" title="Save As">
    <div class="modal-contents">
      <div
        class="outline selectbox"
        @click="isSelectOn = !isSelectOn; init = false"
      >
        <div :style="`color: ${!targetDir.id ? 'gray' : 'black'};`">
          <span>{{ targetDir.name || 'Path' }}</span>
          <img :src="require('@/assets/icons/arrow-drop-down-line.svg')" alt="">
        </div>
        <ul
          v-if="isSelectOn"
          class="outline scroll"
          :class="{ 'slide-down' : isSelectOn }"
          :style="{
            height: `${items.length * 30}px`,
            maxHeight: '200px'
          }"
        >
          <li
            v-for="item of items"
            :key="item.id"
            :style="`padding-left: ${8 + 10 * item.tab}px`"
            @click="targetDir = { id: item.id, name: item.name }"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <input v-model="title" type="text" placeholder="Title" class="outline" />
      <input type="text" placeholder="API Key" class="outline" />
      <div class="buttons">
        <button class="cancel" @click="modalOn = false">
          <div class="outline">
            Cancel
          </div>
        </button>
        <button class="submit">
          <div class="outline">
            OK
          </div>
        </button>
      </div>
    </div>
  </Modal>
</template>
<style scoped>

main {
  width: 100%;
  height: calc(100% - 2px);
  display: grid;
  gap: 2px;

  &.grid-single-mode {
    grid-template-columns: 1fr;
  }

  &.grid-double-mode {
    grid-template-columns: 1fr 1fr;
  }

  textarea {
    width: 100%;
    height: 100%;
    resize: unset;
    /* border: none; */
    outline: none;
    padding: 10px;
    font-size: 16px;
    font-family: 'DungGeunMo';
    line-height: 20px;
    cursor: var(--insert-cursor);
    background-color: #00000030;
  }

  article {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    /* background-color: #ffffff; */
    overflow-wrap: anywhere;
    background-color: #00000030;
  }
}

/* section {
  width: 600px;
  height: 300px;
  position: absolute;
  background-color: #ffffff;
  top: 50px;
  left: 50px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  div {
    
    &.title {
      background-color: var(--text-color);
      height: 29px;
    }

    &.body {
      height: calc(100% - 100px);
    }

    &.buttons {
      margin: 2px;
      width: 100%;
      display: flex;
      justify-content: center;
      gap: 30px;

      button {
        width: fit-content;
        height: 36px;
        border: none;
        color: var(--base-color);
        background-color: var(--text-color);
        padding: 2px;
        cursor: var(--pointer-cursor);

        &.submit {
          text-decoration: underline;
        }

        &.cancel {
          background-color: #666666;
        }

        div {
          width: 103px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-color: var(--base-color);
        }
      }
    }
  } 
} */

div.modal-contents {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-left: 0;
  width: 100%;

  .selectbox {
    height: 30px;
    width: 100%;
    padding: 0 8px;
    background-color: #ffffff;
    
    > div {
      display: grid;
      grid-template-columns: 1fr 16px;
      align-items: center;
      color: #00000086;

      img {
        width: 24px;
      }
    }

    ul {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      position: relative;
      top: 2px;
      width: 348px;
      left: -10px;
      list-style: none;
      overflow-y: auto;


      &.slide-down {
        animation: slide-down 0.3s forwards;
      }

      /* &.slide-up {
        animation: slide-up 0.3s forwards;
      } */

      li {
        display: flex;
        height: 28px;
        align-items: center;
        margin: 0;

        &:hover {
          color: var(--base-color);
          background-color: var(--text-color);
        }
      }
    }
  }



  input {
    width: 100%;
    outline: none;
    padding: 6px 8px;
  }

  div.buttons {
    margin: 0;
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;

    button {
      width: fit-content;
      height: 36px;
      border: none;
      color: var(--base-color);
      background-color: var(--text-color);
      padding: 2px;
      cursor: var(--pointer-cursor);

      &.submit {
        text-decoration: underline;
      }

      &.cancel {
        background-color: #666666;
      }

      div {
        width: 103px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-color: var(--base-color);
      }
    }
  }
}
/* 
@keyframes slide-up {
  0% {
    height: 100%;
    opacity: 1;
  }

  100% {
    height: 0;
    opacity: 0;
  }
} */

@keyframes slide-down {
  0% {
    height: 0;
  }

  100% {
    height: 1;
  }
}
</style>
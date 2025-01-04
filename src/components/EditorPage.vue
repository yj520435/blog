<script setup>
import { createFile, loadDir } from '@/utils';
import { Converter } from 'showdown';
import { onMounted, ref, watch, defineProps, defineEmits, computed } from 'vue';

const props = defineProps(['interactParams'])
const emits = defineEmits(['interactEmits'])

const target = computed(() => props.interactParams.target)

const title = ref('')
/* target.value.type === 'dir' ? '' : target.value.name */
const markdown = ref('')
/* target.value.type === 'dir' ? '' : target.value.contents */
const html = ref('')

// watch(target, (v) => {
//   console.log('TARGET', v)
//   markdown.value = v.contents
// }, {
//   deep: true
// })

function onLoad() {
  if (target.value.type === 'file') {
    title.value = target.value.name
    markdown.value = target.value.contents
  }
}

watch(markdown, (v) => {
  const converter = new Converter()
  html.value = converter.makeHtml(markdown.value)
})

const targetDir = ref({
  id: '',
  name: ''
})
const isSelectOn = ref(false)

async function onSubmit() {
  await createFile(props.params.target, title.value, markdown.value)
}

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
  onLoad()
})

const modal = ref(false)

async function save() {
  const result = await createFile(title.value, markdown.value)
  console.log(result)
}

function onClose() {
  emits('interactEmits', { action: 'close' });
}
</script>
<template>
  <main class="modal" v-if="modal">
    <div class="modal-contents">
    <div
      class="selectbox"
      @click="isSelectOn = !isSelectOn; init = false"
    >
      <div :style="`color: ${!targetDir.id ? 'gray' : 'black'};`">
        <span>{{ targetDir.name || 'Path' }}</span>
        <img :src="require('@/assets/icons/arrow-drop-down-line.svg')" alt="">
      </div>
      <ul
        v-if="isSelectOn"
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
    <input type="text" placeholder="title">
  </div>
  </main>

  <main>
    <section class="buttons">
      <div class="lt" v-if="props.interactParams.action === 'create'">
        <button @click="onSubmit">
          <img :src="require('@/assets/icons/pen-fill.svg')" alt="">
          SUBMIT
        </button>
      </div>
      <div class="lt" v-if="props.interactParams.action === 'update'">
        <button>
          <img :src="require('@/assets/icons/pen-fill.svg')" alt="">
          UPDATE
        </button>
        <button>
          <img :src="require('@/assets/icons/delete-bin-line.svg')" alt="">
          DELETE
        </button>
      </div>
      <div class="rt">
        <button @click="onClose">
          <img :src="require('@/assets/icons/close-line.svg')" alt="">
          CLOSE
        </button>
      </div>
    </section>
    <input v-model="title" placeholder="Title">
    <section class="textarea">
      <textarea v-model="markdown" class="scroll" />
    </section>
    <section class="article scroll">
      <article v-html="html"></article>
    </section>
  </main>
</template>

<style scoped>

main.modal {
  position: absolute;
  background-color: #00000060;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  div.modal-contents {
    width: 300px;
    height: 100px;
    background-color: #ffffff;
    border: 2px solid black;
    box-shadow: 4px 4px 0 black;
  }
}


main {
  padding: 20px 0;
  display: grid;
  grid-template-rows: auto auto 1fr 1fr;
  height: 100%;
  gap: 20px;

  h1, h2, h3 {
    margin: 0;
    font-weight: normal;
  }
  
  hr {
    width: calc(100% - 40px);
    height: 1px;
    border-top: 1px dashed red;
    /* border: 1px dashed red; */
  }

  input {
    /* width: 100%; */
    /* padding: 0 8px; */
    outline: none;
    margin: 0 20px;
    border: none;
    border-bottom: 1px solid #dddddd;
    font-size: 24px;
    font-family: inherit;
    font-weight: bold;
    padding: 6px 0;

    &::placeholder {
      font-size: 24px;
      color: #aaaaaa;
    }
  }

  section {
    height: 100%;
    margin: 0 20px;

    &.article {
      overflow-y: auto;
      /* background-color: #eeeeee60; */
      padding: 10px 6px;
    }

    textarea {
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      resize: none;
      font-family: inherit;
      font-weight: normal;
      font-size: 14px;
      overflow-y: auto;
      padding: 0 6px;
    }
    
    article {
      width: 100%;
      margin: 0;
    }
  }

  section.buttons {
      display: flex;
      justify-content: space-between;
      margin: 0 20px;

      button {
        background-color: #bbbbbb;
        color: #ffffff;
        font-family: 'DungGeunMo';
        font-size: 16px;
        border: none;
        padding: 0;
        display: flex;
        padding: 3px 6px;
        border-radius: 6px;
        align-items: center;
        gap: 4px;

        img {
          width: 20px;
          height: 20px;
          filter: invert(100%) sepia(0%) saturate(17%) hue-rotate(334deg) brightness(105%) contrast(105%);
        }
      }
      
      div.lt {
        display: flex;
        gap: 20px;
      }

      div.rt {
      }
  }

}

.selectbox {
    height: 30px;
    width: 100%;
    padding: 0 8px;
    
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
      width: 100%;
      left: -9px;
      list-style: none;
      overflow-y: auto;
      border: 1px solid black;


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

  @keyframes slide-down {
  0% {
    height: 0;
  }

  100% {
    height: 1;
  }
}

/* .buttons {
  button {
    background-color: #eeeeee;
    border: none;
    margin: 0 4px;
    border-radius: 6px;
    font-family: inherit;
    font-size: 16px;
    padding: 4px 8px;
  }
} */
</style>
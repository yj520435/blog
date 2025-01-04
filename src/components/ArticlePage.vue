<script setup>
import { usePopup } from '@/store';
import { deleteFile, loadFile, updateFile } from '@/utils';
import { Converter } from 'showdown';
import { computed, onMounted, watch } from 'vue';
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps(['interactParams'])
const emits = defineEmits(['interactEmits'])

const item = computed(() => props.interactParams.target)

const markdown = ref('')
const article = ref()
const popup = usePopup()

const converter = new Converter({ tables: true })

watch(item, async (v) => {
  markdown.value = await loadFile(v)
  article.value = converter.makeHtml(`${markdown.value}`)
})

onMounted(async () => {
  try {
    markdown.value = await loadFile(item.value)
    article.value = converter.makeHtml(`${markdown.value}`)
  } catch (e) {
    console.error(e)
  }
})

async function onDelete() {
  // const result = await deleteFile(item.value.id)
  // console.log(result)
}

async function onUpdate() {
  emits('interactEmits', {
    action: 'update',
    target: { ...item.value, contents: markdown.value }
  })
}

function onClose() {
  emits('interactEmits', { action: 'close' });
}
// const article = computed(() => {
//   const file = await loadFile(v)
//   const converter = new Converter()
//   return converter.makeHtml(file)
// })

    // const file = await loadFile(item)
    // const converter = new Converter()
    // article.value = converter.makeHtml(file)
</script>

<template>
  <main>
    <section class="buttons">
      <div class="lt">
        <button @click="onUpdate">
          <img :src="require('@/assets/icons/pen-fill.svg')" alt="">
          UPDATE
        </button>
        <button @click="onDelete">
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
    <section class="article scroll">
      <article v-html="article"></article>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 20px;
  height: inherit;

  section.buttons {
      display: flex;
      justify-content: space-between;
      margin: 0 20px;

      button {
        background-color: #bbbbbb;
        color: #ffffff;
        font-family: 'DungGeunMo';
        font-size: 16px;
        /* font-weight: bold; */
        /* font-size: 16px; */
        /* padding: 3px; */
        /* border: 2px solid #000000; */
        border: none;
        padding: 0;
        display: flex;
        padding: 3px 6px;
        border-radius: 6px;
        align-items: center;
        gap: 4px;
        /* box-shadow: 4px 4px 0 #000000; */

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

  section.article {
    height: calc(100% - 50px);
    overflow-y: scroll;
    margin: 0 5px;
    padding: 0 15px;
  }
}
</style>
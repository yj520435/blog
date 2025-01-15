<script setup lang="ts">
import { File } from '@/types';
import { loadFile } from '@/utils';
import { Converter } from 'showdown';
import { defineProps, defineEmits, ref, Ref, toRef, watch } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'

const props = defineProps(['file'])
const emits = defineEmits(['ready', 'close'])

const init: Ref<boolean> = ref(true)
const show: Ref<boolean> = ref(false)
const mainRef = ref()

const converter = new Converter({ tables: true })
const markdown: Ref<string> = ref('')
const html: any = ref()

// File Load
const file: Ref<File> = toRef(() => props.file)
watch(file, async (value: File) => {
  if (!value)
    return

  markdown.value = await loadFile(value.id)
  html.value = converter.makeHtml(`${markdown.value}`)

  emits('ready')

  show.value = true
  init.value = false

  // Code highlight
  setTimeout(() => {
    hljs.highlightAll()
  }, 500)

  // Scroll
  if (mainRef.value)
    mainRef.value.scrollTo(0, 0)
})

function onClose() {
  show.value = false
  emits('close')
}
</script>

<template>
  <main
    ref="mainRef"
    id="article"
    :class="{
      in : show && !init,
      out : !show && !init
    }"
    class="scroll"
  >
    <section class="buttons">
      <button @click="onClose">
        <img :src="require('@/assets/icons/close.svg')" alt="close">
      </button>
    </section>
    <section class="article">
      <article v-html="html" />
    </section>
    <!-- <div>
      <CodeHighLight language="js">
        console.log(11)
      </CodeHighLight>
    </div> -->
  </main>
</template>
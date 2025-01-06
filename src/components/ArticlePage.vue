<script setup lang="ts">
import { File } from '@/types/base';
import { loadFile } from '@/utils';
import { Converter } from 'showdown';
import { defineProps, defineEmits, ref, Ref, toRef, watch } from 'vue';

// Props
const props = defineProps(['file', 'flag'])
const emits = defineEmits(['close'])

const file: Ref<File> = toRef(() => props.file)

const init: Ref<boolean> = ref(true)
const show: Ref<boolean> = ref(false)

// Loading
const count: Ref<number> = ref(0)
const loading: Ref<boolean> = ref(false)
let interval: number | undefined = undefined

function onCount() {
  count.value = count.value < 6 ? count.value + 1 : 0
}

watch(loading, (v: boolean) => {
  if (v) {
    count.value = 0
    interval = setInterval(onCount, 500)
  } else {
    clearInterval(interval)
    interval = undefined
  }
})

// File Load
const converter = new Converter({ tables: true })
const markdown: Ref<string> = ref('')
const html: any = ref()

watch(file, async (value: File) => {
  if (!value)
    return

  loading.value = true
  show.value = true
  init.value = false

  markdown.value = await loadFile(value.id)
  html.value = converter.makeHtml(`${markdown.value}`)

  loading.value = false
})

function onClose() {
  show.value = false
  emits('close')
}
</script>

<template>
  <main
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
    <section v-if="loading" class="loading">
      <article>
        <h1>loading</h1>
        <div>
          <span v-for="i of count" :key="i"></span>
        </div>
      </article>
    </section>
    <section v-else class="article">
      <article v-html="html" />
    </section>
  </main>
</template>
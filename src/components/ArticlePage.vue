<script setup lang="ts">
import { File } from '@/types';
import { loadFile } from '@/utils';
import { Converter } from 'showdown';
import { defineProps, defineEmits, ref, Ref, toRef, watch } from 'vue';

const props = defineProps(['file'])
const emits = defineEmits(['ready', 'close'])

const init: Ref<boolean> = ref(true)
const show: Ref<boolean> = ref(false)

  const file: Ref<File> = toRef(() => props.file)

// File Load
const converter = new Converter({ tables: true })
const markdown: Ref<string> = ref('')
const html: any = ref()

watch(file, async (value: File) => {
  if (!value)
    return

  markdown.value = await loadFile(value.id)
  html.value = converter.makeHtml(`${markdown.value}`)
  emits('ready')
  
  show.value = true
  init.value = false
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
    <section class="article">
      <article v-html="html" />
    </section>
  </main>
</template>
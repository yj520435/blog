<script setup>
import { Converter } from 'showdown';
import { ref, defineProps } from 'vue'

const props = defineProps(['params'])

const converter = new Converter()
const post = ref(converter.makeHtml(props.params))

</script>

<template>
  <main class="outline scroll">
    <section ref="sectionRef">
      <article v-html="post"></article>
    </section>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: calc(100% - 2px);
  overflow-y: auto;
  background-color: #ffffffaa
}

article {
  color: var(--text-color);
  padding: 20px;
}
</style>
<script setup>
import { ref, defineProps, watch, toRef } from 'vue'

const props = defineProps(['loading'])

const loading = toRef(() => props.loading)
const count = ref(0)

function onCount() {
  if (count.value < 6)
    count.value++
  else
    count.value = 0
}

let interval = null

watch(loading, (v) => {
  if (v) {
    count.value = 0;
    interval = setInterval(onCount, 500)
  } else {
    clearInterval(interval)
    interval = null
  }
})

</script>
<template>
  <section v-if="props.loading" class="loading">
    <article>
      <h1>loading</h1>
      <div class="bar">
        <span v-for="i of count" :key="i"></span>
      </div>
      <div class="img"></div>
    </article>
  </section>
</template>
<script setup>
import { defineProps, ref, toRefs } from 'vue';

const props = defineProps(["name", "disabled"])

const isPushed = ref(false)

const {
  name,
  disabled
} = toRefs(props)

</script>

<template>
  <button
    :disabled="disabled"
    :class="{ pushed : isPushed }"
    class="outline"
    @mousedown="isPushed = true"
    @mouseup="isPushed = false"
    @mouseleave="isPushed = false"
  >
    {{ name }}
  </button>
</template>

<style scoped>
button {
  border-style: solid;
  color: var(--main-color);
  font-weight: bold;

  &.pushed {
    background-color: var(--main-color) !important;
    color: black;
  }
}
</style>
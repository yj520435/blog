<script setup>
import { ref, defineProps, toRefs } from 'vue';

const props = defineProps(['item'])

const hovered = ref('')
const clicked = ref('')

</script>

<template>
  <div
    class="item"
    @mouseover="hovered = true"
    @mouseout="hovered = false"
    @mousedown="clicked = !clicked"
    :class="{
      'outset': hovered,
      'inset' : clicked
    }"
  >
    <span>{{ props.item.name }}</span>
    <ul
      v-if="clicked"
      class="subitem outset"
      :style="`height: 34px;`"
    >
      <li
        v-for="subitem of props.item.submenu"
        :key="subitem.id"
        @mouseover="(e) => e.target.classList.add('hovered')"
        @mouseout="(e) => e.target.classList.remove('hovered')"
      >{{ subitem.name }}</li>
    </ul>
  </div>
</template>

<style scoped>
.item {
  width: 70px;
  background-color: var(--system-color);
  border: 2px solid transparent;
  margin: 2px;
  text-align: center;
}

.item span {
  pointer-events: none;
}

.subitem {
  position: absolute;
  background-color: var(--system-color);
  list-style: none;
  top: 69px;
  margin: 0;
  padding: 0;
  width: 160px;
  display: flex;
  flex-direction: column;
  animation: 0.3s slide forwards;
  overflow: hidden;

  li {
    display: flex;
    align-items: center;
    padding: 4px 10px;
  }

  li.hovered {
    background-color: navy;
    color: white;
  }
}
</style>
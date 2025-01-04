<script setup>
import { defineProps } from 'vue';

const props = defineProps(['width', 'icon', 'title'])
</script>

<template>
  <main>
    <div class="outline" :style="`width: ${props.width}px;`">
      <section class="title outline">
        <img
          :src="require(`@/assets/icons/${props.icon}`)"
          alt=""
        />
        <span>{{ props.title }}</span>
      </section>
      <section class="body outline">
        <slot />
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  animation: fade-in 0.3s forwards;
  z-index: 10;

  > div {
    color: var(--base-color);
    z-index: 10;
    width: 560px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--base-color);

    .title {
      width: calc(100% - 4px);
      height: 30px;
      margin: 2px 2px 0 2px;
      display: grid;
      background-color: var(--text-color);
      grid-template-columns: 30px 1fr;
      align-items: center;

      > img {
        width: 22px;
        height: 22px;
        margin: 0 2px;
        filter:
          invert(100%) 
          sepia(0%) 
          saturate(17%) 
          hue-rotate(334deg) 
          brightness(105%) 
          contrast(105%);
      }
    }

    .body {
      display: flex;
      width: calc(100% - 4px);
      height: calc(100% - 36px);
      justify-content: center;
      align-items: center;
      color: var(--text-color);
      margin: 2px;
      gap: 20px;
      padding: 20px;
    }
  }
}
</style>
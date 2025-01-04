<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps(['interactParams'])
const emits = defineEmits(['interactEmits'])

onMounted(async () => {})
</script>

<template>
  <main>
    <section class="buttons">
      <div class="lt">
      </div>
      <div class="rt">
        <button @click="onClose">
          <img :src="require('@/assets/icons/close-line.svg')" alt="">
          CLOSE
        </button>
      </div>
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
}
</style>
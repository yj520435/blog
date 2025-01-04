<script setup>
import { usePopup } from '@/store';

const popup = usePopup()
</script>

<template>
  <div v-if="popup.state.show" class="popup">
    <div class="message">{{ popup.state.message }}</div>
    <div class="buttons">
      <button>
        <img :src="require('@/assets/icons/close-line.svg')" alt="">
        CANCEL
      </button>
      <button>
        <img :src="require('@/assets/icons/close-line.svg')" alt="">
        OKAY
      </button>
    </div>
  </div>
</template>

<style scoped>
div.popup {
  position: absolute;
  background-color: #ffffff;
  width: 400px;
  padding: 20px;
  border-radius: 11px;
  /* color: #ffffff; */
  /* box-shadow:
    2px 0 0 #00000080,
    0 2px 0 #00000080,
    -2px 0 0 #00000070,
    0 -2px 0 0 #00000070;
  border-right: 2px solid #00000020;
  border-bottom: 2px solid #00000020; */
  box-shadow: 4px 4px 20px #cccccc;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;

  div.buttons {
    display: flex;
    gap: 20px;

    button {
      background-color: #bbbbbb;
      color: #ffffff;
      font-family: inherit;
      font-size: 16px;
      border: none;
      padding: 0;
      display: flex;
      padding: 3px 6px;
      border-radius: 6px;
      align-items: center;
      gap: 4px;

      img {
        width: 20px;
        height: 20px;
        filter: invert(100%) sepia(0%) saturate(17%) hue-rotate(334deg) brightness(105%) contrast(105%);
      }
    }
  }
}
</style>
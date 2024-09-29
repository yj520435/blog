<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>
<template>
  <div class="address outset">
    <button>
      <FontAwesomeIcon :icon="`fa-solid fa-arrow-left`"/>
    </button>
    <button>
      <FontAwesomeIcon :icon="`fa-solid fa-arrow-right`"/>
    </button>
    <button>
      <FontAwesomeIcon :icon="`fa-solid fa-arrow-turn-up`"/>
    </button>
    <button>
      <FontAwesomeIcon :icon="`fa-solid fa-bookmark`"/>
    </button>
    <div class="input inset">
      <img :src="require('@/assets/icons/directory_closed-1.png')" alt="">
      <input type="text" value="A:\\" />
      <button><FontAwesomeIcon icon="fa-solid fa-caret-down" /></button>
    </div>
  </div>
</template>

<style scoped>
.address {
  background-color: var(--system-color);
  display: grid;
  grid-template-columns: 30px 30px 30px 30px 1fr;
  gap: 2px;
  align-items: center;
  padding: 0;
  margin: 0 2px;
  height: 34px;

  .input {
    background-color: white;
    padding: 0;
    height: calc(100% - 4px);
    display: grid;
    grid-template-columns: 22px 1fr 30px;
    align-items: center;

    img {
      width: 16px;
      height: 16px;
      margin: 0 2px 0 4px;
    }
    
    input {
      border: none;
      outline: none;
      /* font-family: 'Noto Sans KR'; */
      font-size: 14px;
      font-weight: bold;
    }

    button {
      background-color: transparent;
      border: none;
      font-family: 'Noto Sans KR';
      font-size: 14px;
    }
  }
  
  button {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: var(--system-color);
    color: black;
    border: none;
  }
}
</style>
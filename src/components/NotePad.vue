<template>
  <main class="inset">
    <textarea
      autofocus
      class="scroll"
    />
    <!-- <article contenteditable></article> -->
  </main>
</template>
<style scoped>

main {
  height: 100%;
}

textarea {
  width: 100%;
  height: 100%;
  background-color: white;
  resize: unset;
  border: none;
  padding: 10px;
  overflow-y: scroll;
  outline: none;
  font-family: 'Noto Sans KR';
  font-size: 14px;
  line-height: 1.3;
}

/* textarea::-webkit-scrollbar-button:single-button:vertical:decrement {
  border-width: 0 13px 17px 13px;
  border-color: transparent gold red green;
  position: absolute;
} */

/* textarea::-webkit-scrollbar {
  display: none;
} */
</style>
<script setup>
import { ref, defineExpose } from 'vue';


const menu = ref([
  {
    id: 'file',
    name: '파일'
  },
  {
    id: 'edit',
    name: '편집'
  },
  {
    id: 'view',
    name: '보기'
  },
  {
    id: 'move',
    name: '이동'
  },
  {
    id: 'favorite',
    name: '즐겨찾기'
  },
  { id: 'help', name: '도움말' }
])

defineExpose({
  menu
})
</script>

<template>
  <main class="inset">
    <aside>
      <div>
        <span></span>
        <h1>내 컴퓨터</h1>
      </div>
    </aside>
    <section>
      <div
      
      >
        <img />
        <span>대충이름</span>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 200px 1fr;
  background-color: white;
  height: 100%;

  aside {

    div {
      /* position: absolute;
      over
      width: 200px;
      height: 100px;
      background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(56,187,255,1) 100%);
      background-position: 0px 0px;
      background-size: 300px;
      background-repeat: no-repeat;
      transform: rotate(-45deg); */
      width: 100%;
      height: 200px;
      overflow: hidden;

      span {
        display: inline-block;
        background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(56,187,255,1) 100%);
        width: 300px;
        height: 100px;
        transform: rotate(-30deg);
        position: relative;
        top: -40px;
        left: -70px;
      }

      h1 {
        position: relative;
        top: -80px;
        left: 20px;
      }
    }


  }
  
}
</style>
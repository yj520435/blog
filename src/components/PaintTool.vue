<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';


const colors = ref([
  'black',
  'gray',
  'firebrick',
  'darkgoldenrod',
  'darkgreen',
  'darkcyan',
  'navy',
  'purple',
  'goldenrod',
  'darkolivegreen',
  'steelblue',
  'darkblue',
  'royalblue',
  'brown',
  'white',
  'lightgray',
  'red',
  'yellow',
  'lime',
  'deepskyblue',
  'blue',
  'magenta',
  'lemonchiffon',
  'lightgreen',
  'lightblue',
  'plum',
  'deeppink',
  'coral',
])

const tools = ref([
  'line/shape.svg',
  'line/crop.svg',
  'line/eraser.svg',
  'fill/paint.svg',
  'line/magic.svg',
  'line/search.svg',
  'line/contrast-drop.svg',
  'line/font.svg',
  'fill/pen.svg',
  'line/brush.svg',
  'fill/square.svg',
  'fill/circle.svg'
  // 'fa-vector-square',
  // 'fa-draw-polygon',
  // 'fa-eraser',
  // 'fa-fill-drip',
  // 'fa-magic-wand-sparkles',
  // 'fa-magnifying-glass',
  // 'fa-pencil',
  // 'fa-paint-brush',
  // 'fa-spray-can-sparkles',
  // 'fa-a',
  // 'fa-square',
  // 'fa-circle',
])

const clickedTool = ref('')
</script>

<template>
  <main class="outline">
    <section>
      <section class="tools outline">
        <div
          v-for="tool of tools"
          :key="tool"
          @click="clickedTool = tool"
         >
          <img :src="require(`@/assets/icons/${tool}`)" :alt="tool">
        </div>
        <div class="empty outline"></div>
      </section>
      <section class="wrapper outline">
        <div
          class="paper"
        ></div>
      </section>
    </section>
    <section class="palette outline">
      <div class="color outline">
        <div class="outline"></div>
        <div class="outline"></div>
      </div>
      <div class="color-list">
        <div
          v-for="color of colors"
          :key="color"
          class="outline"
          :style="`background-color: ${color};`"  
        ></div>
      </div>
      <div></div>
    </section>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-rows: 1fr 52px;
  padding: 2px;
  background-color: var(--system-color);
  height: 100%;
  gap: 2px;

  > section:first-child {
    display: grid;
    grid-template-columns: 70px 1fr;
    gap: 2px;

    .tools {
      background-color: var(--system-color);
      display: flex;
      flex-wrap: wrap;
      height: fit-content;
      padding: 1px;
      justify-content: center;

      div {
        width: 31px;
        height: 31px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        cursor: pointer;

        img {
          width: 22px;
        }
      }

      div.inset {
        background-color: #dfdfdf;
      }

      > div.empty {
        margin: 10px 6px;
        width: 100%;
        height: 80px;
        background-color: #dfdfdf;
      }
    }


    .wrapper {
      background-color: #777777;

      .paper {
        width: 400px;
        height: 260px;
        background-color: white;
        border: 1px dotted black;
        cursor: not-allowed;
      }
    }
  }

  > section.palette {
    display: grid;
    grid-template-columns: 46px 320px 1fr;
    height: fit-content;
    padding: 2px;

    div.color {
      width: 44px;
      height: 44px;

      div {
        width: 21px;
        height: 21px;
        position: relative;
      }

      > div:first-child {
        background-color:  black;
        top: 4px;
        left: 4px;
        z-index: 10;
      }

      > div:last-child {
        background-color: white;
        top: -8px;
        left: 15px;
      }
    }

    div.color-list {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;

      div {
        width: 21px;
        height: 21px;
      }

    }
  }
}
</style>


<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, defineProps, toRefs, toValue } from 'vue';

const props = defineProps(['menu'])

const menu = ref(props.menu)

console.log(menu.value)

const hoveredMenu = ref()
const clickedMenu = ref()
</script>

<template>
    <div
      class="menu"
    >
    <!--      v-if="program.items.includes('menu')"
      :style="program.items.includes('logo')
        ? 'grid-template-columns: 1fr 56px;'
        : 'grid-template;columns: 1fr'
      "-->
      <div class="item outset">
        <div v-for="item of menu" :key="item.id">
          <div
            class="title"
            @mouseover="hoveredMenu = item.id"
            @mousedown="clickedMenu = item.id"
            @mouseleave="hoveredMenu = ''"
            :class="{
              outset : hoveredMenu === item.id,
              inset : clickedMenu === item.id
              }"
          >
            {{ item.name }}
          </div>
          <ul
            v-if="clickedMenu === item.id"
            class="subitem"
            :style="`height: ${item.submenu.length * 30}px;`"
          >
            <li v-for="subitem of item.submenu" :key="subitem.id">
              <FontAwesomeIcon :icon="`fa-solid ${subitem.icon}`" />
              <span>{{ subitem.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- <div class="icon outset" v-if="program.items.includes('logo')">
        <img
          :src="require('@/assets/icons/windows-0.png')"
          class=""
          alt=""
        />
      </div> -->
    </div>
</template>

<style scoped>
.menu {
  display: grid;
  align-items: center;
  background-color: var(--system-color);
  margin: 2px 2px 0 2px;
  border-bottom: none !important;
  height: 33px;

  div.item {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    height: 100%;

    > div {
      cursor: pointer;
      width: fit-content;
      text-align: center;

      .title {
        padding: 1px 15px 2px 15px;
        border: 2px solid transparent;
      }

      ul.subitem {
        position: absolute;
        background-color: var(--system-color);
        list-style: none;
        top: 69px;
        margin: 0;
        padding: 0;
        width: 160px;
        border: 1px outset white;
        animation: 0.3s slide forwards;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        > li {
          border: 1px outset white;
          display: flex;
          align-items: center;
          height: 100%;
          padding: 0 10px;

          span {
            padding-left: 6px;
          }

          &:hover {
            color: white;
            background-color: navy;
          }
        }
      }
    }
  }

  div.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    
    img {
      height: 28px;
      margin: 0;
      padding: 0 12px;
      background: radial-gradient(circle, rgb(194, 182, 18) 0%, rgb(0, 0, 0) 70%);
    }
  }
}

</style>
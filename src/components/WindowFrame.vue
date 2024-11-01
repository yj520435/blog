<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, ref, defineProps, defineEmits, computed, watch, toRefs, toValue, toRef, toRaw } from 'vue';
import WindowDropdown from './WindowDropdown.vue';

const props = defineProps(['program', 'activated']);
const emit = defineEmits(['close', 'minimize', 'align']);

const program = toValue(props.program)

const folderIcons = [
  ['arrow-left', 'arrow-right', 'corner-right-up',],
  ['copy', 'clipboard', 'scissors'],
  ['refresh', 'trash-can'],
  ['layout-grid-large', 'layout-grid-small', 'list'],
]

const windowObject = ref({
  // x: 150 + 20 * program.index,
  // y: 50 + 20 * program.index,
  x: 150,
  y: 50,
  width: 600,
  height: 450
});
const windowPositionBackup = ref({ ...windowObject.value });
// const fixedPosition = ref({ ...windowObject.value });
const initMousePosition = ref({ x: 0, y: 0 });

const movable = ref(false);

const isMouseDowned = ref(false)
const isButtonPushed = ref({
  minimize: false,
  maximize: false,
  close: false,
});
const isWindowMaximized = ref(false);

function setWindowSize() {
  windowObject.value = isWindowMaximized.value
    ? { x: 300, y: 100, width: 600, height: 450 }
    : { x: 0, y: 0, width: 1913, height: 860 };

  isWindowMaximized.value = !isWindowMaximized.value;
}

// function setInitMousePosition(event) {
//   initMousePosition.value.x = event.x;
//   initMousePosition.value.y = event.y;
//   move.value = true
// }

// const menu = ref([
//   {
//     id: 'file',
//     name: '파일',
//     submenu: [
//       {
//         id: 'a',
//         name: '리스트A',
//         icon: 'fa-user',
//       },
//     ],
//   },
//   {
//     id: 'show',
//     name: '보기',
//     submenu: [
//       {
//         id: 'list',
//         name: '리스트',
//         icon: 'fa-list',
//       },
//       {
//         id: 'icon_big',
//         name: '큰 아이콘',
//         icon: 'fa-cube',
//       },
//       {
//         id: 'icon_small',
//         name: '작은 아이콘',
//         icon: 'fa-cubes',
//       },
//     ],
//   },
// ]);

// const cursor = ref({ n: false, s: false, e: false, w: false })
const resizable = ref({ n: false, s: false, e: false, w: false })

//nesw-resize  nwse-resize
const cursorStyle = computed(() => {
  if ((resizable.value.n && resizable.value.e) || (resizable.value.s && resizable.value.w))
    return 'nesw-resize'
  else if ((resizable.value.n && resizable.value.w) || (resizable.value.s && resizable.value.e))
    return 'nwse-resize'
  else if (resizable.value.n || resizable.value.s)
    return '--resize-ns-cursor'
  else if (resizable.value.e || resizable.value.w)
    return '--resize-ew-cursor'
  else
    return '--base-cursor'
})

watch(movable, (v) => {
  if (v)
    resizable.value = { n: false, w: false, e: false, s: false }
})

function onMouseMove(event) {
  if (isMouseDowned.value) {
    const movedX = event.x - initMousePosition.value.x;
    const movedY = event.y - initMousePosition.value.y;

    if (movable.value) {
      windowObject.value.x = windowPositionBackup.value.x + movedX;
      windowObject.value.y = windowPositionBackup.value.y + movedY;
    }
    else {
      if (resizable.value.n) {
        windowObject.value.height = windowPositionBackup.value.height - movedY
        windowObject.value.y = windowPositionBackup.value.y + movedY
      }

      if (resizable.value.s) {
        windowObject.value.height = windowPositionBackup.value.height + movedY
      }

      if (resizable.value.w) {
        windowObject.value.width = windowPositionBackup.value.width - movedX
        windowObject.value.x = windowPositionBackup.value.x + movedX
      }

      if (resizable.value.e) {
        windowObject.value.width = windowPositionBackup.value.width + movedX
      }
    }
  }
  else {
    const diffTop = event.y - (windowObject.value.y + windowObject.value.height)
    const diffBottom = event.y - windowObject.value.y
    const diffLeft = event.x - windowObject.value.x
    const diffRight = event.x - (windowObject.value.x + windowObject.value.width)

    resizable.value = {
      n: diffBottom > -10 && diffBottom < 3 && !movable.value,
      s: diffTop > -11 && diffTop < 3,
      w: diffLeft > -16 && diffLeft < 0,
      e: diffRight > -20 && diffRight < -10,
    }
    
    document.body.style.cursor = `var(${cursorStyle.value})`
  }
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)

  menu.value = componentRef.value.menu
  state.value = componentRef.value.state
  tools.value = componentRef.value.tools
  path.value = componentRef.value.path
});

const componentRef = ref()
const bodyRef = ref()

function onMouseUp(event) {
  isMouseDowned.value = false

  movable.value = false
  resizable.value = { n: false, w: false, e: false, s: false }
  windowPositionBackup.value = { ...windowObject.value }

  for (const button of ['minimize', 'maximize', 'close'])
    isButtonPushed.value[button] = false;
}

function onMouseDown(event) {
  // if (!hoveredMenu.value)
  //   clickedMenu.value = ''

  initMousePosition.value = { x: event.x, y: event.y }
  isMouseDowned.value = true
}

const menu = ref()
const state = ref()
const tools = ref()
const path = ref()

const hoveredMenu = ref()
const clickedMenu = ref()
const hoveredSubMenu = ref()

const windowRef = ref()
</script>

<template>
  <div
    class="window outline"
    :class="props.activated ? 'activated' : 'inactivated'"
    :style="`
      top: ${windowObject.y}px;
      left: ${windowObject.x}px;
      width: ${windowObject.width}px;
      height: ${windowObject.height}px;
    `"
  >
    <!-- TITLE -->
    <div
      class="title"
      @mousedown="movable = true;"
      @mouseup="movable = false"
    >
      <img
        :src="require(`@/assets/icons/fill/${program.icon}`)"
        :class="{ filter: !props.activated }"
        alt=""
      />
      <span>{{ program.name }}</span>
      <button

      >
      <!-- @mousedown="isButtonPushed.minimize = true"
      @click="emit('minimize')" -->
      </button>
      <button
      >
      <!-- @mousedown="isButtonPushed.maximize = true"
      @click="setWindowSize" -->
      </button>
      <!-- <button
        @mousedown="isButtonPushed.close = true"
        @click="emit('close', program.id)"
      >
        <img :src="require('@/assets/icons/line/close.svg')" :alt="close">
      </button> -->
    </div>
    <!-- MENU -->
    <div
      v-if="menu"
      class="menu"
    >
      <div class="lt outline">
        <div
          v-for="item of menu"
          :key="item.id"
          class="item"
          @mouseover="hoveredMenu = item.id"
          @mouseout="hoveredMenu = ''"
          @click="clickedMenu = (clickedMenu === item.id) ? '' : item.id"
        >
          <span>{{ item.name }}</span>
          <ul
            v-if="clickedMenu === item.id"
            class="subitem outline"
            :style="`height: ${item.submenu.length * 30}px`"
          >
            <li
              v-for="subitem of item.submenu"
              :key="subitem.id"
              :class="{ focused : hoveredSubMenu === subitem.id }"
              @mouseover="hoveredSubMenu = subitem.id"
              @mouseout="hoveredSubMenu = ''"
              @click="subitem.onClick()"
            >
              <img :src="require(`@/assets/icons/line/${subitem.icon}`)" alt=""> {{ subitem.name }}
            </li>
          </ul>
        </div>
      </div>
      <div class="rt outline">
        <img
          :src="require('@/assets/icons/fill/windows.svg')"
          class="filter"
          alt=""
        />
      </div>
    </div>
    <!-- <div class="tools">
      <div
        class="outline"
        v-for="(icons, i) of folderIcons"
        :key="i"
      >
        <button v-for="icon of icons" :key="icon">
          <img :src="require(`@/assets/icons/${icon}.svg`)" alt="">
        </button>
      </div>
    </div> -->
    <div class="path" v-if="path">
      <div class="outline">Path</div>
      <input class="outline" :value="path" disabled>
    </div>
    
      <!-- <div class="tools">
        <div class="outset">
          <button>
            <FontAwesomeIcon :icon="`fa-solid fa-arrow-left`"/>
          </button>
          <button>
            <FontAwesomeIcon :icon="`fa-solid fa-arrow-right`"/>
          </button>
          <button>
            <FontAwesomeIcon :icon="`fa-solid fa-arrow-turn-up`"/>
          </button> 
        </div>
        <div class="outset"></div>
        <div class="outset"></div>
        <div class="outset"></div>
      </div> -->
   
    <div class="body">
      <component
        ref="componentRef"
        :is="toRaw(program.component)"
        :params="program.params"
      />
    </div>
    <div v-if="state" class="state">
      <div
        v-for="i of 4"
        :key="i"
        class="outline"
      >
      </div>
    </div>
    <!-- <div
        class="border-top" :style="`top: -8px; cursor: var(${cursorStyle})`"
        @mouseover="resizable.n = true"
        @mouseleave="() => {
          if (!isMouseDowned) {
            resizable.n = false
          }
        }"
      ></div>
      <div class="border-left" :style="`left: -2px`"></div>
      <div class="border-right" :style="`left: ${windowObject.width - 4}px`"></div>
      <div class="border-bottom" :style="`top: ${windowObject.height - 4}px`"></div> -->
  </div>
</template>

<style scoped>
  .border-top,
  .border-bottom {
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: red;
  }

  .border-left,
  .border-right {
    position: absolute;
    width: 4px;
    height: 100%;
    background-color: blue;
  }



.border-left {
  height: 100%;
  width: 2px;
}

.window {
  position: absolute;
  top: 0;
  background-color: black;
  box-shadow: 0px 0px 3px #494949;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  min-width: 400px;

  &.activated {
    .title {
      /* background: var(--system-dark-color); */
      color: var(--background-color);
      background: var(--main-color);
    }
  }
  
  .title {
    color: var(--main-color);
    display: grid;
    align-items: center;
    width: 100%;
    padding: 3px 6px;
    grid-template-columns: 28px 1fr 22px 22px 22px;
    border: 2px solid black;
    border-bottom: none;

    > img {
      width: 22px;
      height: 22px;
      margin: 0 2px;
      /* filter: invert(100%) sepia(0%) saturate(17%) hue-rotate(334deg) brightness(105%) contrast(105%); */
      /* filter: invert(22%) sepia(95%) saturate(2040%) hue-rotate(95deg) brightness(100%) contrast(108%); */
    }
    
    button {
      padding: 0;
      margin: 0;
      width: 22px;
      height: 22px;
      
      border: none;
      background-color: transparent;
      cursor: var(--point-cursor);
      
      img {
        /* filter: invert(100%) sepia(0%) saturate(17%) hue-rotate(334deg) brightness(105%) contrast(105%); */
        /* filter: invert(22%) sepia(95%) saturate(2040%) hue-rotate(95deg) brightness(100%) contrast(108%); */
      }
    }
  }

  .menu {
    margin: 2px;
    display: grid;
    grid-template-columns: 1fr 60px;
    gap: 2px;

    .lt {
      display: flex;
      align-items: center;

      .item {
        width: 60px;
        border: 2px solid transparent;
        margin: 2px;
        text-align: center;
        color: var(--main-color);

        .subitem {
          position: absolute;
          background-color: black;
          color: var(--main-color);
          list-style: none;
          top: 66px;
          margin: 0;
          padding: 0;
          width: 160px;
          display: flex;
          flex-direction: column;
          animation: 0.4s slide forwards;
          overflow: hidden;
          z-index: 2;

          li {
            display: flex;
            align-items: center;
            height: 30px;
            padding: 0 10px;

            img {
              height: 16px;
              margin-right: 6px;
            }

            &:hover {
              background-color: var(--system-dark-color);
              color: var(--system-light-color);

              img {
                filter: invert(100%) sepia(0%) saturate(17%) hue-rotate(334deg) brightness(105%) contrast(105%);
              }
            }
          }
        }
      }
    }

    .rt {
      /* background-color: #7e7e7e; */
      /* background: radial-gradient(circle, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 70%); */
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      height: 32px;

      img {
        width: 26px;
        /* filter: invert(100%) sepia(0%) saturate(17%) hue-rotate(334deg) brightness(105%) contrast(105%); */
        /* filter: invert(22%) sepia(95%) saturate(2040%) hue-rotate(95deg) brightness(100%) contrast(108%); */
      }
    }
  }

  .tools {
    margin: 2px;
    display: grid;
    grid-template-columns: 3fr 3fr 2fr 3fr;
    gap: 2px;

    div {
      padding: 0 9px;
      display: flex;
      justify-content: space-between;

      button {
        padding: 6px 10px 3px 10px;
        border: none;
        background-color: transparent;

        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  
  .path {
    display: grid;
    grid-template-columns: 70px 1fr;
    margin: 0 2px;
    gap: 2px;
    align-items: center;
    background-color: black;
    color: var(--main-color);
    
    div {
      padding: 4px 10px 4px 17px;
    }

    input {
      padding: 4px 10px 4px 10px;
      background-color: black;
    }
  }

  .body {
    height: 100%;
    overflow-y: hidden;
    margin: 2px;
  }

  .state {
    height: 34px;
    display: grid;
    grid-template-columns: 1fr 26px 26px 80px;
    margin: 0 2px 2px 2px;
    gap: 2px;

    div {
      background-color: black;
    }
  }
}
</style>
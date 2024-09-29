<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, ref, defineProps, defineEmits, computed, watch, toRefs, toValue, toRef, toRaw } from 'vue';
import WindowDropdown from './WindowDropdown.vue';

const props = defineProps(['program', 'activated']);
const emit = defineEmits(['close', 'minimize', 'align']);

const program = toValue(props.program)

const windowObject = ref({ x: 150, y: 50, width: 600, height: 450 });
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
    return 'ns-resize'
  else if (resizable.value.e || resizable.value.w)
    return 'ew-resize'
  else
    return 'default'
})

function getCursor(ewResizable, nsResizable) {
  if (!ewResizable && !nsResizable)
    return 'default'
  else
    return ewResizable ? 'ew-resize' : 'ns-resize'
}

watch(movable, (v) => {
  if (v)
    resizable.value = { n: false, w: false, e: false, s: false }
})

onMounted(() => {
  window.addEventListener('mousemove', (event) => {
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
      resizable.value = {
        n: Math.abs(event.y - windowObject.value.y) < 4 && !movable.value,
        s: Math.abs(event.y - (windowObject.value.y + windowObject.value.height)) < 4,
        w: Math.abs(event.x - windowObject.value.x) < 4,
        e: Math.abs(event.x - (windowObject.value.x + windowObject.value.width)) < 4,
      }
    }
  });

  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)

  // window.addEventListener('mouseup', (event) => {
  //   movable.value = false;
  //   resizable.value = { ns: false, ew: false }

  //   for (const button of ['minimize', 'maximize', 'close'])
  //     isButtonPushed.value[button] = false;

  //   windowPositionBackup.value = { ...windowObject.value }
  // });
});

// const computedGridTemplateRows = computed(() => {
//   let gridTemplateRows = ['36px']

//   if (program.items.includes('menu'))
//     gridTemplateRows.push('36px')

//   // if (program.items.includes('tools'))
//   //   gridTemplateRows.push('auto')
  
//   if (program.items.includes('address'))
//     gridTemplateRows.push('36px')

//   gridTemplateRows.push('1fr;')

//   return gridTemplateRows.join(' ')
// })


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
const path = ref()
const hoveredMenu = ref()
const clickedMenu = ref()

onMounted(() => {
  menu.value = componentRef.value.menu
})

</script>

<template>
  <div
    id="window"
    class="outset"
    :style="`
      top: ${windowObject.y}px;
      left: ${windowObject.x}px;
      width: ${windowObject.width}px;
      height: ${windowObject.height}px;
      cursor: ${cursorStyle};
    `"
  >
    <!-- TITLE -->
    <div
      class="title"
      :class="{ activated : props.activated }"
      @mousedown="movable = true;"
      @mouseup="movable = false"
    >
      <img :src="require(`@/assets/icons/${program.icon}`)" alt="" />
      <span>{{ program.name }}</span>
      <button
        @mousedown="isButtonPushed.minimize = true"
        @click="emit('minimize')"
        :class="isButtonPushed.minimize ? 'inset' : 'outset'"
      >
        <FontAwesomeIcon icon="fa-solid fa-window-minimize" />
      </button>
      <button
        @mousedown="isButtonPushed.maximize = true"
        @click="setWindowSize"
        :class="isButtonPushed.maximize ? 'inset' : 'outset'"
      >
        <FontAwesomeIcon
          :icon="isWindowMaximized ? 'fa-solid fa-minus' : 'fa-solid fa-plus'"
        />
      </button>
      <button
        @mousedown="isButtonPushed.close = true"
        @click="emit('close', program.id)"
        :class="isButtonPushed.close ? 'inset' : 'outset'"
      >
        <FontAwesomeIcon icon="fa-solid fa-xmark" />
      </button>
    </div>
    <!-- MENU -->
    <div class="menu">
      <div class="outset">
        <WindowDropdown
          v-for="item of menu"
          :key="item.id"
          :item="item"
        />
      </div>
      <!-- <div class="item outset">
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
            <li
              v-for="subitem of item.submenu"
              :key="subitem.id"
              @click="subitem.onClick"
            >
            <FontAwesomeIcon :icon="`fa-solid ${subitem.icon}`" />
              <span>{{ subitem.name }}</span>
            </li>
          </ul>
        </div>
      </div> -->
    </div>
    <!--
      <div class="tools">
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
      </div>
    -->
    <div class="body">
      <component
        ref="componentRef"
        :is="toRaw(program.component)"
      />
    </div>
  </div>
</template>

<style scoped>
#window {
  position: absolute;
  top: 0;
  font-family: 'Noto Sans KR';
  font-size: 14px;
  font-weight: bold;
  background-color: var(--system-color);
  box-shadow: 0px 0px 3px #494949;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  min-width: 400px;
}

#window > .title {
  background: grey;
  background: linear-gradient(90deg, grey 0%, lightgrey 100%);
  color: white;
  display: grid;
  align-items: center;
  width: 100%;
  padding: 6px 1px 6px 5px;
  grid-template-columns: 28px 1fr 28px 28px 28px;

  &.activated {
    background: navy;
    background: linear-gradient(90deg, navy 0%, navy 100%);
  }
}

#window > .title img {
  width: 22px;
  height: 22px;
  margin: 0 2px;
}

#window > .title button {
  padding: 0;
  line-height: 0;
  margin: 0 2px;
  background-color: var(--system-color);
  width: 22px;
  height: 22px;
  font-weight: bold;

  &.pushed {
    border: 2px inset white;
  }
}

.wrapper {
  height: 100%;
  background-color: var(--system-color);
  padding: 3px;
  display: grid;
  grid-template-rows: 50px 50px 1fr;
}

.tools {
  padding: 2px;
  display: grid;
  height: 100%;
  grid-template-columns: 3fr 1fr 4fr 1fr;
  align-items: center;
  button {
    background-color: var(--system-color);
    width: 60px;
    font-size: 30px;
    color: #494949;
    border: none;
  }
}

.body {
  height: 100%;
  overflow-y: hidden;
  margin: 2px;
}

.menu {
  padding: 2px;
}

.menu > div {
  display: flex;
}

/* .body {
  border: 2px solid var(--system-color);
  background-color: white;
  overflow: hidden; */
  /* border-top: none; */
  /* overflow-y: auto; */
/* } */

/*
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
  */

.controller {
  position: absolute;
  background-color: black;
}
</style>
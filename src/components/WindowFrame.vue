<script setup>
import { onMounted, ref, defineProps, defineEmits, computed, watch, toRefs, toValue, toRef, toRaw } from 'vue';

const props = defineProps(['program', 'activated']);
const emits = defineEmits(['ctrl', 'move', 'close']);

const featureBackup = ref({ ...props.program.feature })
const initMousePosition = ref({ x: 0, y: 0 })

const movable = ref(false);
const resizable = ref({ n: false, s: false, e: false, w: false })

const hoveredMenu = ref()
const clickedMenu = ref()
const hoveredSubMenu = ref()

const options = ref({})

const component = ref({})

const componentRef = ref()

const progress = ref(0)

let interval = null

function onProgress() {
  progress.value = (progress.value < 100) ? progress.value + 1 : 100
}

watch(props.program, (v) => {
  progress.value = 0
  if (v.ready) {
    clearInterval(interval)
    interval = null
  } else {
    interval = setInterval(onProgress, 100)
  }
}, {
  deep: true
})

onMounted(() => {
  options.value = componentRef.value.options

  // if (!props.program?.params?.ready) {
  //   interval = setInterval(onProgress, 200)
  // }
});

function onDragStart(event) {
  initMousePosition.value = {
    x: event.x,
    y: event.y
  }
}

function onDragOver(event) {
  const movedX = event.x - initMousePosition.value.x
  const movedY = event.y - initMousePosition.value.y

  featureBackup.value.x = props.program.feature.x + movedX
  featureBackup.value.y = props.program.feature.y + movedY
}

function onDragEnd() {
  emits('move', props.program.id, featureBackup.value.x, featureBackup.value.y)
}
</script>

<template>
  <div
    class="window outline"
    :class="props.activated ? 'activated' : 'inactivated'"
    @mouseenter="emits('ctrl', true)"
    @mouseleave="emits('ctrl', false)"
  >
  <!--
      :style="`
      top: ${props.program.feature.y}px;
      left: ${props.program.feature.x}px;
      width: ${props.program.feature.width}px;
      height: ${props.program.feature.height}px;
    `"
  -->
    <!-- TITLE -->
    <div class="title outline">
      <img
        :src="require(`@/assets/icons/fill/${program.icon}`)"
        :class="{ filter: !props.activated }"
        alt=""
      />
      <span
        @mouseenter="emits('move', true)"
        @mouseleave="emits('move', false)"
      >{{ program.name }}</span>
      <button
        @click="emits('close', program.id)"
        @mouseenter.stop
        @mouseleave.stop
      >
        <!-- <img :src="require('@/assets/icons/line/close.svg')" alt="close"> -->
      </button>
    </div>
    <!-- MENU -->
    <div v-if="options.menu" class="menu">
      <div class="lt outline">
        <div
          v-for="item of options.menu"
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
              {{ subitem.name }}
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
    <!-- PATH -->
    <div v-if="options.path" class="path">
      <div class="outline">Path</div>
      <button
        @click="componentRef.goRoot()"
      class="outline">
        <img :src="require('@/assets/icons/home-line.svg')" alt="" />
      </button>
      <button @click="componentRef.goBack()" class="outline">
        <img :src="require('@/assets/icons/corner-right-up-line.svg')" alt="" />
      </button>
      <input class="outline" :value="
        options.path.length > 0 ? '/' + options.path.join('/') : '/'
      " disabled>
    </div>
    <!-- BODY -->
    <div class="body">
      <component
        ref="componentRef"
        :is="toRaw(program.component)"
      />
    </div>
    <!-- STATE/FOOTER -->
    <div v-if="options.state" class="state">
      <div
        v-for="i of 4"
        :key="i"
        class="outline"
      >
      </div>
    </div>
    <!-- LOADING -->
    <section
      v-if="!(program?.options?.ready)"
      class="loading"
    >
      <h3 v-html="program?.options?.message" />
      <div>
        <div :style="`width: ${progress}%;`"></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  min-height: 240px;
  min-width: 400px;
  color: var(--text-color);
  background-image: url('@/assets/wallpaper.jpg');
  background-position: center;
  background-size: cover;
  gap: 2px;

  &.activated {
    opacity: 1;
    border-color: var(--shadow-color);

    .title {
      color: var(--base-color);
      background-color: var(--shadow-color);

      img {
        filter:
          invert(100%) 
          sepia(0%) 
          saturate(7500%) 
          hue-rotate(170deg) 
          brightness(102%) 
          contrast(102%);
      }
    }
  }
  
  .title {
    color: var(--text-color);
    display: grid;
    align-items: center;
    width: calc(100% - 4px);
    padding: 3px 6px;
    grid-template-columns: 26px 1fr 20px;
    margin: 2px 2px 0 2px;

    > img {
      width: 18px;
      height: 18px;
      margin: 0 2px;
    }
    
    button {
      padding: 0;
      margin: 0;
      width: 22px;
      height: 22px;
      border: none;
      background-color: transparent;
      cursor: var(--pointer-cursor);
    }
  }

  .menu {
    margin: 0 2px;
    display: grid;
    grid-template-columns: 1fr 60px;
    gap: 2px;

    .lt {
      display: flex;
      align-items: center;
      background-color: var(--shadow-color);

      .item {
        width: 60px;
        border: 2px solid transparent;
        margin: 2px;
        text-align: center;
        color: var(--line-color);

        .subitem {
          position: absolute;
          background-color: var(--base-color);
          color: var(--line-color);
          list-style: none;
          top: 60px;
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
            background-color: var(--shadow-color);

            img {
              height: 16px;
              margin-right: 6px;
            }

            &:hover {
              background-color: var(--text-color);
              color: var(--base-color);
              border: 2px solid var(--base-color);

              img {
                filter:
                  invert(100%) 
                  sepia(0%) 
                  saturate(17%) 
                  hue-rotate(334deg) 
                  brightness(105%) 
                  contrast(105%);
              }
            }
          }
        }
      }
    }

    .rt {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      height: 32px;
      background-color: var(--shadow-color);

      img {
        width: 26px;
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
    grid-template-columns: 70px 30px 30px 1fr;
    margin: 0 2px;
    gap: 2px;
    align-items: center;
    color: var(--major-color);

    button {
      padding: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--shadow-color);

      img {
        width: 18px;
      }
    }
    
    div {
      padding: 4px 10px 4px 17px;
      background-color: var(--shadow-color);
    }

    input {
      padding: 4px 10px 4px 10px;
      background-color: var(--shadow-color);
    }

  }

  .body {
    height: 100%;
    overflow-y: hidden;
    margin: 0 2px;
  }

  .state {
    height: 34px;
    display: grid;
    grid-template-columns: 1fr 26px 26px 80px;
    margin: 0 2px 2px 2px;
    gap: 2px;

    div {
      background-color: var(--shadow-color);
    }
  }

  section.loading {
    width: calc(100% - 8px);
    height: calc(100% - 129px);
    position: absolute;
    top: 98px;
    left: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--shadow-color);
    gap: 20px;

    h3 {
      color: var(--text-color);
      font-size: 24px;
      font-weight: bold;
      margin: 0;
      text-align: center;
    }

    > div {
      border: 3px solid var(--text-color);
      height: 30px;
      width: 156px;
      display: flex;
      padding: 3px;
      /* gap: 2px; */

      div {
        width: 3px;
        height: 18px;
        background-color: var(--text-color);
      }
    }
  }
}
</style>
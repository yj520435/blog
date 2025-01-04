<script setup>
import { loadDir, loadFile } from '@/utils';
import { Converter } from 'showdown';
import { computed, onMounted, ref, defineEmits } from 'vue';

const emits = defineEmits(['load'])
const path = ref('HOME')
const items = ref()

async function open(item) {
  if (item.type === 'dir') {
    items.value = []
    items.value = item.items;
  }
  else {
    emits('load', item)    
    // const file = await loadFile(item)
    // const converter = new Converter()
    // article.value = converter.makeHtml(file)
  }
}

const footprints = ref([])

onMounted(async () => {
  // items.value = await loadDir()
  // footprints.value.push(items.value)
  // console.log(items.value)
})

const mainRef = ref()

const writing = ref(false)

function onWrite() {
  mainRef.value.scrollTo({
    left: 460,
    behavior: 'smooth'
  })
}

function goListPage() {
  mainRef.value.scrollTo({
    left: 0,
    behavior: 'smooth',
  })
}

function openFootprint(f) {
  items.value = f
}

// const fullPath = computed(() => {
//   let fullPath = ''
//   for (const f of footprints.value) {
//     fullPath += f.name
//   }
//   return fullPath
// })

const article = ref('')

const paths = ref(['Root'])
</script>
<template>
  <main class="board" ref="mainRef">
    <!-- <section class="list"> -->
      <!-- <div>
        경로:
        <span v-for="f of footprints" :key="f.id" @click="openFootprint(f)">
          {{ '/' + (f.name ?? 'Root') }}</span>
      </div> -->
      <!-- <ul>
        <li
          v-for="item of items"
          :key="item.id"
          @click="open(item)"
        >
          <img :src="require(`@/assets/icons/line/${ item.type === 'dir' ? 'folder.svg' : 'file.svg' }`)" alt="">{{ item.name }}
        </li>
      </ul>
      <article v-html="article"></article>
      <button @click="onWrite">글쓰기</button>
    </section>
    <section class="editor" :class="{ 'slide-up': writing }">
      <textarea>
        ㅎㅎㅎㅎ
      </textarea>
    </section> -->
  </main>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 500px;
  height: 100%;
  overflow-x: scroll;
  background-color: black;

  &::-webkit-scrollbar {
    display: none;
  }

  section {
    width: 500px;
    /* background-color: #ffffff; */
    /* border-radius: 6px; */
    padding: 10px 0;
    

    &.list {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;

      div {
        padding: 10px;
        background-color: #ffffff;
        /* border-radius: 9px; */
        /* box-shadow: 0 0 6px #dddddd; */
      }

      ul {
        list-style: none;
        /* padding: 0; */
        margin: 0;
        background-color: #ffffff;
        /* box-shadow: 0 0 6px #dddddd; */
        padding: 0 10px;
        /* border-radius: 16px; */

        li {
          display: grid;
          grid-template-columns: 20px 1fr;
          align-items: center;
          margin: 10px 0;

          img {
            width: 16px;
          }
        }
      }

      article {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        padding: 10px;
      }
    }

    button {
      width: 90px;
      border: none;
      background-color: #00000010;
      box-shadow: 4px 4px 0 #00000030;
      font-family: inherit;
      padding: 6px 0;
      /* border-radius: 9px; */
      font-size: 16px;
    }
  }
}

@keyframes slide-up {
  0% {
    top: 500px;
  }

  100% {
    top: 100px;
  }
}

</style>
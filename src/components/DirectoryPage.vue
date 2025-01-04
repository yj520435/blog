<script setup>
import { loadDir } from '@/utils';
import { onMounted, ref } from 'vue';

const items = ref([])

function createHierarchy(target, tab) {
  const dirItems = target.filter((v) => v.type === 'dir')

  for (const item of dirItems) {
    items.value.push({
      ...item,
      tab
    })
    if (Object.keys(item).includes('items'))
      createHierarchy(item.items, tab + 1)
  }
}

// onMounted(async () => {
//   const storedItems = await loadDir()

//   items.value.push({
//     id: 'ROOT',
//     name: '(Root)',
//     type: 'dir',
//     tab: 0
//   })

//   createHierarchy(storedItems, 1)
//})
</script>

<template>
  <div>
    <ul>
      <li
        v-for="item of items"
        :key="item.id"
        :style="`padding-left: ${8 + 10 * item.tab}px`"
        @click="targetDir = { id: item.id, name: item.name }"
      >
        <img :src="require('@/assets/icons/fill/folder.svg')" alt="">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: grid;
    grid-template-columns: 24px 1fr;
    margin: 6px 0;

    img {
      width: 16px;
    }
  }
}
</style>
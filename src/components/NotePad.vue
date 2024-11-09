<script setup>
import { usePopup } from '@/store';
import axios from 'axios';
import { encode } from 'js-base64';
import { Octokit } from 'octokit';
import { Converter } from 'showdown';
import { ref, defineExpose, watch, onMounted } from 'vue';

const viewMode = ref('markdown')

const markdown = ref('')
const html = ref('')

const popup = usePopup()

async function save() {
  popup.on({
    type: 'prompt',
    icon: 'key.svg',
    message: 'API Key',
  })
  // console.log(text)
  // const octokit = new Octokit({
  //   auth: ''
  // })

  // await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
  //   owner: 'yj520435',
  //   repo: 'yj520435.github.io',
  //   path: 'archive/test.md',
  //   message: 'Create new file',
  //   committer: {
  //     name: 'yj520435',
  //     email: 'yj520435@gmail.com'
  //   },
  //   content: encode('테스트'),
  //   headers: {
  //     'X-GitHub-Api-Version': '2022-11-28'
  //   }
  // })
}

function viewHTML() {
  const converter = new Converter()
  html.value = converter.makeHtml(markdown.value)
  viewMode.value = 'html'
  console.log(html.value)
}

const menu = ref([
  {
    id: 'file',
    name: 'File',
    submenu: [
      {
        id: 'save',
        name: 'Save',
        onClick: save
      },
    ]
  },
  {
    id: 'view',
    name: 'View',
    submenu: [
      {
        id: 'markdown',
        name: 'Markdown',
      },
      {
        id: 'html',
        name: 'HTML',
        onClick: viewHTML
      }
    ]
  }
])

defineExpose({
  menu,
})

watch(markdown, (v) => {
  const converter = new Converter()
  html.value = converter.makeHtml(markdown.value)
})

// const divRef = ref()

onMounted(() => {
  // console.log(divRef.value.scrollHeight, divRef.value)
})
</script>

<template>
  <main
    class="outline scroll"
  >
    <div
      v-if="viewMode === 'markdown'"
    >
      <textarea
      autofocus
      class="scroll"
      v-model="markdown"
    />
    </div>
    <div v-else>
      <article
        v-html="html"
        >
      </article>
    </div>
    <button
      :style="`right: ${30}px;`"
    >PREVIEW</button>
  </main>
</template>
<style scoped>

main {
  width: 100%;
  height: calc(100% - 2px);
}

div {
  width: 100%;
  height: 100%;
  background-color: white;
}

textarea {
  width: 100%;
  height: 100%;
  resize: unset;
  border: none;
  padding: 10px;
  overflow-y: auto;
  outline: none;
  font-size: 16px;
  font-family: 'DungGeunMo';
  line-height: 20px;
  cursor: var(--insert-cursor);
}

div.label {
  position: absolute;
  width: fit-content;
  height: fit-content;
  padding: 2px 6px;
  border-top-left-radius: 11px;
  border-bottom-left-radius: 11px;
  top: 80px;
  right: 4px;
  background-color: var(--text-color);
  color: var(--base-color);
  font-size: 36px;
}

button {
  position: absolute;
  padding: 3px 8px;
  bottom: 20px;
  color: #666666;
  background-color: #dddddd;
  box-shadow: 6px 6px 0 var(--text-color);
  border: 2px solid var(--text-color);
  cursor: var(--pointer-cursor) !important;
  
  &:hover {
    color: var(--text-color);
    background-color: var(--base-color);
  }
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
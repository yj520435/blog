<script setup lang="ts">
import { ref, Ref, computed, defineEmits, onMounted, watch } from 'vue';
import { useStore } from '@/store';
import { Category, Company, File } from '@/types';
import { getIcon, loadFile, loadFolder, sortAlphabetically } from '@/utils';
import { ARCHIVE_ROOT, CAREER_ROOT, FOLDER_MIME_TYPE } from '@/constants';

const emits = defineEmits(['load'])

const store = useStore()

// Scrolling
const bodyRef = ref()
function move(category: Category, index: number) {
  selectedCategory.value = category

  const height = bodyRef.value.offsetHeight;
  bodyRef.value.scrollTo(0, height * index)
}

// Categories
const categories: Category[] = [
  { id: 'user', name: '프로필' },
  { id: 'skills', name: '기술스택' },
  { id: 'career', name: '경력사항'},
  { id: 'archive', name: '아카이브' },
  { id: 'gitflow', name: '기타 개발 이력' },
  // { id: 'admin', name: '관리자 모드' }
]
const selectedCategory: Ref<Category> = ref(categories[0])
const isArchiveSelected = computed(() => selectedCategory.value.id === 'archive')

// Profile
const infos: Category[] = [
  { id: 'tag', name: '김유진 (1994. 05)' },
  { id: 'phone', name: '010-8695-4830' },
  { id: 'mail', name: 'yj520435@gmail.com' }
]

// Skills
const skills: Category[] = [
  {
    id: 'FrontEnd',
    name: '프론트엔드',
    items: ['Vue', 'Nuxt', 'JavaScript', 'TypeScript', 'Quasar', 'Vuetify']
  },
  {
    id: 'BackEnd',
    name: '백엔드',
    items: ['Java', 'Spring', 'JPA', 'MyBatis', 'PostgreSQL', 'Gradle', 'Linux']
  },
  {
    id: 'Version',
    name: '버전관리',
    items: ['Git', 'GitHub', 'GitLab']
  },
  {
    id: 'CoworkTool',
    name: '협업도구',
    items: ['Jira', 'Slack', 'Notion']
  }
]

// Careers
const companies: Ref<Company[]> = ref([])
const reading: Ref<boolean> = ref(true)

async function read(id: string) {
  reading.value = true
  companies.value = await loadFile(id, 'json')
  reading.value = false
}

// Archives
const archiveRef = ref()
const computedGap = ref(0)
const listView = ref(true)

const buttons = ref([
  {
    id: 'up',
    icon: 'arrow-up.svg',
    action: () => paths.value.pop()
  },
  {
    id: 'reload',
    icon: 'refresh.svg',
    action: () => reload()
  },
  {
    id: 'home',
    icon: 'home.svg',
    action: () => paths.value = []
  },
  {
    id: 'view',
    icon: 'list.svg',
    action: () => listView.value = !listView.value
  },
])

function computeGap() {
  if (!archiveRef.value || !archiveRef.value.width || listView.value)
    return

  const width = archiveRef.value.offsetWidth
  const itemCnt = Math.trunc(width / 110)
  computedGap.value = (width % 110) / (itemCnt - 1)
}

function computeIcon() {
  return listView.value ? 'list.svg' : 'grid.svg'
}

watch(listView, (v) => {
  const target = buttons.value.find((v) => v.id === 'view')
  if (target) {
    target.icon = v ? 'grid.svg' : 'list.svg'
  }
})

// Path
const paths: Ref<File[]> = ref([])
const computedPaths = computed(() => paths.value.length)

watch(computedPaths, async () => {
  await reload()
})

// Folder & File Loading
const files: Ref<File[]> = ref([])
const loading: Ref<boolean> = ref(true)

async function load(id: string) {
  files.value = []
  loading.value = true

  const storedFiles = store.getFolder(id)
  
  if (storedFiles) {
    files.value = storedFiles.items
  } else {
    const result = await loadFolder(id)
    console.log('>> result', result)
    if (result.length > 0)
      files.value = filterAndSort(result)
    store.setFolder(id, files.value)
  }

  loading.value = false
  computeGap()
}

function filterAndSort(data: File[]) {
  // Filter
  const filteredDirectories = data.filter(
    (v: File) => v.mimeType === FOLDER_MIME_TYPE
  )
  const filteredFiles = data.filter(
    (v: File) => v.mimeType !== FOLDER_MIME_TYPE
  )

  // Sort
  const sortedDirectories = filteredDirectories.sort(
    (a: File, b: File) => sortAlphabetically(a.name, b.name)
  )
  files.value = sortedDirectories
  const sortedFiles = filteredFiles.sort(
    (a: File, b: File) => sortAlphabetically(a.name, b.name)
  )

  return sortedDirectories.concat(sortedFiles)
}

async function reload() {
  const id = paths.value.length > 0
    ? paths.value[paths.value.length - 1].id
    : ARCHIVE_ROOT
  await load(id)
}

async function open(file: File) {
  if (file.mimeType === FOLDER_MIME_TYPE) {
    paths.value.push(file)
    await load(file.id)
  } else {
    emits('load', file)
  }
}

// ETC Dev Experience
const projects = [
  // { id: '10nvMm_VzaMxF21htCetwhdso3mOSYWFP', name: 'Vue3 개인 포트폴리오 구현' },
  { id: '-RealTimeDataStreamDemo', name: '플링크, 카프카를 이용한 실시간 데이터 스트림 처리 (데모)' },
  { id: '-MicroBlog', name: 'AWS EC2 인스턴스 기반 스프링 부트 프로젝트 배포 및 구동' },
  { id: '-Qloud', name: 'Unity 2D 게임 제작 및 플레이스토어 배포' },
]

onMounted(async () => {
  await read(CAREER_ROOT)
  await load(ARCHIVE_ROOT)
})
</script>

<template>
  <main id="index" class="component">
    <!-- Header -->
    <nav>
      <div class="lt">
        <button
          v-for="button of buttons"
          :key="button.id"
          :disabled="!isArchiveSelected"
          @click="button.action"
        >
          <img :src="require(`@/assets/icons/${button.icon}`)" :alt="button.icon" />
        </button>
      </div>
      <div class="rt">
        <img :src="require(`@/assets/icons/${selectedCategory.id}.svg`)" alt="icon" />
        <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        <div v-if="isArchiveSelected">
          <span v-for="path of paths" :key="path.id">
            <span>{{ path.name }}</span>
            <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt="arrow" />
          </span>
        </div>
      </div>
    </nav>
    <!-- Body -->
    <section>
      <aside>
        <ul>
          <li
            v-for="(category, index) of categories"
            :key="category.id"
            :class="{ selected : selectedCategory.id === category.id }"
            @click="move(category, index)"
          >
            {{ category.name }}
          </li>
        </ul>
      </aside>
      <div ref="bodyRef">
        <!-- Info -->
        <section class="info">
          <span v-for="info of infos" :key="info.id">
            <img :src="require(`@/assets/icons/${info.id}.svg`)" alt="">
            {{ info.name }}
          </span>
        </section>
        <!-- Skills -->
        <section class="skills">
          <div>
            <div v-for="skill of skills" :key="skill.id" class="box">
              <span>{{ skill.name }}</span>
              <div>
                <span v-for="item of skill.items" :key="item" class="keyword">
                  {{ item }}
                </span>
              </div>
            </div>
          </div>
        </section>
        <!-- Career -->
        <section class="career">
          <div v-if="reading" class="loading">
            <img :src="require('@/assets/icons/search.svg')" alt="search" />
          </div>
          <div v-else>
            <ul v-for="company of companies" :key="company.id">
              <li class="parent">
                <div>
                  <span class="name">
                    <img :src="require('@/assets/icons/pin.svg')" alt="">
                    {{ company.name }}
                  </span>
                  <span class="days">{{ company.from }} ~ {{ company.to }}</span>
                </div>
              </li>
              <li
                v-for="project of company.projects"
                :key="project.id"
                @click="emits('load', project)"
                class="child"
              >
                <div :class="{ 'no-item': project.id.startsWith('-') }">
                  {{ project.name }}
                </div>
              </li>
            </ul>
          </div>
        </section>
        <!-- Archive -->
        <section class="archive" ref="archiveRef">
          <div v-if="loading" class="loading">
            <img :src="require('@/assets/icons/search.svg')" alt="search" />
          </div>
          <div
            v-else
            :class="!listView ? 'grid' : 'list'"
            :style="`column-gap: ${computedGap}px`"
          >
            <div
              class="icon"
              v-for="file of files"
              :key="file.id"
              @click="open(file)"
            >
              <img :src="require(`@/assets/icons/${getIcon(file.mimeType)}.svg`)" alt="icon"/>
              <span>{{ file.name }}</span>
            </div>
            <div
              v-if="files.length === 0"
              class="empty"
            >
              이 폴더는 비어있습니다.
            </div>
          </div>
        </section>
        <!-- ETC -->
        <section class="etc">
          <ul>
            <li
              v-for="project of projects"
              :key="project.id"
              @click="emits('load', {
                id: project.id,
                name: project.id,
                kind: 'drive#file',
                mimeType: 'text/x-markdown'
              } as File)"
              :class="{ 'no-item': project.id.startsWith('-') }"
            >
              {{ project.name }}
            </li>
          </ul>
        </section>
      </div>
    </section>
  </main>
</template>
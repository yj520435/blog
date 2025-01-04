<script setup>
import { useHistoryStore } from '@/store';
import { computed, ref, defineEmits } from 'vue';

const emits = defineEmits(['load'])

const store = useHistoryStore()

const showKeyword = ref(true)
const showPeriod = ref(false)

const history = ref([
  {
    from: '2022. 01',
    to: '2024. 10',
    company: '카피앤패이스트',
    id: 'copynpaste',
    projects: [
      {
        id: '1opRHy-xVR1tciWP9VmEtPZJTUQNkKnj5',
        name: 'AI 스마트시티 2.0 구축형',
        from: '2024. 01',
        to: '2024. 08',
        tasks: 'UI',
        keywords: ['Vue3', 'Nuxt']
      },
      {
        id: '13jvm96A6Ne1cAP1LLlehqVyW_QWCfBGe',
        name: '동대구역사실증사업',
        from: '2023. 01',
        to: '2023. 05',
        tasks: 'UI/SERVICE',
        keywords: ['Vue3', 'Quasar', 'Java', 'JPA']
      },
      {
        id: '',
        name: '무인공간관제서비스',
        from: '2022. 08',
        to: '2022. 12',
        tasks: 'UI',
        keywords: ['Vue2', 'Vuetify']
      },
      {
        id: '',
        name: '광주첨단산단 통합관제',
        from: '2022. 03',
        to: '2022. 07',
        tasks: 'UI/SERVICE',
        keywords: ['Vue2', 'Java', 'MyBatis']
      }
    ]
  },
  {
    from: '2019. 07',
    to: '2021. 05',
    company: '스위스로그헬스케어코리아',
    id: 'swissloghealthcarekorea',
    projects: [],
  },
  {
    id: 'urpsystem',
    from: '2018. 06',
    to: '2018. 12',
    company: '유알피시스템',
    projects: [
      {
        id: '',
        name: '행정포털시스템 기능개선사업',
        from: '2018. 08',
        to: '2018. 12',
        tasks: 'UI/SERVICE',
        keywords: ['JSP', 'Java']
      },
      {
        id: '',
        name: '온나라문서시스템 유지보수',
        from: '2018. 06',
        to: '2018. 07',
        tasks: 'MANAGEMENT',
        keywords: []
      }
    ]
  }
]);

const clicked = ref()
const selected = computed(() => store.get())
const paths = computed(() => selected.value.company)
</script>

<template>
  <main id="history">
    <section class="header">
      <div class="lt">
        <div class="checkbox">
          <input type="checkbox" v-model="showKeyword"> 키워드
        </div>
        <div class="checkbox">
          <input type="checkbox" v-model="showPeriod"> 수행기간
        </div>
        <!-- <button @click="store.pop()" :disabled="selected">
          <img :src="require('@/assets/icons/arrow-left.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/arrow-right.svg')" alt="">
        </button>
        <button disabled>
          <img :src="require('@/assets/icons/reset.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/home.svg')" alt="">
        </button> -->
      </div>
      <div class="ct">
        <img :src="require('@/assets/icons/monitor.svg')" alt=""/>
        <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        <span v-if="paths">
          {{ paths }}
          <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        </span>
      </div>
      <div class="rt">
        <img :src="require('@/assets/icons/search.svg')" alt=""/>
        <input type="text">
      </div>
    </section>
    <section class="body">
      <div class="wrapper scroll">
        <table v-for="item of history" :key="item">
          <thead>
            <th :class="{ disabled : item.projects.length === 0 }">
              <div>
                <span>
                  <img :src="require('@/assets/icons/folder.svg')" alt="">
                  {{ item.company }}
                </span>
              </div>
            </th>
            <th></th>
            <th>{{ item.from }} - {{ item.to }}</th>
          </thead>
          <tbody>
            <tr
              v-for="project of item.projects"
              :key="project"
              @click="emits('load', project)"
            >
              <td>
                <span>
                  <img :src="require('@/assets/icons/file.svg')" alt="">
                  {{ project.name }}
                </span>
              </td>
              <td>
                <span v-if="showKeyword" class="keywords">
                  <span
                    v-for="keyword of project.keywords"
                    :key="keyword"
                    class="keyword"
                    :class="keyword.toLowerCase()"
                  >
                    {{ keyword }}
                  </span>
                </span>
              </td>
              <td>
                <span v-if="showPeriod" class="period">
                  {{ project.from }} - {{ project.to }}
                </span>
              </td>
              <!-- <td>
                {{ project.tasks }}
              </td>
              <td>
                <div class="keywords">
                  <span v-for="keyword of project.keywords" :key="keyword">
                    {{ keyword }}
                  </span>
                </div>
              </td> -->
            </tr>
          </tbody>
        </table>
        <!-- <table
          v-if="!Object.keys(selected).length"
          class="company"
        >
          <tbody>
            <tr
              v-for="item of history"
              :key="item"
              :class="{
                selected : clicked?.id === item.id, 
                disabled : item.projects.length === 0
              }"
              @click="store.set(item)"
            >
              <td>
                <span>
                  <img :src="require('@/assets/icons/folder.svg')" alt="">
                  {{ item.company }}
                </span>
              </td>
              <td>{{ item.from }} - {{ item.to }}</td>
              <td>{{ item.projects.length }}</td>
            </tr>
          </tbody>
        </table>
        <table v-else class="project">
          <thead>
            <th>프로젝트명</th>
            <th>담당업무</th>
            <th>키워드</th>
          </thead>
          <tbody>
            <tr
            v-for="item of selected.projects"
            :key="item"
            @click="emits('load', item)"
            :class="{ selected : clicked?.id === item.id }"
            >
              <td>
                <span>
                  <img :src="require('@/assets/icons/file.svg')" alt="">
                  {{ item.name }}
                </span>
              </td>
              <td>{{ item.tasks }}</td>
              <td>
                <span>
                  <span
                    v-for="keyword of item.keywords"
                    :key="keyword"
                    class="keyword"
                    :class="`${keyword.toLowerCase()}`"
                  >
                    {{ keyword }}
                  </span>
                </span>
              </td>
            </tr>
          </tbody>
        </table> -->
      </div>
    </section>
  </main>
</template>
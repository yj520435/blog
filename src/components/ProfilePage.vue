<script setup lang="ts">
import { Converter } from 'showdown';
import { ref, Ref } from 'vue';

interface Category {
  id: string;
  name: string;
  items?: string[]
}

const categories: Category[] = [
  { id: 'info', name: '기본 정보' },
  { id: 'skills', name: '보유 기술' },
  { id: 'experience', name: '기타 개발 경험' },
  // { id: 'admin', name: '관리자 모드' }
]
const selectedCategory: Ref<Category> = ref(categories[0])

const divRef = ref()
function onMove(category: Category, index: number) {
  selectedCategory.value = category

  const height = divRef.value.offsetHeight;
  divRef.value.scrollTo(0, height * index)
}


const skills: Category[][] = [[
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
  ], [
    {
      id: 'Version',
      name: '버전관리',
      items: ['Git', 'GitHub', 'GitLab']
    },
    {
      id: 'CoWorkTool',
      name: '협업도구',
      items: ['Jira', 'Slack', 'Notion']
    }
  ]
]
</script>

<template>
  <main id="profile" class="component">
    <header>
      <div class="ct">
        <img :src="require('@/assets/icons/user.svg')" alt=""/>
        <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
      </div>
    </header>
    <section>
      <div class="lt">
        <ul>
          <li
            v-for="(category, index) of categories"
            :key="category.id"
            :class="{ selected : selectedCategory.id === category.id }"
            @click="onMove(category, index)"
          >
            {{ category.name }}
          </li>
        </ul>
      </div>
      <div class="rt" ref="divRef">
        <article class="info">
          <span>
            <img :src="require('@/assets/icons/tag.svg')" alt="tag">
            김유진 (1994. 05)
          </span>
          <span>
            <img :src="require('@/assets/icons/mail.svg')" alt="tag">
            yj520435@gmail.com
          </span>
        </article>
        <article class="skill">
          <table>
            <thead></thead>
            <tbody>
              <tr v-for="(item, i) of skills" :key="i">
                <td v-for="skill of item" :key="skill.id">
                  <div class="wrapper">
                    <span>{{ skill.name }}</span>
                    <div>
                      <span
                        v-for="item of skill.items"
                        :key="item"
                        class="keyword"
                        :class="item.toLowerCase()"
                      >
                        {{ item }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
        <article class="etc">
          <ul>
            <li>플링크, 카프카를 이용한 실시간 데이터 스트림 처리 (데모)</li>
            <li>AWS EC2 인스턴스 기반 스프링 부트 프로젝트 배포 및 구동</li>
            <li>Unity 2D 게임 제작 및 플레이스토어 배포</li>
          </ul>
        </article>
      </div>
    </section>
  </main>
</template>
<script setup>
import { ref } from 'vue';
import { GoogleLogin } from 'vue3-google-login';

const categories = ref([
  { id: 'info', name: '기본 정보' },
  { id: 'skills', name: '보유 기술' },
  { id: 'devExp', name: '기타 개발 경험' },
  { id: 'admin', name: '관리자 모드' },
])

const selected = ref('info')


const infos = ref([
  {
    icon: 'tag',
    text: '김유진 (1994. 05)'
  },
  {
    icon: 'mail',
    text: 'yj520435@gmail.com'
  }
])

const skills = ref([
  [  {
    id: '프론트엔드',
    items: ['Vue', 'JavaScript', 'TypeScript', 'CSS']
  },
  {
    id: '백엔드',
    items: ['Java', 'Spring Boot', 'JPA', 'MyBatis', 'PostgreSQL', 'Gradle']
  }],
  [
  {
    id: '버전관리',
    items: ['Git']
  },
  {
    id: '협업도구',
    items: ['Jira', 'Slack']
  },
  ]
])


function login(response) {
  console.log(response)
}

function load(item, index) {
  selected.value = item.id

  const height = divRef.value.offsetHeight;
  divRef.value.scrollTo(0, height * index)
}

const divRef = ref()
</script>

<template>
  <main id="profile">
    <section class="header">
      <!-- <div class="lt">
        <button>
          <img :src="require('@/assets/icons/arrow-left.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/arrow-right.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/reset.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/home.svg')" alt="">
        </button>
      </div>
      <div class="rt">
        <img :src="require('@/assets/icons/monitor.svg')" alt=""/>
        <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/> -->
        <!-- <span v-for="path of paths" :key="path">
          {{ path.name }}
          <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        </span> -->
      <!-- </div> -->
    </section>
    <section class="body">
      <div class="lt">
        <ul>
          <li
            v-for="(category, index) of categories"
            :key="category.id"
            :class="{ selected : selected === category.id}"
            @click="load(category, index)"
          >
            {{ category.name }}
          </li>
        </ul>
      </div>
      <div ref="divRef" class="rt">
        <article class="info">
          <span v-for="info of infos" :key="info">
            <img :src="require(`@/assets/icons/${info.icon}.svg`)" alt="">
            {{ info.text }}
          </span>
        </article>
        <article class="skill">
          <table>
            <thead></thead>
            <tbody>
              <tr v-for="(item, i) of skills" :key="i">
                <td v-for="skill of item" :key="skill">
                  <div class="wrapper">
                    <span>{{ skill.id }}</span>
                    <div>
                      <span v-for="item of skill.items" :key="item">
                        {{ item }}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- <table>
            <thead></thead>
            <tbody>
              <tr v-for="skill of skills" :key="skill.id">
                <td>{{ skill.id }}</td>
                <td>
                  <div>
                    <span v-for="item of skill.items" :key="item">
                      {{ item }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table> -->
          <!-- <div class="wrapper">
            <h3>{{ skill.id }}</h3>
            <div>
              <span v-for="item of skill.items" :key="item">
                {{ item }}
              </span>
            </div>
          </div> -->
        </article>
        <article class="etc">
          <ul>
            <li>Flink Kafka</li>
            <li>AWS ec2</li>
            <li>Unity 2D 게임 제작 및 플레이스토어 배포</li>
          </ul>
        </article>
      </div>
      <!-- <div>
        <h1>기본 정보</h1>
        <article class="info">
          <span v-for="info of infos" :key="info">
            <img :src="require(`@/assets/icons/${info.icon}.svg`)" alt="">
            {{ info.text }}
          </span>
        </article>
      </div>
      <div>
        <h1>보유 기술</h1>
        <article class="skill" v-for="skill of skills" :key="skill.id">
          <div class="lt">{{ skill.id }}</div>
          <div class="rt">
            <span v-for="item of skill.items" :key="item">
              {{ item }}
            </span>
          </div>
        </article>
      </div>
      <div>
        <h1>기타 개발경험</h1>
        <article class="etc">
          <ul>
            <li>Flink Kafka</li>
            <li>AWS ec2</li>
            <li>C#, Unity를 이용한 2D 게임 제작 및 플레이스토어 배포</li>
          </ul>
        </article>
      </div>
      <div>
        <h1>관리자 모드</h1>
        <article class="admin">
          <GoogleLogin :callback="login" />
        </article>
      </div> -->
      <!-- <div v-if="loading" class="before-loading">
        <img :src="require('@/assets/icons/search.svg')" alt=""/>
      </div>
      <div
        v-else
        class="after-loading"
        :style="`column-gap: ${computedGap}px`"
      >
        <div
          class="icon"
          v-for="file of files"
          :key="file.id"
          @click="open(file)"
        >
          <img :src="require(`@/assets/icons/${icon(file.mimeType)}.svg`)" alt=""/>
          <span>{{ file.name }}</span>
        </div>
        <div v-if="files.length === 0" class="empty">
          이 폴더는 비어있습니다.
        </div>
      </div> -->
    </section>
  </main>
</template>
<script setup>
import { ref, defineExpose } from 'vue';

const selectedTabIndex = ref(1)

const tabs = ref([
  '사용자 정보',
  '기술스택',
  '이력',
  '개인 프로젝트'
])

// const features = ref([
//   'javascript',
//   'typescript',
//   'nodejs',
//   'vue',
//   'nuxtjs',
//   'react',
//   'css',
//   'git'
// ])


const selectedFeatureId = ref('FrontEnd')
const selectedFeatureItemId = ref('javascript')
const features = ref([
  {
    id: 'FrontEnd',
    name: '프론트엔드',
    items: ['javascript', 'typescript', 'nodejs', 'vue', 'nuxtjs', 'react', 'css']
  },
  {
    id: 'VersionManagement',
    name: '버전관리',
    items: ['git']
  }
])
</script>

<template>
  <main>
    <div class="tabs">
      <button
        v-for="(tab, index) of tabs"
        :key="index"
        @click="selectedTabIndex = index"
        :class="{ selected : selectedTabIndex === index }"
        class="outline"
      >
        {{ tab }}
      </button>
    </div>
    <div class="body outline">
      <!-- 사용자 정보 -->
      <section
        v-if="selectedTabIndex === 0"
        class="base"
      >
        <div class="lt">
          <img
            alt="profile"
            :src="require('@/assets/profile-6.png')"
          >
          <!-- <img
            alt="avatar"
            class="avatar"
            :src="require('@/assets/front-end.png')"
          />
          <img
            alt="computer"
            class="computer"
            :src="require('@/assets/windows-98-computer.png')"
          /> -->
        </div>
        <div class="rt">
          <ul>
            <li>김유진 (1994. 05.)</li>
            <li>프론트엔드 개발자</li>
            <li>2018. 02. INU Computer Science</li>
            <li>2018. 06. URP System</li>
            <li>2019. 05. Swisslog Healthcare Korea</li>
            <li>2022. 01. The CNP
              <ul>
                <li>광주첨단산단 통합관제 UI/Service</li>
                <li>무인공간관제서비스 UI</li>
                <li>동대구역사실증사업 UI/Service</li>
                <li>AI 스마트시티 2.0 (구축형) UI</li>
              </ul>
            </li>
          </ul>
        </div>
      </section>
      <!-- 기술스택 -->
      <section
        v-if="selectedTabIndex === 1"
        class="skills"
      >
        <div class="lt outline">
          <ul>
            <li
              v-for="feature of features"
              :key="feature.id"
              @click="selectedFeatureId = feature.id"
              :class="{ 'focused': selectedFeatureId === feature.id }"
            >
              {{ feature.name }}
            </li>
          </ul>
        </div>
        <div class="rt outline scroll">
          <ul
            v-if="features.find(v => v.id === selectedFeatureId)"
          >
            <li
              v-for="item of features.find(v => v.id === selectedFeatureId).items"
              :key="item"
              @click="selectedFeatureItemId = item"
              :class="{ 'focused': selectedFeatureItemId === item }"
            >
              <img
                :src="require(`@/assets/features/${item}.png`)"
                alt="feature_item"  
              > {{ item }}
            </li>
          </ul>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100%;
  padding: 10px 0;

  div.tabs {
    width: calc(100% - 20px);
    display: flex;
    margin: 0 auto;

    button {
      padding: 4px 16px;
      background-color: var(--system-dark-color);
      color: var(--system-light-color);
      font-family: 'Noto Sans KR';
      font-weight: 600;
      font-size: 14px;
      outline: none;

      &.selected {
        z-index: 3;
        border-bottom: none !important;
        padding-bottom: 6px;
        background-color: var(--system-light-color);
        color: var(--system-dark-color);
      }
    }
  }
}

.body {
  width: calc(100% - 20px);
  height: calc(100% - 30px);
  margin: 0 auto;
  position: relative;
  top: -2px;
  z-index: 2;

  .base {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    height: 100%;
  }
}

.body .base .lt {
  display: flex;
  align-items: center;
  justify-content: center;
}

.body .base .lt img {
  width: 80%;
  z-index: 3;
}

.body .base .lt img.avatar {
  width: 124px;
  margin: 0 40px 22px 40px;
  position: absolute;
  background-color: #378181;
  padding: 10px 24px;
  z-index: 2;
}

.body .base .rt {
  padding: 27px 0;
}

.body .base .rt ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.body .base .rt li {
  padding: 2px 0;
}

.body .base .rt > ul > li:nth-child(2) {
  margin-bottom: 20px;
  font-weight: normal;
}

.body .base .rt ul li ul li {
  margin-left: 20px;
  font-weight: normal;
}

.body .base .rt ul li ul li::before {
  content: '-';
  margin-right: 6px;
}

.skills {
  display: grid;
  grid-template-columns: 160px 1fr;
  padding: 20px;
  height: 100%;
  gap: 10px;
}

.skills .lt {
  background-color: white;
  height: 100%;
}

.skills .lt ul li {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 10px;
}

.skills .lt ul li.focused {
  background-color: navy;
  color: white;
}

.skills .lt *,
.skills .rt * {
  list-style: none;
  margin: 0;
  padding: 0;

}

.skills .rt {
  background-color: white;
  overflow-y: auto;
}

.skills .rt ul li {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.skills .rt ul li img {
  height: 100%;
}

/* .body {

      hr {
        width: 80%;
        margin: 3px 0;
      }

      * {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      li {
        margin: 3px 0;
      }

      li.d-1 {
        margin-bottom: 30px;

        span {
          display: inline-block;
          margin-bottom: 3px;
        }
      }

      li.d-2 {
        margin-left: 10px;
        font-weight: normal;
      }

      li.d-3 {
        margin-left: 20px;

        &::before {
          content: '-';
          margin-right: 10px;
        }
      }
    } */

/* .skills {
  width: 100%;
  height: 100%;
  padding: 10px;

  div.grid-rows {
    display: grid;
    grid-template-rows: 1fr 3fr;
    height: 100%;
    gap: 10px;
    
    > div:first-child {
      height: 100%;
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 10px;

      img {
        width: 80px;
        border: 2px outset #eee;
      }

      div {
        border: 2px outset #eee;
      }
    }

    > div:last-child {
      width: 100%;
      height: 100%;
      display: grid;
      overflow-y: hidden;
      grid-template-columns: 1fr 2fr;
      gap: 10px;

      div {
        background-color: white;
        border: 2px inset #ddd;
        overflow-y: auto;

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 10px;

            &.selected {
              background-color: navy;
              color: white;
            }

            img {
              width: 20px;
              height: 20px;
            }
          }
        }
      }

      img {
        width: 60px;
        height: 60px;
      }
    }
  }
} */
</style>
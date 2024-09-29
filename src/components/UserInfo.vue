<script setup>
import { ref } from 'vue';

const selectedTabIndex = ref(0)

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
        :class = "{ selected : selectedTabIndex === index }"
        class="outset"
      >
        {{ tab }}
      </button>
    </div>
    <div class="body outset">
      <!-- 사용자 정보 -->
      <section
        v-if="selectedTabIndex === 0"
        class="base"
      >
        <div class="lt">
          <img
            alt="avatar"
            class="avatar"
            :src="require('@/assets/power-puff-girl.png')"
          />
          <img
            alt="computer"
            class="computer"
            :src="require('@/assets/windows-98-computer.png')"
          />
        </div>
        <div class="rt">
          <ul>
            <li class="d-1">
              <span>인적사항</span>
              <ul>
                <li class="d-2">김유진</li>
                <li class="d-2">1994. 05.</li>
              </ul>
            </li>
            <li class="d-1">
              <span>이력</span>
              <ul>
                <li class="d-2">2018. 02. 인천대학교 컴퓨터공학과 졸업</li>
                <li class="d-2">2022. 01. (주)카피앤패이스트 입사
                  <ul>
                    <li class="d-3">광주첨단산단 통합관제 UI/Service</li>
                    <li class="d-3">무인공간관제서비스 UI</li>
                    <li class="d-3">동대구역사실증사업 UI/Service</li>
                    <li class="d-3">AI 스마트시티 2.0 (구축형) UI</li>
                  </ul>
                </li>
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
        <div class="grid-rows">
          <div>
            <img
              :src="require(`@/assets/features/${selectedFeatureItemId}.png`)"
              alt="selectedFeatureItem"
            >
            <div>설명...</div>
          </div>
          <div>
            <div>
              <ul>
                <li
                  v-for="feature of features"
                  :key="feature.id"
                  @click="selectedFeatureId = feature.id"
                  :class="{ 'selected': selectedFeatureId === feature.id }"
                >
                  {{ feature.name }}
                </li>
              </ul>
            </div>
            <div>
              <ul
                v-if="features.find(v => v.id === selectedFeatureId)"
              >
                <li
                  v-for="item of features.find(v => v.id === selectedFeatureId).items"
                  :key="item"
                  @click="selectedFeatureItemId = item"
                  :class="{ 'selected': selectedFeatureItemId === item }"
                >
                  <img
                    :src="require(`@/assets/features/${item}.png`)"
                    alt="feature_item"  
                  > {{ item }}
                </li>
              </ul>
            </div>
            <!-- <div
              v-for="feature of features"
              :key="feature"
            >
              <img :src="require(`@/assets/features/${feature}.png`)" alt="">
            </div> -->
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100%;
  background-color: lightgray;
  border: 2px solid transparent;
  padding: 10px 0;
}

.tabs {
  width: calc(100% - 20px);
  display: flex;
  margin: 0 auto;
}

.tabs button {
  padding: 4px 16px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #eeeeee;
  border-bottom: 3px solid lightgray;
  font-family: 'Noto Sans KR';
  font-weight: 600;
  font-size: 14px;
  outline: none;
  /* border-collapse: collapse; */
}

.tabs button.selected {
  z-index: 3;
  border-bottom: none;
  padding-bottom: 7px;
  background-color: lightgray;
  color: black;
}

.body {
  width: calc(100% - 20px);
  height: calc(100% - 30px);
  margin: 0 auto;
  position: relative;
  top: -3px;
  z-index: 2;

  .base {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 10px;
    height: 100%;

    .lt {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 90px;

      img.computer {
        width: 200px;
      }

      img.avatar {
        width: 120px;
        margin: 0 40px;
        position: absolute;
        background-color: pink;
        margin-bottom: 22px;
        padding: 5px 21px;
      }
    }

    .rt {

      padding: 27px 0;

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
    }
  }
}

.skills {
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
        border: 2px inset #ddd;;
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


  /* div {
    width: 60px;
    height: 60px;
    border: 3px outset white;

    img {
      width: 100%;
    }
  } */
}

/* .body img {
  width: 200px;
  background-color: pink;
  border: 3px inset white;
} */
</style>
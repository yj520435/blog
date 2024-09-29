<template>
  <main :class="slideIn ? 'narrow' : 'wide'">
    <!-- <section class="calendar-head">
      <div v-for="i in 7" :key="i">
        <span>{{ day[i-1] }}</span>
    </div>
    </section> -->
    <section class="title">
      <!-- <button @click="today = dayjs(prev).set('date', 1)">&lt;</button> -->
      <h1 class="calendar-title">{{ dayjs(today).format('YYYY. MM.') }}</h1>
      <!-- <button @click="today = dayjs(next).set('date', 1)">&gt;</button> -->
    </section>
    <section class="calendar-body">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="day"
        :class="{ 'focus' : item.posts[0], 'hide' : dayjs(item.date).month() !== now.month }"
      >
      <span @click="
            slideIn = true;
            focusedPost = item.posts[0]"
          >
            {{ item.posts[0] ? item.posts[0].icon : '' }}
          </span>
      </div>
    </section>
    <section
      v-if="focusedPost"
      class="slider post"
      :class="slideIn ? 'slide-in' : ''"
    >
      <button
        v-show="slideIn"
        @click="slideIn = false; focusedPost = {}"
      >x</button>
      <div class="icon">{{ focusedPost.icon }}</div>
      <div class="title">{{ focusedPost.title }}</div>
      <div class="contents">
        <p v-for="(line, index) of focusedPost.contents" :key="index" v-html="line" />
      </div>
    </section>
    <section class="buttons">
      <button>
        <!-- <img
          :src="require('@/assets/pencil.svg')"
          width="60"
          alt="작성"
        > -->
      </button>
    </section>
  </main>
</template>

<script setup>
// eslint-disable no-unused-vars

import { computed, onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'

import json from '@/assets/2024.json'

console.log('>> json', json)

dayjs.locale('ko')

// import timezone from 'dayjs/plugin/timezone'
// import utc from 'dayjs/plugin/utc'

// dayjs.extend(utc)
// dayjs.extend(timezone)
// dayjs.tz.setDefault('Asia/Seoul')

const items = ref([])

const day = ref(['월', '화', '수', '목', '금', '토', '일'])

const focusedPost = ref()

const today = ref(dayjs())

console.log('>> today', today)

const now = computed(() => ({
  year: today.value.year(),
  month: today.value.month(),
  firstDate: today.value.startOf('month').date(),
  lastDate: today.value.endOf('month').date(),
  firstDay: today.value.startOf('month').day(),
  lastDay: today.value.endOf('month').day(),
}))

const prev = computed(() => today.value.startOf('month').subtract(1, 'day'))
const next = computed(() => today.value.endOf('month').add(1, 'day'))

// console.log('>> now', now.value)
console.log('>> ', prev.value, next.value)

watch(today, (vToday) => {
  drawCalendar()
  getPosts()
})
// const current = ref({
//   year: today.getFullYear(),
//   month: today.getMonth(),
//   date: today.getDate(),
//   day: today.getDay()
// })

// const firstDayOfThisMonth = new Date(today.setDate(1)).getDay()  // 6 = 토요일
// const lastDayOfThisMonth = new Date(current.value.year, current.value.month + 1, 0).getDay()

// const lastDateOfLastMonth = new Date(current.value.year, current.value.month, 0).getDate()
// const lastDateOfThisMonth = new Date(current.value.year, current.value.month + 1, 0).getDate()

function $date(year, month, date) {
  return dayjs()
    .set('year', year)
    .set('month', month)
    .set('date', date)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
}

function drawCalendar() {
  items.value = []

  for (let i = 0; i < now.value.firstDay; i++) {
    items.value.push({
      date: $date(
        prev.value.year(),
        prev.value.month(),
        prev.value.date() - (now.value.firstDay - i - 1)
      ),
      posts: []
    })
  }

  for (let i = 0; i < now.value.lastDate; i++) {
    items.value.push({
      date:       $date(
        now.value.year,
        now.value.month,
        i + 1
      ),
      posts: []
    })
  }

  if (now.value.lastDay !== 6) {
    for (let i = 0; i < 6 - now.value.lastDay; i++) {
      items.value.push({
        date: $date(
          next.value.year(),
          next.value.month(),
          next.value.date() + i
        ),
        posts: []
      })
    }
  }
}

function getPosts() {
  json.forEach((v) => {
    console.log('>>>>> ', dayjs(v.date).month())
  })

  const posts = json.filter(v => dayjs(v.date).month() === dayjs(today.value).month())
  posts.forEach((post) => {
    const target = items.value.find((item) => dayjs(item.date).format('YYYY-MM-DD') === post.date)
    if (target)
      target.posts.push(post)
  })

  // const posts = json.filter(v => dayjs(v.date).month() === dayjs(today.value.month)
  // json.forEach((post) => {
  //   const target = items.value.find(v => dayjs(v.date).format('YYYY-MM-DD') === post.date)
  //   if (target)
  //     target.posts.push(post)
  // })
}

onMounted(() => {
  drawCalendar()
  getPosts()
})

function colorin(date) {
  const _date = new Date(date)
  if (_date.getMonth() !== now.value.month) {
    return 'lightgrey'
  }

  if (_date.getDay() === 0)
    return 'red'
  else if (_date.getDay() === 6)
    return 'blue'
  else
    return 'black'
}

const slideIn = ref()
const slideClass = computed(() => {
  if (slideIn.value === undefined)
    return ''
  return slideIn.value ? 'slide-in' : 'slide-out'
})
</script>

<!-- <script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script> -->

<style>
@import 'assets/style.css';
</style>
<script setup>
import { ref } from 'vue';

const selected = ref()

const images = ref([
  {
    id: 'windows98',
    url: 'https://lh3.google.com/u/0/d/19hrUT3Mh14JhjljB1nAI_og4ndaNlWA1=w1920-h537-iv1',
  },
  {
    id: 'pushpush',
    url: 'https://lh3.google.com/u/0/d/1sB57ZMvwn42gQKtDFtrqmdWopgmvMdcy=w1920-h537-iv2',
  },
  {
    id: 'fumblur',
    url: 'https://lh3.google.com/u/0/d/1iqpNuzgmGZvaRFDBftImEZE-cZ0Tfmmk=w1920-h917-iv1',
  }
])
</script>

<template>
  <main id="gallery">
    <section class="header">
      <div class="lt">
        <!-- <button @click="selected.pop()">
          <img :src="require('@/assets/icons/arrow-left.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/arrow-right.svg')" alt="">
        </button>
        <button>
          <img :src="require('@/assets/icons/reset.svg')" alt="">
        </button>
        <button @click="selected.pop()">
          <img :src="require('@/assets/icons/home.svg')" alt="">
        </button> -->
      </div>
      <div class="rt">
        <!-- <img :src="require('@/assets/icons/computer.svg')" alt=""/>
        <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        <span v-for="path of paths" :key="path">
          {{ path }}
          <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
        </span> -->
      </div>
    </section>
    <section class="body" :class="{ 'p-0' : selected, 'p-20' : !selected }">
      <div v-if="selected" class="single" :style="`background-image: url(${selected.url})`" @click="selected = null">
        <!-- <img :src="selected.url" alt="" @click="selected = null"> -->
      </div>
      <div v-else class="multiple">
        <div
          v-for="image of images"
          :key="image.id"
          @click="selected = image"
          :style="`background-image: url(${image.url})`"
          alt=""
        />
      </div>
    </section>
  </main>
</template>
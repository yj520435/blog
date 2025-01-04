<script setup>
import { usePopup } from '@/store';
import { defineProps, toValue, ref, computed, reactive, watch } from 'vue'

const popup = usePopup()
const state = ref(popup.state)

const isAlert = computed(() => state.value.type === 'alert')
const isConfirm = computed(() => state.value.type === 'confirm')
const isPrompt = computed(() => state.value.type === 'prompt')
</script>

<template>
  <main class="popup" v-if="popup.state.show">
    <div class="outline">
      <div class="title outline">
        <img
          :src="require('@/assets/icons/fill/message.svg')"
          alt=""
        />
        <span>System Message</span>
      </div>
      <div class="body outline">
        <component :is="state.component" />
        
        <!-- <img :src="require(`@/assets/icons/line/${state.icon}`)" alt="" class="filter">
        <section
          class="message"
          v-if="isAlert || isConfirm"
        >
          {{ state.message }} -->
          <!-- Cannot Access Directory Now<br>
          Error Code: [431] -->
        <!-- </section> -->
        <!-- <section v-else class="input">
          <input
            class="outline"
            :placeholder="state.message"
          >
        </section> -->
        <section class="buttons">
          <button class="cancel" @click="popup.off()">
            <div class="outline">
              Cancel
            </div>
          </button>
          <button @click="popup.off()" class="submit">
            <div class="outline">
              OK
            </div>
          </button>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
main.popup {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute !important;
  background-color: rgba(0, 0, 0, 0.7);
  animation: fade-in 0.3s forwards;
  
  > div {
    color: var(--base-color);
    z-index: 10;
    width: 400px;
    background-color: var(--base-color);
    
    .title {
      width: calc(100% - 4px);
      height: 30px;
      background-color: var(--text-color);
      margin: 2px;
      display: grid;
      grid-template-columns: 30px 1fr;
      align-items: center;
      
      > img {
        width: 22px;
        height: 22px;
        margin: 0 2px;
        filter:
          invert(100%) 
          sepia(0%) 
          saturate(17%) 
          hue-rotate(334deg) 
          brightness(105%) 
          contrast(105%);
      }
    }
    
    .body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: calc(100% - 4px);
      height: calc(100% - 36px);
      color: var(--text-color);
      background-color: var(--base-color);
      margin: 2px;
      padding: 20px 0;
      gap: 20px;

      main {
        width: 450px;
      }
      
      img {
        width: 46px;
        animation: poppin 1s forwards;
      }

      section.input {
        input {
          width: 300px;
          font-weight: normal;
          outline: none;
          padding: 7px;
        }
      }

      section.buttons {
        margin: 2px;
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 30px;

        button {
          width: fit-content;
          height: 36px;
          border: none;
          color: var(--base-color);
          background-color: var(--text-color);
          padding: 2px;
          cursor: var(--pointer-cursor);

          &.submit {
            text-decoration: underline;
          }

          &.cancel {
            background-color: #666666;
          }

          div {
            width: 103px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-color: var(--base-color);
          }
        }
      }
    }
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
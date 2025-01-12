import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import vue3GoogleLogin from 'vue3-google-login';
import 'highlight.js/styles/stackoverflow-light.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';

const pinia = createPinia();
createApp(App)
  .use(pinia)
  .use(vue3GoogleLogin, {
    clientId: '827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com',
  })
  .use(hljsVuePlugin)
  .mount('#app');

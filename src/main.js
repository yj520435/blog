import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import vue3GoogleLogin from 'vue3-google-login';

import {
  faXmark,
  faUserSecret,
  faExpand,
  faCompress,
  faWindowMinimize,
  faMaximize,
  faMinimize,
  faList,
  faCube,
  faCubes,
  faPlus,
  faMinus,
  faChevronDown,
  faCaretDown,
  faEraser,
  faPaintBrush,
  faMagnifyingGlass,
  faPencil,
  faSprayCanSparkles,
  faA,
  faMagicWandSparkles,
  faSquare,
  faCircle,
  faFillDrip,
  faScissors,
  faCrop,
  faDrawPolygon,
  faRotateRight,
  faVectorSquare,
  faArrowLeft,
  faArrowRight,
  faArrowTurnUp,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faUserSecret,
  faXmark,
  faExpand,
  faCompress,
  faWindowMinimize,
  faList,
  faCube,
  faCubes,
  faMaximize,
  faMinimize,
  faPlus,
  faMinus,
  faChevronDown,
  faCaretDown,
  faEraser,
  faPaintBrush,
  faMagnifyingGlass,
  faPencil,
  faSprayCanSparkles,
  faA,
  faMagicWandSparkles,
  faSquare,
  faCircle,
  faFillDrip,
  faScissors,
  faCrop,
  faDrawPolygon,
  faRotateRight,
  faVectorSquare,
  faArrowLeft,
  faArrowRight,
  faArrowTurnUp,
  faBookmark
);

const pinia = createPinia();
createApp(App)
  .use(pinia)
  .use(vue3GoogleLogin, {
    clientId: '827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com',
  })
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');

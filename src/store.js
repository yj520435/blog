import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopup = defineStore('popup', () => {
  const state = ref({
    show: false,
    message: '',
  });

  function on(message) {
    state.value.message = message;
    state.value.show = true;
  }

  function off() {
    state.value.message = '';
    state.value.show = false;
  }

  return {
    state,
    on,
    off,
  };
});

// export const usePopup = defineStore('popup', () => {
//   const state = ref({
//     size: 'small',
//     type: 'alert',
//     icon: 'error.svg',
//     message: '',
//     show: false,
//     component: null,
//   });

//   function on(params) {
//     ['size', 'type', 'icon', 'message', 'component'].forEach((v) => {
//       if (params[v]) state.value[v] = params[v];
//     });
//     state.value.show = true;
//   }

//   function off() {
//     state.value = {
//       type: 'alert',
//       icon: 'error.svg',
//       message: '',
//       show: false,
//     };
//     console.log('# ', state.value);
//   }

//   return {
//     state,
//     on,
//     off,
//   };
// });

export const useProgram = defineStore('program', () => {
  const items = ref([]);

  const focused = ref('');

  // const sortedPrograms = ref([]);
  // const activatedProgram = ref();

  function open(item) {
    const isOpenedAlready = items.value.find((v) => v.id === item.id);
    if (!isOpenedAlready) {
      const index = items.value.length + 1;
      items.value.push({
        ...item,
        feature: {
          x: 90 + 30 * index,
          y: 30 + 30 * index,
          width: 600,
          height: 450,
        },
      });

      // sortedPrograms.value.push(item.id);
      focused.value = item.id;
    } else {
      // sort(item.id);
    }
  }

  async function ready(id, callback, options) {
    const program = items.value.find((v) => v.id === id);
    program.options = options;
    program.options.ready = false;
    await callback();
    program.options.ready = true;
  }

  // function setOptions(id, params) {
  //   const program = programs.value.find((v) => v.id === id);
  //   program.params = params;
  // }

  function close(id) {
    console.log('>> Close');
    const index = items.value.findIndex((v) => v.id === id);
    if (index > -1) items.value.splice(index, 1);

    focused.value = items.value.length > 0 ? items.value[items.value.length - 1].id : '';
  }

  // function sort(id) {
  //   const index = sortedPrograms.value.findIndex((v) => v === id);
  //   if (index > -1) {
  //     sortedPrograms.value.splice(index, 1);
  //     sortedPrograms.value.push(id);
  //   }
  //   activatedProgram.value = id;
  // }

  return {
    items,
    open,
    ready,
    close,
    focused,
  };
});

export const useHistoryStore = defineStore('history', () => {
  const currentItem = ref({});
  const lastItem = ref({});

  function set(item) {
    currentItem.value = item;
  }

  function get() {
    return currentItem.value;
  }

  return {
    set,
    get,
  };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePopup = defineStore('popup', () => {
  const state = ref({
    type: 'alert',
    icon: 'error.svg',
    message: '',
    show: false,
  });

  function on(params) {
    ['type', 'icon', 'message'].forEach((v) => {
      if (params[v]) state.value[v] = params[v];
    });
    state.value.show = true;
  }

  function off() {
    state.value = {
      type: 'alert',
      icon: 'error.svg',
      message: '',
      show: false,
    };
    console.log('# ', state.value);
  }

  return {
    state,
    on,
    off,
  };
});

export const useStore = defineStore('store', () => {
  const programs = ref([]);

  const sortedPrograms = ref([]);
  const activatedProgram = ref();

  function open(program) {
    const isOpenedAlready = programs.value.find((v) => v.id === program.id);
    if (!isOpenedAlready) {
      programs.value.push(program);
      sortedPrograms.value.push(program.id);
      activatedProgram.value = program.id;
    } else {
      sort(program.id);
    }
  }

  function close(id) {
    console.log('>> Close');
    const index = programs.value.findIndex((v) => v.id === id);
    if (index > -1) programs.value.splice(index, 1);

    activatedProgram.value =
      programs.value.length > 0 ? programs.value[programs.value.length - 1].id : '';
  }

  function sort(id) {
    const index = sortedPrograms.value.findIndex((v) => v === id);
    if (index > -1) {
      sortedPrograms.value.splice(index, 1);
      sortedPrograms.value.push(id);
    }
    activatedProgram.value = id;
  }

  return {
    programs,
    sortedPrograms,
    activatedProgram,
    open,
    close,
    sort,
  };
});

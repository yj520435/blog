import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStore = defineStore('store', () => {
  const programs = ref([]);

  const sortedPrograms = ref([]);
  const activatedProgram = ref();

  function open(program) {
    programs.value.push(program);
    sortedPrograms.value.push(program.id);
    activatedProgram.value = program.id;
  }

  function close(id) {
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

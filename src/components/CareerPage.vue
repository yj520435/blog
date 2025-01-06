<script setup lang="ts">
import { JSON } from '@/constants';
import { useStore } from '@/store';
import { Company } from '@/types/base';
import { loadFile } from '@/utils';
import { Ref, defineEmits, onMounted, ref } from 'vue';

const emits = defineEmits(['load'])

const store = useStore()

const companies: Ref<Company[]> = ref([])

const ROOT = '19krnKls4kkkLN2_phD_7bLieU91LzULy'

const loading: Ref<boolean> = ref(true)

onMounted(async () => {
  loading.value = true

  const storedCompanies = store.getFolder(ROOT)
  if (storedCompanies) { 
    companies.value = storedCompanies.items
  }
  else {
    companies.value = await loadFile(ROOT, JSON)
    store.setFolder(ROOT, companies.value)
  }

  loading.value = false
})
 
</script>

<template>
  <main id="career" class="component">
    <header>
      <div class="lt">
        <label><input type="checkbox" v-model="store.checkboxStatus.keyword"> 키워드</label>
        <label><input type="checkbox" v-model="store.checkboxStatus.period"> 수행기간</label>
      </div>
      <div class="ct">
        <img :src="require('@/assets/icons/monitor.svg')" alt=""/>
        <img :src="require('@/assets/icons/arrow-drop-right.svg')" alt=""/>
      </div>
      <div class="rt disabled">
        <img :src="require('@/assets/icons/search.svg')" alt=""/>
        <input type="text" disabled>
      </div>
    </header>
    <section>
      <div v-if="loading" class="loading">
        <img :src="require('@/assets/icons/search.svg')" alt="search"/>
      </div>
      <div v-else class="wrapper scroll">
        <div v-if="companies.length > 0">
          <table v-for="company of companies" :key="company.id">
            <thead :class="{ disabled : company.projects.length === 0 }">
              <th>
                <div>
                  <span>
                    <img :src="require('@/assets/icons/folder.svg')" alt="">
                    {{ company.name }}
                  </span>
                </div>
              </th>
              <th></th>
              <th>{{ company.from }} - {{ company.to }}</th>
            </thead>
            <tbody>
              <tr
                v-for="project of company.projects"
                :key="project.id"
                @click="emits('load', project, true)"
              >
                <td>
                  <span>
                    <img :src="require('@/assets/icons/file.svg')" alt="">
                    {{ project.name }}
                  </span>
                </td>
                <td>
                  <span v-if="store.checkboxStatus.keyword" class="keywords">
                    <span
                      v-for="keyword of project.keywords"
                      :key="keyword"
                      class="keyword"
                      :class="keyword.toLowerCase()"
                    >
                      {{ keyword }}
                    </span>
                  </span>
                </td>
                <td>
                  <span v-if="store.checkboxStatus.period" class="period">
                    {{ project.from }} - {{ project.to }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="fail disabled">
          <img :src="require('@/assets/icons/alert.svg')" alt="alert">
          오류가 발생했습니다.
        </div>
      </div>
    </section>
  </main>
</template>
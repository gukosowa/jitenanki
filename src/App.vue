<template>
  <the-header />
  <loading-bar color="bg-cyan-500" loading-any class="-mt-2" :height="20"></loading-bar>

  <main class="flex flex-col m-3 mt-5">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath"></component>
      </keep-alive>
    </router-view>
  </main>

  <BaseToast />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import BaseToast from '@/components/BaseToast.vue'

import { watch } from 'vue'
import { useAppStore } from '@/stores/appStore'
import LoadingBar from '@/components/LoadingBar.vue'

const appStore = useAppStore()

watch(
  () => appStore.darkMode,
  (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  { immediate: true },
)
</script>

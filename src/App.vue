<template>
  <the-header />

  <main class="m-3 mt-5">
    <RouterView />
  </main>

  <BaseToast />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import BaseToast from '@/components/BaseToast.vue'

import { watch } from 'vue'
import { useAppStore } from '@/stores/appStore'

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

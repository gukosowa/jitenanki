<template>
  <the-header />
  <loading-bar color="bg-cyan-500" loading-any class="-mt-2" :height="20"></loading-bar>

  <main class="flex flex-col m-3 mt-5">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath + accountStore.user?.$id"></component>
      </keep-alive>
    </router-view>
  </main>

  <BaseToast />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from '~src/components/TheHeader.vue'
import BaseToast from '~src/components/BaseToast.vue'

import { watch } from 'vue'
import { useAppStore } from '~src/stores/appStore'
import LoadingBar from '~src/components/LoadingBar.vue'
import { useAccountStore } from '~src/stores/account'

const appStore = useAppStore()
const accountStore = useAccountStore()

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

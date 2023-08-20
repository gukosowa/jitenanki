<template>
  <header
    class="bg-gray-400 dark:bg-gray-900 flex w-full h-12 items-center mb-2 drop-shadow-xl z-10 border-b border-gray-500 dark:border-gray-900 px-2"
  >
    <img src="/icon-192x192.png" class="w-8 h-8" alt="logo" />
    <div class="grow pl-2 overflow-ellipsis overflow-hidden text-gray-800 dark:text-gray-500">
      {{ router.currentRoute.value.name }}
    </div>
    <nav class="flex">
      <dark-mode-switch class="mr-3" />
      <RouterLink to="/" class="place-self-center mr-3">Detail</RouterLink>
      <RouterLink to="/list" class="place-self-center mr-3">List</RouterLink>
      <RouterLink v-if="!accountStore.isLogged" to="/sign-in"
        ><icon-signin class="w-8 h-8 p-1 mr-3"
      /></RouterLink>
      <RouterLink v-if="!accountStore.isLogged" to="/sign-up"
        ><icon-signup class="w-8 h-8 p-1"
      /></RouterLink>
      <icon-logout
        v-if="!!accountStore.isLogged"
        class="w-8 h-8 p-1 cursor-pointer"
        @click="onLogout"
      />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import IconSignin from '@/components/icons/IconSignin.vue'
import IconSignup from '@/components/icons/IconSignup.vue'
import router from '../router'
import IconLogout from '@/components/icons/IconLogout.vue'
import { useAccountStore } from '@/stores/account'
import { onMounted } from 'vue'
import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import { useToastStore } from '@/stores/toastStore'

const accountStore = useAccountStore()
const toast = useToastStore()

onMounted(async () => {
  console.log(await accountStore.user)
})

async function onLogout() {
  await accountStore.logout()

  await router.push('/sign-in')

  toast.add('Bye 👋', 'SUCCESS')
}
</script>

<style scoped></style>

<template>
  <header
    class="sticky top-0 bg-gray-400 bg-primary dark:bg-gray-900 flex w-full h-12 items-center mb-2 drop-shadow-xl z-10 border-b border-gray-500 dark:border-gray-900 px-2"
  >
    <img src="/icons/p_only.svg" class="w-8 h-8" alt="logo" />
    <div class="grow pl-2 overflow-ellipsis overflow-hidden dark:text-gray-500">
      {{ router.currentRoute.value.name }}
    </div>
    <nav class="flex">
      <RouterLink to="/" class="place-self-center mr-3">Quick</RouterLink>
      <RouterLink to="/prompts" class="place-self-center mr-3">Prompts</RouterLink>
      <RouterLink to="/tags" class="place-self-center mr-3">Tags</RouterLink>

      <dark-mode-switch class="mr-3" />

      <RouterLink v-if="!accountStore.isLogged" to="/sign-in"
        ><icon-signin class="w-8 h-8 p-1 mr-3"
      /></RouterLink>
      <RouterLink v-if="!accountStore.isLogged" to="/sign-up"
        ><icon-signup class="w-8 h-8 p-1"
      /></RouterLink>

      <icon-logout
        v-if="!!accountStore.isLogged && !loadingLogout"
        class="w-8 h-8 p-1 cursor-pointer"
        @click="onLogout"
      />
      <icon-spinner
        v-if="loadingLogout"
        class="w-8 h-8 p-1 animate-spin cursor-pointer"
        @click="onLogout"
      />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import IconSignin from '~/components/icons/IconSignin.vue'
import IconSignup from '~/components/icons/IconSignup.vue'
import router from '../router'
import IconLogout from '~/components/icons/IconLogout.vue'
import { useAccountStore } from '~/stores/account'
import { onMounted, ref } from 'vue'
import DarkModeSwitch from '~/components/DarkModeSwitch.vue'
import { useToastStore } from '~/stores/toastStore'
import IconSpinner from '~/components/icons/IconSpinner.vue'

const accountStore = useAccountStore()
const toast = useToastStore()
const loadingLogout = ref(false)

onMounted(async () => {
  console.log(await accountStore.user)
})

async function onLogout() {
  loadingLogout.value = true
  try {
    await accountStore.logout()

    await router.push('/sign-in')

    toast.add('Bye 👋')
  } catch (e) {
    toast.error(e as string)
  }

  loadingLogout.value = false
}
</script>

<style scoped></style>

<template>
  <header
    class="bg-gray-900 flex w-full h-12 items-center mb-2 drop-shadow-xl z-10 border-b border-gray-900 px-2"
  >
    <img src="/icon-192x192.png" class="w-8 h-8" alt="logo" />
    <div class="grow pl-2 overflow-ellipsis overflow-hidden text-gray-500">
      {{ router.currentRoute.value.name }}
    </div>
    <nav class="flex">
      <RouterLink to="/" class="place-self-center mr-3">Detail</RouterLink>
      <RouterLink to="/list" class="place-self-center mr-3">List</RouterLink>
      <RouterLink v-if="!user" to="/sign-in"><icon-signin class="w-8 h-8 p-1 mr-3" /></RouterLink>
      <RouterLink v-if="!user" to="/sign-up"><icon-signup class="w-8 h-8 p-1" /></RouterLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import IconSignin from '@/components/icons/IconSignin.vue'
import IconSignup from '@/components/icons/IconSignup.vue'
import router from '../router'
import { sessionUser } from '@/utils/backend'
import { onMounted, ref } from 'vue'
import { Models } from 'appwrite'

let user = ref<null | Models.User<Models.Preferences>>(null)

onMounted(async () => {
  try {
    user.value = await sessionUser()
  } catch (e) {
    user.value = null
  }

  console.log(user.value)
})
</script>

<style scoped></style>

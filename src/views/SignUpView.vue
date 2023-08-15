<template>
  <div class="m-3 mt-5">
    <input-text label="Email" v-model="email" class="mb-3" />
    <input-text label="Password" v-model="password" />

    <base-button class="mt-5" @click="onRegister">Sign up</base-button>
  </div>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

let email = ref('markus@test.com')
let password = ref('12345678')

import { useAccountStore } from '@/stores/account'
import router from '@/router'
const account = useAccountStore()

async function onRegister() {
  const success = account.register(email.value, password.value)

  if (success) {
    await router.push('/')
  } else {
    await router.push('/sign-in')
  }
}
</script>

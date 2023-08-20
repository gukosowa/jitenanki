<template>
  <div class="m-3 mt-5">
    <input-text label="Email" v-model="email" class="mb-3" />
    <input-text :attr-input="{ type: 'password' }" label="Password" v-model="password" />

    <base-button class="mt-5" @click="onLogin">Sign in</base-button>
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
import { useToastStore } from '@/stores/toastStore'

const account = useAccountStore()
const toast = useToastStore()

async function onLogin() {
  await account
    .login(email.value, password.value)
    .then(async () => {
      await router.push('/')
      toast.add('Hello ' + email.value + ' 👋', 'SUCCESS')
    })
    .catch(async (error) => {
      await router.push('/sign-in')
      toast.error(error)
    })
}
</script>

<template>
  <input-text
    label="Email"
    type="email"
    v-model="email"
    class="mb-3"
    @keydown.enter="focusNextInput($event)"
  />
  <input-text label="Password" v-model="password" @keydown.enter="onRegister" />

  <base-button :loading="loading" class="mt-5" @click="onRegister">Sign up</base-button>
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
import { blurAll, focusNextInput } from '@/utils/dom'
const account = useAccountStore()
const toast = useToastStore()

const loading = ref(false)

async function onRegister() {
  blurAll()

  loading.value = true

  await account
    .register(email.value, password.value)
    .then(async () => {
      await router.push('/')
      toast.add('Success register', 'SUCCESS')
    })
    .catch(async (error) => {
      await router.push('/sign-up')
      toast.error(error)
    })

  loading.value = false
}
</script>

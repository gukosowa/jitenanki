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

let email = ref('')
let password = ref('')

import { client } from '@/utils/backend'
import { ID } from 'appwrite'
const { account } = client()

function onRegister() {
  const promise = account.create(ID.unique(), email.value, password.value)

  promise.then(
    function (response) {
      console.log(response) // Success
    },
    function (error) {
      console.log(error) // Failure
    },
  )
}
</script>

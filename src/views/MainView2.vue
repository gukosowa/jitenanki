<template>
  <h1>Detail / Main</h1>

  <input-text label="main" v-model="inputT" />
</template>

<script setup lang="ts">
import InputText from '~src/components/InputText.vue'
import { onMounted, ref } from 'vue'
import { useAccountStore } from '~src/stores/account'
import router from '~src/router'

let inputT = ref('')

onMounted(async () => {
  const account = useAccountStore()

  if ((await account.currentSession()) === null) {
    await router.push('/sign-in')
  }
})
</script>

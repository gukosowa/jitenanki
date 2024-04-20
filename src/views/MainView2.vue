<template>
  <h1>Detail / Main</h1>

  <input-text label="main" v-model="inputT" />
</template>

<script setup lang="ts">
import InputText from '~/components/InputText.vue'
import { onMounted, ref } from 'vue'
import { useAccountStore } from '~/stores/account'
import router from '~/router'

let inputT = ref('')

onMounted(async () => {
  const account = useAccountStore()

  if ((await account.currentSession()) === null) {
    await router.push('/sign-in')
  }
})
</script>

<template>
  <div>
    <h1>Main</h1>

    <input-text label="main" v-model="inputT" />
  </div>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import { ref } from 'vue'

let inputT = ref()
</script>

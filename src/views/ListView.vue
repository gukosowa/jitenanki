<template>
  <div>
    <input-text label="Search" v-model="inputT" />
  </div>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import { ref } from 'vue'

let inputT = ref()
</script>

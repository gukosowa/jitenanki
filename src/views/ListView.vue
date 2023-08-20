<template>
  <section class="flex gap-4">
    <input-text class="grow" label="Prompt Name" v-model="inputT" />

    <base-button>Create</base-button>
  </section>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

let inputT = ref('')
</script>

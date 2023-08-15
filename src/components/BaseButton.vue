<template>
  <button class="bg-cyan-800 px-3 py-2 rounded border-cyan-900 drop-shadow" @click="onClick">
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
const emit = defineEmits<{ click: [] }>()

function onClick() {
  emit('click')
}
</script>

<style scoped></style>

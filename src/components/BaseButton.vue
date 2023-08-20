<template>
  <button
    class="bg-cyan-600 dark:bg-cyan-800 text-white px-3 py-2 rounded border-cyan-900 shadow dark:shadow-cyan-500 shadow-cyan-800"
    @click="onClick"
  >
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

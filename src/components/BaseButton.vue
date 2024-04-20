<template>
  <button
    class="bg-cyan-600 text-sm h-9 dark:bg-cyan-800 text-white px-3 py-2 rounded border-cyan-900 flex gap-2"
    @click="onClick"
  >
    <slot>{{ text }}</slot>
    <icon-spinner color="#ffffff" class="animate-spin w-4 mt-1" v-if="loading"></icon-spinner>
  </button>
</template>

<script setup lang="ts">
import IconSpinner from '~/components/icons/IconSpinner.vue'

defineProps<{
  text?: string
  loading?: boolean
}>()
const emit = defineEmits<{ click: [] }>()

function onClick() {
  emit('click')
}
</script>

<style scoped></style>

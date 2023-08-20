<template>
  <button
    :class="color"
    class="text-sm text-white p-1 px-1 rounded border-cyan-900 flex gap-2"
    @click="onClick"
  >
    <component class="w-6 h-6" :is="is" />
    <icon-spinner color="#ffffff" class="animate-spin w-4 mt-1" v-if="loading"></icon-spinner>
  </button>
</template>

<script setup lang="ts">
import IconSpinner from '@/components/icons/IconSpinner.vue'
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps<{
  icon: string
  color?: 'cyan' | 'red' | 'green'
  loading?: boolean
}>()
const emit = defineEmits<{ click: [] }>()

const color = computed(() => {
  const color = props.color ?? 'cyan'

  return {
    cyan: 'bg-cyan-600 dark:bg-cyan-800',
    red: 'bg-red-600 dark:bg-red-900',
    green: 'bg-green-600 dark:bg-green-800',
  }[color]
})

const is = computed(() => defineAsyncComponent(() => import('./icons/' + props.icon + '.vue')))

function onClick() {
  emit('click')
}
</script>

<style scoped></style>

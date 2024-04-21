<template>
  <button
    :class="color"
    class="text-sm text-white p-1 px-1 rounded border-cyan-900 flex gap-2"
    @click="onClick"
  >
    <component
      :class="iconClass ?? 'w-6 h-6'"
      :color="iconColor"
      v-if="!loading || !loadingInline"
      :is="is"
    />
    <icon-spinner
      color="#ffffff"
      class="animate-spin w-4 mt-1"
      :class="{ 'w-6 h-6 mt-0 ml-1': loadingInline }"
      v-if="loading"
    ></icon-spinner>
  </button>
</template>

<script setup lang="ts">
import IconSpinner from '~src/components/icons/IconSpinner.vue'
import { computed, defineAsyncComponent, type Component } from 'vue'

const props = defineProps<{
  icon: string | Component
  color?: 'cyan' | 'red' | 'green'
  iconClass?: string
  iconColor?: string
  loading?: boolean
  loadingInline?: boolean
  transparent?: boolean
}>()
const emit = defineEmits<{ click: [] }>()

const color = computed(() => {
  const color = props.color ?? 'cyan'
  if (props.transparent) {
    return 'bg-transparent'
  }

  return {
    cyan: 'bg-cyan-600 dark:bg-cyan-800',
    red: 'bg-red-600 dark:bg-red-900',
    green: 'bg-green-600 dark:bg-green-800',
  }[color]
})

const is = computed(() => {
  if (typeof props.icon === 'string') {
    return defineAsyncComponent(() => import('./icons/' + props.icon + '.vue'))
  }

  return props.icon
})

function onClick() {
  emit('click')
}
</script>

<style scoped></style>

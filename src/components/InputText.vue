<template>
  <div
    class="bg-gray-300 h-9 dark:bg-gray-700 border border-gray-500 dark:border-gray-900 drop-shadow-md rounded flex box-border"
  >
    <div
      class="absolute rounded dark:bg-gray-800 text-xs bg-gray-200 px-2 -top-2 left-1 dark:text-gray-300 text-gray-700 dark:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
    >
      {{ label }}
    </div>
    <input
      class="bg-gray-300 dark:bg-gray-700 dark:focus:bg-gray-600 focus:bg-gray-200 box-border px-2 pt-3 rounded grow"
      :type="type ?? 'text'"
      v-model="value"
      v-bind="attrInput"
    />
    <button v-if="clearable" class="px-4" @click="onClear">x</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  label: string
  type?: string
  clearable?: boolean
  attrInput?: Record<string, unknown>
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    emit('update:modelValue', value)
  },
})

function onClear() {
  value.value = ''
}
</script>

<style scoped></style>

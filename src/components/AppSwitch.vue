<template>
  <BaseSwitch v-model="internalValue"><slot></slot></BaseSwitch>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseSwitch from './BaseSwitch.vue'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

const props = defineProps<{ storageKey: keyof typeof appStore }>()

const emit = defineEmits(['update:modelValue'])

const initialStoreValue = appStore[props.storageKey] as boolean
const internalValue = ref(initialStoreValue !== undefined ? initialStoreValue : false)

watch(internalValue, (newValue) => {
  appStore[props.storageKey] = newValue
  localStorage.setItem(props.storageKey as string, JSON.stringify(newValue))
  emit('update:modelValue', newValue)
})
</script>

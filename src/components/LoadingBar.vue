<template>
  <div class="h-1 w-full relative overflow-hidden">
    <div v-if="isLoading" class="h-full w-full absolute">
      <div class="bar animate-slide h-full w-full bg-gradient-to-r" :class="color"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoadingStore } from '@/stores/loading'
import { computed } from 'vue'

const loading = useLoadingStore()

const props = defineProps<{
  color?: string
  height?: number
  loadingKey?: string
  loadingAny?: boolean
}>()

const isLoading = computed(() => {
  let isLoadingKey = false
  if (props.loadingKey) {
    isLoadingKey = loading.is(props.loadingKey)
  }
  let isLoadingAny = false
  if (props.loadingAny) {
    isLoadingAny = loading.any()
  }

  return isLoadingKey || isLoadingAny
})
</script>

<style scoped>
.bar {
  animation: slide-animation 2s ease-in-out infinite;
}

.animate-slide {
  animation-name: slide-animation;
}
</style>

<style>
@keyframes slide-animation {
  0% {
    transform: translateX(-100%);
  }
  30% {
    transform: translateX(0);
  }
  80% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>

<template>
  <section
    class="toasts-container fixed bottom-4 right-4 flex flex-col items-end space-y-2 text-sm"
  >
    <TransitionGroup name="list" tag="div">
      <div v-for="toast in toasts" :key="toast.id" class="w-auto text-right ml-4">
        <article
          @click="removeToast(toast.id)"
          class="toast inline-block transform p-4 rounded shadow-lg mt-2 cursor-pointer backdrop-blur-md bg-opacity-80 dark:bg-opacity-60 text-white"
          :class="toastClasses(toast.type)"
        >
          {{ toast.message }}
        </article>
      </div>
    </TransitionGroup>
  </section>
</template>

<script setup lang="ts">
import { useToastStore } from '~src/stores/toastStore'

const store = useToastStore()
const toasts = store.$state.toasts

const toastClasses = (type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS') => {
  return {
    INFO: 'bg-blue-600 dark:bg-blue-500',
    WARNING: 'bg-yellow-600 dark:bg-yellow-500',
    ERROR: 'bg-red-600 dark:bg-red-500',
    SUCCESS: 'bg-green-600 dark:bg-green-500',
  }[type]
}

const removeToast = (id: string) => {
  store.remove(id)
}
</script>

<style scoped>
.toast {
  transition: all 0.3s;
}
</style>

<!--suppress CssUnusedSymbol -->
<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

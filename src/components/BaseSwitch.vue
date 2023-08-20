<template>
  <div @click="toggle" class="h-8 cursor-pointer switch">
    <input v-model="value" type="checkbox" class="hidden" />
    <div class="w-12 h-8 bg-gray-300 rounded-full p-1 transition duration-300">
      <div
        class="w-6 h-6 bg-primary rounded-full shadow-md transform transition-transform duration-300"
        :style="circleStyle"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Boolean,
})

const value = ref(props.modelValue)

const circleStyle = computed(() => ({
  transform: `translateX(${value.value ? '65%' : '0%'})`,
}))

const toggle = () => {
  value.value = !value.value
  emit('update:modelValue', value.value)
}
</script>

<style scoped>
.bg-primary {
  background-color: var(--primary-color, #3498db);
}

.switch {
  -webkit-tap-highlight-color: transparent;
}
</style>

<template>
  <form @submit.prevent="onSubmit">
    <div v-for="(input, key) in inputs" :key="key" class="mb-4">
      <label :for="`${key}`" class="block text-gray-700 text-sm font-bold mb-2">
        {{ input.label }}
      </label>
      <input
        v-model="formData[key]"
        :id="`${key}`"
        :type="input.type"
        :placeholder="input.placeholder"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
    <button
      type="submit"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Save
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue: Object
  inputs: {
    label: string
    type: string
    placeholder: string
  }[]
}>()

const emit = defineEmits(['update:modelValue'])

const formData = ref(props.modelValue as Record<string, string>)
const onSubmit = () => {
  emit('update:modelValue', formData.value)
}
</script>

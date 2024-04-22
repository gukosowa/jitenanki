<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = defineProps<{
  text: string
}>()

const backgroundColor = computed(() => {
  // Simple hashing function to generate a hex color based on the text
  let hash = 0
  for (let i = 0; i < props.text.length; i++) {
    hash = props.text.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).substr(-2)
  }
  return color
})
</script>

<template>
  <div
    class="inline-flex items-center px-2 h-[1.2rem] text-white rounded-full text-[0.6rem] translate-y-[-3px] text-center"
    :style="{ backgroundColor: backgroundColor }"
  >
    {{ text }}
  </div>
</template>

<template>
  <span v-bind="$attrs" v-for="(part, index) in highlightedText" :key="index">
    <span v-if="isMatch(part)" v-bind="bindHighlight">{{ part }}</span>
    <template v-else>{{ part }}</template>
  </span>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  text: string
  searchTerm: string
  bindHighlight?: { [key: string]: string | number }
}>()

const highlightedText = ref<string[]>([])

const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

watchEffect(() => {
  const { text, searchTerm } = props
  if (!searchTerm) {
    highlightedText.value = [text]
    return
  }
  const escapedSearchTerm = escapeRegExp(searchTerm)
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi')
  highlightedText.value = text.split(regex)
})

const isMatch = (part: string) => {
  return part.toLowerCase() === props.searchTerm.toLowerCase()
}
</script>

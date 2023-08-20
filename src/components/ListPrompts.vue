<template>
  <ul class="border border-gray-900">
    <li
      class="px-2 py-3"
      :class="{ 'bg-gray-700 bg-opacity-40': index % 2 === 0 }"
      v-for="(prompt, index) in prompts"
      :key="prompt.$id"
    >
      {{ prompt.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useClientStore } from '@/stores/client'
import { collectionEvent, useDatabasesStore } from '@/stores/database'
import { onMounted, ref } from 'vue'

const { client } = useClientStore()
const { databases, databaseId, collections } = useDatabasesStore()

const prompts = ref([])

client.subscribe(collectionEvent(collections.prompts), function () {
  loadList()
})

onMounted(() => {
  loadList()
})

async function loadList() {
  const list = await databases.listDocuments(databaseId, collections.prompts)
  prompts.value = list.documents
}
</script>

<style scoped></style>

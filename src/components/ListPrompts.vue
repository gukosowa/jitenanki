<template>
  <icon-spinner class="animate-spin w-8 m-auto" v-if="loadingList" />
  <ul v-else class="border border-gray-900">
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
import IconSpinner from '@/components/icons/IconSpinner.vue'

const { client } = useClientStore()
const { databases, databaseId, collections } = useDatabasesStore()

const prompts = ref([])
const loadingList = ref(false)

client.subscribe(collectionEvent(collections.prompts), function () {
  loadList()
})

onMounted(() => {
  loadList()
})

async function loadList() {
  loadingList.value = true
  const list = await databases.listDocuments(databaseId, collections.prompts)
  loadingList.value = false
  prompts.value = list.documents
}
</script>

<style scoped></style>

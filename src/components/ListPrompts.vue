<template>
  <icon-spinner class="animate-spin w-8 m-auto" v-if="loadingList && !prompts.length" />
  <ul v-else class="border border-gray-900">
    <li
      class="px-2 py-3 flex items-center"
      :class="{ 'bg-gray-700 bg-opacity-40': index % 2 === 0 }"
      v-for="(prompt, index) in prompts"
      :key="prompt.$id"
    >
      <div class="grow">{{ prompt.name }}</div>
      <button-icon icon="IconCopy" class="mr-3" color="green" />
      <button-icon icon="IconDelete" color="red" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useClientStore } from '@/stores/client'
import { collectionEvent, useDatabasesStore } from '@/stores/database'
import { onMounted, ref } from 'vue'
import IconSpinner from '@/components/icons/IconSpinner.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

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

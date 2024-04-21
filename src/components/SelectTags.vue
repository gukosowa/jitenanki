<template>
  <ul class="flex gap-4">
    <li
      v-for="tag in items"
      :key="tag.$id"
      @click="toggle(tag.$id)"
      :class="{ 'bg-cyan-700': inToggle(tag.$id), 'bg-gray-700': !inToggle(tag.$id) }"
      class="px-5 text-sm py-1 rounded drop-shadow dark:text-white text-white cursor-pointer select-none"
    >
      {{ tag.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Query } from 'appwrite'
import { collectionEvent, useDatabasesStore } from '~src/stores/database'
import { onMounted, ref, onActivated, onDeactivated } from 'vue'

import { useLoadingStore } from '~src/stores/loading'
import { useClientStore } from '~src/stores/client'

const { databases, databaseId, collections } = useDatabasesStore()

const { client } = useClientStore()
const loading = useLoadingStore()
const items = ref<Models.Document[]>([])

const emit = defineEmits(['change'])

onMounted(() => {
  loadList()
})

let subscribe: (() => void) | null = null
onActivated(() => {
  loadList()
  subscribe = client.subscribe(collectionEvent(collections.tags), function () {
    loadList()
  })
})

onDeactivated(() => {
  subscribe?.()
})

const listToggle = ref<string[]>([])
function toggle(id: string) {
  if (!inToggle(id)) {
    listToggle.value = [...listToggle.value, id]
  } else {
    listToggle.value = listToggle.value.filter((t) => t !== id)
  }

  emit('change', listToggle.value)
}

function inToggle(id: string) {
  return listToggle.value.some((t) => t === id)
}

async function loadList() {
  loading.set('tags')
  const list = await databases.listDocuments(databaseId, collections['tags'], [
    //Query.orderAsc('name'),
  ])
  items.value = list.documents
  loading.finished('tags')
}
</script>

<style scoped></style>

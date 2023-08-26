<template>
  <icon-spinner class="animate-spin w-8 m-auto" v-if="loading.is('prompts') && !prompts.length" />
  <ul v-else class="border border-gray-900">
    <li
      class="px-2 py-3 flex items-center"
      :class="{ 'bg-gray-700 bg-opacity-40': index % 2 === 0 }"
      v-for="(prompt, index) in computedPrompts"
      :key="prompt.$id"
    >
      <button-icon
        :icon="prompt.favorite ? IconStarFilled : IconStarEmpty"
        transparent
        loading-inline
        :icon-color="prompt.favorite ? '#ffdf00' : 'white'"
        :loading="loading.is('favorite', prompt.$id)"
        icon-class="w-10 h-10 -m-1"
        class="w-10 h-10"
        @click="onFavorite(prompt.$id, prompt.favorite)"
      />

      <div class="pl-3 grow">{{ prompt.name }}</div>
      <div class="text-gray-500 text-right pr-3">
        {{
          // noinspection TypeScriptUnresolvedReference
          formatDate(prompt.$createdAt)
        }}
      </div>
      <button-icon
        icon="IconCopy"
        class="mr-3"
        :loading="loading.is('duplicate', prompt.$id)"
        @click="onDuplicate(prompt)"
        color="green"
      />
      <button-icon
        icon="IconDelete"
        :loading="loading.is('delete', prompt.$id)"
        @click="onDelete(prompt.$id)"
        color="red"
      />
    </li>

    <li
      class="px-2 py-3 bg-gray-700 flex items-center justify-center"
      v-if="computedPrompts.length === 0 && search"
    >
      No search results

      <base-button class="ml-2" @click="onClearSearch">Clear search</base-button>
    </li>

    <li
      class="px-2 py-3 bg-gray-700 flex items-center justify-center"
      v-if="computedPrompts.length === 0 && !search"
    >
      No prompts created
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useClientStore } from '@/stores/client'
import { collectionEvent, removeKeysWithDollarSign, useDatabasesStore } from '@/stores/database'
import { computed, onMounted, ref } from 'vue'
import IconSpinner from '@/components/icons/IconSpinner.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

import IconStarFilled from '@/components/icons/IconStarFilled.vue'
import IconStarEmpty from '@/components/icons/IconStarEmpty.vue'
import { useLoadingStore } from '@/stores/loading'
import { Query } from 'appwrite'
import { formatDate } from '@/utils'
import BaseButton from '@/components/BaseButton.vue'

const { client } = useClientStore()
const { databases, databaseId, collections } = useDatabasesStore()

const loading = useLoadingStore()
const prompts = ref([])

const props = defineProps<{
  search?: string
}>()
const emit = defineEmits(['clearSearch'])

client.subscribe(collectionEvent(collections.prompts), function () {
  loadList()
})

onMounted(() => {
  loadList()
})

const computedPrompts = computed(() => {
  if (!props.search) {
    return prompts.value
  }

  return prompts.value.filter((p) => p.name.toLowerCase().includes(props.search?.toLowerCase()))
})

function onClearSearch() {
  emit('clearSearch')
}

async function onDuplicate(prompt) {
  loading.set('duplicate', prompt.$id)
  await databases.createDocument(
    databaseId,
    collections.prompts,
    'unique()',
    removeKeysWithDollarSign(prompt),
  )
  loading.finished('duplicate', prompt.$id)
}

async function onFavorite(documentId, currentFavorite) {
  loading.set('favorite', documentId)
  const response = await databases.updateDocument(databaseId, collections.prompts, documentId, {
    favorite: !currentFavorite,
  })

  const prompt = prompts.value.find((p) => p.$id === documentId)
  prompt.favorite = response.favorite
  loading.finished('favorite', documentId)
}

async function onDelete(documentId) {
  loading.set('delete', documentId)
  await databases.deleteDocument(databaseId, collections.prompts, documentId)
  loading.finished('delete', documentId)
}

async function loadList() {
  loading.set('prompts')
  const list = await databases.listDocuments(databaseId, collections.prompts, [
    Query.orderDesc('favorite'),
    Query.orderAsc('name'),
  ])
  prompts.value = list.documents
  loading.finished('prompts')
}
</script>

<style scoped></style>

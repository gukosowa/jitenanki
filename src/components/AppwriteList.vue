<template>
  <icon-spinner
    class="animate-spin w-8 m-auto"
    v-if="loading.is(collectionName) && !items.length"
  />
  <ul v-else class="border border-gray-900">
    <li
      class="px-2 py-3 flex items-center"
      :class="{ 'bg-gray-700 bg-opacity-40': index % 2 === 0 }"
      v-for="(item, index) in computedItems"
      :key="item.$id"
    >
      <slot name="before-item" :item="item"></slot>

      <div class="pl-3 grow">{{ item.name }}</div>
      <div class="text-gray-500 text-right pr-3">
        {{
          // noinspection TypeScriptUnresolvedReference
          formatDate(item.$createdAt)
        }}
      </div>
      <button-icon
        icon="IconCopy"
        class="mr-3"
        :loading="loading.is('duplicate', item.$id)"
        @click="onDuplicate(item)"
        color="green"
      />
      <button-icon
        icon="IconDelete"
        :loading="loading.is('delete', item.$id)"
        @click="onDelete(item.$id)"
        color="red"
      />
    </li>

    <li
      class="px-2 py-3 bg-gray-700 flex items-center justify-center"
      v-if="computedItems.length === 0 && search"
    >
      No search results

      <base-button class="ml-2" @click="onClearSearch">Clear search</base-button>
    </li>

    <li
      class="px-2 py-3 bg-gray-700 flex items-center justify-center"
      v-if="computedItems.length === 0 && !search"
    >
      No {{ collectionName }} created
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useClientStore } from '@/stores/client'
import { collectionEvent, removeKeysWithDollarSign, useDatabasesStore } from '@/stores/database'
import { computed, inject, onActivated, onDeactivated, onMounted, ref } from 'vue'
import IconSpinner from '@/components/icons/IconSpinner.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

import { useLoadingStore } from '@/stores/loading'
import { Query } from 'appwrite'
import { formatDate } from '@/utils'
import BaseButton from '@/components/BaseButton.vue'

const { client } = useClientStore()
const { databases, databaseId, collections } = useDatabasesStore()

const loading = useLoadingStore()
const items = ref([])

const props = defineProps<{
  search?: string
  collectionName: string
}>()
const emit = defineEmits(['clearSearch'])

let subscribe = null
onActivated(() => {
  loadList()
  subscribe = client.subscribe(collectionEvent(collections[props.collectionName]), function () {
    loadList()
  })
})

onDeactivated(() => {
  subscribe?.()
})

const appwriteListQuery = inject('appwriteListQuery-' + collections[props.collectionName], null) as
  | string[]
  | null

const appwriteListQueryCustomFilter = inject(
  'appwriteListQueryCustomFilter-' + collections[props.collectionName],
  null,
) as <T>(T) => T
const appwriteListQueryCustomFilterItems = ref(
  inject('appwriteListQueryCustomFilterItems-' + collections[props.collectionName], null) as any,
)

onMounted(() => {
  loadList()
})

const computedItems = computed(() => {
  if (!props.search?.trim()) {
    return items.value
  }

  let filteredItems = items.value

  if (appwriteListQueryCustomFilter !== null) {
    filteredItems = appwriteListQueryCustomFilter(filteredItems)
  }

  console.log({ items: items.value, filteredItems, appwriteListQueryCustomFilterItems })

  return filteredItems.filter((p) => p.name.toLowerCase().includes(props.search?.toLowerCase()))
})

function onClearSearch() {
  emit('clearSearch')
}

async function onDuplicate(item) {
  loading.set('duplicate', item.$id)
  await databases.createDocument(
    databaseId,
    collections[props.collectionName],
    'unique()',
    removeKeysWithDollarSign(item),
  )
  loading.finished('duplicate', item.$id)
}

async function onDelete(documentId) {
  loading.set('delete', documentId)
  await databases.deleteDocument(databaseId, collections[props.collectionName], documentId)
  loading.finished('delete', documentId)
}

async function loadList() {
  loading.set(props.collectionName)
  const list = await databases.listDocuments(
    databaseId,
    collections[props.collectionName],
    appwriteListQuery ?? [Query.orderAsc('name')],
  )
  items.value = list.documents
  loading.finished(props.collectionName)
}
</script>

<style scoped></style>

<template>
  <BaseForm
    v-model="formData"
    :inputs="[{ label: 'Name', type: 'text', placeholder: 'Name' }]"
  ></BaseForm>
  <appwrite-list-view collection-name="prompts">
    <template #before-item="{ item }: { item: Models.Document }">
      <button-icon
        :icon="item.favorite ? IconStarFilled : IconStarEmpty"
        transparent
        loading-inline
        :icon-color="item.favorite ? '#ffdf00' : 'white'"
        :loading="loading.is('favorite', item.$id)"
        icon-class="w-10 h-10 -m-1"
        class="w-10 h-10"
        @click="onFavorite(item.$id, item.favorite)"
      />
    </template>

    <template #before-list>
      <section class="my-2">
        <header class="ml-2 font-bold">Filter tags</header>

        <select-tags @change="(selected) => (filteredTags = selected)"></select-tags>
      </section>
    </template>
  </appwrite-list-view>
  <appwrite-list-view collection-name="tags" class="mt-10"></appwrite-list-view>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { databaseId, useDatabasesStore } from '~src/stores/database'
import { useLoadingStore } from '~src/stores/loading'
import AppwriteListView from '~src/views/AppwriteListView.vue'
import IconStarFilled from '~src/components/icons/IconStarFilled.vue'
import IconStarEmpty from '~src/components/icons/IconStarEmpty.vue'
import ButtonIcon from '~src/components/ButtonIcon.vue'
import BaseForm from '~src/components/BaseForm.vue'
import { Query, type Models } from 'appwrite'
import SelectTags from '~src/components/SelectTags.vue'

const { collections } = useDatabasesStore()
const { databases } = useDatabasesStore()
const loading = useLoadingStore()

const filteredTags = ref<string[]>([])

const formData = ref({ name: '' })

provide('appwriteListQuery-' + collections.prompts, [
  //Query.orderDesc('favorite'),
  //Query.orderAsc('name'),
])

provide('appwriteListQueryCustomFilter-' + collections.prompts, (items: Models.Document[]) => {
  if (filteredTags.value.length === 0) {
    return items
  }
  return items.filter((item: Models.Document) =>
    item.tags.some((tag: Models.Document) => filteredTags.value.includes(tag.$id)),
  )
})
provide('appwriteListQueryCustomFilterItems-' + collections.prompts, filteredTags)
async function onFavorite(documentId: string, currentFavorite: boolean) {
  loading.set('favorite', documentId)
  await databases.updateDocument(databaseId, collections.prompts, documentId, {
    favorite: !currentFavorite,
  })
  loading.finished('favorite', documentId)
}
</script>

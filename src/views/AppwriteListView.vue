<template>
  <section>
    <section class="flex gap-4">
      <div class="grow flex gap-4">
        <input-text
          class="grow"
          label="Search"
          clearable
          v-model="search"
          @keydown.enter="onCreate"
        />
      </div>
      <div class="flex gap-4">
        <input-text
          class="grow"
          :label="`Create ${collectionName}`"
          v-model="name"
          @keydown.enter="onCreate"
        />
        <base-button :loading="loading.is(`create-${collectionName}`)" @click="onCreate"
          >Create</base-button
        >
      </div>
    </section>

    <slot name="before-list"></slot>

    <section class="my-5">
      <AppwriteList :collectionName="collectionName" @clear-search="search = ''" :search="search">
        <template
          v-for="[slotName, slotProps] of Object.entries($slots)"
          :key="slotName"
          v-slot:[slotName]="/* eslint-disable */ slotProps /* eslint-enable */"
        >
          <slot :name="slotName" v-bind="slotProps"></slot>
        </template>
      </AppwriteList>
    </section>
  </section>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { useDatabasesStore } from '@/stores/database'
import { useToastStore } from '@/stores/toastStore'
import { useLoadingStore } from '@/stores/loading'
import AppwriteList from '@/components/AppwriteList.vue'

const props = defineProps<{
  collectionName: keyof typeof collections
}>()

let name = ref('')
let search = ref('')

const { createDocument, collections } = useDatabasesStore()
const toast = useToastStore()
const loading = useLoadingStore()

async function onCreate() {
  if (!name.value) {
    toast.error('Fill name')
    return
  }

  loading.set(`create-${props.collectionName}`)

  await createDocument(collections[props.collectionName], {
    name: name.value,
  })
    .then(async () => {
      toast.add(`Added "${name.value}"`)
    })
    .catch(async (error) => {
      toast.error(error)
    })

  loading.finished(`create-${props.collectionName}`)

  search.value = name.value
  name.value = ''
}
</script>

<template>
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
      <input-text class="grow" label="Create Prompt" v-model="name" @keydown.enter="onCreate" />
      <base-button :loading="loading.is('create-prompt')" @click="onCreate">Create</base-button>
    </div>
  </section>

  <section class="my-5">
    <ListPrompts @clear-search="search = ''" :search="search" />
  </section>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { PromptAttributes, useDatabasesStore } from '@/stores/database'
import { useToastStore } from '@/stores/toastStore'
import ListPrompts from '@/components/ListPrompts.vue'
import { useLoadingStore } from '@/stores/loading'

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

  loading.set('create-prompt')

  await createDocument(collections.prompts, {
    name: name.value,
  } as PromptAttributes)
    .then(async () => {
      toast.add(`Added "${name.value}"`)
    })
    .catch(async (error) => {
      toast.error(error)
    })

  loading.finished('create-prompt')

  search.value = name.value
  name.value = ''
}
</script>

<template>
  <section class="flex gap-4">
    <input-text class="grow" label="Prompt Name" v-model="name" />

    <base-button :loading="loadingCreate" @click="onCreate">Create</base-button>
  </section>

  <section class="my-5">
    <ListPrompts />
  </section>
</template>

<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { PromptAttributes, useDatabasesStore } from '@/stores/database'
import { useToastStore } from '@/stores/toastStore'
import ListPrompts from '@/components/ListPrompts.vue'

let name = ref('')
const loadingCreate = ref(false)

const { createDocument, collections } = useDatabasesStore()
const toast = useToastStore()

async function onCreate() {
  if (!name.value) {
    toast.error('Fill name')
    return
  }

  loadingCreate.value = true

  await createDocument(collections.prompts, {
    name: name.value,
  } as PromptAttributes)
    .then(async () => {
      toast.add(`Added "${name.value}"`)
    })
    .catch(async (error) => {
      toast.error(error)
    })

  loadingCreate.value = false
}
</script>

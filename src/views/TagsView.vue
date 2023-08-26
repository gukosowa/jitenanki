<template>
  <appwrite-list-view collection-name="tags"></appwrite-list-view>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useDatabasesStore } from '@/stores/database'
import AppwriteListView from '@/views/AppwriteListView.vue'
import { Query } from 'appwrite'

const { collections } = useDatabasesStore()

provide('appwriteListQuery-' + collections.prompts, [
  Query.orderDesc('favorite'),
  Query.orderAsc('name'),
])
</script>

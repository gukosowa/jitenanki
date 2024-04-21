import { defineStore } from 'pinia'
import { Client, Databases, ID } from 'appwrite'
import { useClientStore } from '~src/stores/client'
import appwriteJson from 'root/appwrite.json'
import type { Models } from 'appwrite'

function idFromName(array: any[], name: string): string {
  return array.find((entry) => entry.name === name)?.$id as string
}

export const databaseId = idFromName(appwriteJson.databases, 'promptr')

export const collections = {
  prompts: idFromName(appwriteJson.collections, 'prompts'),
  models: idFromName(appwriteJson.collections, 'models'),
  variables: idFromName(appwriteJson.collections, 'variables'),
  links: idFromName(appwriteJson.collections, 'links'),
  scrapes: idFromName(appwriteJson.collections, 'scrapes'),
  tags: idFromName(appwriteJson.collections, 'tags'),
}

export type PromptAttributes = {
  name: string
  text: string
  copied: string
  favorite: string
}

export const removeKeysWithDollarSign = (obj: any) => {
  const clone = JSON.parse(JSON.stringify(obj))
  for (const key in clone) {
    if (key.startsWith('$')) {
      delete clone[key]
    }
  }
  return clone
}

export function collectionEvent(collection: string): string {
  return `databases.${databaseId}.collections.${collection}.documents`
}

export const useDatabasesStore = defineStore('databases', () => {
  const client = useClientStore().client as Client

  const databases = new Databases(client)

  function createDocument(
    collectionId: string,
    data: Omit<Document, keyof Models.Document>,
    documentId?: string,
    permissions?: string[],
  ) {
    return databases.createDocument(
      databaseId,
      collectionId,
      documentId ?? ID.unique(),
      data,
      permissions,
    )
  }

  return {
    databases,
    databaseId,
    collections,
    createDocument,
  }
})

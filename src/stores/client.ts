import { defineStore } from 'pinia'
import { Client } from 'appwrite'

const appwriteEndpoint = 'http://localhost:88/v1'
const appwriteProject = '64d930ccc397a997a9d7'

export const useClientStore = defineStore('client', () => {
  const client = new Client()
  client.setEndpoint(appwriteEndpoint).setProject(appwriteProject).setLocale('de_AT')

  function subscribe() {
    client.subscribe('*', (response) => {
      // Callback will be executed on all account events.
      console.log('s', response)
    })

    client.subscribe('account', (response) => {
      // Callback will be executed on all account events.
      console.log('Subscribed', response)

      if (response.events.includes('users.*.sessions.*.create')) {
        console.log('createcreatecreate', response)
      }

      if (response.events.includes('users.*.sessions.*.delete')) {
        console.log('deletedeletedelete', response)
      }
    })
  }

  subscribe()

  return { client }
})

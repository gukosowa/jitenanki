import { defineStore } from 'pinia'
import { Client } from 'appwrite'

const credentials = {
  local: {
    endpoint: 'http://localhost:88/v1',
    project: '64d930ccc397a997a9d7',
  },

  cloud: {
    endpoint: 'https://cloud.appwrite.io/v1',
    project: '64c652976de88985cf9f',
  },
}

const useCredential: keyof typeof credentials = 'local'
export const appwriteBackend = credentials[useCredential]

export const useClientStore = defineStore('client', () => {
  const client = new Client()
  client
    .setEndpoint(window.location.origin + '/v1')
    // .setEndpoint(appwriteBackend.endpoint)
    .setProject(appwriteBackend.project)
    .setLocale('de_AT')

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

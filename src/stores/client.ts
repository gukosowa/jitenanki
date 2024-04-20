import { defineStore } from 'pinia'
import { Client } from 'appwrite'

const credentials = {
  cloud: {
    endpoint: 'https://cloud.appwrite.io/v1',
    project: '66196a8c1742a56aed1e',
  },
}

const useCredential: keyof typeof credentials = 'cloud'
export const appwriteBackend = credentials[useCredential]

export const useClientStore = defineStore('client', () => {
  const client = new Client()
  client
    // .setEndpoint(window.location.origin + '/v1')
    .setEndpoint(appwriteBackend.endpoint)
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

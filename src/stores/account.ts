import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Account, Client, ID, type Models } from 'appwrite'
import { useClientStore } from '@/stores/client'

export const useAccountStore = defineStore('account', () => {
  const client = useClientStore().client as Client
  const account = ref(new Account(client))
  const isLogged = ref(false)
  const user = ref<null | Models.User<Models.Preferences>>(null)

  currentSession().then((session) => {
    console.log(session !== null ? 'logged in' : 'logged out')
  })

  async function currentSession(): Promise<Models.User<Models.Preferences> | null> {
    return account.value
      .get()
      .then((session) => {
        user.value = session
        isLogged.value = true
        return session
      })
      .catch(async () => {
        user.value = null
        isLogged.value = false
        return null
      })
  }

  async function login(email: string, password: string): Promise<boolean> {
    const promise = account.value.createEmailSession(email, password)

    return promise.then(
      function (response) {
        updateSession()
        console.log({ response }) // Success
        return true
      },
      function (error) {
        console.log({ error }) // Failure
        return false
      },
    )
  }

  async function register(email: string, password: string) {
    const promise = account.value.create(ID.unique(), email, password)

    return promise.then(
      async function (response) {
        await login(email, password)
        console.log({ response }) // Success

        return true
      },
      function (error) {
        console.log({ error }) // Failure

        return false
      },
    )
  }

  async function logout() {
    await account.value.deleteSession('current')
    updateSession()
  }

  function updateSession() {
    currentSession().then(() => 'account session store updated')
  }

  return {
    account,
    isLogged,
    login,
    logout,
    register,
    user,
    currentSession,
  }
})

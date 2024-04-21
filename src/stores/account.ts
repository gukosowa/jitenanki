import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Account, Client, ID, type Models } from 'appwrite'
import { useClientStore } from '~src/stores/client'

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

  async function login(email: string, password: string) {
    return account.value.createEmailPasswordSession(email, password).then(() => updateSession())
  }

  async function register(email: string, password: string) {
    return account.value.create(ID.unique(), email, password).then(async () => {
      await login(email, password)
    })
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

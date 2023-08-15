import { Account, Client } from 'appwrite'

const appwriteEndpoint = 'http://localhost:88/v1'
const appwriteProject = '64d930ccc397a997a9d7'

export function client() {
  const client = new Client()
  client.setEndpoint(appwriteEndpoint).setProject(appwriteProject)
  const account = new Account(client)

  return { client, account }
}

export function sessionUser() {
  return client().account.get()
}

// @ts-ignore
window.appwrite = client()

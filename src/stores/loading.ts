import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const loading = ref<string[]>([])

  function keyValue(key: string, id?: number | boolean | string) {
    return key + (id ? '-' + id : '')
  }

  const set = (key: string, id?: number | boolean | string) => {
    loading.value.push(keyValue(key, id))
  }

  const is = (key: string, id?: number | boolean | string) => {
    return loading.value.includes(keyValue(key, id))
  }

  const any = () => {
    return loading.value.length > 0
  }

  const finished = (key: string, id?: number | boolean | string) => {
    const index = loading.value.indexOf(keyValue(key, id))
    if (index !== -1) {
      loading.value.splice(index, 1)
    }
  }

  return { loading, set, is, any, finished }
})

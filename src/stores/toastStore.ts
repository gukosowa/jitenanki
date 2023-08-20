import { defineStore } from 'pinia'
import { uuid } from '@/utils'

interface Toast {
  id: string
  message: string
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS'
}

export const useToastStore = defineStore({
  id: 'toastStore',

  state: () => ({
    toasts: [] as Toast[],
  }),

  actions: {
    add(message: string, type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' = 'INFO') {
      const toast: Toast = {
        id: uuid(),
        message,
        type,
      }

      this.toasts.push(toast)

      setTimeout(() => {
        this.remove(toast.id)
      }, 3_000)
    },

    error(error: string | Error) {
      this.add(typeof error === 'string' ? error : error.message, 'ERROR')
    },

    remove(id: string) {
      const index = this.toasts.findIndex((toast) => toast.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    },
  },
})

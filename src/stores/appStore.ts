import { defineStore } from 'pinia'

export const useAppStore = defineStore({
  id: 'app',

  state: () => ({
    darkMode: JSON.parse(localStorage.getItem('darkMode') || 'false'),
  }),

  actions: {
    setDarkMode(value: boolean) {
      this.darkMode = value
      localStorage.setItem('darkMode', JSON.stringify(value))
    },
  },
})

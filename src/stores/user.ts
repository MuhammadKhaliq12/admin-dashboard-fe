import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User>({
    id: '',
    name: '',
    email: '',
    avatar: ''
  })

  function setUser(userDetails: User) {
    user.value = userDetails
  }

  return { user, setUser }
})
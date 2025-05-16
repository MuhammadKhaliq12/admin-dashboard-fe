
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from './components/layout/Sidebar.vue'
import Header from './components/layout/Header.vue'
import { useUserStore } from './stores/user'

const userStore = useUserStore()
const isSidebarOpen = ref(true)
const isMobile = ref(false)
const profileImageUrl = '/profileImg.jpg'


const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  
  // Initialize user data (in a real app, this would be from auth)
  userStore.setUser({
    id: '1',
    name: 'Test Admin',
    email: 'admin@example.com',
    avatar: profileImageUrl,
  })
})
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar 
      :isOpen="isSidebarOpen" 
      :isMobile="isMobile"
      @close="isSidebarOpen = false" 
    />
    
    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <Header 
        @toggle-sidebar="toggleSidebar" 
        :isSidebarOpen="isSidebarOpen"
      />
      
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <router-view v-slot="{ Component }">
          <transition name="page-transition" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
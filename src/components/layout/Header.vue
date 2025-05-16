<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'

defineProps<{
  isSidebarOpen: boolean
}>()

defineEmits(['toggle-sidebar'])

const userStore = useUserStore()
const isUserMenuOpen = ref(false)

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}
</script>

<template>
  <header class="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6">
    <!-- Left side: hamburger and search -->
    <div class="flex items-center">
      <button 
        @click="$emit('toggle-sidebar')"
        class="p-1 mr-4 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
      >
        <svg v-if="isSidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      <!-- Search (visible on larger screens) -->
      <div class="relative hidden md:block">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          type="text" 
          placeholder="Search..."
          class="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
    
    <!-- Right side: user menu and notifications -->
    <div class="flex items-center space-x-3">
      <!-- Notifications -->
      <button class="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-error-500"></span>
      </button>
      
      <!-- User menu -->
      <div class="relative" @click.outside="closeUserMenu">
        <button 
          @click="toggleUserMenu"
          class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <img 
            :src="userStore.user.avatar" 
            alt="User Avatar" 
            class="h-8 w-8 rounded-full object-cover"
          />
          <span class="hidden md:block text-sm font-medium">{{ userStore.user.name }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <div 
          v-if="isUserMenuOpen"
          class="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-dropdown z-20"
        >
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
          <div class="border-t border-gray-200 my-1"></div>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
        </div>
      </div>
    </div>
  </header>
</template>
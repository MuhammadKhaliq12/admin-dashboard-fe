<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'

const props = defineProps<{
  isOpen: boolean
  isMobile: boolean
}>()

const emit = defineEmits(['close'])
const route = useRoute()
const userStore = useUserStore()

const user = computed(() => userStore.user)

const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm10-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5z'
  },
  {
    name: 'Revenue Analysis',
    path: '/revenue',
    icon: 'M8 13.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm0-5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-2zm0-5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2z'
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: 'M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5zm0 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H5zm6-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5zm0 8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z'
  },
  {
    name: 'Product Registration',
    path: '/product-registration',
    icon: 'M8 0c-.176 0-.35.006-.523.017l.064.998a7.117 7.117 0 0 1 .918 0l.064-.998A8.113 8.113 0 0 0 8 0zM6.44.152c-.346.069-.684.16-1.012.27l.321.948c.287-.098.582-.177.884-.237L6.44.153zm4.132.271a7.946 7.946 0 0 0-1.011-.27l-.194.98c.302.06.597.14.884.237l.321-.947zm1.873.925a8 8 0 0 0-.906-.524l-.443.896c.275.136.54.29.793.459l.556-.831zM4.46.824c-.314.155-.616.33-.905.524l.556.83a7.07 7.07 0 0 1 .793-.458L4.46.824zM2.725 1.985c-.262.23-.51.478-.74.74l.752.66c.202-.23.418-.446.648-.648l-.66-.752zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-12.667.83c.23.262.478.51.74.74l.66-.752a7.047 7.047 0 0 1-.648-.648l-.752.66zm11.29.74c.262-.23.51-.478.74-.74l-.752-.66c-.201.23-.418.447-.648.648l.66.752zm-1.735 1.161c.314-.155.616-.33.905-.524l-.556-.83a7.07 7.07 0 0 1-.793.458l.443.896zm-7.985-.524c.289.194.591.37.906.524l.443-.896a6.998 6.998 0 0 1-.793-.459l-.556.831zm1.873.925c.328.112.666.202 1.011.27l.194-.98a6.953 6.953 0 0 1-.884-.237l-.321.947zm4.132.271a7.944 7.944 0 0 0 1.012-.27l-.321-.948a6.954 6.954 0 0 1-.884.237l.194.98zm-2.083.135a8.1 8.1 0 0 0 1.046 0l-.064-.998a7.11 7.11 0 0 1-.918 0l-.064.998zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z'
  }
]

// Close sidebar when clicking outside on mobile
const handleOutsideClick = () => {
  if (props.isMobile) {
    emit('close')
  }
}
</script>


<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
    isOpen ? 'translate-x-0' : '-translate-x-full',
    'md:relative md:translate-x-0'
  ]">
    <!-- Brand Logo -->
    <div class="flex items-center justify-between h-16 px-4 border-b">
      <div class="flex items-center">
        <div class="w-10 h-10 flex items-center justify-center bg-primary-500 text-white rounded">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <span class="ml-2 text-lg font-semibold text-gray-800">Admin Dashboard</span>
      </div>

      <!-- Close button (mobile only) -->
      <button v-if="isMobile" @click="emit('close')" class="text-gray-500 hover:text-gray-700 focus:outline-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- User Info -->
    <div class="px-4 py-4 border-b">
      <div class="flex items-center">
        <img :src="user.avatar" alt="User Avatar" class="w-10 h-10 rounded-full object-cover" />
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
          <p class="text-xs text-gray-600">Administrator</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="px-4 py-4">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.path">
          <router-link :to="item.path" :class="[
            'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
            route.path === item.path
              ? 'bg-primary-50 text-primary-600'
              : 'text-gray-700 hover:bg-gray-100'
          ]">
            <svg class="mr-3 h-5 w-5" :class="route.path === item.path ? 'text-primary-500' : 'text-gray-500'"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path d="item.icon" />
            </svg>
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Backdrop for mobile when sidebar is open -->
    <div v-if="isOpen && isMobile" class="fixed inset-0 bg-gray-900 bg-opacity-50 z-0" @click="handleOutsideClick">
    </div>
  </aside>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useProductStore, productCategories, type Product } from '../stores/products'

const productStore = useProductStore()

// State for inventory updates
const editingProduct = ref<Product | null>(null)
const newInventoryCount = ref(0)

// Filters for inventory table
const filters = reactive({
  search: '',
  category: 'all',
  inventoryStatus: 'all', // all, low, out, normal
  sortBy: 'name',
  sortOrder: 'asc' as 'asc' | 'desc'
})

// Filtered products
const filteredProducts = computed(() => {
  let result = [...productStore.products]
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchLower) || 
      product.description.toLowerCase().includes(searchLower)
    )
  }
  
  // Apply category filter
  if (filters.category !== 'all') {
    result = result.filter(product => product.category === filters.category)
  }
  
  // Apply inventory status filter
  if (filters.inventoryStatus === 'low') {
    result = result.filter(product => 
      product.inventory <= product.alertThreshold && product.inventory > 0
    )
  } else if (filters.inventoryStatus === 'out') {
    result = result.filter(product => product.inventory === 0)
  } else if (filters.inventoryStatus === 'normal') {
    result = result.filter(product => product.inventory > product.alertThreshold)
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let valA, valB
    
    switch (filters.sortBy) {
      case 'name':
        valA = a.name.toLowerCase()
        valB = b.name.toLowerCase()
        break
      case 'category':
        valA = a.category.toLowerCase()
        valB = b.category.toLowerCase()
        break
      case 'price':
        valA = a.price
        valB = b.price
        break
      case 'inventory':
        valA = a.inventory
        valB = b.inventory
        break
      default:
        valA = a.name.toLowerCase()
        valB = b.name.toLowerCase()
    }
    
    if (valA < valB) return filters.sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return filters.sortOrder === 'asc' ? 1 : -1
    return 0
  })
  
  return result
})

// Get inventory status class for a product
const getInventoryStatusClass = (product: Product) => {
  if (product.inventory === 0) {
    return 'bg-error-100 text-error-800'
  } else if (product.inventory <= product.alertThreshold) {
    return 'bg-warning-100 text-warning-800'
  } else {
    return 'bg-success-100 text-success-800'
  }
}

// Get inventory status text for a product
const getInventoryStatusText = (product: Product) => {
  if (product.inventory === 0) {
    return 'Out of Stock'
  } else if (product.inventory <= product.alertThreshold) {
    return 'Low Stock'
  } else {
    return 'In Stock'
  }
}

// Toggle sorting
const toggleSort = (column: string) => {
  if (filters.sortBy === column) {
    filters.sortOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc'
  } else {
    filters.sortBy = column
    filters.sortOrder = 'asc'
  }
}

// Start editing inventory for a product
const startEditInventory = (product: Product) => {
  editingProduct.value = product
  newInventoryCount.value = product.inventory
}

// Cancel editing
const cancelEdit = () => {
  editingProduct.value = null
}

// Save inventory changes
const saveInventoryChanges = () => {
  if (editingProduct.value) {
    productStore.updateInventory(editingProduct.value.id, newInventoryCount.value)
    editingProduct.value = null
  }
}

// Reset all filters
const resetFilters = () => {
  filters.search = ''
  filters.category = 'all'
  filters.inventoryStatus = 'all'
  filters.sortBy = 'name'
  filters.sortOrder = 'asc'
}

// Loading state
const isLoading = ref(true)

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.initializeMockData()
  }
  
  isLoading.value = false
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Inventory Management</h1>
    
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else>
      <!-- Inventory Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Total Products Card -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Products</p>
              <p class="text-xl font-semibold text-gray-800">{{ productStore.totalProducts }}</p>
            </div>
            <div class="p-3 rounded-full bg-primary-50 text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Total Inventory Value Card -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Inventory Value</p>
              <p class="text-xl font-semibold text-gray-800">${{ productStore.totalInventoryValue.toLocaleString() }}</p>
            </div>
            <div class="p-3 rounded-full bg-secondary-50 text-secondary-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Low Stock Products Card -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p class="text-xl font-semibold text-gray-800">{{ productStore.lowStockProducts.length }}</p>
            </div>
            <div class="p-3 rounded-full bg-error-50 text-error-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="dashboard-card mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                id="search" 
                type="text" 
                v-model="filters.search" 
                placeholder="Search by name or description"
                class="input-field pl-10"
              />
            </div>
          </div>
          
          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select id="category" v-model="filters.category" class="input-field">
              <option value="all">All Categories</option>
              <option v-for="category in productCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <!-- Inventory Status Filter -->
          <div>
            <label for="inventoryStatus" class="block text-sm font-medium text-gray-700 mb-1">Inventory Status</label>
            <select id="inventoryStatus" v-model="filters.inventoryStatus" class="input-field">
              <option value="all">All Status</option>
              <option value="normal">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
          
          <!-- Reset Filters Button -->
          <div class="flex items-end">
            <button @click="resetFilters" class="btn-outline w-full">
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      <!-- Inventory Table -->
      <div class="dashboard-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  @click="toggleSort('name')"
                >
                  <div class="flex items-center">
                    Product
                    <svg v-if="filters.sortBy === 'name'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="filters.sortOrder === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
                    </svg>
                  </div>
                </th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  @click="toggleSort('category')"
                >
                  <div class="flex items-center">
                    Category
                    <svg v-if="filters.sortBy === 'category'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="filters.sortOrder === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
                    </svg>
                  </div>
                </th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  @click="toggleSort('price')"
                >
                  <div class="flex items-center">
                    Price
                    <svg v-if="filters.sortBy === 'price'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="filters.sortOrder === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
                    </svg>
                  </div>
                </th>
                <th 
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  @click="toggleSort('inventory')"
                >
                  <div class="flex items-center">
                    Inventory
                    <svg v-if="filters.sortBy === 'inventory'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="filters.sortOrder === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
                    </svg>
                  </div>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in filteredProducts" :key="product.id">
                <!-- Product -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      :src="product.image" 
                      :alt="product.name"
                      class="h-10 w-10 rounded-md object-cover"
                    />
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-xs text-gray-500 max-w-xs truncate">{{ product.description }}</div>
                    </div>
                  </div>
                </td>
                
                <!-- Category -->
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ product.category }}
                </td>
                
                <!-- Price -->
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${{ product.price.toFixed(2) }}
                </td>
                
                <!-- Inventory -->
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <template v-if="editingProduct && editingProduct.id === product.id">
                    <div class="flex items-center">
                      <input 
                        type="number" 
                        v-model="newInventoryCount" 
                        min="0" 
                        class="input-field py-1 px-2 w-20 mr-2"
                      />
                      <button 
                        @click="saveInventoryChanges"
                        class="p-1 text-success-600 hover:text-success-800 mr-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button 
                        @click="cancelEdit"
                        class="p-1 text-error-600 hover:text-error-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </template>
                  <template v-else>
                    {{ product.inventory }} <span class="text-xs text-gray-500">(Min: {{ product.alertThreshold }})</span>
                  </template>
                </td>
                
                <!-- Status -->
                <td class="px-4 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full" 
                    :class="getInventoryStatusClass(product)"
                  >
                    {{ getInventoryStatusText(product) }}
                  </span>
                </td>
                
                <!-- Actions -->
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <template v-if="!(editingProduct && editingProduct.id === product.id)">
                    <button 
                      @click="startEditInventory(product)"
                      class="text-primary-600 hover:text-primary-800 mr-3"
                    >
                      Update Inventory
                    </button>
                  </template>
                </td>
              </tr>
              
              <!-- Empty state -->
              <tr v-if="filteredProducts.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                  <div class="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="text-lg font-medium">No products found</p>
                    <p class="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
                    <button @click="resetFilters" class="btn-primary mt-4">
                      Reset Filters
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
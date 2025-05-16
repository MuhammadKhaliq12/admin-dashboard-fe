<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js'
import { useProductStore } from '../stores/products'
import { useOrderStore } from '../stores/orders'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement)

const productStore = useProductStore()
const orderStore = useOrderStore()

// Chart data for revenue
const revenueChartData = computed(() => {
  return {
    labels: orderStore.monthlyOrdersData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue ($)',
        data: orderStore.monthlyOrdersData.map(item => item.revenue),
        borderColor: '#1976D2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Chart data for orders
const ordersChartData = computed(() => {
  return {
    labels: orderStore.monthlyOrdersData.map(item => item.month),
    datasets: [
      {
        label: 'Orders',
        data: orderStore.monthlyOrdersData.map(item => item.orders),
        backgroundColor: '#26A69A',
        borderRadius: 4
      }
    ]
  }
})

// Chart data for category revenue
const categoryRevenueChartData = computed(() => {
  const categories = Object.keys(orderStore.revenueByCategory)
  const values = Object.values(orderStore.revenueByCategory)
  
  return {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#1976D2', // Primary
          '#26A69A', // Secondary
          '#FF9800', // Accent
          '#4CAF50', // Success
          '#F44336', // Error
          '#9C27B0', // Additional
          '#607D8B'  // Additional
        ]
      }
    ]
  }
})

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Revenue'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Monthly Orders'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    },
    title: {
      display: true,
      text: 'Revenue by Category'
    }
  }
}

// Loading state
const isLoading = ref(true)

onMounted(async () => {
  // Initialize mock data
  await productStore.initializeMockData()
  await orderStore.initializeMockData()
  
  isLoading.value = false
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
    
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else>
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Revenue Card -->
        <div class="dashboard-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-primary-50 text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Revenue</p>
              <p class="text-lg font-semibold text-gray-800">${{ orderStore.totalRevenue.toLocaleString() }}</p>
            </div>
          </div>
          <div class="mt-3 text-xs font-medium text-success-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Up 5.2% from last month</span>
          </div>
        </div>
        
        <!-- Total Orders Card -->
        <div class="dashboard-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-secondary-50 text-secondary-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Orders</p>
              <p class="text-lg font-semibold text-gray-800">{{ orderStore.totalOrders.toLocaleString() }}</p>
            </div>
          </div>
          <div class="mt-3 text-xs font-medium text-success-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Up 3.1% from last month</span>
          </div>
        </div>
        
        <!-- Avg. Order Value Card -->
        <div class="dashboard-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-accent-50 text-accent-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <p class="text-lg font-semibold text-gray-800">${{ orderStore.averageOrderValue.toLocaleString() }}</p>
            </div>
          </div>
          <div class="mt-3 text-xs font-medium text-success-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Up 2.4% from last month</span>
          </div>
        </div>
        
        <!-- Low Stock Card -->
        <div class="dashboard-card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-error-50 text-error-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p class="text-lg font-semibold text-gray-800">{{ productStore.lowStockProducts.length }}</p>
            </div>
          </div>
          <div class="mt-3 text-xs font-medium text-error-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Items need restock</span>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Revenue Line Chart -->
        <div class="dashboard-card lg:col-span-2">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Revenue Trends</h2>
          <div class="h-80">
            <Line :data="revenueChartData" :options="lineChartOptions" />
          </div>
        </div>
        
        <!-- Revenue by Category Chart -->
        <div class="dashboard-card">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Revenue by Category</h2>
          <div class="h-80">
            <Doughnut :data="categoryRevenueChartData" :options="doughnutChartOptions" />
          </div>
        </div>
      </div>
      
      <!-- Orders and Inventory Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Orders Bar Chart -->
        <div class="dashboard-card">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Order History</h2>
          <div class="h-80">
            <Bar :data="ordersChartData" :options="barChartOptions" />
          </div>
        </div>
        
        <!-- Low Stock Items -->
        <div class="dashboard-card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-800">Low Stock Alerts</h2>
            <router-link to="/inventory" class="text-sm text-primary-600 hover:text-primary-700">View All</router-link>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in productStore.lowStockProducts.slice(0, 5)" :key="product.id">
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img :src="product.image" alt="Product" class="h-10 w-10 rounded-md object-cover"/>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                        <div class="text-xs text-gray-500">{{ product.category }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.inventory }}</td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.alertThreshold }}</td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full" 
                      :class="product.inventory === 0 
                              ? 'bg-error-100 text-error-800' 
                              : 'bg-warning-100 text-warning-800'"
                    >
                      {{ product.inventory === 0 ? 'Out of Stock' : 'Low Stock' }}
                    </span>
                  </td>
                </tr>
                
                <!-- If there are no low stock products -->
                <tr v-if="productStore.lowStockProducts.length === 0">
                  <td colspan="4" class="px-4 py-4 text-sm text-gray-500 text-center">No low stock items found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
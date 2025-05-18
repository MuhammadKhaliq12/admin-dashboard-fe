<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js'
import { useProductStore, productCategories } from '../stores/products'
import { useOrderStore } from '../stores/orders'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement)

const productStore = useProductStore()
const orderStore = useOrderStore()

// Filter options
const filters = reactive({
  timeRange: 'monthly', // daily, weekly, monthly, yearly
  category: 'all' // all, or specific categories
})

// Chart data for revenue
const filteredRevenueData = computed(() => {
  if (filters.timeRange === 'daily') {
    return orderStore.dailyOrdersData
  } else {
    return orderStore.monthlyOrdersData
  }
})

// Revenue chart data
const revenueChartData = computed(() => {
  const labels = filteredRevenueData.value.map(item => {
    if (filters.timeRange === 'daily' && 'date' in item) {
      return item.date.split('-').slice(1).join('/')
    } else if ('month' in item) {
      return item.month
    }
    return ''
  })

  const revenueData = filteredRevenueData.value.map(item => item.revenue)

  return {
    labels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenueData,
        borderColor: '#1976D2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Orders chart data
const ordersChartData = computed(() => {
  const labels = filteredRevenueData.value.map(item => {
    if (filters.timeRange === 'daily' && 'date' in item) {
      return item.date.split('-').slice(1).join('/')
    } else if ('month' in item) {
      return item.month
    }
    return ''
  })

  const ordersData = filteredRevenueData.value.map(item => item.orders)

  return {
    labels,
    datasets: [
      {
        label: 'Orders',
        data: ordersData,
        backgroundColor: '#26A69A',
        borderRadius: 4
      }
    ]
  }
})

// Revenue by category chart data
const categoryRevenueChartData = computed(() => {
  const revenueByCategory = orderStore.revenueByCategory
  const categories = Object.keys(revenueByCategory)

  // Filter by selected category
  let filteredCategories = categories
  let filteredValues = categories.map(cat => revenueByCategory[cat])

  if (filters.category !== 'all') {
    filteredCategories = categories.filter(cat => cat === filters.category)
    filteredValues = filteredCategories.map(cat => revenueByCategory[cat])
  }

  return {
    labels: filteredCategories,
    datasets: [
      {
        data: filteredValues,
        backgroundColor: [
          '#1976D2',
          '#26A69A',
          '#FF9800',
          '#4CAF50',
          '#F44336',
          '#9C27B0',
          '#607D8B'
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
      text: 'Revenue Trends'
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
      text: 'Order Trends'
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
  if (productStore.products.length === 0) {
    await productStore.initializeMockData()
  }

  if (orderStore.orders.length === 0) {
    await orderStore.initializeMockData()
  }

  isLoading.value = false
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Revenue Analysis</h1>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <div v-else>
      <!-- Revenue Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Total Revenue Card -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Revenue</p>
              <p class="text-xl font-semibold text-gray-800">${{ orderStore.totalRevenue.toLocaleString() }}</p>
            </div>
            <div class="p-3 rounded-full bg-primary-50 text-primary-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Current Month Revenue Card -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Current Month</p>
              <p class="text-xl font-semibold text-gray-800">${{ orderStore.currentMonthRevenue.toLocaleString() }}</p>
            </div>
            <div class="p-3 rounded-full bg-secondary-50 text-secondary-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Average Order Value Card -->
        <div class="dashboard-card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <p class="text-xl font-semibold text-gray-800">${{ orderStore.averageOrderValue.toLocaleString() }}</p>
            </div>
            <div class="p-3 rounded-full bg-accent-50 text-accent-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="dashboard-card mb-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-medium text-gray-800 mb-2">Revenue Analysis</h2>
            <p class="text-sm text-gray-500">Filter revenue data by time period and category</p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Time Range Filter -->
            <div>
              <label for="timeRange" class="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
              <select
                id="timeRange"
                v-model="filters.timeRange"
                class="input-field"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <!-- Category Filter -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                id="category"
                v-model="filters.category"
                class="input-field"
              >
                <option value="all">All Categories</option>
                <option v-for="category in productCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Revenue Line Chart -->
        <div class="dashboard-card lg:col-span-2">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Revenue Trends</h2>
          <div class="h-80">
            <Line :data="revenueChartData" :option="lineChartOptions" />
          </div>
        </div>

        <!-- Revenue by Category Chart -->
        <div class="dashboard-card">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Revenue by Category</h2>
          <div class="h-80">
            <Doughnut :data="categoryRevenueChartData" :option="doughnutChartOptions" />
          </div>
        </div>
      </div>

      <!-- Orders Chart -->
      <div class="dashboard-card">
        <h2 class="text-lg font-medium text-gray-800 mb-4">Order Trends</h2>
        <div class="h-80">
          <Bar :data="ordersChartData" :option="barChartOptions" />
        </div>
      </div>

      <!-- Revenue Breakdown Table -->
      <div class="dashboard-card mt-6">
        <h2 class="text-lg font-medium text-gray-800 mb-4">Revenue Breakdown</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(revenue, category) in orderStore.revenueByCategory" :key="category">
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ category }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${{ revenue.toLocaleString() }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ ((revenue / orderStore.totalRevenue) * 100).toFixed(1) }}%
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${{ orderStore.totalRevenue.toLocaleString() }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

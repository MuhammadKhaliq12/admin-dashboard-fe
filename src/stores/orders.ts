import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { format, subDays, parseISO, isSameDay, isSameMonth, isSameYear, startOfMonth } from 'date-fns'

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: string
  orderDate: string
  shippedDate: string | null
  deliveredDate: string | null
}

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const isLoading = ref(false)
  
  // Generate a random date within the last 180 days
  const randomDate = (daysBack = 180) => {
    const date = subDays(new Date(), Math.floor(Math.random() * daysBack))
    return date.toISOString()
  }
  
  // Mock order data
  const initializeMockData = () => {
    isLoading.value = true
    
    setTimeout(() => {
      // Create 100 sample orders spread across the last 6 months
      const mockOrders: Order[] = []
      
      for (let i = 0; i < 100; i++) {
        const orderDate = randomDate()
        const totalItems = Math.floor(Math.random() * 5) + 1
        const items: OrderItem[] = []
        
        let orderTotal = 0
        
        for (let j = 0; j < totalItems; j++) {
          const price = parseFloat((Math.random() * 200 + 10).toFixed(2))
          const quantity = Math.floor(Math.random() * 3) + 1
          const itemTotal = price * quantity
          orderTotal += itemTotal
          
          items.push({
            productId: `prod-${Math.floor(Math.random() * 1000)}`,
            productName: [
              "Wireless Headphones",
              "Smart Watch",
              "4K TV",
              "Laptop",
              "Phone Case",
              "T-Shirt",
              "Running Shoes",
              "Air Fryer",
              "Cookware Set",
              "Skincare Set",
              "Building Blocks",
              "Wireless Earbuds"
            ][Math.floor(Math.random() * 12)],
            quantity,
            price
          })
        }
        
        // Determine status based on order date
        let status: Order['status'] = 'pending'
        let shippedDate: string | null = null
        let deliveredDate: string | null = null
        
        const daysSinceOrder = Math.floor((new Date().getTime() - new Date(orderDate).getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysSinceOrder > 7) {
          status = 'delivered'
          shippedDate = subDays(new Date(), daysSinceOrder - 2).toISOString()
          deliveredDate = subDays(new Date(), daysSinceOrder - 7).toISOString()
        } else if (daysSinceOrder > 3) {
          status = 'shipped'
          shippedDate = subDays(new Date(), daysSinceOrder - 2).toISOString()
        } else if (daysSinceOrder > 1) {
          status = 'processing'
        } else {
          status = 'pending'
        }
        
        // Randomly cancel some orders (5% chance)
        if (Math.random() < 0.05) {
          status = 'cancelled'
          shippedDate = null
          deliveredDate = null
        }
        
        mockOrders.push({
          id: `ORD-${1000 + i}`,
          customerId: `cust-${Math.floor(Math.random() * 500)}`,
          customerName: [
            "John Smith",
            "Emily Johnson",
            "Michael Williams",
            "Emma Brown",
            "James Jones",
            "Olivia Miller",
            "Robert Davis",
            "Sophia Garcia",
            "William Rodriguez",
            "Ava Martinez"
          ][Math.floor(Math.random() * 10)],
          items,
          total: parseFloat(orderTotal.toFixed(2)),
          status,
          shippingAddress: [
            "123 Main St, New York, NY 10001",
            "456 Oak Ave, Los Angeles, CA 90001",
            "789 Pine Rd, Chicago, IL 60007",
            "321 Cedar Ln, Houston, TX 77001",
            "654 Birch Blvd, Phoenix, AZ 85001"
          ][Math.floor(Math.random() * 5)],
          orderDate,
          shippedDate,
          deliveredDate
        })
      }
      
      // Sort by date (newest first)
      orders.value = mockOrders.sort((a, b) => 
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      )
      
      isLoading.value = false
    }, 800)
  }
  
  // Get daily orders for the last 30 days
  const dailyOrdersData = computed(() => {
    const result: { date: string; orders: number; revenue: number }[] = []
    const now = new Date()
    
    // Create data for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i)
      const formattedDate = format(date, 'yyyy-MM-dd')
      
      // Filter orders for this date
      const dayOrders = orders.value.filter(order => {
        const orderDate = parseISO(order.orderDate)
        return isSameDay(orderDate, date)
      })
      
      // Calculate total orders and revenue for this date
      const totalOrders = dayOrders.length
      const totalRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0)
      
      result.push({
        date: formattedDate,
        orders: totalOrders,
        revenue: parseFloat(totalRevenue.toFixed(2))
      })
    }
    
    return result
  })
  
  // Get monthly orders for the last 12 months
  const monthlyOrdersData = computed(() => {
    const result: { month: string; orders: number; revenue: number }[] = []
    const now = new Date()
    
    // Create data for the last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = format(date, 'MMM yyyy')
      
      // Filter orders for this month
      const monthOrders = orders.value.filter(order => {
        const orderDate = parseISO(order.orderDate)
        return isSameMonth(orderDate, date) && isSameYear(orderDate, date)
      })
      
      // Calculate total orders and revenue for this month
      const totalOrders = monthOrders.length
      const totalRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0)
      
      result.push({
        month: monthName,
        orders: totalOrders,
        revenue: parseFloat(totalRevenue.toFixed(2))
      })
    }
    
    return result
  })
  
  // Get total revenue
  const totalRevenue = computed(() => {
    const total = orders.value.reduce((sum, order) => {
      // Only count completed or in-progress orders
      if (order.status !== 'cancelled') {
        return sum + order.total
      }
      return sum
    }, 0)
    
    return parseFloat(total.toFixed(2))
  })
  
  // Get total orders
  const totalOrders = computed(() => orders.value.length)
  
  // Get total completed orders
  const completedOrders = computed(() => 
    orders.value.filter(order => order.status === 'delivered').length
  )
  
  // Get orders in progress
  const ordersInProgress = computed(() => 
    orders.value.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length
  )
  
  // Get revenue by category
  const revenueByCategory = computed(() => {
    const result: Record<string, number> = {}
    
    orders.value.forEach(order => {
      if (order.status !== 'cancelled') {
        order.items.forEach(item => {
          // Extract category from product name for this example
          let category = "Other"
          
          if (item.productName.includes("Headphones") || item.productName.includes("TV") || 
              item.productName.includes("Laptop") || item.productName.includes("Watch") || 
              item.productName.includes("Earbuds")) {
            category = "Electronics"
          } else if (item.productName.includes("T-Shirt") || item.productName.includes("Shoes")) {
            category = "Clothing"
          } else if (item.productName.includes("Air Fryer") || item.productName.includes("Cookware")) {
            category = "Home & Kitchen"
          } else if (item.productName.includes("Skincare")) {
            category = "Beauty"
          } else if (item.productName.includes("Building Blocks")) {
            category = "Toys & Games"
          }
          
          if (!result[category]) {
            result[category] = 0
          }
          
          result[category] += item.price * item.quantity
        })
      }
    })
    
    // Round values
    Object.keys(result).forEach(key => {
      result[key] = parseFloat(result[key].toFixed(2))
    })
    
    return result
  })
  
  // Get current month revenue
  const currentMonthRevenue = computed(() => {
    const currentMonth = startOfMonth(new Date())
    
    const monthOrders = orders.value.filter(order => {
      const orderDate = parseISO(order.orderDate)
      return isSameMonth(orderDate, currentMonth) && order.status !== 'cancelled'
    })
    
    const total = monthOrders.reduce((sum, order) => sum + order.total, 0)
    return parseFloat(total.toFixed(2))
  })
  
  // Get average order value
  const averageOrderValue = computed(() => {
    const validOrders = orders.value.filter(order => order.status !== 'cancelled')
    if (validOrders.length === 0) return 0
    
    const total = validOrders.reduce((sum, order) => sum + order.total, 0)
    return parseFloat((total / validOrders.length).toFixed(2))
  })
  
  return {
    orders,
    isLoading,
    initializeMockData,
    dailyOrdersData,
    monthlyOrdersData,
    totalRevenue,
    totalOrders,
    completedOrders,
    ordersInProgress,
    revenueByCategory,
    currentMonthRevenue,
    averageOrderValue
  }
})
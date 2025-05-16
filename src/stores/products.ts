import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'vue3-toastify'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inventory: number
  alertThreshold: number
  image: string
  createdAt: string
  updatedAt: string
}

// Categories for filtering
export const productCategories = [
  "Electronics", 
  "Clothing", 
  "Home & Kitchen", 
  "Beauty", 
  "Toys & Games",
  "Sports & Outdoors",
  "Books",
  "Health",
  "Automotive",
  "Grocery"
]

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  
  // Mock initial data
  const initializeMockData = () => {
    isLoading.value = true
    
    setTimeout(() => {
      products.value = [
        // Electronics
        {
          id: uuidv4(),
          name: "Wireless Bluetooth Headphones",
          description: "Premium wireless headphones with noise cancellation",
          price: 129.99,
          category: "Electronics",
          inventory: 45,
          alertThreshold: 10,
          image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2023, 5, 15).toISOString(),
          updatedAt: new Date(2023, 5, 15).toISOString()
        },
        {
          id: uuidv4(),
          name: "Smart Watch Series 5",
          description: "Track your health metrics and stay connected",
          price: 199.99,
          category: "Electronics",
          inventory: 28,
          alertThreshold: 5,
          image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2023, 4, 10).toISOString(),
          updatedAt: new Date(2023, 4, 20).toISOString()
        },
        {
          id: uuidv4(),
          name: "4K Ultra HD Smart TV 55\"",
          description: "Crisp 4K resolution with smart features",
          price: 499.99,
          category: "Electronics",
          inventory: 12,
          alertThreshold: 3,
          image: "https://images.pexels.com/photos/333984/pexels-photo-333984.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2023, 3, 5).toISOString(),
          updatedAt: new Date(2023, 3, 5).toISOString()
        },
        
        // Clothing
        {
          id: uuidv4(),
          name: "Men's Casual Cotton T-Shirt",
          description: "Comfortable cotton t-shirt for everyday wear",
          price: 19.99,
          category: "Clothing",
          inventory: 150,
          alertThreshold: 30,
          image: "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2023, 2, 20).toISOString(),
          updatedAt: new Date(2023, 2, 20).toISOString()
        },
        {
          id: uuidv4(),
          name: "Women's Running Shoes",
          description: "Lightweight and breathable running shoes",
          price: 89.99,
          category: "Clothing",
          inventory: 65,
          alertThreshold: 15,
          image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2023, 1, 15).toISOString(),
          updatedAt: new Date(2023, 1, 15).toISOString()
        },
        
        // Home & Kitchen
        {
          id: uuidv4(),
          name: "Air Fryer 5.5L",
          description: "Healthy cooking with 80% less oil",
          price: 79.99,
          category: "Home & Kitchen",
          inventory: 32,
          alertThreshold: 8,
          image: "https://images.pexels.com/photos/6605309/pexels-photo-6605309.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2023, 0, 10).toISOString(),
          updatedAt: new Date(2023, 0, 10).toISOString()
        },
        {
          id: uuidv4(),
          name: "Non-Stick Cookware Set",
          description: "10-piece set with premium non-stick coating",
          price: 149.99,
          category: "Home & Kitchen",
          inventory: 18,
          alertThreshold: 5,
          image: "https://images.pexels.com/photos/4252139/pexels-photo-4252139.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2022, 11, 5).toISOString(),
          updatedAt: new Date(2022, 11, 5).toISOString()
        },
        
        // Beauty
        {
          id: uuidv4(),
          name: "Premium Skincare Set",
          description: "Complete skincare routine for glowing skin",
          price: 59.99,
          category: "Beauty",
          inventory: 42,
          alertThreshold: 10,
          image: "https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2022, 10, 22).toISOString(),
          updatedAt: new Date(2022, 10, 22).toISOString()
        },
        
        // Toys & Games
        {
          id: uuidv4(),
          name: "Building Blocks Set",
          description: "500-piece creative building blocks",
          price: 29.99,
          category: "Toys & Games",
          inventory: 55,
          alertThreshold: 15,
          image: "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2022, 9, 15).toISOString(),
          updatedAt: new Date(2022, 9, 15).toISOString()
        },
        
        // Low inventory items for alerts testing
        {
          id: uuidv4(),
          name: "Wireless Earbuds",
          description: "True wireless earbuds with charging case",
          price: 49.99,
          category: "Electronics",
          inventory: 2,
          alertThreshold: 5,
          image: "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2022, 8, 1).toISOString(),
          updatedAt: new Date(2022, 8, 1).toISOString()
        },
        {
          id: uuidv4(),
          name: "Organic Facial Cleanser",
          description: "All-natural facial cleanser for sensitive skin",
          price: 22.99,
          category: "Beauty",
          inventory: 4,
          alertThreshold: 10,
          image: "https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=300",
          createdAt: new Date(2022, 7, 12).toISOString(),
          updatedAt: new Date(2022, 7, 12).toISOString()
        }
      ]
      
      isLoading.value = false
    }, 800)
  }
  
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newProduct: Product = {
      id: uuidv4(),
      ...product,
      createdAt: now,
      updatedAt: now
    }
    
    products.value.push(newProduct)
    toast.success('Product added successfully')
    return newProduct
  }
  
  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      toast.success('Product updated successfully')
      return products.value[index]
    }
    return null
  }
  
  const deleteProduct = (id: string) => {
    products.value = products.value.filter(p => p.id !== id)
    toast.success('Product deleted successfully')
  }
  
  const updateInventory = (id: string, quantity: number) => {
    const product = products.value.find(p => p.id === id)
    if (product) {
      product.inventory = quantity
      product.updatedAt = new Date().toISOString()
      toast.success('Inventory updated successfully')
      return product
    }
    return null
  }
  
  // Get products that are low in inventory (below alert threshold)
  const lowStockProducts = computed(() => {
    return products.value.filter(p => p.inventory <= p.alertThreshold)
  })
  
  // Get inventory value by category
  const inventoryValueByCategory = computed(() => {
    const result: Record<string, number> = {}
    
    productCategories.forEach(category => {
      const categoryProducts = products.value.filter(p => p.category === category)
      const value = categoryProducts.reduce((sum, product) => {
        return sum + (product.price * product.inventory)
      }, 0)
      
      result[category] = parseFloat(value.toFixed(2))
    })
    
    return result
  })
  
  // Total inventory value
  const totalInventoryValue = computed(() => {
    const total = products.value.reduce((sum, product) => {
      return sum + (product.price * product.inventory)
    }, 0)
    
    return parseFloat(total.toFixed(2))
  })
  
  // Total number of products
  const totalProducts = computed(() => products.value.length)
  
  // Total units in inventory
  const totalInventoryUnits = computed(() => {
    return products.value.reduce((sum, product) => sum + product.inventory, 0)
  })
  
  return {
    products,
    isLoading,
    initializeMockData,
    addProduct,
    updateProduct,
    deleteProduct,
    updateInventory,
    lowStockProducts,
    inventoryValueByCategory,
    totalInventoryValue,
    totalProducts,
    totalInventoryUnits
  }
})
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useProductStore, productCategories } from '../stores/products'
import { toast } from 'vue3-toastify'

const productStore = useProductStore()

// Form data
const newProduct = reactive({
  name: '',
  description: '',
  price: '',
  category: '',
  inventory: '',
  alertThreshold: '',
  image: ''
})

// File upload
const imagePreviewUrl = ref('')
const imageFile = ref<File | null>(null)
const isUploading = ref(false)

// Form validation
const errors = reactive({
  name: '',
  description: '',
  price: '',
  category: '',
  inventory: '',
  alertThreshold: '',
  image: ''
})

// Validation function
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // Validate name
  if (!newProduct.name.trim()) {
    errors.name = 'Product name is required'
    isValid = false
  } else if (newProduct.name.length < 3) {
    errors.name = 'Product name must be at least 3 characters'
    isValid = false
  }
  
  // Validate description
  if (!newProduct.description.trim()) {
    errors.description = 'Description is required'
    isValid = false
  } else if (newProduct.description.length < 10) {
    errors.description = 'Description must be at least 10 characters'
    isValid = false
  }
  
  // Validate price
  if (!newProduct.price) {
    errors.price = 'Price is required'
    isValid = false
  } else {
    const price = parseFloat(newProduct.price)
    if (isNaN(price) || price <= 0) {
      errors.price = 'Price must be a positive number'
      isValid = false
    }
  }
  
  // Validate category
  if (!newProduct.category) {
    errors.category = 'Category is required'
    isValid = false
  }
  
  // Validate inventory
  if (!newProduct.inventory) {
    errors.inventory = 'Initial inventory is required'
    isValid = false
  } else {
    const inventory = parseInt(newProduct.inventory)
    if (isNaN(inventory) || inventory < 0) {
      errors.inventory = 'Inventory must be a non-negative number'
      isValid = false
    }
  }
  
  // Validate alert threshold
  if (!newProduct.alertThreshold) {
    errors.alertThreshold = 'Alert threshold is required'
    isValid = false
  } else {
    const threshold = parseInt(newProduct.alertThreshold)
    if (isNaN(threshold) || threshold < 0) {
      errors.alertThreshold = 'Threshold must be a non-negative number'
      isValid = false
    }
  }
  
  // Validate image
  if (!newProduct.image && !imageFile.value) {
    errors.image = 'Product image is required'
    isValid = false
  }
  
  return isValid
}

// Handle image selection
const handleImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    imageFile.value = input.files[0]
    
    // Create a preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviewUrl.value = e.target.result as string
      }
    }
    reader.readAsDataURL(input.files[0])
  }
}

// In a real app, this would upload to a server
const uploadImage = async () => {
  // Simulate upload delay
  isUploading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // For demo purposes, we'll use the existing image URL or a placeholder
  if (imageFile.value) {
    // In a real app, this would return the URL from the server
    // For this demo, we'll use a Pexels image
    return 'https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg?auto=compress&cs=tinysrgb&w=300'
  } else if (newProduct.image) {
    return newProduct.image
  }
  
  isUploading.value = false
  return ''
}

// Handle form submission
const submitForm = async () => {
  if (!validateForm()) {
    toast.error('Please fix the form errors')
    return
  }
  
  try {
    // Upload image (in a real app)
    const imageUrl = await uploadImage()
    
    // Add product to store
    productStore.addProduct({
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      inventory: parseInt(newProduct.inventory),
      alertThreshold: parseInt(newProduct.alertThreshold),
      image: imageUrl
    })
    
    // Reset form
    Object.keys(newProduct).forEach(key => {
      newProduct[key as keyof typeof newProduct] = ''
    })
    imagePreviewUrl.value = ''
    imageFile.value = null
    
    toast.success('Product added successfully')
  } catch (error) {
    toast.error('Error adding product')
    console.error(error)
  } finally {
    isUploading.value = false
  }
}

// Reset form
const resetForm = () => {
  Object.keys(newProduct).forEach(key => {
    newProduct[key as keyof typeof newProduct] = ''
  })
  
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  imagePreviewUrl.value = ''
  imageFile.value = null
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Product Registration</h1>
    
    <div class="dashboard-card max-w-4xl mx-auto">
      <h2 class="text-lg font-medium text-gray-800 mb-6">Add New Product</h2>
      
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div>
            <!-- Product Name -->
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
              <input 
                id="name" 
                type="text" 
                v-model="newProduct.name" 
                class="input-field" 
                :class="{'border-error-500 focus:ring-error-500': errors.name}"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-error-600">{{ errors.name }}</p>
            </div>
            
            <!-- Description -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea 
                id="description" 
                v-model="newProduct.description" 
                rows="3" 
                class="input-field" 
                :class="{'border-error-500 focus:ring-error-500': errors.description}"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-xs text-error-600">{{ errors.description }}</p>
            </div>
            
            <!-- Price -->
            <div class="mb-4">
              <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price ($)*</label>
              <input 
                id="price" 
                type="number" 
                step="0.01" 
                min="0" 
                v-model="newProduct.price" 
                class="input-field" 
                :class="{'border-error-500 focus:ring-error-500': errors.price}"
              />
              <p v-if="errors.price" class="mt-1 text-xs text-error-600">{{ errors.price }}</p>
            </div>
            
            <!-- Category -->
            <div class="mb-4">
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select 
                id="category" 
                v-model="newProduct.category" 
                class="input-field" 
                :class="{'border-error-500 focus:ring-error-500': errors.category}"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in productCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <p v-if="errors.category" class="mt-1 text-xs text-error-600">{{ errors.category }}</p>
            </div>
          </div>
          
          <!-- Right Column -->
          <div>
            <!-- Inventory -->
            <div class="mb-4">
              <label for="inventory" class="block text-sm font-medium text-gray-700 mb-1">Initial Inventory*</label>
              <input 
                id="inventory" 
                type="number" 
                min="0" 
                v-model="newProduct.inventory" 
                class="input-field" 
                :class="{'border-error-500 focus:ring-error-500': errors.inventory}"
              />
              <p v-if="errors.inventory" class="mt-1 text-xs text-error-600">{{ errors.inventory }}</p>
            </div>
            
            <!-- Alert Threshold -->
            <div class="mb-4">
              <label for="alertThreshold" class="block text-sm font-medium text-gray-700 mb-1">Alert Threshold*</label>
              <input 
                id="alertThreshold" 
                type="number" 
                min="0" 
                v-model="newProduct.alertThreshold" 
                class="input-field" 
                :class="{'border-error-500 focus:ring-error-500': errors.alertThreshold}"
              />
              <p class="mt-1 text-xs text-gray-500">You'll receive alerts when inventory falls below this level</p>
              <p v-if="errors.alertThreshold" class="mt-1 text-xs text-error-600">{{ errors.alertThreshold }}</p>
            </div>
            
            <!-- Image Upload -->
            <div class="mb-4">
              <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Product Image*</label>
              
              <div 
                class="mt-1 border-2 border-dashed border-gray-300 rounded-md px-6 pt-5 pb-6 flex justify-center"
                :class="{'border-error-500': errors.image}"
              >
                <div class="space-y-1 text-center">
                  <div v-if="imagePreviewUrl" class="mb-3">
                    <img :src="imagePreviewUrl" alt="Preview" class="mx-auto h-32 w-32 object-cover rounded" />
                  </div>
                  <div v-else class="flex justify-center mb-3">
                    <svg 
                      class="mx-auto h-12 w-12 text-gray-400" 
                      stroke="currentColor" 
                      fill="none" 
                      viewBox="0 0 48 48"
                    >
                      <path 
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                      />
                    </svg>
                  </div>
                  
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        class="sr-only" 
                        accept="image/*"
                        @change="handleImageSelect"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <p v-if="errors.image" class="mt-1 text-xs text-error-600">{{ errors.image }}</p>
              
              <!-- Image URL alternative -->
              <div class="mt-3">
                <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">Or enter image URL</label>
                <input 
                  id="imageUrl" 
                  type="text" 
                  v-model="newProduct.image" 
                  placeholder="https://example.com/image.jpg"
                  class="input-field"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Form Buttons -->
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            type="button" 
            @click="resetForm" 
            class="btn-outline"
          >
            Reset
          </button>
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="isUploading"
          >
            <span v-if="isUploading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Add Product</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
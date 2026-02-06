<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ProductService } from '../services/product.service'
import type { Product } from '../types/product'
import CategoryView from './CategoryView.vue'

const products = ref<Product[]>([])

onMounted(async () => {
    const response = await ProductService.getAll()
    products.value = response.data.products
})
</script>

<template>
    <CategoryView />
    <div>
        <h1>Products</h1>
        <div v-for="product in products" :key="product.id">
            <h2>{{ product.name }}</h2>
            <p>{{ product.price }}</p>
        </div>
        {{}}
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ProductService } from '../services/product.service'
import type { Product } from '../types/product'

const products = ref<Product[]>([])

onMounted(async () => {
    const { data } = await ProductService.getAll()
    products.value = data
})
</script>

<template>
    <div>
        <h1>Products</h1>
        <pre>{{ products }}</pre>
    </div>
</template>

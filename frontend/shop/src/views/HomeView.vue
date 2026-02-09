<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ProductService } from '../services/product.service'
import type { Product } from '../types/product'
import type { Category } from '../types/category'
import { CategoryService } from '../services/category.service'

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const selectedCategorySlug = ref<string | null>(null)

const loadCategories = async () => {
    const { data } = await CategoryService.getAll()
    categories.value = data.categories
}
const loadProducts = async () => {
    const response = await ProductService.getAll()
    products.value = response.data.products
}
onMounted(async () => {
    Promise.all([loadCategories(), loadProducts()])
})

const selectCategory = (slug: string | null) => {
    selectedCategorySlug.value = slug
}
const filteredProducts = computed<Product[]>(() => {
    const slug = selectedCategorySlug.value
    if (!slug) return products.value
    return products.value.filter((product) =>
        product.categories.some((category) => category.slug === slug),
    )
})
</script>

<template>
    <div class="categories">
        <button
            :class="{ active: selectedCategorySlug === null }"
            @click="selectCategory(null)"
        >
            Усі
        </button>

        <button
            v-for="category in categories"
            :key="category.id"
            :class="{ active: selectedCategorySlug === category.slug }"
            @click="selectCategory(category.slug)"
        >
            {{ category.name }}
        </button>
    </div>
    <div>
        <h1>Products</h1>
        <div v-for="product in filteredProducts" :key="product.id">
            <h2>{{ product.name }}</h2>
            <p>{{ product.price }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Category } from '../types/product'
import { CategoryService } from '../services/category.service'

const categories = ref<Category[]>([])

onMounted(async () => {
    const response = await CategoryService.getAll()
    categories.value = response.data.categories
})
</script>
<template>
    <div v-for="category in categories" key="category.id">
        <h2>{{ category.name }}</h2>
    </div>
</template>

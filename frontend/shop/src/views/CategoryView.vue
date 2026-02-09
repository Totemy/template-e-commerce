<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Category } from '../types/product'
import { CategoryService } from '../services/category.service'

const categories = ref<Category[]>([])

const emit = defineEmits<{
    (e: 'select', category: Category): void
}>()

onMounted(async () => {
    const response = await CategoryService.getAll()
    categories.value = response.data.categories
})
</script>
<template>
    <div>
        <button
            v-for="category in categories"
            key="category.id"
            @click="emit('select', category)"
        >
            {{ category.name }}
        </button>
    </div>
</template>

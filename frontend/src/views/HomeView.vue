<template>
  <div>
    <h1>Products</h1>
    <pre>{{ products }}</pre>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ProductService } from "../services/product.service";

const products = ref([]);

onMounted(async () => {
  const { data } = await ProductService.getAll();
  products.value = data;
});
</script>

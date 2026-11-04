<script setup>
import BookGrid from '../components/BookGrid.vue'
import { useMyShelf } from '../composables/useMyShelf'

const { savedBooks } = useMyShelf()
</script>

<template>
  <main>
    <h1>My Shelf</h1>
    <p v-if="savedBooks.length === 0">No saved books yet.</p>
    <BookGrid
      v-else
      :books="savedBooks"
      empty-message="No saved books yet."
    />
  </main>
</template>
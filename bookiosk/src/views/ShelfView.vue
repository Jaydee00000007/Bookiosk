<script setup>
import BookCard from '../components/BookCard.vue'
import { useMyShelf } from '../composables/useMyShelf'

const { savedBooks } = useMyShelf()
</script>

<template>
  <main>
    <h1>My Shelf</h1>
    <p v-if="savedBooks.length === 0">No saved books yet.</p>
    <div v-else class="book-grid">
      <BookCard
        v-for="book in savedBooks"
        :key="book.id"
        :book="book"
      />
    </div>
  </main>
</template>
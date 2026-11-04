<script setup>
import BookCard from './BookCard.vue'

defineProps({
  books: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: 'No books found.'
  }
})
</script>

<template>
    

  <section class="book-results" aria-live="polite">
    <p v-if="loading" class="book-state" role="status">Finding books...</p>
    <p v-else-if="books.length === 0" class="book-state">{{ emptyMessage }}</p>
    <div v-else class="book-grid">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
      />
    </div>
  </section>
</template>

<style scoped>
.book-results {
  width: 100%;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

.book-state {
  margin: 1.5rem 0;
  color: #687168;
  text-align: center;
}

@media (min-width: 900px) {
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  }
}
</style>

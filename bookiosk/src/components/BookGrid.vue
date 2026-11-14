<script setup>
import { computed, ref, watch } from 'vue'
import BookCard from './BookCard.vue'

const props = defineProps({
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
  },
  closable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const pageSize = 8
const currentPage = ref(1)
const pageCount = computed(() => Math.ceil(props.books.length / pageSize))
const visibleBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return props.books.slice(start, start + pageSize)
})

watch(() => props.books, () => {
  currentPage.value = 1
})

function changePage(page) {
  currentPage.value = Math.min(Math.max(page, 1), pageCount.value)
}
</script>

<template>
  <section class="book-results" aria-live="polite" :aria-busy="loading">
    <button
      v-if="closable && !loading && books.length > 0"
      class="close-results"
      type="button"
      aria-label="Close book list"
      @click="emit('close')"
    >
      X
    </button>
    <p v-if="loading" class="book-state book-state-loading" role="status">
      <span class="loading-spinner" aria-hidden="true"></span>
      Finding books...
    </p>
    <p v-else-if="books.length === 0" class="book-state">{{ emptyMessage }}</p>
    <div v-else class="book-grid">
      <BookCard
        v-for="book in visibleBooks"
        :key="book.id"
        :book="book"
      />
    </div>
    <nav v-if="!loading && pageCount > 1" class="pagination" aria-label="Book pages">
      <button
        type="button"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <span aria-live="polite">Page {{ currentPage }} of {{ pageCount }}</span>
      <button
        type="button"
        :disabled="currentPage === pageCount"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </section>
</template>

<style scoped>
.book-results {
  position: relative;
  width: 100%;
}

.close-results {
  display: block;
  margin: 0 0 1rem auto;
  padding: 0.4rem 0.6rem;
  border: 2px solid #1938194f;
  border-radius: 50%;
  font-weight: bolder;
  color: #193819;
  background: transparent;
  box-shadow: 0 2px 50px rgba(3, 43, 12, 0.475);
  cursor: pointer;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  color: #193819;
}

.pagination button {
  padding: 0.5rem 0.75rem;
  border: 1px solid #193819;
  border-radius: 8px;
  color: #fff;
  background: #193819;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:focus-visible,
.close-results:focus-visible {
  outline: 3px solid #8dbb91;
  outline-offset: 3px;
}

.book-state {
  margin: 1.5rem 0;
  color: #687168;
  text-align: center;
}

.book-state-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.65rem;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #c9d4c6;
  border-top-color: #193819;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .book-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-spinner {
    animation: none;
  }
}

@media (min-width: 900px) {
  .book-grid {
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  }
}
</style>

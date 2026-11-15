<script setup>
import BookGrid from './BookGrid.vue'
import { useMyShelf } from '../composables/useMyShelf'

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const { savedBooks } = useMyShelf()
</script>

<template>
  <section id="myshelf" class="my-shelf" :aria-busy="loading">
    <header class="top">
      <h2>My Shelf</h2>
      <span
        class="qty-savedbooks"
        :aria-label="`${savedBooks.length} saved ${savedBooks.length === 1 ? 'book' : 'books'}`"
      >
        {{ savedBooks.length }} {{ savedBooks.length === 1 ? 'book' : 'books' }}
      </span>
    </header>

    <div class="shelf-body">
      <p v-if="loading" class="shelf-state" role="status">
        Loading your saved books...
      </p>
      <div v-else-if="savedBooks.length === 0" class="shelf-empty">
        <p class="shelf-state">Books you save will appear here.</p>
        <RouterLink
          class="shelf-browse-link"
          :to="{ name: 'home', hash: '#search' }"
        >
          Start browsing
        </RouterLink>
      </div>
      <BookGrid
        v-else
        class="shelf-grid"
        :books="savedBooks"
        empty-message="No saved books yet."
      />
    </div>
  </section>
</template>

<style scoped>
.my-shelf {
  box-sizing: border-box;
  width: min(82%, 1120px);
  min-width: 0;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.top h2 {
  margin: 0;
  color: #193819;
  font-size: 1.5rem;
  font-family: playfair display, serif;
}

.qty-savedbooks {
  display: grid;
  min-width: 1.5rem;
  min-height: 1.5rem;
  place-items: center;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  color: #193819;
  background: #e8eee5;
  font-size: 0.8rem;
  font-weight: 600;
}

.shelf-body {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 160px;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  border: 1px solid #e4e6dc;
  border-radius: 16px;
  background: #fffefa;
  box-shadow: 0 10px 28px rgb(25 56 25 / 6%);
}

.shelf-state {
  display: grid;
  min-height: 128px;
  margin: 0;
  place-items: center;
  color: #687168;
  text-align: center;
}

.shelf-empty {
  display: flex;
  min-height: 128px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.shelf-empty .shelf-state {
  min-height: 0;
}

.shelf-browse-link {
  padding: 0.55rem 1rem;
  border-radius: 999px;
  color: #fff;
  border: 1px solid #193819;
  background: #193819;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
}

.shelf-browse-link:focus-visible {
  outline: 3px solid #8dbb91;
  outline-offset: 3px;
}

.shelf-grid {
  width: 100%;
}

.shelf-grid :deep(.book-grid) {
  gap: clamp(1rem, 2vw, 1.5rem);
}

.shelf-grid :deep(.book-card) {
  border: 1px solid #e8e9e1;
  background: #fff;
}

@media (max-width: 700px) {
  .my-shelf {
    width: 100%;
  }
}
</style>

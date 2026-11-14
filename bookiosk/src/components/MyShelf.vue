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
        {{ savedBooks.length }} books
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
  width: 70%;
  max-width: 1200px;
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
  font-size: large;
  font-family: playfair display, serif;
}

.qty-savedbooks {
  display: grid;
  min-width: 1.5rem;
  min-height: 1.5rem;
  place-items: center;
  border-radius: 999px;
  background: #f5f2eb;
  font-weight: 50;
  padding: 5px 10px;
  font-size: smaller;
}

.shelf-body {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 160px;
  padding: 1rem;
  border: 1px dashed #a1a8a3;
  border-radius: 10px;
  background-color: #f5f2eb;
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
  padding: 0.4rem 0.5rem;
  border-radius: 999px;
  color:#687168;
  border: 1px solid #687168a9;
  background: #f5f2eb;
  font-weight: 100;
  width: 150px;
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
</style>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import { useMyShelf } from '../composables/useMyShelf'
import { searchBooks } from '../services/googleBooks'

const book = ref(null)
const loading = ref(true)
const error = ref('')
const imageFailed = ref(false)

const volume = computed(() => book.value?.volumeInfo || {})
const title = computed(() => volume.value.title || 'Book of the week')
const cover = computed(() => {
  const image = volume.value.imageLinks?.thumbnail ||
    volume.value.imageLinks?.smallThumbnail

  return image?.replace(/^http:/, 'https:')
})

const { isSaved, toggleBook } = useMyShelf()

watch(cover, () => {
  imageFailed.value = false
})

onMounted(async () => {
  try {
    const books = await searchBooks('African literature', {
      orderBy: 'relevance',
      maxResults: 12
    })
    book.value = books[0] || null
  } catch (err) {
    error.value = err.message || 'Unable to load the book of the week.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="main-content" aria-labelledby="book-of-the-week-title">
    <div class="book-details">
      <span>Book of the week</span>
      <p v-if="loading" role="status">Finding a featured book...</p>
      <p v-else-if="error" role="alert">{{ error }}</p>
      <p v-else-if="!book">No featured book is available right now.</p>
      <template v-else>
        <h2 id="book-of-the-week-title">{{ title }}</h2>
        <p>{{ volume.description || 'Discover this featured title from African literature.' }}</p>
        <div class="book-actions">
          <a
            v-if="volume.previewLink"
            class="read-now-btn"
            :href="volume.previewLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read Preview
          </a>
          <button
            class="add-to-library-btn"
            type="button"
            @click="toggleBook(book)"
          >
            {{ isSaved(book.id) ? 'Remove from Shelf' : 'Add to Library' }}
          </button>
        </div>
      </template>
    </div>
    <div class="book-image">
      <img
        v-if="cover && !imageFailed"
        :src="cover"
        :alt="`Cover of ${title}`"
        loading="lazy"
        @error="imageFailed = true"
      >
      <div v-else-if="book" class="cover-fallback" aria-hidden="true">
        {{ title }}
      </div>
    </div>
  </section>
</template>

<style scoped>

.main-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  box-sizing: border-box;
  width: 70%;
  max-width: 70%;
  min-height: 260px;
  flex-shrink: 0;
  padding: 20px 0px;
  background-color: #f5f2eb;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-details {
 width: 50%;
}

.book-details > span {
  color: #193819;
  font-weight: 700;
  text-transform: uppercase;
}

.book-details h2 {
  margin-bottom: 0.5rem;
}

.book-details p {
  width: 250px;
  max-width: 100%;  
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 0.95rem;
  text-wrap: wrap;
  text-align: justify;
}

.book-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.read-now-btn,
.add-to-library-btn {
  padding: 0.65rem 1rem;
  border: 1px solid #193819;
  border-radius: 6px;
  color: #fff;
  background: #193819;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

.book-image {
  width: 50%;
  min-height: 190px;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.book-image img {
  max-width: 100%;
  max-height: 220px;
  object-fit: contain;
}

.cover-fallback {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 190px;
  padding: 1rem;
  box-sizing: border-box;
  color: #fff;
  text-align: center;
  background: linear-gradient(145deg, #193819, #5c7658);
}

@media (max-width: 600px) {
  .main-content {
    width: 90%;
    padding: 20px;
  }
}
</style>

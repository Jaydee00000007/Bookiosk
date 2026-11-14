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
  <section class="book-of-the-week-content" aria-labelledby="book-of-the-week-title">
    <div class="book-details">
      <span>Book of the week</span>
      <p v-if="loading" role="status">Finding a featured book...</p>
      <p v-else-if="error" role="alert">{{ error }}</p>
      <p v-else-if="!book">No featured book is available right now.</p>
      <template v-else>
        <h2 id="book-of-the-week-title">{{ title }}</h2>
        <p class="bk-text">{{ volume.description || 'Discover this featured title from African literature.' }}</p>
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

.book-of-the-week-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 2rem;
  box-sizing: border-box;
  width: 80%;
  max-width: 70%;
  min-height: 260px;
  flex-shrink: 0;
  padding: 10px 20px;
  background-color: #ffff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.603);
}

.book-details {
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
  padding: 1rem;
}

.book-details > span {
  color: #193819;
  background-color: #d6e6d4;
  font-weight: bolder;
  font-size: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
}

.book-details h2 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
  color: #193819;
  font-family: playfair display, serif;
}

.book-details p {
  width: 100%;
  max-width: 100%;  
  color: #19381977;
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 0.95rem;
  text-wrap: wrap;
  text-align: justify;
}

.book-details p.bk-text {
  max-width: 460px;
  height: 90px;
  overflow: hidden;
  white-space: wrap;
  text-overflow: ellipsis;
}

.book-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.read-now-btn,
.add-to-library-btn {
  padding: 0.45rem 1rem;
  border: 0px solid #193819;
  border-radius: 30px;
  color: #fff;
  background: #193819;
  font: inherit;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
}

.book-image {
  display: grid;
  flex: 0 0 40%;
  box-sizing: border-box;
  width: fit-content;
  height: 100%;
  min-height: 250px;
  place-items: center;
  overflow: hidden;
}

.book-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

@media (max-width: 700px) {
  .book-of-the-week-content {
    flex-direction: column-reverse;
    width: 95%;
    max-width: 90%;
    padding: 20px;
  }

  .book-image {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    min-height: 200px;
  }

  .read-now-btn,
  .add-to-library-btn {
    display: block;
    width: 100%;
    text-align: center;
  }

}
</style>

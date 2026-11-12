<script setup>
import { computed, onMounted, ref } from 'vue'

import { authors } from '../data/collections'
import { searchBooks } from '../services/googleBooks'

const author = authors[0]
const book = ref(null)
const loading = ref(true)
const error = ref('')
const imageFailed = ref(false)

const volume = computed(() => book.value?.volumeInfo || {})
const title = computed(() => volume.value.title || `Books by ${author.name}`)
const cover = computed(() => {
  const image = volume.value.imageLinks?.thumbnail ||
    volume.value.imageLinks?.smallThumbnail

  return image?.replace(/^http:/, 'https:')
})
const exploreLink = computed(() => volume.value.previewLink ||
  `https://books.google.com/books?q=${encodeURIComponent(author.name)}`)

onMounted(async () => {
  try {
    const books = await searchBooks(author.query, {
      orderBy: 'relevance',
      maxResults: 1
    })
    book.value = books[0] || null
  } catch (err) {
    error.value = err.message || 'Unable to load the featured author.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="author-spotlight-content" aria-labelledby="author-spotlight-title">
    <div class="author-image">
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
    <div class="author-details">
      <span>Author spotlight</span>
      <p v-if="loading" role="status">Finding a featured author...</p>
      <p v-else-if="error" role="alert">{{ error }}</p>
      <p v-else-if="!book">No featured author is available right now.</p>
      <div v-else>
        <h2 id="author-spotlight-title">{{ author.name }}</h2>
        <p class="bk-text">
          {{ volume.description || `Explore books by ${author.name}.` }}
        </p>
        <a
          class="explore-author-btn"
          :href="exploreLink"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore her books
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.author-spotlight-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 2rem;
  box-sizing: border-box;
  width: 90%;
  max-width: 70%;
  min-height: 260px;
  flex-shrink: 0;
  padding: 10px 20px;
  margin-top: 40px;
  background-color: #f8eae2;
  border-radius: 15px;
  border: 2px solid #f83a0036;
}

.author-image {
  display: grid;
  flex: 0 0 40%;
  min-height: 220px;
  place-items: center;
  overflow: hidden;
}

.author-image img {
  max-width: 100%;
  max-height: 240px;
  object-fit: contain;
  border-radius: 6px;
}

.author-details {
  flex: 1 1 0;
  min-width: 0;
  box-sizing: border-box;
}

.author-details > span {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  color: #d43200;
  background-color: #f8eae2;
  font-size: 0.5rem;
  font-weight: 700;
  border: 1px solid #f83a00;
}

.author-details h2 {
  margin-bottom: 0.5rem;
  color: #193819;
  font-size: 1.25rem;
}

.author-details p {
  margin-bottom: 1rem;
  color: #193819a8;
  font-size: 0.95rem;
  line-height: 1.5;
}

.author-details p.bk-text {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.explore-author-btn {
  display: inline-block;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #d43200;
  text-decoration: none;
}

.explore-author-btn:focus-visible {
  outline: 3px solid #d87b18;
  outline-offset: 3px;
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
  .author-spotlight-content {
    width: 90%;
    max-width: 90%;
    gap: 1rem;
    padding: 16px;
  }
}
</style>

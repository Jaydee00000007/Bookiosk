<script setup>
import { computed, ref, watch } from 'vue'

import { authors } from '../data/collections'
import { searchBooks } from '../services/googleBooks'

const props = defineProps({
  mostViewedBook: {
    type: Object,
    default: null
  },
  mostViewedBookReady: {
    type: Boolean,
    default: true
  }
})

const fallbackAuthor = authors[0]
const book = ref(null)
const loading = ref(true)
const error = ref('')
const imageFailed = ref(false)
let fallbackRequestId = 0

const volume = computed(() => book.value?.volumeInfo || {})
const title = computed(() => volume.value.title || `Books by ${fallbackAuthor.name}`)
const authorName = computed(() => volume.value.authors?.[0] || fallbackAuthor.name)
const cover = computed(() => {
  const image = volume.value.imageLinks?.thumbnail ||
    volume.value.imageLinks?.smallThumbnail

  return image?.replace(/^http:/, 'https:')
})
const exploreLink = computed(() => volume.value.previewLink ||
  `https://books.google.com/books?q=${encodeURIComponent(authorName.value)}`)
const isMostViewed = computed(() => Boolean(props.mostViewedBook))

watch(cover, () => {
  imageFailed.value = false
})

watch(
  [() => props.mostViewedBook, () => props.mostViewedBookReady],
  async ([mostViewedBook, ready]) => {
    if (mostViewedBook) {
      fallbackRequestId++
      book.value = mostViewedBook
      error.value = ''
      loading.value = false
      return
    }

    if (!ready) {
      loading.value = true
      return
    }

    const requestId = ++fallbackRequestId
    loading.value = true

    try {
      const books = await searchBooks(fallbackAuthor.query, {
        orderBy: 'relevance',
        maxResults: 1
      })

      if (requestId === fallbackRequestId && !props.mostViewedBook) {
        book.value = books[0] || null
      }
    } catch (loadError) {
      if (requestId === fallbackRequestId && !props.mostViewedBook) {
        error.value = loadError.message || 'Unable to load the featured author.'
      }
    } finally {
      if (requestId === fallbackRequestId && !props.mostViewedBook) {
        loading.value = false
      }
    }
  },
  { immediate: true }
)
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
      <span>{{ isMostViewed ? 'Most-viewed author' : 'Author spotlight' }}</span>
      <p v-if="loading" role="status">Finding a featured author...</p>
      <p v-else-if="error" role="alert">{{ error }}</p>
      <p v-else-if="!book">No featured author is available right now.</p>
      <div v-else>
        <h2 id="author-spotlight-title">{{ authorName }}</h2>
        <p class="bk-text">
          {{ isMostViewed
            ? `Readers are discovering ${title}. Explore more by ${authorName}.`
            : `Explore books by ${authorName}.` }}
        </p>
        <a
          class="explore-author-btn"
          :href="exploreLink"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore their books ↗
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
  width: min(82%, 1120px);
  min-height: 230px;
  flex-shrink: 0;
  padding: clamp(1rem, 3vw, 2rem);
  margin-top: 0;
  background-color: #f4f0e7;
  border-radius: 20px;
  border: 1px solid #e8e2d5;
}

.author-image {
  display: grid;
  flex: 0 0 40%;
  min-height: 180px;
  place-items: center;
  overflow: hidden;
}

.author-image img {
  max-width: 100%;
  max-height: 170px;
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
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  color: #625233;
  background-color: #e9e1d1;
  font-size: 0.72rem;
  font-weight: 700;
}

.author-details h2 {
  margin-bottom: 0.5rem;
  color: #193819;
  font-size: 1.25rem;
}

.author-details p {
  margin-bottom: 1rem;
  color: #586258;
  font-size: 0.88rem;
  line-height: 1.5;
}

.author-details p.bk-text {
  max-width: 60ch;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.explore-author-btn {
  display: inline-block;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #193819;
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
    width: 100%;
    gap: 1rem;
    padding: 1.25rem;
  }

  .author-image {
    flex-basis: 35%;
  }

  .author-image img {
    max-height: 150px;
  }
}

@media (max-width: 700px) {
  .author-spotlight-content {
    flex-direction: column;
    align-items: stretch;
  }

  .author-image {
    min-height: 140px;
  }
}
</style>

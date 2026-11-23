<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import BookReader from '../components/BookReader.vue'
import { useMyShelf } from '../composables/useMyShelf'
import { recordBookView } from '../composables/useBookViews'
import { getBookById } from '../services/googleBooks'

const route = useRoute()
const book = ref(null)
const loading = ref(true)
const error = ref('')
const imageFailed = ref(false)
const requestVersion = ref(0)

const volume = computed(() => book.value?.volumeInfo || {})
const title = computed(() => volume.value.title || 'Untitled book')
const authors = computed(() => volume.value.authors?.join(', ') || 'Unknown author')
const cover = computed(() => {
  const image = volume.value.imageLinks?.large ||
    volume.value.imageLinks?.medium ||
    volume.value.imageLinks?.thumbnail ||
    volume.value.imageLinks?.smallThumbnail

  return image?.replace(/^http:/, 'https:')
})
const description = computed(() => {
  const rawDescription = volume.value.description

  return rawDescription
    ? rawDescription.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    : 'A description for this title is not available yet.'
})
const categories = computed(() => volume.value.categories?.slice(0, 3) || [])
const { isSaved, toggleBook } = useMyShelf()

watch(cover, () => {
  imageFailed.value = false
})

watch(
  () => route.params.id,
  async (id) => {
    const requestId = ++requestVersion.value
    book.value = null
    error.value = ''
    loading.value = true

    try {
      const result = await getBookById(id)

      if (requestId === requestVersion.value) {
        book.value = result
        recordBookView(result.id)
      }
    } catch (loadError) {
      if (requestId === requestVersion.value) {
        error.value = loadError.message || 'Unable to load this book.'
      }
    } finally {
      if (requestId === requestVersion.value) {
        loading.value = false
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="book-details-page">
    <NavBar />
    <main class="details-main">
      <div class="details-container">
        <RouterLink class="back-link" :to="{ name: 'home', hash: '#search' }">
          <span aria-hidden="true">←</span> Back to browsing
        </RouterLink>

        <p v-if="loading" class="details-state" role="status">
          <span class="loading-mark" aria-hidden="true"></span>
          Loading book details...
        </p>
        <section v-else-if="error" class="details-state details-error" role="alert">
          <h1>We couldn't load this book</h1>
          <p>{{ error }}</p>
          <RouterLink class="primary-link" :to="{ name: 'home', hash: '#search' }">
            Return to browsing
          </RouterLink>
        </section>
        <div v-else-if="book" class="book-detail-content">
        <section class="book-panel" aria-labelledby="book-title">
          <div class="book-cover">
            <img
              v-if="cover && !imageFailed"
              :src="cover"
              :alt="`Cover of ${title}`"
              @error="imageFailed = true"
            >
            <div v-else class="cover-fallback" aria-hidden="true">
              <span>{{ title }}</span>
            </div>
          </div>

          <div class="book-information">
            <p class="eyebrow">BOOK DETAILS</p>
            <h1 id="book-title">{{ title }}</h1>
            <p class="book-authors">{{ authors }}</p>

            <div v-if="categories.length" class="book-categories" aria-label="Categories">
              <span v-for="category in categories" :key="category">
                {{ category }}
              </span>
            </div>

            <p class="book-description">{{ description }}</p>

            <dl class="book-facts">
              <div v-if="volume.publisher">
                <dt>Publisher</dt>
                <dd>{{ volume.publisher }}</dd>
              </div>
              <div v-if="volume.publishedDate">
                <dt>Published</dt>
                <dd>{{ volume.publishedDate }}</dd>
              </div>
              <div v-if="volume.pageCount">
                <dt>Length</dt>
                <dd>{{ volume.pageCount }} pages</dd>
              </div>
            </dl>

            <div class="book-actions">
              <button
                class="shelf-button"
                type="button"
                :aria-pressed="isSaved(book.id)"
                @click="toggleBook(book)"
              >
                {{ isSaved(book.id) ? 'Remove from My Shelf' : 'Save to My Shelf' }}
              </button>
              <a
                v-if="volume.previewLink"
                class="preview-link"
                :href="volume.previewLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read a preview <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
        <BookReader
          :volume-id="book.id"
          :embeddable="Boolean(book.accessInfo?.embeddable)"
          :preview-link="book.volumeInfo?.previewLink || book.accessInfo?.webReaderLink || ''"
        />
        </div>
        <p v-else class="details-state">No details are available for this book.</p>
      </div>
    </main>
    <SiteFooter class="details-footer" />
  </div>
</template>

<style scoped>
.book-details-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #273127;
  background: #faf9f5;
  font-family: plus jakarta sans, sans-serif;
}

.details-main {
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  padding: clamp(1.5rem, 5vw, 4rem) 1.25rem;
}

.details-container {
  width: min(100%, 1120px);
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #526450;
  font-size: 0.9rem;
  text-decoration: none;
}

.back-link:hover {
  color: #193819;
}

.book-panel {
  display: grid;
  grid-template-columns: minmax(210px, 0.75fr) minmax(0, 1.5fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
  box-sizing: border-box;
  padding: clamp(1.5rem, 5vw, 4rem);
  border: 1px solid #e8e7de;
  border-radius: 22px;
  background: #fffefa;
  box-shadow: 0 18px 48px rgb(25 56 25 / 7%);
}

.book-cover {
  display: grid;
  min-height: 310px;
  place-items: center;
}

.book-cover img {
  display: block;
  max-width: 100%;
  max-height: 440px;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 16px 32px rgb(28 36 26 / 20%);
}

.cover-fallback {
  display: grid;
  width: min(100%, 260px);
  min-height: 340px;
  padding: 1.5rem;
  box-sizing: border-box;
  place-items: center;
  border-radius: 6px;
  color: #fff;
  background: linear-gradient(145deg, #193819, #71846b);
  box-shadow: 0 16px 32px rgb(28 36 26 / 18%);
  font-family: playfair display, serif;
  font-size: 1.5rem;
  text-align: center;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: #74836f;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.book-information h1 {
  margin: 0;
  color: #193819;
  font-family: playfair display, serif;
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 600;
  line-height: 1.1;
}

.book-authors {
  margin: 0.75rem 0 1.25rem;
  color: #687168;
  font-size: 1.05rem;
}

.book-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.book-categories span {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  color: #375437;
  background: #eaf0e7;
  font-size: 0.75rem;
}

.book-description {
  max-width: 68ch;
  margin: 0;
  color: #586258;
  font-size: 0.95rem;
  line-height: 1.8;
}

.book-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  margin: 1.75rem 0;
  padding: 1.1rem 0;
  border-top: 1px solid #e8e7de;
  border-bottom: 1px solid #e8e7de;
}

.book-facts div {
  min-width: 100px;
}

.book-facts dt {
  margin-bottom: 0.3rem;
  color: #7a8278;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.book-facts dd {
  margin: 0;
  color: #293629;
  font-size: 0.85rem;
}

.book-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
}

.shelf-button,
.preview-link,
.primary-link {
  display: inline-flex;
  min-height: 44px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.1rem;
  border: 1px solid #193819;
  border-radius: 999px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.shelf-button,
.primary-link {
  color: #fff;
  background: #193819;
}

.preview-link {
  color: #193819;
  background: transparent;
}

.shelf-button:focus-visible,
.preview-link:focus-visible,
.primary-link:focus-visible,
.back-link:focus-visible {
  outline: 3px solid #8dbb91;
  outline-offset: 3px;
}

.details-state {
  display: grid;
  min-height: 260px;
  justify-items: center;
  align-content: center;
  gap: 0.75rem;
  margin: 0;
  color: #687168;
  text-align: center;
}

.details-state h1,
.details-state p {
  margin: 0;
}

.details-error h1 {
  color: #193819;
  font-family: playfair display, serif;
}

.loading-mark {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #d5dfd1;
  border-top-color: #193819;
  border-radius: 50%;
  animation: spin 700ms linear infinite;
}

.details-footer {
  margin-top: auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 700px) {
  .book-panel {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .book-cover {
    min-height: 220px;
  }

  .book-cover img {
    max-height: 300px;
  }

  .cover-fallback {
    min-height: 280px;
  }

  .book-actions {
    align-items: stretch;
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .loading-mark {
    animation: none;
  }
}
</style>

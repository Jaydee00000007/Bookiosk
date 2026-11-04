<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const imageFailed = ref(false)
const volume = computed(() => props.book.volumeInfo || {})
const title = computed(() => volume.value.title || 'Untitled book')
const authors = computed(() => {
  const names = volume.value.authors
  return Array.isArray(names) && names.length ? names.join(', ') : 'Unknown author'
})
const cover = computed(() => {
  const thumbnail = volume.value.imageLinks?.thumbnail || volume.value.imageLinks?.smallThumbnail
  return thumbnail?.replace(/^http:/, 'https:')
})

watch(() => cover.value, () => {
  imageFailed.value = false
})

function openBook() {
  router.push({
    name: 'book-details',
    params: { id: props.book.id }
  })
}
</script>

<template>
  <article class="book-card">
    <button class="cover-button" type="button" :aria-label="`View details for ${title}`" @click="openBook">
      <img
        v-if="cover && !imageFailed"
        :src="cover"
        :alt="`Cover of ${title}`"
        loading="lazy"
        @error="imageFailed = true"
      >
      <div v-else class="cover-fallback" aria-hidden="true">
        <span>{{ title }}</span>
      </div>
    </button>

    <div class="book-content">
      <h2>{{ title }}</h2>
      <p>{{ authors }}</p>
      <button class="details-button" type="button" @click="openBook">
        View book
      </button>
    </div>
  </article>
</template>

<style scoped>
.book-card {
  min-width: 0;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 160px 1fr;
  border: 1px solid #e7e3dc;
  border-radius: 14px;
  background: #fff;
  padding: 5px 5px;
  box-shadow: 0 8px 24px rgb(25 56 25 / 8%);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 32px rgb(25 56 25 / 14%);
}

.cover-button {
  min-height: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
  cursor: pointer;
  background: #edf0ea;
}

.cover-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  box-sizing: border-box;
  color: #fff;
  font-family: Georgia, serif;
  font-size: 1.15rem;
  background: linear-gradient(145deg, #193819, #5c7658);
}

.cover-fallback span {
  max-width: 8rem;
  text-align: center;
}

.book-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.book-content h2 {
  margin: 0;
  overflow: hidden;
  color: #1d261d;
  font-size: 1rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.book-content p {
  margin: 0.45rem 0 1rem;
  overflow: hidden;
  color: #687168;
  font-size: 0.875rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.details-button {
  min-height: 40px;
  margin-top: auto;
  border: 0;
  border-radius: 8px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  background: #193819;
}

.details-button:focus-visible,
.cover-button:focus-visible {
  outline: 3px solid #8dbb91;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .book-card {
    transition: none;
  }
}
</style>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { getBookById } from '../services/googleBooks'
import { useMyShelf } from '../composables/useMyShelf'

const route = useRoute()

const book = ref(null)
const loading = ref(true)
const error = ref('')

const { isSaved, toggleBook } = useMyShelf()

onMounted(async () => {
  try {
    book.value = await getBookById(route.params.id)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main>
    <p v-if="loading">Loading book details...</p>
    <p v-else-if="error">{{ error }}</p>

    <section v-else-if="book">
      <img
        :src="book.volumeInfo.imageLinks?.thumbnail"
        :alt="book.volumeInfo.title"
      />

      <h1>{{ book.volumeInfo.title }}</h1>

      <p>
        {{ book.volumeInfo.authors?.join(', ') }}
      </p>

      <p>{{ book.volumeInfo.description }}</p>

      <button @click="toggleBook(book)">
        {{ isSaved(book.id) ? 'Remove from Shelf' : 'Save to My Shelf' }}
      </button>

      <a
        v-if="book.volumeInfo.previewLink"
        :href="book.volumeInfo.previewLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read Preview
      </a>
    </section>
  </main>
</template>
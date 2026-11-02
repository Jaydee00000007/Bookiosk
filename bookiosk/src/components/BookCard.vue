<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
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
    <img
      :src="
        props.book.volumeInfo?.imageLinks?.thumbnail ||
        '/placeholder-book.png'
      "
      :alt="props.book.volumeInfo?.title || 'Book cover'"
    />

    <h3>{{ props.book.volumeInfo?.title || 'Untitled book' }}</h3>

    <p>
      {{
        props.book.volumeInfo?.authors?.join(', ') ||
        'Unknown author'
      }}
    </p>

    <button @click="openBook">
      View Book
    </button>     
  </article>
</template>
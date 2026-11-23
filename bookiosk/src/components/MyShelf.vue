<script setup>
import { computed } from 'vue'
import { useMyShelf } from '../composables/useMyShelf'
import { useFirebaseAuth } from '../services/firebaseAuth'

defineProps({ loading: { type: Boolean, default: false } })
const { savedBooks, syncing, syncError, removeBook } = useMyShelf()
const { currentUser } = useFirebaseAuth()
const countLabel = computed(() => `${savedBooks.value.length} ${savedBooks.value.length === 1 ? 'book' : 'books'}`)
</script>

<template>
  <section id="myshelf" class="my-shelf" :aria-busy="loading || syncing">
    <header class="top">
      <div>
        <h2>My Shelf</h2>
        <p class="shelf-subtitle">Your saved stories, all in one place.</p>
      </div>
      <span class="qty-savedbooks">{{ countLabel }}</span>
    </header>
    <div class="shelf-body">
      <p v-if="loading || syncing" class="shelf-state" role="status">Syncing your bookshelf…</p>
      <p v-else-if="syncError" class="shelf-error" role="alert">{{ syncError }}</p>
      <div v-if="!savedBooks.length && !loading && !syncing" class="shelf-empty">
        <p class="shelf-state">Books you save will appear here.</p>
        <RouterLink class="shelf-browse-link" :to="{ name: 'home', hash: '#search' }">Start browsing</RouterLink>
      </div>
      <ul v-else-if="savedBooks.length" class="shelf-list">
        <li v-for="book in savedBooks" :key="book.id" class="shelf-row">
          <div class="book-copy">
            <RouterLink class="book-title" :to="{ name: 'book-details', params: { id: book.id } }">
              {{ book.volumeInfo?.title || 'Untitled book' }}
            </RouterLink>
            <span class="book-author">{{ book.volumeInfo?.authors?.join(', ') || 'Unknown author' }}</span>
          </div>
          <button class="remove-button" type="button" :aria-label="`Remove ${book.volumeInfo?.title || 'book'} from My Shelf`" @click="removeBook(book.id)">
            Remove
          </button>
        </li>
      </ul>
      <p v-if="!currentUser" class="sign-in-note">Sign in to keep your bookshelf synced across devices.</p>
    </div>
  </section>
</template>

<style scoped>
.my-shelf { box-sizing: border-box; width: min(82%, 1120px); min-width: 0; }
.top { display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom:1rem; }
.top h2 { margin:0; color:#193819; font-size:1.5rem; font-family:playfair display,serif; }
.shelf-subtitle { margin:.35rem 0 0; color:#687168; font-size:.88rem; }
.qty-savedbooks { padding:.4rem .8rem; border-radius:999px; color:#193819; background:#e8eee5; font-size:.8rem; font-weight:600; white-space:nowrap; }
.shelf-body { box-sizing:border-box; width:100%; min-height:160px; padding:clamp(1rem,2.5vw,1.75rem); border:1px solid #e4e6dc; border-radius:16px; background:#fffefa; box-shadow:0 10px 28px rgb(25 56 25 / 6%); }
.shelf-state { display:grid; min-height:100px; margin:0; place-items:center; color:#687168; text-align:center; }
.shelf-empty { display:flex; min-height:128px; flex-direction:column; justify-content:center; align-items:center; gap:.75rem; }
.shelf-browse-link { padding:.55rem 1rem; border-radius:999px; color:#fff; border:1px solid #193819; background:#193819; font-weight:600; text-decoration:none; }
.shelf-list { list-style:none; padding:0; margin:0; }
.shelf-row { display:flex; justify-content:space-between; align-items:center; gap:1rem; padding:1rem 0; border-bottom:1px solid #e9ebe4; }
.shelf-row:first-child { padding-top:0; }
.shelf-row:last-child { border-bottom:0; padding-bottom:0; }
.book-copy { display:grid; gap:.3rem; min-width:0; }
.book-title { color:#193819; font-family:playfair display,serif; font-size:1.05rem; font-weight:600; text-decoration:none; }
.book-title:hover { color:#52714f; text-decoration:underline; text-underline-offset:3px; }
.book-author { color:#687168; font-size:.85rem; }
.remove-button { flex:0 0 auto; border:1px solid #d7ddd3; border-radius:999px; padding:.45rem .75rem; color:#596759; background:transparent; font:inherit; font-size:.78rem; cursor:pointer; }
.remove-button:hover { border-color:#a64b3d; color:#a64b3d; }
.sign-in-note { margin:1rem 0 0; color:#778176; font-size:.78rem; }
.shelf-error { color:#a43b32; font-size:.85rem; }
@media(max-width:700px) { .my-shelf { width:100%; } .shelf-row { align-items:flex-start; } }
</style>

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
        <p class="shelf-kicker">YOUR PERSONAL LIBRARY</p>
        <h2>My Shelf</h2>
        <p class="shelf-subtitle">A home for the stories you want to return to.</p>
      </div>
      <span class="qty-savedbooks">{{ countLabel }}</span>
    </header>

    <div class="shelf-body">
      <p v-if="loading || syncing" class="shelf-state" role="status">Syncing your bookshelf…</p>
      <p v-else-if="syncError" class="shelf-error" role="alert">{{ syncError }}</p>

      <div v-if="!savedBooks.length && !loading && !syncing" class="shelf-empty">
        <span class="empty-mark" aria-hidden="true">✳</span>
        <h3>Your shelf is waiting</h3>
        <p>Save a book that catches your attention and it will be kept here.</p>
        <RouterLink class="shelf-browse-link" :to="{ name: 'home', hash: '#search' }">Explore books</RouterLink>
      </div>

      <ul v-else-if="savedBooks.length" class="shelf-list">
        <li v-for="(book, index) in savedBooks" :key="book.id" class="shelf-row">
          <span class="book-index">{{ String(index + 1).padStart(2, '0') }}</span>
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
.my-shelf {
  --shelf-panel: var(--bk-surface, #fffefa);
  --shelf-panel-soft: var(--bk-surface-soft, #f5f2eb);
  --shelf-ink: var(--bk-text, #273127);
  --shelf-muted: var(--bk-muted, #687568);
  --shelf-line: var(--bk-border, #deded4);
  --shelf-accent: var(--bk-accent, #193819);
  box-sizing: border-box;
  width: min(82%, 1120px);
  min-width: 0;
}
.top { display:flex; justify-content:space-between; align-items:flex-end; gap:1rem; margin-bottom:1.15rem; }
.shelf-kicker { margin:0 0 .4rem; color:var(--shelf-muted); font-size:.68rem; font-weight:700; letter-spacing:.16em; }
.top h2 { margin:0; color:var(--shelf-ink); font-size:1.7rem; font-family:'Playfair Display',Georgia,serif; font-weight:500; }
.shelf-subtitle { margin:.4rem 0 0; color:var(--shelf-muted); font-size:.9rem; }
.qty-savedbooks { padding:.48rem .85rem; border:1px solid var(--shelf-line); border-radius:999px; color:var(--shelf-accent); background:var(--shelf-panel-soft); font-size:.78rem; font-weight:700; white-space:nowrap; }
.shelf-body { box-sizing:border-box; width:100%; min-height:180px; padding:clamp(1.1rem,2.8vw,2rem); border:1px solid var(--shelf-line); border-radius:18px; background:var(--shelf-panel); box-shadow:0 12px 32px rgb(22 37 27 / 5%); }
.shelf-state { display:grid; min-height:120px; margin:0; place-items:center; color:var(--shelf-muted); text-align:center; }
.shelf-empty { display:flex; min-height:170px; flex-direction:column; justify-content:center; align-items:center; gap:.55rem; text-align:center; }
.empty-mark { display:grid; width:42px; height:42px; margin-bottom:.25rem; place-items:center; border-radius:50%; color:var(--shelf-accent); background:var(--shelf-panel-soft); font-size:1.35rem; }
.shelf-empty h3 { margin:0; color:var(--shelf-ink); font:500 1.2rem 'Playfair Display',Georgia,serif; }
.shelf-empty p { max-width:340px; margin:0 0 .55rem; color:var(--shelf-muted); font-size:.86rem; line-height:1.6; }
.shelf-browse-link { padding:.62rem 1.1rem; border:1px solid var(--shelf-accent); border-radius:999px; color:var(--bk-page, #fff); background:var(--shelf-accent); font-size:.82rem; font-weight:700; text-decoration:none; transition:transform .2s ease,opacity .2s ease; }
.shelf-browse-link:hover { transform:translateY(-1px); opacity:.9; }
.shelf-list { list-style:none; padding:0; margin:0; }
.shelf-row { display:grid; grid-template-columns:36px minmax(0,1fr) auto; align-items:center; gap:1rem; padding:1.05rem 0; border-bottom:1px solid var(--shelf-line); }
.shelf-row:first-child { padding-top:0; }
.shelf-row:last-child { border-bottom:0; padding-bottom:0; }
.book-index { color:var(--shelf-muted); font-size:.72rem; font-variant-numeric:tabular-nums; }
.book-copy { display:grid; gap:.32rem; min-width:0; }
.book-title { width:fit-content; max-width:100%; color:var(--shelf-ink); font-family:'Playfair Display',Georgia,serif; font-size:1.06rem; font-weight:600; line-height:1.35; text-decoration:none; }
.book-title:hover { color:var(--shelf-accent); text-decoration:underline; text-underline-offset:3px; }
.book-author { color:var(--shelf-muted); font-size:.82rem; }
.remove-button { flex:0 0 auto; border:1px solid var(--shelf-line); border-radius:999px; padding:.48rem .8rem; color:var(--shelf-muted); background:transparent; font:inherit; font-size:.76rem; cursor:pointer; transition:border-color .2s ease,color .2s ease,background .2s ease; }
.remove-button:hover { border-color:#a64b3d; color:#a64b3d; background:rgb(166 75 61 / 6%); }
.sign-in-note { margin:1.1rem 0 0; color:var(--shelf-muted); font-size:.78rem; }
.shelf-error { color:#b34b40; font-size:.85rem; }
@media(max-width:700px) {
  .my-shelf { width:100%; }
  .top { align-items:flex-start; }
  .shelf-row { grid-template-columns:24px minmax(0,1fr) auto; gap:.65rem; }
  .remove-button { padding:.42rem .62rem; }
}
</style>

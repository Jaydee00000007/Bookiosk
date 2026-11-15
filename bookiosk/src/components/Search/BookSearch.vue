<script setup>
const searchQuery = defineModel('search', {
  type: String,
  default: ''
})

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['search'])

function handleSearch() {
  emit('search', searchQuery.value.trim())
}
</script>

<template>
  <div class="search-control">
    <form class="searchinput" role="search" @submit.prevent="handleSearch">
      <button
        class="search-button"
        type="submit"
        :disabled="props.loading"
        aria-label="Search books"
      >
        <span aria-hidden="true">⌕</span>
      </button>
      <input
        v-model="searchQuery"
        type="search"
        aria-label="Search by title, author, or ISBN"
        placeholder="Search by title, author, or ISBN..."
      >
    </form>
    <p v-if="props.error" class="search-error" role="alert">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
.search-control {
  width: 100%;
}

.searchinput {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: min(100%, 680px);
  min-height: 48px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #d6d9ce;
  border-radius: 999px;
  background: #fffefa;
  box-shadow: 0 8px 24px rgb(25 56 25 / 7%);
}

.search-button {
  display: grid;
  flex: 0 0 52px;
  min-height: 48px;
  place-items: center;
  border: 0;
  color: #fff;
  background: #193819;
  cursor: pointer;
}

.search-button span {
  font-size: 1.5rem;
  line-height: 1;
}

.search-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.searchinput input {
  box-sizing: border-box;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 48px;
  padding: 0.75rem 1rem;
  border: 0;
  outline: 0;
  color: #193819;
  background: transparent;
  font: inherit;
}

.searchinput:focus-within {
  outline: 3px solid #8dbb91;
  outline-offset: 3px;
}

.search-error {
  margin: 0.75rem auto 0;
  color: #9f2d25;
  text-align: center;
}

@media (max-width: 700px) {
  .search-button {
    flex-basis: 44px;
    min-height: 44px;
  }

  .searchinput,
  .searchinput input {
    min-height: 44px;
  }
}
</style>

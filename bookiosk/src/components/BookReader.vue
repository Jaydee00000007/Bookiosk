<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  volumeId: { type: String, required: true },
  embeddable: { type: Boolean, default: false },
  previewLink: { type: String, default: '' }
})

const viewerElement = ref(null)
const status = ref('loading')
const message = ref('Preparing the reader…')
let viewer = null
let loadVersion = 0

let viewerApiPromise

function loadViewerApi() {
  if (window.google?.books?.DefaultViewer) {
    return new Promise((resolve) => {
      window.google.books.load()
      window.google.books.setOnLoadCallback(() => resolve(window.google.books))
    })
  }

  if (viewerApiPromise) return viewerApiPromise

  viewerApiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://www.google.com/books/jsapi.js'
    script.async = true
    script.dataset.googleBooksViewer = 'true'
    script.onload = () => {
      const api = window.google?.books
      if (!api) {
        reject(new Error('The Google Books reader could not be initialized.'))
        return
      }
      api.load()
      api.setOnLoadCallback(() => resolve(api))
    }
    script.onerror = () => reject(new Error('The Google Books reader could not be loaded.'))
    document.head.appendChild(script)
  }).catch((error) => {
    viewerApiPromise = null
    throw error
  })

  return viewerApiPromise
}

async function initializeViewer() {
  const currentLoad = ++loadVersion
  viewer = null

  if (!props.embeddable) {
    status.value = 'unavailable'
    message.value = 'An in-page preview is not available for this title.'
    return
  }

  status.value = 'loading'
  message.value = 'Loading the book preview…'

  try {
    const api = await loadViewerApi()
    if (currentLoad !== loadVersion || !viewerElement.value) return

    const instance = new api.DefaultViewer(viewerElement.value)
    viewer = instance
    instance.load(
      props.volumeId,
      () => {
        if (currentLoad !== loadVersion) return
        status.value = 'unavailable'
        message.value = 'Google Books could not display this preview here. It may be restricted for this title or region.'
      },
      () => {
        if (currentLoad !== loadVersion) return
        status.value = 'ready'
        message.value = ''
      }
    )
  } catch (error) {
    if (currentLoad !== loadVersion) return
    status.value = 'unavailable'
    message.value = error.message || 'The in-page reader could not be loaded.'
  }
}

onMounted(initializeViewer)
onBeforeUnmount(() => {
  loadVersion++
  viewer = null
})
</script>

<template>
  <section class="reader-card" aria-label="Book reader">
    <div class="reader-heading">
      <div>
        <p class="reader-kicker">BOOKIOSK READER</p>
        <h2>Read this book</h2>
      </div>
      <a
        v-if="previewLink"
        class="reader-external-link"
        :href="previewLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open on Google Books ↗
      </a>
    </div>

    <div class="reader-frame">
      <div ref="viewerElement" class="google-viewer" :class="{ 'is-hidden': status !== 'ready' }"></div>
      <div v-if="status !== 'ready'" class="reader-message" role="status">
        <span v-if="status === 'loading'" class="reader-spinner" aria-hidden="true"></span>
        <strong>{{ status === 'loading' ? 'Getting your preview ready' : 'Preview unavailable' }}</strong>
        <p>{{ message }}</p>
        <a
          v-if="status === 'unavailable' && previewLink"
          :href="previewLink"
          target="_blank"
          rel="noopener noreferrer"
        >
          Try the Google Books preview
        </a>
      </div>
    </div>
    <p class="reader-note">
      Available pages are provided by Google Books. Some titles offer a limited preview rather than the full book.
    </p>
  </section>
</template>

<style scoped>
.reader-card {
  margin-top: 2rem;
  overflow: hidden;
  border: 1px solid #e5e9e1;
  border-radius: 20px;
  background: #fffefa;
  box-shadow: 0 14px 36px rgb(25 56 25 / 6%);
}

.reader-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e8e7de;
}

.reader-kicker {
  margin: 0 0 0.25rem;
  color: #74836f;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.reader-heading h2 {
  margin: 0;
  color: #193819;
  font-family: Georgia, serif;
  font-size: 1.5rem;
}

.reader-external-link {
  color: #315b32;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
}

.reader-frame {
  position: relative;
  min-height: 620px;
  background: #f1f2ed;
}

.google-viewer {
  width: 100%;
  height: 620px;
}

.google-viewer.is-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.reader-message {
  display: flex;
  min-height: 620px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 2rem;
  color: #334333;
  text-align: center;
}

.reader-message p {
  max-width: 520px;
  margin: 0;
  color: #697568;
  line-height: 1.65;
}

.reader-message a {
  margin-top: 0.5rem;
  color: #315b32;
  font-weight: 700;
}

.reader-spinner {
  width: 1.7rem;
  height: 1.7rem;
  border: 2px solid #d5dfd1;
  border-top-color: #315b32;
  border-radius: 50%;
  animation: reader-spin 700ms linear infinite;
}

.reader-note {
  margin: 0;
  padding: 0.9rem 1.5rem;
  border-top: 1px solid #e8e7de;
  color: #788176;
  font-size: 0.78rem;
  line-height: 1.5;
}

@keyframes reader-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .reader-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .reader-frame,
  .reader-message {
    min-height: 520px;
  }
  .google-viewer {
    height: 520px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .reader-spinner { animation: none; }
}
</style>

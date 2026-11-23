<script setup>
import { ref } from 'vue'
import { signIn, signUp } from '../services/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: value => ['signin', 'signup'].includes(value)
  }
})

const isSignUp = props.mode === 'signup'
const fullName = ref('')
const email = ref('')
const password = ref('')
const keepSignedIn = ref(false)
const agreedToTerms = ref(false)
const selectedGenres = ref([])
const loading = ref(false)
const statusMessage = ref('')
const errorMessage = ref('')
const genres = ['Fiction', 'Poetry', 'History', 'Folktale', 'Politics', 'Biography']

function selectGenre(genre) {
  selectedGenres.value = selectedGenres.value.includes(genre)
    ? selectedGenres.value.filter(item => item !== genre)
    : [...selectedGenres.value, genre]
}

function clearMessages() {
  statusMessage.value = ''
  errorMessage.value = ''
}

async function handleSubmit() {
  clearMessages()
  loading.value = true

  try {
    const result = isSignUp
      ? await signUp({
          name: fullName.value.trim(),
          email: email.value.trim(),
          password: password.value,
          genres: selectedGenres.value
        })
      : await signIn({
          email: email.value.trim(),
          password: password.value,
          keepSignedIn: keepSignedIn.value
        })

    statusMessage.value = result?.message || (isSignUp ? 'Your account has been created.' : 'You are signed in.')
    await router.push({ name: 'home', hash: '#myshelf' })
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page" :class="`auth-page--${mode}`">
    <aside class="auth-story" aria-label="About Bookiosk">
      <RouterLink class="brand" to="/" aria-label="Bookiosk home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>bookiosk</span>
      </RouterLink>

      <div class="story-copy">
        <p class="story-label">A home for African stories</p>
        <h1 v-if="isSignUp">Make room for <em>new worlds.</em></h1>
        <h1 v-else>Come back to <em>your story.</em></h1>
        <p v-if="isSignUp">
          Find your next favorite, save it for later, and build a shelf that feels like yours.
        </p>
        <p v-else>
          Your shelf is right where you left it. Pick up a story, or find a new one.
        </p>
      </div>

      <div class="shelf-scene" aria-hidden="true">
        <div class="shelf-note">Stories worth keeping</div>
        <div class="book-stack">
          <div class="book book--one"><span>THE<br>WIDE<br>WORLD</span></div>
          <div class="book book--two"><span>HOME<br>AND<br>OTHER<br>STORIES</span></div>
          <div class="book book--three"><span>THE<br>THINGS<br>WE CARRY</span></div>
          <div class="book book--four"><span>RIVER<br>OF<br>WORDS</span></div>
        </div>
        <div class="shelf-line"></div>
      </div>

      <p class="story-footer">Good stories make a place feel bigger.</p>
    </aside>

    <section class="auth-main">
      <nav class="auth-nav" aria-label="Account navigation">
        <RouterLink class="back-link" to="/">← <span>Back to home</span></RouterLink>
        <p v-if="isSignUp">
          Already have an account?
          <RouterLink to="/signin">Sign in</RouterLink>
        </p>
        <p v-else>
          New to Bookiosk?
          <RouterLink to="/signup">Create an account</RouterLink>
        </p>
      </nav>

      <div class="auth-content">
        <header class="form-heading">
          <p class="eyebrow">{{ isSignUp ? 'Your reading life starts here' : 'Welcome back' }}</p>
          <h2>{{ isSignUp ? 'Create your account' : 'Sign in to your shelf' }}</h2>
          <p>
            {{ isSignUp
              ? 'A shelf of your own is just a few details away.'
              : 'Your next chapter is waiting.' }}
          </p>
        </header>

        <form class="auth-form" @submit.prevent="handleSubmit" @input="clearMessages">
          <div v-if="isSignUp" class="field">
            <label for="signup-fullname">Full name</label>
            <input
              id="signup-fullname"
              v-model="fullName"
              name="name"
              type="text"
              autocomplete="name"
              placeholder="Your name"
              required
            >
          </div>

          <div class="field">
            <label :for="isSignUp ? 'signup-email' : 'signin-email'">Email address</label>
            <input
              :id="isSignUp ? 'signup-email' : 'signin-email'"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
            >
          </div>

          <div class="field">
            <div class="field-label-row">
              <label :for="isSignUp ? 'signup-password' : 'signin-password'">Password</label>
              <RouterLink v-if="!isSignUp" to="/forgotpassword">Forgot password?</RouterLink>
            </div>
            <input
              :id="isSignUp ? 'signup-password' : 'signin-password'"
              v-model="password"
              name="password"
              type="password"
              :autocomplete="isSignUp ? 'new-password' : 'current-password'"
              :placeholder="isSignUp ? 'At least 8 characters' : 'Your password'"
              :minlength="isSignUp ? 8 : undefined"
              required
            >
          </div>

          <fieldset v-if="isSignUp" class="genre-field">
            <legend>What do you love to read? <span>Optional</span></legend>
            <p>Choose a few to shape your recommendations.</p>
            <div class="genre-list">
              <button
                v-for="genre in genres"
                :key="genre"
                class="genre-chip"
                :class="{ 'genre-chip--selected': selectedGenres.includes(genre) }"
                type="button"
                :aria-pressed="selectedGenres.includes(genre)"
                @click="selectGenre(genre)"
              >
                {{ genre }}
              </button>
            </div>
          </fieldset>

          <label v-if="isSignUp" class="check-row" for="signup-terms">
            <input id="signup-terms" v-model="agreedToTerms" type="checkbox" required>
            <span>I agree to the Terms and Privacy Policy.</span>
          </label>
          <label v-else class="check-row" for="keep-signed-in">
            <input id="keep-signed-in" v-model="keepSignedIn" type="checkbox">
            <span>Keep me signed in on this device</span>
          </label>

          <button class="submit-button" type="submit" :disabled="loading">
            <span>{{ loading ? 'One moment…' : isSignUp ? 'Create my account' : 'Sign in' }}</span>
            <span aria-hidden="true">{{ loading ? '' : '→' }}</span>
          </button>

          <p v-if="statusMessage" class="form-message form-message--success" role="status">
            {{ statusMessage }}
          </p>
          <p v-if="errorMessage" class="form-message form-message--error" role="alert">
            {{ errorMessage }}
          </p>
        </form>

        <p class="privacy-note">
          Your details stay yours. We use them only to look after your reading shelf.
        </p>
      </div>

      <footer class="auth-footer">Book data from Google Books.</footer>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  --forest: #153b32;
  --forest-deep: #102f29;
  --leaf: #d7e5d7;
  --paper: #f7f8f2;
  --ink: #1c2a25;
  --muted: #748078;
  --accent: #e8a34b;
  display: grid;
  grid-template-columns: minmax(360px, 0.88fr) minmax(460px, 1.12fr);
  min-height: 100vh;
  color: var(--ink);
  background: var(--paper);
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
}

.auth-story {
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  overflow: hidden;
  padding: clamp(2rem, 5vw, 4.5rem);
  color: #f7f8f2;
  background:
    radial-gradient(ellipse at 18% 82%, rgba(84, 125, 92, 0.35), transparent 38%),
    var(--forest);
}

.auth-story::after {
  position: absolute;
  right: -9rem;
  bottom: -11rem;
  width: 28rem;
  height: 28rem;
  border: 1px solid rgba(215, 229, 215, 0.12);
  border-radius: 50%;
  content: '';
}

.brand {
  z-index: 1;
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 0.65rem;
  color: #fff;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-decoration: none;
}

.brand-mark {
  display: flex;
  width: 2rem;
  height: 2rem;
  align-items: end;
  justify-content: center;
  gap: 0.15rem;
  padding: 0.35rem;
  box-sizing: border-box;
  border-radius: 0.4rem;
  background: #f7f8f2;
}

.brand-mark i {
  width: 0.3rem;
  height: 70%;
  border-radius: 0.08rem 0.08rem 0 0;
  background: #c65e48;
}

.brand-mark i:nth-child(2) {
  height: 90%;
  background: #e8a34b;
}

.brand-mark i:nth-child(3) {
  height: 78%;
  background: #6d8b72;
}

.story-copy {
  z-index: 1;
  width: min(100%, 34rem);
  margin: clamp(3.5rem, 10vh, 7rem) 0 0;
  animation: rise-in 650ms both;
}

.story-label,
.eyebrow {
  margin: 0 0 1rem;
  color: #b8d2bb;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.story-copy h1 {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(3rem, 5.2vw, 5.2rem);
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 1.04;
}

.story-copy h1 em {
  color: #f0b660;
  font-weight: 400;
}

.story-copy > p:last-child {
  max-width: 24rem;
  margin: 1.35rem 0 0;
  color: #d0ddd1;
  font-size: 1rem;
  line-height: 1.7;
}

.shelf-scene {
  position: relative;
  z-index: 1;
  width: min(100%, 27rem);
  height: 10.5rem;
  margin: auto auto 1.6rem;
  animation: rise-in 750ms 120ms both;
}

.shelf-note {
  position: absolute;
  top: 0;
  left: 0;
  color: #b8d2bb;
  font-size: 0.72rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.book-stack {
  position: absolute;
  right: 2.2rem;
  bottom: 1rem;
  display: flex;
  height: 8.3rem;
  align-items: end;
  gap: 0.5rem;
  transform: rotate(-3deg);
  animation: shelf-float 5s ease-in-out infinite;
}

.book {
  display: flex;
  width: 4.15rem;
  height: 7.1rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.32rem 0.15rem 0.15rem 0.32rem;
  box-shadow: 0.35rem 0.4rem 0 rgba(5, 23, 18, 0.2);
  color: white;
  text-align: center;
}

.book span {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.58rem;
  letter-spacing: 0.04em;
  line-height: 1.4;
}

.book--one {
  height: 6rem;
  background: #c65e48;
}

.book--two {
  height: 7.7rem;
  background: #dd9a43;
}

.book--three {
  height: 6.7rem;
  background: #6d8b72;
}

.book--four {
  height: 8.2rem;
  background: #375d66;
}

.shelf-line {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0.5rem;
  border-radius: 999px;
  background: #d4a467;
  box-shadow: 0 0.45rem 0 rgba(6, 25, 19, 0.3);
}

.story-footer {
  z-index: 1;
  margin: 0;
  color: #b8c9bc;
  font-size: 0.78rem;
}

.auth-main {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding: 2.2rem clamp(1.5rem, 5vw, 4.5rem) 1.5rem;
}

.auth-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--muted);
  font-size: 0.82rem;
}

.auth-nav p {
  margin: 0;
  text-align: right;
}

.auth-nav a,
.field-label-row a {
  color: var(--forest);
  font-weight: 700;
  text-decoration: none;
}

.auth-nav a:hover,
.field-label-row a:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--muted) !important;
  font-weight: 500 !important;
  text-decoration: none !important;
}

.auth-content {
  width: min(100%, 27rem);
  margin: auto;
  padding: 2.5rem 0;
  animation: rise-in 600ms 80ms both;
}

.form-heading {
  margin-bottom: 1.8rem;
}

.form-heading .eyebrow {
  margin-bottom: 0.6rem;
  color: #68816b;
}

.form-heading h2 {
  margin: 0;
  color: var(--forest-deep);
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 3.2vw, 2.65rem);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 1.15;
}

.form-heading > p:last-child {
  margin: 0.7rem 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.auth-form {
  display: grid;
  gap: 1.1rem;
}

.field {
  display: grid;
  gap: 0.48rem;
}

.field label,
.genre-field legend {
  color: #27372e;
  font-size: 0.82rem;
  font-weight: 700;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label-row a {
  font-size: 0.76rem;
}

.field input {
  box-sizing: border-box;
  width: 100%;
  min-height: 3.1rem;
  padding: 0.75rem 0.9rem;
  border: 1px solid #d5ddd5;
  border-radius: 0.55rem;
  outline: none;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.7);
  font: inherit;
  font-size: 0.9rem;
  transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.field input::placeholder {
  color: #a0aaa2;
}

.field input:focus {
  border-color: #527a5d;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(82, 122, 93, 0.13);
}

.genre-field {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.genre-field legend span {
  margin-left: 0.25rem;
  color: var(--muted);
  font-size: 0.73rem;
  font-weight: 400;
}

.genre-field > p {
  margin: 0.35rem 0 0.75rem;
  color: var(--muted);
  font-size: 0.78rem;
}

.genre-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.genre-chip {
  padding: 0.45rem 0.75rem;
  border: 1px solid #d5ddd5;
  border-radius: 999px;
  color: #3e5944;
  background: transparent;
  font: inherit;
  font-size: 0.76rem;
  cursor: pointer;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.genre-chip:hover {
  transform: translateY(-1px);
  border-color: #79947c;
}

.genre-chip--selected {
  border-color: var(--forest);
  color: white;
  background: var(--forest);
}

.check-row {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  color: #56635b;
  font-size: 0.78rem;
  line-height: 1.5;
}

.check-row input {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  margin: 0.1rem 0 0;
  accent-color: var(--forest);
}

.submit-button {
  display: flex;
  min-height: 3.2rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.1rem;
  border: 0;
  border-radius: 0.55rem;
  color: #fff;
  background: var(--forest);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #205444;
  box-shadow: 0 0.5rem 1rem rgba(21, 59, 50, 0.16);
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.75;
}

.form-message {
  margin: -0.3rem 0 0;
  font-size: 0.84rem;
  line-height: 1.5;
}

.form-message--success {
  color: #28603e;
}

.form-message--error {
  color: #a43b32;
}

.privacy-note {
  margin: 1.4rem 0 0;
  color: #8a958d;
  font-size: 0.72rem;
  line-height: 1.6;
}

.auth-footer {
  color: #8a958d;
  font-size: 0.72rem;
  text-align: center;
}

.auth-page :focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shelf-float {
  0%, 100% {
    transform: rotate(-3deg) translateY(0);
  }
  50% {
    transform: rotate(-1deg) translateY(-5px);
  }
}

@media (max-width: 800px) {
  .auth-page {
    grid-template-columns: minmax(0, 0.82fr) minmax(390px, 1.18fr);
  }

  .auth-story {
    padding: 2rem;
  }

  .auth-main {
    padding-right: 2rem;
    padding-left: 2rem;
  }
}

@media (max-width: 680px) {
  .auth-page {
    display: block;
  }

  .auth-story {
    min-height: 0;
    padding: 1.25rem 1.4rem 1.4rem;
  }

  .auth-story::after {
    right: -15rem;
    bottom: -18rem;
  }

  .brand {
    font-size: 1.15rem;
  }

  .brand-mark {
    width: 1.75rem;
    height: 1.75rem;
  }

  .story-copy {
    width: min(100%, 31rem);
    margin: 2.1rem 0 0;
  }

  .story-label {
    margin-bottom: 0.55rem;
  }

  .story-copy h1 {
    max-width: 25rem;
    font-size: clamp(2.35rem, 10vw, 3.3rem);
  }

  .story-copy > p:last-child {
    max-width: 30rem;
    margin-top: 0.75rem;
    font-size: 0.88rem;
  }

  .shelf-scene,
  .story-footer {
    display: none;
  }

  .auth-main {
    min-height: 0;
    padding: 1.15rem 1.4rem 1.5rem;
  }

  .auth-nav {
    font-size: 0.74rem;
  }

  .auth-nav p {
    max-width: 64%;
  }

  .auth-content {
    width: min(100%, 27rem);
    padding: 2.4rem 0;
  }

  .form-heading {
    margin-bottom: 1.5rem;
  }

  .auth-footer {
    margin-top: auto;
  }
}

@media (max-width: 380px) {
  .auth-nav {
    align-items: flex-start;
    font-size: 0.7rem;
  }

  .back-link span {
    max-width: 4.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

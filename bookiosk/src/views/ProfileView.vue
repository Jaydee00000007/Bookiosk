<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { useFirebaseAuth } from '../services/firebaseAuth'

const router = useRouter()
const { currentUser, updateProfile, signOut } = useFirebaseAuth()
const displayName = ref(currentUser.value?.displayName || '')
const loading = ref(false)
const message = ref('')
const error = ref('')
const email = computed(() => currentUser.value?.email || '')

watch(currentUser, user => {
  displayName.value = user?.displayName || ''
}, { immediate: true })

async function saveProfile() {
  message.value = ''
  error.value = ''
  loading.value = true
  try {
    await updateProfile(displayName.value)
    message.value = 'Your profile has been updated.'
  } catch (err) {
    error.value = err.message || 'Unable to update your profile.'
  } finally {
    loading.value = false
  }
}

function handleSignOut() {
  signOut()
  router.replace({ name: 'signin' })
}
</script>

<template>
  <div class="profile-page">
    <NavBar />
    <main class="profile-main">
      <section class="profile-card" aria-labelledby="profile-heading">
        <p class="profile-eyebrow">YOUR BOOKIOSK ACCOUNT</p>
        <h1 id="profile-heading">Profile & settings</h1>
        <p class="profile-intro">Keep your account details up to date.</p>

        <form class="profile-form" @submit.prevent="saveProfile">
          <label for="profile-name">Display name</label>
          <input id="profile-name" v-model="displayName" type="text" autocomplete="name" maxlength="80" required>
          <label for="profile-email">Email address</label>
          <input id="profile-email" :value="email" type="email" disabled readonly>
          <button class="profile-save" type="submit" :disabled="loading || !displayName.trim()">
            {{ loading ? 'Saving…' : 'Save changes' }}
          </button>
          <p v-if="message" class="profile-message success" role="status">{{ message }}</p>
          <p v-if="error" class="profile-message error" role="alert">{{ error }}</p>
        </form>

        <div class="profile-account-actions">
          <RouterLink to="/">Back to Bookiosk</RouterLink>
          <button type="button" @click="handleSignOut">Sign out</button>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.profile-page { min-height: 100vh; display: flex; flex-direction: column; color: #273127; background: #faf9f5; font-family: 'DM Sans', sans-serif; }
.profile-main { flex: 1; width: 100%; box-sizing: border-box; padding: clamp(2rem, 7vw, 5rem) 1.25rem; }
.profile-card { width: min(100%, 560px); box-sizing: border-box; margin: 0 auto; padding: clamp(1.5rem, 5vw, 3rem); border: 1px solid #e4e4da; border-radius: 20px; background: #fffefa; box-shadow: 0 18px 48px rgb(25 56 25 / 7%); }
.profile-eyebrow { margin: 0 0 .7rem; color: #68816b; font-size: .72rem; font-weight: 700; letter-spacing: .14em; }
.profile-card h1 { margin: 0; color: #153b32; font: 400 clamp(2rem, 5vw, 2.8rem)/1.15 'Playfair Display', Georgia, serif; }
.profile-intro { margin: .7rem 0 2rem; color: #748078; }
.profile-form { display: grid; gap: .65rem; }
.profile-form label { margin-top: .45rem; color: #27372e; font-size: .84rem; font-weight: 700; }
.profile-form input { width: 100%; min-height: 3rem; box-sizing: border-box; padding: .75rem .9rem; border: 1px solid #d5ddd5; border-radius: .55rem; color: #1c2a25; background: #fff; font: inherit; }
.profile-form input:disabled { color: #748078; background: #f2f3ee; }
.profile-save { min-height: 3.1rem; margin-top: .8rem; border: 0; border-radius: .55rem; color: white; background: #153b32; font: inherit; font-weight: 700; cursor: pointer; }
.profile-save:disabled { cursor: not-allowed; opacity: .6; }
.profile-message { margin: .35rem 0 0; font-size: .85rem; }
.success { color: #28603e; } .error { color: #a43b32; }
.profile-account-actions { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 2rem; padding-top: 1.2rem; border-top: 1px solid #e4e4da; }
.profile-account-actions a { color: #315c43; text-decoration: none; font-size: .88rem; }
.profile-account-actions button { border: 0; color: #a43b32; background: transparent; font: inherit; cursor: pointer; }
</style>

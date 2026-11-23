<script setup>
import { ref } from 'vue'
import { useFirebaseAuth } from '../services/firebaseAuth'

const { sendPasswordReset } = useFirebaseAuth()
const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

async function handleForgotPassword() {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    await sendPasswordReset(email.value)
    message.value = 'If an account exists for this email, a password reset email has been sent.'
  } catch (err) {
    error.value = err.message || 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="reset-page">
    <section class="reset-card">
      <RouterLink to="/signin" class="back-link">← Back to sign in</RouterLink>
      <p class="eyebrow">Account recovery</p>
      <h1>Reset your password</h1>
      <p class="intro">Enter the email address associated with your Bookiosk account.</p>
      <form @submit.prevent="handleForgotPassword">
        <label for="reset-email">Email address</label>
        <input id="reset-email" v-model="email" type="email" autocomplete="email" required placeholder="you@example.com">
        <button type="submit" :disabled="loading">{{ loading ? 'Sending…' : 'Send reset email' }}</button>
      </form>
      <p v-if="message" class="success" role="status">{{ message }}</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
    </section>
  </main>
</template>

<style scoped>
.reset-page { min-height:100vh; display:grid; place-items:center; padding:1.25rem; box-sizing:border-box; background:#f7f8f2; font-family:'DM Sans','Segoe UI',sans-serif; }
.reset-card { width:min(100%,420px); padding:clamp(1.5rem,5vw,2.5rem); border:1px solid #e2e8df; border-radius:18px; background:#fffefa; box-shadow:0 18px 48px rgb(25 56 25 / 8%); box-sizing:border-box; }
.back-link { color:#526450; text-decoration:none; font-size:.85rem; }
.eyebrow { margin:2rem 0 .5rem; color:#68816b; font-size:.72rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
h1 { margin:0; color:#153b32; font-family:'Playfair Display',Georgia,serif; font-size:2rem; font-weight:500; }
.intro { color:#748078; line-height:1.6; font-size:.9rem; }
form { display:grid; gap:.65rem; margin-top:1.5rem; }
label { font-size:.82rem; font-weight:700; }
input { min-height:46px; padding:.7rem .85rem; border:1px solid #d5ddd5; border-radius:8px; font:inherit; box-sizing:border-box; }
button { min-height:46px; margin-top:.4rem; border:0; border-radius:8px; color:white; background:#153b32; font:inherit; font-weight:700; cursor:pointer; }
button:disabled { opacity:.65; cursor:wait; }
.success { color:#28603e; font-size:.85rem; }
.error { color:#a43b32; font-size:.85rem; }
</style>

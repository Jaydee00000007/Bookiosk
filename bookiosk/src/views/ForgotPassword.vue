<template>
  <div class="forgot-password-container">
    <h2>Forgot Password</h2>
    <form @submit.prevent="handleForgotPassword">
      <label for="email">Enter your email address:</label>
      <input 
        id="email" 
        v-model="email" 
        type="email" 
        required 
        placeholder="name@example.com" 
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>
    <p v-if="message" class="success">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

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

<style scoped>
    
</style>

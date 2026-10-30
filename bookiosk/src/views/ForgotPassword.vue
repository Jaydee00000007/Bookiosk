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
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const loading = ref(false);
const message = ref('');
const error = ref('');

const handleForgotPassword = async () => {
  loading.value = true;
  message.value = '';
  error.value = '';

  try {
    const response = await axios.post('/api/forgot-password', {
      email: email.value
    });
    message.value = response.data.message || 'Check your inbox for a password reset link.';
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send reset link. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
    
</style>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { useFirebaseAuth } from '../services/firebaseAuth'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const { currentUser, updateProfile, sendPasswordReset, signOut } = useFirebaseAuth()
const { isDark, toggleTheme } = useTheme()
const displayName = ref(currentUser.value?.displayName || '')
const loading = ref(false)
const resettingPassword = ref(false)
const message = ref('')
const error = ref('')
const email = computed(() => currentUser.value?.email || '')
const initials = computed(() => {
  const name = displayName.value.trim() || email.value
  return name.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('') || 'B'
})

watch(currentUser, user => {
  displayName.value = user?.displayName || ''
}, { immediate: true })

async function saveProfile() {
  message.value = ''
  error.value = ''
  loading.value = true
  try {
    await updateProfile(displayName.value)
    message.value = 'Your profile details have been saved.'
  } catch (err) {
    error.value = err.message || 'Unable to update your profile.'
  } finally {
    loading.value = false
  }
}

async function resetPassword() {
  message.value = ''
  error.value = ''
  resettingPassword.value = true
  try {
    await sendPasswordReset(email.value)
    message.value = `Password reset instructions have been sent to ${email.value}.`
  } catch (err) {
    error.value = err.message || 'Unable to send password reset email.'
  } finally {
    resettingPassword.value = false
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
      <div class="profile-heading">
        <p class="profile-eyebrow">ACCOUNT CENTRE</p>
        <h1>Your profile</h1>
        <p>Manage your Bookiosk account and reading experience.</p>
      </div>

      <div class="profile-layout">
        <section class="profile-card identity-card" aria-labelledby="identity-heading">
          <div class="identity-top">
            <div class="profile-avatar" aria-hidden="true">{{ initials }}</div>
            <div class="identity-copy">
              <h2 id="identity-heading">{{ displayName || 'Reader account' }}</h2>
              <p>{{ email }}</p>
              <span class="account-status"><span></span> Account active</span>
            </div>
          </div>

          <form class="profile-form" @submit.prevent="saveProfile">
            <div class="section-heading">
              <h3>Personal information</h3>
              <p>Update the name displayed on your account.</p>
            </div>
            <label for="profile-name">Display name</label>
            <input id="profile-name" v-model="displayName" type="text" autocomplete="name" maxlength="80" placeholder="Enter your name" required>
            <label for="profile-email">Email address</label>
            <input id="profile-email" :value="email" type="email" disabled readonly>
            <button class="profile-save" type="submit" :disabled="loading || !displayName.trim()">
              {{ loading ? 'Saving changes…' : 'Save profile' }}
            </button>
          </form>
        </section>

        <aside class="profile-side">
          <section class="profile-card setting-card">
            <div class="section-heading">
              <h3>Appearance</h3>
              <p>Choose how Bookiosk looks on this device.</p>
            </div>
            <div class="setting-row">
              <div>
                <strong>{{ isDark ? 'Dark mode' : 'Light mode' }}</strong>
                <span>{{ isDark ? 'A softer look for low-light reading.' : 'A bright, warm reading space.' }}</span>
              </div>
              <button class="theme-control" type="button" role="switch" :aria-checked="isDark" @click="toggleTheme">
                <span></span>
              </button>
            </div>
          </section>

          <section class="profile-card setting-card">
            <div class="section-heading">
              <h3>Security</h3>
              <p>Keep your account access up to date.</p>
            </div>
            <div class="security-row">
              <div>
                <strong>Password</strong>
                <span>Receive a secure password reset link by email.</span>
              </div>
              <button class="secondary-action" type="button" :disabled="resettingPassword || !email" @click="resetPassword">
                {{ resettingPassword ? 'Sending…' : 'Reset password' }}
              </button>
            </div>
          </section>

          <section class="profile-card account-card">
            <div class="section-heading">
              <h3>Account</h3>
              <p>Finished reading for now?</p>
            </div>
            <RouterLink class="back-link" to="/">Return to Bookiosk</RouterLink>
            <button class="signout-action" type="button" @click="handleSignOut">Sign out</button>
          </section>
        </aside>
      </div>

      <p v-if="message" class="profile-feedback success" role="status">{{ message }}</p>
      <p v-if="error" class="profile-feedback error" role="alert">{{ error }}</p>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.profile-page { --profile-panel:var(--bk-surface,#fffefa); --profile-text:var(--bk-text,#273127); --profile-muted:var(--bk-muted,#687568); --profile-line:var(--bk-border,#deded4); min-height:100vh; display:flex; flex-direction:column; color:var(--profile-text); background:var(--bk-page,#faf9f5); font-family:'DM Sans',sans-serif; }
.profile-main { flex:1; width:min(100% - 2.5rem,1060px); box-sizing:border-box; margin:0 auto; padding:clamp(2.5rem,6vw,4.5rem) 0; }
.profile-heading { margin-bottom:1.8rem; }
.profile-eyebrow { margin:0 0 .5rem; color:var(--profile-muted); font-size:.68rem; font-weight:700; letter-spacing:.17em; }
.profile-heading h1 { margin:0; color:var(--profile-text); font:500 clamp(2.2rem,5vw,3.1rem)/1.1 'Playfair Display',Georgia,serif; }
.profile-heading > p:last-child { margin:.65rem 0 0; color:var(--profile-muted); font-size:.92rem; }
.profile-layout { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(280px,.85fr); align-items:start; gap:1.15rem; }
.profile-card { box-sizing:border-box; padding:clamp(1.2rem,3vw,1.8rem); border:1px solid var(--profile-line); border-radius:18px; background:var(--profile-panel); box-shadow:0 12px 34px rgb(22 37 27 / 4%); }
.identity-top { display:flex; align-items:center; gap:1rem; padding-bottom:1.5rem; border-bottom:1px solid var(--profile-line); }
.profile-avatar { display:grid; flex:0 0 62px; width:62px; height:62px; place-items:center; border-radius:50%; color:var(--bk-page,#fff); background:var(--bk-accent,#193819); font:500 1.35rem 'Playfair Display',Georgia,serif; }
.identity-copy { min-width:0; }
.identity-copy h2 { margin:0; overflow-wrap:anywhere; color:var(--profile-text); font:500 1.35rem 'Playfair Display',Georgia,serif; }
.identity-copy > p { margin:.25rem 0 .5rem; color:var(--profile-muted); font-size:.84rem; overflow-wrap:anywhere; }
.account-status { display:inline-flex; align-items:center; gap:.4rem; color:var(--profile-muted); font-size:.72rem; }
.account-status span { width:7px; height:7px; border-radius:50%; background:#57946b; }
.profile-form { display:grid; gap:.65rem; padding-top:1.45rem; }
.section-heading { margin-bottom:.95rem; }
.section-heading h3 { margin:0; color:var(--profile-text); font:500 1.15rem 'Playfair Display',Georgia,serif; }
.section-heading p { margin:.35rem 0 0; color:var(--profile-muted); font-size:.8rem; line-height:1.5; }
.profile-form label { margin-top:.35rem; color:var(--profile-text); font-size:.8rem; font-weight:700; }
.profile-form input { width:100%; min-height:2.9rem; box-sizing:border-box; padding:.72rem .85rem; border:1px solid var(--profile-line); border-radius:9px; color:var(--profile-text); background:var(--bk-surface-soft,#f5f2eb); font:inherit; font-size:.86rem; }
.profile-form input:disabled { color:var(--profile-muted); opacity:.8; }
.profile-save { min-height:2.95rem; margin-top:.55rem; border:0; border-radius:9px; color:var(--bk-page,#fff); background:var(--bk-accent,#193819); font:inherit; font-size:.85rem; font-weight:700; cursor:pointer; }
.profile-save:disabled,.secondary-action:disabled { cursor:not-allowed; opacity:.55; }
.profile-side { display:grid; gap:1.15rem; }
.setting-row,.security-row { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
.setting-row strong,.security-row strong { display:block; color:var(--profile-text); font-size:.84rem; }
.setting-row span,.security-row span { display:block; max-width:235px; margin-top:.25rem; color:var(--profile-muted); font-size:.76rem; line-height:1.5; }
.theme-control { position:relative; flex:0 0 46px; width:46px; height:26px; padding:3px; border:0; border-radius:999px; background:var(--profile-line); cursor:pointer; transition:background .2s ease; }
.theme-control[aria-checked='true'] { background:var(--bk-accent,#193819); }
.theme-control span { display:block; width:20px; height:20px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgb(0 0 0 / 18%); transition:transform .2s ease; }
.theme-control[aria-checked='true'] span { transform:translateX(20px); }
.secondary-action { flex:0 0 auto; padding:.55rem .75rem; border:1px solid var(--profile-line); border-radius:8px; color:var(--profile-text); background:var(--profile-panel); font:inherit; font-size:.74rem; font-weight:700; cursor:pointer; }
.back-link { display:inline-block; color:var(--profile-text); font-size:.83rem; text-decoration:none; }
.back-link:hover { text-decoration:underline; text-underline-offset:3px; }
.signout-action { display:block; margin-top:1rem; padding:0; border:0; color:#b34b40; background:transparent; font:inherit; font-size:.82rem; font-weight:700; cursor:pointer; }
.profile-feedback { margin:1rem 0 0; font-size:.84rem; }
.success { color:#57946b; } .error { color:#c15a50; }
@media(max-width:760px) { .profile-layout { grid-template-columns:1fr; } .profile-main { width:min(100% - 2rem,620px); } }
@media(max-width:420px) { .security-row { align-items:flex-start; flex-direction:column; } }
</style>

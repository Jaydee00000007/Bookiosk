<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from '../services/firebaseAuth'
const router = useRouter()
const { signUp } = useFirebaseAuth()
const fullname = ref('')
const email = ref('')
const password = ref('')
const selectedGenres = ref([])
const agreedToTerms = ref(false)
const statusMessage = ref('')
const loading = ref(false)
const genres = ['Fiction', 'Poetry', 'History', 'Folktale', 'Politics', 'Biography']
function selectGenre(genre) {
  selectedGenres.value = selectedGenres.value.includes(genre)
    ? selectedGenres.value.filter(item => item !== genre)
    : [...selectedGenres.value, genre]
}
async function handleSubmit() {
  loading.value = true
  statusMessage.value = ''
  try {
    await signUp({ name: fullname.value, email: email.value, password: password.value })
    localStorage.setItem('bookiosk-reading-preferences', JSON.stringify(selectedGenres.value))
    statusMessage.value = 'Your account is ready. Welcome to Bookiosk!'
    await router.push({ name: 'home', hash: '#myshelf' })
  } catch (error) {
    statusMessage.value = error.message || 'Unable to create your account. Please try again.'
  } finally { loading.value = false }
}
function clearStatus() { statusMessage.value = '' }
</script>

<template>
  <main class="signup">
    <section class="sectionA">
      <div class="sec1">
        <RouterLink class="logo" to="/" aria-label="Bookiosk home">
          <img src="/bookiosk-logo.svg" alt="Bookiosk">
        </RouterLink>
        <div class="hero">
          <h1>Build a shelf of <span>stories you love</span></h1>
          <p>Save books, shape reading lists around your taste, and discover authors from across the continent.</p>
        </div>
        <div class="spotlight-tile">
          <div class="author-initials" aria-hidden="true">CA</div>
          <div class="author">
            <span>Author spotlight</span>
            <h2>Chimamanda Ngozi Adichie</h2>
            <p>Novelist and storyteller</p>
          </div>
        </div>
      </div>
    </section>

    <section class="sectionB">
      <div class="sec2">
        <nav class="partA" aria-label="Account navigation">
          <RouterLink to="/">Back to home</RouterLink>
          <p>Already have an account? <RouterLink to="/signin">Sign in</RouterLink></p>
        </nav>

        <div class="partB">
          <div class="signUp-form">
            <header class="form-heading">
              <p class="eyebrow">Start your shelf</p>
              <h2>Create a free account.</h2>
            </header>

            <button class="google-signup" type="button" disabled>
              Google sign-up isn't configured yet
            </button>
            <p class="usemail">or use your email</p>

            <form @submit.prevent="handleSubmit" @input="clearStatus">
              <div class="input-part">
                <label for="signup-fullname">Full name</label>
                <input
                  id="signup-fullname"
                  v-model="fullname"
                  type="text"
                  name="name"
                  autocomplete="name"
                  placeholder="Your name"
                  required
                >
              </div>

              <div class="input-part">
                <label for="signup-email">Email</label>
                <input
                  id="signup-email"
                  v-model="email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  required
                >
              </div>

              <div class="input-part">
                <label for="signup-password">Password</label>
                <input
                  id="signup-password"
                  v-model="password"
                  type="password"
                  name="password"
                  autocomplete="new-password"
                  placeholder="At least 8 characters"
                  minlength="8"
                  required
                >
              </div>

              <fieldset class="text-part">
                <legend>What do you love to read? <span>(optional)</span></legend>
                <p class="note">Pick a few to shape your reading lists.</p>
                <ul>
                  <li v-for="genre in genres" :key="genre">
                    <button
                      class="p-genre"
                      :class="{ active: selectedGenres.includes(genre) }"
                      type="button"
                      :aria-pressed="selectedGenres.includes(genre)"
                      @click="selectGenre(genre)"
                    >
                      {{ genre }}
                    </button>
                  </li>
                </ul>
              </fieldset>

              <label class="agreemen" for="signup-terms">
                <input
                  id="signup-terms"
                  v-model="agreedToTerms"
                  type="checkbox"
                  required
                >
                I agree to the Terms and Privacy Policy.
              </label>

              <button class="submit-button" type="submit">Create account</button>
              <p v-if="statusMessage" class="form-status" role="status">
                {{ statusMessage }}
              </p>
            </form>
          </div>
        </div>

        <footer class="partC">Book data from the Google Books API.</footer>
      </div>
    </section>
  </main>
</template>

<style scoped>
    .signup{
        display:flex;
        flex-direction: row; 
        flex-wrap: wrap;
        width: 100%;
        height: 100vh;

        .sectionA{
            width: 50%;
            background-color: #052E16;
            margin: 0;
            padding: 0;
        }

        .sec1{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 30px;
            height: 100vh;
            
            
            .logo img{
                width: 150px;
            }

            .hero{
                h2{
                    font-size: 50px;
                    font-weight: bolder;
                    text-wrap: wrap;
                    width: 430px;
                    span{
                        color: orange;
                    }
                }
            }

            .spotlight-tile{
                display: flex;
                flex-direction: row;
                border: 1px solid rgba(0, 0, 0, 0.137);
                width: 80%;
                padding: 5px 10px;
                border-radius: 10px;

                .author-initials{
                    border-radius: 50%;
                    text-align: center;
                }
                .author{
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }

    .sectionB{
        width: 50%;
        background-color: #FAF9F5;
        
        

        .sec2{
            display: flex;
            flex-direction: column;
            padding: 20px 20px;
            text-align: center;
            gap: 5px;
            height: 100vh;

        .partA{
            display: flex;
            justify-content: space-between;
            align-self: center;
            width: 100%;
            text-wrap: nowrap;
            font-size: small;

        }
        .partB{
            display: flex;
            justify-content: space-between;
            width: 0%;
            margin: 0 auto; 
            text-wrap: nowrap;
            font-size: small;

            .signUp-form{
                display: flex;
                width: 50%;
                flex-direction: column;
                gap: 1px;
                align-items: center;    
                text-align: start;
                

                .big{
                    font-size: 30px;
                    font-weight: bolder;
                    text-align: start;
                    margin-right: 60px;
                    span{
                        color: rgb(33, 92, 33);
                    }
                }

                

                .bfore-form{
                    display: flex;
                    flex-direction: column;
                    gap: 0px;
                    width: 100%;
                    align-items: center;

                    .google-signup button{
                        background-color: #e7dede;
                        color: black;
                        width: 100%;
                        border-radius: 5px;
                        padding: 10px 75px;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 12px;
                    }
                }

                form{
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                    gap: 10px;
                    text-align: start;

                    .input-part{
                        display: flex;              
                        flex-direction: column;
                        width: 100%;
                        padding: 0px;
                        margin: 0px;
                        gap: 3px;
                    }

                    input[type="text"],
                    input[type="email"],
                    input[type="password"]{
                        padding: 10px;
                        border-radius: 10px;
                        border: 1px solid #ccc;
                        width: 100%;
                        height: 15px;
                    }

                    label{
                        font-size: small;
                        color: black;
                    }

                    button[type="submit"]{
                        background-color: orange;
                        color: white;
                        width: 100%;
                        border-radius: 5px;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                    }

                    .text-part{
                        display: flex;
                        margin-top: -20px;
                        flex-direction: column;
                        flex-wrap: wrap;
                        gap: 10px;
                        align-items: start;

                        .top-text{
                            .note{
                                font-size: small;
                                color: gray;
                            };
                        }

                        p{
                            text-wrap: nowrap;
                            span{
                                font-size: small;
                                color: gray;
                                margin-left: 5px;
                            }
                        }

                        ul{
                            display: flex;
                            flex-direction: row;
                            flex-wrap: wrap;
                            gap: 10px;
                            list-style-type: none;
                            padding: 0;
                            margin: 0;

                            li{
                                background-color: #ccc;
                                color: #000000;
                                padding: 5px 10px;
                                border-radius: 15px;
                                cursor: pointer;
                                font-size: small;

                                .p-genre.active {
                                    background-color: #052E16;
                                    color: #ffffff;
                                }
                            }
                        }
                    }
                }
            }
        }
        .partC{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: small;
            color: gray;
        }
    }
    }
    .usemail{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        text-wrap: nowrap;
        gap: 10px;
        hr{
            color: gray;
            width: 75px;
            padding: 0%;
            margin: 0%;
        }
    }

    .signup {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        height: auto;
        min-height: 100vh;
    }

    .signup .sectionA,
    .signup .sectionB {
        width: auto;
        min-width: 0;
        box-sizing: border-box;
    }

    .signup .sec1 {
        min-height: 100vh;
        height: auto;
        box-sizing: border-box;
    }

    .signup .sectionB .sec2 {
        width: 100%;
        max-width: 540px;
        min-height: 100vh;
        height: auto;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .signup .sectionB .sec2 .partA {
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
    }

    .signup .sectionB .sec2 .partA p {
        margin: 0;
    }

    .signup .sectionB .sec2 .partB {
        width: 100%;
        min-width: 0;
        flex: 1;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    .signup .sectionB .sec2 .partB .signUp-form {
        width: 100%;
        max-width: 400px;
        align-items: stretch;
        box-sizing: border-box;
        gap: 1rem;
    }

    .signup .sectionB .sec2 .partB .signUp-form form {
        width: 100%;
        box-sizing: border-box;
        gap: 1rem;
    }

    .signup .sectionB .sec2 .partB .signUp-form form input[type="text"],
    .signup .sectionB .sec2 .partB .signUp-form form input[type="email"],
    .signup .sectionB .sec2 .partB .signUp-form form input[type="password"] {
        width: 100%;
        min-height: 44px;
        height: auto;
        box-sizing: border-box;
    }

    .signup .hero h1 {
        max-width: 480px;
        font-size: clamp(2.5rem, 5vw, 4rem);
        line-height: 1.05;
    }

    .signup .hero h1 span {
        display: block;
        color: orange;
    }

    .signup .spotlight-tile {
        align-items: center;
        gap: 1rem;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.06);
    }

    .signup .author-initials {
        display: grid;
        flex: 0 0 44px;
        width: 44px;
        height: 44px;
        place-items: center;
        color: #052e16;
        background: #f5f2eb;
        font-weight: 700;
    }

    .signup .author h2,
    .signup .author p {
        margin: 0.25rem 0 0;
        color: #fff;
    }

    .signup .form-heading .eyebrow {
        margin: 0 0 0.4rem;
        color: #52714f;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .signup .form-heading h2 {
        margin: 0;
        color: #193819;
        font-size: 2rem;
    }

    .signup .google-signup {
        min-height: 44px;
        border: 1px solid #d5d9d3;
        border-radius: 8px;
        color: #596059;
        background: #ebece8;
        cursor: not-allowed;
    }

    .signup .text-part {
        min-width: 0;
        margin: 0;
        padding: 0;
        border: 0;
    }

    .signup .text-part legend {
        padding: 0;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .signup .text-part legend span,
    .signup .text-part .note {
        color: #667066;
        font-size: 0.8rem;
        font-weight: 400;
    }

    .signup .sectionB .sec2 .partB .signUp-form form .text-part ul {
        gap: 0.5rem;
        margin-top: 0.75rem;
    }

    .signup .sectionB .sec2 .partB .signUp-form form .text-part ul li {
        display: block;
        width: auto;
        height: auto;
        margin: 0;
        padding: 0;
        border: 0;
        background: transparent;
    }

    .signup .p-genre {
        padding: 0.45rem 0.75rem;
        border: 1px solid #c8d0c5;
        border-radius: 999px;
        color: #193819;
        background: #fff;
        font: inherit;
        font-size: 0.85rem;
        cursor: pointer;
    }

    .signup .p-genre.active {
        border-color: #193819;
        color: #fff;
        background: #193819;
    }

    .signup .agreemen {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .signup .agreemen input {
        accent-color: #193819;
    }

    .signup .submit-button {
        min-height: 44px;
        border: 0;
        border-radius: 25px;
        color: #fff;
        background: #193819;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
    }

    .signup .form-status {
        margin: 0;
        color: #193819;
        line-height: 1.5;
    }

    .signup :focus-visible {
        outline: 3px solid #d87b18;
        outline-offset: 3px;
    }

    @media (max-width: 760px) {
        .signup {
            grid-template-columns: 1fr;
        }

        .signup .sec1 {
            min-height: 380px;
        }

        .signup .sectionB .sec2 {
            min-height: auto;
        }
    }
</style>
<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const keepSignedIn = ref(false)
const statusMessage = ref('')

function handleSubmit() {
  statusMessage.value =
    'Your details are valid, but sign-in is not connected to an authentication service yet. Nothing was sent or saved.'
}

function clearStatus() {
  statusMessage.value = ''
}
</script>

<template>
  <main class="signin">
    <section class="sectionA">
      <div class="sec1">
        <RouterLink class="logo" to="/" aria-label="Bookiosk home">
          <img src="/bookiosk-logo.svg" alt="Bookiosk">
        </RouterLink>
        <div class="hero">
          <h1>Stories from Nigeria and <span>across Africa</span></h1>
          <p>Sign in to pick up your reading list right where you left it.</p>
        </div>
        <div class="spotlight-tile">
          <div class="author-initials" aria-hidden="true">B</div>
          <div class="author">
            <span>Made for curious readers</span>
            <h2>Find your next favorite story.</h2>
          </div>
        </div>
      </div>
    </section>

    <section class="sectionB">
      <div class="sec2">
        <nav class="partA" aria-label="Account navigation">
          <RouterLink to="/">Back to home</RouterLink>
          <p>New to Bookiosk? <RouterLink to="/signup">Create an account</RouterLink></p>
        </nav>

        <div class="partB">
          <div class="signUp-form">
            <header class="form-heading">
              <p class="eyebrow">Welcome back</p>
              <h2>Sign in to your shelf.</h2>
            </header>

            <button class="google-signup" type="button" disabled>
              Google sign-in isn't configured yet
            </button>
            <p class="usemail">or use your email</p>

            <form @submit.prevent="handleSubmit" @input="clearStatus">
              <div class="input-part">
                <label for="signin-email">Email</label>
                <input
                  id="signin-email"
                  v-model="email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  required
                >
              </div>

              <div class="input-part">
                <div class="password-top">
                  <label for="signin-password">Password</label>
                  <RouterLink to="/forgotpassword">Forgot password?</RouterLink>
                </div>
                <input
                  id="signin-password"
                  v-model="password"
                  type="password"
                  name="password"
                  autocomplete="current-password"
                  placeholder="Your password"
                  required
                >
              </div>

              <label class="signedin" for="keep-signed-in">
                <input
                  id="keep-signed-in"
                  v-model="keepSignedIn"
                  type="checkbox"
                >
                Keep me signed in on this device
              </label>

              <button class="submit-button" type="submit">Sign in</button>
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
    .signin{
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
                    width: 400px;
                    gap: 10px;
                    text-align: start;
                    

                    .input-part{
                        display: flex;              
                        flex-direction: column;
                        width: 100%;
                        padding: 0px;
                        margin: 0px;
                        gap: 3px;

                        .password-top{
                            display: flex;
                            justify-content: space-between;
                        }
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

    .signin {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        height: auto;
        min-height: 100vh;
    }

    .signin .sectionA,
    .signin .sectionB {
        width: auto;
        min-width: 0;
        box-sizing: border-box;
    }

    .signin .sec1 {
        min-height: 100vh;
        height: auto;
        box-sizing: border-box;
    }

    .signin .sectionB .sec2 {
        width: 100%;
        max-width: 540px;
        min-height: 100vh;
        height: auto;
        margin: 0 auto;
        box-sizing: border-box;
    }

    .signin .sectionB .sec2 .partA {
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
    }

    .signin .sectionB .sec2 .partB {
        width: 100%;
        min-width: 0;
        flex: 1;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
    }

    .signin .sectionB .sec2 .partB .signUp-form {
        width: 100%;
        max-width: 400px;
        align-items: stretch;
        box-sizing: border-box;
        gap: 1rem;
    }

    .signin .sectionB .sec2 .partB .signUp-form .bfore-form {
        align-items: stretch;
    }

    .signin .sectionB .sec2 .partB .signUp-form .google-signup button {
        box-sizing: border-box;
        width: 100%;
        padding: 12px;
        cursor: not-allowed;
    }

    .signin .sectionB .sec2 .partB .signUp-form form {
        width: 100%;
        box-sizing: border-box;
        gap: 1rem;
    }

    .signin .sectionB .sec2 .partB .signUp-form form input[type="email"],
    .signin .sectionB .sec2 .partB .signUp-form form input[type="password"] {
        width: 100%;
        min-height: 44px;
        height: auto;
        box-sizing: border-box;
    }

    .signin .hero h1 {
        max-width: 480px;
        font-size: clamp(2.5rem, 5vw, 4rem);
        line-height: 1.05;
    }

    .signin .hero h1 span {
        display: block;
        color: orange;
    }

    .signin .spotlight-tile {
        align-items: center;
        gap: 1rem;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.06);
    }

    .signin .author-initials {
        display: grid;
        flex: 0 0 44px;
        width: 44px;
        height: 44px;
        place-items: center;
        color: #052e16;
        background: #f5f2eb;
        font-weight: 700;
    }

    .signin .author h2,
    .signin .author p {
        margin: 0.25rem 0 0;
        color: #fff;
    }

    .signin .form-heading .eyebrow {
        margin: 0 0 0.4rem;
        color: #52714f;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .signin .form-heading h2 {
        margin: 0;
        color: #193819;
        font-size: 2rem;
    }

    .signin .google-signup:disabled {
        border: 1px solid #d5d9d3;
        border-radius: 8px;
        color: #596059;
        background: #ebece8;
        opacity: 1;
    }

    .signin .signedin {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .signin .signedin input {
        accent-color: #193819;
    }

    .signin .submit-button {
        min-height: 44px;
        border: 0;
        border-radius: 25px;
        color: #fff;
        background: #193819;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
    }

    .signin .form-status {
        margin: 0;
        color: #193819;
        line-height: 1.5;
    }

    .signin :focus-visible {
        outline: 3px solid #d87b18;
        outline-offset: 3px;
    }

    @media (max-width: 760px) {
        .signin {
            grid-template-columns: 1fr;
        }

        .signin .sec1 {
            min-height: 380px;
        }

        .signin .sectionB .sec2 {
            min-height: auto;
        }
    }
</style>
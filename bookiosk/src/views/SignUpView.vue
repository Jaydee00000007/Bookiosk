<script setup>
</script>

<template>
    <div class="signup">
         <div class="sectionA">
                <div class="logo"><img src="/bookiosk-logo.svg" alt="logo"></div>
                <div class="hero">
                    <h2>Build a shelf of <span>stories you love</span></h2>
                    <p>Save books, get reading lists shaped around your taste, and discover authors from every corner of the continent.</p>
                </div>
                <div class="spotlight">
                    <div class="spotlight-tile">
                        <div class="author-initials"></div>
                        <div class="author">
                            <span>author spotlight</span>
                            <h4>{{ authorname }}</h4>
                            <span class="authorsbook">{{ authorsbooks }}</span>
                        </div>
                    </div>
                </div>
         </div>
         <div class="sectionB">
                <div class="partA">
                    <div class="home-btn">
                        <RouterLink :to="{ path: '/mainview'}">Back to home</RouterLink>
                    </div>
                    <div class="signIn-btn">
                        Already have an account? <RouterLink :to="{ path: '/signin'}">Sign in</RouterLink>
                    </div>
                </div>
                <div class="partB">
                    <div class="signUp-form">
                        <h2>Start your shelf</h2>
                        <p>Create a free account in under a minute.</p>
                        <div class="google-signup">
                            <button>Sign up with Google</button>
                        </div>
                        <div class="usemail"><hr>or use your email<hr></div>
                        <form>
                            <label for="fullname">Full Name</label><br>
                            <input type="text" placeholder="Your name" vmodel="fullname" /><br>

                            <label for="email">Email</label><br>
                            <input type="email" placeholder="you@example.com" vmodel="email" /><br>

                            <label for="password">Password</label><br>
                            <input type="password" placeholder="Create a password" vmodel="password" required/><br>
                            <span>Use at least 8 characters.</span>

                            <p>What do you love to read</p><sapn>(optional)</sapn>
                            <span>Pick a few and we'll tune your reading lists.</span>
                            <ul>
                                <li vmodel="genre">Fiction</li>
                                <li vmodel="genre">Poetry</li>
                                <li vmodel="genre">History</li>
                                <li vmodel="genre">Politics</li>
                                <li vmodel="genre">Biography</li>
                                <li vmodel="genre">Folktales</li>
                            </ul>
                            <input type="radio"><span>I agree to the Terms and Privacy Policy.</span>
                            <button type="submit">Create account</button>
                        </form>
                    </div>
                </div>
                <div class="partC"><span>Book data from the Google Books API.</span></div>
          </div>
    </div>
</template>

<style scoped>
    .signup{
        display:flex;
        flex-direction: row;
        padding: 20px;
        max-width: 100%;
        max-height: 100vh;

        .sectionA{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            width: 50%;
            gap: 100px;

            .logo img{
                width: 150px;
            }

            .hero{
                h2{
                    font-size: 50px;
                    font-weight: bolder;
                    text-wrap: wrap;
                    width: 450px;
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
        display: flex;
        flex-direction: column;
        max-width: 50%;

        .partA{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

        }
        .partB{
            
        }
    }
    .usemail{
        hr{
            width: 100px;
        }
    }
</style>
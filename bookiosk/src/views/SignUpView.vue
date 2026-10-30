<script setup>
</script>

<template>
    <div class="signup">
         <div class="sectionA">
                <div class="sec1">
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
         </div>
         <div class="sectionB">
            <div class="sec2">
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
                        
                        <p><span class="big">Start your <span class="small">shelf</span></span><br>Create a free account in under a minute.</p>
                        <div class="google-signup">
                            <button>Sign up with Google</button>
                        </div>
                        <div class="usemail"><hr>or use your email<hr></div>
                        <br>
                        <form>
                            <div class="input-part">
                                <label for="fullname">Full Name</label>
                                <input type="text" placeholder="Your name" vmodel="fullname" />
                            </div>

                            <div class="input-part">
                                <label for="email">Email</label>
                                <input type="email" placeholder="you@example.com" vmodel="email" />
                            </div>

                            <div class="input-part">
                                <label for="password">Password</label>
                                <input type="password" placeholder="Create a password" vmodel="password" required/><br>
                                <!-- <span>Use at least 8 characters.</span> -->
                            </div>

                            <p>What do you love to read</p><span>(optional)</span>
                            <span>Pick a few and we'll tune your reading lists.</span>
                            <ul>
                                <li vmodel="genre">Fiction</li>
                            </ul>
                            <input type="checkbox"><span>I agree to the Terms and Privacy Policy.</span>
                            <button type="submit">Create account</button>
                        </form>
                    </div>
                </div>
                <div class="partC"><span>Book data from the Google Books API.</span></div>
            </div>
         </div>
    </div>
</template>

<style scoped>
    .signup{
        display:flex;
        flex-direction: row; 
        width: 100%;
        height: 100vh;

        .sectionA{
            width: 50%;
            background-color: aquamarine;
            margin: 0;
            padding: 0;
        }

        .sec1{
            display: flex;
            flex-direction: column;
            gap: 90px;
            padding: 20px;
            height: 100%;
            

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
        width: 50%;
        background-color: #ccc;

        .sec2{
        display: flex;
        flex-direction: column;
        padding: 20px;
        text-align: center;
        gap: 20px;

        .partA{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            text-wrap: nowrap;
            font-size: small;

        }
        .partB{
            display: flex;
            justify-content: space-between;
            align-items: start;

            .signUp-form{
                display: flex;
                flex-direction: column;
                gap: 1px;
                width: 100%;
                

                .big{
                    font-size: 30px;
                    font-weight: bolder;
                    text-align: start;
                    span{
                        color: rgb(33, 92, 33);
                    }
                }

                .google-signup button{
                    background-color: #fff;
                    color: #000;
                    align-items: center;
                    width: 50%;
                    border-radius: 25px;
                    padding: 10px 20px;
                    border: 1px solid #ccc;
                    cursor: pointer;
                }

                form{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    text-align: start;

                    .input-part{
                        display: flex;
                        justify-content: space-between;               
                        flex-direction: column;
                        width: 50%;
                        padding: 0px;
                        margin: 0px;
                        gap: 5px;
                    }

                    input[type="text"],
                    input[type="email"],
                    input[type="password"]{
                        padding: 10px;
                        border-radius: 10px;
                        border: 1px solid #ccc;
                        width: 100%;
                        height: 20px;
                    }

                    button[type="submit"]{
                        background-color: orange;
                        color: white;
                        border-radius: 5px;
                        padding: 10px 20px;
                        border: none;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    }
    .usemail{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap:12px;
        hr{
            width: 10%;
            padding: 0%;
            margin: 0%;
        }
    }
</style>
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
                        
                        <div class="bfore-form">
                            <div class="shelf">
                                <p><span class="big">Start your <span class="small">shelf</span></span><br>Create a free account in under a minute.</p>
                            </div>
                            <div class="google-signup">
                                <button>Sign up with Google</button>
                            </div>
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

                            <div class="text-part">
                                <p>What do you love to read?<span>(optional)</span></p>
                                <span>Pick a few and we'll tune your reading lists.</span><br>
                                <ul>
                                    <li vmodel="genre" @click="selectGenre('Fiction')">Fiction</li>
                                    <li vmodel="genre" @click="selectGenre('Poetry')">Poetry</li>
                                    <li vmodel="genre" @click="selectGenre('History')">History</li>
                                    <li vmodel="genre" @click="selectGenre('Folktale')">Folktale</li>
                                    <li vmodel="genre" @click="selectGenre('Politics')">Politics</li>
                                    <li vmodel="genre" @click="selectGenre('Biography')">Biography</li>
                                </ul>
                            </div>
                                <div class="agreemen">
                                    <input type="checkbox" vmodel="agreedToTerms">
                                    <label for="agreedToTerms">I agree to the Terms and Privacy Policy.</label>
                                </div>
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
            align-items: center;
            width: 100%;
            text-wrap: nowrap;
            font-size: small;

        }
        .partB{
            /* display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px 30px;
            width: 100%; */

            .signUp-form{
                display: flex;
                flex-direction: column;
                gap: 1px;
                align-self: center;    
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

                .bfore-form{
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: center;

                    button{
                        width: 100%;
                    }
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
                        height: 15px;
                    }

                    label{
                        font-size: small;
                        color: black;
                    }

                    button[type="submit"]{
                        background-color: orange;
                        color: white;
                        border-radius: 5px;
                        padding: 10px 20px;
                        border: none;
                        cursor: pointer;
                    }

                    .text-part{
                        display: flex;
                        flex-direction: column;
                        flex-wrap: wrap;
                        gap: 10px;
                        align-items: center;

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

                                &:active{
                                    background-color: #052E16;
                                    color: #ffffff;
                                }
                            }
                        }
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
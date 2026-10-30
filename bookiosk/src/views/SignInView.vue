<script setup>

</script>

<template>
    <div class="signin">
         <div class="sectionA">
                <div class="sec1">
                    <div class="logo"><img src="/bookiosk-logo.svg" alt="logo"></div>
                        <div class="hero">
                            <h2>Stories from Nigeria and<span>across Africa</span></h2>
                            <p>Sign in to pick up your reading list right where you left it.</p>
                        </div>
                        <div class="spotlight">
                            <div class="spotlight-tile">
                                <div class="bookcover"></div>
                                <div class="author">
                                    <span>book of the week</span>
                                    <h4>{{ authorsbook }}</h4>
                                    <span class="authorsbook">{{ authorsname }}</span>
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
                        New to Bookiosk? <RouterLink :to="{ path: '/signup'}">Create an account</RouterLink>
                    </div>
                </div>
                <div class="partB">
                    <div class="signUp-form">
                        
                        <div class="bfore-form">
                            <div class="shelf">
                                <p><span class="big">Welcome <span class="small">back</span></span><br>Sign in to your shelf.</p>
                            </div>
                            <div class="google-signup">
                                <button>Sign up with Google</button>
                            </div>
                        </div>
                        <div class="usemail"><hr>or use your email<hr></div>
                        <br>
                        <form>
                            <div class="input-part">
                                <label for="email">Email</label>
                                <input type="email" placeholder="you@example.com" vmodel="email" />
                            </div>

                            <div class="input-part">
                                <div class="password-top">
                                    <label for="password">Password</label>
                                    <RouterLink :to="{ path: '/forgotpassword'}">Forgot password?</RouterLink>
                                </div>
                                <input type="password" placeholder="Your password" vmodel="password" required/><br>
                                <!-- <span>Use at least 8 characters.</span> -->
                            </div>

                            
                                <div class="signedin">
                                    <input type="checkbox" vmodel="agreedToTerms">
                                    <label for="agreedToTerms">Keep me signed in on this device</label>
                                </div>
                                <button type="submit">Sign in</button>
                        </form>
                    </div>
                </div>
                <div class="partC"><span>Book data from the Google Books API.</span></div>
            </div>
         </div>
    </div>
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
</style>
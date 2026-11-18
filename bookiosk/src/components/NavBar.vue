<script setup>
    import { ref } from 'vue'

    const menuOpen = ref(false)
</script>

<template>
    <div class="navbarP fixed-top">
        <div class="logoP">
                <RouterLink :to="{ path: '/mainview' }"><img src="/bookiosk-logo.svg" alt="Logo" class="logoT"></RouterLink>
        </div>

            <button
                class="menu-toggle"
                type="button"
                :aria-expanded="menuOpen"
                aria-controls="primary-menu"
                aria-label="Toggle navigation"
                @click="menuOpen = !menuOpen">
                <span></span><span></span><span></span>
            </button>

            <div id="primary-menu" class="nav-content animated-element"  :class="{ open: menuOpen }">
                <ul class="nav-link">
                    <li>
                        <RouterLink :to="{ path: '/', hash: '#search-space' }">Search</RouterLink>
                    </li>
                    <li>
                        <RouterLink :to="{ path: '/', hash: '#browse' }">Browse</RouterLink>
                    </li>
                    <li>
                        <RouterLink :to="{ path: '/mainview', hash: '#featured' }">Featured</RouterLink>
                    </li>
                    <li>
                        <RouterLink :to="{ path: '/', hash: '#myshelf' }">My Shelf</RouterLink>
                    </li>

                    <li>
                        <div class="profile-details">
                            <span>{{ image }}</span>
                            <span>{{ Username }}</span>
                        </div> 
                    </li>
                    <li>
                        <!-- From Uiverse.io by RiccardoRapelli --> 
                            <label class="switch">
                                <input id="input" type="checkbox" checked="darkTheme" />
                                <div class="slider round">
                                    <div class="sun-moon">
                                    <svg id="moon-dot-1" class="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="moon-dot-2" class="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="moon-dot-3" class="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="light-ray-1" class="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="light-ray-2" class="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="light-ray-3" class="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>

                                    <svg id="cloud-1" class="cloud-dark" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-2" class="cloud-dark" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-3" class="cloud-dark" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-4" class="cloud-light" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-5" class="cloud-light" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-6" class="cloud-light" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    </div>
                                    <div class="stars">
                                    <svg id="star-1" class="star" viewBox="0 0 20 20">
                                        <path
                                        d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                        ></path>
                                    </svg>
                                    <svg id="star-2" class="star" viewBox="0 0 20 20">
                                        <path
                                        d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                        ></path>
                                    </svg>
                                    <svg id="star-3" class="star" viewBox="0 0 20 20">
                                        <path
                                        d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                        ></path>
                                    </svg>
                                    <svg id="star-4" class="star" viewBox="0 0 20 20">
                                        <path
                                        d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                        ></path>
                                    </svg>
                                    </div>
                                </div>
                            </label>

                    </li>
                </ul>
    </div>
            
    </div>
</template>

<style scoped>
    .navbarP{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 3px 10px;
        background-color: #faf9f5;
        border-bottom: 2px solid #bebcb2ee;

        .logoT{
            max-width: 130px;
            max-height: auto;
        }

        .nav-content{
            ul{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                gap: 20px;

                li{
                    list-style-type: none;
                    font-family: plus-jakarta-sans, sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;

                    a{
                        text-decoration: none;
                        color:#666666;

                         &:hover{
                        color: orangered;
                         }
                    }

                    /* From Uiverse.io by RiccardoRapelli */ 
                        .switch {
                        position: relative;
                        display: inline-block;
                        width: 40px;
                        height: 24px;
                        }

                        .switch #input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                        }

                        .slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: #ccc;
                        -webkit-transition: 0.4s;
                        transition: 0.4s;
                        z-index: 0;
                        overflow: hidden;
                        }

                        .sun-moon {
                        position: absolute;
                        content: "";
                        height: 16px;
                        width: 16px;
                        left: 4px;
                        bottom: 4px;
                        background-color: #193819;
                        -webkit-transition: 0.4s;
                        transition: 0.4s;
                        }

                        #input:checked + .slider {
                        background-color: #193819;
                        }

                        #input:focus + .slider {
                        box-shadow: 0 0 1px #2196f3;
                        }

                        #input:checked + .slider .sun-moon {
                        -webkit-transform: translateX(26px);
                        -ms-transform: translateX(26px);
                        transform: translateX(16px);
                        background-color: orangered;
                        -webkit-animation: rotate-center 0.6s ease-in-out both;
                        animation: rotate-center 0.6s ease-in-out both;
                        }

                        .moon-dot {
                        opacity: 0;
                        transition: 0.4s;
                        fill: gray;
                        }

                        #input:checked + .slider .sun-moon .moon-dot {
                        opacity: 1;
                        }

                        .slider.round {
                        border-radius: 34px;
                        }

                        .slider.round .sun-moon {
                        border-radius: 50%;
                        }

                        #moon-dot-1 {
                        left: 10px;
                        top: 3px;
                        position: absolute;
                        width: 6px;
                        height: 6px;
                        z-index: 4;
                        }

                        #moon-dot-2 {
                        left: 2px;
                        top: 10px;
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        z-index: 4;
                        }

                        #moon-dot-3 {
                        left: 16px;
                        top: 18px;
                        position: absolute;
                        width: 3px;
                        height: 3px;
                        z-index: 4;
                        }

                        #light-ray-1 {
                        left: -8px;
                        top: -8px;
                        position: absolute;
                        width: 43px;
                        height: 43px;
                        z-index: -1;
                        fill: white;
                        opacity: 10%;
                        }

                        #light-ray-2 {
                        left: -50%;
                        top: -50%;
                        position: absolute;
                        width: 55px;
                        height: 55px;
                        z-index: -1;
                        fill: white;
                        opacity: 10%;
                        }

                        #light-ray-3 {
                        left: -18px;
                        top: -18px;
                        position: absolute;
                        width: 60px;
                        height: 60px;
                        z-index: -1;
                        fill: white;
                        opacity: 10%;
                        }

                        .cloud-light {
                        position: absolute;
                        fill: #eee;
                        animation-name: cloud-move;
                        animation-duration: 6s;
                        animation-iteration-count: infinite;
                        }

                        .cloud-dark {
                        position: absolute;
                        fill: #ccc;
                        animation-name: cloud-move;
                        animation-duration: 6s;
                        animation-iteration-count: infinite;
                        animation-delay: 1s;
                        }

                        #cloud-1 {
                        left: 30px;
                        top: 15px;
                        width: 40px;
                        }

                        #cloud-2 {
                        left: 44px;
                        top: 10px;
                        width: 20px;
                        }

                        #cloud-3 {
                        left: 18px;
                        top: 24px;
                        width: 30px;
                        }

                        #cloud-4 {
                        left: 36px;
                        top: 18px;
                        width: 40px;
                        }

                        #cloud-5 {
                        left: 48px;
                        top: 14px;
                        width: 20px;
                        }

                        #cloud-6 {
                        left: 22px;
                        top: 26px;
                        width: 30px;
                        }

                        @keyframes cloud-move {
                        0% {
                            transform: translateX(0px);
                        }

                        40% {
                            transform: translateX(4px);
                        }

                        80% {
                            transform: translateX(-4px);
                        }

                        100% {
                            transform: translateX(0px);
                        }
                        }

                        .stars {
                        transform: translateY(-32px);
                        opacity: 0;
                        transition: 0.4s;
                        }

                        .star {
                        fill: white;
                        position: absolute;
                        -webkit-transition: 0.4s;
                        transition: 0.4s;
                        animation-name: star-twinkle;
                        animation-duration: 2s;
                        animation-iteration-count: infinite;
                        }

                        #input:checked + .slider .stars {
                        -webkit-transform: translateY(0);
                        -ms-transform: translateY(0);
                        transform: translateY(0);
                        opacity: 1;
                        }

                        #star-1 {
                        width: 20px;
                        top: 2px;
                        left: 3px;
                        animation-delay: 0.3s;
                        }

                        #star-2 {
                        width: 6px;
                        top: 16px;
                        left: 3px;
                        }

                        #star-3 {
                        width: 12px;
                        top: 20px;
                        left: 10px;
                        animation-delay: 0.6s;
                        }

                        #star-4 {
                        width: 18px;
                        top: 0px;
                        left: 18px;
                        animation-delay: 1.3s;
                        }

                        @keyframes star-twinkle {
                        0% {
                            transform: scale(1);
                        }

                        40% {
                            transform: scale(1.2);
                        }

                        80% {
                            transform: scale(0.8);
                        }

                        100% {
                            transform: scale(1);
                        }
                        }

                   
                }
            }
        }

        .menu-toggle {
            display: none;
            border: 0;
            background: transparent;
            padding: 8px;
            cursor: pointer;
            }
        .menu-toggle span {
            display: block;
            width: 24px;
            height: 2px;
            margin: 5px 0;
            background: #111111;
            }
    }

     @media (max-width: 700px) {
                nav {
                    padding: 0 16px;
                }

                .navbarP{
                    .menu-toggle {
                    display: block;
                }
                .nav-content {
                    display: none;
                    position: absolute;
                    top: 50px;
                    left: 0;
                    right: 0;
                    padding: 18px 16px 20px;
                    flex-direction: column;
                    align-items: stretch;
                    background: #fff;
                    box-shadow: 0 12px 24px rgba(7, 26, 41, 0.22);
                    z-index: 1;


                    .animated-element {
                        animation: backInDown 1s ease-out 0s 1 normal both;
                        transform-origin: center;
                        }

                        @keyframes backInDown {
                        0% { opacity: 0.35; transform: translate3d(0, -198px, 0) scale(0.7); }
                        80% { opacity: 0.75; transform: translate3d(0, 0, 0) scale(0.7); }
                        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
                        }

                        @media (prefers-reduced-motion: reduce) {
                        .animated-element {
                            animation: none !important;
                            transition: none !important;
                        }
                        }

                }
                .nav-content.open {
                    display: flex;
                }
                .nav-link {
                    flex-direction: column;
                    flex-wrap: wrap;
                    padding: 0;
                    align-items: stretch;
                    gap: 0;
                }
                .nav-link li {
                    width: 100%;
                }
                .nav-link li:hover {
                    color: orangered;;
                }
                .nav-link a {
                    display: block;
                    text-wrap: nowrap;
                    padding: 12px 8px;
                }
                .nav-actions {
                    justify-content: stretch;
                }
                .nav-actions button {
                    flex: 1;
                }
                }
                }

</style>
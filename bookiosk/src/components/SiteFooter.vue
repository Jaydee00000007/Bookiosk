<template>
    <div class="site-footer">
        <div class="top-content">
            <div class="partA">
                <div class="logo-image">
                    <img src="/bookiosk-logo.svg" alt="Bookiosk">
                </div>
                <div class="quicklink-title">
                    <h4>Quick Links</h4>
                </div>
                <div class="support-title">
                    <h4>Support</h4>
                </div>
                
            </div>
            <div class="partB">
                <div class="about-bk">
                    <p>Celebrating African literature by bringing Nigerian and continental stories front and centre. Powerered by Google Books.</p>
                </div>
                <div class="quick-links">
                    <ul>
                        <li>
                            <RouterLink :to="{ path: '/', hash: '#search-space' }">Search</RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ path: '/', hash: '#browse' }">Browse</RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ path: '/mainview', hash: '#featured' }">Featured</RouterLink>
                        </li>
                    </ul>
                </div>
                <div class="support-links">
                    <ul>
                        <li>
                            <RouterLink :to="{ path: '/', hash: '#search-space' }">About</RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ path: '/', hash: '#browse' }">Privacy</RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ path: '/mainview', hash: '#featured' }">Suggest a book</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
            <hr>
            <div class="partC">
                <div class="sideA"><p>&copy; Bookiosk. Data provided by Google Books API.</p></div>
                <div class="sideB">Made with love for African stories.</div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
    .site-footer{
        display:flex;
        justify-content: center;
        align-items: center;
        border-top: 2px solid #bebcb2ee;
        width: 100%;
        margin: 0;
        color: #666666;
        background-color: #f5f2eb;

        .top-content{
            align-self: center;
            width: 90%;
            padding: 10px 20px;
        
            .partA{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                
                .logo-image img{
                    max-width: 120px;
                    max-height: auto;
                }
                
                .logo-image,
                .quicklink-title,
                .support-title{
                    width: 100%;
                    text-align: start;
                    
                    h4{
                        font-family: playfair display, serif;
                        color: #193819
                    }
                }
            }

            .partB{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                .about-bk p{
                    text-wrap: wrap;
                    width: 100%;
                    font-size: small;
                    
                }

                .about-bk,
                .quick-links,
                .support-links{
                    width: 100%;
                    
                }

                .quick-links,
                .support-links{
                    ul{
                        display: flex;
                        flex-direction: column;
                        gap: 1px;
                        align-self: flex-start;
                        list-style: none;
                        font-size: small;
                        padding: 0;

                        li a{
                            text-decoration: none;
                            color: #666666;
                        }
                    }
                }
            }

            hr{
                color: #bebcb2ee;
            }

            .partC{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                text-wrap: wrap;
                width: 100%;
                font-size: smaller;
            }
        }
    }
</style>
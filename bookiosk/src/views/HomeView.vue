<script setup>
    import BookSearch from '../components/Search/BookSearch.vue';
    import NavBar from '../components/NavBar.vue'
</script>

<template>
    <div class=homepage>
        <NavBar />
        <div class="main-content">
            <div class="herosection">
                <h1>Stories from Nigeria and <span>across Africa</span></h1>
                <div class="search-space">
                    <BookSearch />
                    <div class="filter-space"></div>
                        <button class="filter-btn">Nigeria</button>
                        <button class="filter-btn">Africa</button>
                        <button class="filter-btn">Global</button>
                    </div>
                    <div class="writter-space">
                        <ul>
                            <li>Writers from Nigeria</li>
                            <li>Writers from Africa</li>
                            <li>Writers from Global</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .main-content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        align-self: center;
        margin-top: 50px;

        .herosection{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            align-self: center;

            h1{
                font-size: 60px;
                text-align: center;
                margin-bottom: 20px;
                width: 70%;
                text-wrap: wrap;

                span{
                    color: #193819;
                }
            }
        }
    }

    .search-space{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70%;
        height: 50px;
        border-radius: 5px;
        align-self: center;
    }
</style>
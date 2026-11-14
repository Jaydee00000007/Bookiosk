<script setup>
        import { ref } from 'vue'
        import { searchBooks } from '../services/googleBooks'
        import BookSearch from '../components/Search/BookSearch.vue';
        import NavBar from '../components/NavBar.vue'
        import BookGrid from '../components/BookGrid.vue'
        import BrowseByGenre from '../components/Search/BrowseByGenre.vue'
        import BrowseByRegion from '../components/Search/BrowseByRegion.vue'
        import BookOfTheWeek from '../components/BookOfTheWeek.vue'
        import AuthorSpotlight from '../components/AuthorSpotlight.vue'
        import MyShelf from '../components/MyShelf.vue';

        const books = ref([])
        const searchLoading = ref(false)
        const searchError = ref('')
        let browseRequestId = 0

        function clearBookList() {
            browseRequestId++
            books.value = []
            searchError.value = ''
            searchLoading.value = false
        }

        async function handleBrowse(query) {
            const requestId = ++browseRequestId
            searchLoading.value = true
            searchError.value = ''

            try {
                const results = await searchBooks(query, { maxResults: 12 })

                if (requestId === browseRequestId) {
                    books.value = results
                }
            } catch (error) {
                if (requestId === browseRequestId) {
                    books.value = []
                    searchError.value = error.message || 'Unable to load books.'
                }
            } finally {
                if (requestId === browseRequestId) {
                    searchLoading.value = false
                }
            }
        }

        function handleSearchResults(results) {
            browseRequestId++
            books.value = results
            searchError.value = ''
        }

        function handleSearchLoadingChange(loading) {
            searchLoading.value = loading
        }

</script>

<template>
    <div class=homepage>
        <NavBar />
        <div class="main-content">
            <div class="herosection">
                <h1>Stories from Nigeria and <span>across Africa</span></h1>
                <div class="search-space" id="search-space">
                    <div class="search-area" id="search-area">
                        <BookSearch
                            @search-results="handleSearchResults"
                            @loading-change="handleSearchLoadingChange"
                        />
                    </div>
                    <div class="filter-space">
                        <button class="filter-btn">Nigeria</button>
                        <button class="filter-btn">Africa</button>
                        <button class="filter-btn">Global</button>
                    </div>
                </div>
            </div>
            <div id="search" class="book-grid glass-card2">
                    <p v-if="searchError" class="search-error" role="alert">
                        {{ searchError }}
                    </p>
                    <BookGrid
                        :books="books"
                        :loading="searchLoading"
                        closable
                        empty-message="Search for books to see them here."
                        @close="clearBookList"
                    />
                </div>
            <BrowseByGenre @browse="handleBrowse" id="browse"/>
            <BrowseByRegion @browse="handleBrowse" />
            <BookOfTheWeek id="featured"/>
            <AuthorSpotlight />
            <MyShelf id="myshelf"/>
        </div>
    </div>
</template>

<style scoped>
    .main-content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 2rem;
        box-sizing: border-box;
        background-color: #faf9f5 ;
        width: 100%;
        min-width: 0;
        min-height: 100vh;
        height: auto;
        border-radius: 5px;
        align-self: center;
        padding: 20px;
        font-family: plus jakarta sans, sans-serif;

        .herosection{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: auto;
            border-radius: 5px;
            align-self: center;
            padding: 20px 0px;
            margin-top: 40px;

            h1{
                font-size: 50px;
                font-family: playfair display, serif;
                font-weight: 700;
                text-align: center;
                margin-bottom: -20px;
                width: 60%;
                text-wrap: wrap;
                span{
                    color: #052E16;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
            }
        }
    }

    .search-space{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80%;
        border-radius: 5px;
        align-self: center;
        padding: 20px 0px;

        .search-area{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            padding: 20px 0px;
        }
        .filter-space{
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: min(100%, 420px);
            height: auto;
            margin-top: -5px;
            border-radius: 35px;
            background-color: #f5f2eb;
            box-sizing: border-box;
            padding: 8px;

            .filter-btn{
                width: 100%;
                min-width: 0;
                height: 30px;
                margin: 0;
                border-radius: 15px;
                border:#193819 0px solid;
                background-color: #f5f2eb;
                font-size: 13px;
                color: #193819;
                cursor: pointer;

                &:hover{
                    background-color: #fff;
                    color: #193819;
                }
            }
        }
    }

    .book-grid{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        background-color: #f5f2Eb ;
        width: 80%;
        max-width: 100%;
        min-width: 0;
        height: auto;
        border-radius: 10px;
        align-self: center;
        border: 2px solid #ccc;
        padding: 20px 10px;
    }
    
     @media (max-width: 700px) {
        .main-content{
            .herosection{
                h1{
                    font-size: 30px;
                    width: 90%;
                    margin-top: -10px;
                }
            }

        }

        .book-grid{
            width: 100%;
        }
    }
</style>
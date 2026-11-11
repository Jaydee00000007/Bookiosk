<script setup>
        import { ref } from 'vue'
        import { searchBooks } from '../services/googleBooks'
        import BookSearch from '../components/Search/BookSearch.vue';
        import NavBar from '../components/NavBar.vue'
        import BookGrid from '../components/BookGrid.vue'
        import BrowseByGenre from '../components/Search/BrowseByGenre.vue'
        import BrowseByRegion from '../components/Search/BrowseByRegion.vue'
        import BookOfTheWeek from '../components/BookOfTheWeek.vue'

        const books = ref([])
        const searchLoading = ref(false)
        const searchError = ref('')
        let browseRequestId = 0

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
</script>

<template>
    <div class=homepage>
        <NavBar />
        <div class="main-content">
            <div class="herosection">
                <h1>Stories from Nigeria and <span>across Africa</span></h1>
                <div class="search-space">
                    <div class="search-area">
                        <BookSearch
                            @search-results="handleSearchResults"
                            @loading-change="searchLoading = $event"
                        />
                    </div>
                    <div class="filter-space">
                        <button class="filter-btn">Nigeria</button>
                        <button class="filter-btn">Africa</button>
                        <button class="filter-btn">Global</button>
                    </div>
                </div>
            </div>
            <div id="search" class="book-grid">
                    <p v-if="searchError" class="search-error" role="alert">
                        {{ searchError }}
                    </p>
                    <BookGrid
                        :books="books"
                        :loading="searchLoading"
                        empty-message="Search for books to see them here."
                    />
                </div>
            <BrowseByGenre @browse="handleBrowse" />
            <BrowseByRegion @browse="handleBrowse" />
            <BookOfTheWeek />
        </div>
    </div>
</template>

<style scoped>
    .main-content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        border-radius: 5px;
        align-self: center;
        border:#193819 1px solid;
        padding: 20px;

        .herosection{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            align-self: center;
            padding: 20px 0px;
            border:#eef103 1px solid;

            h1{
                font-size: 55px;
                text-align: center;
                margin-bottom: -20px;
                width: 70%;
                text-wrap: wrap;
                border:#040629 1px solid;
                span{
                    color: #193819;
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
        border:#dd0c4b 1px solid;
        padding: 20px 0px;

        .search-area{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            border:#193819 1px solid;
            padding: 20px 0px;
        }
        .filter-space{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            margin-top: -20px;
            border-radius: 5px;
            border:#193819 1px solid;
            padding: 20px 0px;

            .filter-btn{
                width: 100px;
                height: 30px;
                margin: 0px 10px;
                border-radius: 5px;
                border:#193819 1px solid;
                background-color: #193819;
                font-size: 13px;
                color: #fff;
                cursor: pointer;

                &:hover{
                    background-color: #fff;
                    color: #193819;
                    border:#193819 1px solid;
                }
            }
        }
    }

    .book-grid{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f5f2Eb ;
        width: 90%;
        height: 100%;
        border-radius: 10px;
        align-self: center;
        border:#193819 1px solid;
        padding: 20px 10px;
    }
</style>
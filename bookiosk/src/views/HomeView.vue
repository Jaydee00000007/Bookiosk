<script setup>
        import { onMounted, ref } from 'vue'
        import { getBookById, searchBooks } from '../services/googleBooks'
        import { getMostViewedBookId } from '../composables/useBookViews'
        import BookSearch from '../components/Search/BookSearch.vue';
        import NavBar from '../components/NavBar.vue'
        import BookGrid from '../components/BookGrid.vue'
        import BrowseByGenre from '../components/Search/BrowseByGenre.vue'
        import BrowseByRegion from '../components/Search/BrowseByRegion.vue'
        import BookOfTheWeek from '../components/BookOfTheWeek.vue'
        import AuthorSpotlight from '../components/AuthorSpotlight.vue'
        import MyShelf from '../components/MyShelf.vue';
        import SiteFooter from '../components/SiteFooter.vue'

        const books = ref([])
        const searchLoading = ref(false)
        const searchError = ref('')
        const searchQuery = ref('')
        const activeRegion = ref('Global')
        const mostViewedBook = ref(null)
        const featuredBook = ref(null)
        const mostViewedBookReady = ref(false)
        const mostViewedBookError = ref('')
        let searchRequestId = 0

        function clearBookList() {
            searchRequestId++
            books.value = []
            searchError.value = ''
            searchLoading.value = false
        }

        function scopedQuery(query, region) {
            const scope = {
                Nigeria: 'subject:"Nigerian literature"',
                Africa: 'subject:"African literature"',
                Global: ''
            }[region] || ''

            return [scope, query.trim()].filter(Boolean).join(' ') || 'literature'
        }

        async function runSearch(query, region = activeRegion.value) {
            const requestId = ++searchRequestId
            searchLoading.value = true
            searchError.value = ''

            try {
                const results = await searchBooks(
                    scopedQuery(query, region),
                    { maxResults: 12 }
                )

                if (requestId === searchRequestId) {
                    books.value = results
                }
            } catch (error) {
                if (requestId === searchRequestId) {
                    books.value = []
                    searchError.value = error.message || 'Unable to load books.'
                }
            } finally {
                if (requestId === searchRequestId) {
                    searchLoading.value = false
                }
            }
        }

        function handleSearch(query) {
            searchQuery.value = query
            return runSearch(query)
        }

        function handleRegionFilter(region) {
            activeRegion.value = region
            return runSearch(searchQuery.value, region)
        }

        function handleBrowse(query) {
            searchQuery.value = query
            activeRegion.value = 'Global'
            return runSearch(query, 'Global')
        }

        onMounted(async () => {
            const bookId = getMostViewedBookId()

            try {
                if (bookId) {
                    mostViewedBook.value = await getBookById(bookId)
                } else {
                    // One shared homepage request feeds both featured sections.
                    const results = await searchBooks('African literature', {
                        orderBy: 'relevance',
                        maxResults: 12
                    })
                    featuredBook.value = results[0] || null
                }
            } catch (error) {
                mostViewedBookError.value =
                    error.message || 'Unable to load homepage features.'
            } finally {
                mostViewedBookReady.value = true
            }
        })

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
                            v-model:search="searchQuery"
                            :loading="searchLoading"
                            :error="searchError"
                            @search="handleSearch"
                        />
                    </div>
                    <div class="filter-space">
                        <button
                            v-for="region in ['Nigeria', 'Africa', 'Global']"
                            :key="region"
                            class="filter-btn"
                            :class="{ 'is-active': activeRegion === region }"
                            :aria-pressed="activeRegion === region"
                            type="button"
                            @click="handleRegionFilter(region)"
                        >
                            {{ region }}
                        </button>
                    </div>
                </div>
            </div>
            <div id="search" class="book-grid glass-card2">
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
            <p v-if="mostViewedBookError" class="feature-error" role="alert">
                {{ mostViewedBookError }}
            </p>
            <BookOfTheWeek
                id="featured"
                :most-viewed-book="mostViewedBook"
                :featured-book="featuredBook"
                :most-viewed-book-ready="mostViewedBookReady"
            />
            <AuthorSpotlight
                :most-viewed-book="mostViewedBook"
                :featured-book="featuredBook"
                :most-viewed-book-ready="mostViewedBookReady"
            />
            <MyShelf id="myshelf"/>
        </div>
        <SiteFooter class="footer" />
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

            .filter-btn.is-active{
                background-color: #193819;
                color: #fff;
                font-weight: 600;
            }

            .filter-btn:focus-visible{
                outline: 3px solid #8dbb91;
                outline-offset: 2px;
            }
        }
    }

    .feature-error{
        width: min(82%, 1120px);
        margin: 0;
        color: #9f2d25;
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
    
    .footer{
        width: 100%;
        padding: 0;
        margin: 0;
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

        .feature-error{
            width: 100%;
        }
    }
</style>
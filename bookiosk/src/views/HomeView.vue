<script setup>
        import { ref, onMounted } from 'vue'
        import { searchBooks } from '../services/googleBooks'
        import BookSearch from '../components/Search/BookSearch.vue';
        import NavBar from '../components/NavBar.vue'
        import BookGrid from '../components/BookGrid.vue'

        import {
        genres,
        regions,
        authors
        } from '../data/collections'

        const discovery = ref({
        genres: {},
        regions: {},
        authors: {}
        })
        const books = ref([])
        const searchLoading = ref(false)

        async function loadDiscovery() {
        const loadCollection = async (items) => {
            const results = await Promise.all(
            items.map(async (item) => {
                try {
                const books = await searchBooks(
                    item.query || `inauthor:${item}`
                )

                return [item.name || item, books]
                } catch {
                return [item.name || item, []]
                }
            })
            )

            return Object.fromEntries(results)
        }

        const [genreBooks, regionalBooks, authorBooks] =
            await Promise.all([
            loadCollection(genres),
            loadCollection(regions),
            loadCollection(authors)
            ])

        discovery.value = {
            genres: genreBooks,
            regions: regionalBooks,
            authors: authorBooks
        }
        }

        onMounted(loadDiscovery)
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
                            @search-results="books = $event"
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
                    <BookGrid
                        :books="books"
                        :loading="searchLoading"
                        empty-message="Search for books to see them here."
                    />
                </div>
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
        background-color: #040629;
        width: 90%;
        height: 100%;
        border-radius: 5px;
        align-self: center;
        border:#193819 1px solid;
        padding: 20px 10px;
    }
</style>
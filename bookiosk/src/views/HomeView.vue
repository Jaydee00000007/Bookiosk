<script setup>
        import { ref, onMounted } from 'vue'
        import { searchBooks } from '../services/googleBooks'
        import BookSearch from '../components/Search/BookSearch.vue';
        import NavBar from '../components/NavBar.vue'
        import BookCard from '../components/BookCard.vue'

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
                    <BookSearch />
                    <div class="filter-space">
                        <button class="filter-btn">Nigeria</button>
                        <button class="filter-btn">Africa</button>
                        <button class="filter-btn">Global</button>
                    </div>
                </div>
                <div class="writter-space">
                    <ul>
                        <li>Writers from Nigeria</li>
                        <li>Writers from Africa</li>
                        <li>Writers from Global</li>
                    </ul>
                </div>
                <div class="book-grid">
                    <BookCard
                        v-for="book in books"
                        :key="book.id"
                        :book="book"
                    />
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
<script setup>
    import { ref } from "vue";
    import { searchBooks } from "../../services/googleBooks";

        const searchQuery = ref("");
        const books = ref([]);
        const loading = ref(false);
        const error = ref("");

        const handleSearch = async () => {
        if (!searchQuery.value.trim()) return;

        loading.value = true;
        error.value = "";

        try {
            books.value = await searchBooks(searchQuery.value);
        } catch (err) {
            error.value = err.message;
            books.value = [];
        } finally {
            loading.value = false;
        }
        };
</script>

<template>
    <form @submit.prevent="handleSearch">
        <div class="searchinput">
            <div class="search-btn">
                <button type="submit" :disabled="loading">
                    <span>⌕</span>
                </button>
            </div>
            <input
            v-model="searchQuery" 
            placeholder="Search by title, author, or ISBN..."
            @input="$emit('update:search', searchQuery)"
            type="text">

            <div class="book-grid">
                <article
                    v-for="book in books"
                    :key="book.id"
                    class="book-card"
                >
                    <img
                    v-if="book.volumeInfo.imageLinks?.thumbnail"
                    :src="book.volumeInfo.imageLinks.thumbnail"
                    :alt="book.volumeInfo.title"
                    />

                    <h3>{{ book.volumeInfo.title }}</h3>

                    <p>
                    {{ book.volumeInfo.authors?.join(", ") || "Unknown author" }}
                    </p>

                    <a
                    :href="book.volumeInfo.infoLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    View Book
                    </a>
                </article>
                <p v-if="error">{{ error }}</p>
                <p v-if="loading">Finding books...</p>
            </div>
        </div>
    </form>
    
</template>

<style scoped>
        .searchinput{
            display: flex;
            align-items: center;    
            justify-content: center;
            width: 70%;
            height: 100%;
            border-radius: 5px;
            border: 1px solid #ccc;
            padding-right: 10px;
            align-self: center;

            .search-btn {
                width:20%;
                height: 100%;
                border-radius: 5px;
                border: none;
                cursor: pointer;

                button{
                    width: 50%;
                    height: 100%;
                    background-color: none;
                    border: none;
                    outline: none;
                    font-size: 16px;
                    cursor: pointer;

                    span{
                        font-size: 20px;
                    }
                }


            }

            input{
                width: 90%;
                height: 100%;
                border: none;
                outline: none;
                font-size: 16px;
                padding: 0 10px;
            }
        }
</style>






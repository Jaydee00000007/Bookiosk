<script setup>
    import { ref } from "vue";
    import { searchBooks } from "../../services/googleBooks";

        const emit = defineEmits(["search-results", "loading-change"]);
        const searchQuery = ref("");
        const books = ref([]);
        const loading = ref(false);
        const error = ref("");

        const handleSearch = async () => {
        if (!searchQuery.value.trim()) return;

        loading.value = true;
        emit("loading-change", true);
        error.value = "";

        try {
            books.value = await searchBooks(searchQuery.value);
            emit("search-results", books.value);
        } catch (err) {
            error.value = err.message;
            books.value = [];
            emit("search-results", books.value);
        } finally {
            loading.value = false;
            emit("loading-change", false);
        }
        };
</script>

<template>
    <form @submit.prevent="handleSearch" class="searchinput">
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
    </form>
    <p v-if="error" class="search-error" role="alert">{{ error }}</p>
</template>

<style scoped>
        .searchinput{
            display: flex;
            align-items: center;    
            justify-content: center;
            width: 70%;
            height: 50px;
            border-radius: 15px;
            border: 1px solid #ccc;
            padding-right: 10px;
            align-self: center;
            overflow: hidden;

            .search-btn {
                width:10%;
                height: 100%;
                border-radius: 15px;
                border: none;
                cursor: pointer;

                button{
                    width: 100%;
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
                padding: 10px;
            }
        }
</style>




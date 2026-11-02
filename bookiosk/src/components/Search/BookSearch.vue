<script setup>
   
</script>

<template>
    <div class="searchinput">
        <div class="search-btn">
            <button><span>⌕</span></button>
        </div>
        <input
        v-model="modelSearch" 
        placeholder="Search by title, author, or ISBN..."
        @input="$emit('update:search', modelSearch)"
        type="text">
    </div>
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
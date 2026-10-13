<script setup>

</script>

<template>
    <div class="logo">

    </div>
    <div class="navlink">
        <ul>
            <RouterLink :to="{ path: '/mainview', hash: '#search' }">Search</RouterLink>
            <RouterLink :to="{ path: '/mainview', hash: '#browse' }">Browse</RouterLink>
            <RouterLink :to="{ path: '/mainview', hash: '#featured' }">Featured</RouterLink>
            <RouterLink :to="{ path: '/mainview', hash: '#myshelf' }">My Shelf</RouterLink> 
        </ul>
    </div>
    <div class="darkmode">
        <button>
            
        </button>
    </div>
</template>

<style scoped>

</style>
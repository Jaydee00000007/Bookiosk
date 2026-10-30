<script setup>
   
</script>

<template>
    <div class="searchinput">
        <input
        v-model="modelSearch" 
        placeholder="Search by title, author, or ISBN..."
        @input="$emit('update:search', modelSearch)"
        type="text">
    </div>
</template>

<style scoped>

</style>
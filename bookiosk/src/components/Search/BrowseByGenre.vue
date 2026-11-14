<template>
    <div class="browse-genre">
        <h2>Browse by Genre</h2>
        <p>Explore curated African literature across categories.</p>
        <ul>
            <li v-for="genre in genres" :key="genre.name">
                <button type="button" @click="$emit('browse', genre.query)">
                    {{ genre.name }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
defineEmits(['browse'])

const genres = [
    { name: 'Fiction', query: 'subject:fiction African literature' },
    { name: 'Poetry', query: 'subject:poetry African literature' },
    { name: 'History', query: 'subject:history Africa' },
    { name: 'Politics', query: 'subject:political science Africa' },
    { name: 'Biography', query: 'subject:biography Africa' },
    { name: 'Folktales', query: 'African folktales' }
]
</script>

<style scoped>
.browse-genre {
    box-sizing: border-box;
    width: 80%;
    max-width: 100%;
    min-width: 0;
    padding: 5px 20px;
    background-color: transparent;
    border-radius: 10px;

    h2 {
        font-size: 28px;
        margin-bottom: 10px;
        color: #193819;
        font-family: playfair display, serif;
    }
    p {
        font-size: 16px;
        margin-bottom: 20px;
        color: #00000080;
    }

    ul {
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(6, minmax(min(150px, 100%), 1fr));
        gap: 0px;
        justify-content: space-between;
        align-items: flex-start;
        list-style-type: none;
        padding: 0;

        li {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            height: 110px;
            width: 90%;
            min-width: 0;
            background-color: #f5f2Eb;
            border: 0px solid #193819;
            margin: 10px 0;
            padding: 15px 15px;
            border-radius: 5px;
            text-align: center;
            font-size: 16px;
            font-family: playfair display, serif;
            transition: background-color 0.3s, color 0.3s;
            

            button {
                padding: 0;
                border: 0;
                background: transparent;
                font: inherit;
                text-decoration: none;
                color: #193819;
                font-weight: bold;
                transition: color 0.3s;
                cursor: pointer;

                &:hover {
                    color: #dd0c4b;
                }
            }
        }
    }
}   

@media (max-width: 768px) {
    .browse-genre {
        ul {
            grid-template-columns: repeat(2, minmax(min(150px, 100%), 1fr));
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
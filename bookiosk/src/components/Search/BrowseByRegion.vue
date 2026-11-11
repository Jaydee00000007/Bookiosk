<template>
    <div class="browse-genre">
        <h2>Explore Regions</h2>
        <p>Diverse voices from every corner of the continent.</p>
        <ul>
            <li v-for="region in regions" :key="region.name">
                <button type="button" @click="$emit('browse', region.query)">
                    <span>REGION</span>{{ region.name }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
defineEmits(['browse'])

const regions = [
    { name: 'West Africa', query: 'subject:"West African literature"' },
    { name: 'East Africa', query: 'subject:"East African literature"' },
    { name: 'Southern Africa', query: 'subject:"Southern African literature"' },
    { name: 'Central Africa', query: 'subject:"Central African literature"' },
    { name: 'Northern Africa', query: 'subject:"North African literature"' }
]
</script>

<style scoped>
.browse-genre {
    width: 90%;
    padding: 20px;
    background-color: transparent;
    border-radius: 10px;
    border: 1px solid #0000006e;

    h2 {
        font-size: 28px;
        margin-bottom: 10px;
        color: #193819;
    }
    p {
        font-size: 16px;
        margin-bottom: 20px;
        color: #00000080;
    }

    ul {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 5px;
        justify-content: space-between;
        align-items: flex-start;
        list-style-type: none;
        padding: 0;

        li {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            height: 110px;
            width: 140px;
            background-color: transparent;
            box-shadow:inset 0 0 0 1px #1938194f;
            border: 3px solid #19381923;
            margin: 10px 0;
            padding: 15px 15px;
            border-radius: 15px;
            text-align: start;
            font-size: small;
            transition: background-color 0.3s, color 0.3s;
            

            span {
                display: block;
                font-size: 12px;
                color: #00000080;
                margin-bottom: 5px;
            }

            button {
                padding: 0;
                border: 0;
                background: transparent;
                text-align: left;
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

            span {
                display: block;
                font-size: 12px;
                color: #00000080;
                margin-bottom: 5px;
            }
        }
    }
}   
</style>
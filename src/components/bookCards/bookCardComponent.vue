<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import searchBarComponent from "./searchBarComponent.vue";
import DispoComponent from "./dispoComponent.vue";


const bookData = ref([]);
const searchFilter = ref('');//String from the searchBarComponent

// Fonction pour récupérer les livres depuis le fichier JSON
async function fetchBooks() {
    const booksLinks = "./livres.json";
    try {
        const response = await axios.get(booksLinks);
        bookData.value = response.data.livres;
    } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error);
    }
}

const filteredItems = computed(() => {
    if (searchFilter.value != '') {
        return bookData.value.filter(livre =>
            livre.titre.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
            livre.auteur.toLowerCase().includes(searchFilter.value.toLowerCase())
        );
    }
    return bookData.value;
})
const handleSearch = (search) => {
    searchFilter.value = search;
}

onMounted(() => {
    fetchBooks();
});

</script>

<template>
    <div class="container">
        <div class=" col-12 mt-1 align-self-start">
            <searchBarComponent @search="handleSearch" />
        </div>
    </div>
    <div class="row">
        <div class="card justify-content-between p-0 col-lg-2 col-sm-5" v-for="(livre, index) in filteredItems"
            :key="index">
            <div class="row g-0">
                <div class="col-4">
                    <img :src="livre.image || 'default-cover.jpg'" class="img-fluid rounded-start ms-1 mt-lg-4"
                        alt="couverture">
                </div>
                <div class="col-8 p-0">
                    <div class="card-body">
                        <h5 class="card-title">{{ livre.titre }}</h5>
                        <p class="card-text">Auteur : {{ livre.auteur || "Auteur inconnu" }}</p>
                        <p class="card-text">ISBN : {{ livre.ISBN }}</p>
                        <p class="card-text">État : {{ livre.etat }}</p>
                    </div>
                </div>
                <div class="row">
                    <DispoComponent :emprunt="livre.emprunt" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Ajoutez votre CSS personnalisé ici si nécessaire */
</style>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import searchBarComponent from "./searchBarComponent.vue";
import DispoComponent from "./dispoComponent.vue";


const bookData = ref([]);
const searchFilter = ref ('');//String from the searchBarComponent

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
const filteredItems = computed (() => {
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
    <div class ="row">
        <div class=" col-6  mt-1 align-items-start">
            <searchBarComponent @search="handleSearch"/>
        </div>
    </div>
    <div class ="row ms-1">
        <div class="card m-1 p-0 d-grid" style="max-width: 24vw;" v-for="(livre, index) in filteredItems" :key="index">
            <div class="row g-0">
                <div class="col-md-4">
                    <img :src="livre.image || 'default-cover.jpg'" class="img-fluid ms-1 mt-5" alt="couverture">
                </div>
                <div class="col-md-6">
                    <div class="card-body g-0">
                        <h5 class="card-title">{{ livre.titre }}</h5>
                        <p class="card-text">Auteur : {{ livre.auteur || "Auteur inconnu" }}</p>
                        <p class="card-text">ISBN : {{ livre.ISBN }}</p>
                        <p class="card-text">État : {{ livre.etat }}</p>
                        <DispoComponent :emprunt="livre.emprunt" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Ajoutez votre CSS personnalisé ici si nécessaire */
</style>

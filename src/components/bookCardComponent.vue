<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Déclaration d'une ref pour stocker les données des livres
const bookData = ref([]);

// Fonction pour récupérer les livres depuis le fichier JSON
async function fetchBooks() {
    const booksLinks = "./livres.json"; // Chemin vers le fichier JSON dans /public
    try {
        const response = await axios.get(booksLinks); // Récupère le contenu du JSON
        bookData.value = response.data.livres; // Stocke uniquement le tableau "livres" du JSON
        console.log("Livres chargés :", bookData.value);
    } catch (error) {
        console.error("Erreur lors de la récupération des livres :", error);
    }
}

// Appel de la fonction au montage du composant
onMounted(() => {
    fetchBooks();
});
</script>

<template>
    <!-- Liste des livres affichée sous forme de cartes -->
    <div class="card mb-3" style="max-width: 20vw;" v-for="(livre, index) in bookData" :key="index">
        <div class="row g-0">
            <!-- Section de l'image -->
            <div class="col-md-4">
                <img :src="livre.image || 'default-cover.jpg'" class="img-fluid rounded-start" alt="couverture">
            </div>
            <!-- Section des informations -->
            <div class="col-md-6">
                <div class="card-body">
                    <h5 class="card-title">{{ livre.titre }}</h5>
                    <p class="card-text">Auteur : {{ livre.auteur || "Auteur inconnu" }}</p>
                    <p class="card-text">ISBN : {{ livre.ISBN }}</p>
                    <p class="card-text">État : {{ livre.etat }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
/* Ajoutez votre CSS personnalisé ici si nécessaire */
</style>

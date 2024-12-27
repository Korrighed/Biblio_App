<template>
<div class="page-admin">
  <div class="row mt-2">
    <div class="row justify-content-left my-sm-2">
      <p class="text-center-left col-2 fs-3">Bienvenue, {{ currentUser.login }}</p>
      <button 
          @click="$emit('logout')" 
          type="button" 
          class="btn btn-secondary col-2 my-3"
        >
      Déconnexion
      </button>
      </div>
  
      <h3 class="text-center-left">Gérez vos emprunts</h3>
      <div class="container">
        <div class="row">
          <div class="col-12">
            <!-- Liste des actions possibles, comme emprunter un livre -->
            <button class="btn btn-primary" @click="borrowBook">Emprunter un livre</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

// Fonction pour gérer l'emprunt
const borrowBook = () => {
  alert("Fonctionnalité d'emprunt en cours de développement !");
};

</script>

<style>

</style>
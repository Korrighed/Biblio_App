<template>
    <div class="containermin-vh-25 py-0 header">
        <div class="row">
            <div class="col-6 align-content-center m-auto fs-5 text-center mt-3">
                Bienvenu sur l'intranet des amoureux du livre
            </div>
            <div class="col-3">
                <button @click="currentUser ? $emit('navigateToAdmin') : $emit('showConnexion')" type="button"
                    class="btn btn-secondary my-3">
                    {{ currentUser ? currentUser.login : 'Connexion' }}
                </button>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-6 m-2">
                <form @submit.prevent>
                    <input type="text" placeholder="Rechercher un livre ou un auteur..." v-model="searchQuery"
                        @input="onSearch" class="form-control" />
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useUserStore } from '../stores/userStore';
import { useBookStore } from '../stores/bookStore';

// Store utilisateur
const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

// Store des livres
const bookStore = useBookStore();
const searchQuery = ref("");

// Méthode pour mettre à jour la recherche
const onSearch = () => {
  bookStore.updateSearchQuery(searchQuery.value);
};

// Déclaration des événements émis
defineEmits(['showConnexion', 'navigateToAdmin']);
</script>

<style>
.header {
    color: white;
    background-color: #6F4E37
}
</style>
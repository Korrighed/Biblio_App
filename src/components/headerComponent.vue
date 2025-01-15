<template>
    <div class="containermin-vh-25 py-0 header">
        <div class="row mt-1 justify-content-start">
            <div class="col-8 col-md-8 fs-5 text-center">
                Bienvenu sur l'intranet des amoureux du livre
            </div>
            <div class="col-4 col-md-4 text-center">
                <button @click="currentUser ? $emit('navigateToAdmin') : $emit('showConnexion')" type="button"
                    class="btn btn-secondary">
                    {{ currentUser ? currentUser.login : 'Connexion' }}
                </button>
            </div>
        </div>
        <div class="row my-1 justify-content-center justify-content-md-start">
            <div class="col-11 col-md-4 ">
                <form @submit.prevent>
                    <input type="text" placeholder="Rechercher un livre ou un auteur..." v-model="searchQuery"
                        @input="onSearch" class="form-control" />
                </form>
            </div>
        </div>
        <div class="containermin-vh-25 py-0 header">
        <!-- Code existant -->
        <div v-if="currentUser?.role === 'admin' && hasActiveReset" 
            class="row mt-2 justify-content-center">
            <div class="col-12">
                <div class="alert alert-warning">
                    Une demande de réinitialisation de mot de passe est en cours.
                    <button @click="$emit('navigateToAdmin')" 
                            class="btn btn-sm btn-warning ms-2">
                        Voir les détails
                    </button>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { usePasswordStore } from '../stores/passwordStore'
import { useUserStore } from '../stores/userStore';
import { useBookStore } from '../stores/bookStore';

const passwordStore = usePasswordStore();
const hasActiveReset = computed(() => passwordStore.resetInProgress);
// Store utilisateur
const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);
console.log("Utilisteur connecté dans le store:", currentUser.value);

// Store des livres
const bookStore = useBookStore();
const searchQuery = ref("");

// Méthode pour mettre à jour la recherche
const onSearch = () => {
    bookStore.updateSearchQuery(searchQuery.value);
};

// Déclaration des événements émis
defineEmits(['showConnexion', 'navigateToAdmin']);

watch(() => currentUser.value, (newVal, oldVal) => {
    console.log("Changement de currentUser :", oldVal, "->", newVal);
}
);
console.log("Instance du userStore :", userStore);
</script>

<style>
.header {
    color: white;
    background-color: #6F4E37
}
</style>
<template>
  <!-- Header avec gestion de la connexion -->
  <div class="row">
    <headerComponent
      @showConnexion="showConnexion = true"
      @navigateToAdmin="navigateToPage('admin')"
      @navigateToBooks="navigateToPage('books')"
    />
  </div>

  <!-- Modal de connexion -->
  <logginModalComponent v-if="showConnexion" @close="showConnexion = false" />

  <!-- Contenu principal : affichage de la page courante -->
  <div class="row">
    <component
      :is="currentPageComponent"
      @logout="logout"
      @navigateToPage="navigateToPage"
      v-bind="currentPageProps"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from './stores/userStore';
import { useBookStore } from './stores/bookStore';

import bookCardComponent from './components/bookCards/bookCardComponent.vue';
import headerComponent from './components/headerComponent.vue';
import logginModalComponent from './components/admin/logginModalComponent.vue';
import pageAdminComponent from './components/admin/pageAdminComponent.vue';

const showConnexion = ref(false);
const currentPage = ref('books'); // Par défaut, afficher la page des livres
const userStore = useUserStore();
const bookStore = useBookStore();

// Charger les livres au démarrage
onMounted(() => {
  bookStore.fetchBooks();
});

// Navigation entre les pages
const navigateToPage = (page) => {
  currentPage.value = page;
};

// Déconnexion
const logout = () => {
  userStore.logout();
  navigateToPage('books');
};

// Détermine le composant courant
const currentPageComponent = computed(() => {
  return currentPage.value === 'admin' ? pageAdminComponent : bookCardComponent;
});

// Détermine les props à transmettre
const currentPageProps = computed(() => {
  if (currentPageComponent.value === bookCardComponent) {
    return { books: bookStore.filteredBooks };
  }
  return {};
});
</script>

<style>
.primary {
  color: #6F4E37;
}
.secondary {
  color: #ECB176;
}
.alert {
  color: #A67B5B;
}
.info {
  color: #FED8B1;
}
</style>

<template>
   <div class="dispo-container">
    <!-- Menu radio pour afficher l'état -->
    <div class="radio-menu">
      <div>
        <label v-if="!showBorrowButton">
          <input
            type="radio"
            :checked="!emprunt"
            disabled
          />
          Disponible
        </label>
        <!-- Bouton Emprunter -->
        <button
          v-else
          @click="handleEmprunt"
          class="btn btn-primary"
        >
          Emprunter
        </button>
      </div>
      <div>
        <label>
          <input
            type="radio"
            :checked="emprunt"
            disabled
          />
          Indisponible
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useBookStore } from "../../stores/bookStore";
import { useUserStore } from "../../stores/userStore";

defineProps({
  isbn: { type: String, required: true },
  emprunt: { type: Boolean, required: true },
});

const bookStore = useBookStore();
const userStore = useUserStore();

const currentUser = computed(() => userStore.currentUser);

const showBorrowButton = computed(() => {
  return currentUser.value && !emprunt; // Affiche "Emprunter" si un utilisateur est connecté et le livre est disponible
});

const handleEmprunt = () => {
  if (!currentUser.value) {
    console.warn("Aucun utilisateur connecté !");
    return;
  }
  bookStore.toggleEmprunt(isbn); // Met à jour l'état dans le store
};
</script>

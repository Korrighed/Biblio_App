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
    <emprunt-card-component
      v-if="showModalEmprunt"
      @close="showModalEmprunt = false"
      @confirm-emprunt="updateEmpruntStatus"
      :isbn="props.isbn"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useBookStore } from "../../stores/bookStore";
import { useUserStore } from "../../stores/userStore";
import EmpruntCardComponent from '../admin/emprunt/empruntCardComponent.vue';

const bookStore = useBookStore();
const userStore = useUserStore();
const showModalEmprunt = ref(false);

const props = defineProps({
  isbn: { type: String, required: true },
  emprunt: { type: Boolean, required: true },
});

const currentUser = computed(() => userStore.currentUser);

const showBorrowButton = computed(() => {
  return currentUser.value && !props.emprunt;
});


const handleEmprunt = () => {
  showModalEmprunt.value = true;
};

// Met à jour l'état du livre dans le composant parent
const updateEmpruntStatus = (isbn) => {
  console.log(`Statut du livre avec ISBN ${isbn} mis à jour.`);
};

</script>

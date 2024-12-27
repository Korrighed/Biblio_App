<script setup>
import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";

//Vérification loggin
const userStore = useUserStore();
const isUserLoggedIn = computed(() => userStore.currentUser !== null);

//Toggle dispo
const { emprunt } = defineProps({
  emprunt: {
    type: Boolean,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
});
const isDisponible = computed(() => emprunt !== true);


// Gestion des empunts 
const emit = defineEmits(['borrowBook']);
const emitBorrowEvent = () => {
  emit('borrowBook', isbn); // Émet simplement un événement sans transmettre de données pour le moment
};

</script>


<template>
  <div class="container">
    <div class="col-12">
      <label class="flex flex-nowrap mt-1">
        <input type="radio" value="disponible" :checked="isDisponible" disabled />
        <button 
        v-if="isDisponible && isUserLoggedIn" 
        type="button" 
        class="btn btn-primary"
        @click="emitBorrowEvent"
        >
        Emprunter
        </button>
        <span v-else >Disponible</span>
      </label>
      <label class="flex flex-nowrap">
        <input type="radio" value="emprunte" :checked="isEmprunte" disabled />
        <span class="whitespace-nowrap">Empruntée</span>
      </label>
    </div>
  </div>
</template>


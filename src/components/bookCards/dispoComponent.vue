<template>
  <div class="container m-0">
    <div class="radio-menu row">
      <div class="col">
        <label v-if="!showBorrowButton">
          <input type="radio" :checked="!isBookBorrowed" disabled />
          Disponible
        </label>
        <button
          v-if="showBorrowButton"
          @click="handleEmprunt"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          Emprunter
        </button>
      </div>
      <div class="col">
        <label >
          <input type="radio" :checked="isBookBorrowed" disabled />
          Indisponible
        </label>
      </div>
    </div>
    <emprunt-card-component
      v-if="showModalEmprunt"
      @close="closeModal"
      :isbn="props.isbn"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useBookStore } from "../../stores/bookStore";
import { useUserStore } from "../../stores/userStore";
import { useBorrowStore } from "../../stores/borrowStore";
import EmpruntCardComponent from "../admin/emprunt/empruntCardComponent.vue";

const bookStore = useBookStore();
const userStore = useUserStore();
const borrowStore = useBorrowStore();
const showModalEmprunt = ref(false);
const isLoading = ref(true);

const props = defineProps({
  isbn: { type: String, required: true },
});

// Chargement initial des emprunts
onMounted(async () => {
  await borrowStore.loadActiveLoans();
  isLoading.value = false;
});

const isBookBorrowed = computed(() => {
  return borrowStore.activeLoans.some(
    (loan) => loan.ISBN === props.isbn && loan.status === "borrowed"
  );
});

const currentUser = computed(() => userStore.currentUser);

const showBorrowButton = computed(() => {
  return currentUser.value && !isBookBorrowed.value && !isLoading.value;
});

const handleEmprunt = async () => {
  showModalEmprunt.value = true;
};


const closeModal = async (confirmed) => {
  if (confirmed && !isBookBorrowed.value) {
    isLoading.value = true;
    try {
      await borrowStore.borrowBook(props.isbn);
      await borrowStore.loadActiveLoans();
    } catch (error) {
      console.error("Erreur lors de l'emprunt:", error);
    } finally {
      isLoading.value = false;
    }
  }
  showModalEmprunt.value = false;
};
</script>

<style scoped>
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

<script setup>
import { computed } from "vue";
import { useBookStore } from "../../../stores/bookStore";
import { useUserStore } from '../../../stores/userStore';
import { useBorrowStore } from "../../../stores/borrowStore"; 

const bookStore = useBookStore();
const userStore = useUserStore();
const borrowStore = useBorrowStore();

const props = defineProps({ isbn: { type: String, required: true } });
const emit = defineEmits(['close', 'confirm-emprunt']);

const currentUser = computed(() => userStore.currentUser);
const selectedBook = computed(() => {
    return bookStore.bookData.find((livre) => livre.ISBN === props.isbn);
});

const isBookBorrowed = computed(() => {
    return borrowStore.activeLoans.find(loan => loan.ISBN === props.isbn);
});

// Maj d'un emprunt dans le store
const confirmEmprunt = async () => {
    if (currentUser.value) {
        await borrowStore.borrowBook(props.isbn); // Appelle la méthode Pinia pour enregistrer l'emprunt
        emit("confirm-emprunt", props.isbn);
        emit("close");
    } else {
        console.error("Utilisateur non connecté");
    }
};

const returnBook = async () => {
    if (currentUser.value) {
        await borrowStore.returnBook(props.isbn); // Appelle la méthode Pinia pour marquer l'emprunt comme "retourné"
        emit("confirm-emprunt", props.isbn);
        emit("close");
    } else {
        console.error("Utilisateur non connecté");
    }
};


const closeModal = () => {
    emit("close");
};

</script>
<template>
    <div class="modal-overlay">
        <div class="container">
            <div class="row justify-content-center">
                <div class="row">
                    <div class="card p-0 pb-1 col-12">
                        <div class="row">
                            <button @click="closeModal" class="btn-close col-6"></button>
                            <div class="col-4 my-auto">
                                <img :src="selectedBook?.image || 'default-cover.jpg'"
                                    class="img-fluid rounded-start ms-1 mt-lg-4" alt="couverture" />
                            </div>
                            <div class="col-8">
                                <div class="card-body text-start">
                                    <p class="card-title fs-1 fw-bold">{{ selectedBook?.titre }}</p>
                                    <p class="card-text fs-4 fw-medium">
                                        Auteur : {{ selectedBook?.auteur || "Auteur inconnu" }}
                                    </p>
                                    <p class="card-text fs-4">État : {{ selectedBook?.etat }}</p>
                                    <p class="card-text fs-5">ISBN : {{ selectedBook?.ISBN }}</p>
                                </div>
                                <button
                                    v-if="!selectedBook?.status || selectedBook.status === 'returned'"
                                    class="btn btn-primary col-md-5 col-sm-10"
                                    @click="confirmEmprunt"
                                    >
                                    Confirmer l'emprunt
                                </button>
                                <button
                                v-else
                                class="btn btn-secondary col-md-5 col-sm-10"
                                @click="returnBook"> 
                                Rendre le livre
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #6f4e37 !important;
    color: #6f4e37 !important;
    border-radius: 8px !important;
    max-width: 50%;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
}
</style>

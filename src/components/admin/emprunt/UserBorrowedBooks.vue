<script setup>
import { computed, ref } from "vue";
import { useBorrowStore } from "../../../stores/borrowStore";
import { useUserStore } from "../../../stores/userStore";
import { useBookStore } from "../../../stores/bookStore";


const userStore = useUserStore();
const borrowStore = useBorrowStore();
const bookStore = useBookStore();
const processingISBN  = ref(null);

const userBorrows = computed(() => {
    return borrowStore.activeLoans.filter(loan =>
        loan.userId === userStore.currentUser?.id
    ).map(loan => {
        const book = bookStore.findBook(loan.ISBN);
        return {
            ...loan,
            title: book?.titre,
            author: book?.auteur
        };
    });
});

const handleBookReturn = async (isbn) => {
    try {
        processingISBN.value = isbn; // Pour suivre l'opération en cours
        await borrowStore.returnBook(isbn);
        await borrowStore.loadActiveLoans();
    } catch (error) {
        console.error("Erreur lors du retour du livre:", error);
        // Ajouter une notification d'erreur à l'utilisateur
    } finally {
        processingISBN.value = null;
    }
};


</script>
<template>
    <div class="row mx-auto">
        <h3 class="m-sm-auto">Mes livres empruntés</h3>
        <div v-if="borrowStore.isLoading" class="text-center">
            Chargement...
        </div>
        <ul v-else>
            <li v-for="borrow in userBorrows" 
                :key="borrow.ISBN" 
                class="col-12 border border-bottom-1">
                <div class="book-info">
                    <span class="title">{{ borrow.title }}</span>
                    <span class="author">par {{ borrow.author }}</span>
                </div>
                <button 
                    class="btn btn-danger" 
                    @click="handleBookReturn(borrow.ISBN)"
                    :disabled="processingISBN === borrow.ISBN || borrowStore.isLoading">
                    {{ processingISBN === borrow.ISBN ? 'En cours...' : 'Rendre' }}
                </button>
            </li>
        </ul>
    </div>
</template>
<style>
ul {
    list-style: none;
    padding: 0;
}

li {
    margin: 10px 0;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.book-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.title {
    font-weight: bold;
}

.author {
    font-style: italic;
    color: #666;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 5px 15px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-danger:hover {
    background-color: #c82333;
}
</style>

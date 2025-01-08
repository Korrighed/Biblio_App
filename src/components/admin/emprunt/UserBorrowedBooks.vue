<script setup>
import { computed } from "vue";
import { useBookStore } from "../../../stores/bookStore";
import { useUserStore } from "../../../stores/userStore";

const userStore = useUserStore();
const bookStore = useBookStore();

const borrowedBooks = computed(() => {
    return bookStore.bookData.filter(
        (book) => userStore.currentUser?.borrowedBooks.includes(book.ISBN)
    );
});

const returnBook = (isbn) => {
    bookStore.updateBookStatus(isbn);
    userStore.removeBorrowedBook(isbn);
};
</script>

<template>
    <div>
        <h3>Vos livres empruntés</h3>
        <ul v-if="borrowedBooks.length">
            <li v-for="book in borrowedBooks" :key="book.ISBN">
                <strong>{{ book.titre }}</strong> - {{ book.auteur }}
                <button class="btn btn-secondary" @click="returnBook(book.ISBN)">Rendre</button>
            </li>
        </ul>
        <p v-else>Aucun livre emprunté.</p>
    </div>
</template>
<style>
ul {
    list-style: none;
    padding: 0;
}

li {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
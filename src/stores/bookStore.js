import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios"; 
import { useUserStore } from "./userStore"; 

export const useBookStore = defineStore("bookStore", () => {

  const bookData = ref([]);
  const borrowHistory = ref([]);
  const searchQuery = ref("");

  // 1. Charger les livres depuis le json
  async function fetchBooks() {
    try {
      const response = await axios.get("./livres.json");
      bookData.value = response.data.livres;
    } catch (error) {
      console.error("Erreur lors de la récupération des livres :", error);
    }
  }

  // 2. Bar de recheche et filtrage
  const filteredBooks = computed(() => {
    if (!searchQuery.value.trim()) return bookData.value;
    return bookData.value.filter((livre) =>
      livre.titre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      livre.auteur.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // 3. Trouver un livre par son ISBN
  function findBook(isbn) {
    return bookData.value.find((livre) => livre.ISBN === isbn);
  }

  // 4. Basculer l'état d'emprunt d'un livre
  function toggleBookStatus(book, userId) {
    if (book) {
      book.emprunt = !book.emprunt;
      book.borrowedBy = book.emprunt ? userId : null; // Associer ou dissocier l'utilisateur
    }
  }

  // 5. Enregistrer une entrée dans l'historique des emprunts
  function logBorrowHistory(isbn, userId, action) {
    borrowHistory.value.push({
      bookISBN: isbn,
      userId,
      action,
      date: new Date(),
    });
  }

  // 6. Orchestrer le changement de statut du livre
  function updateBookStatus(isbn) {
    const userStore = useUserStore(); 
    const userId = userStore.currentUser?.id; 
    const book = findBook(isbn);
    const action = book.emprunt ? "returned" : "borrowed";
    toggleBookStatus(book, userId);
    logBorrowHistory(isbn, userId, action);
  }

  function updateSearchQuery(query) {
    searchQuery.value = query;
  }

  // Retourner les méthodes et les données nécessaires
  return {
    bookData,
    borrowHistory,
    searchQuery,
    fetchBooks,
    filteredBooks,
    updateBookStatus,
    updateSearchQuery,
  };
});

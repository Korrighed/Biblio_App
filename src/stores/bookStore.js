import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useBookStore = defineStore("bookStore", () => {
  const bookData = ref([]);
  const searchQuery = ref("");

  async function fetchBooks() {
    try {
      const response = await axios.get("./livres.json");
      bookData.value = response.data.livres;
    } catch (error) {
      console.error("Erreur lors de la récupération des livres :", error);
    }
  }

  const filteredBooks = computed(() => {
    if (!searchQuery.value.trim()) return bookData.value;
    return bookData.value.filter((livre) =>
        livre.titre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        livre.auteur.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  function toggleEmprunt(isbn) {
    const book = bookData.value.find((livre) => livre.ISBN === isbn);
    if (book) {
      book.emprunt = !book.emprunt;
    }
  }

  function updateSearchQuery(query) {
    searchQuery.value = query;
  }

  return {
    bookData,
    filteredBooks,
    searchQuery,
    fetchBooks,
    toggleEmprunt,
    updateSearchQuery,
  };
});

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
      console.error("Erreur chargement livres:", error);
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

  function updateSearchQuery(query) {
    searchQuery.value = query;
  }

  return {
    bookData,
    searchQuery,
    fetchBooks,
    filteredBooks,
    findBook,
    updateSearchQuery
};
});

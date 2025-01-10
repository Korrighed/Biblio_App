<script setup>
import { computed } from "vue";
import { useBookStore } from "../../../stores/bookStore";
import { useBorrowStore } from "../../../stores/borrowStore";
import { useUserStore } from "../../../stores/userStore";

const bookStore = useBookStore();
const borrowStore = useBorrowStore();
const userStore = useUserStore();

onMounted(async () => {
  await borrowStore.loadActiveLoans();
  await bookStore.fetchBooks();
});


const allBorrows = computed(() => {
  return borrowStore.activeLoans.map(loan => {
    const book = bookStore.findBook(loan.ISBN);
    return {
      titre: book?.titre || 'Livre inconnu',
      ISBN: loan.ISBN,
      userId: loan.userId,
      borrowDate: new Date(loan.borrowDate).toLocaleString(),
      returnDate: loan.returnDate ? new Date(loan.returnDate).toLocaleString() : '-',
      status: loan.status
    };
  });
});;

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

</script>

<template>
    <div>
      <h3>Liste des livres empruntés</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Emprunté par</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in borrowedBooks" :key="book.ISBN">
            <td>{{ book.titre }}</td>
            <td>{{ book.auteur }}</td>
            <td>{{ book.borrowedBy }}</td>
            <td>
              <button class="btn btn-secondary" @click="forceReturn(book.ISBN)">
                Rendre
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <h3>Historique des emprunts</h3>
      <ul>
        <li v-for="entry in borrowHistory" :key="entry.date">
          <strong>{{ entry.bookISBN }}</strong> - {{ entry.action }} par {{ entry.userId }} le
          {{ new Date(entry.date).toLocaleString() }}
        </li>
      </ul>
    </div>
  </template>
  
  <style>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f2f2f2;
  text-align: left;
}
</style>
<template>
  <div class="admin-borrows">
    <h3 class="mb-4">Gestion des Emprunts</h3>
    
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Titre</th>
            <th>ISBN</th>
            <th>ID Utilisateur</th>
            <th>Date d'emprunt</th>
            <th>Date de retour</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="borrow in allBorrows" :key="`${borrow.ISBN}-${borrow.userId}-${borrow.borrowDate}`">
            <td>{{ borrow.titre }}</td>
            <td><span class="badge bg-secondary">{{ borrow.ISBN }}</span></td>
            <td><span class="badge bg-primary">{{ borrow.userId }}</span></td>
            <td>{{ formatDate(borrow.borrowDate) }}</td>
            <td>{{ formatDate(borrow.returnDate) }}</td>
            <td>
              <span 
                class="badge"
                :class="{
                  'bg-success': borrow.status === 'returned',
                  'bg-warning': borrow.status === 'borrowed'
                }"
              >
                {{ borrow.status === 'borrowed' ? 'En cours' : 'Retourné' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="allBorrows.length === 0" class="alert alert-info mt-3">
      Aucun emprunt enregistré pour le moment.
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
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
  return borrowStore.allLoans.map(loan => {
    const book = bookStore.findBook(loan.ISBN);
    return {
      titre: book?.titre || 'Livre inconnu',
      ISBN: loan.ISBN,
      userId: loan.userId,
      borrowDate: loan.borrowDate,
      returnDate: loan.returnDate ,
      status: loan.status
    };
  });
});;

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

</script>

<style scoped>
.admin-borrows {
  padding: 20px;
}
.table-responsive {
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.table {
  margin-bottom: 0;
}
.table th {
  white-space: nowrap;
}
.table td {
  vertical-align: middle;
}
.badge {
  font-size: 0.9em;
  padding: 6px 10px;
}
.bg-secondary {
  background-color: #6c757d;
}
.bg-primary {
  background-color: #0d6efd;
}
.bg-success {
  background-color: #198754;
}
.bg-warning {
  background-color: #ffc107;
  color: #000;
}
</style>
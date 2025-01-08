<template>
<div class="page-admin">
  <div class="row mt-2">
    <div class="row justify-content-left my-sm-2">
      <p class="text-center-left col-2 fs-3">Bienvenue, {{ currentUser.login }}</p>
      <button 
          @click="$emit('logout')" 
          type="button" 
          class="btn btn-secondary col-2 my-3"
        >
      Déconnexion
      </button>
      </div>
      <div v-if="currentUser.role === 'user'">
        <UserBorrowedBooks />
      </div>
      <div v-else-if="currentUser.role === 'admin'">
        <AdminBorrowedBooks />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";
import UserBorrowedBooks from "./emprunt/UserBorrowedBooks.vue";
import AdminBorrowedBooks from "./emprunt/AdminBorrowedBooks.vue";

console.log(currentUser.value);
const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);
</script>

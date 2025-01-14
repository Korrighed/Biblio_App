<template>
  <div class="page-admin">
    <div class="row justify-content-evenly mt-1 mx-1">
      <p class="col-8 col-sm-6 fs-3 mb-0">
        Bienvenue, {{ currentUser.login }}
      </p>
      <button 
          @click="logout" 
          type="button" 
          class="btn btn-secondary col-1 col-md-3"
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
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";
import UserBorrowedBooks from "./emprunt/UserBorrowedBooks.vue";
import AdminBorrowedBooks from "./emprunt/AdminBorrowedBooks.vue";

const emit = defineEmits(['close']);
const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

const logout = () => { userStore.logout();};

</script>

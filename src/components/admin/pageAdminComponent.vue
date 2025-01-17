<template>
  <div class="page-admin">
    <div class="row justify-content-evenly my-2 mx-1">
      <p class="col-7 fs-5 mb-0 ">
        Bienvenue, {{ currentUser.login }}
      </p>
      <button
        @click="$emit('navigateToPage', 'books')"
        type="button"
        class="btn btn-info col-4 col-md-2 p-0 me-2"
      > Retour à la librairie</button>
      <button 
          @click="handleLogout" 
          type="button" 
          class="btn btn-secondary col-4 col-md-2 p-0"
        >
      Déconnexion
      </button>
    </div>
    <div v-if="currentUser.role === 'user'">
      <UserBorrowedBooks />
    </div>
    <div v-else-if="currentUser.role === 'admin'">
      <resetPasswordAdminComponent />
      <AdminBorrowedBooks />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";
import UserBorrowedBooks from "./emprunt/UserBorrowedBooks.vue";
import AdminBorrowedBooks from "./emprunt/AdminBorrowedBooks.vue";
import resetPasswordAdminComponent from "./password/resetPasswordAdminComponent.vue";

const emit = defineEmits(['logout', 'navigateToPage']);
const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

const handleLogout = () => {
  emit('logout');
};

</script>

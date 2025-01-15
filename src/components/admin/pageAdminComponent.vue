<template>
  <div class="page-admin">
    <div class="row justify-content-evenly mt-1 mx-1">
      <p class="col-8 col-sm-6 fs-3 mb-0">
        Bienvenue, {{ currentUser.username }}
      </p>
      <button 
          @click="handleLogout" 
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
      <resetpasswordAdminComponent />
      <AdminBorrowedBooks />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "../../stores/userStore";
import { usePasswordStore } from "../../stores/passwordStore";
import UserBorrowedBooks from "./emprunt/UserBorrowedBooks.vue";
import AdminBorrowedBooks from "./emprunt/AdminBorrowedBooks.vue";
import resetpasswordAdminComponent from "./password/resetpasswordAdminComponent.vue";

const emit = defineEmits(['close']);
const userStore = useUserStore();
const passwordStore = usePasswordStore();
const currentUser = computed(() => userStore.currentUser);

const handleLogout = () => {
    userStore.logout();
    
    if (passwordStore.resetInProgress) {
        passwordStore.clearResetRequest();
    }
    
    emit('close');
};

</script>

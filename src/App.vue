<template>
  <div class="row">
  <headerComponent 
  @showConnexion="showConnexion = true"
  @navigateToAdmin="navigateToAdminPage"  />
  </div>
  <logginModalComponent v-if="showConnexion" @close="showConnexion = false" />
  <div v-if="currentPage === 'admin'" class="row">
  <pageAdminComponent @logout="logout"/>
  </div>
  <div v-else class="row">
    <bookCardComponent />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import bookCardComponent from './components/bookCards/bookCardComponent.vue';
import logginModalComponent from './components/account/logginModalComponent.vue';
import headerComponent from './components/header/headerComponent.vue';
import pageAdminComponent from "./components/pageAdmin/pageAdminComponent.vue";
import { useUserStore } from './stores/userStore';

const showConnexion = ref(false);
const currentPage = ref("books");
const userStore = useUserStore(); 

// Routes
const navigateToAdminPage = () => {
  currentPage.value = "admin";
};

const navigateToBooksPage = () => {
  currentPage.value = "books";
};

const logout = () => {
  userStore.clearUser();
  navigateToBooksPage(); 
};

</script>


<style>
.primary {
  color: #6F4E37;
}

.secondary {
  color: #ECB176;
}


.alert {
  color: #A67B5B
}

.info {
  color: #FED8B1;
}
</style>
<template>
  <div class="row">
    <headerComponent @showConnexion="showConnexion = true" />
  </div>
  <connexionComponent v-if="showConnexion" @close="showConnexion = false" />
  <div class="row">
    <bookCardComponent />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import bookCardComponent from './components/bookCards/bookCardComponent.vue';
import connexionComponent from './components/account/logginModalComponent.vue';
import headerComponent from './components/header/headerComponent.vue';
const showConnexion = ref(false);
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
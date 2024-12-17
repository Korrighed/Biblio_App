<template>
  <div class="row">
    <connexionComponent />
  </div>
  <div class="row">
    <headerComponent/>
  </div>
  <div class="row">
    <bookCardComponent/>
  </div>

</template>
  
  <script setup>
    import bookCardComponent from './components/bookCards/bookCardComponent.vue'; 
    import headerComponent from './components/headerComponent.vue';
    import connexionComponent from './components/connexionComponent.vue';

   
  </script>
  
  
  <style>
.primary {
    color: #6F4E37 ;
  }
  .secondary {
    color: #ECB176 ;
  }


  .alert {
    color: #A67B5B
  }
  
  .info {
    color: #FED8B1 ;
  }


  </style>
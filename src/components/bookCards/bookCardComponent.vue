<template>
    <div class="row m-1 align-item-center">
      <div
        class="card justify-content-between p-0 col-lg-2 col-sm-5"
        v-for="(livre, index) in books"
        :key="index"
      >
        <div class="row g-0">
          <div class="col-4">
            <img
              :src="livre.image || 'default-cover.jpg'"
              class="img-fluid rounded-start ms-1 mt-lg-4"
              alt="couverture"
            />
          </div>
          <div class="col-8 p-0 m-0">
            <div class="card-body">
              <h5 class="card-title">{{ livre.titre }}</h5>
              <p class="card-text">Auteur : {{ livre.auteur || "Auteur inconnu" }}</p>
              <p class="card-text fs-6">ISBN : {{ livre.ISBN }}</p>
              <p class="card-text">État : {{ livre.etat }}</p>
            </div>
          </div>
          <div class="row">
            <DispoComponent
            :isbn="livre.ISBN"
            :emprunt="livre.emprunt" 
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import DispoComponent from "./dispoComponent.vue";
  
  const { books } = defineProps({
    books: {
      type: Array,
      required: true,
    },
  });
  </script>
  
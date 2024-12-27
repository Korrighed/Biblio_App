<template>
    <form @submit.prevent>
      <input
        type="text"
        placeholder="Rechercher un livre..."
        v-model="searchTerm"
        @input="onSearch"
        class="form-control"
      />
    </form>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useBookStore } from "../../stores/bookStore";
  
  const searchTerm = ref("");
  const bookStore = useBookStore();
  
  const onSearch = () => {
    bookStore.updateSearchQuery(searchTerm.value);
  };
  </script>
  
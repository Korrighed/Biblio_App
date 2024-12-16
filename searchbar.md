1. Créer le composant de la barre de recherche
Le composant de la barre de recherche (SearchBarComponent.vue) est un composant enfant.         
Collecte l'entrée utilisateur et transmet la valeur saisie au composant parent via un événement personnalisé.

Code du composant `SearchBarComponent.vue`
vue

```vue
<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 align-self-start">
        <form action="" class="search-form">
          <div class="form-group has-feedback">
            <input
              type="text" 
              @input="search" 
              class="form-control" >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['search']);

const search = (e) => {
  const query = e.target.value.trim(); // Supprime les espaces inutiles
  emit('search', query); // Émet l'événement avec la valeur
};
</script>
```
Gestion des événements : L'événement @input écoute les changements dans l'input utilisateur.
Émission d'événements : L'événement search est émis pour transmettre la valeur de recherche au composant parent.


2. Préparer les données dans le composant principal
Le composant principal (parentComponent.vue) est responsable de :

Charger les données.
Gérer l'état de la recherche (searchFilter).
Filtrer en fonction de l'entrée utilisateur.
Code corrigé de parentComponent.vue

```vue
<script setup>
import { ref, onMounted } from "vue";

import SearchBarComponent from "./searchBarComponent.vue";

const Data = ref([]); // Contient les données des items
const searchFilter = ref(''); // Contient la valeur de recherche

// Fonction pour récupérer la donnée
async function fetchData() {
  const booksLinks = "./data";
  try {
    const response = await axios.get(booksLinks);
    Data.value = response.data.items || []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des items :", error);
    Data.value = []; 
  }
}

// Fonction calculée pour filtrer les items
const filteredItems = computed(() => {
  if (!Array.isArray(Data.value)) return []; // Vérifiez que c'est un tableau

  if (searchFilter.value !== '') {
    return data.value.filter(item => 
      item.titre.toLowerCase().includes(searchFilter.value.toLowerCase()) || 
      item.auteur.toLowerCase().includes(searchFilter.value.toLowerCase())
    );
  }
  return data.value; // Retourne tous les items si aucun filtre
});

// Gestion de la recherche
const handleSearch = (search) => {
  searchFilter.value = search; 
};

// Charger les données lors du montage
onMounted(() => {
  fetchBooks();
});
</script>

<template>
  <div class="flex align-items-center justify-content-between">
    <!-- Barre de recherche -->
    **<SearchBarComponent @search="handleSearch" />**
  </div>
  
  <!-- Liste des items filtrés -->
  <div 
    class="card mb-3" 
    style="max-width: 20vw;" v-for="(item, index) in **filteredItems**" :key="index">
    <div class="row g-0">
        ...
    </div>
  </div>
</template>
```



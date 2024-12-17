<template>
  <div class="container">
    <div class="col-12">
      <label class="flex flex-nowrap mt-1">
        <input type="radio" value="disponible" :checked="isDisponible" disabled />
        <button v-if="isDisponible" type="button" class="btn btn-primary" value="disponible">
          Disponible
        </button>
        <span v-else >Disponible</span>
      </label>
      <label class="flex flex-nowrap">
        <input type="radio" value="emprunte" :checked="isEmprunte" disabled />
        <span class="whitespace-nowrap">Empruntée</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const { emprunt } = defineProps({
  emprunt: {
    type: String,
    required: true,
  },
});

const isDisponible = computed(() => emprunt !== "oui");
const isEmprunte = computed(() => emprunt === "oui");
</script>

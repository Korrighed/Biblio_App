<template>
    <label class ="flex flex-nowrap mt-1">
        <input type="radio" value="disponible" :checked="isDisponible" disabled />
        <span class="whitespace-nowrap">Disponible</span>
    </label>
    <label class ="flex flex-nowrap">
        <input type="radio" value="emprunte" :checked="isEmprunte" disabled />
        <span class="whitespace-nowrap">Emprunté</span>
    </label>
</template>

<script setup>

import { computed } from "vue";

const { emprunt } = defineProps({
  emprunt: {
    type: String,
    required: true,
  },
});

console.log("Prop emprunt reçue :", emprunt);
const isDisponible = computed(() => emprunt !== "oui");
const isEmprunte = computed(() => emprunt === "oui");

</script>

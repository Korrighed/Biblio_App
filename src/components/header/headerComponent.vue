<template>
    <div class="containermin-vh-25 py-3 py-md-5 header">
        <div class="row">
            <div class="col-9 align-content-center m-auto fs-5 text-center mt-3">
                Bienvenue sur l'intranet des amoureux du livre 
            </div>
            <div class="col-3">
                <button @click="showModal = true" type="button" class="btn btn-secondary mt-3" value="connexion">
                    Connexion
                </button>
            </div>
        </div>
    </div>
    <logginModalComponent v-if="showModal" @close="showModal = false" />
</template>

<script setup>
import { ref } from 'vue';
import logginModalComponent from '../account/logginModalComponent.vue'; 
const showModal = ref(false);
</script>

<style>
.header {
    color: white;
    background-color: #6F4E37
}
</style>
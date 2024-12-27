<template>
    <div class="containermin-vh-25 py-0 header">
        <div class="row">
            <div class="col-6 align-content-center m-auto fs-5 text-center mt-3">
                Bienvenu sur l'intranet des amoureux du livre
            </div>
            <div class="col-3">
                <button 
                @click="currentUser ? $emit('navigateToAdmin') : $emit('showConnexion')"
                type="button"
                class="btn btn-secondary my-3"
                >
                {{ currentUser ? currentUser.login : 'Connexion' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue"; 
import { useUserStore } from '../../stores/userStore';
const userStore = useUserStore();
const currentUser  = computed(() => userStore.currentUser);

defineEmits(['showConnexion']);

</script>

<style>
.header {
    color: white;
    background-color: #6F4E37
}
</style>
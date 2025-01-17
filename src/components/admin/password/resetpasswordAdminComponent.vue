<template>
    <div class ="container">
        <div class="row align-items-start">
            <div v-if="hasActiveReset" class="col-12 col-md-8">
                <div class="alert alert-info">
                    <h5>Demande active</h5>
                    <p>ID Utilisateur : {{ currentResetUserId }}</p>
                    <p>Code : <strong>{{ currentResetCode  }}</strong></p>
                    <p>Temps restant : {{ formattedTimeRemaining }}</p>
                </div>
            </div>
            <div v-else class="col-12 col-md-6 d-flex text-center mx-md-auto">
                <div class="alert alert-info text-start">
                    Aucune réinitialisation de mot de passe en cours
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { usePasswordStore } from '../../../stores/passwordStore';

const passwordStore = usePasswordStore();
const timeRemaining = ref(0);
const timer = ref(null);

const currentResetUserId = computed(() => passwordStore.currentResetUserId);
const currentResetCode = computed(() => passwordStore.currentResetCode);
const hasActiveReset = computed(() => passwordStore.resetInProgress);
const resetExpiration = computed(() => passwordStore.resetCodeExpiration);

const formattedTimeRemaining = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60);
    const seconds = timeRemaining.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

const updateTimer = () => {
    if (!resetExpiration.value) return;
    
    const now = Date.now();
    const timeLeft = Math.floor((resetExpiration.value - now) / 1000);
    
    if (timeLeft <= 0) {
        clearInterval(timer.value);
        passwordStore.clearResetRequest();
        timeRemaining.value = 0;
    } else {
        timeRemaining.value = timeLeft;
    }
};


const startTimer = () => {
    updateTimer();
    timer.value = setInterval(updateTimer, 1000);
};

onMounted(() => {
    if (hasActiveReset.value) {
        startTimer();
    }

    // Observer les changements dans le store
    watch(() => passwordStore.resetInProgress, (newValue) => {
        if (newValue) {
            startTimer();
        } else if (timer.value) {
            clearInterval(timer.value);
        }
    });
});

onUnmounted(() => {
    if (timer.value) {
        clearInterval(timer.value);
    }
});
</script>
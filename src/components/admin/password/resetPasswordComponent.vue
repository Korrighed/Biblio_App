// src/components/admin/password/resetpasswordComponent.vue
<template>
    <div class="reset-password-container">
        <h4 class="text-center mb-4">Réinitialisation du mot de passe</h4>
        <form @submit.prevent="handleSubmit" class="w-100">
            <div class="mb-3">
                <label class="form-label">Identifiant associatif :</label>
                <input
                    v-model="userId"
                    type="text"
                    class="form-control"
                    :disabled="step !== 1"
                    required
                />
            </div>

            <!-- Message d'attente si demande effectuée mais code pas encore actif -->
            <div v-if="step === 2 && !hasActiveCode" class="alert alert-warning">
                Contactez un administrateur pour recevoir votre code de réinitialisation
            </div>

            <!-- Formulaire de réinitialisation si code actif -->
            <template v-if="step === 2 && hasActiveCode">
                <div class="mb-3">
                    <label class="form-label">Code de réinitialisation :</label>
                    <input
                        v-model="resetCode"
                        type="text"
                        class="form-control"
                        maxlength="6"
                        pattern="\d{6}"
                        required
                    />
                </div>

                <div class="mb-3">
                    <label class="form-label">Nouveau mot de passe :</label>
                    <input
                        v-model="newPassword"
                        type="password"
                        class="form-control"
                        required
                    />
                </div>
            </template>

            <button
                type="submit"
                class="btn btn-primary d-block mx-auto"
                :disabled="loading || (step === 2 && !hasActiveCode)"
            >
                {{ submitButtonText }}
            </button>
        </form>

        <div v-if="error" class="alert alert-danger mt-3">
            {{ error }}
        </div>
        <div v-if="success" class="alert alert-success mt-3">
            {{ success }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePasswordStore } from '../../../stores/passwordStore';

const passwordStore = usePasswordStore();

const userId = ref('');
const resetCode = ref('');
const newPassword = ref('');
const step = ref(1);
const error = ref('');
const success = ref('');
const loading = ref(false);
const hasActiveCode = ref(false);

const submitButtonText = computed(() => {
    if (step.value === 1) return 'Valider l\'identifiant';
    return hasActiveCode.value ? 'Réinitialiser le mot de passe' : 'En attente du code';
});

const checkActiveCode = async () => {
    if (!userId.value) return;
    try {
        const isActive = await passwordStore.checkActiveReset(userId.value);
        hasActiveCode.value = isActive;
    } catch (err) {
        console.error('Erreur lors de la vérification du code:', err);
    }
};

const handleSubmit = async () => {
    error.value = '';
    success.value = '';
    loading.value = true;
    try {
        if (step.value === 1) {
            // Vérifie d'abord s'il y a déjà un code actif
            const isActive = await passwordStore.checkActiveReset(userId.value);
            if (isActive) {
                success.value = "Une demande est déjà en cours. Contactez un administrateur pour recevoir votre code.";
                hasActiveCode.value = true;
            } else {
                await passwordStore.initiatePasswordReset(userId.value);
                success.value = "Demande enregistrée. Contactez un administrateur pour recevoir votre code.";
            }
            step.value = 2;
        } else if (hasActiveCode.value) {
            await passwordStore.validateResetCode(userId.value, resetCode.value);
            await passwordStore.updatePassword(userId.value, newPassword.value);
            success.value = "Mot de passe mis à jour avec succès";
            setTimeout(() => {
                emits('close');
            }, 2000);
        }
    } catch (err) {
        error.value = err;
    } finally {
        loading.value = false;
    }
};

// Watch pour vérifier périodiquement si un code devient actif
watch(() => step.value, async (newValue) => {
    if (newValue === 2) {
        await checkActiveCode();
        const interval = setInterval(async () => {
            if (hasActiveCode.value) {
                clearInterval(interval);
            } else {
                await checkActiveCode();
            }
        }, 5000); // Vérifie toutes les 5 secondes
    }
});

const emits = defineEmits(['close']);
</script>

<style scoped>
.reset-password-container {
    padding: 20px;
}
</style>
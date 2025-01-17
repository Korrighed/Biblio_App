import { defineStore } from "pinia";
import { ref } from "vue";
import { initDB } from "../../public/indexedDB";

export const usePasswordStore = defineStore("passwordStore", () => {
    const resetInProgress = ref(false);
    const currentResetUserId = ref(null);
    const currentResetCode = ref(null);
    const resetCodeExpiration = ref(null);
    
    const generateResetCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const initiatePasswordReset = async (userId) => {
        const db = await initDB();
        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");

        return new Promise((resolve, reject) => {
            const request = store.get(userId);
            request.onsuccess = (event) => {
                const user = event.target.result;
                if (!user) {
                    reject("Utilisateur non trouvé");
                    return;
                }
                if (user.resetCode && user.resetCodeExpiration > Date.now()) {
                    reject("Une demande de réinitialisation est déjà en cours");
                    return;
                }

                const resetCode = generateResetCode();
                const expiration = Date.now() + (3 * 60 * 1000); 

                currentResetUserId.value = userId;
                currentResetCode.value = resetCode;
                resetCodeExpiration.value = expiration;
                resetInProgress.value = true;

                user.resetCode = resetCode;
                user.resetCodeExpiration = expiration;
                
                const updateRequest = store.put(user);
                updateRequest.onsuccess = () => resolve(resetCode);
                updateRequest.onerror = () => reject("Erreur lors de la sauvegarde du code");
            };

            request.onerror = () => reject("Erreur lors de l'accès à la base de données");
        });
    };

    const validateResetCode = async (userId, code) => {
        const db = await initDB();
        const transaction = db.transaction("users", "readonly");
        const store = transaction.objectStore("users");

        return new Promise((resolve, reject) => {
            const request = store.get(userId);
            
            request.onsuccess = (event) => {
                const user = event.target.result;
                if (!user || !user.resetCode) {
                    reject("Aucune demande de réinitialisation en cours");
                    return;
                }

                // Vérification de l'expiration
                if (Date.now() > user.resetCodeExpiration) {
                    reject("Code expiré");
                    return;
                }

                // Vérification du code
                if (user.resetCode !== code) {
                    reject("Code incorrect");
                    return;
                }

                resolve(true);
            };

            request.onerror = () => reject("Erreur lors de la vérification du code");
        });
    };

    const updatePassword = async (userId, newPassword) => {
        const db = await initDB();
        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");

        return new Promise((resolve, reject) => {
            const request = store.get(userId);
            
            request.onsuccess = (event) => {
                const user = event.target.result;
                if (!user) {
                    reject("Utilisateur non trouvé");
                    return;
                }

                // Mise à jour du mot de passe et nettoyage des données de réinitialisation
                user.password = btoa(newPassword);
                user.resetCode = null;
                user.resetCodeExpiration = null;

                const updateRequest = store.put(user);
                
                updateRequest.onsuccess = () => {
                    clearResetRequest();
                    resolve("Mot de passe mis à jour avec succès");
                };
                
                updateRequest.onerror = () => reject("Erreur lors de la mise à jour du mot de passe");
            };

            request.onerror = () => reject("Erreur lors de l'accès à la base de données");
        });
    };

    const clearResetRequest = () => {
        resetInProgress.value = false;
        currentResetUserId.value = null;
        currentResetCode.value = null;
        resetCodeExpiration.value = null;
    };

    const checkActiveReset = async (userId) => {
        const db = await initDB();
        const transaction = db.transaction("users", "readonly");
        const store = transaction.objectStore("users");

        return new Promise((resolve) => {
            const request = store.get(userId);
            
            request.onsuccess = (event) => {
                const user = event.target.result;
                if (!user || !user.resetCode || Date.now() > user.resetCodeExpiration) {
                    resolve(false);
                    return;
                }
                resolve(true);
            };

            request.onerror = () => resolve(false);
        });
    };

    return {
        resetInProgress,
        currentResetUserId,
        currentResetCode,
        resetCodeExpiration,
        initiatePasswordReset,
        validateResetCode,
        updatePassword,
        clearResetRequest,
        checkActiveReset
    };
});
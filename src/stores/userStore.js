import { defineStore } from "pinia";
import { ref } from "vue";
import { initDB } from "../database/indexedDB";

export const useUserStore = defineStore("userStore", () => {
    const currentUser = ref(null);

    // Fonction pour connecter un utilisateur
    const login = async (username, password) => {
        const db = await initDB();
        const transaction = db.transaction("users", "readonly");
        const store = transaction.objectStore("users");
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const users = event.target.result;
                console.log("Données récupérées depuis IndexedDB :", users);

                const user = users.find((u) => u.login === username);
                console.log("Utilisateur trouvé :", user);

                if (!user) {
                    reject("Nom d'utilisateur introuvable !");
                    return;
                }

                if (atob(user.password) !== password) {
                    reject("Mot de passe incorrect !");
                    return;
                }

                currentUser.value = user;
                console.log("Utilisateur connecté :", currentUser.value);
                resolve("Connexion réussie !");
            };

            request.onerror = (event) => {
                console.error("Erreur lors de la connexion :", event);
                reject("Erreur lors de la connexion.");
            };
        });
    };

    const logout = () => {
        currentUser.value = null;
        console.log("Déconnexion réussie !");
    };
    return {
        currentUser,
        login,
        logout,
    };
});
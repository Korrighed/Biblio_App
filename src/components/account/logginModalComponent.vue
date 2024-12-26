<template>
    <div class="modal-overlay">
        <div class="container">
            <div class="row justify-content-center">
                <div class="modal-content col-lg-4 col-sm-5 mx-auto">

                    <button @click="$emit('close')" class="btn-close"></button>
                    <h3 class="text-center">{{ isLoginMode ? "Connexion" : "Inscription" }}</h3>

                    <form @submit.prevent="handleSubmit" class="w-100">
                        <div v-if="!isLoginMode" class="mb-2 col-12">
                            Identifiant associatif :
                            <input v-model="volunteerId" type="text" class="form-control" required />
                        </div>
                        <div class="mb-2 col-12">
                            Nom d'utilisateur :
                            <input v-model="username" type="text" class="form-control" required />
                        </div>
                        <div class="mb-2 col-12">
                            Mot de passe :
                            <input v-model="password" type="password" class="form-control" required />
                        </div>
                        <button type="submit" class="btn btn-primary col-3 mt-2 mx-auto d-block">
                            {{ isLoginMode ? "Connexion" : "S'inscrire" }}
                        </button>
                        <p class="text-center mt-3">
                            {{ isLoginMode ? "Pas encore de compte ?" : "Déjà inscrit ?" }}
                            <a href="#" @click.prevent="toggleMode">
                                {{ isLoginMode ? "Créer un compte" : "Se connecter" }}
                            </a>
                        </p>
                    </form>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { initDB } from "../../database/indexedDB"; // Import IndexedDB configuration
import { useUserStore } from "../../stores/userStore"; // Import Pinia store

const isLoginMode = ref(true); // Mode : Connexion ou Inscription
const volunteerId = ref(""); // ID associatif
const username = ref(""); // Nom d'utilisateur
const password = ref(""); // Mot de passe
const userStore = useUserStore(); // Pinia store
defineEmits(['close']);


// Basculer entre Connexion et Inscription
const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value;
};


// Fonction pour gérer l'inscription d'un utilisateur
const registerUser = async (id, username, password) => {
    const db = await initDB();
    const transaction = db.transaction("users", "readwrite");
    const store = transaction.objectStore("users");

    console.log("ID fourni :", id); 
    const userRequest = store.get(id);

    userRequest.onsuccess = (event) => {
        const user = event.target.result;
        console.log("Utilisateur trouvé :", user);

        if (!user) {
            alert("ID associatif non trouvé !");
            return;
        }

        if (user.login) {
            alert("Cet ID est déjà utilisé !");
            return;
        }

        // Mise à jour des informations de l'utilisateur
        user.login = username;
        user.password = btoa(password); // Encodage du mot de passe
        store.put(user);

        alert("Inscription réussie !");
    };

    userRequest.onerror = (event) => {
        console.error("Erreur lors de l'inscription :", event);
    };
};

// Fonction pour gérer la connexion d'un utilisateur
const loginUser = async (username, password) => {
    const db = await initDB();
    const transaction = db.transaction("users", "readonly");
    const store = transaction.objectStore("users");

    const userRequest = store.getAll();

    userRequest.onsuccess = (event) => {
        const users = event.target.result;
        const user = users.find((u) => u.login === username);

        if (!user) {
            alert("Nom d'utilisateur introuvable !");
            return;
        }

        if (atob(user.password) === password) {
            alert("Connexion réussie !");
            userStore.setUser(user); // Mettre à jour l'état global avec Pinia
        } else {
            alert("Mot de passe incorrect !");
        }
    };

    userRequest.onerror = (event) => {
        console.error("Erreur lors de la connexion :", event);
    };
};


const errorMessage = ref(""); 
const successMessage = ref("");
// Gérer le formulaire de soumission
const handleSubmit = async () => {
    errorMessage.value = "";
    successMessage.value = "";
    if (!username.value || !password.value) {
        errorMessage.value = "Tous les champs doivent être remplis.";
        return;
    }
    if (isLoginMode.value) {
        // Connexion
        try {
            await loginUser(username.value, password.value);
            successMessage.value = "Connexion réussie";
            } catch (error) {
                errorMessage.value = error.message || "Erreur lors de la connexion.";
            }
    } else {
        // Inscription
        if (!volunteerId.value) {
            errorMessage.value = "L'ID associatif est requis pour l'inscription.";
            return;
        }
        try {
            await registerUser(volunteerId.value, username.value, password.value);
            successMessage.value = "Inscription réussie !";
        } catch (error) {
            errorMessage.value = error.message || "Erreur lors de l'inscription.";
        }
    }
};
</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #6f4e37 !important;
    color: white !important;
    padding: 20px;
    border-radius: 8px !important;
    max-width: 50%;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3);
}

.btn-close {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>
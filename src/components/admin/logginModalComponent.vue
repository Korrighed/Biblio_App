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
                    <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
                    <p v-if="successMessage" class="text-success mt-2">{{ successMessage }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { initDB } from "../../database/indexedDB";
import { useUserStore } from "../../stores/userStore";

// Emits
const emit = defineEmits(["close"]);

// States locaux
const isLoginMode = ref(true);
const volunteerId = ref("");
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");

// Store
const userStore = useUserStore();

// Basculer entre mode connexion / inscription
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
};

// Gérer la soumission du formulaire
const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!username.value || !password.value) {
    errorMessage.value = "Tous les champs doivent être remplis.";
    return;
  }

  // ========= MODE CONNEXION =========
  if (isLoginMode.value) {
    try {
      // Appel direct au store
      const message = await userStore.login(username.value, password.value);
      successMessage.value = message;
      // En cas de succès, on ferme la modale
      emit("close");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      errorMessage.value = error;
    }
  } 
  // ========= MODE INSCRIPTION =========
  else {
    if (!volunteerId.value) {
      errorMessage.value = "L'ID associatif est requis pour l'inscription.";
      return;
    }

    try {
      // Traitement d'inscription dans le composant
      // (Tu peux le déplacer dans le store si tu préfères)
      const db = await initDB();
      const transaction = db.transaction("users", "readwrite");
      const store = transaction.objectStore("users");

      const userRequest = store.get(volunteerId.value);

      userRequest.onsuccess = (event) => {
        const user = event.target.result;

        if (!user) {
          errorMessage.value = "ID associatif non trouvé !";
          return;
        }

        if (user.login) {
          errorMessage.value = "Cet ID est déjà utilisé !";
          return;
        }

        user.login = username.value;
        user.password = btoa(password.value);
        store.put(user);

        transaction.oncomplete = () => {
          successMessage.value = "Inscription réussie !";
        };

        transaction.onerror = (event) => {
          errorMessage.value = "Erreur lors de l'inscription.";
        };
      };

      userRequest.onerror = (event) => {
        errorMessage.value = "Erreur lors de la récupération de l'utilisateur.";
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      errorMessage.value = "Une erreur est survenue pendant l'inscription.";
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

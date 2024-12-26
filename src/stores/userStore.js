import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    currentUser: null, // Stocke l'utilisateur connecté
  }),
  actions: {
    setUser(user) {
      this.currentUser = user; // Met à jour l'utilisateur connecté
    },
    clearUser() {
      this.currentUser = null; // Déconnecte l'utilisateur
    },
  },
});

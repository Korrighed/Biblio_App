import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("userStore", () => {
  const currentUser = ref(null);

  const login = (user) => {
    currentUser.value = user;
  };

  const clearUser = () => {
    currentUser.value = null;
  };

  return { currentUser, login, clearUser };
});

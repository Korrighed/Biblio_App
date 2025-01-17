import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useBookStore } from "./bookStore";
import { useUserStore } from "./userStore";
import { initDB } from "../../public/indexedDB";

export const useBorrowStore = defineStore("borrowStore", () => {
    const borrowHistory = ref([]);
    const activeLoansData = ref([]);
    const allLoansData = ref([]); // Nouvelle référence pour tous les emprunts
    const userStore = useUserStore();
    const isLoading = ref(false);

    const activeLoans = computed(() => 
        activeLoansData.value.filter(loan => loan.status === "borrowed")
    );

    const allLoans = computed(() => allLoansData.value);

    async function borrowBook(isbn) {
        const db = await initDB();
        const transaction = db.transaction("borrows", "readwrite");
        const store = transaction.objectStore("borrows");

        const borrow = {
            userId: userStore.currentUser.id,
            ISBN: isbn,
            borrowDate: new Date().toISOString(), // Stockage en ISO string pour cohérence
            status: "borrowed",
            returnDate: null // Initialisation explicite à null
        };

        await new Promise((resolve) => {
            store.add(borrow).onsuccess = resolve;
        });
        logBorrowHistory(isbn, userStore.currentUser.id, "borrowed");
        await loadActiveLoans();
    }

    function logBorrowHistory(isbn, userId, action) {
        const historyEntry = {
            isbn,
            userId,
            action,
            timestamp: new Date().toISOString()
        };
        borrowHistory.value.push(historyEntry);
    }

    async function loadActiveLoans() {
        if (isLoading.value) return; // Évite les appels multiples
        isLoading.value = true;

        try {
            const db = await initDB();
            const transaction = db.transaction("borrows", "readonly");
            const store = transaction.objectStore("borrows");

            return new Promise((resolve, reject) => {
                const request = store.getAll();

                request.onsuccess = (event) => {
                    const allLoans = event.target.result;
                    allLoansData.value = allLoans;
                    activeLoansData.value = allLoans;
                    resolve();
                };

                request.onerror = (event) => {
                    console.error("Erreur chargement emprunts:", event);
                    reject(event);
                };
            });
        } finally {
            isLoading.value = false;
        }
    }   

    async function returnBook(isbn) {
        if (isLoading.value) return;
        isLoading.value = true;

        try {
            const db = await initDB();
            const transaction = db.transaction("borrows", "readwrite");
            const store = transaction.objectStore("borrows");
            const index = store.index("ISBN");

            return new Promise((resolve, reject) => {
                const request = index.getAll(isbn);

                request.onsuccess = async (event) => {
                    const borrows = event.target.result;
                    // Trouve le dernier emprunt actif pour cet ISBN
                    const activeBorrow = borrows
                        .filter(b => b.userId === userStore.currentUser?.id)
                        .find(b => b.status === "borrowed");

                    if (!activeBorrow) {
                        reject(new Error(`Aucun emprunt actif trouvé pour l'ISBN: ${isbn}`));
                        return;
                    }

                    activeBorrow.status = "returned";
                    activeBorrow.returnDate = new Date().toISOString();

                    const updateRequest = store.put(activeBorrow);

                    updateRequest.onsuccess = () => {
                        logBorrowHistory(isbn, userStore.currentUser?.id, "returned");
                        resolve();
                    };

                    updateRequest.onerror = (error) => reject(error);
                };

                request.onerror = (error) => reject(error);
            });
        } finally {
            isLoading.value = false;
        }
    }

    return {
        borrowHistory,
        borrowBook,
        returnBook,
        activeLoans,
        allLoans,
        loadActiveLoans,
        isLoading
    };
});
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useBookStore } from "./bookStore";
import { useUserStore } from "./userStore";
import { initDB } from "../database/indexedDB";

export const useBorrowStore = defineStore("borrowStore", () => {
    const borrowHistory = ref([]);
    const activeLoansData = ref([]);
    const allLoansData = ref([]); // Nouvelle référence pour tous les emprunts
    const bookStore = useBookStore();
    const userStore = useUserStore();

    const activeLoans = computed(() => activeLoansData.value);

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
        const db = await initDB();
        const transaction = db.transaction("borrows", "readonly");
        const store = transaction.objectStore("borrows");
        
        return new Promise((resolve) => {
            store.getAll().onsuccess = (event) => {
                // Stocker tous les emprunts
                allLoansData.value = event.target.result;
                // Filtrer les emprunts actifs
                activeLoansData.value = event.target.result.filter(b => b.status === "borrowed");
                resolve();
            };
        });
    }

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

    async function returnBook(isbn) {
        const db = await initDB();
        const transaction = db.transaction("borrows", "readwrite");
        const store = transaction.objectStore("borrows");

        const index = store.index("ISBN");
        await new Promise((resolve) => {
            index.get(isbn).onsuccess = async (event) => {
                const borrow = event.target.result;
                if (borrow) {
                    borrow.status = "returned";
                    borrow.returnDate = new Date().toISOString(); // Stockage en ISO string
                    store.put(borrow).onsuccess = resolve;
                } else {
                    resolve();
                }
            };
        });
        
        logBorrowHistory(isbn, userStore.currentUser.id, "returned");
        await loadActiveLoans();
    }

    // Ajout d'un getter pour tous les emprunts
    const allLoans = computed(() => allLoansData.value);

    return {
        borrowHistory,
        borrowBook,
        returnBook,
        activeLoans,
        allLoans, // Export du nouveau getter
        loadActiveLoans
    };
});
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useBookStore } from "./bookStore";
import { useUserStore } from "./userStore";
import { initDB } from "../database/indexedDB";

export const useBorrowStore = defineStore("borrowStore", () => {
    const borrowHistory = ref([]);
    const activeLoansData = ref([]);
    const bookStore = useBookStore();
    const userStore = useUserStore();

    async function loadActiveLoans() {
        const db = await initDB();
        const transaction = db.transaction("borrows", "readonly");
        const store = transaction.objectStore("borrows");
        
        return new Promise((resolve) => {
            store.getAll().onsuccess = (event) => {
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
            borrowDate: new Date(),
            status: "borrowed"
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
                borrow.status = "returned";
                borrow.returnDate = new Date();
                store.put(borrow).onsuccess = resolve;
            };
        });
        
        logBorrowHistory(isbn, userStore.currentUser.id, "returned");
        await loadActiveLoans();
    }

    function logBorrowHistory(isbn, userId, action) {
        borrowHistory.value.push({
            bookISBN: isbn,
            userId,
            action,
            date: new Date()
        });
    }

    const activeLoans = computed(() => activeLoansData.value);

    return {
        borrowHistory,
        borrowBook,
        returnBook,
        activeLoans,
        loadActiveLoans
    };
});
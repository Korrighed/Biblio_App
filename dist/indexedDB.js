export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("UserDB", 4);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains("users")) {
                const userStore = db.createObjectStore("users", { keyPath: "id" });
                userStore.createIndex("role", "role", { unique: false });
                userStore.createIndex("resetCode", "resetCode", { unique: false });
                userStore.createIndex("resetCodeExpiration", "resetCodeExpiration", { unique: false });
            }
            if (!db.objectStoreNames.contains("borrows")) {
                const borrowStore = db.createObjectStore("borrows", { keyPath: "id", autoIncrement: true });
                borrowStore.createIndex("userId", "userId", { unique: false });
                borrowStore.createIndex("ISBN", "ISBN", { unique: false });
                borrowStore.createIndex("status", "status", { unique: false });
                borrowStore.createIndex("returnDate", "returnDate", { unique: false });
            } else {
                const borrowStore = event.currentTarget.transaction.objectStore("borrows");
                if (!borrowStore.indexNames.contains("borrowDate")) {
                    borrowStore.createIndex("borrowDate", "borrowDate", { unique: false });
                }
                if (!borrowStore.indexNames.contains("returnDate")) {
                    borrowStore.createIndex("returnDate", "returnDate", { unique: false });
                }
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error("Erreur lors de l'ouverture d'IndexedDB :", event);
            reject(event);
        };
    });
};

export const populateUsers = async (db) => {
    try {
        // Déterminer le bon chemin selon l'environnement
        const basePath = import.meta.env.MODE === 'production' 
            ? '/Biblio_App/users.json'  // Chemin pour GitHub Pages
            : '/users.json';            // Chemin pour le développement local

        const response = await fetch(basePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const usersFromJSON = await response.json();

        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");

        // Utiliser Promise.all pour gérer toutes les opérations de façon asynchrone
        const operations = usersFromJSON.map(user => {
            return new Promise((resolve, reject) => {
                const request = store.get(user.id);

                request.onsuccess = (event) => {
                    const existingUser = event.target.result;
                    if (existingUser) {
                        existingUser.login = existingUser.login || user.login;
                        existingUser.password = existingUser.password || user.password;
                        existingUser.role = existingUser.role || user.role;
                        store.put(existingUser);
                    } else {
                        store.add(user);
                    }
                    resolve();
                };

                request.onerror = (event) => {
                    console.error("Erreur lors de la récupération de l'utilisateur :", event);
                    reject(event);
                };
            });
        });

        await Promise.all(operations);
        console.log('Tous les utilisateurs ont été traités avec succès');

    } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        throw error; // Propager l'erreur pour la gestion en amont
    }
};


const addUserToIndexedDB = (db, user) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");

        const addRequest = store.add(user);
        addRequest.onsuccess = () => {
            resolve();
        };

        addRequest.onerror = (event) => {
            console.error("Erreur lors de l'ajout de l'utilisateur :", user, event.target.error);
            reject(event.target.error);
        };
    });
};

export const getAllUsers = async () => {
    const db = await initDB();
    const transaction = db.transaction("users", "readonly");
    const store = transaction.objectStore("users");

    const request = store.getAll();

    request.onsuccess = (event) => {
    };
    request.onerror = (event) => {
        console.error("Erreur lors de la récupération des utilisateurs :", event);
    };
};

(async () => {
    const db = await initDB();
    await getAllUsers();
})();
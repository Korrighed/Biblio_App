export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("UserDB", 2);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains("users")) {
                const userStore = db.createObjectStore("users", { keyPath: "id" });
                userStore.createIndex("role", "role", { unique: false });
            }
            if (!db.objectStoreNames.contains("borrows")) {
                const borrowStore = db.createObjectStore("borrows", { keyPath: "id", autoIncrement: true });
                borrowStore.createIndex("userId", "userId", { unique: false });
                borrowStore.createIndex("ISBN", "ISBN", { unique: false });
                borrowStore.createIndex("status", "status", { unique: false });
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
        const response = await fetch("/users.json");
        const usersFromJSON = await response.json();

        const transaction = db.transaction("users", "readwrite");
        const store = transaction.objectStore("users");

        for (const user of usersFromJSON) {
            const request = store.get(user.id);

            request.onsuccess = (event) => {
                const existingUser = event.target.result;

                if (existingUser) {
                    // Met à jour uniquement les champs manquants
                    existingUser.login = existingUser.login || user.login;
                    existingUser.password = existingUser.password || user.password;
                    existingUser.role = existingUser.role || user.role;
                    store.put(existingUser);
                } else {
                    // Ajoute un nouvel utilisateur si inexistant
                    store.add(user);
                }
            };

            request.onerror = (event) => {
                console.error("Erreur lors de la récupération de l'utilisateur :", event);
            };
        }

        transaction.oncomplete = () => {
        };
    } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
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

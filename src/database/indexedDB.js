export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("UserDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Créer un Object Store pour les utilisateurs
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "id" }); 
            }
        };

        request.onsuccess = (event) => {
            // console.log("Base de données IndexedDB ouverte avec succès !");
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            console.error("Erreur lors de l'ouverture d'IndexedDB :", event);
            reject(event);
        };
    });
};

export const populateUsers = async (db) => {
    // console.log("Chargement des utilisateurs depuis users.json...");

    try {
        // Étape 1 : Charger les utilisateurs depuis users.json
        const response = await fetch("/users.json");
        const usersFromJSON = await response.json();

        // Étape 2 : Récupérer les utilisateurs existants dans IndexedDB
        const transaction = db.transaction("users", "readonly");
        const store = transaction.objectStore("users");

        const request = store.getAll();
        request.onsuccess = async (event) => {
            const existingUsers = event.target.result;

            // Créer un ensemble des IDs existants dans IndexedDB
            const existingIds = new Set(existingUsers.map((user) => user.id));
            // Étape 3 : Ajouter les utilisateurs manquants
            const newUsers = usersFromJSON.filter((user) => !existingIds.has(user.id));
            // console.log("Nouveaux utilisateurs à ajouter :", newUsers);

            if (newUsers.length > 0) {
                const writeTransaction = db.transaction("users", "readwrite");
                const writeStore = writeTransaction.objectStore("users");

                for (const user of newUsers) {
                    const addRequest = writeStore.add(user);
                    addRequest.onsuccess = () => {
                        // console.log("Utilisateur ajouté :", user);
                    };

                    addRequest.onerror = (event) => {
                        console.error("Erreur lors de l'ajout de l'utilisateur :", user, event.target.error);
                    };
                }

                writeTransaction.oncomplete = () => {
                    // console.log("Tous les nouveaux utilisateurs ont été ajoutés avec succès !");
                };

                writeTransaction.onerror = (event) => {
                    console.error("Erreur dans la transaction d'ajout :", event.target.error);
                };
            } else {
                // console.log("Aucun utilisateur à ajouter. Tous les IDs sont déjà présents.");
            }
        };

        request.onerror = (event) => {
            console.error("Erreur lors de la récupération des utilisateurs existants :", event.target.error);
        };
    } catch (error) {
        console.error("Erreur lors du chargement de users.json :", error);
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
        console.log("Utilisateurs dans IndexedDB :", event.target.result);
    };
    request.onerror = (event) => {
        console.error("Erreur lors de la récupération des utilisateurs :", event);
    };
};

(async () => {
    const db = await initDB();
    // await getAllUsers();
})();

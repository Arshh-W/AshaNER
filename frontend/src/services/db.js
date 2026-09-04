const DB_NAME = "ashaner-db";
const DB_VERSION = 1;

const STORES = {
    syncQueue: "syncQueue",
    gameSessions: "gameSessions",
    patientData: "patientData",
    cache: "cache"
};

const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );

        request.onupgradeneeded = () => {
            const db = request.result;

            Object.values(STORES).forEach(
                (storeName) => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(
                            storeName,
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );
                    }
                }
            );
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};

const add = async (
    storeName,
    data
) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            db.transaction(
                storeName,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request = store.add(data);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

const put = async (
    storeName,
    data
) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            db.transaction(
                storeName,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request = store.put(data);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

const get = async (
    storeName,
    id
) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            db.transaction(
                storeName,
                "readonly"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

const getAll = async (
    storeName
) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            db.transaction(
                storeName,
                "readonly"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

const remove = async (
    storeName,
    id
) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            db.transaction(
                storeName,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request = store.delete(id);

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

const clear = async (
    storeName
) => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction =
            db.transaction(
                storeName,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                storeName
            );

        const request = store.clear();

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

export {
    DB_NAME,
    DB_VERSION,
    STORES,
    openDatabase,
    add,
    put,
    get,
    getAll,
    remove,
    clear
};

export default {
    openDatabase,
    add,
    put,
    get,
    getAll,
    remove,
    clear
};
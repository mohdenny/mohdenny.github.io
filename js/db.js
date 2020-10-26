const dbPromised = idb.open("aligdb", 1, function (upgradeDb) {
    const teamsObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    teamsObjectStore.createIndex("name", "name", { unique: false });
});

function saveFavorit(team) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(team);
            store.add(team);
            return tx.complete;
        })
        .then(function () {
            console.log("Team favorit berhasil ditambahkan");
        });
}

function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function (teams) {
                resolve(teams);
            });
    });
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");

                return store.get(id);
            })
            .then(function (team) {
                resolve(team);
            });
    });

}

function deleteFavorit(id) {
    dbPromised
        .then(function(db) {
            let tx = db.transaction('teams', 'readwrite');
            let store = tx.objectStore('teams');
            store.delete(parseInt(id));
            return tx.complete;
        })
        .then(function() {
            console.log('Item deleted');
            window.location.href ="index.html#favorit";
        });  
}

// function getRowCount() {
//   return new Promise(function(resolve, reject) {
//     dbPromised
//       .then(function(db) {
//         var tx = db.transaction("users", "readonly");
//         var store = tx.objectStore("users");
//         return store.count();
//       })
//       .then(function(users) {
//         resolve(users);
//       });
//   });
// }
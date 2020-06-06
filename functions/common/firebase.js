const admin = require('firebase-admin');
var serviceAccount = require("../env/playground-whatever-firebase-adminsdk-3hxof-bf7505220d.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://playground-whatever.firebaseio.com"
});
// admin.initializeApp();
const db = admin.firestore();


const firestore = {

  findCollectionByDocId: async function (collectionId, docId) {
    const doc = await db.collection(collectionId).doc(docId).get();
    if (doc.exists) {
      return doc.data();
    }
    throw new Error("No such document");
  },

  saveCollection: async function (collectionId, docId, data) {
    await db.collection(collectionId).doc(docId).set(data);
  },

};


module.exports = {
  firestore: firestore,
}
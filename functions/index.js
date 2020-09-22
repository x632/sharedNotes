const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['http://localhost:5000','http://:localhost5001']}));

/* app.get('/:id', async (request, response) =>{
  const userCollectionRef = db.collection('users').doc(code).collection("objects");
  //const userCollectionRef = db.collection('users');
  const result = await userCollectionRef.doc(request.params.id).get();
  const id = result.id;
  const user = result.data();

  response.status(200).send({ id, ...user });
})  */

//app.get('/', async (request, response) =>{
  app.get('/:id', async (request, response) =>{
  const newUser = request.body;
  const aut = request.params.id;
  const userCollectionRef = db.collection('users').doc(aut).collection('objects');
  const result = await userCollectionRef.get();
  
  let users = [];

  result.forEach((userDoc) =>{
    let id = userDoc.id;
    let data = userDoc.data();
    users.push({ id, ...data});
  })
  response.status(200).send(users);
})

app.post('/', async (request, response) =>{
    const newUser = request.body;
    const aut = request.params.code;
    const userCollectionRef = db.collection('users').doc(aut).collection('objects');
    const result = await userCollectionRef.post();
    response.status(200).send(result);
})

app.delete('/:id/:code', async (request, response) =>{
  const aut = request.params.code;
  const id = request.params.id;
  const userCollectionRef = db.collection('users').doc(aut).collection('objects');
  const result = await userCollectionRef.doc(id).delete();

  response.status(200).send(result);
})

app.put('/:id/:code', async (request, response) =>{
  const id = request.params.id;
  const aut = request.params.code;
  const userCollectionRef = db.collection('users').doc(aut).collection('objects');
  const result = await userCollectionRef.doc(id).update(request.body);
  
  response.status(200).send(result);
})
exports.users = functions.https.onRequest(app);
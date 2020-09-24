const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['http://localhost:5000','http://:localhost5001']}));


app.get('/:id', async (request, response) =>{
  try {
    const aut = request.params.id;
    const userCollectionRef = db.collection('users').doc(aut).collection('objects');
    const result = await userCollectionRef.get();
  
    let users = [];

    result.forEach((userDoc) =>{
    let id = userDoc.id;
    let data = userDoc.data();
    users.push({ id, ...data});
  });
  response.status(200).send(users);
}

catch(error){
  console.log(error);
  response.status(500).send(error.message);

}
});

app.post('/:code', async (request, response) =>{
  try{  
    const newUser = request.body;
    if(!newUser.date || !newUser.name || !newUser.note){
      return response.status(400).send("Date, name and note are all required (from server).")
    }

    const aut = request.params.code;
    const userCollectionRef = db.collection('users').doc(aut).collection('objects');
    const result = await userCollectionRef.add(newUser);
    return response.status(200).send(result);

  }
  catch(error) {
    console.log(error);
    return response.status(500).send(error.message);
  }
});

app.delete('/:id/:code', async (request, response) =>{
  try {
    const aut = request.params.code;
    const id = request.params.id;
    const userRef = db.collection('users').doc(aut).collection('objects').doc(id);
    const user = await userRef.get();

    if (user.exists){
      const result = await userRef.delete();
      return response.status(200).send(result);
    }

    return response.status(404).send();
  
  }
  catch(error){
    console.log(error);
    return response.status(500).send(error.message);
  }
});

app.put('/:id/:code', async (request, response) =>{
  try{  
    const newUser = request.body;
    if(!newUser.date || !newUser.name || !newUser.note){
      return response.status(400).send("Date, name and note are all required (message from server).")
    }
    const id = request.params.id;
    const aut = request.params.code;
    const userRef = db.collection('users').doc(aut).collection('objects').doc(id);
    const user = await userRef.get();

    if (user.exists){
      const result = await userRef.update(newUser);
      return response.status(200).send(result);
    }

    return response.status(404).send("Message not found.");

  } catch(error) {
      console.log(error);
      return response.status(500).send(error.message);
    }
  
});
exports.users = functions.https.onRequest(app);
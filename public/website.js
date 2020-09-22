
let user = null;
let code = "";
const url = "http://localhost:5001/sharednotes-53fbe/us-central1/users";
let bgCol;   
let hilitedUsers = [];
let usersDates = [];
let users = []; 
const userTable = document.querySelector('#userTable')
var selected = false;
var showWarning = document.getElementById("invis");
var showEMWarning = document.getElementById("emptyMessage");
showWarning.style.visibility = 'hidden';
firebase.initializeApp({
    apiKey: 'AIzaSyBrh3S6M5ElBYqtpxMrMkCgITtcodH4WOA',
    authDomain: 'sharednotes-53fbe.firebaseapp.com',
    projectId: 'sharednotes-53fbe'
  });
  
  var db = firebase.firestore();


//sections
const firstPageSection = document.getElementById('firstPageSection');
const setupFamilySection = document.getElementById('setupFamilySection');
const mainSection = document.getElementById('mainSection');
const loginSection = document.getElementById('loginSection');

//firstpage
const nextButton = document.getElementById('nextButton');
let email = document.getElementById("emailSection").value;
let password = document.getElementById("passwordSection").value;
showFirstPageSection();
//showSetupFamilySection();
function showFirstPageSection(){
    mainSection.style.display = "none";
    firstPageSection.style.display = "block";
    loginSection.style.display = "none";
    setupFamilySection.style.display = "none";
}

function showSetupFamilySection(){
    let email = document.getElementById("emailSection").value;
    let password = document.getElementById("passwordSection").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        showFirstPageSection();
        });
      console.log ("Useraccount halfcreated")
    mainSection.style.display = "none";
    firstPageSection.style.display = "none";
    loginSection.style.display = "none";
    setupFamilySection.style.display = "block";
}


function createInputElements() {
    const famMembers = document.getElementById ('numbersOfFamMembers').value;
    var y = document.createElement("SPAN");
    var t = document.createTextNode('Please enter the first names/nicknames of the familymembers. Put your first name in the first box (used also for login)');
    y.appendChild(t);
    document.getElementById("test").appendChild(y);
    var newLine = document.getElementById('test');
    newLine.innerHTML += "<br><br>";
    for(i = 0; i < famMembers; i++){
        var x = document.createElement("INPUT");
        x.setAttribute("value", `FirstName ${i+1}`);
        x.setAttribute("id",`displayName${i+1}`);
        x.setAttribute("class","w-25 form-control form-control-lg mb-2");
        x.setAttribute("type", "text");
    
        //document.body.appendChild(x);
        document.getElementById("test").appendChild(x);
    }
    var newLine = document.getElementById('test');
    newLine.innerHTML += "<br>";
    var c = document.createElement("button");
    c.setAttribute("class","btn btn-primary btn-lg");
    c.id = "finishButton";
    c.setAttribute("onclick","showMainSection()");
    c.innerHTML = "FINISH";
    document.getElementById("test").appendChild(c);
    var displayName = document.getElementById("displayName1").value;
    console.log (displayName);
    user = firebase.auth().currentUser;

    if (user) {
    console.log(user.uid);
    code = user.uid;
    console.log("You are logged in" + code);
    } else {
    console.log("You are not signed in");
    }
}

function testFunction(){
    var a = document.getElementById("displayName1").value;
    console.log("Yippiiiee!!", a);
}
function showMainSection(){

    mainSection.style.display = "block";
    firstPageSection.style.display = "none";
    loginSection.style.display = "none";
    setupFamilySection.style.display = "none";
}
function showLoginSection(){

    mainSection.style.display = "none";
    firstPageSection.style.display = "none";
    loginSection.style.display = "block";
    setupFamilySection.style.display = "none";
}
function login(){
   var email = document.getElementById('emailSection2').value;
   var password = document.getElementById('passwordSection2').value;
   var displayName = document.getElementById('displayNameSection2').value;
   firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    showLoginSection();
    // ...
  });
  user = firebase.auth().currentUser;
  if (user) {
    console.log(user.uid);
    code = user.uid;
    console.log("You are logged in" + code);
    } else {
    console.log("You are not signed in");
    }
showMainSection();getUsers();renderTable();
}


async function getUsers(){
   

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
         try{
       const response = await fetch(url+`/${code}`,requestOptions);

        if (response.ok) {
            users = await response.json();
            console.log("Här alltså i denna form :", users)
            users.sort(function(a,b){
                return new Date(b.date) - new Date(a.date);
              });
              usersDates = [];
            users.forEach(user =>{
                 usersDates.push(user.date)      
                });
                console.log(usersDates)
            renderTable();
        }
        else{
            throw new Error(response.statusText);
        }
    }   catch (err){
        throw err;
    } 
    renderTable();
} 

const renderTable = async () =>{

    let tableRow = "";
        users.forEach(user => {
        console.log(user);
        tableRow += 
        `<tr id = ${user.id} onclick="highlight(this)"> 
            <td>${user.date}</td>
            <td>${user.name}</td>
            <td>${user.note}</td>
        </tr>`;
    });

    userTable.innerHTML = tableRow;
    hilitedUsers = [];
    selected = false;
    showWarning.style.visibility = 'hidden';
}

//getUsers();
//renderTable(); 

async function postNew(){
    let name = document.getElementById("nam").value;
    let note = document.getElementById("ema").value;
    var d = new Date();
    var e = `${d}`;
    var c = e.substring(0,e.length-38);
    db.collection("users").doc(code).collection("objects").add({
    name: name,
    note: note,
    date: c,
    au: code

})
.then(function() {
    console.log("Document successfully written!");
    getUsers(); 
})
.catch(function(error) {
    console.error("Error writing document: ", error);
}); 

    /*   let name = document.getElementById("nam").value;
    let note = document.getElementById("ema").value;
    if (note == ""){
        showWarning.innerHTML="Your message is empty!"
        showWarning.style.visibility = 'visible';
        return
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var d = new Date();
    var e = `${d}`;
    var c = e.substring(0,e.length-38);
    var raw = JSON.stringify({"date": `${c}`,"name":`${name}`,"note":`${note}`,"code":`${code}`});
    
    var requestOptions= {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' */
    

  /*   try{
        const response = await fetch(url, requestOptions);

        if (response.ok) {
            users = await response.json();
            getUsers(); 
        }
        else{
            throw new Error(response.statusText);
        }
    }   catch (err){
        throw err;
    }   */ 
}
 
async function putUser(){
    if (!selected){
        showWarning.innerHTML = "Please select a row first!"
        showWarning.style.visibility = 'visible';
        return
    };
    let name = document.getElementById("nam").value;
    var d = new Date();
    var e = `${d}`;
    var c = e.substring(0,e.length-38);
    let not = document.getElementById("ema").value;
    if (not == ""){
        showWarning.innerHTML="Your message is empty!"
        showWarning.style.visibility = 'visible';
        return
    }

    let note =not + `&nbsp; &nbsp;(edtited: ${c})`;
    var raw = JSON.stringify({"date": `${selectedNoteDate}`,"name":`${name}`,"note":`${note}`});
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    try{
        const response = await fetch(url+`/${selectedUser}`+`/${code}`, requestOptions);

        if (response.ok) {
            users = await response.json();
            getUsers(); 
        }
        else{
            throw new Error(response.statusText);
        }
    }   catch (err){
        throw err;
    }
}

async function deleteUser(){
    if (!selected){ 
        showWarning.innerHTML = "Please select a row first!"
        showWarning.style.visibility = 'visible';
        return};
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions= {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
    try{
        const response = await fetch(url+`/${selectedUser}`+`/${code}`, requestOptions)

        if (response.ok) {
            users = await response.json();
            getUsers();
        }
        else{
            throw new Error(response.statusText);
        }
    }   catch (err){
        throw err;
    }
}

function highlight(raden){

    let bgCol = window.getComputedStyle ? window.getComputedStyle(message, null).getPropertyValue("background-color") : message.style.backgroundColor;
    
    let thereAlready = hilitedUsers.includes(raden);
    
    if (thereAlready){
        raden.style.backgroundColor = bgCol;
        hilitedUsers = [];
        console.log(hilitedUsers);
        selected = false;
    }
    else{
        
        if (hilitedUsers.length !== 0){                                             
            hilitedUsers.forEach(hilitedUser => {
                hilitedUser.style.backgroundColor = bgCol;
                hilitedUsers = [];
             });
            }
        raden.style.backgroundColor="#BCD4EC";
        selectedUser = raden.id;
        let noteDate = users.filter((user) => {
            return user.id == selectedUser;
        });
        selectedNoteDate = noteDate[0].date;
        console.log(selectedNoteDate);
        console.log(selectedUser);
        
        hilitedUsers.push(raden);
        console.log(hilitedUsers);
        selected = true; 
        showWarning.style.visibility = 'hidden';
    }
}

    
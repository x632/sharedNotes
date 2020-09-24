let dispName = "";
let famMembers;
let firstNames = [];
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


//sections
const firstPageSection = document.getElementById('firstPageSection');
const setupFamilySection = document.getElementById('setupFamilySection');
const mainSection = document.getElementById('mainSection');
const loginSection = document.getElementById('loginSection');

//firstpage
const nextButton = document.getElementById('nextButton');
let email = document.getElementById("emailSection");
let password = document.getElementById("passwordSection");
let firstPageErrMess = document.getElementById("firstPageErrMessage");

showFirstPageSection();

function showFirstPageSection(errorMessage){
    if (errorMessage){
        firstPageErrMess.style.color = "red"; 
        firstPageErrMess.innerHTML = errorMessage;
    }
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
        showFirstPageSection(errorMessage);
        
    });
    mainSection.style.display = "none";
    firstPageSection.style.display = "none";
    loginSection.style.display = "none";
    setupFamilySection.style.display = "block";
    
}


function createInputElements() {
    famMembers = document.getElementById ('numbersOfFamMembers').value;
    var y = document.createElement("SPAN");
    var t = document.createTextNode('Please enter the firstnames of the familymembers with yours on top (used also for login)');
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
        document.getElementById("test").appendChild(x);
    }
    var newLine = document.getElementById('test');
    newLine.innerHTML += "<br>";
    var c = document.createElement("button");
    c.setAttribute("class","btn btn-primary btn-lg");
    c.id = "finishButton";
    c.setAttribute("onclick","showLoginSection(1)");
    c.innerHTML = "FINISH";
    document.getElementById("test").appendChild(c);
    
    
    user = firebase.auth().currentUser;
    //varför har jag egentligen nedanstående här?
    if (user) {
    code = user.uid;
    } else {
    console.log("You are not loggerd in");
    }
}

function showMainSection(){

    mainSection.style.display = "block";
    firstPageSection.style.display = "none";
    loginSection.style.display = "none";
    setupFamilySection.style.display = "none";
    var loggedInMessagge = document.getElementById("whoIsLoggedIn");
    loggedInMessagge.innerHTML = `You are logged in as: ${dispName}`;
}

function signOut(){
    firebase.auth().signOut().then(function() {
        console.log("You are signed out");
        location.reload();
      }).catch(function(error) {
        console.log(error);
      });

}
function showLoginSection(mess){
    if (mess){
        for(i = 0; i < famMembers; i++){
            var displayName = document.getElementById(`displayName${i+1}`).value;
            firstNames.push(displayName);
        }
    var temp = document.getElementById('displayNameSection2')
    temp.value = `${firstNames[0]}`;
    console.log (firstNames);
    mess1 = document.getElementById("successfulMessage")
    mess1.style.color="blue";
    mess1.innerHTML = (`You have successfully created an account, ${firstNames[0]} - now you just need to login`);
    }
    else{
        var temp = document.getElementById('displayNameSection2')
    temp.value = "FIRSTNAME";
    }
    mainSection.style.display = "none";
    firstPageSection.style.display = "none";
    loginSection.style.display = "block";
    setupFamilySection.style.display = "none";

}
async function login(){
    
    var email = document.getElementById('emailSection2').value;
    var password = document.getElementById('passwordSection2').value;
    dispName = document.getElementById('displayNameSection2').value;
    const loginErrMessage  = document.getElementById('errorMessage');
    await firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorMessage = error.message;
    loginErrMessage.innerHTML = errorMessage;
    loginErrMessage.style.color = "red";
    console.log(errorMessage);
    showLoginSection(null);
    
  });
  
  //setTimeout((function(){
  user = firebase.auth().currentUser;
  
  if (user) {
    code = user.uid;
    showMainSection();
    getUsers();
    renderTable();
    } else 
    {
        console.log("You are not signed in");
    }
   //}), 1000)
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
            users.sort(function(a,b){
                return new Date(b.date) - new Date(a.date);
              });
              usersDates = [];
            users.forEach(user =>{
                 usersDates.push(user.date)      
                });
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

async function postNew(){
  
    let not = document.getElementById("ema").value;
    if (not == ""){
        showWarning.innerHTML="Your message is empty!"
        showWarning.style.visibility = 'visible';
        return
    }
    var d = new Date();
    var e = `${d}`;
    var c = e.substring(0,e.length-38);
    //**** 
    var raw = JSON.stringify({"date": `${c}`,"name":`${dispName}`,"note":`${not}`});
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    try{
        const response = await fetch(url+`/${code}`, requestOptions);

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
 
async function putUser(){
    if (!selected){
        showWarning.innerHTML = "Please select a row first!"
        showWarning.style.visibility = 'visible';
        return
    }
    if (selectedNoteName != dispName){
        showWarning.innerHTML = "You can only edit your own notes!"
        showWarning.style.visibility = 'visible';
        return;
    }
    var d = new Date();
    var e = `${d}`;
    var c = e.substring(0,e.length-38);
    let not = document.getElementById("ema").value;
    if (!not){
        showWarning.innerHTML="Your message is empty!"
        showWarning.style.visibility = 'visible';
        return;
    }

    let note = not + `&nbsp; &nbsp;(edtited: ${c})`;
    var raw = JSON.stringify({"date": `${selectedNoteDate}`,"name":`${dispName}`,"note":`${note}`});
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
        return;
    }
    if (selectedNoteName != dispName){
        showWarning.innerHTML = "You can only delete your own notes!"
        showWarning.style.visibility = 'visible';
        return;
    }
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
        selectedNoteName = noteDate[0].name;  
        hilitedUsers.push(raden);
        selected = true; 
        showWarning.style.visibility = 'hidden';
    }
}

    
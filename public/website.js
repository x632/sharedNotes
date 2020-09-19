
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
showEMWarning.style.visibility = 'hidden';
async function getUsers(){

        try{
        const response = await fetch(url);

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
} 

const renderTable = async () =>{
    console.log("varit i renderTable2");
    let tableRow = "";
        users.forEach(user => {
        console.log(user);
        tableRow += 
        `<tr id = ${user.id} onclick="highlight(this)"> 
            <td>${user.date}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
        </tr>`;
    });

    userTable.innerHTML = tableRow;
    hilitedUsers = [];
    selected = false;
    showWarning.style.visibility = 'hidden';
    showEMWarning.style.visibility = 'hidden';
    console.log("Om detta syns så borde meddelandet inte synas!");
    console.log("Selected user från renderTable:" + selected);
}
getUsers();
renderTable(); 

async function postNew(){

    let name = document.getElementById("nam").value;
    let note = document.getElementById("ema").value;
    if (name == ""){
        showEMWarning.style.visibility = 'visible';
        return
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var d = new Date();
    var e = `${d}`;
    var c = e.substring(0,e.length-38);
    var raw = JSON.stringify({"date": `${c}`,"name":`${name}`,"email":`${note}`});
    
    var requestOptions= {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    try{
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
    }   
}

async function putUser(){
    if (!selected){
        showWarning.style.visibility = 'visible';
        return
    };
    let name = document.getElementById("nam").value;
    var d = new Date();
    var e = `${d}`;
    var c = e.substring(0,e.length-38);
    let note = document.getElementById("ema").value + `&nbsp; &nbsp;(edtited: ${c})`;
    var raw = JSON.stringify({"date": `${selectedNoteDate}`,"name":`${name}`,"email":`${note}`});
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    try{
        const response = await fetch(url+`/${selectedUser}`, requestOptions);

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
        const response = await fetch(url+`/${selectedUser}`, requestOptions)

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

    
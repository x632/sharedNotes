
const url = "http://localhost:5001/sharednotes-53fbe/us-central1/users";
let bgCol;
let hilitedUsers = [];
let users = []; 
const userTable = document.querySelector('#userTable')
async function getUsers(){
    try{
        const response = await fetch(url);

        if (response.ok) {
            users = await response.json();
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
    console.log("varit i renderTable");
    let tableRow = "";
        users.forEach(user => {
        console.log(user);
        tableRow += 
        `<tr id = ${user.id} onclick="highlight(this)"> 
            <td>${user.name}</td>
            <td>${user.email}</td>
        </tr>`;
    });

    userTable.innerHTML = tableRow;
}
getUsers();
renderTable(); 

async function postNew(){

    let name = document.getElementById("nam").value;
    let note = document.getElementById("ema").value;
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({"name":`${name}`,"email":`${note}`});
    
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

function putNew(name, email, id){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({"name":`${name}`,"email":`${email}`});
    
    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:5001/sharednotes-53fbe/us-central1/users/${id}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

}

async function deleteUser(){
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions= {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };
    try{
        const response = await fetch(url+`/${hilitedUsers[0].id}`, requestOptions)

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
    }
    else{
        
        if (hilitedUsers !== 0){
            hilitedUsers.forEach(hilitedUser => {
                hilitedUser.style.backgroundColor = bgCol;
                hilitedUsers = [];
             });
            }
        raden.style.backgroundColor="#BCD4EC";
        selectedUser = raden.id;
        hilitedUsers.push(raden);
        console.log(hilitedUsers);
    }
}

    
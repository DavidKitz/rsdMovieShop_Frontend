import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
let username = "";

//CHECK IF USER IS LOGGED IN AND ENABLE ROUTE IF SO
if((username = sessionStorage.getItem("username")) !== null) {
    let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
} else {
    window.location.href = "../view/index.html";
}

//ADD EVENTLISTENER TO LOGOUT
logout.addEventListener("click", function(e) {
    myUserData.logoutUser(e);}
);

async function getUserData() {
    try {
        const response = await fetch("http://localhost:8080/api/user/username/" + username, {
            method: "GET",
            headers: myUserData.buildHeader(),
            credentials: "include",
            mode: 'cors',
        })
        const content = await response.json();
        return content;
    } catch (err) {
        alert("Something went wrong! Try again!");
        throw err;
    }
}

async function mappingUserData() {
    const response = await getUserData();
    let firstName = response["firstName"];
    let lastName = response["lastName"];
    let email = response["email"];
    let username = sessionStorage.getItem("username");
    let shippingAddress = response["shippingAddress"];
    let profilePic = response["picture"];
    document.getElementById("firstName").value = firstName
    document.getElementById("lastName").value = lastName
    document.getElementById("email").value = email
    document.getElementById("username").value = username
    document.getElementById("shippingAddress").value = shippingAddress
    document.getElementById("profilePic").value = profilePic
}

async function updateUserData() {
    const username = sessionStorage.getItem("username");
    let requestBody = {};
    requestBody.username = username;
    requestBody.firstName = document.getElementById("firstName").value
    requestBody.lastName = document.getElementById("lastName").value
    requestBody.email = document.getElementById("email").value
    requestBody.shippingAddress = document.getElementById("shippingAddress").value
    requestBody.picture = "NTHN";
    console.log("req body",requestBody.picture)
    const headers = await myUserData.buildHeader();
    const response = await  myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/user/" + username,headers, requestBody);

    if(response.status == 200) {
        window.alert("User Data updated!")
    } else {
        alert("Something went wrong!")
    }
}

function updatePic(){
    var selectedFile = document.getElementById("updateProfilePic").files[0];
    var img = document.getElementById("profilePic");
    var binaryBlob = "";
    var reader = new FileReader();
    reader.onload = function(){
        img.src = this.result
        var data = (reader.result).split(',')[1];
        binaryBlob = atob(data);
        return binaryBlob;
    }

    reader.readAsDataURL(selectedFile);
    console.log('Encoded Binary File String:', binaryBlob);
    return binaryBlob;
}

document.getElementById("updateProfilePic").addEventListener('change', (event) => {
    event.preventDefault();
    updatePic();
})

document.getElementById("updateData").addEventListener('click', (event) => {
    event.preventDefault();
    updateUserData()
});


window.onload = mappingUserData();

//TODO: GET ALL USER DATA FROM BACKEND AND FILL CURRENT FORM WITH DATA

//TODO: GIVE THE OPTION TO UPDATE USER DATA WITH THE SAVE BUTTON - CALL BACKEND ROUTE TO UPDATE USER (EXCEPT ROLE)
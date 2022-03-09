import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
const checkUserLogin = await myUserData.checkForUserCookie();
let username = "";
//ENABLE ROUTES FOR USER
if (!checkUserLogin) {
    window.location.href = "../view/index.html";
}
//CHECK IF USER IS ADMIN AS WELL AND ENABLE ROUTES FOR ADMIN IF SO
if ((username = sessionStorage.getItem("username")) !== null) {
    let permission = myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);

    permission.then(response => {
        if (response["role"].includes("ROLE_ADMIN")) {
            adminHref.style.visibility = "visible";
            adminHref2.style.visibility = "visible";
        } else {
            adminHref.style.visibility = "hidden";
            adminHref2.style.visibility = "hidden";
        }
    })
}

//ADD EVENTLISTENER TO LOGOUT
logout.addEventListener("click", function (e) {
        myUserData.logoutUser(e);
    }
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
    document.getElementById("firstName").value = firstName
    document.getElementById("lastName").value = lastName
    document.getElementById("email").value = email
    document.getElementById("username").value = username
}

async function updateUserData() {
    const username = sessionStorage.getItem("username");
    let requestBody = {};
    requestBody.username = username;
    requestBody.firstName = document.getElementById("firstName").value
    requestBody.lastName = document.getElementById("lastName").value
    requestBody.email = document.getElementById("email").value
    console.log("req body",requestBody)
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
    var img = document.getElementById("profilePic")

    var reader = new FileReader();
    reader.onload = function(){
        img.src = this.result
    }
    reader.readAsDataURL(selectedFile);
    console.log("test")
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
import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const formItem = document.getElementById("createUser");
let username;

if((username = sessionStorage.getItem("username")) !== null) {
    let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
} else {
    myUserData.buildDefaultNav();
}
formItem.addEventListener("submit", function(e) {
    submitUser(e,this);
});

async function submitUser(e,form) {
    
    e.preventDefault();
    const requestBody = await myUserData.buildJsonFormData(form);
    const headers = await myUserData.buildHeader();
    const response = await myFetchService.performHttpPostRequest("http://localhost:8080/api/register",headers, requestBody);

    if(response.status == 200) {
        alert("User account created!")
        window.location.href = "../view/login.html";
    } else {
        alert("Something went wrong!")
    }
}

import loadUserData from "./service/loadUserData.js";

const myUserData = new loadUserData();
let username;


async function checkPermission() {
    if((username = sessionStorage.getItem("username")) !== null) {
        let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
        if(permission.status == 404) {
            myUserData.buildDefaultNav();
            sessionStorage.clear();
            return;
        }
        if(permission.status == 401) {
            sessionStorage.clear();
            window.location.href = "../view/index.html";
        }
        let buildData = await myUserData.buildNavBasedOnPermission(permission);
    } else {
        myUserData.buildDefaultNav();
    }
}

checkPermission();


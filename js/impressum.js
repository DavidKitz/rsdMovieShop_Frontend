import loadUserData from "./service/loadUserData.js";

const myUserData = new loadUserData();
let username;


if((username = sessionStorage.getItem("username")) !== null) {
    let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
} else {
    myUserData.buildDefaultNav();
}


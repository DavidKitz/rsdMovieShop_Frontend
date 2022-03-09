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
if(!checkUserLogin) {
    window.location.href = "../view/index.html";
}
//CHECK IF USER IS ADMIN AS WELL AND ENABLE ROUTES FOR ADMIN IF SO
if((username = sessionStorage.getItem("username")) !== null) {
    let permission = myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
}

//ADD EVENTLISTENER TO LOGOUT
logout.addEventListener("click", function(e) {
    myUserData.logoutUser(e);}
);


//TODO: GET ALL USER DATA FROM BACKEND AND FILL CURRENT FORM WITH DATA

//TODO: GIVE THE OPTION TO UPDATE USER DATA WITH THE SAVE BUTTON - CALL BACKEND ROUTE TO UPDATE USER (EXCEPT ROLE)
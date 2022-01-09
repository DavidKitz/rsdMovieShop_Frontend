import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const adminHref = document.getElementById("adminLink");
const username = document.cookie.split("=")[1];
//ENABLE ROUTES FOR USER
myUserData.checkForUserCookie();

//CHECK IF USER IS ADMIN AS WELL AND ENABLE ROUTES FOR ADMIN IF SO
const permission = myUserData.checkForPermission("http://localhost:8080/api/user/username/"+ username);

permission.then(response => {
    if(response["role"].includes("ROLE_ADMIN")) {
        adminHref.style.visibility = "visible";
    } else {
        adminHref.style.visibility = "hidden";
    }
})



//TODO: GET ALL USER DATA FROM BACKEND AND FILL CURRENT FORM WITH DATA

//TODO: GIVE THE OPTION TO UPDATE USER DATA WITH THE SAVE BUTTON - CALL BACKEND ROUTE TO UPDATE USER (EXCEPT ROLE)
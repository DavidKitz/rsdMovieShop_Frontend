import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
let username = "";
//ENABLE ROUTES FOR USER
myUserData.checkForUserCookie();

//CHECK IF USER IS ADMIN AS WELL AND ENABLE ROUTES FOR ADMIN IF SO
const permission = myUserData.checkForPermission("http://localhost:8080/api/user/username/"+ username);

if((username = sessionStorage.getItem("username")) !== null) {
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
logout.addEventListener("click", function(e) {
    logoutUser(e);}
);
async function logoutUser(e) {
    e.preventDefault();
    const headers = buildHeaders();
    const response = await myFetchService.performLogout("http://localhost:8080/logout",headers);
    if(response.status == 200) {
        alert("Successful logout!");
        sessionStorage.clear();
        window.location.href = "../view/index.html";
    }

}
function buildHeaders(authorization = null) {
    const headers = {
        "Content-Type": "application/json",
    };
    return headers;
}


//TODO: GET ALL USER DATA FROM BACKEND AND FILL CURRENT FORM WITH DATA

//TODO: GIVE THE OPTION TO UPDATE USER DATA WITH THE SAVE BUTTON - CALL BACKEND ROUTE TO UPDATE USER (EXCEPT ROLE)
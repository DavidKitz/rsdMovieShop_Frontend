import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const movieDiv = document.getElementById("collectAllMovies");
const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
const myUserData = new loadUserData();
let username = "";
//CHECK IF USER IS LOGGED IN AND ENABLE ROUTE IF SO
myUserData.checkForUserCookie();

//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
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

async function movieDbCall() {
    const headers = {
        "Content-Type": "application/json"
    }
    let response = await myFetchService.findAllMovies( "http://localhost:8080/api/movies/all",headers);

    response.forEach(element => {
        const img = document.createElement("img");
        const div = document.createElement("div");
        div.classList.add("custom-div");
        img.src = element["movieUrl"]
        div.append(img);
        movieDiv.append(div);
    })

}
movieDbCall();

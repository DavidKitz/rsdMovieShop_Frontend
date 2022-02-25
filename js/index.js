import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const divResponse = document.getElementById("searchResult");
const formItem = document.getElementById("sendForm");
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
    myUserData.logoutUser(e);}
);


//GET MOVIES FROM IMDB API
formItem.addEventListener("submit", function(e) {
    findMoviesFromDb(e);
});


async function imdbApiCall() {
    let request = await fetch('https://imdb-api.com/en/API/MostPopularMovies/k_ei4ys9ee');
    let response = await request.json();
    console.log(response);
    for (let i = 0; i < 20; i++) {
        const img = document.createElement("img");
        const div = document.createElement("div");
        div.classList.add("custom-div")
        img.src = response["items"][i]["image"];
 
        div.append(img);
        divResponse.append(div);
    }
  
}
imdbApiCall();
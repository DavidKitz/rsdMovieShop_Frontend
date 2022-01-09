import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const divResponse = document.getElementById("searchResult");
const formItem = document.getElementById("sendForm");
const adminHref = document.getElementById("adminLink");
const myUserData = new loadUserData();
let username = "";
//CHECK IF USER IS LOGGED IN AND ENABLE ROUTE IF SO
myUserData.checkForUserCookie();

//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
if(document.cookie.includes("username")) {
    username = document.cookie.split("=")[1];
}
if(username !== "") {
    let permission = myUserData.checkForPermission("http://localhost:8080/api/user/username/"+ username);

    permission.then(response => {
        if(response["role"].includes("ROLE_ADMIN")) {
            adminHref.style.visibility = "visible";
        } else {
            adminHref.style.visibility = "hidden";
        }
    })
}

//GET MOVIES FROM IMDB API

formItem.addEventListener("submit", function(e) {
    findMoviesFromDb(e);
});


async function findMoviesFromDb(e) {
    
    e.preventDefault();
    const response = await myFetchService.findAllMovies("http://localhost:8080/api/movies/all");
    

}


async function imdbApiCall() {
    let request = await fetch('https://imdb-api.com/en/API/Top250Movies/k_ei4ys9ee');
    let response = await request.json();

    for (let i = 0; i < 20; i++) {
        const img = document.createElement("img");
        const div = document.createElement("div");
        div.classList.add("custom-div")
        img.src = response["items"][i]["image"];
 
        div.append(img);
        divResponse.append(div);
        //console.log(response["items"][i]);
    }
  
}
imdbApiCall();
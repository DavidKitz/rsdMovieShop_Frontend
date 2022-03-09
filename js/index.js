import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const divResponse = document.getElementById("searchResult");
const formItem = document.getElementById("sendForm");
const myUserData = new loadUserData();
let username = "";


//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
if((username = sessionStorage.getItem("username")) !== null) {
    let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
} else {
    myUserData.buildDefaultNav();
}



//GET MOVIES FROM IMDB API


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
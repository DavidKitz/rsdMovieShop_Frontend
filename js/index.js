import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const divResponse = document.getElementById("searchResult");
const formItem = document.getElementById("sendForm");
const myUserData = new loadUserData();

myUserData.checkForUserCookie();

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
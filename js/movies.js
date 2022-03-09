import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const movieDiv = document.getElementById("collectAllMovies");
const logout = document.getElementById("logout");
const myUserData = new loadUserData();
let username = "";

//CHECK IF USER IS LOGGED IN AND ENABLE ROUTE IF SO
if((username = sessionStorage.getItem("username")) !== null) {
    let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
} else {
    myUserData.buildDefaultNav();
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
        div.id = element["movieId"];
        img.src = element["movieUrl"]
        div.append(img);
        div.addEventListener("click", function(e) {
            openMovieDetails(e,this);
        })
        movieDiv.append(div);
    })

}

function openMovieDetails(e,element) {
    e.preventDefault();
    sessionStorage.setItem('movieDetailsId', element.id);
    window.location.href = "../view/movieDetails.html";
}
movieDbCall();

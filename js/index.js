import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const divResponse = document.getElementById("searchResult");
const formItem = document.getElementById("sendForm");
const myUserData = new loadUserData();
let username = "";


//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
async function checkPermission() {
    if((username = sessionStorage.getItem("username")) !== null) {
        let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
        if(permission.status == 404) {
            myUserData.buildDefaultNav();
            sessionStorage.clear();
            return;
        }
        if(permission.status == 401) {
            sessionStorage.clear();
            window.location.href = "../view/index.html";
        }
        let buildData = await myUserData.buildNavBasedOnPermission(permission);
        const getUserCart = await myFetchService.findAllMovies("http://localhost:8080/api/user/username/" + sessionStorage.getItem("username"));
        sessionStorage.setItem("userCartId", getUserCart["cart"]["cartId"]);
    } else {
        myUserData.buildDefaultNav();
    }
}

checkPermission();



//GET MOVIES FROM IMDB API


async function imdbApiCall() {
    let request = await fetch('https://imdb-api.com/en/API/MostPopularMovies/k_ei4ys9ee');
    let response = await request.json();
    console.log(response);
    if(response["items"].length != 0) {
        for (let i = 0; i < 20; i++) {
            const img = document.createElement("img");
            const div = document.createElement("div");
            div.classList.add("custom-div")
            img.src = response["items"][i]["image"];

            div.append(img);
            divResponse.append(div);
        }

    }

}
imdbApiCall();
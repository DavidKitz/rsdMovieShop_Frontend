import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";
const myFetchService = new fetchService();
const movieDiv = document.getElementById("collectAllMovies");


async function imdbApiCall() {

    let request = await myFetchService.findAllMovies( "http://localhost:8080/api/movies/all");


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

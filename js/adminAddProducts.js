import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const genres = document.getElementsByClassName("genres");
myUserData.checkForUserCookie();

const formItem = document.getElementById("addMovie");

formItem.addEventListener("submit", function(e) {
    submitMovie(e,this);
});
function formRequestBody() {
    const body = {
        releaseYear : document.getElementById("releaseYear").value,
        moviseStock : document.getElementById("movieStock").value,
        price : document.getElementById("price").value,
        title : document.getElementById("title").value,
        picture : document.getElementById("picture").value,
        genres : []

    }
    return body;
}

async function submitMovie(e,form) {
    e.preventDefault();
    const headers = loadUserData.buildHeader();
    const requestBody = formRequestBody();
    for(let i = 0; i < genres.length; i++) {
        if(genres[i].value !== "") {
            requestBody["genres"].push(genres[i].value);
        }
    }

    console.log(requestBody);
    const response = await myFetchService.performHttpPostRequestWithBody("http://localhost:8080/api/admin/addMovie", headers, requestBody);

    if(response.status === 200) {
        alert("MOVIE SUCCESSFULLY ADDED TO DB")
    }
}


//TODO: WRITE LOGIC FOR DELETE MOVIE (CALL TO DELETE MOVIES BACKEND ROUTE)


import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
const myFetchService = new fetchService();
const myUserData = new loadUserData();
const genres = document.getElementsByClassName("genres");
let username = "";
const formItem = document.getElementById("addMovie");
const checkUserLogin = await myUserData.checkForUserCookie();

if(!checkUserLogin) {
    window.location.href = "../view/index.html";
}

formItem.addEventListener("submit", function(e) {
    submitMovie(e,this);
});

//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
if((username = sessionStorage.getItem("username")) !== null) {
    let permission = myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
}

function formRequestBody() {
    const body = {
        releaseYear : document.getElementById("releaseYear").value,
        movieStock : document.getElementById("movieStock").value,
        price : document.getElementById("price").value,
        title : document.getElementById("title").value,
        picture : document.getElementById("picture").value,
        genres : []

    }
    return body;
}

async function submitMovie(e,form) {
    e.preventDefault();
    const headers = await myUserData.buildHeader();
    const requestBody = formRequestBody();
    for(let i = 0; i < genres.length; i++) {
        if(genres[i].value !== "") {
            requestBody["genres"].push(genres[i].value);
        }
    }
    const response = await myFetchService.performHttpPostRequestWithBody("http://localhost:8080/api/admin/addMovie", headers, requestBody);

    if(response.status === 200) {
        alert("MOVIE SUCCESSFULLY ADDED TO DB")
    }
}

//ADD EVENTLISTENER TO LOGOUT
logout.addEventListener("click", function(e) {
    myUserData.logoutUser(e);
    }
);






import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
const myFetchService = new fetchService();
const myUserData = new loadUserData();
const genres = document.getElementsByClassName("genres");
let username = "";
myUserData.checkForUserCookie();

const formItem = document.getElementById("addMovie");

formItem.addEventListener("submit", function(e) {
    submitMovie(e,this);
});

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
    const response = await myFetchService.deleteMovieById("http://localhost:8080/api/admin/movies/12",headers);
    //.performHttpPostRequestWithBody("http://localhost:8080/api/admin/addMovie", headers, requestBody);

    if(response.status === 200) {
        alert("MOVIE SUCCESSFULLY ADDED TO DB")
    }
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
function buildHeaders(authorization = null) {
    const headers = {
        "Content-Type": "application/json",
    };
    return headers;
}



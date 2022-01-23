import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
const myFetchService = new fetchService();
const myUserData = new loadUserData();
const movieTable = document.getElementById("movieTable");
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


async function loadMovieData() {
    const headers = {
        "Content-Type": "application/json"
    }
    const response = await myFetchService.findAllMovies("http://localhost:8080/api/movies/all",headers);
    let indexCount = 1;
    response.forEach(element => {
        let row = movieTable.insertRow(indexCount);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
        let cell8 = row.insertCell(7);
        let cellUpdate = row.insertCell(8);
        let cellDelete = row.insertCell(9);
        let btnDelete = document.createElement('button');
        let btnUpdate = document.createElement('button');
        cell1.innerHTML = element["movieId"]
        cell2.innerHTML = element["name"];
        cell3.innerHTML = element["releaseYear"];
        cell4.innerHTML = element["price"];
        cell5.innerHTML = element["amountInStock"];

        btnUpdate.className = "btn btn-primary";
        btnUpdate.innerHTML = "Update";
        cellUpdate.appendChild(btnUpdate);
        btnDelete.className = "btn btn-danger";
        btnDelete.innerHTML = "Delete";
        cellDelete.appendChild(btnDelete);
        cellDelete.addEventListener("click", function(e) {
            deleteMovie(this.parentElement.firstChild.innerHTML);
        })
        indexCount++;
    })

}
async function deleteMovie(movieId) {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:63342/",
        "Access-Control-Allow-Credentials": true

    };
    const response = await myFetchService.deleteMovieById("http://localhost:8080/api/admin/movies/" + movieId
        ,headers);
    if(response.status == 200) {
        alert("Movie with the id " + movieId + " successfully Deleted!");
        location.reload();
    }

}
loadMovieData();
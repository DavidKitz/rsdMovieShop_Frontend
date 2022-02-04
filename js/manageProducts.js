import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
const myFetchService = new fetchService();
const myUserData = new loadUserData();
const movieTable = document.getElementById("movieTable");
const checkUserLogin = await myUserData.checkForUserCookie();
let username = "";
//CHECK IF USER IS LOGGED IN AND ENABLE ROUTE IF SO

if(!checkUserLogin) {
    window.location.href = "../view/index.html";
}
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
            window.location.href = "../view/index.html";
        }
    })
}

//ADD EVENTLISTENER TO LOGOUT
logout.addEventListener("click", function(e) {
    myUserData.logoutUser(e);
    }
);


async function loadMovieData() {
    const headers = myUserData.buildHeader();
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
        btnUpdate.addEventListener("click", function(e) {
            updateMovie(this)
        })
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
    const headers = await myUserData.buildHeader();
    const response = await myFetchService.deleteMovieById("http://localhost:8080/api/admin/movies/" + movieId
        ,headers);
    if(response.status == 200) {
        alert("Movie with the id " + movieId + " successfully Deleted!");
        location.reload();
    }

}
async function updateMovie(movieRow) {
    let requestBody= {};
    requestBody.movieId = movieRow.parentElement.parentElement.getElementsByTagName("td")[0].innerHTML;
    requestBody.name = movieRow.parentElement.parentElement.getElementsByTagName("td")[1].innerHTML;
    requestBody.releaseYear = movieRow.parentElement.parentElement.getElementsByTagName("td")[2].innerHTML;
    requestBody.price = movieRow.parentElement.parentElement.getElementsByTagName("td")[3].innerHTML;
    requestBody.amountInStock = movieRow.parentElement.parentElement.getElementsByTagName("td")[4].innerHTML;
    requestBody.genres = "";
    const headers = await myUserData.buildHeader();
    const response = await myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/admin/movies/" + requestBody["movieId"]
        ,headers,requestBody);
    if(response.status == 200) {
        alert("Movie with the id " + requestBody["movieId"] + " successfully Updated!");
        location.reload();
    }
}
loadMovieData();
import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const movieTable = document.getElementById("movieTable");
let username = "";

//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
async function checkPermission() {
    if ((username = sessionStorage.getItem("username")) !== null) {
        let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
        if (permission.status == 404) {
            sessionStorage.clear();
            window.location.href = "../view/index.html";
        }
        let buildData = await myUserData.buildNavBasedOnPermission(permission);
        const getUserCart = await myFetchService.findAllMovies("http://localhost:8080/api/user/username/" + sessionStorage.getItem("username"));
        sessionStorage.setItem("userCartId", getUserCart["cart"]["cartId"]);
    } else {
        window.location.href = "../view/index.html";
    }
}
checkPermission();


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
        cell6.contentEditable = true;
        let cell7 = row.insertCell(6);
        cell7.contentEditable = true;
        let cell8 = row.insertCell(7);
        cell8.contentEditable = true;

        let btnDelete = document.createElement('button');
        let btnUpdate = document.createElement('button');
        cell1.innerHTML = element["movieId"]
        cell2.innerHTML = element["name"];
        cell2.contentEditable = true;
        cell3.innerHTML = element["releaseYear"];
        cell3.contentEditable = true;
        cell4.innerHTML = element["price"];
        cell4.contentEditable = true;
        cell5.innerHTML = element["amountInStock"];
        cell5.contentEditable = true;

        //Read from Genres from Response-Array
        let genreLength = 5;
        element["genres"].forEach(item => {
            if(genreLength <= 7) {
                if(genreLength == 5) {
                    cell6.innerHTML = item;
                }
                if(genreLength == 6) {
                    cell7.innerHTML = item;
                }
                if(genreLength == 7) {
                    cell8.innerHTML = item;
                }
                genreLength++;
            }
        })
        let cellUpdate = row.insertCell(8);
        let cellDelete = row.insertCell(9);
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
    requestBody.movieId = movieRow.parentElement.parentElement.getElementsByTagName("td")[0].innerText;
    requestBody.name = movieRow.parentElement.parentElement.getElementsByTagName("td")[1].innerText;
    requestBody.releaseYear = movieRow.parentElement.parentElement.getElementsByTagName("td")[2].innerText;
    requestBody.price = movieRow.parentElement.parentElement.getElementsByTagName("td")[3].innerText;
    requestBody.stock = movieRow.parentElement.parentElement.getElementsByTagName("td")[4].innerText;
    let genres = [];
    for(let i = 5; i < 8;i++) {
        genres.push(movieRow.parentElement.parentElement.getElementsByTagName("td")[i].innerText);
    }
    requestBody.genres = genres.toString();

    const headers = await myUserData.buildHeader();
    const response = await myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/admin/movies/" + requestBody["movieId"]
        ,headers,requestBody);
    if(response.status == 200) {
        alert("Movie with the id " + requestBody["movieId"] + " successfully Updated!");
        location.reload();
    }
}
$(function() {
    $('#movieTable').bootstrapTable({
        formatNoMatches: function () {
            return
        }
    })
});
loadMovieData();
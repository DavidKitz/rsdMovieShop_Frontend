import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const movieTable = document.getElementById("userTable");
let username = "";

//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
if((username = sessionStorage.getItem("username")) !== null) {
    let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);

    if(permission["role"].includes("ROLE_USER")) {
        window.location.href = "../view/index.html";
    }
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
} else {
    window.location.href = "../view/index.html";
}

async function manageUserData() {
    const response = await myFetchService.findAllMovies("http://localhost:8080/api/admin/all",myUserData.buildHeader());
    console.log(response)
    let indexCount = 1;
    response.forEach(element => {
        let row = movieTable.insertRow(indexCount);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cellUpdate = row.insertCell(6);
        let cellDelete = row.insertCell(7);
        let btnDelete = document.createElement('button');
        let btnUpdate = document.createElement('button');
        cell1.innerHTML = element["id"]
        cell2.innerHTML = element["firstName"];
        cell3.innerHTML = element["lastName"];
        cell4.innerHTML = element["email"];
        cell6.innerHTML = element["enabled"];

        //CREATE DROPDOWN FOR USER ROLE





        cell5.classList.add("dropdown-toggle");
        myUserData.setMultipleAttributes(cell5,{"id" :"dropdownRole","role":"button","data-toggle":"dropdown",
            "aria-haspopup":"true", "aria-expanded":"false"});
        cell5.innerHTML = element["role"];

        const divDropdown = document.createElement("div");
        myUserData.setMultipleAttributes(divDropdown,{"class" :"dropdown-menu","aria-labelledby" : "navbarDropdown"});
        const userRole = document.createElement("a");
        const adminRole = document.createElement("a");
        userRole.classList.add("dropdown-item");
        adminRole.classList.add("dropdown-item");
        userRole.onclick = function () {
            cell5.innerText = "ROLE_USER";
            divDropdown.append(userRole,adminRole);
            cell5.append(divDropdown);
        }
        userRole.innerHTML = "ROLE_USER";
        adminRole.innerHTML = "ROLE_ADMIN";
        adminRole.onclick = function () {
            cell5.innerText = "ROLE_ADMIN";
            divDropdown.append(userRole,adminRole);
            cell5.append(divDropdown);
        }
        divDropdown.append(userRole,adminRole);
        cell5.append(divDropdown);


        btnUpdate.className = "btn btn-primary";
        btnUpdate.innerHTML = "Update";
        btnUpdate.addEventListener("click", function(e) {
            updateUser(this)
        })
        cellUpdate.appendChild(btnUpdate);
        btnDelete.className = "btn btn-danger";
        btnDelete.innerHTML = "Delete";
        cellDelete.appendChild(btnDelete);
        cellDelete.addEventListener("click", function(e) {
            deleteUser(this.parentElement.firstChild.innerHTML);
        })
        indexCount++;
    })
};
async function deleteUser(movieId) {
    const headers = await myUserData.buildHeader();
    const response = await myFetchService.deleteMovieById("http://localhost:8080/api/admin/movies/" + movieId
        ,headers);
    if(response.status == 200) {
        alert("Movie with the id " + movieId + " successfully Deleted!");
        location.reload();
    }

}
async function updateUser(movieRow) {
    let requestBody= {};
   /* cell1.innerHTML = element["id"]
    cell2.innerHTML = element["firstName"];
    cell3.innerHTML = element["lastName"];
    cell4.innerHTML = element["email"];
    cell5.innerHTML = element["role"];
    cell6.innerHTML = element["enabled"]; */


    requestBody.firstName = movieRow.parentElement.parentElement.getElementsByTagName("td")[1].innerHTML;
    requestBody.familyName = movieRow.parentElement.parentElement.getElementsByTagName("td")[2].innerHTML;
    requestBody.email = movieRow.parentElement.parentElement.getElementsByTagName("td")[3].innerHTML;
    requestBody.username;
    requestBody.password;
    const headers = await myUserData.buildHeader();
    const response = await myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/admin/updateUsers"
        ,headers,requestBody);
    if(response.status == 200) {
        alert("Movie with the id " + requestBody["movieId"] + " successfully Updated!");
        location.reload();
    }
}

manageUserData();
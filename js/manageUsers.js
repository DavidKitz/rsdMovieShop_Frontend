import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const movieTable = document.getElementById("userTable");
const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
let username = "";

//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
async function checkPermission() {
    if ((username = sessionStorage.getItem("username")) !== null) {
        let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
        if (permission.status == 404) {
            sessionStorage.clear();
            window.location.href = "../view/index.html";
        }
        if(permission.status == 401) {
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

async function manageUserData() {
    const response = await myFetchService.findAllMovies("http://localhost:8080/api/admin/all",myUserData.buildHeader());
    console.log(response)
    let indexCount = 1;
    response.forEach(element => {
        let row = movieTable.insertRow(indexCount);
        let cell1 = row.insertCell(0);
        let cellUsername = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let cell4 = row.insertCell(4);
        let cell5 = row.insertCell(5);
        let cell6 = row.insertCell(6);
        let cell7 = row.insertCell(7);
        let cellUpdate = row.insertCell(8);
        let cellDelete = row.insertCell(9);
        let btnDelete = document.createElement('button');
        let btnUpdate = document.createElement('button');
        cell1.innerText = element.id;
        cellUsername.innerHTML = element["username"];
        cellUsername.contentEditable = true;
        cell2.innerHTML = element["firstName"];
        cell2.contentEditable = true;
        cell3.innerHTML = element["lastName"];
        cell3.contentEditable = true;
        cell4.innerHTML = element["email"];
        cell4.contentEditable = true;
        cell7.contentEditable = true;

        //CREATE DROPDOWN FOR USER ROLE
        cell5.classList.add("dropdown-toggle");
        myUserData.setMultipleAttributes(cell5,{"id" :"dropdownRole","role":"button","data-toggle":"dropdown",
            "aria-haspopup":"true", "aria-expanded":"false"});
        cell5.innerHTML = element["role"];

        const divDropdown = document.createElement("div");
        myUserData.setMultipleAttributes(divDropdown,{"class" :"dropdown-menu","aria-labelledby" : "dropdownRole"});
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

        let checkbox = document.createElement("INPUT");
        myUserData.setMultipleAttributes(checkbox,{"class":"form-check-input", "type":"checkbox","value":""})
        checkbox.checked = element["enabled"];
        cell6.append(checkbox);

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
async function deleteUser(userId) {
    const headers = await myUserData.buildHeader();
    const response = await myFetchService.deleteMovieById("http://localhost:8080/api/admin/user/" + userId
        ,headers);
    if(response.status == 200) {
        alert("User with the id " + userId + " successfully Deleted!");
        location.reload();
    }

}
async function updateUser(userRow) {
    let requestBody= {};

    let username = userRow.parentElement.parentElement.getElementsByTagName("td")[1].innerHTML;
    requestBody.firstName = userRow.parentElement.parentElement.getElementsByTagName("td")[2].innerHTML;
    requestBody.lastName = userRow.parentElement.parentElement.getElementsByTagName("td")[3].innerHTML;
    console.log(validateEmail(userRow.parentElement.parentElement.getElementsByTagName("td")[4].innerText))
    if(validateEmail(userRow.parentElement.parentElement.getElementsByTagName("td")[4].innerText.replace(/\s/g, "")) == null) {
        alert("Please Enter a valid Email!");
        return;
    }
    requestBody.email = userRow.parentElement.parentElement.getElementsByTagName("td")[4].innerText;
    requestBody.role = userRow.parentElement.parentElement.getElementsByTagName("td")[5].innerText;
    let stringValue = userRow.parentElement.parentElement.getElementsByTagName("td")[6].childNodes[0].checked;
    requestBody.enabled = JSON.parse(stringValue);
    requestBody.username = username;
    requestBody.password = userRow.parentElement.parentElement.getElementsByTagName("td")[7].innerText;
    const headers = await myUserData.buildHeader();
    const response = await myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/admin/updateUsers"
        ,headers,requestBody);
    if(response.status == 200) {
        alert("User with username: " + username +" successfully Updated!");
        location.reload();
    }
}

$(function() {
    $('#userTable').bootstrapTable({
        formatNoMatches: function () {
            return
        }
    })
});
manageUserData();
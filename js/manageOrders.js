import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const orderTable = document.getElementById("orderTable");
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
async function loadOrderData() {
    const headers = myUserData.buildHeader();
    const response = await myFetchService.findAllMovies("http://localhost:8080/api/admin/orders/all",headers);
    let indexCount = 1;
    response.forEach(element => {

        let row = orderTable.insertRow(indexCount);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cellUpdate = row.insertCell(4);
        let cellDelete = row.insertCell(5);
        let btnDelete = document.createElement('button');
        let btnUpdate = document.createElement('button');
        cell1.innerHTML = element["orderId"]
        cell2.innerHTML = element["userId"];
        cell3.innerHTML = element["orderStatus"];
        cell4.innerHTML = element["totalPrice"] + " $";

        //Add dropdown for Order-Status options
        cell3.classList.add("dropdown-toggle");
        myUserData.setMultipleAttributes(cell3,{"id" :"dropdownRole","role":"button","data-toggle":"dropdown",
            "aria-haspopup":"true", "aria-expanded":"false"});

        const divDropdown = document.createElement("div");
        myUserData.setMultipleAttributes(divDropdown,{"class" :"dropdown-menu","aria-labelledby" : "dropdownRole"});
        const orderStatusInProcess = document.createElement("a");
        const orderStatusShipped = document.createElement("a");
        const orderStatusDelivered = document.createElement("a");
        const adminRoleCancelled = document.createElement("a");
        orderStatusInProcess.innerHTML = "In_process";
        orderStatusShipped.innerHTML = "Shipped";
        orderStatusDelivered.innerHTML = "Delivered";
        adminRoleCancelled.innerHTML = "Cancelled";
        orderStatusInProcess.classList.add("dropdown-item");
        orderStatusShipped.classList.add("dropdown-item");
        orderStatusDelivered.classList.add("dropdown-item");
        adminRoleCancelled.classList.add("dropdown-item");

        orderStatusInProcess.onclick = function () {
            cell3.innerText = "In_process";
            divDropdown.append(orderStatusInProcess,orderStatusShipped,orderStatusDelivered,
                adminRoleCancelled);
            cell3.append(divDropdown);
        }
        orderStatusShipped.onclick = function () {
            cell3.innerText = "Shipped";
            divDropdown.append(orderStatusInProcess,orderStatusShipped,orderStatusDelivered,
                adminRoleCancelled);
            cell3.append(divDropdown);
        }
        orderStatusDelivered.onclick = function () {
            cell3.innerText = "Delivered";
            divDropdown.append(orderStatusInProcess,orderStatusShipped,orderStatusDelivered,
                adminRoleCancelled);
            cell3.append(divDropdown);
        }
        adminRoleCancelled.onclick = function () {
            cell3.innerText = "Cancelled";
            divDropdown.append(orderStatusInProcess,orderStatusShipped,orderStatusDelivered,
                adminRoleCancelled);
            cell3.append(divDropdown);
        }


        divDropdown.append(orderStatusInProcess,orderStatusShipped,orderStatusDelivered,
            adminRoleCancelled);
        cell3.append(divDropdown);


        btnUpdate.className = "btn btn-primary";
        btnUpdate.innerHTML = "Update";
        btnUpdate.addEventListener("click", function(e) {
            updateOrder(this)
        })
        cellUpdate.appendChild(btnUpdate);
        btnDelete.className = "btn btn-danger";
        btnDelete.innerHTML = "Delete";
        cellDelete.appendChild(btnDelete);
        cellDelete.addEventListener("click", function(e) {
            deleteOrder(this.parentElement.firstChild.innerHTML);
        })
        indexCount++;
    })



}
async function deleteOrder(orderId) {
    const headers = await myUserData.buildHeader();
    const response = await myFetchService.deleteMovieById("http://localhost:8080/api/admin/orders/" + orderId
        ,headers);
    if(response.status == 200) {
        alert("Order with the id " + orderId + " successfully Deleted!");
        location.reload();
    }

}
async function updateOrder(userRow) {
    let requestBody= {};

    let orderId = userRow.parentElement.parentElement.getElementsByTagName("td")[0].innerHTML;
    let shippingStatus = userRow.parentElement.parentElement.getElementsByTagName("td")[2].innerText;

    const headers = await myUserData.buildHeader();
    const response = await myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/admin/orders/"
    + orderId + "?orderStatus=" + shippingStatus,headers,requestBody);
    if(response.status == 200) {
        alert("Order with the order Id: " + orderId +" successfully Updated!");
        location.reload();
    }
}
loadOrderData();

$(function() {
    $('#orderTable').bootstrapTable({
        formatNoMatches: function () {
            return
        }
    })
});


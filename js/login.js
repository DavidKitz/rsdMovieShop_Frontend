import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const loginForm = document.getElementById("loginForm");
let username;

if((username = sessionStorage.getItem("username")) !== null) {
    let permission = myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
}
loginForm.addEventListener("submit", function(e) {
    loginUser(e,this);
});

async function loginUser(e,form) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const formDataInJson = await myUserData.buildJsonFormData(form);
    const header = await myUserData.buildHeader();
    const response = await myFetchService.performHttpPostRequestWithBody("http://localhost:8080/login",header,formDataInJson);
    if(response.status == 200) {
        alert('User login success!');
        sessionStorage.setItem('username', username);
        window.location.href = "../view/index.html";
    } else {
        alert("Wrong Credentials!");
    }

}


//--- SAME CALL WITH AJAX (EASIER VERSION) ----

// jQuery(document).ready(function ($) {
//     $('#loginForm').submit(function (event) {
//       event.preventDefault();
//       let jsonFormData = JSON.stringify(buildJsonFormData(loginForm));
//       const username = document.getElementById("username").value;
//       $.ajax({
//         xhrFields: {
//             withCredentials: true
//         },
//         data: jsonFormData,
//         timeout: 1000,
//         type: 'POST',
//         url: 'http://localhost:8080/login',
//         contentType: "application/json",
//           success: function(data) {
//               alert('User login success with ajax!');
//               sessionStorage.setItem('username', username);
//               window.location.href = "../view/index.html";
//               return data;
//           }
//       }).fail(function(jqXHR, textStatus, errorThrown) {
//
//         alert('Booh! Wrong credentials, try again!');
//       });
//     });
//   });

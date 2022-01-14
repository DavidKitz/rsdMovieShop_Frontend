import fetchService from "./service/fetchService.js";

const myFetchService = new fetchService();
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e) {
    loginUser(e,this);
});

async function loginUser(e,form) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const formDataInJson = buildJsonFormData(form);
    const header = buildHeaders();
    const response = await myFetchService.performHttpPostLoginRequest("http://localhost:8080/login",header,formDataInJson);
    if(response.status == 200) {
        alert('User login success!');
        document.cookie = "username = " + username;
        window.location.href = "../view/index.html";
    } else {
        alert("Wrong Credentials!");
    }
   
}


function buildJsonFormData(form) {
    const jsonFormData = { };
    for(const pair of new FormData(form)) {
        jsonFormData[pair[0]] = pair[1];
    }
    return jsonFormData;
}

function buildHeaders(authorization = null) {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:63342/",
        "Access-Control-Allow-Credentials": true
        
    };
    return headers;
}

//--- SAME CALL WITH AJAX (EASIER VERSION) ----

// jQuery(document).ready(function ($) {
//     $('#loginForm').submit(function (event) {
//       event.preventDefault();
//       let jsonFormData = JSON.stringify(buildJsonFormData(loginForm));

//       $.ajax({
//         xhrFields: {
//             withCredentials: true
//         },
//         data: jsonFormData,
//         timeout: 1000,
//         type: 'POST',
//         url: 'http://localhost:8080/login',
//         contentType: "application/json"
//       }).fail(function(jqXHR, textStatus, errorThrown) {

//         alert('Booh! Wrong credentials, try again!');
//       });
//     });
//   });

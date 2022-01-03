import fetchService from "./service/fetchService.js";

const myFetchService = new fetchService();
const loginForm = document.getElementById("loginForm");


let store = loginForm.addEventListener("submit", function(e) {
    loginUser(e,this);
});

async function loginUser(e,form) {
    e.preventDefault();

    const formDataInJson = buildJsonFormData(form);
    const header = buildHeaders();
    const response = await myFetchService.performHttpPostLoginRequest("http://localhost:8080/login",header,formDataInJson);
    
   
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
        "Access-Control-Allow-Origin": "http://127.0.0.1:5500/",
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

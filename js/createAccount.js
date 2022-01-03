import fetchService from "./service/fetchService.js";

const myFetchService = new fetchService();
const formItem = document.getElementById("createUser");

formItem.addEventListener("submit", function(e) {
    submitUser(e,this);
});

async function submitUser(e,form) {
    
    e.preventDefault();
    const requestBody = buildJsonFormData(form);
    const btnSubmit = document.getElementById("btnSubmit");
    const headers = buildHeaders();
    const response = await myFetchService.performHttpPostRequest("http://localhost:8080/api/register",headers, requestBody);
    
    if(response != null) {
        window.location.href = "http://127.0.0.1:5500/view/login.html";
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
        "Authorization": (authorization) ? authorization : "Bearer TOKEN_MISSING"
    };
    return headers;
}
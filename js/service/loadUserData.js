import fetchService from "./fetchService.js";

export default class loadUserData {
    constructor() {

    }
    async checkForUserCookie() {

        let str = sessionStorage.getItem("username");

        if(str !== null) {
            document.getElementById("userAndLogout").style.visibility='visible';
            document.getElementById("loginHref").style.visibility='hidden';
            document.getElementById("registerHref").style.visibility='hidden';
            //ADD USERNAME TO NAVBAR AND UPPERCASE FIRST LETTERs
            document.getElementById(("userLink")).innerHTML = 'Welcome, ' + str[0].charAt(0).toUpperCase() + str.slice(1);
            return true;
        } else {
            document.getElementById("userAndLogout").style.visibility='hidden';
            document.getElementById("loginHref").style.visibility='visible';
            document.getElementById("registerHref").style.visibility='visible';

            return false;
        }
    }
    async checkForPermission(apiUrl) {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                credentials: "include"

            });
            const content = await response.json();

            return content;
        } catch (err) {
            throw err;
        }

    }
    async logoutUser(e) {
        e.preventDefault();
        const headers = this.buildHeader();
        const myFetchService = new fetchService();
        const response = await myFetchService.performLogout("http://localhost:8080/logout",headers);
        if(response.status == 200) {
            alert("Successful logout!");
            sessionStorage.clear();
            window.location.href = "../view/index.html";
        }

    }
    async buildHeader() {
        const headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://localhost:63342/",
            "Access-Control-Allow-Credentials": true

        };
        return headers;
    }
    async buildJsonFormData(form) {
        const jsonFormData = { };
        for(const pair of new FormData(form)) {
            jsonFormData[pair[0]] = pair[1];
        }
        return jsonFormData;
    }
}
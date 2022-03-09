import fetchService from "./fetchService.js";

export default class loadUserData {
    constructor() {

    }
    async checkForUserCookie() {

        let username = sessionStorage.getItem("username");

        if(username !== null) {
            document.getElementById("userAndLogout").style.visibility='visible';
            document.getElementById("loginHref").style.visibility='hidden';
            document.getElementById("registerHref").style.visibility='hidden';
            //ADD USERNAME TO NAVBAR AND UPPERCASE FIRST LETTERs
            document.getElementById(("userLink")).innerHTML = 'Welcome, ' + username[0].charAt(0).toUpperCase() + username.slice(1);
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
    async buildNavBasedOnPermission(permission) {
        permission.then(response => {
            if (response["role"].includes("ROLE_ADMIN")) {
                const navUl = document.getElementById("userAndLogout");
                const liElement = document.createElement("li");
                liElement.classList.add("nav-item","dropdown");
                const aElement = document.createElement("a");
                aElement.classList.add("nav-link","dropdown-toggle");
                this.setMultipleAttributes(aElement,{"id" :"navbarDropdown","role":"button","data-toggle":"dropdown",
                    "aria-haspopup":"true", "aria-expanded":"false"});
                aElement.setAttribute("role","button");
                aElement.innerHTML = "Admin-routes";
                liElement.append(aElement);
                navUl.prepend(liElement);

                const divDropdown = document.createElement("div");
                this.setMultipleAttributes(divDropdown,{"class" :"dropdown-menu","aria-labelledby" : "navbarDropdown"});
                const adminAddMovie = document.createElement("a");
                const adminManageProducts = document.createElement("a");

                this.setMultipleAttributes(adminAddMovie,{ "class" : "dropdown-item",
                    "href" : "adminAddProducts.html"});
                adminAddMovie.innerHTML = "Add Movies";
                this.setMultipleAttributes(adminManageProducts, {"class" : "dropdown-item",
                    "href": "manageProducts.html"});
                adminManageProducts.innerHTML = "Manage Movies";
                divDropdown.append(adminAddMovie);
                divDropdown.append(adminManageProducts);
                liElement.append(divDropdown);
            }
        })

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
    async setMultipleAttributes(el, attrs) {
        for(let key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
}
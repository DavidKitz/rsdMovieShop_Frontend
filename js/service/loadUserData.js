import fetchService from "./fetchService.js";

export default class loadUserData {
    constructor() {

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
    async buildNavBasedOnPermission(response) {

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
        if(response["role"].includes("ROLE_USER") || response["role"].includes("ROLE_ADMIN")) {
            const logoutFunction = new loadUserData();
            const username = sessionStorage.getItem("username");
            const navUl = document.getElementById("userAndLogout");
            const liUserLink = document.createElement("li");
            const liUserLogout = document.createElement("li");
            const aUserLink = document.createElement("a");
            const aUserLogout = document.createElement("a");
            liUserLink.classList.add("nav-item");
            liUserLogout.classList.add("nav-item");
            aUserLink.innerHTML = 'Welcome, ' + username[0].charAt(0).toUpperCase() + username.slice(1);
            aUserLogout.innerHTML = "Logout";
            console.log(response);

            this.setMultipleAttributes(aUserLink,{"id":"userLink",
                "class":"nav-link", "href":"userProfile.html"});
            this.setMultipleAttributes(aUserLogout,{"id":"logout", "class":"nav-link","href":""});
            liUserLink.append(aUserLink);
            liUserLogout.append(aUserLogout);
            navUl.append(liUserLink,liUserLogout);

            aUserLogout.addEventListener("click", function(e) {
                logoutFunction.logoutUser(e);
            });
        }

    }
    async buildDefaultNav() {
        const defaulUl = document.getElementById("defaultUl");
        const registerLi = document.createElement("li");
        const registerATag = document.createElement("a");
        const loginLi = document.createElement("li");
        const loginATag = document.createElement("a");

        registerLi.classList.add("nav-item");
        loginLi.classList.add("nav-item");

        this.setMultipleAttributes(registerATag,{ "id":"registerHref","class":"nav-link",
            "href":"CreateAccount.html"});
        registerATag.innerHTML = "Register";
        this.setMultipleAttributes(loginATag,{"id":"loginHref",
            "class":"nav-link", "href":"login.html"})
        loginATag.innerHTML = "Login";
        registerLi.append(registerATag);
        loginLi.append(loginATag);
        defaulUl.append(registerLi,loginLi);

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
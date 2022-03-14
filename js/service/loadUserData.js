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
                aElement.innerHTML = "Admin-routes";
                liElement.append(aElement);
                navUl.prepend(liElement);

                const divDropdown = document.createElement("div");
                this.setMultipleAttributes(divDropdown,{"class" :"dropdown-menu","aria-labelledby" : "navbarDropdown"});
                const adminAddMovie = document.createElement("a");
                const adminManageProducts = document.createElement("a");
                const adminMangeUsers = document.createElement("a");
                const adminMangeOrders = document.createElement("a");

                this.setMultipleAttributes(adminAddMovie,{ "class" : "dropdown-item",
                    "href" : "adminAddProducts.html"});
                this.setMultipleAttributes(adminManageProducts, {"class" : "dropdown-item",
                    "href": "manageProducts.html"});
                this.setMultipleAttributes(adminMangeUsers,{"class" : "dropdown-item",
                    "href": "manageUsers.html"});
                this.setMultipleAttributes(adminMangeOrders,{"class" : "dropdown-item",
                    "href": "manageOrders.html"});

                adminAddMovie.innerHTML = "Add Movies";
                adminManageProducts.innerHTML = "Manage Movies";
                adminMangeUsers.innerHTML = "Manage Users";
                adminMangeOrders.innerHTML = "Manage Orders";

                divDropdown.append(adminMangeUsers,adminAddMovie,adminManageProducts,adminMangeOrders);
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
            const liUserCart = document.createElement("li");
            const aUserCart = document.createElement("a");

            liUserLink.classList.add("nav-item");
            liUserLogout.classList.add("nav-item");
            liUserCart.classList.add("nav-item");

            aUserLink.innerHTML = 'Welcome, ' +  username[0].charAt(0).toUpperCase() + username.slice(1);
            aUserCart.innerHTML = "<i class='fas fa-shopping-cart'</i>";
            aUserLogout.innerHTML = "Logout";

            this.setMultipleAttributes(aUserCart,{"id":"userCart",
                "class":"nav-link", "href":"ShoppingCart.html"});
            this.setMultipleAttributes(aUserLink,{"id":"userLink",
                "class":"nav-link", "href":"userProfile.html"});
            this.setMultipleAttributes(aUserLogout,{"id":"logout", "class":"nav-link","href":""});
            liUserLink.append(aUserLink);
            liUserLogout.append(aUserLogout);
            liUserCart.append(aUserCart);

            navUl.append(liUserLink,liUserCart,liUserLogout);

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
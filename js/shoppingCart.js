import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
const checkUserLogin = await myUserData.checkForUserCookie();
let username = "";

document.getElementById("continueShopping").addEventListener("click", function () {
    window.location.href = "../view/movieDetails.html";
})
//ENABLE ROUTES FOR USER
if(!checkUserLogin) {
    window.location.href = "../view/index.html";
}
//CHECK IF USER IS ADMIN AS WELL AND ENABLE ROUTES FOR ADMIN IF SO
if((username = sessionStorage.getItem("username")) !== null) {
    let permission = myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);

    permission.then(response => {
        if (response["role"].includes("ROLE_ADMIN")) {
            adminHref.style.visibility = "visible";
            adminHref2.style.visibility = "visible";
        } else {
            adminHref.style.visibility = "hidden";
            adminHref2.style.visibility = "hidden";
        }
    })
}
async function buildShoppingCart() {
    const headers = {
        "Content-Type": "application/json"
    }
    let sum = 0;
    let totalValue = document.getElementById("totalValue");
    const cartItems = await myFetchService.findAllMovies("http://localhost:8080/api/user/" + sessionStorage.getItem("username") + "/cart/"
    + sessionStorage.getItem("userCartId"));
   //TODO: CONSTRUCT DIV FOR EACH ELEMENT IN CARTS
    cartItems["items"].forEach(async function(item) {
        console.log(item)
        const parentDiv = document.getElementById("cartRows");
        const div = document.createElement("div");
        const divImage = document.createElement("div");
        const img = document.createElement("img");
        const divAbout = document.createElement("div");
        const h4 = document.createElement("h4");
        const h6 = document.createElement("h6");
        const divCounter = document.createElement("div");
        const divIncrease = document.createElement("div");
        const divCount = document.createElement("div");
        const divDecrease = document.createElement("div");
        const divPrices = document.createElement("div");
        const divPrice = document.createElement("div");
        const divRemove = document.createElement("div");
        let responseMovieCall = await myFetchService.findAllMovies( "http://localhost:8080/api/movies/all",headers);
        responseMovieCall.forEach(movieItem => {
            if(movieItem["name"] == item["movie"]) {
                responseMovieCall = movieItem;
                return;
            }
        })
        div.classList.add("Cart-Items");
        div.classList.add("toWhite");
        divImage.classList.add('"image-box"');
        img.src = responseMovieCall["movieUrl"];
        img.style.height = "250px";
        img.style.width = "170px";
        divImage.append(img);
        div.append(divImage);

        console.log(responseMovieCall);
        divAbout.classList.add("newClass");
        divAbout.style.height = "250 px";
        h4.classList.add('"title"');
        h6.classList.add('"subtitle"');
        h4.innerHTML = responseMovieCall["name"];
        h6.innerHTML = "(" + responseMovieCall["releaseYear"] + ")";
        divAbout.append(h4);
        divAbout.append(h6);
        div.append(divAbout);


        divIncrease.innerHTML = "+";
        divCount.innerHTML = item["amount"];
        divDecrease.innerHTML = "-"
        divCounter.append(divIncrease);
        divCounter.append(divCount);
        divCounter.append(divDecrease);
        div.append(divCounter);


        divPrice.innerHTML = "$" + responseMovieCall["price"];
        //Add price to total Sum
        sum += item["amount"] * responseMovieCall["price"];
        divRemove.innerHTML = "<u>Remove</u>";
        divPrices.append(divPrice);
        divPrices.append(divRemove);
        div.append(divPrices);

        parentDiv.append(div);

        totalValue.innerHTML = "$ " + sum;
        }
    )


}
//ADD EVENTLISTENER TO LOGOUT
logout.addEventListener("click", function(e) {
    myUserData.logoutUser(e);}
);
buildShoppingCart();

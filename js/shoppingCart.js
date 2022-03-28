import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
let username = "";

//CHECK IF USER IS LOGGED IN AND ENABLE ROUTE IF SO
async function checkPermission() {
    if ((username = sessionStorage.getItem("username")) !== null) {

        let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);

        if (permission.status == 404) {
            sessionStorage.clear();
            window.location.href = "../view/index.html";
        }
        console.log(permission)
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

document.getElementById("purchaseButton").addEventListener("click",function(e) {
    addOrderItem(e);
})

document.getElementById("continueShopping").addEventListener("click", function () {
    window.location.href = "../view/movies.html";
})

async function buildShoppingCart() {
    const headers = {
        "Content-Type": "application/json"
    }
    let sum = 0;
    let totalValue = document.getElementById("totalValue");
    const cartItems = await myFetchService.findAllMovies("http://localhost:8080/api/user/" + sessionStorage.getItem("username") + "/cart/"
    + sessionStorage.getItem("userCartId"));
    cartItems["items"].forEach(async function(item) {
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
        });
        div.classList.add("Cart-Items");
        div.classList.add("toWhite");
        divImage.classList.add('"image-box"');
        img.src = responseMovieCall["movieUrl"];
        img.style.height = "250px";
        img.style.width = "170px";
        divImage.append(img);
        div.append(divImage);

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
        divIncrease.classList.add("addHoverMouse");
        divIncrease.addEventListener("click", async function() {
            incrementNbr(item["cartItemID"],responseMovieCall);
        })
        divCount.innerHTML = item["amount"];
        divCount.setAttribute("class",item["cartItemID"]);
        divCount.setAttribute("id",responseMovieCall["movieId"]);
        divDecrease.innerHTML = "-";
        divDecrease.classList.add("addHoverMouse");
        divDecrease.addEventListener("click", async function () {
            decrementNbr(this,item["cartItemID"],responseMovieCall["price"]);
        })
        divCounter.append(divIncrease);
        divCounter.append(divCount);
        divCounter.append(divDecrease);
        div.append(divCounter);


        divPrice.innerHTML = "$" + responseMovieCall["price"];
        //Add price to total Sum
        sum += item["amount"] * responseMovieCall["price"];
        sum.toFixed(2);
        divRemove.innerHTML = "<u>Remove</u>";
        divRemove.addEventListener("click",async function() {
            removeCartItem(this,item["cartItemID"]);
        });
        divRemove.classList.add("addHoverMouse");

        divPrices.append(divPrice);
        divPrices.append(divRemove);
        div.append(divPrices);

        parentDiv.append(div);
        let fixedSum = sum.toFixed(2);
        totalValue.innerHTML = "$ " + fixedSum;
        }
    )


}
async function addOrderItem(e) {
    e.preventDefault();
    const addOrder = await myFetchService.performHttpPostRequestWithBody("http://localhost:8080/api/user/"
    + sessionStorage.getItem("username") + "/orders/"
        + sessionStorage.getItem("userCartId"),myUserData.buildHeader(),{});
    if(addOrder.status == 200) {
        alert("Order sucessfully completed!");
        location.reload();
    }

}
async function removeCartItem(removeDiv,cartItemId) {


    const removeResponse = await myFetchService.deleteMovieById("http://localhost:8080/api/user/" + sessionStorage.getItem("username") +
    "/cart/" + sessionStorage.getItem("userCartId") + "/?cartItemId=" + cartItemId);
    if(removeResponse.status == 200) {
        alert("Movie sucessfully deleted!");
        location.reload();
    } else {
        alert("Something went wrong!");
    }
}
async function incrementNbr(cartItemId,movie) {
    //Check if current Stock is not lower than count in Cart
    let divCount = document.getElementsByClassName(cartItemId)[0];
    console.log(divCount.innerHTML)
    if(movie["amountInStock"] <= divCount.innerHTML) {
        alert("Not enough movies in Stock!");
        return null;
    }
    ++divCount.innerHTML;
    document.getElementById("totalValue").innerHTML = document.getElementById("totalValue")
        .innerHTML.replace("$", "");
    document.getElementById("totalValue").innerHTML = "$" + (Number(document.getElementById("totalValue").innerHTML)
        + Number(movie["price"])).toFixed(2);
    let body = {"movieID" : divCount.getAttribute("id"),
        "quantity" : divCount.innerText}

    const headers = await myUserData.buildHeader();

    const movieDetails = await myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/user/"
        +sessionStorage.getItem("username")+"/cart/"+sessionStorage.getItem("userCartId"),headers,body);
}
async function decrementNbr(divElement,cartId,moviePrice) {
    let countDiv = document.getElementsByClassName(cartId)[0];

    if(countDiv.innerHTML > 1) {
        countDiv.innerHTML = --countDiv.innerHTML;
        document.getElementById("totalValue").innerHTML = document.getElementById("totalValue")
            .innerHTML.replace("$", "");
        document.getElementById("totalValue").innerHTML = "$" + (Number(document.getElementById("totalValue").innerHTML)
            - Number(moviePrice)).toFixed(2);
    }

    let body = {"movieID" : countDiv.getAttribute("id"),
        "quantity" : countDiv.innerText}

    const headers = await myUserData.buildHeader();

    const movieDetails = await myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/user/"
        +sessionStorage.getItem("username")+"/cart/"+sessionStorage.getItem("userCartId"),headers,body);
}

buildShoppingCart();

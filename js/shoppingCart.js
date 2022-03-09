import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();
let username = "";

document.getElementById("continueShopping").addEventListener("click", function () {
    window.location.href = "../view/movies.html";
})

//CHECK IF USER IS LOGGED IN AND ENABLE ROUTE IF SO
if((username = sessionStorage.getItem("username")) !== null) {
    let permission = await myUserData.checkForPermission("http://localhost:8080/api/user/username/" + username);
    let buildData = await myUserData.buildNavBasedOnPermission(permission);
    const getUserCart = await myFetchService.findAllMovies("http://localhost:8080/api/user/username/"+sessionStorage.getItem("username"));
    sessionStorage.setItem("userCartId", getUserCart["cart"]["cartId"]);
} else {
    window.location.href = "../view/index.html";
}
async function buildShoppingCart() {
    const headers = {
        "Content-Type": "application/json"
    }
    let sum = 0;
    let totalValue = document.getElementById("totalValue");
    const cartItems = await myFetchService.findAllMovies("http://localhost:8080/api/user/" + sessionStorage.getItem("username") + "/cart/"
    + sessionStorage.getItem("userCartId"));
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
        });
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
        divIncrease.classList.add("addHoverMouse");
        divIncrease.addEventListener("click", function() {
            incrementNbr(item["cartItemID"],responseMovieCall);
        })
        divCount.innerHTML = item["amount"];
        divCount.setAttribute("class",item["cartItemID"]);
        divDecrease.innerHTML = "-";
        divDecrease.classList.add("addHoverMouse");
        divDecrease.addEventListener("click", function () {
            decrementNbr(this,item["cartItemID"],responseMovieCall["price"]);
        })
        divCounter.append(divIncrease);
        divCounter.append(divCount);
        divCounter.append(divDecrease);
        div.append(divCounter);


        divPrice.innerHTML = "$" + responseMovieCall["price"];
        //Add price to total Sum
        sum += item["amount"] * responseMovieCall["price"];
        divRemove.innerHTML = "<u>Remove</u>";
        divRemove.addEventListener("click",async function() {
            removeCartItem(this,item["cartItemID"]);
        });
        divRemove.classList.add("addHoverMouse");

        divPrices.append(divPrice);
        divPrices.append(divRemove);
        div.append(divPrices);

        parentDiv.append(div);

        totalValue.innerHTML = "$ " + sum;
        }
    )


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
function incrementNbr(cartItemId,movie) {
    //Check if current Stock is not lower than count in Cart
    if(movie["amountInStock"] <= document.getElementsByClassName(cartItemId)[0].innerHTML) {
        alert("Not enough movies in Stock!");
        return null;
    }
    ++document.getElementsByClassName(cartItemId)[0].innerHTML;
    document.getElementById("totalValue").innerHTML = document.getElementById("totalValue")
        .innerHTML.replace("$", "");
    document.getElementById("totalValue").innerHTML = "$" + (Number(document.getElementById("totalValue").innerHTML)
        + Number(movie["price"]));
}
function decrementNbr(divElement,cartId,moviePrice) {
    let countDiv = document.getElementsByClassName(cartId)[0];

    if(countDiv.innerHTML > 1) {
        countDiv.innerHTML = --countDiv.innerHTML;
        document.getElementById("totalValue").innerHTML = document.getElementById("totalValue")
            .innerHTML.replace("$", "");
        document.getElementById("totalValue").innerHTML = "$" + (Number(document.getElementById("totalValue").innerHTML)
            - Number(moviePrice));
    }
}

buildShoppingCart();

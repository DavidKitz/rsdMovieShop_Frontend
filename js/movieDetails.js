import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const movieDiv = document.getElementById("collectMovieDetail")
const cartButton = document.getElementById("addToCart");
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
if(sessionStorage.getItem("username")) {
    checkPermission();
} else {
    myUserData.buildDefaultNav();
}


cartButton.addEventListener("click", function(e) {
    addItemToCart(e,this);
});

async function addItemToCart(e) {
    e.preventDefault();
    if(sessionStorage.getItem("username") == null) {
        alert("You have to log in, or create an account to add items to the cart!")
        return null;
    }
    const headers = await myUserData.buildHeader();
    let body = {}

    const movieDetails = await myFetchService.performHttpPutRequestWithBody("http://localhost:8080/api/user/"
        +sessionStorage.getItem("username")+"/cart/"+sessionStorage.getItem("userCartId")+"/movieId/"+
        sessionStorage.getItem("movieDetailsId"),headers,body);
    if(movieDetails.status == 200) {
        window.location.href = "../view/ShoppingCart.html";
    }

}

async function getMovieDetails() {
    let movieDetailsKey = sessionStorage.getItem("movieDetailsId");
    if(!movieDetailsKey > 0) {
        alert("No Movie found!");
        window.location.href = "../view/movies.html";
    }
    const movieDetails = await myFetchService.getMovieDetailById(movieDetailsKey,myUserData.buildHeader());
    const img = document.createElement("img");
    const div = document.createElement("div");

    document.getElementById("title").innerHTML = capitalizeTheFirstLetterOfEachWord(movieDetails["name"]) + " "+"<span class='showYear'>" + movieDetails["releaseYear"] + "</span>";
    document.getElementById("description").innerHTML = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
    document.getElementById("price").innerHTML = "Price: " + movieDetails["price"] + "€";
    document.getElementById("stock").innerHTML = "Stock: " + movieDetails["amountInStock"];

    div.classList.add("custom-div");
    div.id = movieDetails["movieId"];
    img.classList.add("spaceTop");
    img.src = movieDetails["movieUrl"]
    div.append(img);

    //div.append(movieText)
    movieDiv.append(div);



}
function capitalizeTheFirstLetterOfEachWord(words) {
    let separateWord = words.toLowerCase().split(' ');
    for (let i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
            separateWord[i].substring(1);
    }
    return separateWord.join(' ');
}
getMovieDetails();




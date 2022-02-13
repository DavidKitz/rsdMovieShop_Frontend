import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const adminHref = document.getElementById("adminLink");
const adminHref2 = document.getElementById("adminLink2");
const logout = document.getElementById("logout");
const movieDiv = document.getElementById("collectMovieDetail")
const myUserData = new loadUserData();
let username = "";

//CHECK IF USER IS LOGGED IN AND ENABLE ROUTE IF SO
myUserData.checkForUserCookie();

//CHECK IF USER IS ALSO OF ROLE ADMIN AND ENABLE ROUTE IF SO
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

//ADD EVENTLISTENER TO LOGOUT
logout.addEventListener("click", function(e) {
    myUserData.logoutUser(e);}
);

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




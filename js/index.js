const divResponse = document.getElementById("searchResult");

async function imdbApiCall() {
    let request = await fetch('https://imdb-api.com/en/API/Top250Movies/k_ei4ys9ee');
    let response = await request.json();
    for (let i = 0; i < 20; i++) {
        //const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = response["items"][i]["image"];
        img.classList.add("col-sm")
        divResponse.append(img);
        console.log(response["items"][i]);
    }


    divResponse(response);
}
imdbApiCall();
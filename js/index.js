const divResponse = document.getElementById("searchResult");

async function imdbApiCall() {
    let request = await fetch('https://imdb-api.com/en/API/Top250Movies/k_ei4ys9ee');
    let response = await request.json();

    for (let i = 0; i < 20; i++) {
        const img = document.createElement("img");
        const div = document.createElement("div");
        div.classList.add("custom-div")
        img.src = response["items"][i]["image"];
        img.classList.add("img-thumbnail");
        div.append(img);
        divResponse.append(div);
        console.log(response["items"][i]);
    }
    
    


    
}
imdbApiCall();
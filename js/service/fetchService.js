export default class fetchService {
    constructor() {

    }
    async performHttpPostRequest(apiUrl,headers, body) {
        
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });
            const content = await response;
            return content;
        } catch(err) {
            throw err;
        }
    }
    async performLogout(apiUrl,headers) {

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                credentials:"include",
                mode: 'cors'
            });
            const content = await response;
            return content;
        } catch(err) {
            throw err;
        }
    }
    async performHttpPostRequestWithBody(apiUrl, headers, body) {
        
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                credentials: "include",
                mode: 'cors',
                body: JSON.stringify(body),
                

            })
            const content = await response;
            return content;
        } catch(err) {
            alert("Wrong Credentials! Try again!");
            throw err;
            
        }
    }
    async findAllMovies(apiUrl,headers) {
        
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: headers,
                credentials: "include",
                mode: 'cors'

            })
            const content = await response.json();
            return content;
        } catch(err) {
            alert("Something went wrong!");
            throw err;
            
        }
    }

    async deleteMovieById(apiUrl,headers) {
        try {
            const response = await fetch(apiUrl, {
                method: "Delete",
                headers: headers,
                credentials: "include",
                mode: 'cors'

            })
            const content = await response;
            return content;
        } catch(err) {
            alert("Something went wrong!");
            throw err;

        }
    }
    async performHttpPutRequestWithBody(apiUrl, headers, body) {

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: headers,
                credentials: "include",
                mode: 'cors',
                body: JSON.stringify(body),


            })
            const content = await response;
            return content;
        } catch(err) {
            alert("Something went wrong! Try again!");
            throw err;

        }
    }
    async getMovieDetailById(movieId,headers) {
        try {
            const response = await fetch("http://localhost:8080/api/movies/"+movieId, {
                method: "GET",
                headers: headers,
                credentials: "include",
                mode: 'cors',

            })
            const content = await response.json();
            return content;
        } catch(err) {
            alert("Something went wrong! Try again!");
            throw err;

        }
    }

}
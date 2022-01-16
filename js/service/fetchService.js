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
            const content = await response.json();
            alert('User account created!');
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
                credentials: "include",
                mode: 'cors'

            })

            return content;
        } catch(err) {
            alert("Something went wrong!");
            throw err;
            
        }
    }
}
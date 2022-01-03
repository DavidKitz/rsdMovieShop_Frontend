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
    async performHttpPostLoginRequest(apiUrl,headers, body) {
        
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                credentials: "include",
                mode: 'cors',
                body: JSON.stringify(body),
                

            })
            const content = await response.headers.forEach((x,y) => {
                console.log("KEY " + y + " Value: " + x)
            });
            alert('User login success!');
            // window.location.href = "http://127.0.0.1:5500/view/index.html";
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
            // const content = await response.headers.forEach((x,y) => {
            //     console.log("KEY " + y + " Value: " + x)
            // });
            
            // window.location.href = "http://127.0.0.1:5500/view/index.html";
            return content;
        } catch(err) {
            alert("Wrong Credentials! Try again!");
            throw err;
            
        }
    }
}
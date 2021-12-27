export default class fetchService {
    constructor() {

    }
    async performHttpRequest(apiUrl,headers, body) {
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });
            const content = await response.json();
            console.log(content)
            return content;
        } catch(err) {
            throw err;
        }
    }
}
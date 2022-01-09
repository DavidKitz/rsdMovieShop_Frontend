export default class loadUserData {
    constructor() {

    }
    async checkForUserCookie() {

        let str = document.cookie.split("=");
        console.log(str);
        if(document.cookie.includes("username")) {
            console.log("hello")
            document.getElementById("loginHref").style.visibility='hidden';
        }
        else {
            document.getElementById("loginHref").style.visibility='visible'
        }
    }
    async checkForPermission(apiUrl,headers, body) {
        if(body != null) {
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(body)
                });
                const content = await response;

                return content.status;
            } catch(err) {
                throw err;
            }
        }
        try {
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: headers,
                });
                const content = await response;

                return content.status;
            } catch(err) {
                throw err;
            }

    }
}
export default class loadUserData {
    constructor() {

    }
    async checkForUserCookie() {

        let str = document.cookie.split("=");

        if(str.includes("username")) {
            document.getElementById("userAndLogout").style.visibility='visible';
            document.getElementById("loginHref").style.visibility='hidden';
            //ADD USERNAME TO NAVBAR AND UPPERCASE FIRST LETTER
            document.getElementById(("userLink")).innerHTML = 'Welcome, ' + str[1].charAt(0).toUpperCase() + str[1].slice(1);

        }
        else {
            document.getElementById("userAndLogout").style.visibility='hidden';
            document.getElementById("loginHref").style.visibility='visible';

        }
    }
    async checkForPermission(apiUrl) {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",

            });
            const content = await response.json();

            return content;
        } catch (err) {
            throw err;
        }

    }
}
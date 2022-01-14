export default class loadUserData {
    constructor() {

    }
    async checkForUserCookie() {

        let str = sessionStorage.getItem("username");

        if(str !== null) {
            document.getElementById("userAndLogout").style.visibility='visible';
            document.getElementById("loginHref").style.visibility='hidden';
            //ADD USERNAME TO NAVBAR AND UPPERCASE FIRST LETTERs
            document.getElementById(("userLink")).innerHTML = 'Welcome, ' + str[0].charAt(0).toUpperCase() + str.slice(1);

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
                credentials: "include"

            });
            const content = await response.json();

            return content;
        } catch (err) {
            throw err;
        }

    }
}
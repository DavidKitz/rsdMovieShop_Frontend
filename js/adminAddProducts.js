import fetchService from "./service/fetchService.js";
import loadUserData from "./service/loadUserData.js";

const myFetchService = new fetchService();
const myUserData = new loadUserData();

myUserData.checkForUserCookie();


//TODO: WRITE LOGIC FOR ADD MOVIE BUTTON (CALL TO ADD MOVIES BACKEND ROUTE)

//TODO: WRITE LOGIC FOR DELETE MOVIE (CALL TO DELETE MOVIES BACKEND ROUTE)


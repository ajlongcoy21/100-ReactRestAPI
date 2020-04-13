// Import supporting files
import {createContext} from 'react';
import cookie from 'react-cookies'

// Init user variable
var user;

// If there is a cookie set for the user logged in
if (cookie.load('isLoggedIn')) 
{
        // get the user from the cookies
        var currentUser = cookie.load('user');

        // set user variable from cookie information
        user = {
        
           email: cookie.load('email'),
           password: cookie.load('password'),
           user: currentUser,
           isLoggedIn: cookie.load('isLoggedIn')

        }
}
// else if the cookie is not there set default values
else
{
        user = {
        
                email: "",
                password: "",
                user: null,
                isLoggedIn: false
     
             }
}

export const UserContext = createContext(user); // export context for the app to use

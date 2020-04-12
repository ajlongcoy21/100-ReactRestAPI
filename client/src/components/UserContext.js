import {createContext} from 'react';
import cookie from 'react-cookies'

var user;

if (cookie.load('isLoggedIn')) 
{
        var currentUser = cookie.load('user');

        user = {
        
           email: cookie.load('email'),
           password: cookie.load('password'),
           user: currentUser,
           isLoggedIn: cookie.load('isLoggedIn')

        }
}
else
{
        user = {
        
                email: "",
                password: "",
                user: null,
                isLoggedIn: false
     
             }
}

export const UserContext = createContext(user);

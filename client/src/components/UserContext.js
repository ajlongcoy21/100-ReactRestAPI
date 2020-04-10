import {createContext} from 'react';

 const user = 
{
        email: "",
        password: "",
        user: null,
        isLoggedIn: false
};

export const UserContext = createContext(user);

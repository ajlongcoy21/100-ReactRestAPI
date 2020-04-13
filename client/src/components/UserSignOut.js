// Import supporting files
import React, {useContext} from "react";
import { Redirect } from 'react-router-dom';
import cookie from 'react-cookies'

// Get the user context
import {UserContext} from './UserContext';

const UserSignOut = () => {

    // get user and modifyUser infomration
    const {user, modifyUser} = useContext(UserContext);

    // check if the user is logged in
    if (user.isLoggedIn)
    {         
        // reset the context     
        modifyUser({email: "", password: "", user: null, isLoggedIn: false});

        // remove cookie information
        cookie.remove('email', { path: '/' });
        cookie.remove('password', { path: '/' });
        cookie.remove('user', {path: '/'});
        cookie.remove('isLoggedIn', {path: '/'});  
    } 

        // redirect to main page
        return <Redirect to='/'/>
    
};

export default UserSignOut;
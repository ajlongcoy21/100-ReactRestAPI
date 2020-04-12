// Import react
import React, {useContext, useCallback} from "react";
import { Redirect } from 'react-router-dom';
import cookie from 'react-cookies'

// Get the user context
import {UserContext} from './UserContext';

const UserSignOut = () => {

    const {user, modifyUser} = useContext(UserContext);

    console.log('before: ');
    console.log(user.isLoggedIn);

    if (user.isLoggedIn)
    {              
        modifyUser({email: "", password: "", user: null, isLoggedIn: false});
        cookie.remove('email', { path: '/' });
        cookie.remove('password', { path: '/' });
        cookie.remove('user', {path: '/'});
        cookie.remove('isLoggedIn', {path: '/'});  
    } 
        
        console.log('after: ');
        console.log(user.isLoggedIn);

        return <Redirect to='/'/>
    
};

export default UserSignOut;
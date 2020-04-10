// Import react
import React, {useContext} from "react";
import { Link } from 'react-router-dom';

// Get the user context
import {UserContext} from './UserContext';

const Header = () => {

    const {user} = useContext(UserContext);
   
    if (user.isLoggedIn)
    {        
        return (
            <div className="header">
                <div className="bounds">
                    <h1 className="header--logo">Courses</h1>
                    <nav><span>Welcome Joe Smith!</span><Link className="signout" to="/">Sign Out</Link></nav>
                </div>
            </div> 
        );
    } 
    else 
    {
        return (
            <div className="header">
                <div className="bounds">
                    <h1 className="header--logo">Courses</h1>
                    <nav><a className="signup" href="sign-up.html">Sign Up</a><Link className="signin" to='/api/signIn'>Sign In</Link></nav>
                </div>
        </div>
        );
    }
    
}

export default Header;

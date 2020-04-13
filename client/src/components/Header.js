// Import supporting files
import React, {useContext} from "react";
import { Link } from 'react-router-dom'; // import Link for router

// Get the user context
import {UserContext} from './UserContext';

// Create Header component

const Header = () => {

    // Get the user from the context of the app
    const {user} = useContext(UserContext);
   
    // If the user is logged in
    if (user.isLoggedIn)
    {      
        // Display proper HTML for users that are logged in  
        return (
            <div className="header">
                <div className="bounds">
                    <h1 className="header--logo">Courses</h1>
                    <nav><span>Welcome {user.user.firstName} {user.user.lastName}!</span><Link className="signout" to="/signout">Sign Out</Link></nav>
                </div>
            </div> 
        );
    } 
    else 
    {
        // Display proper HTML for users that are not logged in
        return (
            <div className="header">
                <div className="bounds">
                    <h1 className="header--logo">Courses</h1>
                    <nav><Link className="signup" to="/signup">Sign Up</Link><Link className="signin" to='/signin'>Sign In</Link></nav>
                </div>
        </div>
        );
    }
}

export default Header;

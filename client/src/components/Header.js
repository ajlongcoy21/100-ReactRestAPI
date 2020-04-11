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
                    <nav><span>Welcome {user.user.firstName} {user.user.lastName}!</span><Link className="signout" to="/api/signout">Sign Out</Link></nav>
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
                    <nav><Link className="signup" to="/api/signup">Sign Up</Link><Link className="signin" to='/api/signin'>Sign In</Link></nav>
                </div>
        </div>
        );
    }
    
}

export default Header;

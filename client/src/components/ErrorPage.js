// Import react
import React, {useContext} from "react";
import { Link } from 'react-router-dom';

// Get the user context
//import {UserContext} from './UserContext';

const ErrorPage = () => {

    //const {user} = useContext(UserContext);
   
      
        return (
            <div className="bounds">
                <h1>Error</h1>
                <p>Sorry! We just encountered an unexpected error.</p>
                <p>Go back to main page: <Link to="/">Click Here</Link></p>
            </div>
        );
    
}

export default ErrorPage;

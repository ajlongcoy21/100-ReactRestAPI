// Import react
import React, {useContext} from "react";
//import { Link } from 'react-router-dom';

// Get the user context
//import {UserContext} from './UserContext';

const NotFound = () => {

    //const {user} = useContext(UserContext);
   
      
        return (
            <div className="bounds">
                <h1>Not Found</h1>
                <p>Sorry! We couldn't find the page you're looking for.</p>
            </div>
        );
    
}

export default NotFound;

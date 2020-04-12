// Import react
import React, {useContext} from "react";
//import { Link } from 'react-router-dom';

// Get the user context
//import {UserContext} from './UserContext';

const Forbidden = () => {

    //const {user} = useContext(UserContext);
   
      
        return (
            <div class="bounds">
                <h1>Forbidden</h1>
                <p>Oh oh! You can't access this page.</p>
            </div>
        );
    
}

export default Forbidden;

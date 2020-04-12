// Import react
import React, {useContext} from "react";
import { Link } from 'react-router-dom';

const Forbidden = () => {

    //const {user} = useContext(UserContext);
   
      
        return (
            <div className="bounds">
                <h1>Forbidden</h1>
                <p>Oh oh! You can't access this page.</p>
                <p>Go back to main page: <Link to="/">Click Here</Link></p>
            </div>
        );
    
}

export default Forbidden;

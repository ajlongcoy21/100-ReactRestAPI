// Import supporting files
import React from "react";
import { Link } from 'react-router-dom'; // import Link for router

const Forbidden = () => {

    // Display error page HTML
    // Allow user to go back to homepage
    return (
        <div className="bounds">
            <h1>Forbidden</h1>
            <p>Oh oh! You can't access this page.</p>
            <p>Go back to main page: <Link to="/">Click Here</Link></p>
        </div>
    );
    
}

export default Forbidden;

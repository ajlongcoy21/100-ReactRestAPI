// Import supporting files
import React from "react";
import { Link } from 'react-router-dom'; // import Link for router

const NotFound = () => {

    // Display error page HTML
    // Allow user to go back to homepage
    return (
        <div className="bounds">
            <h1>Not Found</h1>
            <p>Sorry! We couldn't find the page you're looking for.</p>
            <p>Go back to main page: <Link to="/">Click Here</Link></p>
        </div>
    );
    
}

export default NotFound;

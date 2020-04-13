// Import supporting files
import React from "react";
import { Link } from 'react-router-dom'; // import Link for router

const ErrorPage = () => {

    // Display error page HTML
    // Allow user to go back to homepage
    return (
        <div className="bounds">
            <h1>Error</h1>
            <p>Sorry! We just encountered an unexpected error.</p>
            <p>Go back to main page: <Link to="/">Click Here</Link></p>
        </div>
    );
    
}

export default ErrorPage;

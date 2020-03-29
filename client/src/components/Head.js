// Import react
import React from 'react';
import {Helmet} from "react-helmet";

// Create react element Head

const Head = (props) => (

  // Display the list elements and links for the default choices for the user

  <Helmet>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link href="https://fonts.googleapis.com/css?family=Work+Sans:400,500" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Cousine" rel="stylesheet" type="text/css" />
    <title>Courses</title>
</Helmet>

);

// Export element to be used by the main app.js

export default Head;
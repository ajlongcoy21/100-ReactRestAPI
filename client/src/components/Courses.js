
// Import supporting files
import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';  // import Link and Redirect for router
import axios from 'axios';                          // import axios for use of calling API

/*
Courses Component

Displays the courses to the user. This page is the homepage view for the site.

*/

export default class Courses extends Component {

    // init the state of the Courses Component
    state = {
        error: null,
        isLoaded: false,
        courses: []
    }

    // Component Did Mount - fetch the data from the API
    componentDidMount() 
    {
        var self = this;

        // Make a call to the api for the complete list of courses
        axios.get(`http://localhost:5000/api/courses`)
        .then(response => {

            // Set the state on successful return of courses data
            this.setState({
                isLoaded: true,             // data is loaded
                courses: response.data      // set the courses state variable to the response data
            });
        })
        .catch(error => { 

            // Check to see if the server responded with an error and response for the error
            if (error.response) 
                {
                    // If the server responds with a status of 500 set the error state to true for the redirect to error page
                    if (error.response.status === 500) 
                    {
                        self.setState({error: true});
                    }
                } 
                else if (error.request) 
                {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } 
                else 
                {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }

                console.log(error.config); 
        })
    }

    // render the component

    render() { 

        // Get necessary state variables
        const { error, isLoaded, courses } = this.state;

        // If we have the server response status of 500, redirect to error page
        if (error) 
        {
            return <Redirect to='/error'/>;
        } 
        // If we are waiting for the data to load...notify the user
        else if (!isLoaded) 
        {
            return <div>Loading...</div>;
        } 
        else 
        {
            // return HTML to show to user
            return (
              <div className="bounds">
              {/* loop through the courses in the state to display each course to the user */}
                {courses.map(course => (
                    <div className="grid-33" key={course.id}><Link className="course--module course--link" to={`/courses/${course.id}`}>
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{course.title}</h3>
                    </Link></div>
                ))}
                <div className="grid-33" key={999999999999}><Link className="course--module course--add--module" to={`/courses/create`}>
                    <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>New Course</h3>
                </Link></div>
              </div>
            );
        }
    }
}
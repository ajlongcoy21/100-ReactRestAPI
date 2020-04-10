// import react, component, route and navlink
import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';

import axios from 'axios'; // import axios for use of calling API

export default class Courses extends Component {

    // init the state of the SearchForm

    state = {
        error: null,
        isLoaded: false,
        courses: []
    }

    // Component Did Mount - fetch the data from the API

    componentDidMount() 
    {
        // Make a call to the api for the complete list of courses
        axios.get(`http://localhost:5000/api/courses`)
        .then(response => {

            // Set the state on successful return of course data
            this.setState({
                isLoaded: true,              // data is loaded
                courses: response.data      // set the courses state variable to the course array
            });
        })
        .catch(error => { 

            // Error occured during request
            this.setState({
                isLoaded: true,         // data is loaded
                error                   // set the error state variable
                }); 
        })
    }

    // render the component

    render() { 

        const { error, isLoaded, courses } = this.state;

        if (error) 
        {
            return <div>Error: {error.message}</div>;
        } 
        else if (!isLoaded) 
        {
            return <div>Loading...</div>;
        } 
        else 
        {
            return (
              <div className="bounds">
                {courses.map(course => (
                    <div className="grid-33" key={course.id}><Link className="course--module course--link" to={`/api/courses/${course.id}`}>
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{course.title}</h3>
                    </Link></div>
                ))}
                <div className="grid-33"><NavLink activeClassName="course--module course--add--module" to="">
                    <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>New Course</h3>
                </NavLink></div>
              </div>
            );
        }
    }
}
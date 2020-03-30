import React, { Component } from 'react';
import axios from 'axios'; // import axios for use of calling API

export default class CourseDetail extends Component {

    // Constructor to receive props

    constructor(props)
    {
        super(props);

        // init the state of the SearchForm
        this.state = {
            error: null,
            isLoaded: false,
            course: null
        }
    }

    // Component Did Mount - fetch the data from the API

    componentDidMount() 
    {        
        // Make a call to the api for the specific course
        axios.get(`http://localhost:5000/api/courses/${this.props.courseID}`)
        .then(response => {

            // Set the state on successful return of course data
            this.setState({
                isLoaded: true,              // data is loaded
                course: response.data      // set the courses state variable to the course array
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

              <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100"><span><a className="button" href="">Update Course</a><a className="button" href="#">Delete Course</a></span><a className="button button-secondary" href="">Return to List</a></div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{this.state.course.title}</h3>
                            <p>By {this.state.course.User.firstName} {this.state.course.User.lastName}</p>
                        </div>
                        <div className="course--description">
                            <p>{this.state.course.description}</p>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats"> 
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{this.state.course.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <ul> { this.state.course.materialsNeeded.split(/\r?\n/).map( (material, index) => ( <li key={index}>{material}</li> ))} </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
              </div>
              
            );
        }
    }
}

// Import supporting files
import React, { Component } from 'react';
import axios from 'axios';                    // import axios for use of calling API
import { Redirect } from 'react-router-dom';  // import Redirect for router

// Get the user context
import {UserContext} from './UserContext';

/*
CreateCourse Component

Displays the update course to the user. If the user is logged in and authorized to update the course,
they can submit to the API.

*/

export default class UpdateCourse extends Component {

    // Constructor to receive props
    constructor(props)
    {
        super(props);

        // init the state of the UpdateCourse Component
        this.state = {
            error: null,
            isLoaded: false,
            redirect: false,
            forbidden: false,
            notFound: false,
            course: null,
            courseUserFirstName: "",
            courseUserLastName: "",
            courseId: "",
            title: "",
            description: "",
            estimatedTime: "",
            materialsNeeded: "",
            isLoggedIn: false,
            validationMessages: []
        }

        // bind functions to be able to use this
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updateCourse = this.updateCourse.bind(this);
    }

    // Component Did Mount - set the state
    componentDidMount() 
    {
        // Define self to get access to this for component
        var self = this;

        // Initialize error message arrays
        let seperatedErrorMessages = [];
        let consolidatedErrorMessages = [];
        
        // Make a call to the api for the specific course
        axios.get(`http://localhost:5000/api/courses/${this.props.computedMatch.params.id}`)
        .then(response => {

            // Set the state on successful return of course data
            this.setState({
                isLoaded: true,              
                course: response.data,
                courseUserFirstName: response.data.User.firstName,
                courseUserLastName: response.data.User.lastName,
                courseId: response.data.id,
                title: response.data.title,                     
                description: response.data.description,
                estimatedTime: (response.data.estimatedTime) ? response.data.estimatedTime : "",
                materialsNeeded: (response.data.materialsNeeded) ? response.data.materialsNeeded : ""
            });

            // Check to see if the user is logged in
            if (this.context.user.user !== null) 
            {
                // check to verify the user logged in is the owner of the course
                if (this.context.user.user.id === response.data.User.id)
                {
                    // Set the state on successful return of course data
                    this.setState({
                        isLoaded: true,              // data is loaded
                        course: response.data,       // set the courses state variable to the course array
                        forbidden: false             // set forbidden to false as the user is ok to edit
                    });
                }
                else
                {
                    // Set the state on successful return of course data
                    this.setState({
                        isLoaded: true,              // data is loaded
                        course: response.data,       // set the courses state variable to the course array
                        forbidden: true              // set forbidden to true as the user is not ok to edit
                    });
                }
            }
            else
            {
                // Set the state on successful return of course data
                this.setState({
                    isLoaded: true,              // data is loaded
                    course: response.data,       // set the courses state variable to the course array
                    forbidden: true              // set forbidden to true as the user is not ok to edit
                });
            }

            console.log(response.data);
            
        })
        .catch(error => { 

            // Check to see if the server responded with an error and response for the error
            if (error.response) 
                {
                    // The request was made and the server responded with a status code that is not in the range of 2xx

                    // Seperate the error messages by the newline identification
                    seperatedErrorMessages = error.response.data.message.split(/(,\n)/);

                    // If the server was not able to not find the course, set the notFound state to true for redirect to notFound Page
                    if (error.response.data.message === 'Course not found. Please search for another course.')
                    {
                        self.setState({isLoaded: true, notFound: true, validationMessages: consolidatedErrorMessages});
                    }

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

        this.setState({ 
            isLoaded: true,                          // data is loaded boolean
            isLoggedIn: this.context.user.isLoggedIn // set the isLoggedIn boolean
        }); 
        
    }

    /*
    handleSubmit

    this function is used to handle the submit of the form. It takes the event and uses the state values for the course
    and calls the updateCourse function.

    Parameters: event
    Returns: N/A

    */

    handleSubmit(event) 
    {   
        // Call the updateCourse function with the values from the form input
        this.updateCourse(this.state.title, this.state.description, this.state.estimatedTime, this.state.materialsNeeded);

        // Prevent default action
        event.preventDefault();
    }

    /*
    updateCourse

    this function takes the submitted information and makes a request to update the course to the API.
    Checks to make sure the user is logged in and handles any errors returned from the API server.

    Parameters: title, description, estimatedTime, materialsNeeded
    Returns: N/A

    */

    updateCourse (title, description, estimatedTime, materialsNeeded)
    {        
        // Define self to get access to this for component
        var self = this;

        // Initialize error message arrays
        let seperatedErrorMessages = [];
        let consolidatedErrorMessages = [];
        
        // check to make sure the user is logged in
        if (this.context.user.isLoggedIn) 
        {
            // if the user is logged in, make a call to the API with submitted information and authorization credentials for the user
            axios.put(`http://localhost:5000/api/courses/${this.state.courseId}`, { userId: this.context.user.user.id, title: title, description: description, estimatedTime: estimatedTime, materialsNeeded: materialsNeeded },{ auth:{ username: this.context.user.email, password: this.context.user.password }})
            .then(function (response) 
            {
                // Set the redirect state to true to go back to the homepage
                self.setState({redirect: true});                
            })
            .catch(function (error) {

                // Check to see if the server responded with an error and response for the error
                if (error.response) 
                {
                    // The request was made and the server responded with a status code that is not in the range of 2xx

                    // Seperate the error messages by the newline identification
                    seperatedErrorMessages = error.response.data.message.split(/(,\n)/);

                    // After we seperate the messages, need to remove "bad" data such as ",\n" and store in the consolidated array
                    for (var i = 0; i < seperatedErrorMessages.length; i = i + 2) 
                    {
                        consolidatedErrorMessages.push(seperatedErrorMessages[i]);
                    }

                    // Set the validationMessages in the state
                    self.setState({validationMessages: consolidatedErrorMessages});
                               
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
                        
            });
        }
        else
        {   
            // check to see if the user is logged in         
            if (this.state.isLoggedIn) 
            {
                if (this.state.course.user.id !== this.context.user.user.id) 
                {
                    consolidatedErrorMessages.push('You are not allowed to update this course.');
                    self.setState({validationMessages: consolidatedErrorMessages});
                }
            }
            else 
            {
                consolidatedErrorMessages.push('Please login to update the course.');
                self.setState({validationMessages: consolidatedErrorMessages});
            }
            
        }

    }

    /*
    handleInputChange

    this function is used to log the changes in the input fields from the user. It uses the target.name and value
    to set the state.

    Parameters: event
    Returns: N/A

    */

    handleInputChange(event) 
    {
        // Get values from the event target
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        // Set corresponding state values from the taget value
        this.setState({
          [name]: value
        });
    }

    /*
    handleClick

    this function is used to redirect the user to he homepage.

    Parameters: N/A
    Returns: N/A

    */

    handleClick() 
    {   
        // Set redirect to true so the page redirects to homepage
        this.setState({ redirect: true });        
    }

    // render the component

    render() { 

        // Get necessary state variables
        const { error, isLoaded, redirect, forbidden, notFound } = this.state;    

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

            // If the is not found, redirect to notfound page
            if (notFound) 
            {
                return <Redirect to='/notfound'/>;
            } 
            // If the user is not allowed to edit, redirect to forbidden page
            if (forbidden) 
            {
                return <Redirect to='/forbidden'/>;
            } 
            // If the user is not signed in, redirect to signin page
            if (redirect) 
            {
                return <Redirect to='/'/>;
            } 
            // Check to see if there are validation errors to show in the HTML
            else if (this.state.validationMessages.length > 0)
            {
                return (

                    <div className="bounds course--detail">
                        <h1>Update Course </h1>
                          <div>
                            <div>
                                <h2 className="validation--errors--label">Validation errors</h2>
                                <div className="validation-errors">
                                    <ul>
                                        {this.state.validationMessages.map(function(message, index){return <li key={ index }>{message.replace('Validation error: ', '')}</li>;})}
                                    </ul>
                                </div>
                            </div>
                              <form onSubmit={this.handleSubmit}>
                                <div className="grid-66">
                                    <div className="course--header">
                                        <h4 className="course--label">Course</h4>
                                        <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={this.state.title} onChange={this.handleInputChange} /></div>
                                        <p>By {this.state.courseUserFirstName + ' ' + this.state.courseUserLastName}</p>
                                    </div>
                                    <div className="course--description">
                                        <div><textarea id="description" name="description" className="" placeholder="Course description..." value={this.state.description} onChange={this.handleInputChange}></textarea></div>
                                    </div>
                                </div>
                                <div className="grid-25 grid-right">
                                    <div className="course--stats">
                                        <ul className="course--stats--list">
                                            <li className="course--stats--list--item">
                                                <h4>Estimated Time</h4>
                                                <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={this.state.estimatedTime} onChange={this.handleInputChange}/></div>
                                            </li>
                                            <li className="course--stats--list--item">
                                                <h4>Materials Needed</h4>
                                                <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={this.state.materialsNeeded} onChange={this.handleInputChange}></textarea></div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="grid-100 pad-bottom">
                                    <button className="button" type="submit">Update Course</button>
                                    <button className="button button-secondary" onClick={this.handleClick}>Cancel</button>
                                </div>
                              </form>
                            </div>
                    </div>
                  );
            }
            else 
            {
                return (

                    <div className="bounds course--detail">
                        <h1>Update Course </h1>
                          <div>
                              <form onSubmit={this.handleSubmit}>
                                <div className="grid-66">
                                    <div className="course--header">
                                        <h4 className="course--label">Course</h4>
                                        <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={this.state.title} onChange={this.handleInputChange} /></div>
                                        <p>By {this.state.courseUserFirstName + ' ' + this.state.courseUserLastName}</p>
                                    </div>
                                    <div className="course--description">
                                        <div><textarea id="description" name="description" className="" placeholder="Course description..." value={this.state.description} onChange={this.handleInputChange}></textarea></div>
                                    </div>
                                </div>
                                <div className="grid-25 grid-right">
                                    <div className="course--stats">
                                        <ul className="course--stats--list">
                                            <li className="course--stats--list--item">
                                                <h4>Estimated Time</h4>
                                                <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input" placeholder="Hours" value={this.state.estimatedTime} onChange={this.handleInputChange}/></div>
                                            </li>
                                            <li className="course--stats--list--item">
                                                <h4>Materials Needed</h4>
                                                <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={this.state.materialsNeeded} onChange={this.handleInputChange}></textarea></div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="grid-100 pad-bottom">
                                    <button className="button" type="submit">Update Course</button>
                                    <button className="button button-secondary" onClick={this.handleClick}>Cancel</button>
                                </div>
                              </form>
                            </div>
                    </div>
                  );
            }  
        }
    }
}

UpdateCourse.contextType = UserContext; // allow UpdateCourse to access the context for the user signed in
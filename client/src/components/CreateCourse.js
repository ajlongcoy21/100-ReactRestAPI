
// Import supporting files
import React, { Component } from 'react';
import axios from 'axios';                     // import axios for use of calling API
import { Redirect } from 'react-router-dom';   // import Redirect for router

// Get the user context
import {UserContext} from './UserContext';

/*
CreateCourse Component

Displays the create course page to the user. If the user is logged in and authorized to update and delete the course,
those corresponding buttons will be displayed.

*/

export default class CreateCourse extends Component {

    // Constructor to receive props
    constructor(props)
    {
        super(props);

        // init the state of the CreateCourse Component
        this.state = {
            error: null,
            isLoaded: false,
            redirectSignIn: false,
            redirect: false,
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
        this.createCourse = this.createCourse.bind(this);
    }

    // Component Did Mount - check the state of the user
    componentDidMount() 
    {
        // Check to see if the user logged in
        if (this.context.user.isLoggedIn)
        {
            // Set state for component to know the user is loggedIn
            this.setState({ 
                isLoaded: true,                          // data is loaded boolean
                isLoggedIn: this.context.user.isLoggedIn // set the isLoggedIn boolean
            }); 
        } 
        else
        {
            // If the user is not loggedIn, set redirectSignIn to true
            this.setState({ 
                isLoaded: true,        // data is loaded boolean
                redirectSignIn: true   // redirectSignIn boolean, used to redirect ot signIn page
            }); 

            // Push this location on history stack so after signing in the user will be redirect back to this page
            this.props.history.push(this.props.history.location.pathname);
        }
    }

    /*
    handleSubmit

    this function is used to handle the submit of the form. It takes the event and uses the state values for the course
    and calls the createCourse function.

    Parameters: event
    Returns: N/A

    */

    handleSubmit(event) 
    {            
        // Call the createCourse function with the values from the form input   
        this.createCourse(this.state.title, this.state.description, this.state.estimatedTime, this.state.materialsNeeded);

        // Prevent default action
        event.preventDefault();
    }

    /*
    createCourse

    this function takes the submitted information and makes a request to create the course to the API.
    Checks to make sure the user is logged in and handles any errors returned from the API server.

    Parameters: title, description, estimatedTime, materialsNeeded
    Returns: N/A

    */

    createCourse (title, description, estimatedTime, materialsNeeded)
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
            axios.post(`https://expressrestapi.azurewebsites.net/api/courses`, { userId: this.context.user.user.id, title: title, description: description, estimatedTime: estimatedTime, materialsNeeded: materialsNeeded },{ auth:{ username: this.context.user.email, password: this.context.user.password }})
            .then(function (response) 
            {
                // Set the redirect state to true to go back to the homepage                
                self.setState({redirect: true});
            })
            .catch(function (error) 
            {
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
        // if the user is not logged in let user know
        else
        {            
            consolidatedErrorMessages.push('Please login to create a course.');
            self.setState({validationMessages: consolidatedErrorMessages});
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
        const { error, isLoaded, redirect, redirectSignIn } = this.state;

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

            // If the user is not signed in, redirect to signin page
            if (redirectSignIn) 
            {
                return <Redirect to='/signin'/>;
            }
            // If redirect is needed to hompage
            if (redirect) 
            {
                return <Redirect to='/'/>;
            } 
            // Check to see if there are validation errors to show in the HTML
            else if (this.state.validationMessages.length > 0)
            {
                return (

                    <div className="bounds course--detail">
                        <h1>Create Course </h1>
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
                                        <p>By {this.state.isLoggedIn ? (this.context.user.user.firstName + ' ' + this.context.user.user.lastName): 'Joe Smith'}</p>
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
                                    <button className="button" type="submit">Create Course</button>
                                    <button className="button button-secondary" onClick={this.handleClick}>Cancel</button>
                                </div>
                              </form>
                            </div>
                    </div>
                  );
            }
            // Show HTML without validation errors
            else 
            {
                return (

                    <div className="bounds course--detail">
                        <h1>Create Course </h1>
                          <div>
                              <form onSubmit={this.handleSubmit}>
                                <div className="grid-66">
                                    <div className="course--header">
                                        <h4 className="course--label">Course</h4>
                                        <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." value={this.state.title} onChange={this.handleInputChange} /></div>
                                        <p>By {this.state.isLoggedIn ? (this.context.user.user.firstName + ' ' + this.context.user.user.lastName): 'Joe Smith'}</p>
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
                                    <button className="button" type="submit">Create Course</button>
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

CreateCourse.contextType = UserContext; // allow CreateCourse to access the context for the user signed in
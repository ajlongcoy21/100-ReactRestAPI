
// Import supporting files
import React, { Component } from 'react';          
import axios from 'axios';                            // import axios for use of calling API
import { Link, Redirect } from 'react-router-dom';    // import Link and Redirect for router
import ReactMarkdown from 'react-markdown';           // import markdown for the course description and materials

// Get the user context
import {UserContext} from './UserContext';

/*
CourseDetail Component

Displays the course detail to the user. If the user is logged in and authorized to update and delete the course,
those corresponding buttons will be displayed.

*/

export default class CourseDetail extends Component {

    // Constructor to receive props
    constructor(props)
    {
        super(props);

        // init the state of the CourseDetail Component
        this.state = {
            error: null,
            isLoaded: false,
            redirect: false,
            course: null,
            isCourseUser: false,
            notFound: false,
            validationMessages: []
        }

        this.deleteCourse = this.deleteCourse.bind(this);
    }

    // Component Did Mount - fetch the data from the API
    componentDidMount() 
    {   
        // Define self to get access to this for component
        var self = this;

        // Initialize error message arrays 
        //let seperatedErrorMessages = [];
        let consolidatedErrorMessages = [];

        // Make a call to the api for the specific course
        axios.get(`https://expressrestapi.azurewebsites.net/api/courses/${this.props.match.params.id}`)
        .then(response => {
            
            // Set the state on successful return of course data
            this.setState({
                isLoaded: true,             // data is loaded
                course: response.data,      // set the courses state variable to the course
            });

            // Check to see if a user is logged in

            if (this.context.user.user !== null) 
            {
                // If the user is logged in and the owner of the of the course material
                if (this.context.user.user.id === response.data.User.id) 
                {
                    // Set the state on successful return of course data
                    this.setState({
                        isCourseUser: true // set the state isCourseUser to true. This is used to display buttons
                    });
                } 
            }

        })
        .catch(error => { 

            // Check to see if the server responded with an error and response for the error
            if (error.response) 
                {
                    // The request was made and the server responded with a status code that is not in the range of 2xx

                    // Seperate the error messages by the newline identification
                    //seperatedErrorMessages = error.response.data.message.split(/(,\n)/);

                    // If the server was not able to not find the course, set the notFound state to true for redirect to notFound Page
                    if (error.response.data.message === 'Course not found. Please search for another course.')
                    {
                        self.setState({isLoaded: true, notFound: true, validationMessages: consolidatedErrorMessages});
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

    /*
    deleteCourse

    this function is used to delete the course in view. It does this by making a request to the API server with the course ID 
    and authorization information of the user.

    Parameters: N/A
    Returns: N/A

    */

    deleteCourse()
    {
        // Define self to get access to this for component
        var self = this;

        // Initialize error message arrays
        let seperatedErrorMessages = [];
        let consolidatedErrorMessages = [];
        
        // Make a call to the api to delete the specific course
        axios.delete(`https://expressrestapi.azurewebsites.net/api/courses/${this.state.course.id}` , { auth:{ username: this.context.user.email, password: this.context.user.password }})
        .then(response => {

            // Set the state on successful deletion of course data
            this.setState({
                redirect: true  // set the redirect state variable to true to return to homepage
                }); 
            
        })
        .catch(error => { 

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

                // Alert the user to the issues found
                alert(consolidatedErrorMessages); 
                
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

    /*
    editButtons

    this function is used to determine what buttons to show in view. It looks at the state to understand of the user logged in
    is the owner of the course material. If they are, it will return the HTML to display the buttons. If not then it will return
    a blank span.

    Parameters: props
    Returns: HTML

    */

    editButtons(props)
    {
        // Is the user logged in allowed to edit the course
        if (props.isUser) 
        {
            // If authorized return the buttons
            return <span><Link className="button" to={`/courses/${props.state.course.id}/update`}>Update Course</Link><Link className="button" to=' ' onClick={props.deleteFunction}>Delete Course</Link></span>;
        } 

        // If not authorized return blank span
        return <span></span>;
    }

    // render the component

    render() { 

        // Get necessary state variables
        const { error, isLoaded, course, redirect, notFound } = this.state;

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
            // If the course was not found, redirect to notfound page
            if (notFound) 
            {
                return <Redirect to='/notfound'/>;
            }

            // If redirect is needed to hompage
            if (redirect) 
            {
                return <Redirect to='/'/>;
            }

            // Check to see if we have the course materials needed to dsiplay, if not set to "N/A"
            if (!course.materialsNeeded) 
            {
                course.materialsNeeded = "N/A"
            }

            // Check to see if we have the course estimated time needed to dsiplay, if not set to "N/A"
            if(!course.estimatedTime)
            {
                course.estimatedTime = "N/A"
            }

            // setup the markdown for the description and material needed information
            const inputDescription = `\n${course.description}`;
            const inputMaterialsNeeded = `#### Materials Needed \n${course.materialsNeeded}`;

            // return HTML to show to user
            return (

              <div>
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100"><this.editButtons isUser={this.state.isCourseUser} state={this.state} deleteFunction={this.deleteCourse}/><Link className="button button-secondary" to="/">Return to List</Link></div>
                    </div>
                </div>
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course.title}</h3>
                            <p>By {course.User.firstName} {course.User.lastName}</p>
                        </div>
                        <div className="course--description">
                            <ReactMarkdown source={inputDescription} />
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats"> 
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{course.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <ReactMarkdown source={inputMaterialsNeeded} />
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

CourseDetail.contextType = UserContext; // allow courseDetail to access the context for the user signed in
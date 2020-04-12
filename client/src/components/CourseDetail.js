import React, { Component } from 'react';
import axios from 'axios'; // import axios for use of calling API
import { Link, Redirect } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

// Get the user context
import {UserContext} from './UserContext';

export default class CourseDetail extends Component {

    // Constructor to receive props

    constructor(props)
    {
        super(props);

        // init the state of the SearchForm
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
        //this.editButtons = this.editButtons(this);
    }

    // Component Did Mount - fetch the data from the API

    componentDidMount() 
    {       
        var self = this;
        let seperatedErrorMessages = [];
        let consolidatedErrorMessages = [];

        // Make a call to the api for the specific course
        axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
        .then(response => {
            
            if (this.context.user.user !== null) 
            {

                if (this.context.user.user.id === response.data.User.id) 
                {
                    // Set the state on successful return of course data
                    this.setState({
                        isLoaded: true,              // data is loaded
                        course: response.data,      // set the courses state variable to the course array
                        isCourseUser: true
                    });
                } 
                else 
                {
                    // Set the state on successful return of course data
                    this.setState({
                        isLoaded: true,              // data is loaded
                        course: response.data      // set the courses state variable to the course array
                    });
                }
            }
            else 
            {
                // Set the state on successful return of course data
                this.setState({
                    isLoaded: true,              // data is loaded
                    course: response.data      // set the courses state variable to the course array
                });
            }

            console.log(response.data);
            
        })
        .catch(error => { 

            if (error.response) 
                {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    seperatedErrorMessages = error.response.data.message.split(/(,\n)/);

                    if (error.response.data.message === 'Course not found. Please search for another course.')
                    {
                        self.setState({isLoaded: true, notFound: true, validationMessages: consolidatedErrorMessages});
                    }

                    console.log(consolidatedErrorMessages.length);
                    console.log(consolidatedErrorMessages);
                                    
                    
                    //console.log(error.response.status);
                    //console.log(error.response.headers);
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

    deleteCourse()
    {
        var self = this;
        let seperatedErrorMessages = [];
        let consolidatedErrorMessages = [];

        console.log('trying to delete');
        console.log(`http://localhost:5000/api/courses/${this.state.course.id}`);
        
        
        // Make a call to the api for the specific course
        axios.delete(`http://localhost:5000/api/courses/${this.state.course.id}` , { auth:{ username: this.context.user.email, password: this.context.user.password }})
        .then(response => {

            console.log(response.data);

            // Error occured during request
            this.setState({
                redirect: true             // set the error state variable
                }); 
            
        })
        .catch(error => { 

            if (error.response) 
            {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                seperatedErrorMessages = error.response.data.message.split(/(,\n)/);

                for (var i = 0; i < seperatedErrorMessages.length; i = i + 2) 
                {
                    consolidatedErrorMessages.push(seperatedErrorMessages[i]);
                }

                self.setState({validationMessages: consolidatedErrorMessages});

                console.log(consolidatedErrorMessages.length);
                console.log(consolidatedErrorMessages);
                alert(consolidatedErrorMessages); 
                
                if (error.response.status === 500) 
                {
                    self.setState({error: true});
                }
                
                //console.log(error.response.status);
                //console.log(error.response.headers);
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

    editButtons(props)
    {
        if (props.isUser) 
        {
            return <span><Link className="button" to={`/courses/${props.state.course.id}/update`}>Update Course</Link><Link className="button" to=' ' onClick={props.deleteFunction}>Delete Course</Link></span>;
        } 

        return <span></span>;
    }

    // render the component

    render() { 

        const { error, isLoaded, course, redirect, notFound } = this.state;

        if (error) 
        {
            return <Redirect to='/error'/>;
        } 
        else if (!isLoaded) 
        {
            return <div>Loading...</div>;
        } 
        else 
        {
            if (notFound) 
            {
                return <Redirect to='/notfound'/>;
            }

            if (redirect) 
            {
                return <Redirect to='/'/>;
            }

            if (!course.materialsNeeded) 
            {
                course.materialsNeeded = "N/A"
            }

            if(!course.estimatedTime)
            {
                course.estimatedTime = "N/A"
            }

            const inputDescription = `\n${course.description}`;
            const inputMaterialsNeeded = `#### Materials Needed \n${course.materialsNeeded}`;
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

{/* 
    <h4>Materials Needed</h4>
<ul> { course.materialsNeeded.split(/\r?\n/).map( (material, index) => ( <li key={index}>{material}</li> ))} </ul> */}

CourseDetail.contextType = UserContext;
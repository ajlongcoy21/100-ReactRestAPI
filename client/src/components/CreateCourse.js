import React, { Component } from 'react';
import axios from 'axios'; // import axios for use of calling API
import { Link, Redirect } from 'react-router-dom';

// Get the user context
import {UserContext} from './UserContext';

export default class CreateCourse extends Component {

    // Constructor to receive props

    constructor(props)
    {
        super(props);

        // init the state of the SearchForm
        this.state = {
            error: null,
            isLoaded: false,
            redirect: false,
            title: "",
            description: "",
            estimatedTime: "",
            materialsNeeded: "",
            isLoggedIn: false,
            validationMessages: []
        }

        // bind handle submit function
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.createCourse = this.createCourse.bind(this);
    }

    // Component Did Mount - set the state

    componentDidMount() 
    {           
        this.setState({ 
            isLoaded: true,   // data is loaded boolean
            isLoggedIn: this.context.user.isLoggedIn // set the isLoggedIn boolean
        }); 
        
    }

    // Handle the submit from the form
    handleSubmit(event) 
    {   
        if (event.target.name === 'cancel') 
        {
            this.setState({ redirect: true });          
        } 
        else 
        {
            console.log('Title: ' + this.state.title);
            console.log('Desc: ' + this.state.description);
            console.log('time: ' + this.state.estimatedTime);
            console.log('material: ' + this.state.materialsNeeded);
            
            this.createCourse(this.state.title, this.state.description, this.state.estimatedTime, this.state.materialsNeeded);
        }

        event.preventDefault();
    }

    createCourse (title, description, estimatedTime, materialsNeeded)
    {        
        var self = this;
        let seperatedErrorMessages = [];
        let consolidatedErrorMessages = [];

        if (this.context.user.isLoggedIn) 
        {
            axios.post(`http://localhost:5000/api/courses`, { userId: this.context.user.user.id, title: title, description: description, estimatedTime: estimatedTime, materialsNeeded: materialsNeeded },{ auth:{ username: this.context.user.email, password: this.context.user.password }})
            .then(function (response) 
            {
                console.log('in response');
                console.log(response);
                console.log(response.message);
                
            })
            .catch(function (error) {
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
                        
            });
        }
        else
        {            
            consolidatedErrorMessages.push('Please login to create a course.');
            self.setState({validationMessages: consolidatedErrorMessages});
        }

    }

    handleInputChange(event) 
    {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleClick() 
    {   
        this.setState({ redirect: true });        
    }

    // render the component

    render() { 

        const { error, isLoaded, redirect } = this.state;

        if (error) 
        {
            console.log('how here now?');
            
            return <div>Error: {error.message}</div>;
        } 
        else if (!isLoaded) 
        {
            return <div>Loading...</div>;
        } 
        else 
        {

            if (redirect) 
            {
                return <Redirect to='/'/>;
            } 
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

CreateCourse.contextType = UserContext;
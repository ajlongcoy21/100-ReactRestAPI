
// Import supporting files
import React, { Component } from 'react';
import axios from 'axios';                           // import axios for use of calling API
import { Link, Redirect } from 'react-router-dom';   // import Link and Redirect for router
import cookie from 'react-cookies'

// Get the user context
import {UserContext} from './UserContext';

/*
UserSignIn Component

Displays the user sign in component to the user.

*/

export default class UserSignIn extends Component {

    // Constructor to receive props

    constructor(props)
    {
        super(props);

        // init the state of the UserSignIn Component
        this.state = {
            error: null,
            isLoaded: false,
            redirect: false,
            email: null,
            password: null,
            isLoggedIn: false,
            validationMessages: []
        }

        // bind functions to be able to use this
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    // Component Did Mount - set the state
    componentDidMount() 
    {           
        this.setState({ 
            isLoaded: true,                           // data is loaded boolean
            email: this.context.user.email,           // set the email string
            password: this.context.user.password,     // set the password string
            isLoggedIn: this.context.user.isLoggedIn  // set the isLoggedIn boolean
        }); 
        
    }

    /*
    handleSubmit

    this function is used to handle the submit of the form. It takes the event and uses the state values for the course
    and calls the signIn function.

    Parameters: event
    Returns: N/A

    */

    handleSubmit(event) 
    {   
        // Call the signIn function with the values from the form input
        this.signIn(this.state.email, this.state.password);

        // Prevent default action
        event.preventDefault();
    }

    /*
    signIn

    this function takes the submitted information and makes a request to get the user to the API.

    Parameters: email, password
    Returns: N/A

    */

    signIn(email, password)
    {
        // Define self to get access to this for component
        var self = this;

        // Initialize error message arrays
        let consolidatedErrorMessages = [];
   
        // Make a call to the api for the specific user
        axios.get(`https://expressrestapi.azurewebsites.net/api/users`, {auth: { username: email, password: password }})
        .then(response => {
            
            // Set the context on successful return of user data
            this.context.modifyUser({email: response.data.emailAddress, password: password, user: response.data, isLoggedIn: true});

            // Set the cookie infomration
            cookie.save('email', response.data.emailAddress, { path: '/' });
            cookie.save('password', password, { path: '/' });
            cookie.save('user', response.data, {path: '/'});
            cookie.save('isLoggedIn', true, {path: '/'});            

            // Go to previous page
            this.props.history.goBack();

            // set the state
            this.setState({
                isLoaded: true,         // data is loaded
                redirect: false,
                validationMessages: []
                }); 
            
        })
        .catch(error => { 

            // Check to see if the server responded with an error and response for the error
            if (error.response) 
              {

                consolidatedErrorMessages.push(error.response.data.message);                    
                
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

            this.setState({
                isLoaded: true,         // data is loaded
                }); 
        })
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
        this.setState({ redirect: true });        
    }

    // render the component

    render() { 

        // Get necessary state variables
        const { error, isLoaded, redirect } = this.state;

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
            if (redirect) 
            {
                return <Redirect to='/'/>;
            } 
            // Check to see if there are validation errors to show in the HTML
            else if (this.state.validationMessages.length > 0)
            {
                return (

                    <div className="bounds">
                      <div className="grid-33 centered signin">
                          <h1>Sign In</h1>
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
                                  <div>
                                      <input id="emailAddress" name="email" type="text" className="" placeholder="Email Address" value={this.state.email} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                      <input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} onChange={this.handleInputChange}/>
                                  </div>
                                  <div className="grid-100 pad-bottom">
                                      <input className="button" type="submit" value="Sign In" />
                                      <input className="button button-secondary" type="button" value="Cancel" onClick={this.handleClick} />
                                  </div>
                              </form>
                          </div>
                          <p>&nbsp;</p>
                          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
                      </div>
                    </div>
                    
                  );
            }
            else 
            {
                return (

                    <div className="bounds">
                      <div className="grid-33 centered signin">
                          <h1>Sign In</h1>
                          <div>
                              <form onSubmit={this.handleSubmit}>
                                  <div>
                                      <input id="emailAddress" name="email" type="text" className="" placeholder="Email Address" value={this.state.email} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                      <input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} onChange={this.handleInputChange}/>
                                  </div>
                                  <div className="grid-100 pad-bottom">
                                      <input className="button" type="submit" value="Sign In" />
                                      <input className="button button-secondary" type="button" value="Cancel" onClick={this.handleClick} />
                                  </div>
                              </form>
                          </div>
                          <p>&nbsp;</p>
                          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
                      </div>
                    </div>
                    
                  );
            }
            
        }
    }
}

UserSignIn.contextType = UserContext; // allow UserSignIn to access the context for the user signed in
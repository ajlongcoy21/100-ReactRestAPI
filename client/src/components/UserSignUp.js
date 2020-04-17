
// Import supporting files
import React, { Component } from 'react';
import axios from 'axios';                            // import axios for use of calling API
import { Link, Redirect } from 'react-router-dom';    // import Link and Redirect for router
import cookie from 'react-cookies'

// Get the user context
import {UserContext} from './UserContext';


/*
UserSignUp Component

Displays the user sign up component to the user.

*/

export default class UserSignUp extends Component {

    // Constructor to receive props
    constructor(props)
    {
        super(props);

        // init the state of the SearchForm
        this.state = {
            error: null,
            isLoaded: false,
            redirect: false,
            firstName: "",
            lastName: "",
            emailAddress: "",
            password: "",
            confirmPassword: "",
            validationMessages: []
        }

        // bind functions to be able to use this
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.signUp = this.signUp.bind(this)
        this.signIn = this.signIn.bind(this)
    }

    // Component Did Mount - set the state
    componentDidMount() 
    {           
        this.setState({ 
            isLoaded: true   // data is loaded boolean
        }); 
        
    }

    /*
    handleSubmit

    this function is used to handle the submit of the form. It takes the event and uses the state values for the course
    and calls the signUp function.

    Parameters: event
    Returns: N/A

    */

    handleSubmit(event) 
    {   

        // Call the signIn function with the values from the form input
        this.signUp(this.state.firstName, this.state.lastName, this.state.emailAddress, this.state.password, this.state.confirmPassword);

        // Prevent default action
        event.preventDefault();
    }

    /*
    signUp

    this function takes the submitted information and makes a request to get the user to the API.

    Parameters: firstName, lastName, emailAddress, password, confirmPassword
    Returns: N/A

    */

    signUp (firstName, lastName, emailAddress, password, confirmPassword)
    {

      // Define self to get access to this for component
      var self = this;

      // Initialize error message arrays
      let seperatedErrorMessages = [];
      let consolidatedErrorMessages = [];

      // Check to see if the password and confirmpassword match
        if (password !== confirmPassword) 
        {
            consolidatedErrorMessages.push('Passwords do not match.');
            self.setState({validationMessages: consolidatedErrorMessages});
        }
        // If they do match
        else
        {
          axios.post(`https://expressrestapi.azurewebsites.net/api/users`, { firstName: firstName, lastName: lastName, emailAddress: emailAddress, password: password })
          .then(function (response) 
          {
            // call sign in function
            self.signIn(emailAddress, password);
            
          })
          .catch(function (error) {

            // Check to see if the server responded with an error and response for the error
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
    }

    /*
    signIn

    this function takes the submitted information and makes a request to get the user to the API.

    Parameters: email, password
    Returns: N/A

    */

    signIn(email, password)
    {
   
      var self = this;

        // Make a call to the api for the specific user
        axios.get(`https://expressrestapi.azurewebsites.net/api/users`, {auth: { username: email, password: password }})
        .then(response => {
            
            // Set the context on successful return of user data
            this.context.modifyUser({email: response.data.emailAddress, password: password, user: response.data, isLoggedIn: true});

            // set the cookies
            cookie.save('email', response.data.emailAddress, { path: '/' });
            cookie.save('password', password, { path: '/' });
            cookie.save('user', response.data, {path: '/'});
            cookie.save('isLoggedIn', true, {path: '/'}); 

            // go back to previous page
            this.props.history.goBack();
            
        })
        .catch(error => { 

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
                          <h1>Sign Up</h1>
                          <div>
                          <div>
                            <h2 class="validation--errors--label">Validation errors</h2>
                            <div class="validation-errors">
                                <ul>
                                    {this.state.validationMessages.map(function(message, index){return <li key={ index }>{message.replace('Validation error: ', '')}</li>;})}
                                </ul>
                                </div>
                            </div>
                              <form onSubmit={this.handleSubmit}>
                                  <div>
                                      <input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={this.state.firstName} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                    <input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={this.state.lastName} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                    <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                    <input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                    <input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleInputChange}/>
                                  </div>
                                  <div className="grid-100 pad-bottom">
                                      <input className="button" type="submit" value="Sign Up" />
                                      <input className="button button-secondary" type="button" value="Cancel" onClick={this.handleClick} />
                                  </div>
                              </form>
                          </div>
                          <p>&nbsp;</p>
                          <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
                      </div>
                    </div>
                  );
            }
            else 
            {
                return (

                    <div className="bounds">
                      <div className="grid-33 centered signin">
                          <h1>Sign Up</h1>
                          <div>
                              <form onSubmit={this.handleSubmit}>
                                  <div>
                                      <input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={this.state.firstName} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                    <input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={this.state.lastName} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                    <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                    <input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} onChange={this.handleInputChange}/>
                                  </div>
                                  <div>
                                    <input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleInputChange}/>
                                  </div>
                                  <div className="grid-100 pad-bottom">
                                      <input className="button" type="submit" value="Sign Up" />
                                      <input className="button button-secondary" type="button" value="Cancel" onClick={this.handleClick} />
                                  </div>
                              </form>
                          </div>
                          <p>&nbsp;</p>
                          <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
                      </div>
                    </div>
                  );
            }  
        }
    }
}

UserSignUp.contextType = UserContext; // allow UserSignUp to access the context for the user signed in
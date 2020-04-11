import React, { Component } from 'react';
import axios from 'axios'; // import axios for use of calling API
import { Link, Redirect } from 'react-router-dom';

// Get the user context
import {UserContext} from './UserContext';

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

        // bind handle submit function
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

    // Handle the submit from the form
    handleSubmit(event) 
    {   
        if (event.target.name === 'cancel') 
        {
            this.setState({ redirect: true });          
        } 
        else 
        {
            this.signUp(this.state.firstName, this.state.lastName, this.state.emailAddress, this.state.password, this.state.confirmPassword);
        }

        event.preventDefault();
    }

    signUp (firstName, lastName, emailAddress, password, confirmPassword)
    {

        var self = this;
        let seperatedErrorMessages = [];
        let consolidatedErrorMessages = [];

        if (password !== confirmPassword) 
        {
            consolidatedErrorMessages.push('Passwords do not match.');
        }

        axios.post(`http://localhost:5000/api/users`, { firstName: firstName, lastName: lastName, emailAddress: emailAddress, password: password })
          .then(function (response) 
          {
            console.log('in response');
            console.log(response);
            console.log(response.message);
            self.signIn(emailAddress, password);
            
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

    signIn(email, password)
    {
   
        // Make a call to the api for the specific user
        axios.get(`http://localhost:5000/api/users`, {auth: { username: email, password: password }})
        .then(response => {
            
            // Set the state on successful return of user data
            this.context.modifyUser({email: response.data.emailAddress, password: password, user: response.data, isLoggedIn: true});
            
        })
        .catch(error => { 

            // Error occured during request
            this.setState({
                isLoaded: true,         // data is loaded
                error: error            // set the error state variable
                }); 
        })
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
                          <p>Already have a user account? <Link to="/api/signin">Click here</Link> to sign in!</p>
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
                          <p>Already have a user account? <Link to="/api/signin">Click here</Link> to sign in!</p>
                      </div>
                    </div>
                  );
            }  
        }
    }
}

UserSignUp.contextType = UserContext;
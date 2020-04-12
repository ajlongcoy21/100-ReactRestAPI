import React, { Component } from 'react';
import axios from 'axios'; // import axios for use of calling API
import { Link, Redirect } from 'react-router-dom';
import cookie from 'react-cookies'

// Get the user context
import {UserContext} from './UserContext';

export default class UserSignIn extends Component {

    // Constructor to receive props

    constructor(props)
    {
        super(props);

        // init the state of the SearchForm
        this.state = {
            error: null,
            isLoaded: false,
            redirect: false,
            email: null,
            password: null,
            isLoggedIn: false,
            validationMessages: []
        }

        // bind handle submit function
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    // Component Did Mount - set the state

    componentDidMount() 
    {           
        this.setState({ 
            isLoaded: true,                          // data is loaded boolean
            email: this.context.user.email,             // set the email string
            password: this.context.user.password,       // set the password string
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
            this.signIn(this.state.email, this.state.password);
        }

        event.preventDefault();
    }

    signIn(email, password)
    {
        var self = this;
        let consolidatedErrorMessages = [];
   
        // Make a call to the api for the specific user
        axios.get(`http://localhost:5000/api/users`, {auth: { username: email, password: password }})
        .then(response => {
            
            // Set the state on successful return of user data
            this.context.modifyUser({email: response.data.emailAddress, password: password, user: response.data, isLoggedIn: true});
            cookie.save('email', response.data.emailAddress, { path: '/' });
            cookie.save('password', password, { path: '/' });
            cookie.save('user', response.data, {path: '/'});
            cookie.save('isLoggedIn', true, {path: '/'});            

            this.props.history.goBack();

            this.setState({
                isLoaded: true,         // data is loaded
                redirect: false,
                validationMessages: []
                }); 
            
        })
        .catch(error => { 

            if (error.response) 
              {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                
                console.log('here now with errors: ');
                console.log(error.response);

                consolidatedErrorMessages.push(error.response.data.message);  
                console.log(consolidatedErrorMessages);
                  
                
                self.setState({validationMessages: consolidatedErrorMessages});

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

            // Error occured during request
            this.setState({
                isLoaded: true,         // data is loaded
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
                          <h1>Sign In</h1>
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

UserSignIn.contextType = UserContext;
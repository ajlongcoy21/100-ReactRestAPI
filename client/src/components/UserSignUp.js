import React, { Component } from 'react';
import axios from 'axios'; // import axios for use of calling API
import { Link, Redirect } from 'react-router-dom';

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
            email: "",
            password: "",
            confirmPassword: ""
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
            this.signIn();
        }

        event.preventDefault();
    }

    signIn()
    {
   

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
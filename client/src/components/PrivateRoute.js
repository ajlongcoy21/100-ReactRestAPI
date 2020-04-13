import React, {useContext} from "react";
import { Route, Redirect } from 'react-router-dom';

// Get the user context
import {UserContext} from './UserContext';

function PrivateRoute ({ children, ...rest }) {

    const {user} = useContext(UserContext);

    console.log('update ID: ');
    console.log(children);
    console.log(rest);

    return (
        <Route {...rest} 
            render={({ location }) => 
            user.isLoggedIn ? ( React.Children.map(children ,child => React.cloneElement(child, {computedMatch: rest.computedMatch})) ) : ( <Redirect to={{ pathname: "/signin", state: { from: location } }}
              />)}
        />
      ); 
}

export default PrivateRoute;
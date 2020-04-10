// Import CSS file
import './global.css';

// Import default components and 3rd party libraries
import React, { useState, useContext } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';


// import custom components
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignIn from './components/UserSignIn';
import Head from './components/Head';
import Header from './components/Header';
import UserSignOut from './components/UserSignOut';

//Import Context
import {UserContext} from './components/UserContext';

function App() {

  const originalUser = useContext(UserContext);
  const [user, modifyUser] = useState(originalUser);

  return (
      <BrowserRouter>
        <div id="root">
          <Head />
          <div>
            <UserContext.Provider value={ {user, modifyUser} }>
              <Header />
              <Switch>
                <Route exact path="/" component={Courses}/>
                <Route path="/api/courses/:id" component={CourseDetail}/>
                <Route path="/api/signin" component={UserSignIn}/>
                <Route path="/api/signout" component={UserSignOut}/>
              </Switch>
            </UserContext.Provider>
          </div>
        </div>
      </BrowserRouter>
  );
}



export default App;

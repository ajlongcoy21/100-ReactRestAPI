// Import CSS file
import './global.css';

// Import default components and 3rd party libraries
import React, { useState, useContext } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

// import custom components
import Head from './components/Head';
import Header from './components/Header';

import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import UserSignUp from './components/UserSignUp';

import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';

import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';
import UnhandledError from './components/UnhandledError';

import PrivateRoute from './components/PrivateRoute';

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
                <PrivateRoute path="/courses/create">
                  <CreateCourse />
                </PrivateRoute>
                <PrivateRoute path="/courses/:id/update">
                  <UpdateCourse />
                </PrivateRoute>
                <Route path="/courses/:id" component={CourseDetail}/>
                <Route path="/signin" component={UserSignIn}/>
                <Route path="/signup" component={UserSignUp}/>
                <Route path="/signout" component={UserSignOut}/>
                <Route path="/error" component={UnhandledError}/>
                <Route path="/forbidden" component={Forbidden}/>
                <Route path="/notfound" component={NotFound}/>
                <Route component={NotFound}/>
              </Switch>
            </UserContext.Provider>
          </div>
        </div>
      </BrowserRouter>
  );
}



export default App;

// Import CSS file
import './global.css';

// Import default components and 3rd party libraries
import React, { PureComponent } from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';

// import custom components
import Courses from './components/Courses';
import Head from './components/Head';

function App() {
  return (
        <div id="root">
          <Head />
          <div>
            <div className="header">
              <div className="bounds">
                <h1 className="header--logo">Courses</h1>
                <nav><a className="signup" href="sign-up.html">Sign Up</a><a className="signin" href="sign-in.html">Sign In</a></nav>
              </div>
            </div>
            <Courses />
          </div>
        </div> 
  );
}

export default App;

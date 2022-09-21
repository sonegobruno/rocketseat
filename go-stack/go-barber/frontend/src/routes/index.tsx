import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const Routes: React.FC = () => {
    return(
        <Switch>
            <Route path="/" exact component={SignIn}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/forgot-password" component={ForgotPassword}/>
            <Route path="/reset-password" component={ResetPassword}/>
            <Route path="/dashboard" component={Dashboard} isPrivate={true}/>
            <Route path="/profile" component={Profile} isPrivate={true}/>
        </Switch>
    );
}

export default Routes;
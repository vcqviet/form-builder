import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Error from './components/utils/Error';
import UserLogin from './components/auth/UserLogin';
import AuthorisedRoute from './components/auth/AuthorisedRoute';
import PasswordReset from './components/auth/ResetPassword';
import ForgotPasswordRequest from './components/auth/ForgotPasswordRequest';
import Dashboard from './components/dashboard/Dashboard';

const LoginApp: React.FC = () => {
    return (
        <Router basename={'/'} >
            <div className={'app'}>
                <div className={'app-col'}>
                    <Container>
                        <Error />
                        <Switch>
                            <Route exact path={'/password-reset/:token'} component={PasswordReset} />
                            <Route exact path={'/forgot-password-request'} component={ForgotPasswordRequest} />
                            <Route path={'/login'} component={UserLogin} />
                            <AuthorisedRoute path={'/'} component={Dashboard} />
                        </Switch>
                    </Container>
                </div>
            </div>
        </Router>
    );
};

export default LoginApp;

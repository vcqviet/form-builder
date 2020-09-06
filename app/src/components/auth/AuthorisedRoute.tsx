import React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';
import {useSelector} from 'react-redux';
import {StateInterface} from '../../store/store';

const AuthorisedRoute: React.FC<RouteProps> = ({location, ...rest}) => {
    const authState = useSelector((state: StateInterface) => state.auth);
    return (
        authState.isAuthenticated ? <Route {...rest} /> : <Redirect to={{pathname: '/login', state: {from: location ? location.pathname : '/'}}} />
    )
};

export default AuthorisedRoute;

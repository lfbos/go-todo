import React from 'react';
import {Redirect, Route} from "react-router";
import {auth} from "../auth";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth.isAuthenticated === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    )} />
);

export default PrivateRoute;
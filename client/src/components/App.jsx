import React from "react";
import {Container} from "semantic-ui-react";

import {HashRouter, Route, Switch} from "react-router-dom";

import "./App.css";

import routes from '../routes';
import Http404 from "./Http404";
import PrivateRoute from "./PrivateRoute";
import AuthButton from "./AuthButton";

function App() {
    return (
        <HashRouter basename="/">
            <Container>
                <AuthButton />

                <Switch>
                    {routes.map((route, idx) => {
                        if (route.isPrivate) {
                            return (
                                <PrivateRoute
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    component={route.component}
                                />
                            );
                        }

                        return (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.exact}
                                component={route.component}
                            />
                        );
                    })}
                    <Route component={Http404}/>
                </Switch>
            </Container>
        </HashRouter>
    );
}

export default App;

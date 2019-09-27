import React from 'react';
import {Button, Divider, Grid, Header, Icon} from "semantic-ui-react";
import {withRouter} from "react-router";
import {fakeAuth} from "../auth";

const AuthButton = withRouter(({history}) => (
    fakeAuth.isAuthenticated ?
        <>
            <Grid textAlign='left' verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h3' color='black' textAlign='left'>
                        Welcome! <Button onClick={() => fakeAuth.signout(() => history.push('/'))} basic size="mini" color="orange">
                                    <Icon name='sign-out'/> Sign out
                                </Button>
                    </Header>
                </Grid.Column>
            </Grid>

            <Divider/>
        </>
        : null
));

export default AuthButton;
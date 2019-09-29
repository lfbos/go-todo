import React from 'react';
import {Button, Divider, Grid, Header, Icon} from "semantic-ui-react";
import {withRouter} from "react-router";
import {auth} from "../auth";
import {getUserFullName} from "../utils";

const AuthButton = withRouter(({history}) => (
    auth.isAuthenticated ?
        <div style={{marginBottom: 30}}>
            <Grid textAlign='left' verticalAlign='middle'>
                <Grid.Column floated="left" style={{minWidth: 400}}>
                    <Header as='h3' color='black' textAlign='left' style={{width: '100%'}}>
                        Welcome {getUserFullName()}!
                    </Header>
                </Grid.Column>
                <Grid.Column floated="right" style={{minWidth: 400}}>
                    <Header as='h3' color='black' textAlign='right'>
                        <Button onClick={() => auth.signout(() => history.push('/'))}
                                basic size="mini" color="orange">
                            <Icon name='sign-out'/> Sign out
                        </Button>
                    </Header>
                </Grid.Column>
            </Grid>

            <Divider/>
        </div>
        : null
));

export default AuthButton;
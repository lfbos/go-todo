import React from 'react'
import {Button, Divider, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'
import {Link} from "react-router-dom";

const RegisterForm = () => (
    <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 600}}>
            <Header as='h2' color='black' textAlign='center'>
                Register
            </Header>
            <Form size='large'>
                <Segment stacked>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Name'/>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Last Name'/>
                    <Form.Input fluid icon='at' iconPosition='left' type="email" placeholder='E-mail address'/>

                    <Divider />

                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                    />
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Repeat Password'
                        type='repeat_password'
                    />

                    <Button color='teal' fluid size='large'>
                        Register
                    </Button>
                </Segment>
            </Form>
            <Message>
                Are you already with us? <Link to="/login/">Log In</Link>
            </Message>
        </Grid.Column>
    </Grid>
);

export default RegisterForm;
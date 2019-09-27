import React, {useState} from 'react'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import {fakeAuth} from "../auth";
import {Redirect} from "react-router";

const LoginForm = () => {
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();

        if (email.trim().length === 0 || password.trim().length === 0) return false;

        fakeAuth.authenticate(() => {
            setRedirectToReferrer(true);
        });
    };

    if (redirectToReferrer === true) {
        return <Redirect to='/' />;
    }

    return (
        <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
            <Grid.Column style={{maxWidth: 450}}>
                <Header as='h2' color='black' textAlign='center'>
                    Log-in to your account
                </Header>
                <Form onSubmit={onSubmit} size='large' error>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            icon='at'
                            iconPosition='left'
                            type="email"
                            placeholder='E-mail address' required
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" color='teal' fluid size='large' disabled={email.trim().length === 0 || password.trim().length === 0}>
                            Login
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    New to us? <Link to="/signup/">Sign Up</Link>
                </Message>
            </Grid.Column>
        </Grid>
    );
};

export default LoginForm;
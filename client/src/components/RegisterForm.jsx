import React, {useState} from 'react'
import {Button, Divider, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'
import {Link, Redirect} from "react-router-dom";

import {auth} from "../auth";
import api from "../api";


const RegisterForm = () => {
    const [data, setData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [redirect, setRedirect] = useState(auth.isAuthenticated);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!isValid()) return false;

        const requestData = {...data};
        delete requestData.repeatPassword;

        try {
            await api.register(requestData);
            setRedirect(true);
        } catch (e) {
            /* Add sweet alert */
        }
    };

    const onChange = e => {
        const {name, value} = e.currentTarget;
        setData({
            ...data,
            [name]: value
        })
    };

    const isValid = () => {
        const {name, lastName, email, password, repeatPassword} = data;

        if (name.trim().length === 0 || lastName.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 || repeatPassword.trim().length === 0) {
            return false;
        }

        return password.trim() === repeatPassword.trim();
    };

    if (redirect) {
        return <Redirect to="/login"/>;
    }

    return (
        <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
            <Grid.Column style={{maxWidth: 600}}>
                <Header as='h2' color='black' textAlign='center'>
                    Register
                </Header>
                <Form onSubmit={onSubmit} size='large'>
                    <Segment stacked>
                        <Form.Input
                            fluid
                            name="name"
                            icon='user'
                            iconPosition='left'
                            placeholder='Name'
                            onChange={e => onChange(e)}
                            required
                        />
                        <Form.Input
                            fluid
                            name="lastName"
                            icon='user'
                            iconPosition='left'
                            placeholder='Last Name'
                            onChange={e => onChange(e)}
                            required
                        />
                        <Form.Input
                            fluid
                            name="email"
                            icon='at'
                            iconPosition='left'
                            type="email" placeholder='E-mail address'
                            onChange={e => onChange(e)}
                            required
                        />

                        <Divider/>

                        <Form.Input
                            fluid
                            name="password"
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            onChange={e => onChange(e)}
                            required
                        />
                        <Form.Input
                            fluid
                            name="repeatPassword"
                            icon='lock'
                            iconPosition='left'
                            placeholder='Repeat Password'
                            type='password'
                            onChange={e => onChange(e)}
                            required
                        />

                        <Divider/>

                        <Button
                            fluid
                            type="submit"
                            color='teal'
                            size='large'
                            disabled={!isValid()}
                        >
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
};

export default RegisterForm;
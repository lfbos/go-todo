import React from 'react'
import {Grid, Header} from 'semantic-ui-react'

const Http404 = () => (
    <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 450}}>
            <Header as='h1' color='red' textAlign='center'>
                404
            </Header>
            <Header as='h3' color='teal' textAlign='center'>
                Página no encontrada
            </Header>
        </Grid.Column>
    </Grid>
);

export default Http404;

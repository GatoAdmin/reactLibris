import React from 'react'
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react'
import {Link} from 'react-router-dom';

class Login extends React.Component{
    submitHandler = (event) => {
        event.preventDefault();
        this.props.login_process({
            email: event.target.email.value,
            password: event.target.password.value
        })
    }

    render(){
        return (
            <Segment placeholder>
              <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                  {/* <Form onSubmit={this.submitHandler}> */} 
                  <Form action="/login" method="POST">
                    <Form.Input
                      icon='user'
                      iconPosition='left'
                      name='email'
                      label='User Email'
                      placeholder='email'
                    />
                    <Form.Input
                      icon='lock'
                      iconPosition='left'
                      name='password'
                      label='Password'
                      type='password'
                    />
          
                    <Button content='Login' primary />
                  </Form>
                </Grid.Column>
          
                <Grid.Column verticalAlign='middle'>
                  <Button content='Sign up' icon='signup' size='big' as={Link} to="/signup" />
                </Grid.Column>
              </Grid>
          
              <Divider vertical>Or</Divider>
            </Segment>
          )
    } 
      
}

export default Login;

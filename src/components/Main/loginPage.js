import React from 'react'
import axios from 'axios';
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import GoogleLogin from 'react-google-login';

class LoginPage extends React.Component{
    submitHandler = (event) => {
        event.preventDefault();
        this.props.login_process({
            email: event.target.email.value,
            password: event.target.password.value
        })
        // var data = { email: event.target.email.value, password: event.target.password.value}
        // axios.post('/test',{ email: event.target.email.value, password: event.target.password.value})
        // .then(res=>{console.log(res)});
    }

    render(){
        return (
            <Segment placeholder>
              <Grid relaxed='very' stackable>
                  <Grid.Column className="text-center">
                  {/*<Grid.Row>
                   <Grid.Column>
                    <Form onSubmit={this.submitHandler}> 
                    {/* <Form action='/test' method="POST">  
                    {/* <Form action="/login" method="POST"> 
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
                  </Grid.Column> <Grid.Column>*/}
                    
                      {/* <Form action='/login/google' method="POST"> 
                        <Button type="submit" icon="google" content='Sign with Google' /> */}
                        <GoogleLogin 
                          clientId="376934500468-n23i56vurbm1eakqio5v3gmadhkmnfp2.apps.googleusercontent.com"
                          buttonText="구글로 로그인"
                          onSuccess={(response)=>this.props.responseSuccessGoogle(response)}
                          onFailure={(response)=>this.props.responseFailureGoogle(response)}
                          uxMode="popup"
                          cookiePolicy={'single_host_origin'}
                        />
                      {/*</Grid.Column> </Form> 
                    
                  </Grid.Row>   */}
                </Grid.Column>
                {/* <Grid.Column verticalAlign='middle'>
                    <Button content='Sign up' icon='signup' size='big' as={Link} to="/signup" /> */}

                {/* <Grid.Row>
                  <Grid.Column>
                    <Form action='/login/google' method="POST"> 
                      <Button icon="google" content='Sign with Google' primary />
                    </Form>
                  </Grid.Column>
                </Grid.Row>     */}
                {/* </Grid.Column>  */}
              </Grid>
          
              {/* <Divider vertical>Or</Divider> */}
            </Segment>
          )
    } 
}

export default LoginPage;

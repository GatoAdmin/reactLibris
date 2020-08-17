import React from 'react'
import { Button, Divider, Form, Grid, Segment } from 'semantic-ui-react'
import {Link} from 'react-router-dom';
import Login from './login';

class LoginPage extends React.Component{
    render(){
        return (
            <Login login_process={this.props.login}></Login>
          )
    }
}

export default LoginPage;

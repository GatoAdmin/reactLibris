import React from 'react';
import axios from 'axios';
import { Button, List } from 'semantic-ui-react';

class Logout extends React.Component {
    logout = () => {
      axios.post('/logout')
      .then(res => {
        console.log("App.js login .then " , res.data);
        if(res.data.success){
          this.setState({ currentUser : res.data.currentUser });
          window.location.href = "/";
        }
      })
    }
    render() {
        this.logout();
        return (
            <div>
                안녕히 가세요!
            </div>
        );
    }
}
export default Logout;


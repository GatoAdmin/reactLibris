import React, { Component } from 'react';
import axios from 'axios';
import {Grid} from 'semantic-ui-react';
class MyInfo extends Component {
    constructor(props) {
        super(props);
        console.log(props.currentUser)
        this.state = {
            passwdCheck:false,
            href:window.location.href,
            currentUser: props.currentUser
        };
    }
    // checkPasswd() {
    //     axios.post('/passwd/check')
    //         .then(res => this.setState({ 
    //             user: res.data.user,
    //             masterTagRules: res.data.masterTagRules }))
    //         .catch(function (error) {
    //             console.log(error);
    //         });

    //     this.forceUpdate();
    // }

    getMyInfoList(){
        return(
            <Grid>
                <Grid.Row><Grid.Column width={5}>이메일</Grid.Column><Grid.Column width={9}>{this.state.currentUser.userEmail}</Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column width={5}>별명</Grid.Column><Grid.Column width={9}>{this.state.currentUser.userName}</Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column width={5}>이름</Grid.Column><Grid.Column width={9}>userRealName</Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column width={5}>본인 인증</Grid.Column><Grid.Column width={9}>본인 인증</Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column width={5}>성인 인증</Grid.Column><Grid.Column width={9}>성인 인증</Grid.Column></Grid.Row>
                <Grid.Row><Grid.Column width={5}>마케팅 정보 수신 관리</Grid.Column><Grid.Column width={9}></Grid.Column></Grid.Row>
            </Grid>
            )
    }
    render(){
        var component = <div></div>;
        if(this.state.currentUser!=null)component =this.getMyInfoList()
        return component
    }
}
export default MyInfo;

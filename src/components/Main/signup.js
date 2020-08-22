import React from 'react';
import { Button, List, Form } from 'semantic-ui-react';

class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            password:""
        };
    }
    changePassword=(e)=>{
        this.setState({password:e.target.value});
    }
    checkPassword=(e)=>{
        if(this.state.password!==e.target.value){

        }else{

        }
        return 
    }
    render() {
        //onChange={()=>this.changePassword} value={this.state.password}
        return (
            <div className="signup">
                <h3>회원 가입</h3>
                <Form action="/signup" method="post">
                    <Form.Input label='이메일' type="email" name="email" placeholder='joe@schmoe.com' required />
                    <Form.Input label='비밀번호' type="password" name="password" required />
                    {/* <Form.Input label='비밀번호 확인' type="match[password]" error="비밀번호가 일치하지 않습니다." name="password_check"/> */}
                    <Button type="submit">회원가입</Button>
                </Form>
            </div>
        );
    }
}
export default Signup;

import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Button, List, Header, Modal, Form} from 'semantic-ui-react';


class Report extends React.Component  {
    state = {}
    constructor(props){
        super(props);
        this.state = {
            value:'',
            open:false
        };
    }
    handleChange = (e, { value }) => this.setState({ value });
    setOpen=((open)=>{
        if(open){this.setState({open:open})}
        else{
            this.setState({open:open, value:''});
        }
    });

    submitReport = (e) =>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const newObject = {};
        
        for (var pair of formData.entries()) {
            newObject[pair[0]]= pair[1];
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        
        axios.post(`/report/comment/${this.props.comment}`,newObject)
        .then(res=>{
            if(res.data.success){
                this.setState({open:false, value:''});
                window.alert("성공적으로 신고하였습니다")
                window.location.reload();
            }
        })
        .catch(err=>{
            console.log(err);
        });
        return false;
    }

    render() {
        const { value } = this.state;
        return (
            <div>
                <Modal
                    closeIcon
                    onClose={() => this.setOpen(false)}
                    onOpen={() => this.setOpen(true)}
                    open={this.state.open}
                    trigger={<Button >신고</Button>}
                >
                <Modal.Header>신고 사유를 선택해 주세요</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                    <Header>장난 또는 허위 신고시 불이익을 받으실 수 있습니다</Header>
                    </Modal.Description>
                    <Form  onSubmit={(e)=>this.submitReport(e)}>
                    <Form.Group grouped>
                        <Form.Radio
                            label='홍보 및 광고 기타'
                            value='광고'
                            name="reasonKind"
                            checked={value === '광고'}
                            onChange={this.handleChange}
                        />
                        <Form.Radio
                            label='종교 및 정치 기타 금기사항'
                            value='종교정치'
                            name="reasonKind"
                            checked={value === '종교정치'}
                            onChange={this.handleChange}
                        />
                        <Form.Radio
                            label='선정(19금) 및 폭력적인 내용'
                            value='선정폭력'
                            name="reasonKind"
                            checked={value === '선정폭력'}
                            onChange={this.handleChange}
                        />
                        <Form.Radio
                            label='게시판 규정 위반'
                            value='게시판규정'
                            name="reasonKind"
                            checked={value === '게시판규정'}
                            onChange={this.handleChange}
                        />
                        <Form.Radio
                            label='기타(직접작성: 최대 1,000자)'
                            value='기타'
                            name="reasonKind"
                            checked={value === '기타'}
                            onChange={this.handleChange}
                        />
                        {this.state.value==='기타'?
                        <Form.TextArea name="detail"/>:null}
                        </Form.Group>
                        <Button type="submit">신고</Button>
                    </Form>
                </Modal.Content>
                </Modal>
            </div>
        );
    }
}
export default Report;
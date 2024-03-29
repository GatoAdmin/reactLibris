import React, { Component } from 'react';
import axios from 'axios';
import BigCalendar from './calendar'
import {Button, List,Image}from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import 'semantic-ui-css/semantic.css';
import Moment from 'react-moment';
import QuillViewer from '../../Quill/react-quill-viewer';
import QuillEditor from '../../Quill/react-quill-editor-bubble';
import UserReport from '../../Report/userReport';
class Profile extends Component {
    constructor(props) {
        super(props);
        console.log(props.currentUser)
        this.state = {
            user: null,
            href:window.location.href,
            currentUser: props.currentUser,
            masterTagRules: null,
            article:null,
            isReported:false,
            date: new Date()
        };
    }
    componentDidMount() {
        axios.post(window.location.href)
            .then(res => this.setState({ 
                user: res.data.user,
                isReported: res.data.isReported,
                masterTagRules: res.data.masterTagRules }))
            .catch(function (error) {
                console.log(error);
            });

        this.forceUpdate();
    }

    componentDidUpdate(prevProps, prevState){
        console.log(window.location.href);
        if (window.location.href !== prevState.href) {    
            let getArticles = () => {
            axios.post(window.location.href)
                .then(res => {
                    console.log(res)
                    this.setState({
                        user: res.data.user,
                        isReported: res.data.isReported,
                        masterTagRules: res.data.masterTagRules
                    });
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
        this.setState({href:window.location.href});
        }
    }
    convertQuill() {
        var quillContents = this.state.article;
        var about = document.querySelector('input[name=article]');
        about.value = JSON.stringify(quillContents);
        console.log(quillContents);
        return true;
      };
      changeQuill=(e)=>{
          console.log(e);
          this.setState({article:e});
      }

    onDateClickChange = date => this.setState({ date })
    addBlockUser(userName){
        var check = window.confirm("해당 유저를 차단하면, 앞으로 유저와 관련된 모든 작품을 볼 수 없습니다. 차단하시겠습니까?");
        if(check){
            axios.post("/user/block/user/"+userName)
            .then(function (res){
                if(res.data.err){
                    alert(res.data.err);
                }
                window.location = res.data.redirect;
            })
            .catch(function (err) {
                    console.log(err);
                })
        }
    };
    removeBlockUser(userName){
        var check = window.confirm("차단한 유저를 다시 보시겠습니까?");
        if(check){
            axios.post("/user/block/user/"+userName)
            .then(function (res){
                if(res.data.err){
                    alert(res.data.err);
                }
                window.location = res.data.redirect;
            })
            .catch(function (err) {
                    console.log(err);
                })
        }
    };
    getProfielDetail(user, currentUser) {
        var masterTagRules = this.state.masterTagRules;
        let quillViewer;//include('../quill-viewer',{context: user.profile.introduction})
        let quillEdit;//include('../quill-view-editor',{context: user.profile.introduction})
        let editIntro;
        let edit;
        let detail;
        var masterCanRules;
        if(user!==null){
            var introduction = (user.profile.introduction===undefined||user.profile.introduction==="")?null:user.profile.introduction;
            quillViewer = <QuillViewer setValue={introduction} />;
            quillEdit = <QuillEditor  changeQuill={this.changeQuill}  setValue={introduction}/>;
        }
        if (typeof(currentUser) === 'object'&&!Array.isArray(currentUser)&&currentUser!==null&&user!==null) {
            if (currentUser.userEmail === user.userEmail) {
                editIntro = (<div id="form-container" className="container">
                    <form method="POST" action={"/user/" + user.userName + "/introudtion/save"} onSubmit={()=>this.convertQuill()}>
                        <input name="article" type="hidden" />
                        {quillEdit}
                        <Button>소개글 수정</Button>
                    </form>
                </div>)
            } else {
                editIntro = quillViewer
            }
            
            if (currentUser.userEmail === user.userEmail) {
                edit = <List.Content><Button as={Link} to={`/user/${user.userName}/edit/`}>프로필 편집</Button></List.Content>
            }
        } else {
            editIntro = quillViewer
        }

        if (user !== null) {
            masterCanRules = user.profile.canMasterRules.map((value, index) => (
                <List.Item>
                    <List.Content>
                        <List.Header>룰 :{value.rule_kind === "ETC" ? value.rule : masterTagRules.find(tag => tag._id === value.rule_tag).tag}</List.Header>
                        <List.List>
                        {(user.profile.canMasterScenarios !== undefined && user.profile.canMasterScenarios !== null)? (
                                user.profile.canMasterScenarios.map((scenario, s_index) => (
                                    (scenario.rule_kind === "ETC" && value.rule_kind === "ETC") ?
                                        (scenario.rule===value.rule ?
                                            <List.Item><List.Content><List.Description>시나리오 : {scenario.title} | {scenario.author} 작</List.Description></List.Content></List.Item> : null) :
                                        ((value.rule_tag !== "" && value.rule_tag !== undefined) && (scenario.rule_tag !== undefined && scenario.rule_tag !== "")) ?
                                            ((value.rule_tag===scenario.rule_tag) ? <List.Item> <List.Content><List.Description>시나리오 : {scenario.title} | {scenario.author} 작</List.Description></List.Content> </List.Item>: null) : null

                                ))
                        ) : null }
                        </List.List>
                    </List.Content>
                </List.Item>
                )
            )
        let quillBoxStyle = {width: "80%", marginLeft: "10%"};
        detail = (
            <div>
                <div className="profileImage"><Image src={user.portrait}/></div>
                <List className="profile">
                    <List.Item>
                        <span>소개글 :
                        <div className="quill-box" style={quillBoxStyle}>
                                {editIntro}
                            </div>
                        </span>
                    </List.Item>
                    <List.Item>
                        <List.Content><List.Header>가입일 :</List.Header> <List.Description><Moment format='YYYY-MM-DD'>{user.created}</Moment></List.Description></List.Content>
                    </List.Item>
                    <List.Item>
                        {edit}
                    </List.Item>

                    <List.Item className="contacts">
                        <List.Header>연락방법:</List.Header>
                    <List.List>
                        <List.Item>
                            {user.profile.contacts.map((value, index) => (
                                value.contactType === 'twitter' ? (
                                    <List.Content>
                                        <a href={`https://twitter.com/${value.contact}`} >
                                            <List.Icon name='twitter' />
                                           {value.contact}
                                        </a>
                                    </List.Content>
                                ) : (value.contactType === 'email' ? (
                                <List.Content>
                                    <List.Icon name='mail' />
                                    {/* <img className="contact_type_icon email" sizes="30x30" width="30" src="https://thumbs.dreamstime.com/b/email-icon-isolated-white-background-open-envelope-pictogram-line-mail-symbol-website-design-app-ui-vector-illustration-106510001.jpg" /> */}
                                    {value.contact}
                                </List.Content>
                                ) :

                                    /* }else if(value.contactType==='디스코드'){
                                        <List.Item>
                                            <List.Icon name='discord' />
                                            <a href="https://twitter.com/{ value.contact }">
                                                <img className="contact_type_icon twitter" sizes="30x30" width="30" src="https://wikis.krsocsci.org/images/d/de/%EB%94%94%EC%8A%A4%EC%BD%94%EB%93%9C%EC%95%84%EC%9D%B4%EC%BD%98.png" />
                                                { value.contact}
                                            </a>
                                        </List.Item>
                                    } else if(value.contactType==='카카오톡 톡방') {
                                        <List.Item>
                                            <List.Icon name='discord' />
                                            <a href="https://twitter.com/{ value.contact ">
                                                <img className="contact_type_icon kakaotalk_url" sizes="30x30" width="30" src="https://image.flaticon.com/icons/svg/2111/2111466.svg" />
                                                { value.contact
                                            </a>
                                        </List.Item>
                                    } else if(value.contactType==='kakaotalk') {
                                        <List.Item>
                                            <List.Icon name='discord' />
                                            <!-- <a href="https://twitter.com/{ value.contact "> -->
                                            <img className="contact_type_icon kakaotalk" sizes="30x30" width="30" src="https://image.flaticon.com/icons/svg/2111/2111466.svg" />
                                            { value.contact
                                            <!-- </a> -->
                                        </List.Item>*/
                                    (value.contactType === 'telegram' ? (<List.Content>
                                        <a href={`https://telegram.me/${value.contact}`}>
                                            <List.Icon name='telegram' />
                                            {value.contact}
                                        </a>
                                    </List.Content>
                                    ) : (value.contactType === 'instagram' ? (
                                        <List.Content>
                                            <a href={`https://www.instagram.com/${value.contact}/?hl=ko`}>
                                            <List.Icon name='instagram' />
                                               {value.contact}
                                            </a>
                                        </List.Content>
                                    ) : null)))
                            ))}
                            </List.Item>
                        </List.List>
                    </List.Item>

                    <List.Item className="rpg_info">
                        {(user.profile.preferPlayStyle.playTypes.length > 0 || user.profile.preferPlayStyle.canConditions.length > 0) ? (
                            <List.Content>
                                <List.Header>선호하는 플레이 스타일</List.Header>
                                <List.List>
                                {(user.profile.preferPlayStyle.playTypes !== undefined && user.profile.preferPlayStyle.playTypes !== null) ? (
                                    user.profile.preferPlayStyle.playTypes.map((value, index) => {
                                        return <List.Item><List.Content>{value}
                                        </List.Content></List.Item>
                                    })
                                ) : null}

                                {(user.profile.preferPlayStyle.canConditions !== undefined && user.profile.preferPlayStyle.canConditions !== null) ?
                                    (user.profile.preferPlayStyle.canConditions.map((value, index) => {
                                        return <List.Item><List.Content>{value}
                                        </List.Content></List.Item>
                                    })) : null}
                                </List.List>
                            </List.Content>
                        ) : null}
                        {(user.profile.haveRules !== undefined && user.profile.haveRules !== null) ?
                            (<List.Item>
                                <List.Header>가지고 있는 룰</List.Header>
                                <List.List>
                                    {user.profile.haveRules.map((value, index) => (
                                        <List.Item>
                                            <List.Content>{value.rule_kind === "ETC" ? value.rule : (value.rule_kind !== null && value.rule_kind !== undefined) ?
                                                masterTagRules.find(tag => tag._id === value.rule_tag).tag : null}
                                            </List.Content>
                                        </List.Item>
                                        //     <!-- <if(value.supplements.length > 0){
                                        //         <List>
                                        //             <List.Item>서플리먼트</List.Item>
                                        //          value.supplements.map((supplement,s_index)=>{
                                        //             <List.Item>=supplement.title (<=supplement.language)</List.Item>
                                        //         <})
                                        //         </List>
                                        // } --> 
                                    ))}
                                </List.List>
                            </List.Item>
                            ) : null}
                        {(user.profile.canMasterRules !== undefined && user.profile.canMasterRules !== null) ? (
                            <List.Item>
                                <List.Header>마스터링 가능</List.Header>
                                <List.Content>
                                    <List.List>
                                        {masterCanRules}
                                    </List.List>
                                </List.Content>
                            </List.Item>
                        ) : null}
                        {(user.profile.preferRules !== undefined && user.profile.preferRules !== null) ? (
                            <List.Item>
                                <List.Header>선호하는 룰</List.Header>
                                <List.List>
                                    {user.profile.preferRules.map((value, index) => {
                                        return <List.Item>{value.rule_kind === "ETC" ? value.rule : masterTagRules.find(tag => tag._id === value.rule_tag).tag}</List.Item>
                                    })}
                                    {/* <!-- < if(user.profile.wishfulScenarios !== undefined &&user.profile.wishfulScenarios !== null){ -->
                                 <!-- < if(user.profile.preferRules.find(scenario=>scenario.rule===value.title) !== undefined ){
                                 <List>
                                     <List.Item>시나리오</List.Item>
                                     < user.profile.canMasterScenarios.map((scenario,s_index)=>{
                                         < if( scenario.rule === value.title ){
                                             <List.Item>< scenario.title |< supplement.author 작</List.Item>
                                         <}
                                     <})
                                 </List>
                                 <} -->
                             <!-- <} --> */}
                                </List.List>
                            </List.Item>
                        ) : null}

                        {(user.profile.wentToScenarios !== undefined && user.profile.wentToScenarios !== null) ?
                            (
                                <List.Item>
                                    <List.Header>다녀온 시나리오</List.Header>
                                    <List.List>
                                        {user.profile.wentToScenarios.map((value, index) => {
                                            return <List.Item>{value.title}  | {value.author}  작</List.Item>
                                            // <!-- < if(user.profile.wishfulScenarios !== undefined &&user.profile.wishfulScenarios !== null){ -->
                                            //     <!-- < if(user.profile.preferRules.find(scenario=>scenario.rule===value.title) !== undefined ){
                                            // <List>
                                            //     <List.Item>시나리오</List.Item>
                                            //      {user.profile.canMasterScenarios.map((scenario,s_index)=>{
                                            //          {scenario.rule === value.title?<List.Item> {scenario.title} |{supplement.author} 작</List.Item>:null}
                                            //     })}
                                            // </List>
                                            //     <} -->
                                            // <!-- <} -->
                                        })}
                                    </List.List>
                                </List.Item>
                            ) : null}
                        {(user.profile.ngMaterials !== undefined && user.profile.ngMaterials !== null) ?
                            (user.profile.ngMaterials.length > 0 ? (
                                <List.Item>
                                    <List.Header>NG 소재</List.Header>
                                    <List.List>
                                        {user.profile.ngMaterials.map((value, index) => {
                                            return <List.Item>{value}</List.Item>
                                        })}
                                    </List.List>

                                </List.Item>
                            ) : null)
                            : null}
                    </List.Item>
                </List>
            </div>
        )
        }else{
            detail = <Button>없는 유저입니다.</Button>
        }
        return detail;
    }
render() {
    var user = this.state.user;
    var currentUser = this.state.currentUser;
    let detail; //include('userProfileDetail',{user: user,currentUser:currentUser,moment:moment})
    let blockPage;
    let reportedConent;
    let calendar_edit;
    let calendar = user!==null?<BigCalendar onChange={this.onDateClickChange} calendar={user.profile.calendar} value={this.state.date} />:null
    if (typeof(currentUser) === 'object'&&!Array.isArray(currentUser)&&currentUser !== null&&user!==null) {
            reportedConent =<UserReport user={user._id}/>;
            if(this.state.isReported){
                reportedConent =<div>
                    <span>신고하신 유저입니다.</span>
                </div>
            }
            if (currentUser.blockList.userList.some(blockUser => blockUser.content === user._id)) {
                blockPage = <div>
                    <span>차단된 유저입니다.</span>
                    <Button onClick={()=> this.removeBlockUser(user.userName)}>해제하기</Button>
                </div>
                detail = null;
                calendar = null;
            } else {
                if (currentUser.userEmail !== user.userEmail) {
                    blockPage = <Button onClick={()=> this.addBlockUser(user.userName)}>차단하기</Button>
                }
                detail = this.getProfielDetail(user, currentUser);
            }
            if( currentUser.userEmail === user.userEmail){
                reportedConent = null;
                calendar_edit = <List.Content><Button as={Link} to={`/user/${user.userName}/calendar/`}>일정 편집</Button></List.Content>
            }
    } else {
        detail = this.getProfielDetail(user, currentUser);
    }
    return (
        <div>
            <h1>{user !== null ? user.userName : ""}의 마이페이지</h1>
            <div>
                {reportedConent}
                {blockPage}
            </div>
            <div>
                {detail}
                {/* <span>{user ? `Hello ${user}` : 'Hello World'}</span> */}
            </div>
            <div className="calendar_container">
                {calendar_edit}
                {calendar}
            </div>
        </div>
    );
}
}

export default Profile;


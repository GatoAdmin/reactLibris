import React,{Component} from 'react';
import axios from 'axios';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import Moment from 'react-moment';
import './style.css';

class Profile extends Component {  
  constructor(props) {
    super(props);
    this.state = {
        user:null,
        currentUser:null,
        date: new Date()
    };
}
  componentDidMount() {      
  axios.post(window.location.href)
       .then(res=>this.setState({user:res.data.user, currentUser:res.data.currentUser }))
       .catch(function (error) {
         console.log(error);
       });
       
       this.forceUpdate();
}

onDateClickChange = date=>this.setState({date})

getProfielDetail(user, currentUser){
    let quillViewer;//include('../quill-viewer',{context: user.profile.introduction})
    let quillEdit;//include('../quill-view-editor',{context: user.profile.introduction})
    let editIntro;
    let edit;    
    let detail;
    if(currentUser!=null){
        if(currentUser.userEmail === user.userEmail ){
            editIntro= (<div id="form-container" class="container">
                    <form method="POST" action={"/user/"+user.userName+"/introudtion/save"} onsubmit={this.convertQuill()}>
                        <input name="article" type="hidden"/>
                        {quillEdit}
                        <button>소개글 수정</button>
                    </form>
                </div>)
            }else{
                editIntro= quillViewer
        }
    }else{
        editIntro= quillViewer
    }
     
    if(currentUser != null ){
        if(currentUser.userEmail === user.userEmail )
           edit= <ul><button type="button" onclick={`location.href='/user/'${user.userName}'/edit/'`}>프로필 편집</button></ul>
        }
    }
    detail =
    <div>
        <div className="profileImage">이미지</div>
        <ul class="profile">
        <li>
            <span>소개글 : 
                <div class="quill-box"style="width: 80%; margin-left: 10%; ">
                    {edit}
                </div>
            </span>
        </li>
        <li>
            <span>가입일 : <Moment format='YYYY-MM-DD'>{user.created}</Moment></span>
        </li>
        <li>
            {edit}
        </li>
        
        <li class="contacts">
            연락방법:
            <ul>
            {user.profile.contacts.forEach((value,index)=>{
                if(value.contactType =='twitter'){
                    <li>
                        <a href="https://twitter.com/{ value.contact ">
                            <img class="contact_type_icon twitter" sizes="192x192" width="30" src="https://abs.twimg.com/responsive-web/web/icon-ios.8ea219d4.png" />
                            {value.contact }
                        </a>
                    </li>
                } else if(value.contactType=='email') {
                    <li>
                        <img class="contact_type_icon email" sizes="30x30" width="30" src="https://thumbs.dreamstime.com/b/email-icon-isolated-white-background-open-envelope-pictogram-line-mail-symbol-website-design-app-ui-vector-illustration-106510001.jpg" />
                        { value.contact }
                    </li>
                /* }else if(value.contactType=='디스코드'){
                    <li>
                        <a href="https://twitter.com/{ value.contact ">
                            <img class="contact_type_icon twitter" sizes="30x30" width="30" src="https://wikis.krsocsci.org/images/d/de/%EB%94%94%EC%8A%A4%EC%BD%94%EB%93%9C%EC%95%84%EC%9D%B4%EC%BD%98.png" />
                            { value.contact 
                        </a>
                    </li> 
                } else if(value.contactType=='카카오톡 톡방') {
                    <li>
                        <a href="https://twitter.com/{ value.contact ">
                            <img class="contact_type_icon kakaotalk_url" sizes="30x30" width="30" src="https://image.flaticon.com/icons/svg/2111/2111466.svg" />
                            { value.contact 
                        </a>
                    </li>
                } else if(value.contactType=='kakaotalk') {
                    <li>
                        <!-- <a href="https://twitter.com/{ value.contact "> -->
                        <img class="contact_type_icon kakaotalk" sizes="30x30" width="30" src="https://image.flaticon.com/icons/svg/2111/2111466.svg" />
                        { value.contact 
                        <!-- </a> -->
                    </li>*/
                } else if(value.contactType=='telegram') {
                    <li>
                        <a href="https://telegram.me/{ value.contact ">
                            <img class="contact_type_icon telegram" sizes="30x30" width="30" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/600px-Telegram_logo.svg.png" />
                            {value.contact} 
                        </a>
                    </li>
                } else if(value.contactType=='instagram') {
                    <li>
                        <a href="https://www.instagram.com/{ value.contact /?hl=ko">
                            <img class="contact_type_icon instagram" sizes="30x30" width="30" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1200px-Instagram_logo_2016.svg.png" />
                            {value.contact}
                        </a>
                    </li>
                }
            })}
            </ul>
        </li>
    </div>
        <li class="rpg_info">
            if(user.profile.preferPlayStyle.playTypes.length > 0 ||user.profile.preferPlayStyle.canConditions.length > 0 ){
            <ul>
                <li>선호하는 플레이 스타일</li>
            if (user.profile.preferPlayStyle.playTypes != undefined && user.profile.preferPlayStyle.playTypes != null){
                 user.profile.preferPlayStyle.playTypes.forEach((value,index)=>{
                    <li>{value}</li> 
                }) 
            }
            if (user.profile.preferPlayStyle.canConditions != undefined &&user.profile.preferPlayStyle.canConditions != null){
                 user.profile.preferPlayStyle.canConditions.forEach((value,index)=>{
                    <li>{value}</li> 
                }) 
            }
            </ul>
            }
            if (user.profile.haveRules != undefined &&user.profile.haveRules != null){
            <ul>
                <li>가지고 있는 룰</li>
                <ul>
                     user.profile.haveRules.forEach((value,index)=>{
                            <!-- <li>룰 : {value.rule} </li>  -->
                            <li>룰 : 
                                if(value.rule_kind == "ETC"){
                                    { value.rule  
                                }else if(value.rule_kind != null && value.rule_kind != undefined) {
                                    { masterTagRules.find(tag => tag._id.equals( value.rule_tag)).tag }
                                }
                            </li> 
                            <!-- <if(value.supplements.length > 0){
                                <ul>
                                    <li>서플리먼트</li>
                                 value.supplements.forEach((supplement,s_index)=>{
                                    <li>=supplement.title (<=supplement.language)</li>
                                <}) 
                                </ul>
                        } -->
                    }) 
                </ul>
            </ul> 
            }
            if (user.profile.canMasterRules != undefined &&user.profile.canMasterRules != null){            
            <ul>
                <li>마스터링 가능</li>
               <ul>
                     user.profile.canMasterRules.forEach((value,index)=>{
                            <li>룰 : 
                                if(value.rule_kind == "ETC"){
                                    { value.rule  
                                }else {
                                    { masterTagRules.find(tag => tag._id.equals( value.rule_tag)).tag 
                                }
                            </li> 
                             if(user.profile.canMasterScenarios != undefined && user.profile.canMasterScenarios != null){  
                                <ul>
                                 user.profile.canMasterScenarios.forEach((scenario,s_index)=>{
                                    if(scenario.rule_kind == "ETC" && value.rule_kind == "ETC"){
                                         if( scenario.rule.equals(value.rule ) ){
                                            
                                            <li>시나리오 : =scenario.title | =scenario.author 작</li>
                                        }
                                    }else if( (value.rule_tag!="" && value.rule_tag!=undefined) && (scenario.rule_tag !=undefined && scenario.rule_tag!="")){  
                                       if(value.rule_tag.equals(scenario.rule_tag)){
                                            <li>시나리오 : =scenario.title | =scenario.author 작</li>
                                        }
                                    }
                                    }) 
                                </ul>
                                }
                    }) 
                </ul>
            </ul>
            }
            if (user.profile.preferRules != undefined &&user.profile.preferRules != null){
            <ul>
                <li>선호하는 룰</li>
                <ul>
                     user.profile.preferRules.forEach((value,index)=>{
                        <li>룰 : 
                            if(value.rule_kind == "ETC"){
                                { value.rule  
                            }else {
                                { masterTagRules.find(tag => tag._id.equals( value.rule_tag)).tag 
                            }
                        </li> 
                            <!-- < if(user.profile.wishfulScenarios != undefined &&user.profile.wishfulScenarios != null){ -->
                                <!-- < if(user.profile.preferRules.find(scenario=>scenario.rule==value.title) != undefined ){
                                <ul>
                                    <li>시나리오</li>
                                    < user.profile.canMasterScenarios.forEach((scenario,s_index)=>{
                                        < if( scenario.rule == value.title ){
                                            <li>< scenario.title |< supplement.author 작</li>
                                        <}
                                    <}) 
                                </ul>
                                <} -->
                            <!-- <} -->
                    }) 
                </ul>
            </ul> 
            }
            if (user.profile.wentToScenarios != undefined &&user.profile.wentToScenarios != null){
           
            <ul>
                <li>다녀온 시나리오</li>
                <ul>
                     user.profile.wentToScenarios.forEach((value,index)=>{
                            <li>{value.title  | { value.author  작</li> 
                            <!-- < if(user.profile.wishfulScenarios != undefined &&user.profile.wishfulScenarios != null){ -->
                                <!-- < if(user.profile.preferRules.find(scenario=>scenario.rule==value.title) != undefined ){
                                <ul>
                                    <li>시나리오</li>
                                    < user.profile.canMasterScenarios.forEach((scenario,s_index)=>{
                                        < if( scenario.rule == value.title ){
                                            <li>< scenario.title |< supplement.author 작</li>
                                        <}
                                    <}) 
                                </ul>
                                <} -->
                            <!-- <} -->
                    }) 
                </ul>
            </ul>
            }
            if (user.profile.ngMaterials != undefined &&user.profile.ngMaterials != null){
                if(user.profile.ngMaterials.length >0){
            <ul>
                <li>NG 소재</li>
                <ul>
                     user.profile.ngMaterials.forEach((value,index)=>{
                        <li>{value  </li> 
                    })
                </ul>
          
            </ul>
            }
            }


        </li>
    </ul>
    
</div>
}
  render() {
    const user = this.state.user;
    const currentUser = this.state.currentUser;
    let detail; //include('userProfileDetail',{user: user,currentUser:currentUser,moment:moment}) 
    let blockPage;

      if (currentUser != null) {
          if (currentUser.blockList.userList.some(blockUser => blockUser.content.equals(user._id))) {
              blockPage = <div>
                  <span>차단된 유저입니다.</span>
                  <button onclick="removeBlockUser('{user.userName}')">해제하기</button>
              </div>
              detail = null;
          } else {
              if (currentUser.userEmail != user.userEmail) {
                  blockPage = <button onclick="addBlockUser('{user.userName}')">차단하기</button>
              }
          }
        }

    return (
        <div>

<h2>{user!=null?user.userName:""}의 마이페이지</h2>
        <div>
            {blockPage}
        </div>
        <div class="calendar_container">
            <Calendar onChange={this.onDateClickChange} value={this.state.date}/>
        </div>
      <div>
        <h1>
        Profile
      </h1>
      <span>{user ? `Hello ${user}` : 'Hello World'}</span>
      </div>
        </div>
    );

  }
}

export default Profile;


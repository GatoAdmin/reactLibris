import React from 'react';
import axios from 'axios';
import QuillEditor from '../Quill/react-quill-editor';
import {Link} from 'react-router-dom';
import { Grid, Card, Icon, Form, Rating,Image, Table, Button, Label, Select, Dropdown,Checkbox, Input, Modal } from 'semantic-ui-react'
import '../../index.css';

const DefaultImg = 'https://react.semantic-ui.com/images/wireframe/image.png'
class Maker extends React.Component {    
    constructor(props) {
        super();
        this.state = {
            chronicle_id: "",
            current_user: props.currentUser,
            is_open_setting:false,
            is_open_carte_save_check:false,
            is_check_paid: true,
            is_agree_paid: false,
            article_id: null,
            master_tags: [],
            result:null,
            title:"",
            title_short:"",
            rating:0,
            background_tag:"",
            genre_tags:[],
            sub_tags:[],
            rule:"",
            is_agree_comment:true,
            orpgPredictingTime: 0,
            trpgPredictingTime:0,
            master_difficulty:1,
            player_difficulty:1,
            is_paid:false,
            price:0,    
            capacity_min:0,
            capacity_max:0,
            multer_image:DefaultImg,
            set_uploaded_img:null,
        };
    }

    componentDidMount() {  
        // var urlStringLast  = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        // if(urlStringLast!="make"){
        //     this.setState({chronicle_id:urlStringLast});
        // }
        let getArticle = () => {
            axios.post(window.location.href)
                .then(res => {
                    var newArticle = res.data.result.versions.length>0?false:true;
                    console.log(res.data.result);
                    this.setState({
                        is_open_setting:newArticle,
                        master_tags: res.data.masterTags,
                        result:res.data.result,
                        article_id:res.data.result._id,
                        title:res.data.result.title,
                        title_short:res.data.result.titleShort,
                        rule: newArticle?"":res.data.result.rule,//res.data.masterTags.find(ts=>ts.name==="rule").tags.find(t=>t.tag===res.data.result.ruleTag)._id ,
                        background_tag:newArticle?"":res.data.result.carte.backgroundTag,//res.data.masterTags.find(ts=>ts.name==="background").tags.find(t=>t.tag===res.data.result.carte.backgroundTag)._id,
                        genre_tags:newArticle?[]:res.data.result.carte.genreTags,
                        sub_tags:newArticle?[]:res.data.result.carte.subTags,
                        rating: newArticle?0:res.data.result.carte.rating,
                        is_agree_comment:res.data.result.isAgreeComment,
                        orpgPredictingTime:newArticle?0:res.data.result.carte.orpgPredictingTime,
                        trpgPredictingTime:newArticle?0:res.data.result.carte.trpgPredictingTime,
                        master_difficulty:newArticle?0:res.data.result.carte.masterDifficulty,
                        player_difficulty:newArticle?0:res.data.result.carte.playerDifficulty,
                        capacity_min:newArticle?0:res.data.result.carte.capacity.min,
                        capacity_max:newArticle?0:res.data.result.carte.capacity.max,
                        is_paid:!res.data.result.isFree,
                        price:res.data.result.price,    
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticle();
    }

    changeCapacityType=(e, data)=>{
        e.preventDefault();
        // var obj = e.target;
        var multiple_capacity = document.querySelector('#multiple_capacity');

        if (data.checked) {
            multiple_capacity.classList.remove('hidden');
        } else {
            multiple_capacity.classList.add('hidden');
        }
    }

    checkPaid= (e,data) => {
        e.preventDefault();
        var obj = data;
        var piad_box = document.querySelector('#paid_box');
        var agree_paid = document.querySelector('#agree_paid');
        var price_manage = document.querySelector('#price_manage');
        if (obj.checked) {
            var agree = this.state.current_user.agreeList.paidContent.agree;
            if (agree === true) {
                agree_paid.classList.add('hidden');
                price_manage.classList.remove('hidden');
                this.setState({ is_agree_paid: true });
            }
            this.setState({ is_check_paid: true });
            piad_box.classList.remove('hidden');
            // user의 유료판매 정책 동의 여부를 확인하여 agree_paid를 숨기고, price_manage를 보일것
        } else {
            this.setState({ is_check_paid: false });
            piad_box.classList.add('hidden');
        }
    }

    checkAgreePaid = (e,data) => {
        e.preventDefault();
        var obj = data;
        var agree_paid = document.querySelector('#agree_paid');
        var price_manage = document.querySelector('#price_manage');
        if (obj.checked) {
            this.setState({ is_agree_paid: true },()=>{
                console.log(this.state.is_agree_paid)
                price_manage.classList.remove('hidden');
                agree_paid.classList.add('read-only');
            })
        }
        else {
            var msg = "해당 내용에 동의하지 않으시면 유료 발행을 하실 수 없습니다. 동의를 취소하겠습니까?";
            if (window.confirm(msg)) {
                this.setState({ is_agree_paid: false },()=>{
                    price_manage.classList.add('hidden');
                })
            }
        }

    }

    convertQuill() {
        var quillContents = this.state.article;
        var about = document.querySelector('input[name=article]');
        about.value = JSON.stringify(quillContents);
        return true;
      };
    changeQuill=(e)=>{
          console.log(e);
          this.setState({article:e});
      }

    onChangeForm=(e, data)=>{
        this.setState({[data.name]: data.value });
    }

    changeImage=(e)=>{
        this.setState({multer_image:URL.createObjectURL(e.target.files[0]),
            set_uploaded_img:e.target.files[0]});
    }

    getDetail() {
        var component;
        let last = this.state.result!=null?this.state.result.lastVersion:null;
        console.log(last !== undefined&&last!==null?last.content[0]:null)
        component = (
            <div id="editor-form-container" className="container">
                <Form method="POST" id='edit-form' action={`/scenarios/edit/save/${this.state.article_id }`} onSubmit={()=>this.convertQuill()}>
                    <Form.Input size="massive" type="text"  name="title"  value={this.state.title} onChange={this.onChangeForm} placeholder="제목을 입력해 주세요"/>
                    <Form.Input type="text"  name="title_short" value={this.state.title_short} onChange={this.onChangeForm} placeholder="시나리오 줄임말을 스페이스바 없이 입력해주세요"/>
                    <div className="row form-group">
                        <label htmlFor="article">내용</label>
                        <input name="article" type="hidden" />
                        {last !== undefined&&last!==null?<QuillEditor changeQuill={this.changeQuill} setValue={last.content[0]}  />:null}
                    </div>
                    {/* <Button className="btn btn-primary" color="purple" type="submit" name="save">저장</Button>
                    <Button className="btn btn-primary" color="purple" type="submit" name="publication">발행</Button> */}
                </Form >
            </div >
        );
        return component;
    }

    getHeader(){
        var component = (
            <header>
                <nav className="menu-wrapper editor-menu">
                    <Button className="btn btn-primary" type="button" onClick={()=>this.props.history.goBack()}><Icon name="angle left" fitted/></Button>
                    {this.state.result!==null?this.getModal():null}
                    <Button className="btn btn-primary" form='edit-form' color="purple" type="submit" name="save">저장</Button>
                    <Button className="btn btn-primary" form='edit-form' color="purple" type="submit" name="publication">발행</Button>
                </nav>
            </header>
        );
        return component;
    }

    getModal(){
        
        var masterTags = this.state.master_tags;
        var select_rule;
        var select_genre;
        var select_background;
        var select_sub_tags;
        if(masterTags.length>0){
            console.log(this.state.rule);
            var ruleTags = masterTags.find(tags => tags.name === "rule");
            select_rule = ruleTags.tags.map((tag, id) => {
                        return { value: tag._id, key: id.toString(), text:tag.tag };
                    })
            var genreTags = masterTags.find(tags => tags.name === "genre");
            select_genre = genreTags.tags.map((tag, id) => {
                return { value: tag._id, key: id.toString(), text:tag.tag };
            })
            var backgroundTags = masterTags.find(tags => tags.name === "background");
            select_background = backgroundTags.tags.map((tag, id) => {
                return { value: tag._id, key: id.toString(), text:tag.tag };
            })
            var subTags = masterTags.find(tags => tags.name === "subTag");
            select_sub_tags = subTags.tags.map((tag, id) => {
                return { value: tag._id, key: id.toString(), text:tag.tag };
            })
        }

        return(<Modal onClose={()=>this.setOpenSetting(false)} onOpen={()=>this.setOpenSetting(true)} open={this.state.is_open_setting} closeIcon trigger={<Button><Icon name="setting" fitted/></Button>}>
        <Modal.Header>설정</Modal.Header>
        <Modal.Content>
            <Form id="setting-form" method="POST" onSubmit={(e)=>this.sendCarte(e)} >
                <Grid>
                    <Grid.Row>
                        <Grid.Column  width={4}>
                            <Form.Input type="file" onChange={(e)=>this.changeImage(e)} className="img-rounded"/>
                        </Grid.Column>
                        <Grid.Column  width={12}>
                            <Image src={this.state.multer_image} alt="upload-image" size='small' wrapped label="업로드 이미지"/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><Label className="border-none" size="big"  basic>사용 룰</Label></Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Select 
                                name="rule"
                                // onChange={(e,data)=>{console.log(data.value)}}"5e71d50eafdc0818e8eccadc"
                                onChange={(e,data)=>this.onScenarioSelected(e,data)}
                                options={select_rule}
                                value={this.state.rule!==null?this.state.rule:null}
                                placeholder='사용 룰'/>  
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Label className="border-none" size="large" basic>이 시나리오는 가변적인 인원수에 대응할 수 있습니다.</Label><Checkbox name="is_multiple_capacity" value="check" onChange={(e,data)=>this.changeCapacityType(e,data)} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><Label className="border-none"  size="big" basic>필요 인원수</Label></Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Group className="text-left" inline>       
                                <Form.Input className="search-number " type="number" name="capacity_min" onChange={(e,data)=>this.onScenarioChange(e,data)} value={this.state.capacity_min} min={1} placeholder="최소 인원수"/>
                                <span id="multiple_capacity" className="hidden"><Form.Input className="search-number search-number-right" label="~" type="number" name="capacity_max" onChange={()=>this.onScenarioChange} defalutValue={this.state.capacity_max} min={1} placeholder="최대 인원수"/></span>
                            </Form.Group>  
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><Label className="border-none" size="big" basic>플레이 시간</Label></Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Group className="text-left" inline>
                                <Form.Input className="search-number " type="number" name="predicting_time" onChange={(e,data)=>this.onScenarioChange(e,data)} min={0} value={this.state.orpgPredictingTime!==null?this.state.orpgPredictingTime:this.state.trpgPredictingTime} placeholder="시간"/>
                                {/* <Form.Input className="search-number search-number-right" label="~" type="number" name="predicting_time_max" onChange={(e,data)=>this.onScenarioChange(e,data)} min={0} placeholder="최대"/> */}
                            </Form.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><Label className="border-none" size="big" basic>마스터 난이도</Label></Grid.Column>
                        <Grid.Column width={12}>
                            <Rating  name="master_difficulty" icon="star" maxRating={5} size="massive" onRate={(e,data)=>this.onScenarioRating(e,data)} rating={this.state.master_difficulty} clearable/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><Label className="border-none" size="big" basic>플레이어 난이도</Label></Grid.Column>
                        <Grid.Column width={12}>
                            <Rating name="player_difficulty" icon="star" maxRating={5} size="massive" onRate={(e,data)=>this.onScenarioRating(e,data)} rating={this.state.player_difficulty} clearable/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><Label className="border-none" size="big" basic>배경</Label></Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Select 
                                    name="background_tag"
                                    onChange={(e,data)=>this.onScenarioSelected(e,data)}
                                    options={select_background}
                                    value={this.state.background_tag}
                                    placeholder='시나리오 배경'/> 
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><Label className="border-none" size="big" basic>장르</Label></Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Select 
                                    name="genre_tags"
                                    multiple
                                    onChange={(e,data)=>this.onScenarioSelected(e,data)}
                                    options={select_genre}
                                    value={this.state.genre_tags}
                                    placeholder='시나리오의 장르'/> 
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}><Label className="border-none" size="big" basic>분위기</Label></Grid.Column>
                        <Grid.Column width={12}>
                            <Form.Select 
                                    name="sub_tags"
                                    multiple
                                    onChange={(e,data)=>this.onScenarioSelected(e,data)}
                                    options={select_sub_tags}
                                    value={this.state.sub_tags}
                                    placeholder='분위기'/> 
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}><Label className="border-none" size="large" basic>댓글 허용</Label><Checkbox name="is_agree_comment" defaultChecked value="check"/></Grid.Column>
                        <Grid.Column width={8}><Label className="border-none" size="large" basic>유료 발행</Label><Checkbox name="is_paid" value="check" onChange={this.checkPaid} checked={this.state.is_check_paid}/></Grid.Column>
                    </Grid.Row>
                    <Grid.Row id="paid_box">
                        <Grid.Column>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        {/* <!-- 약관 페이지가 완성되면 이곳에 패널로 추가하여 보여줄 것 --> */}
                                        <Label className="border-none" size="large" basic>유료 발행시 가격을 수정하거나 게시물을 삭제할 수 없습니다. 동의하십니까?<Link>(자세히 알아보기)</Link></Label>
                                        <Checkbox id="agree_paid" label="" name="is_agree_paid" value="check" readOnly={this.state.is_agree_paid} onChange={this.checkAgreePaid} checked={this.state.is_agree_paid}/>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row id="price_manage" className="hidden " >
                                    <Grid.Column width={4}><Label className="border-none" size="big" basic>발행 가격(<Icon fitted name="sticky note"/>)</Label></Grid.Column>
                                    <Grid.Column width={12}><Form.Input name="price" type="number" min={1} placeholder="가격"/></Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Form >
        </Modal.Content>
        <Modal.Actions>
            <Button color='black' onClick={() => this.setOpenSetting(false)}>닫기</Button>
            <Button
                type="submit"
                form="setting-form"
                content="저장"
                labelPosition='right'
                icon='checkmark'
                // onClick={() => this.setOpenSetting(false)}
                positive
            />
        </Modal.Actions>
        <Modal 
          centered
          onClose={() => this.setCarteSaveCheckOpen(false)}
          open={this.state.is_open_carte_save_check}
          size='small'
        >
          <Modal.Header>설정 저장</Modal.Header>
          <Modal.Content>
            <p>설정이 저장되었습니다.</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              icon='check'
              content='확인'
              onClick={() => this.setCarteSaveCheckOpen(false)}
            />
          </Modal.Actions>
        </Modal>
    </Modal>);
    }

    setOpenSetting(bool){
        this.setState({is_open_setting:bool});
    }

    setCarteSaveCheckOpen(bool){
        this.setState({is_open_carte_save_check:bool});
    }
    onScenarioChange = (e, data) => {
        console.log(data)
        this.setState({
            [data.name]: data.value
        }
        );
    }
    
    onScenarioRating = (e, data) => {
        console.log(this.state[data.name])
        this.setState({
            [data.name]: data.rating
        }
        );
    }

    onScenarioSelected = (e, data) => {
        this.setState({
            [data.name]: data.value
        }
        );
    }

    sendCarte(e,data){
        var formData = new FormData(e.target);
        formData.append("rule",this.state.rule);
        formData.append("master_difficulty",this.state.master_difficulty);
        formData.append("player_difficulty",this.state.player_difficulty);
        formData.append("background_tag",this.state.background_tag);       
        formData.append("imageName","multer-image-"+Date.now());
        // formData.append("imageData",this.state.setUploadedImg);
        // formData.append("genre_tags",this.state.genre_tags);
        // formData.append("sub_tags",this.state.sub_tags);

        var object = {};
        for (var pair of formData.entries()) { object[pair[0]] = pair[1]; console.log(pair[0]+ ', ' + pair[1]); }
        //{headers: {'Content-Type': 'multipart/form-data' }}
        object.genre_tags = this.state.genre_tags;
        object.sub_tags = this.state.sub_tags;
        object.imageData = this.state.set_uploaded_img;

        axios.post(`/scenarios/edit/setting/save/${this.state.article_id }`,{data:JSON.stringify(object)})
        .then((res)=>{if(res.data.success){
            console.log("설정이 저장되었습니다.");
            this.setCarteSaveCheckOpen(true);
            // console.log(res.data.document.imageData);
            // return <Redirect to={`/news/chronicle/`}/>
        }})
        .catch((err)=>{console.log(err);});
        return true;
    }

    render(){
        // var currentUser = this.props.currentUser;
        // var result = this.state.result;
        //action={`/scenarios/edit/setting/save/${this.state.article_id }`}
        var component = (<div>
            {this.getHeader()}
            {this.getDetail()}
        </div>
            );

        return component;
    }
}

export default Maker;

import React from 'react';
import axios from 'axios';
import QuillEditor from '../Quill/react-quill-editor';
import {Link} from 'react-router-dom';
import { Grid, Card, Icon, Form, Rating,Image, Table, Button, Label, Select, Dropdown,Checkbox, Input, Modal } from 'semantic-ui-react'
import '../../index.css';

class Maker extends React.Component {    
    constructor(props) {
        super();
        this.state = {
            chronicle_id: "",
            current_user: props.currentUser,
            is_open_setting:false,
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
            masterDifficulty:0,
            playerDifficulty:0,
            is_paid:false,
            price:0,    
            capacity_min:0,
            capacity_max:0,
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
                    this.setState({
                        is_open_setting:newArticle,
                        master_tags: res.data.masterTags,
                        result:res.data.result,
                        article_id:res.data.result._id,
                        title:res.data.result.title,
                        title_short:res.data.result.titleShort,
                        rule: newArticle?"":res.data.result.rule,
                        rating: newArticle?0:res.data.result.carte.rating,
                        is_agree_comment:res.data.result.isAgreeComment,
                        orpgPredictingTime:newArticle?0:res.data.result.carte.orpgPredictingTime,
                        trpgPredictingTime:newArticle?0:res.data.result.carte.trpgPredictingTime,
                        masterDifficulty:newArticle?0:res.data.result.carte.masterDifficulty,
                        playerDifficulty:newArticle?0:res.data.result.carteplayerDifficulty,
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

    getDetail() {
        var component;
        var masterTags = this.state.master_tags;
        var select_rule;
        var select_genre;
        var select_background;
        var select_sub_tags;
        let last = this.state.result!=null?this.state.result.lastVersion:null;
        if(masterTags.length>0){
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
        
        component = (
            <div id="form-container" className="container">
                <Form method="POST" action={`/scenarios/edit/save/${this.state.article_id }`} onSubmit={()=>this.convertQuill()}>
                    <Form.Input size="massive" type="text"  name="title"  value={this.state.title} onChange={this.onChangeForm} placeholder="제목을 입력해 주세요"/>
                    <Form.Input type="text"  name="title_short" value={this.state.title_short} onChange={this.onChangeForm} placeholder="시나리오 줄임말을 스페이스바 없이 입력해주세요"/>
                    <div className="row form-group">
                        <label htmlFor="article">내용</label>
                        <input name="article" type="hidden" />
                        <QuillEditor changeQuill={this.changeQuill} setValue={last !== undefined&&last!==null?last.content:null}  />
                    </div>
                    <Button className="btn btn-primary" color="purple" type="submit" name="save">저장</Button>
                    <Button className="btn btn-primary" color="purple" type="submit" name="publication">발행</Button>
                </Form >
            </div >
        );
        return component;
    }

    setOpenSetting(bool){
        this.setState({is_open_setting:bool});
    }

    render(){
        var currentUser = this.props.currentUser;
        var masterTags = this.state.master_tags;
        var result = this.state.result;
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
        var component = (<div>
            <Modal onClose={()=>this.setOpenSetting(false)} onOpen={()=>this.setOpenSetting(true)} open={this.state.is_open_setting} closeIcon trigger={<Button><Icon name="setting" fitted/></Button>}>
                <Modal.Header>설정</Modal.Header>
                <Modal.Content>
                    <Form id="setting-form" method="POST" action={`/scenarios/edit/setting/save/${this.state.article_id }`} >
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={4}><Label className="border-none" size="big"  basic>사용 룰</Label></Grid.Column>
                                <Grid.Column width={12}>
                                    <Dropdown
                                        selection 
                                        name= "rule"
                                        // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                        options={select_rule}
                                        defalutValue={this.state.rule!==null?this.state.rule:null}
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
                                        <Form.Input className="search-number " type="number" name="capacity_min" onChange={()=>this.onScenarioSearchChange} defalutValue={this.state.capacity_min} min={1} placeholder="최소 인원수"/>
                                        <span id="multiple_capacity" className="hidden"><Form.Input className="search-number search-number-right" label="~" type="number" name="capacity_max" onChange={()=>this.onScenarioSearchChange} defalutValue={this.state.capacity_max} min={1} placeholder="최대 인원수"/></span>
                                    </Form.Group>  
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={4}><Label className="border-none" size="big" basic>플레이 시간</Label></Grid.Column>
                                <Grid.Column width={12}>
                                    <Form.Group className="text-left" inline>
                                        <Form.Input className="search-number " type="number" name="filter_time_min" onChange={()=>this.onScenarioSearchChange} min={0} placeholder="최소"/>
                                        <Form.Input className="search-number search-number-right" label="~" type="number" name="filter_time_max" onChange={()=>this.onScenarioSearchChange} min={0} placeholder="최대"/>
                                    </Form.Group>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={4}><Label className="border-none" size="big" basic>마스터 난이도</Label></Grid.Column>
                                <Grid.Column width={12}>
                                    <Rating  name="master_difficulty" icon="star" defaultRating={1} maxRating={5} size="massive" clearable/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={4}><Label className="border-none" size="big" basic>플레이어 난이도</Label></Grid.Column>
                                <Grid.Column width={12}>
                                    <Rating name="player_difficulty" icon="star" defaultRating={1} maxRating={5} size="massive" clearable/>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={4}><Label className="border-none" size="big" basic>배경</Label></Grid.Column>
                                <Grid.Column width={12}>
                                    <Form.Select 
                                            name= "background_tag"
                                            // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                            options={select_background}
                                            // value={this.state.filter_rule}
                                            placeholder='시나리오 배경'/> 
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={4}><Label className="border-none" size="big" basic>장르</Label></Grid.Column>
                                <Grid.Column width={12}>
                                    <Form.Select 
                                            name= "genre_tags"
                                            multiple
                                            // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                            options={select_genre}
                                            // value={this.state.filter_rule}
                                            placeholder='시나리오의 장르'/> 
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={4}><Label className="border-none" size="big" basic>분위기</Label></Grid.Column>
                                <Grid.Column width={12}>
                                    <Form.Select 
                                            name= "sub_tags"
                                            multiple
                                            // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                            options={select_sub_tags}
                                            // value={this.state.filter_rule}
                                            placeholder='분위기'/> 
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={8}><Label className="border-none" size="large" basic>댓글 허용</Label><Checkbox name="is_agree_comment" defaultChecked value="check"/></Grid.Column>
                                <Grid.Column width={8}><Label className="border-none" size="large" basic>유료 발행</Label><Checkbox name="is_paid" value="check" defaultChecked onChange={this.checkPaid} checked={this.state.is_check_paid}/></Grid.Column>
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
            </Modal>
            {this.getDetail()}
        </div>
            );

        return component;
    }
}

export default Maker;

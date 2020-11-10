import React from 'react';
import axios from 'axios';
import QuillEditor from '../Quill/react-quill-editor';
import {Link} from 'react-router-dom';
import { Grid, Card, Icon, Form, Rating,Image, Table, Button, Label, Select, Dropdown,Checkbox, Input, Modal } from 'semantic-ui-react'
import '../../index.css';

class Maker extends React.Component {    
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            chronicle_id: "",
            current_user: props.currentUser,
            is_open_setting:true,
            is_check_paid: true,
            is_agree_paid: false,
            master_tags: [],
        };
    }

    componentDidMount() {  
        var urlStringLast  = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        if(urlStringLast!="make"){
            this.setState({chronicle_id:urlStringLast});
        }
        let getTags = () => {
            axios.post('/masterTags')
                .then(res => {
                    this.setState({
                        master_tags: res.data.masterTags
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getTags();
    }

    changeCapacityType=(e, data)=>{
        e.preventDefault();
        // var obj = e.target;
        var multiple_capacity = document.querySelector('#multiple_capacity');

        if (data.checked) {
            multiple_capacity.classList.remove('hidden');
        console.log(multiple_capacity);
        } else {
            multiple_capacity.classList.add('hidden');
        console.log(multiple_capacity);
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

    getDetail() {
        var component;
        var masterTags = this.state.master_tags;
        var selectRule;
        var selectBackground;        
        var selectGenres;
        var selectTags;
        var select_rule;
        var select_genre;
        var select_background;
        var select_sub_tags;
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
            selectRule = (
                <div className="form-group">
                    <label htmlFor="rule">기반 룰</label>
                    <select className="form-control is-select2-select" name="rule" tabIndex="-1">
                        <option value="" selectd="selected">-</option>
                        {masterTags.find(tags => tags.name === "rule").tags.map(function (tag, index) {
                            return <option value={tag._id} key={index}> {tag.tag} </option>
                        })}
                    </select>
                </div>
                );
            selectBackground= (
                <div className="form-group">
                    <label htmlFor="background_tag">시나리오의 배경</label>
                    <select className="form-control is-select2-select" name="background_tag" tabIndex="-1">
                        <option value="" selectd="selected">-</option>
                        {masterTags.find(tags => tags.name === "background").tags.map(function (tag, index) {
                            return < option value={tag._id} key={index}> {tag.tag} </option>
                        })}
                    </select>
                </div>
            );       
            selectGenres= (
                <div className="form-group">
                    <label htmlFor="genre_tags">장르</label>
                    <select className="form-control is-select2-select" name="genre_tags" tabIndex="-1" multiple="multiple">
                        <option value="" selectd="selected">-</option>
                        {masterTags.find(tags => tags.name === "genre").tags.map(function (tag, index) {
                            return < option value={tag._id} key={index}> {tag.tag} </option>
                        })}
                    </select>
                </div> 
            );
            selectTags= (
            <div className="form-group">
                <label htmlFor="sub_tags">태그</label>
                <select className="form-control is-select2-select" name="sub_tags" tabIndex="-1" multiple="multiple">
                    <option value="" selectd="selected">-</option>
                    {masterTags.find(tags => tags.name === "subTag").tags.map(function (tag, index) {
                        return < option value={tag._id} key={index}> {tag.tag} </option>
                    })}
                </select>
            </div> 
        );

        }
        var agreePaid = this.state.current_user!==null?this.state.current_user.agreeList.paidContent.agree:false;
        console.log(this.state.is_agree_paid);
        component = (
            <div id="form-container" className="container">
                <Form method="POST" action={`/scenarios/make/${this.state.chronicle_id }`} onSubmit={()=>this.convertQuill()}>
                    <Form.Input size="massive" type="text"  name="title"  placeholder="제목을 입력해 주세요"/>
                    <Form.Input type="text"  name="title_short"  placeholder="시나리오 줄임말을 스페이스바 없이 입력해주세요"/>
                    {/* <div>
                        <Checkbox name="is_multiple_capacity" label="이 시나리오는 가변적인 인원수에 대응할 수 있습니다."  value="check" onChange={(e,data)=>this.changeCapacityType(e,data)} />
                        <Form.Group>
                            <Form.Group inline>
                                <Form.Select 
                                        label='사용 룰'
                                        name= "rule"
                                        // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                        options={select_rule}
                                        // value={this.state.filter_rule}
                                        placeholder='사용 룰'/>  
                            </Form.Group> 
                            <Form.Group className="text-left" inline>       
                                <Form.Input className="search-number " type="number" name="capacity_min" onChange={()=>this.onScenarioSearchChange} min={1} label='필요 인원수' placeholder="최소 인원수"/>
                                <span id="multiple_capacity" className="hidden"><Form.Input className="search-number search-number-right" label="~" type="number" name="capacity_max" onChange={()=>this.onScenarioSearchChange} min={1} placeholder="최대 인원수"/></span>
                            </Form.Group>     
                            <Form.Group className="text-left" inline>
                                <Form.Input className="search-number " type="number" name="filter_time_min" onChange={()=>this.onScenarioSearchChange} min={0} label='시간' placeholder="최소"/>
                                <Form.Input className="search-number search-number-right" label="~" type="number" name="filter_time_max" onChange={()=>this.onScenarioSearchChange} min={0} placeholder="최대"/>
                            </Form.Group>
                        </Form.Group>
                    </div>
                    <Form.Group>
                        <Label>마스터 난이도</Label>
                        <Rating  name="master_difficulty" icon="star" defaultRating={1} maxRating={5} size="huge" clearable/>
                        
                        <Label>플레이어 난이도</Label>
                        <Rating name="player_difficulty" icon="star" defaultRating={1} maxRating={5} size="huge" clearable/>
                    </Form.Group>
                    <Form.Group className="text-left" inline>
                        <Form.Select 
                                label='배경'
                                name= "background_tag"
                                // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                options={select_background}
                                // value={this.state.filter_rule}
                                placeholder='시나리오 배경'/> 
                        <Form.Select 
                                label='장르'
                                name= "genre_tags"
                                multiple
                                // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                options={select_genre}
                                // value={this.state.filter_rule}
                                placeholder='시나리오의 장르'/> 
                        <Form.Select 
                                label='분위기'
                                name= "sub_tags"
                                multiple
                                // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                options={select_sub_tags}
                                // value={this.state.filter_rule}
                                placeholder='분위기'/> 
                    </Form.Group>    
                    <Form.Group>
                        <Checkbox label="댓글 허용" name="is_agree_comment" defaultChecked value="check"/>
                        <Checkbox label="유료 발행" name="is_paid" value="check" defaultChecked onChange={this.checkPaid} checked={this.state.is_check_paid}/>
                    </Form.Group>
                    <div  id="paid_box">
                    <Form.Group>
                        {/* <!-- 약관 페이지가 완성되면 이곳에 패널로 추가하여 보여줄 것 --> */}
                       {/* <Checkbox id="agree_paid" label="유료 발행시 가격을 수정하거나 게시물을 삭제할 수 없습니다. 동의하십니까?" name="is_agree_paid" value="check" readOnly={this.state.is_agree_paid} onChange={this.checkAgreePaid} checked={this.state.is_agree_paid}/>
                        <Link>(자세히 알아보기)</Link>
                    </Form.Group>
                    <Form.Group inline >
                        <div id="price_manage" className="hidden background-color-main" >
                            <Form.Input label="발행 가격(두루마리)" name="price" type="number" min={1} placeholder="가격"/>
                        </div>
                    </Form.Group>
                    </div> */}
                   {/* <div className="row">
                         <div className="col-xs-4">
           <div className="img-rounded"></div>//썸네일 필요하지 않을까?
          <a className="change-link" href='#'>Change picture</a> 
        </div>  */}
                        {/* <div className="col-xs-8">
                            <div className="form-group">
                                <label htmlFor="title">제목</label>
                                <input className="form-control" name="title" type="text" placeholder="제목을 입력해주세요" />
                            </div>                    
                            <div className="form-group">
                                <label htmlFor="title_short">시나리오 줄임말</label>
                                <input className="form-control" name="title_short" type="text" placeholder="줄임말을 스페이스바 없이 입력해주세요" />
                            </div>
                            {selectRule}
                            <div className="form-group">
                                <label htmlFor="capacity_min">필요 인원수</label>
                                <input className="form-control size_3" name="capacity_min" type="number" min="1" title="필요 인원수" />
                                <span id="multiple_capacity" className="hidden">
                                    <span>~</span>
                                    <input className="form-control size_3" name="capacity_max" type="number" min="1" title="최대 인원수"/>
                                </span>  
                                <div>
                                <label htmlFor="is_multiple_capacity">이 시나리오는 가변적인 인원수에 대응할 수 있습니다.</label>
                                <input className="form-control" name="is_multiple_capacity" type="checkbox" value="check" onChange={this.changeCapacityType} />    
                                </div>
                            </div> 
                            <div className="form-group">
                                <div className="toggle toggle--time">
                                    <Button.Group size='large'>
                                        <Button>One</Button>
                                        <Button.Or />
                                        <Button>Three</Button>
                                    </Button.Group>
                                    <input type="checkbox" id="toggle--time" name="is_online_time" className="toggle--checkbox"/>
                                    <label className="toggle--btn" htmlFor="toggle--time">
                                    <span className="toggle--feature" data-label-on="온라인"  data-label-off="오프라인">
                                    </span></label>
                                </div>
                                <span>기준으로 </span>
                                <input className="form-control size_3" name="predicting_time" type="number"/>
                                <span>시간</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="rating">기준 등급</label>
                                <input className="form-control" name="rating" type="number" placeholder="기준등급(안쓰셔도 됩니다)" />
                                {/* <!--추후 보강  --> */}
                           {/*  </div>
                            <div className="form-group">
                                <div>추천 난이도</div>
                                <label htmlFor="masterDifficulty">마스터링 난이도</label>
                                <input className="form-control" name="masterDifficulty" title="높을수록 어려워요! 0~10사이로 적어주세요" type="number" min="0" max="10"  placeholder="마스터 난이도"/>
                                <label htmlFor="playerDifficulty">플레이어 난이도</label>
                                <input className="form-control" name="playerDifficulty" title="높을수록 어려워요! 0~10사이로 적어주세요" type="number" min="0" max="10" placeholder="플레이어 난이도"/>
                            </div>
                            {selectBackground}
                            {selectGenres}
                             {selectTags}
                            <div className="form-group">
                                <label htmlFor="is_agree_comment">댓글 허용</label>
                                <input className="form-control" name="is_agree_comment" type="checkbox" defaultChecked="checked" value="check" />
                                <label htmlFor="is_paid">유료 발행</label>
                                <input className="form-control" name="is_paid" type="checkbox" value="check" onChange={this.checkPaid} />
                            </div>
                            <div className="form-group">
                                <div id="paid_box" className="hidden">
                                    <div id="agree_paid">
                                        {/* <!-- 약관 페이지가 완성되면 이곳에 패널로 추가하여 보여줄 것 --> */}
                                      {/*   <label htmlFor="is_agree_paid">유료 발행시 가격을 수정하거나 게시물을 삭제할 수 없습니다. 이는 이미 구매한 사람을 위한 것입니다. 동의하십니까?</label>
                                        <input className="form-control" name="is_agree_paid" type="checkbox" value="check" onChange={this.checkAgreePaid} />
                                    </div>
                                    <div id="price_manage" className="hidden">
                                        <label htmlFor="price">발행 가격(코인)</label>
                                        <input className="form-control" name="price" type="number" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div > */}
                    <div className="row form-group">
                        <label htmlFor="article">내용</label>
                        <input name="article" type="hidden" />
                        <QuillEditor changeQuill={this.changeQuill} setValue="" />
                    </div>
                    <Button className="btn btn-primary" color="purple" type="submit">발행</Button>
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
        var select_rule;
        var select_genre;
        var select_background;
        var select_sub_tags;
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
        var component = (<div>
            <Modal onClose={()=>this.setOpenSetting(false)} onOpen={()=>this.setOpenSetting(true)} open={this.state.is_open_setting} closeIcon>
                <Modal.Header>설정</Modal.Header>
                <Modal.Content>
                    <Form method="POST" action={`/scenarios/make/setting/${this.state.chronicle_id }`} onSubmit={()=>this.convertQuill()}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={4}><Label className="border-none" size="big"  basic>사용 룰</Label></Grid.Column>
                                <Grid.Column width={12}>
                                    <Form.Select 
                                        name= "rule"
                                        // onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                        options={select_rule}
                                        // value={this.state.filter_rule}
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
                                        <Form.Input className="search-number " type="number" name="capacity_min" onChange={()=>this.onScenarioSearchChange} min={1} placeholder="최소 인원수"/>
                                        <span id="multiple_capacity" className="hidden"><Form.Input className="search-number search-number-right" label="~" type="number" name="capacity_max" onChange={()=>this.onScenarioSearchChange} min={1} placeholder="최대 인원수"/></span>
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
                    content="저장"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => this.setOpenSetting(false)}
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

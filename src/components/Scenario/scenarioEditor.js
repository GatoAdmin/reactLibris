import React from 'react';
import axios from 'axios';
import QuillEditor from '../Quill/react-quill-editor';
import '../../index.css';

class Maker extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            article_id: null,
            master_tags: [],
            result:null,
            title:"",
            rating:0,
            background_tag:"",
            genre_tags:[],
            sub_tags:[],
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
        let getTags = () => {
            axios.post(window.location.href)
                .then(res => {
                    this.setState({
                        master_tags: res.data.masterTags,
                        result:res.data.result,
                        article_id:res.data.result._id,
                        title:res.data.result.title,
                        rating:res.data.result.lastVersion.rating,
                        is_agree_comment:res.data.result.isAgreeComment,
                        orpgPredictingTime: res.data.result.lastVersion.orpgPredictingTime,
                        trpgPredictingTime:res.data.result.lastVersion.trpgPredictingTime,
                        masterDifficulty:res.data.result.lastVersion.masterDifficulty,
                        playerDifficulty:res.data.result.lastVersionplayerDifficulty,
                        capacity_min:res.data.result.lastVersion.capacity.min,
                        capacity_max:res.data.result.lastVersion.capacity.max,
                        is_paid:!res.data.result.isFree,
                        price:res.data.result.price,    
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getTags();
    }

    changeCapacityType=(e)=>{
        e.preventDefault();
        var obj = e.target;
        var multiple_capacity = document.querySelector('#multiple_capacity');
        if (obj.checked) {
            multiple_capacity.classList.remove('hidden');
        } else {
            multiple_capacity.classList.add('hidden');
        }
    }

    checkPaid= (e) => {
        e.preventDefault();
        var obj = e.target;
        var piad_box = document.querySelector('#paid_box');
        var agree_paid = document.querySelector('#agree_paid');
        var price_manage = document.querySelector('#price_manage');
        if (obj.checked) {
            var agree = '{- currentUser.agreeList.paidContent.agree}';
            if (agree === 'true') {
                agree_paid.classList.add('hidden');
                price_manage.classList.remove('hidden');
            }
            piad_box.classList.remove('hidden');
            // user의 유료판매 정책 동의 여부를 확인하여 agree_paid를 숨기고, price_manage를 보일것
        } else {
            piad_box.classList.add('hidden');
        }
    }

    checkAgreePaid = (e) => {
        e.preventDefault();
        var obj = e.target;
        // var agree_paid = document.querySelector('input[name=is_agree_paid]');
        var agree_paid = document.querySelector('#agree_paid');
        var price_manage = document.querySelector('#price_manage');
        if (obj.checked) {
            price_manage.classList.remove('hidden');
            agree_paid.classList.add('readOnly');
        }
        else {
            var msg = "해당 내용에 동의하지 않으시면 유료 발행을 하실 수 없습니다. 동의를 취소하겠습니까?";
            if (window.confirm(msg)) {
                price_manage.classList.add('hidden');
                return true;
            }
            else {
                // var checkBox = document.querySelector('input[name=is_agree_paid]');
                obj.checked = true;
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

      onChangeForm=(e)=>{
        this.setState({[e.target.name]: e.target.value });
    }
    getDetail() {
        var component = <div></div>;
        var masterTags = this.state.master_tags;
        var selectRule;
        var selectBackground;        
        var selectGenres;
        var selectTags;
        let last = this.state.result!=null?this.state.result.lastVersion:null;
        if(masterTags.length>0&&last!=null){
            // selectRule = (
            //     <div className="form-group">
            //         <label htmlFor="rule">기반 룰</label>
            //         <select className="form-control is-select2-select" name="rule" tabIndex="-1">
            //             <option value="" selectd="selected">-</option>
            //             {masterTags.find(tags => tags.name === "rule").tags.map(function (tag, index) {
            //                 return <option value={tag._id} key={index}> {tag.tag} </option>
            //             })}
            //         </select>
            //     </div>
            //     );
            selectBackground= (
                <div className="form-group">
                    <label htmlFor="background_tag">시나리오의 배경</label>
                    <select className="form-control is-select2-select" name="background_tag" tabIndex="-1">
                        <option value="" selectd="selected">-</option>
                        {masterTags.find(tags => tags.name === "background").tags.map(function (tag, index) {
                              return < option value={tag._id} key={index} selected={last.backgroundTag===tag.tag?'selected':null}> {tag.tag} </option>
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
                                return < option value={tag._id} key={index} selected={last.genreTags.includes(tag.tag)?'selected':null}> {tag.tag} </option>
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
                        return < option value={tag._id} key={index} selected={last.subTags.includes(tag.tag)?'selected':null}> {tag.tag} </option>
                    })}
                </select>
            </div> 
        );

        }
        if(this.state.result!=null){
        component = (
            <div id="form-container" className="container">
                <form method="POST" action={`/scenarios/edit/save/${this.state.article_id }`} onSubmit={()=>this.convertQuill()}> 
                <div className="row">
                        <button className="btn btn-primary" type="submit">발행</button>
                    </div>
                    <div className="row">
                        {/* <div className="col-xs-4">
           <div className="img-rounded"></div>//썸네일 필요하지 않을까?
          <a className="change-link" href='#'>Change picture</a> 
        </div>  */}
                        <div className="col-xs-8">
                            <div className="form-group">
                                <label htmlFor="title">제목</label>
                                <input className="form-control" name="title" type="text" value={this.state.title} onChange={this.onChangeForm} placeholder="제목을 입력해주세요" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="capacity_min">필요 인원수</label>
                                <input className="form-control size_3" name="capacity_min" type="number" min="1" value={this.state.capacity_min} onChange={this.onChangeForm} title="필요 인원수" />
                                <span id="multiple_capacity" className="hidden">
                                    <span>~</span>
                                    <input className="form-control size_3" name="capacity_max" type="number" min="1" value={this.state.capacity_max} onChange={this.onChangeForm} title="최대 인원수"/>
                                </span>  
                                <div>
                                <label htmlFor="is_multiple_capacity">이 시나리오는 가변적인 인원수에 대응할 수 있습니다.</label>
                                <input className="form-control" name="is_multiple_capacity" type="checkbox" value="check" onChange={this.changeCapacityType} checked={last.capacity.min!=last.capacity.max?"checked":null} />    
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="toggle toggle--time">
                                    {/* <Button.Group size='large'>
                                        <Button>One</Button>
                                        <Button.Or />
                                        <Button>Three</Button>
                                    </Button.Group>
) */}
                                    <input type="checkbox" id="toggle--time" name="is_online_time" className="toggle--checkbox"/>
                                    <label className="toggle--btn" htmlFor="toggle--time">
                                    <span className="toggle--feature" data-label-on="온라인"  data-label-off="오프라인">
                                    </span></label>
                                </div>
                                <span>기준으로 </span>
                                <input className="form-control size_3" name="predicting_time" type="number" />
                                <span>시간</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="rating">기준 등급</label>
                                <input className="form-control" name="rating" type="number" value={this.state.rating} onChange={this.onChangeForm}  placeholder="기준등급(안쓰셔도 됩니다)" />
                                {/* <!--추후 보강  --> */}
                            </div>
                            <div className="form-group">
                                <div>추천 난이도</div>
                                <label htmlFor="masterDifficulty">마스터링 난이도</label>
                                <input className="form-control" name="masterDifficulty" title="높을수록 어려워요! 0~10사이로 적어주세요" type="number" min="0" max="10" value={this.state.masterDifficulty} onChange={this.onChangeForm}  placeholder="마스터 난이도"/>
                                <label htmlFor="playerDifficulty">플레이어 난이도</label>
                                <input className="form-control" name="playerDifficulty" title="높을수록 어려워요! 0~10사이로 적어주세요" type="number" min="0" max="10" value={this.state.playerDifficulty} onChange={this.onChangeForm} placeholder="플레이어 난이도"/>
                            </div>
                            {selectBackground}
                            {selectGenres}
                             {selectTags}
                            <div className="form-group">
                                <label htmlFor="is_agree_comment">댓글 허용</label>
                                <input className="form-control" name="is_agree_comment" type="checkbox" defaultChecked={this.state.is_agree_comment} value="check" onChange={this.onChangeForm}/>
                                <label htmlFor="is_paid">유료 발행</label>
                                <input className="form-control" name="is_paid" type="checkbox" value="check" defaultChecked={this.state.is_paid}  onChange={this.checkPaid} />
                            </div>
                            <div className="form-group">
                                <div id="paid_box" className="hidden">
                                    <div id="agree_paid">
                                        {/* <!-- 약관 페이지가 완성되면 이곳에 패널로 추가하여 보여줄 것 --> */}
                                        <label htmlFor="is_agree_paid">유료 발행시 가격을 수정하거나 게시물을 삭제할 수 없습니다. 이는 이미 구매한 사람을 위한 것입니다. 동의하십니까?</label>
                                        <input className="form-control" name="is_agree_paid" type="checkbox" value="check" defaultChecked={this.props.currentUser.agreeList.paidContent.agree} onChange={this.checkAgreePaid} />
                                    </div>
                                    <div id="price_manage" className="hidden">
                                        <label htmlFor="price">발행 가격(코인)</label>     
                                         <input className="form-control" name="price" type="number" value={this.state.price} onChange={this.onChangeForm}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                    <div className="row form-group">
                        <label htmlFor="article">내용</label>
                        <input name="article" type="hidden" />
                        <QuillEditor changeQuill={this.changeQuill} setValue={last.content}  />
                    </div>
                    <div className="row">
                        <button className="btn btn-primary" type="submit">발행</button>
                    </div>
                </form >
            </div >
        );
    }
        return component;
    }

    render(){
        var currentUser = this.props.currentUser;
        return this.getDetail();
    }
}

export default Maker;

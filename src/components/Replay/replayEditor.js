import React from 'react';
import axios from 'axios';
import QuillEditor from '../Quill/react-quill-editor';
import PlayPeople from './playPeople';
import '../../index.css';

class Maker extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            article_id: null,
            master_tags: [],
            article:[],
            result:null,
            title:"",
            rating:0,
            background_tag:"",
            genre_tags:[],
            sub_tags:[],
            is_agree_comment:true,
            price:0,
        };
    }

    componentDidMount() {  
        // var urlStringLast  = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

        let getTags = () => {
            axios.post(window.location.href)
                .then(res => {
                    this.setState({
                        master_tags: res.data.masterTags,
                        result:res.data.result,
                        article_id:res.data.result._id,
                        title:res.data.result.lastVersion.title,
                        rating:res.data.result.lastVersion.rating,
                        background_tag:res.data.result.lastVersion.backgroundTag,
                        genre_tags:res.data.result.lastVersion.genreTags,
                        sub_tags:res.data.result.lastVersion.subTags,
                        is_agree_comment:res.data.result.lastVersion.isAgreeComment,
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

    changeCapacityType(obj) {
        var multiple_capacity = document.querySelector('#multiple_capacity');
        if (obj.checked) {
            multiple_capacity.classList.remove('hidden');
        } else {
            multiple_capacity.classList.add('hidden');
        }
    };

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
    convertData() {
        this.convertQuill();
        var data_players = [];
        var players = document.querySelectorAll('input[name=player_name]');
        for (var i = 0; i < players.length; i++) {
            var data_characters = [];
            var characters = document.querySelectorAll('input[name=character_name_' + i + ']');
            for (var j = 0; j < characters.length; j++) {
                data_characters.push({ characterName: characters[j].value });
            }
            data_players.push({ playerName: players[i].value, characters: data_characters });
        }
        var peoples = document.querySelector('input[name=play_peoples]');

        peoples.value = JSON.stringify(data_players);;
        return true;
    };
    convertQuill() {
        var quillContents = this.state.article;
        var about = document.querySelector('input[name=article]');
        about.value = JSON.stringify(quillContents);
      };

    changeQuill=(e)=>{
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
            //             <option value="">-</option>
            //             {masterTags.find(tags => tags.name === "rule").tags.map(function (tag, index) {
            //                 return <option value={tag._id} key={index} {...last.rule===tag._id?selected:null}> {tag.tag} </option>
            //             })}
            //         </select>
            //     </div>
            //     );
            selectBackground= (
                <div className="form-group">
                    <label htmlFor="background_tag">리플레이의 배경</label>
                    <select className="form-control is-select2-select" name="background_tag" tabIndex="-1">
                        <option value="" >-</option>
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
                        <option value="">-</option>
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
                    <option value="" >-</option>
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
                    <form method="POST" action={`/replays/edit/save/${this.state.article_id}`} onSubmit={()=>this.convertData()}>
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
                                <div className="form-group playPeople">
                                    <PlayPeople peoples={last.peoples}/>
                                </div>
                                <div className="form-group aboutScenario"></div>
                                <div className="form-group">
                                    <label htmlFor="rating">기준 등급</label>
                                    <input className="form-control" name="rating" type="number" value={this.state.rating} onChange={this.onChangeForm}  placeholder="기준등급(안쓰셔도 됩니다)" />
                                    {/* <!--추후 보강  --> */}
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
                            <QuillEditor changeQuill={this.changeQuill} setValue={last.content} />
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
        // var currentUser = this.props.currentUser;
        return this.getDetail();
    }
}

export default Maker;

import React from 'react';
import axios from 'axios';
import QuillEditor from '../Quill/react-quill-editor';
import PlayPeople from './playPeople';
import '../../index.css';

class Maker extends React.Component {    
    constructor(props) {
        super(props);
        this.state = {
            chronicle_id: null,
            master_tags: [],
            article:[],
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

    getDetail() {
        var component;
        var masterTags = this.state.master_tags;
        var selectRule;
        var selectBackground;        
        var selectGenres;
        var selectTags;
        if(masterTags.length>0){
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
                    <label htmlFor="background_tag">리플레이의 배경</label>
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

        component = (
            <div id="form-container" className="container">
                <form method="POST" action={`/replays/make${this.state.chronicle_id!=null?"/"+this.state.chronicle_id :""}`} onSubmit={()=>this.convertData()}>
                    <div className="row">
                        {/* <div className="col-xs-4">
           <div className="img-rounded"></div>//썸네일 필요하지 않을까?
          <a className="change-link" href='#'>Change picture</a> 
        </div>  */}
                        <div className="col-xs-8">
                            <div className="form-group">
                                <label htmlFor="title">제목</label>
                                <input className="form-control" name="title" type="text" placeholder="제목을 입력해주세요" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title_short">리플레이 줄임말</label>
                                <input className="form-control" name="title_short" type="text" placeholder="줄임말을 스페이스바 없이 입력해주세요" />
                            </div>
                            {selectRule}
                            <div className="form-group playPeople">
                                <PlayPeople/>
                            </div>
                            <div className="form-group aboutScenario"></div>
                            <div className="form-group">
                                <label htmlFor="rating">기준 등급</label>
                                <input className="form-control" name="rating" type="number" placeholder="기준등급(안쓰셔도 됩니다)" />
                                {/* <!--추후 보강  --> */}
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
                                        <label htmlFor="is_agree_paid">유료 발행시 가격을 수정하거나 게시물을 삭제할 수 없습니다. 이는 이미 구매한 사람을 위한 것입니다. 동의하십니까?</label>
                                        <input className="form-control" name="is_agree_paid" type="checkbox" value="check" onChange={this.checkAgreePaid} />
                                    </div>
                                    <div id="price_manage" className="hidden">
                                        <label htmlFor="price">발행 가격(코인)</label>
                                        <input className="form-control" name="price" type="number" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                    <div className="row form-group">
                        <label htmlFor="article">내용</label>
                        <input name="article" type="hidden" />
                        <QuillEditor changeQuill={this.changeQuill} setValue="" />
                    </div>
                    <div className="row">
                        <button className="btn btn-primary" type="submit">발행</button>
                    </div>
                </form >
            </div >
        );
        return component;
    }

    render(){
        var currentUser = this.props.currentUser;
        return this.getDetail();
    }
}

export default Maker;

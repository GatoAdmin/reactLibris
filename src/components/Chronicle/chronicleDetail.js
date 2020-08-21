import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Button} from 'semantic-ui-react';
import Moment from 'react-moment';
class ArticleBox extends React.Component{

    constructor(props) {
        super(props);
        // this.setState({rows:array});
        this.state = {
            rows: [],
            chronicle:null,
            master_tags: [],
        };
    }
    componentDidMount() {
        let getArticles = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            })
                .then(res => {
                    this.setState({
                        chronicle: res.data.chronicle
                    });
                    //    setTimeout(getArticles, 1000 * 10); // REPEAT THIS EVERy 10 SECONDS
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }
    removeBlock(id){
        var check = window.confirm("차단한 작품을 다시 보시겠습니까?");
        if(check){
            axios.post("/user/block/replays/"+id)
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
    getArticle(work,index){
      return   <tr key={index}>
            <td><Link to={`/replays/view/${work._id}`}>{ work.lastVersion.title }</Link></td>
            <td>{ work.ruleTag }</td>
            <td>{ work.view }</td>
            <td>{ work.price }</td>
            <td>
                <ul>
                    <li class="tag_item">
                        #{ work.backgroundTag }
                    </li>
                </ul>
            </td>
            <td>
                <ul>
                    { work.genreTags.map(function(tag){
                    return (<li class="tag_item">
                                #{ tag }
                            </li>)
                    })}
                </ul>
            </td>
            <td>
                <ul>
                    { work.subTags.map(function(tag){
                    return (<li class="tag_item">
                                #{ tag }
                            </li>)
                    })}
                </ul>
            </td>
            <td>
                <Moment format='YYYY-MM-DD HH:mm'>{work.created}</Moment>
            </td>
        </tr>
    }

    render(){
        var chronicle = this.state.chronicle;
       return( <div>
            <div class="chronicle_header">
                <h2>{ chronicle.title}</h2>
                <span>{ chronicle.description}</span>
                <div class="author_box">
                    <Link to={`/user/${chronicle.author.userName}`}>
                        <div>이미지</div>
                        <span class="author_name">{ chronicle.author.userName}</span>    
                    </Link>
                </div>
            </div>
            리플레이
        <Link to={`/replays/make/${chronicle._id }`}>새로 만들기</Link>
        <div class="articles_box">
            {chronicle.works.length > 0?
            <table>
                <thead>
                    <tr>
                        <th>제목</th>
                        <th>사용룰</th>
                        <th>조회수</th>
                        <th>가격</th>
                        <th>배경</th>
                        <th>장르</th>
                        <th>태그</th>
                        <th>발행일</th>
                    </tr>
                </thead>
                <tbody>
                    { chronicle.works.map(function(work,index){ 
                        if(this.props.currentUser!=null){
                            if(this.props.currentUser.blockList.replayList.some(article=>article.content.equals(work._id))){
                                return(
                                    <tr>
                                        <td>차단된 작품입니다.</td>
                                        <td>  <Button onClick={()=>this.removeBlock(work._id)}>해제하기</Button></td>
                                    </tr>
                                );
                            }else{
                                return this.getArticle(work, index);
                            }
                        }else{
                            return this.getArticle(work, index);
                        }
                    })}
                </tbody>
            </table>
           :<span>새로운 리플레이를 작성해주세요!</span>
        }
        </div>
        </div>);
    }
}
export default ArticleBox;
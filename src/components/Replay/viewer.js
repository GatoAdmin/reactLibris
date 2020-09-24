import React from 'react';
import 'semantic-ui-css/semantic.css';
import {Button, List, Icon} from 'semantic-ui-react';
import {Switch, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
import ArticleReport from '../Report/articleReport'; 
import QuillViewer from '../Quill/react-quill-viewer';
import CommentBox from '../Comment/commentPart';

class ReplayView extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          result: null,
          version: 0,
          currentUser:null,
          isBlock: false,
          isAuthor: false,
          isBookmark:false,
          isCanDelete :true,
          isCanReport: true,
          isPaid:false,
          comments:[],
          master_tags: [],
      };
  }


  componentDidMount() {
      console.log(window.location.href);
    let getArticle = () => {
        axios.post(window.location.href)
            .then(res => {
                this.setState({
                    result: res.data.result,
                    version: res.data.version,
                    // currentUser:res.data.currentUser,
                    isAuthor: res.data.isAuthor,
                    isCanDelete: res.data.isCanDelete,
                    isCanReport: res.data.isCanReport,
                    isPaid: res.data.isPaid,
                    // comments:res.data.comments,
                    // master_tags: res.data.masterTags
                });
              })
            .catch(function (err) {
                console.log(err);
            })
    }
    getArticle();
  }
    // window.article_id = '{result._id}'
    reComment(id, button){

    }
    deleteComment(id, text)
    {
        // var commentText = text.slice(0,100);
        var checkMsg = window.confirm(" "+text+"\n해당 댓글을 삭제할까요?");
        if(checkMsg){
            axios.post('/comments/delete/'+id)
            .then(res=>{
                alert("해당 댓글이 삭제되었습니다.");
                window.location.reload(true);
            })
            .catch(function (err) {
                    console.log(err);
                })
        }
    }
    switchOpened(isOpen)
    {
        var checkMsg ="";
        if(isOpen){
            if(this.state.result.isFree==false){
                checkMsg =window.confirm("해당 리플레이를 비공개합니다. 비공개를 하면 작가와 유료 작품 구매한 유저만 확인할 수 있습니다.");
            }else{
                checkMsg =window.confirm("해당 리플레이를 비공개합니다. 비공개를 하면 작가만이 확인 할 수 있습니다.");
            }
        }else{
            checkMsg =window.confirm("해당 리플레이를 공개합니다. 모든 유저들이 확인 할 수 있습니다.");
        }

        if(checkMsg){
            axios.post('/replays/switchOpen/'+this.state.result._id,{
                params:{
                    isOpened:isOpen
                }
            }).then(res=>{
                alert("성공적으로 변경되었습니다.");
                window.location.reload(true);
            })
            .catch(function (err) {
                    console.log(err);
                })
        }

    };

    switchBookmark()
    {
        axios.post('/replays/bookmark/'+this.state.result._id+'/'+this.state.version)
        .then(res=>{
            window.location.reload(true);
        })
        .catch(function (err) {
                console.log(err);
            })
    };

    deleteReplay(){
        var check = window.prompt("리플레이를 삭제하면 되돌릴 수 없습니다. '리플레이삭제' 라고 적어주세요.");
        if(check==="리플레이삭제"){
            axios.post('/replays/delete/'+this.state.result._id)
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
    addBlock(id){
        var check = true;//window.confirm("앞으로 해당 작품을 볼 수 없습니다. 차단하시겠습니까?");
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
    removeBlock(id){
        var check =true;// window.confirm("차단한 작품을 다시 보시겠습니까?");
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

  getViewPage(result){
      let content;
      let version = result.versions[this.state.version-1];
      if(result != null){
        let quillBoxStyle = {width: "80%", marginLeft: "10%"};
          content = (
            <div>
                <div>
                    <span>작가 : </span>
                    <Link to={`/user/${result.author.userName }`}>
                        {result.author.userName}
                    </Link>
                </div>
                <div>
                    <span>룰 : </span>
                    {result.ruleTag}
                </div>
                <div>
                    <span>
                        플레이 인원 :
                      </span>
                    <div>
                        {version.peoples.master != null ? (
                            <div><span>마스터 :</span>
                            <span>{version.peoples.master}</span></div>) : null}
                    </div>
                    <div>
                        {version.peoples.players.length > 0 ? (
                            <div>
                                <span>플레이어 :</span>
                              <span>{version.peoples.players.map((el, index) => (
                              <div key={index}>
                                <span>{el.playerName} 님</span>
                                <span>맡은 캐릭터</span>
                                <div>{el.characters.map((value, index) => (
                                    <span className="character_name" key={index} >{value.characterName}</span>
                                ))}</div>

                              </div>
                          ))} </span>
                          </div>
                      ) : null}
                    </div>
                </div>
                <div>
                    {version.rating != null ? <span>{version.rating} 금</span> : <span>전체 이용가</span>}
                </div>
                <div><span>조회수 : </span>{result.view}</div>
                <div>
                    <span>가격 :</span>
                    {!result.isFree ? <span>{result.price}</span> : <span>무료</span>}
                </div>
                <div>
                    <ul>
                        <li>
                            <span>배경 : </span>
                        </li>
                        <li className="tag_item">
                            #{version.backgroundTag}
                        </li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li>
                            <span>장르 : </span>
                        </li>
                        {version.genreTags.map( (tag, index)=>(
                            <li className="tag_item" key={index}>
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <ul>
                        <li>
                            <span>태그 : </span>
                        </li>
                        {version.subTags.map((tag, index)=>(
                            <li className="tag_item" key={index}>
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="quill-box" style={quillBoxStyle}>
                    <span>본문 </span>
                    {result.isFree?<QuillViewer setValue={result.versions[this.state.version-1].content}/>:
                    this.state.isPaid?<QuillViewer setValue={result.versions[this.state.version-1].content}/>:
                    <div>구매하지 않으면 볼 수 없는 컨텐츠 입니다.</div>
                    }
                    {/* {- include('../quill-viewer',{context: version.content}) } */}
                </div>
            </div>

        );
      }
      return content;

    // <div className="comment-container">
    // </div>

    // <script src="/components/commentPart.js"></script>

  }
  render() {
    var result = this.state.result;
    let blockContent;
    let reportConetnt;
    // var masterTags = this.state.masterTags;
    var currentUser = this.props.currentUser;//this.state.currentUser;
    var isBlock = this.state.isBlock;
    var isBookmark = this.state.isBookmark;
    var isCanReport = this.state.isCanReport;
    let content = <div></div>;
    let version = null;
    if(result != null&& typeof(result)!=='string' )
    {
        version = result.versions[this.state.version-1];
        if(typeof(currentUser) == 'object'&&!Array.isArray(currentUser)&&currentUser!=null){
            isBlock = currentUser.blockList.replayList.some(block=>block.content===result._id);
            isBookmark = currentUser.bookmarks.replayList.some(replay=>replay.content===result._id&&replay.version==this.state.version);
            reportConetnt = (isCanReport?(<ArticleReport article={result._id} version={this.state.version} paid={!result.isFree}/>):'신고하신 글입니다.');
            blockContent = (this.state.isBlock?(
                <div>
                    <span>차단된 작품입니다.</span>
                    <Button onClick={()=>{if(window.confirm("차단한 작품을 다시 보시겠습니까?"))this.removeBlock(result._id)}}>해제하기</Button>
                </div>
                ):!this.state.isAuthor?<Button onClick={()=>{if(window.confirm("앞으로 해당 작품을 볼 수 없습니다. 차단하시겠습니까?"))this.addBlock(result._id)}}>차단하기</Button>:null
            )
        }
        content=(
            <div>
                {blockContent}
                {reportConetnt}
            <h2>{version.title}</h2>
                {typeof(currentUser) == 'object'&&!Array.isArray(currentUser)&&currentUser!=null?(
                    <Button onClick={()=>this.switchBookmark()}>
                        {isBookmark?<Icon name='bookmark'/>:<Icon name='bookmark outline'/>}
                    </Button>):null
                }

            {this.state.isAuthor?(<div>
                    <Button as={Link} to={`/replays/edit/${result._id}`}>수정</Button>
                    <Button onClick={()=>this.switchOpened(result.isOpened)}>{result.isOpened?'비공개':'공개'}</Button>
                    {this.state.isCanDelete?<Button onClick={()=>this.deleteReplay()}>삭제</Button>:<span>구매한 유저가 있는 유료 리플레이는 삭제할 수 없습니다.</span>}
                </div>
                ):null}

            {!isBlock?this.getViewPage(result):null}
            <CommentBox/>
                </div>
        );
    }else if(typeof(result)==='string'&&result==="로그인 필요"){
        content = <div>로그인이 필요한 컨텐츠입니다</div>;
    }else{
        content = <div><h1>비공개 이거나 무언가 잘못된것 같아요 ;w;</h1></div>
    }

  return content;
 }
}

export default ReplayView;

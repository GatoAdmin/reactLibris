import React from 'react';
import './style.css';
import {Switch, Route, Link} from 'react-router-dom';
import Moment from 'moment'

class Replay extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          result: null,
          currentUser:null,
          isBlock: false,
          isAuthor: false,
          isBookmark:false,
          comments:[],
          master_tags: [],
      };
  }

  
  componentDidMount() {
    let getArticle = () => {
        axios.post(window.location.href)
            .then(res => {
                this.setState({
                    result: res.data.result,
                    currentUser:res.data.currentUser,
                    isAuthor: res.data.isAuthor,
                    comments:res.data.comments,
                    master_tags: res.data.masterTags
                });
              })
            .catch(function (err) {
                console.log(err);
            })
    }
    getArticle();
  }
    // window.article_id = '{-result._id}'
    reComment(id, button){
        
    }
    deleteComment(id, text)
    {
        // var commentText = text.slice(0,100);
        var checkMsg = confirm(" "+text+"\n해당 댓글을 삭제할까요?");
        if(checkMsg){
            axios.post('/comments/delete/'+id)
            .then(res=>{
                alert("해당 댓글이 삭제되었습니다.");
                location.reload(true);
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
            if('{result.isFree}'==false){
                checkMsg =confirm("해당 리플레이를 비공개합니다. 비공개를 하면 작가와 유료 작품 구매한 유저만 확인할 수 있습니다.");
            }else{
                checkMsg =confirm("해당 리플레이를 비공개합니다. 비공개를 하면 작가만이 확인 할 수 있습니다.");
            }
        }else{
            checkMsg =confirm("해당 리플레이를 공개합니다. 모든 유저들이 확인 할 수 있습니다.");
        }

        if(checkMsg){
            axios.post('/replays/switchOpen/{=result._id}',{
                params:{
                    isOpened:isOpen
                }
            }).then(res=>{
                alert("성공적으로 변경되었습니다.");
                location.reload(true);
            })
            .catch(function (err) {
                    console.log(err);
                })
        }

    };
    
    switchBookmark()
    {
        axios.post('/replays/bookmark/{=result._id}/{= version }')
        .then(res=>{
            location.reload(true);
        })
        .catch(function (err) {
                console.log(err);
            })
    };

    deleteReplay(){
        var check = prompt("리플레이를 삭제하면 되돌릴 수 없습니다. '리플레이삭제' 라고 적어주세요.");
        if(check==="리플레이삭제"){
            axios.post('/replays/delete/{=result._id}')
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
        var check = confirm("앞으로 해당 작품을 볼 수 없습니다. 차단하시겠습니까?");
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
        var check = confirm("차단한 작품을 다시 보시겠습니까?");
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

  getViewPage(){
    <div>
        <span>작가 : </span>
        <a href="/user/{= result.author.userName }">
            {- result.author.userName }
        </a>  
        </div>
    <div><span>룰 : </span>
        {- result.ruleTag }
    </div>
    <div>
        <span>
            플레이 인원 : 
        </span>
        <div>
            {result.lastVersion.peoples.master!=null?(
            <span>마스터 :</span>
            <span>{result.lastVersion.peoples.master }</span>):null}
        </div>
        <div>
        { result.lastVersion.peoples.players.length>0?(
          <span>플레이어 :</span>
          <span>{ result.lastVersion.peoples.players.map(function(el, index){
              <span>{el.playerName } 님</span>
              <span>맡은 캐릭터</span>
             <div>{ el.characters.map(function(value, index){
              <span className="character_name">{value.characterName}</span>
              }) }</div> 
            }) } </span>
        ):null}
        </div>
    </div>
    <div>
        { result.lastVersion.rating!=null?<span>{result.lastVersion.rating } 금</span>:<span>전체 이용가</span>}
    </div>
    <div><span>조회수 : </span>{result.view }</div>
    <div>
        <span>가격 :</span>
        {!result.isFree?<span>{ result.price }</span>:<span>무료</span>}
    </div>
    <div>
        <ul>
            <li>
                <span>배경 : </span>
            </li>
            <li className="tag_item">
                #{ result.lastVersion.backgroundTag }
            </li>
        </ul>
    </div>
    <div>
        <ul>
            <li>
                <span>장르 : </span>
            </li>
            { result.lastVersion.genreTags.map(function(tag){
            <li className="tag_item">
                #{tag }
            </li>
            })}
        </ul>
    </div>
    <div>
        <ul>
            <li>
            <span>태그 : </span>
            </li>
            { result.lastVersion.subTags.map(function(tag){
            <li className="tag_item">
                #{ tag }
            </li>
            })}
        </ul>
    </div>
    
    <div className="quill-box"style="width: 80%; margin-left: 10%;">
        <span>본문 </span>
        {/* {- include('../quill-viewer',{context: result.lastVersion.content}) } */}
    </div>
    
    
    // <div className="comment-container">
    // </div>
    
    // <script src="/components/commentPart.js"></script>

  }
  render() {
    var result = this.state.result;
    var masterTags = this.state.masterTags;
    var currentUser = this.state.currentUser;
    if(currentUser != null){
      var isBlock = currentUser.blockList.replayList.some(block=>block.content===result._id);
      var isBookmark = currentUser.bookmarks.replayList.some(replay=>replay.content===result._id&&replay.version==version);
      this.setState({isBlock:isBlock, isBookmark:isBookmark});
    }
  return (
      <div>
        <h2>result.lastVersion.title</h2>
          {isBlock?(
              <div>
                  <span>차단된 작품입니다.</span> 
                  <Button onclick={this.removeBlock(result._id)}>해제하기</Button>
              </div>
              ):!isAuthor?<Button onclick={this.addBlock(result._id)}>차단하기</Button>:null
          }
          {currentUser!=null?(
              <Button onclick={this.switchBookmark()}>
                  {isBookmark?<Icon name='bookmark'/>:<Icon name='bookmark outline'/>}
              </Button>):null
          }
              

        {isAuthor?(<div>
                <a href="/replays/edit/{-result._id}">
                    <Button>수정</Button>
                </a>
                <Button onclick={this.switchOpened(result.isOpened)}>{result.isOpened?비공개:공개}</Button>
                {isCanDelete?<Button onclick={this.deleteReplay()}>삭제</Button>:<span>구매한 유저가 있는 유료 리플레이는 삭제할 수 없습니다.</span>}
            </div>
            ):null}
    
        {!isBlock?this.getViewPage():null}
          </div>
  );
}

export default Replay;

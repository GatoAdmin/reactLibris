import React from 'react';
import 'semantic-ui-css/semantic.css';
import {Button, Grid, Image, Icon, Table, Tab,Label} from 'semantic-ui-react';
import {Switch, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
import QuillViewer from '../Quill/react-quill-viewer';
import CommentBox from '../Comment/commentPart';
import ArticleReport from '../Report/articleReport'; 

const userSrc = 'https://react.semantic-ui.com/images/wireframe/square-image.png';
class ScenarioView extends React.Component {
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
                checkMsg =window.confirm("해당 시나리오를 비공개합니다. 비공개를 하면 작가와 유료 작품 구매한 유저만 확인할 수 있습니다.");
            }else{
                checkMsg =window.confirm("해당 시나리오를 비공개합니다. 비공개를 하면 작가만이 확인 할 수 있습니다.");
            }
        }else{
            checkMsg =window.confirm("해당 시나리오를 공개합니다. 모든 유저들이 확인 할 수 있습니다.");
        }

        if(checkMsg){
            axios.post('/scenarios/switchOpen/'+this.state.result._id,{
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
        axios.post('/scenarios/bookmark/'+this.state.result._id+'/'+this.state.version)
        .then(res=>{
            window.location.reload(true);
        })
        .catch(function (err) {
                console.log(err);
            })
    };

    deleteScenario(){
        var check = window.prompt("시나리오를 삭제하면 되돌릴 수 없습니다. '시나리오삭제' 라고 적어주세요.");
        if(check==="시나리오삭제"){
            axios.post('/scenarios/delete/'+this.state.result._id)
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
        var check = window.confirm("앞으로 해당 작품을 볼 수 없습니다. 차단하시겠습니까?");
        if(check){
            axios.post("/user/block/scenarios/"+id)
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
        var check = window.confirm("차단한 작품을 다시 보시겠습니까?");
        if(check){
            axios.post("/user/block/scenarios/"+id)
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
    setIsValue(isBlock, isBookmark)
    {
        this.setState({isBlock:isBlock, isBookmark:isBookmark});
    }

    getInfoTab(result){
        let infoTab;
        if(result !== null){
            let version = result.versions[this.state.version-1];
            console.log(result.banner)
            infoTab = (
                <div className="meta-data-box font-mm">
                    <div>
                        <Image className="article-banner" centered src={result.banner!==undefined?result.banner.imageData!==undefined?"/assets/images/"+result.banner.imageData:userSrc:userSrc}/>
                    </div>
                    {/* <Grid padded columns='equal'>
                        <Grid.Row className="width-auto font-mm">
                            <Grid.Column>
                                룰 
                            </Grid.Column>
                            <Grid.Column >                                   
                                {result.ruleTag}
                            </Grid.Column>
                            <Grid.Column >                                   
                                인원수
                            </Grid.Column>
                            <Grid.Column >
                                <Icon.Group size="large">
                                    <Icon name="user outline" fitted size="large" color='blue'/>
                                    <Icon color="white" fitted>{version.capacity.min}</Icon>
                                </Icon.Group>
                                {(version.capacity.min != version.capacity.max)?(<span><span>~</span>         
                                    
                                <Icon.Group size="large">
                                    <Icon name="user outline" fitted size="large" color='purple'/>
                                    <Icon  color="white" fitted>{version.capacity.max}</Icon>
                                </Icon.Group></span>):null}
                            </Grid.Column>
                            <Grid.Column > 
                                플레이 시간 
                            </Grid.Column>
                            <Grid.Column >         
                                <span className="predictingTime">
                                    {version.orpgPredictingTime==null?"오프라인으로":"온라인으로"}
                                </span>
                                <span>
                                    {version.orpgPredictingTime==null?version.trpgPredictingTime:version.orpgPredictingTime}
                                </span>
                                <span> 시간</span>
                            </Grid.Column>
                            <Grid.Column>
                                가격 
                            </Grid.Column>
                            <Grid.Column >         
                                {!result.isFree ? <span>{result.price}</span> : <span>무료</span>}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>                            
                                {version.rating != null ? <span>{version.rating} 금</span> : <Icon.Group size="large"><Icon size="large" fitted name="circle outline"/><Icon fitted size="small"><b>ALL</b></Icon></Icon.Group>}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="width-auto">
                            <Grid.Column>
                                배경 
                            </Grid.Column>
                            <Grid.Column  className="display-conents">       
                                <Label className="tag-item background-tag" as={Button} onClick={()=>this.onClickTag('filter_background',version.backgroundTag)}  content={version.backgroundTag} icon='hashtag' />  
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="width-auto">
                            <Grid.Column>
                                장르 
                            </Grid.Column>
                            <Grid.Column  className="display-conents">                                                       
                                {version.genreTags.map((tag, id) => { return <Label className="tag-item genre-tag" key={id.toString()}  as={Button} onClick={()=>this.onClickTag('filter_genre',tag)}  content={tag} icon='hashtag' />}) }                                               
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="width-auto">
                            <Grid.Column>
                                분위기 
                            </Grid.Column>
                            <Grid.Column className="display-conents">         
                            {version.subTags.map((tag, id) => { return <Label className="tag-item sub-tag" key={id.toString()}  as={Button} onClick={()=>this.onClickTag('filter_sub_tags',tag)}  content={tag} icon='hashtag' />}) }                                        
                            </Grid.Column>
                        </Grid.Row>
                    </Grid> */}
                    
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    룰 
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                인원수 
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                플레이 시간  
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                가격  
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>

                        <Table.Row className="width-auto font-mm">
                            <Table.Cell >                                   
                                {result.ruleTag}
                            </Table.Cell>
                            <Table.Cell >
                                <Icon.Group size="large">
                                    <Icon name="user outline" fitted size="large" color='blue'/>
                                    <Icon color="white" fitted>{version.capacity.min}</Icon>
                                </Icon.Group>
                                {(version.capacity.min != version.capacity.max)?(<span><span>~</span>         
                                    
                                <Icon.Group size="large">
                                    <Icon name="user outline" fitted size="large" color='purple'/>
                                    <Icon  color="white" fitted>{version.capacity.max}</Icon>
                                </Icon.Group></span>):null}
                            </Table.Cell>
                            <Table.Cell >         
                                <span className="predictingTime">
                                    {version.orpgPredictingTime==null?"오프라인으로":"온라인으로"}
                                </span>
                                <span>
                                    {version.orpgPredictingTime==null?version.trpgPredictingTime:version.orpgPredictingTime}
                                </span>
                                <span> 시간</span>
                            </Table.Cell>
                            <Table.Cell >         
                                {!result.isFree ? <span>{result.price}</span> : <span>무료</span>}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell >                            
                                {version.rating != null ? <span>{version.rating} 금</span> : <Icon.Group size="large"><Icon size="large" fitted name="circle outline"/><Icon fitted size="small"><b>ALL</b></Icon></Icon.Group>}
                            </Table.Cell >
                        </Table.Row>
                        <Table.Row className="width-auto">
                            <Table.Cell >
                                배경 
                            </Table.Cell >
                            <Table.Cell  className="display-conents">       
                                <Label className="tag-item background-tag" as={Button} onClick={()=>this.onClickTag('filter_background',version.backgroundTag)}  content={version.backgroundTag} icon='hashtag' />  
                            </Table.Cell >
                        </Table.Row>
                        <Table.Row className="width-auto">
                            <Table.Cell >
                                장르 
                            </Table.Cell >
                            <Table.Cell   className="display-conents">                                                       
                                {version.genreTags.map((tag, id) => { return <Label className="tag-item genre-tag" key={id.toString()}  as={Button} onClick={()=>this.onClickTag('filter_genre',tag)}  content={tag} icon='hashtag' />}) }                                               
                            </Table.Cell >
                        </Table.Row>
                        <Table.Row className="width-auto">
                            <Table.Cell >
                                분위기 
                            </Table.Cell >
                            <Table.Cell  className="display-conents">         
                            {version.subTags.map((tag, id) => { return <Label className="tag-item sub-tag" key={id.toString()}  as={Button} onClick={()=>this.onClickTag('filter_sub_tags',tag)}  content={tag} icon='hashtag' />}) }                                        
                            </Table.Cell >
                        </Table.Row>
                        </Table.Body>
                    </Table>
                    <div>
                        소개글
                    </div>
                    <div>
                        주의글
                    </div>
                </div>)
        }
        return infoTab;
    }
    
    getContentTab(result){
        let contentTab;
        let quillBoxStyle = {width: "80%", marginLeft: "10%"};
        if(result !== null){
            let version = result.versions[this.state.version-1];
            contentTab = (
                <div className="quill-box" style={quillBoxStyle}>
                    {result.isFree?<QuillViewer setValue={result.versions[this.state.version-1].content}/>:
                    this.state.isPaid?<QuillViewer setValue={result.versions[this.state.version-1].content}/>:
                    <div>구매하지 않으면 볼 수 없는 컨텐츠 입니다.</div>
                    }
                    {/* {- include('../quill-viewer',{context: version.content}) } */}
                </div>
                )
        }
        return contentTab;
    }
    
    getLogTab(result){
        let logTab;
        if(result !== null){
            let version = result.versions[this.state.version-1];
            logTab = (
                <div className="meta-data-box">
                    <Table>
                        <div>
                            <span>룰 : </span>
                            {result.ruleTag}
                        </div>
                        <div>
                            <span>
                                플레이 인원 :
                            </span>
                            <span>{version.capacity.min}</span>
                            {(version.capacity.min != version.capacity.max)?(<span><span>~</span>         
                                <span>{version.capacity.max}</span></span>):null}
                            <span> 인</span>
                        </div>
                        <div>
                            <span>플레이 시간: </span>
                            <span className="predictingTime">
                                {version.orpgPredictingTime==null?"오프라인으로":"온라인으로"}
                            </span>
                            <span>
                                {version.orpgPredictingTime==null?version.trpgPredictingTime:version.orpgPredictingTime}
                            </span>
                            <span> 시간</span>
                        </div>
                        <div>
                            {version.rating != null ? <span>{version.rating} 금</span> : <span>전체 이용가</span>}
                        </div>
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
                    </Table>
                </div>)
        }
        return logTab;
    }
  getViewPage(result){
      let content;
      let version = result.versions[this.state.version-1];
      if(result != null){
        let panes = [{
                menuItem:'개요',
                render:()=><Tab.Pane attached={false}>{this.getInfoTab(result)}</Tab.Pane>
            },
            {   menuItem:'본문',
                render:()=><Tab.Pane attached={false}>{this.getContentTab(result)}</Tab.Pane>
            },
            {
                menuItem:'로그',
                render:()=><Tab.Pane attached={false}>{this.getLogTab(result)}</Tab.Pane>
            },
        ];
          content = (
            <div>
                <div className="text-right">
                    <Image className="user-image float-right" avatar src={result.author.portrait!==undefined?result.author.portrait:userSrc} as={Link} to={`/user/${result.author.userName }`}/>
                    <div>
                        <Button className="shadow-none btn text" size="mini" basic as={Link} to={`/user/${result.author.userName }`}>
                            <h4>{result.author.userName}</h4>
                        </Button>
                        <div>
                            <div className="inline-flex extra-data">
                                <Moment format="YYYY.MM.DD HH:mm">{result.created}</Moment>
                                <span>|</span> 
                                <Icon name='eye' />{result.view}
                                {/* <span>|</span>  */}
                                {/* <Icon name='comments' />{result.view}
                                <span>|</span>  */}
                            </div>
                        </div>
                    </div>
                </div>
                <Tab menu={{ secondary: true, pointing: true }}panes={panes}/>
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
    var currentUser = this.props.currentUser;//this.state.currentUser;
    let content = <div></div>;
    var isBlock = this.state.isBlock;
    var isBookmark = this.state.isBookmark;
    var isCanReport = this.state.isCanReport;
    let version = null;
    if(result != null&& typeof(result)!=='string')
    {
        version = result.versions[this.state.version-1];
        if(typeof(currentUser) == 'object'&&!Array.isArray(currentUser)&&currentUser!=null){
            isBlock = currentUser.blockList.scenarioList.some(block=>block.content===result._id);
            isBookmark = currentUser.bookmarks.scenarioList.some(scenario=>scenario.content===result._id&&scenario.version==this.state.version);
            reportConetnt = (isCanReport?(<ArticleReport article={result._id} version={this.state.version} paid={!result.isFree}/>):'신고하신 글입니다.');
            blockContent =(isBlock?(
                <div>
                    <span>차단된 작품입니다.</span> 
                    <Button onClick={()=>this.removeBlock(result._id)}>해제하기</Button>
                </div>
                ):!this.state.isAuthor?<Button onClick={()=>{this.addBlock(result._id)}}>차단하기</Button>:null
            )
        }
        content=(
            <div>
                <Grid className="article-title">
                    <Grid.Row>
                    <Grid.Column className="inline-flex" width={8}>
                        <h2>{result.title}</h2>
                        {typeof(currentUser) == 'object'&&!Array.isArray(currentUser)&&currentUser!=null?(
                            <Button className="shadow-none btn" basic onClick={()=>this.switchBookmark()}>
                                {isBookmark?<Icon name='bookmark'/>:<Icon name='bookmark outline'/>}
                            </Button>):null
                        }
                        
                        {this.state.isAuthor?(<div>
                                <Button as={Link} to={`/scenarios/edit/${result._id}`}>수정</Button>
                                <Button onClick={()=>this.switchOpened(result.isOpened)}>{result.isOpened?'비공개':'공개'}</Button>
                                {this.state.isCanDelete?<Button onClick={()=>this.deleteScenario()}>삭제</Button>:<span>구매한 유저가 있는 유료 리플레이는 삭제할 수 없습니다.</span>}
                            </div>
                            ):null}
                    </Grid.Column>
                    
                    <Grid.Column className="text-right" width={8}>
                        <div className="inline-flex">
                            {blockContent}
                            {reportConetnt}
                        </div>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
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

export default ScenarioView;

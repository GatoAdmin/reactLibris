import React from 'react';
import 'semantic-ui-css/semantic.css';
import {Button, List, Icon, Grid} from 'semantic-ui-react';
import {Switch, Route, Link} from 'react-router-dom';
import axios from 'axios';
import Moment from 'react-moment';
import QuillViewer from '../Quill/react-quill-viewer';
import CommentBox from '../Comment/commentPart';

class NewsView extends React.Component {
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
          comments:[],
          master_tags: [],
      };
  }


  componentDidMount() {
    let getArticle = () => {
        axios.post(window.location.href)
            .then(res => {
                this.setState({
                    result: res.data.result
                });
              })
            .catch(function (err) {
                console.log(err);
            })
    }
    getArticle();
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

    switchBookmark()
    {
        axios.post('/news/bookmark/'+this.state.result._id)
        .then(res=>{
            window.location.reload(true);
        })
        .catch(function (err) {
                console.log(err);
            })
    };

  getViewPage(result){
      let content;

      if(result != null){
        let quillBoxStyle = {width: "80%", marginLeft: "10%"};
          content = (
            <div>
                <Grid>
                    <Grid.Column floated='left' width={5}>
                        <span>작가 : </span>
                        <Link to={`/user/${result.author.userName }`}>
                            {result.author.userName}
                        </Link>
                    </Grid.Column>
                    <Grid.Column floated='right' width={5}><span>조회수 : </span>{result.view}</Grid.Column>
                </Grid>
                
                <div className="quill-box" style={quillBoxStyle}>
                    <QuillViewer setValue={result.lastVersion.content}/>
                </div>
                <div>
                    <ul>
                        {result.hashTags.map((tag, index)=>(
                            <li className="tag_item" key={index}>
                                #{tag.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        );
      }
      return content;
  }
  render() {
    var result = this.state.result;
    var currentUser = this.props.currentUser;
    var isBookmark = this.state.isBookmark;
    let content = <div></div>;
    if(result != null)
    {
        if(typeof(currentUser) == 'object'&&!Array.isArray(currentUser)&&currentUser!=null){
            isBookmark = currentUser.bookmarks.newsList.some(news=>news.content===result._id);
        }

    content=(
        <div>
          <h2>{result.lastVersion.title}</h2>
            {typeof(currentUser) == 'object'&&!Array.isArray(currentUser)&&currentUser!=null?(
                <Button onClick={()=>this.switchBookmark()}>
                    {isBookmark?<Icon name='bookmark'/>:<Icon name='bookmark outline'/>}
                </Button>):null
            }
          {this.getViewPage(result)}
          <CommentBox/>
            </div>
    );
}

  return content;
 }
}

export default NewsView;

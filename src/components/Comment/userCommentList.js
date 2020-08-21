import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import {Button} from 'semantic-ui-react';

const e = React.createElement;
//user용으로 하기 위해선 수정필요
function filterNan(item) {
    if (item == ""||item == undefined||item=="undefined"||item==null) {
      return false;
    } 
    return true; 
  }
class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            article_id : window.location.pathname.split("/").filter(filterNan).pop(),
            article : null,
            currentUser:null,
            recomment_origin_id : "", 
        };
    }

    componentDidMount() {
        let getArticles = () => {
            axios.post('/library/comments/')
                .then(res => {
                    this.setState({
                        comments: res.data.comments,
                        article: res.data.article,
                        currentUser:res.data.currentUser
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }

    onDeleteClick=(event)=>{
        event.preventDefault();
        var deleteCommentBox = event.target.parentElement.parentElement;
        var text = deleteCommentBox.querySelector('.comment-content').innerText.slice(0,100);
        var checkMsg = window.confirm(" "+text+"\n해당 댓글을 삭제할까요?");
        if(checkMsg){
            axios.post('/comments/delete/'+deleteCommentBox.getAttribute("data-comment"))
            .then(res=>{
                alert("해당 댓글이 삭제되었습니다.");
                window.location.reload(true);
            })
            .catch(function (err) {
                    console.log(err);
                })
        }
    }

    getCommentBox(data,index){
        var commentBox = e("div",{className:"comment-box","data-comment":data._id,key: index },
            e("a",{href:"/comments/view/"+data._id},
                e("div",{className:"comment-content"},data.content),
                e("div",{className:"comment-date"},data.created)
            ),
            e("div",null,
                data.user.userEmail===this.state.currentUser?e(Button,{className:"btn-delete",type:"button",onClick:this.onDeleteClick},"삭제"):e("span",null)
            ),
        );
        return commentBox;
    }

    checkComments(){
        var comments =this.state.comments;
        var comments_component;
        if(comments.length>0){
           comments_component = e("div",{className:"comment-list"},
                comments.map((comment,index)=>{
                        return this.getCommentBox(comment,index)
                    })
            );
        }else{
            comments_component = e("span",{className:"bold"},"작성된 댓글이 없습니다.");
        }
        return comments_component;
    }
    render() {
        var component;
        var userName = this.props.currentUser!=null?this.props.currentUser.userName:"";
        component = e("div",null,
        e("h2",null,userName+"가 남긴 댓글"),
        e("div",{className:"comment-container"},this.checkComments()),
        );
        

        return component;
        
    }
}

export default CommentBox;
// ReactDOM.render(e(CommentBox), document.querySelector('.comment-container'));

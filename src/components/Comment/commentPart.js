import React from 'react';
import axios from 'axios';
import './style.css'
import {Button, Grid, Input, Form} from 'semantic-ui-react';
import CommentReport from '../Report/commentReport';

function filterNan(item) {
    if (item == ""||item == undefined||item=="undefined"||item==null) {
      return false;
    } 
    return true; 
  }
const e = React.createElement;
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
            axios.post('/comments/'+this.state.article_id)
                .then(res => {
                    this.setState({
                        comments: res.data.comments,
                        article: res.data.article,
                        currentUser:res.data.currentUser
                    });
                    //    setTimeout(getArticles, 1000 * 10); // REPEAT THIS EVERy 10 SECONDS
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }

    onRecommentButtonClick = (event)=>{
        event.preventDefault();
        var reCommentBox = event.target.parentElement.parentElement;
        this.setState({recomment_origin_id: reCommentBox.getAttribute('data-comment')});
        this.forceUpdate();
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

    getReCommentInputBox(comment_id){
        var re_input_comment = e(Form,{method:"POST",action:"/comments/recomment/"+comment_id},
        e(Form.Group,{inline:true, unstackable:true},
            e(Form.Input,{type:"text",className:"comment-input recomment",name:"comment",size:"50",placeholder:"댓글을 입력해주세요"}),
            e(Button,{type:"submit"},"댓글달기")   )                     
        );
        return re_input_comment;
    }

    getButtonGroup(data){   
        var reportButton = e(Grid.Column,{className:"reported"},e(CommentReport,{comment:data._id}));      
        var deleteBox = e("span",null);

        if(this.state.currentUser === data.user.userEmail ){
            reportButton = null;
            deleteBox =e(Grid.Column,{className:"reported"}, e(Button,{className:"btn-delete",type:"button",onClick:this.onDeleteClick},"삭제"));
        }
       return  e(Grid,{className:"comment-commend", columns:5,relaxed:true},
            e(Grid.Row,null,                
                e(Grid.Column,{className:"recommended"},e("form",{action:"/comments/recommend/"+data._id,method:"POST"},e(Button,{type:"summit", content:'추천', icon:'thumbs up outline', label:{content:data.recommends}, labelPosition:'right'}))),
                e(Grid.Column,{className:"decommended"},e("form",{action:"/comments/decommend/"+data._id,method:"POST"},e(Button,{type:"summit",content:'비추천', icon:'thumbs down outline', label:{content:data.decommends}, labelPosition:'right'}))),
                reportButton,
                deleteBox,
            )
           );
    }

    getReCommentBox(data,index){
        var commentBox = e("div",{className:"recomment-box","data-comment":data._id,key: index },
            e("div",{className:"user-box"},
                e("a",{href:"/user/"+data.user.userName},
                    e("span",null,"이미지"),e("span",null,data.user.userName))),
            e("div",null,
                e("a",{href:"/comments/view/"+data._id},
                    e("div",{className:"comment-content"},data.content),
                    e("div",{className:"comment-date"},data.created)
                )
            ),
            this.getButtonGroup(data),
        );
        return commentBox;
    }

    getCommentBox(data,index){
        var recommentInputBox = null;
        var recommentList = null;
        var user = this.state.currentUser;
        if(data.recomments.length > 0){
            recommentList = e("div",{className:"recomment-list"},
                data.recomments.map((recomment,index)=>{return this.getReCommentBox(recomment,index)})
            )
        }
        if(this.state.recomment_origin_id===data._id){
            recommentInputBox = this.getReCommentInputBox(this.state.recomment_origin_id);
        }else if(user!=null&&data.replyOrigin==null){
            recommentInputBox = data.stopped.isStopped?null:data.isReported?null:e(Button,{onClick:this.onRecommentButtonClick},"댓글달기");
        }
        var commentBody = data.stopped.isStopped?e("span",null,"운영자에 의해 가려진 댓글입니다."):data.isReported?e("span",null,"신고하신 댓글입니다."):e("div",null,
            e("div",{className:"user-box"},
                e("a",{href:"/user/"+data.user.userName},
                    e("span",null,"이미지"),e("span",null,data.user.userName))),
            e("div",null,
                e("a",{href:"/comments/view/"+data._id},
                    e("div",{className:"comment-content"},data.content),
                    e("div",{className:"comment-date"},data.created)
                )
            ),
            this.getButtonGroup(data)
        )
        var commentBox = e("div",{className:"comment-box","data-comment":data._id,key: index },
            commentBody,
            e("div",null,
                recommentInputBox,
            ),
            recommentList
        );
        return commentBox;
    }

    checkComments(){
        var comments = this.state.comments;
        var comments_component;
        if(comments.length>0){
            console.log(comments[0]);
           comments_component = e("div",{className:"comment-list"},
                comments.map((comment,index)=>{return this.getCommentBox(comment,index)}) 
            );
        }else{
            comments_component = e("span",{className:"bold"},"처음으로 댓글을 달아보세요!");
        }
        return comments_component;
    }
    render() {
        var component;
        var new_input_comment;

        var isAgree = this.state.article!=null?this.state.article.isAgreeComment:false;
        if(isAgree){
            if(this.state.currentUser!=null){
                new_input_comment = e(Form,{method:"POST",action:"/comments/add/"+this.state.article_id},
                    e(Form.Group,{inline:true, unstackable:true},
                        e(Form.Input,{type:"text",className:"comment-input comment",name:"comment",placeholder:"댓글을 입력해주세요"}),
                        e(Form.Button,{type:"submit"},"입력")
                    )
                );
            }else{
                new_input_comment = e("div",{className:"bold comment-notice"},"댓글을 작성하시려면 로그인을 해주세요");
            }
            component = e("div",{className:"comment-container"},
                new_input_comment,
                this.checkComments()
            );
        }else{
            component =  e("span",{className:"bold"},"이 게시글은 댓글을 허용하지 않습니다.");
        }

        return component;
        
    }
}
export default CommentBox
// ReactDOM.render(e(CommentBox), document.querySelector('.comment-container'));

import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Button,Grid} from 'semantic-ui-react';

function filterNan(item) {
    if (item == ""||item == undefined||item=="undefined"||item==null) {
      return false;
    } 
    return true; 
  }
const e = React.createElement;
class ChronicleBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            masterTags : [],
        };
    }

    componentDidMount() {
        let getArticles = () => {
            axios.post('/library/chronicles')
                .then(res => {
                    this.setState({
                        user: res.data.user,
                        masterTags: res.data.masterTags
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

    getChronicles(){
        var chronicles_component;
        var user =this.state.user;
        if (user.chronicles){
            chronicles_component =<div>
                <h2>{user.userName}의 작품({user.chronicles.length})</h2>
            <Grid class="articles_box">
                {user.chronicles.map((value, index)=>{
                    if (value.onModel === 'Scenario'){
                        return (<Grid.Row key={index}> 
                            <Grid.Column width={3}>
                                시나리오
                            </Grid.Column>
                            <Grid.Column width={2}>   
                                 {/* <!-- 완결/단편/연재중 상태 표시 필요 --> */}
                                 <h5>{value.works.length == 1?"단편":value.works.length}</h5>
                            </Grid.Column>
                            <Grid.Column width={6}> 
                                {value.works.length == 1?<Link to={`/scenarios/view/${value.works[0]}`}><h4>{value.title}</h4></Link>
                                :<Link to={`/chronicles/scenarios/${value._id}`}><h4>{value.title}</h4></Link>
                                }
                              </Grid.Column>
                              <Grid.Column width={3}>
                                  <Link to={`/chronicles/scenarios/${value._id}`}><Button>관리</Button></Link>
                              </Grid.Column>
                        </Grid.Row>)
                        }else if(value.onModel ===  'Replay'){
                            return (<Grid.Row> 
                                <Grid.Column width={3}>
                                    리플레이
                                </Grid.Column>
                            <Grid.Column width={2}>   
                                    {/* <!-- 완결/단편/연재중 상태 표시 필요 --> */}
                                 <h5>{value.works.length == 1?"단편":value.works.length}</h5>
                                </Grid.Column>
                            <Grid.Column width={6}> 
                                    {value.works.length == 1?<Link to={`/replays/view/${value.works[0]}`}><h4>{value.title}</h4></Link>
                                    :<Link to={`/chronicles/replays/${value._id}`}><h4>{value.title}</h4></Link>
                                    }
                                </Grid.Column>
                              <Grid.Column width={3}>
                                    <Link to={`/chronicles/replays/${value._id}`}><Button>관리</Button></Link>
                                </Grid.Column>
                            </Grid.Row>);
                        }
                    })}    
            </Grid>
            </div>
         }
        return chronicles_component;
    }
    render() {
        var component = <div></div>;
        if(this.state.user!=null){
            component =this.getChronicles();
        }

        return component;
        
    }
}
export default ChronicleBox
// ReactDOM.render(e(CommentBox), document.querySelector('.comment-container'));

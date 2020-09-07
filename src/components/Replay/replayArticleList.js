import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import {Switch, Route, Link} from 'react-router-dom';
import { Card, Form, Icon,Image, Grid, Button, Table } from 'semantic-ui-react'

const e = React.createElement;

const align_types = ['title', 'rule', 'author', 'view', 'price', 'created'];
class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            align_type: 'created',
            align_order: 'descending',
            filter_title: "",
            filter_author: "",
            filter_price_min: "",
            filter_price_max: "",
            filter_background: [],
            filter_genre: [],
            filter_rule: [],
            filter_sub_tags: [],
            master_tags: [],
            viewType:'list'
        };
    }

    componentDidMount() {
        let getArticles = () => {
            axios.post('/replays', {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.articles,
                        master_tags: res.data.masterTags
                    });
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }

    onAlignClick = (e) => {
        e.preventDefault();
        var alignType=e.target.value;
        var alignOrder = this.state.align_order;
        if(alignType === this.state.align_type){
            alignOrder = alignOrder === "descending" ? "ascending" : "descending";
        }
        
        this.setState(() => ({
            align_type: alignType,
            align_order: alignOrder
        }));
        
        let getArticles = () => {
            axios.post('/replays/search', {
                params: {
                    align_order: alignOrder,
                    align_type: alignType,
                    searchs: {
                        filter_title: this.state.filter_title,
                        filter_author: this.state.filter_author,
                        filter_background: this.state.filter_background,
                        filter_genre: this.state.filter_genre,
                        filter_rule: this.state.filter_rule,
                        filter_sub_tags: this.state.filter_sub_tags,
                        filter_price_min: this.state.filter_price_min ,
                        filter_price_max: this.state.filter_price_max ,
                    }
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.articles,
                        master_tags: res.data.masterTags
                    });

                    this.forceUpdate();
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }
    onReplaySearchChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }
        );
    }
    onReplaySearchSelected = (e) => {
        var options = Array.from(e.target.selectedOptions, option => option.value);
        this.setState({
            [e.target.name]: options
        }
        );
    }
    onReplaySearchSubmit = (e) => {
        e.preventDefault();
        let getArticles = () => {
            axios.post('/replays/search', {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type,
                    searchs: {
                        filter_title: this.state.filter_title,
                        filter_author: this.state.filter_author,
                        filter_background: this.state.filter_background,
                        filter_genre: this.state.filter_genre,
                        filter_rule: this.state.filter_rule,
                        filter_sub_tags: this.state.filter_sub_tags,
                        filter_price_min: this.state.filter_price_min ,
                        filter_price_max: this.state.filter_price_max ,
                    }
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.articles,
                        master_tags: res.data.masterTags
                    });

                    //    setTimeout(getArticles, 1000 * 10); // REPEAT THIS EVERy 10 SECONDS
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        // if (this.state.searchs !== prevState.searchs ) {
        getArticles();
        // }
    }    
    
    getAlignIcon(order){
        if(this.state.align_type === order){
            return this.state.align_order === "ascending" ?"sort down" : "sort up"
        }else{
            console.log(this.state.align_type)
            return null;
        }
    }
    
    onViewClick= (e) =>{
        e.preventDefault();
        var viewType = e.target.value;
        console.log(viewType)
        if(viewType !=null && viewType!=undefined){
            this.setState(() => ({viewType: viewType}));
        }
    }
    
    getList(type){
        if(type==="card"){
            return (
                <Card.Group>
                    {this.state.rows.map((data, index) => {
                                var date = new Date(data.created);
                                var latest = data.lastVersion;
                                return (
                                    <Card key = {index.toString()} >
                                        {/* <Link to={"/replays/view/"+data._id} ><Image src={data.banner}/></Link> */}
                                        <Card.Content>
                                            <Card.Header><Link to={"/replays/view/"+data._id} >{latest.title}</Link></Card.Header>
                                        </Card.Content>
                                        <Card.Content>
                                            <Card.Meta>
                                                <Grid>
                                                    <Grid.Column className="tag_item">#{latest.backgroundTag}</Grid.Column>
                                                </Grid>
                                            </Card.Meta>
                                            <Card.Meta>
                                                <Grid columns="equal">
                                                    {latest.genreTags.map((tag, id) => { return <Grid.Column className="tag_item" key={id.toString()}>#{tag}</Grid.Column>}) }
                                                </Grid>
                                            </Card.Meta>
                                            <Card.Meta>
                                                <Grid columns="equal">
                                                    {latest.subTags.map((tag, id) => { return <Grid.Column className="tag_item" key={id.toString()}>#{tag}</Grid.Column>}) }
                                                </Grid>
                                            </Card.Meta>
                                            <Card.Meta>
                                                <Grid columns="equal">
                                                    {data.hashTags.map((tag, id) => { return <Grid.Column className="tag_item" key={id.toString()}>#{tag.name}</Grid.Column>}) }
                                                </Grid>
                                            </Card.Meta>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <Card.Meta>
                                                <Grid columns="equal">
                                                    <Grid.Column ><a  href={"/user/"+data.author.userName} ><Icon name="user"/>{data.author.userName}</a></Grid.Column>
                                                    <Grid.Column ><Icon name="eye"/>{data.view}</Grid.Column>
                                                    <Grid.Column ><Moment  format="YYYY-MM-DD HH:mm">{date}</Moment></Grid.Column>
                                                </Grid>
                                            </Card.Meta>
                                        </Card.Content>
                                    </Card>
                                    );
                            })
                    }
                </Card.Group>
                );
        }else if(type==="list"){
            return(
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <th><Button className= "btn align-btn" type="button" value="title" icon onClick= {this.onAlignClick}>제목<Icon name={this.getAlignIcon("title")}/></Button></th>
                            <th><Button className= "btn align-btn" type="button" value="ruleTag" icon onClick= {this.onAlignClick}>기반룰<Icon name={this.getAlignIcon("ruleTag")}/></Button></th>
                            <th><Button className= "btn align-btn" type="button"value='author' icon  onClick= {this.onAlignClick}>작성자<Icon name={this.getAlignIcon('author')}/></Button></th>
                            <th><Button className= "btn align-btn" type="button" value='view' icon  onClick= {this.onAlignClick}>조회수<Icon name={this.getAlignIcon('view')}/></Button></th>
                            <th><Button className= "btn align-btn" type="button" value='price' icon  onClick= {this.onAlignClick}>가격<Icon name={this.getAlignIcon('price')}/></Button></th>
                            <th>배경</th>
                            <th>장르</th>
                            <th>태그</th>
                            <th><Button className= "btn align-btn" type="button" value='created' icon  onClick= {this.onAlignClick}>발행<Icon name={this.getAlignIcon('created')}/></Button></th>
                    
                        </Table.Row>
                    </Table.Header>
                    <Table.Body id="data_tbody" basic>
                        {this.state.rows.map((data, index) => {
                            var date = new Date(data.created);
                            var latest = data.lastVersion;
                            return (
                                <Table.Row key = {index.toString()} >
                                    <Table.Cell>
                                        <Link to={"/replays/view/"+data._id} >{latest.title}</Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {data.ruleTag}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <a  href={"/user/"+data.author.userName} >{data.author.userName}</a>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {data.view}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {data.price}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <ul>
                                            <li className="tag_item">#{latest.backgroundTag}</li>
                                        </ul>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <ul>
                                            {latest.genreTags.map((tag, id) => { return <li className="tag_item" key={id.toString()}>#{tag}</li>}) }
                                        </ul>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <ul>
                                            {latest.subTags.map((tag, id) => { return <li className="tag_item" key={id.toString()}>#{tag}</li>}) }
                                        </ul>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Moment  format="YYYY-MM-DD HH:mm">{date}</Moment>
                                    </Table.Cell>
                                </Table.Row>
                                );
                        })
                }
                    </Table.Body>
                </Table>
                );
        }
    }

    render() {
        var select_rule;
        var select_genre;
        var select_background;
        var select_sub_tags;
        if (this.state.master_tags.length > 0) {
            var ruleTags = this.state.master_tags.find(tags => tags.name === "rule");
            select_rule = e("select", { className: "is-select2-select", name: "filter_rule", onChange: this.onReplaySearchSelected, multiple: "multiple", tabIndex: "-1", placeholder: "룰" },
                e("option", { value: "", selectd: "selected" }, "-"),
                ruleTags.tags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.tag);
                })
            )
            var genreTags = this.state.master_tags.find(tags => tags.name === "genre");
            select_genre = e("select", { className: "is-select2-select", onChange: this.onReplaySearchSelected, multiple: "multiple", name: "filter_genre", tabIndex: "-1", placeholder: "룰" },
                e("option", { value: "", selectd: "selected" }, "-"),
                genreTags.tags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.tag);
                })
            )
            var backgroundTags = this.state.master_tags.find(tags => tags.name === "background");
            select_background = e("select", { className: "is-select2-select", onChange: this.onReplaySearchSelected, multiple: "multiple", name: "filter_background", tabIndex: "-1", placeholder: "룰" },
                e("option", { value: "", selectd: "selected" }, "-"),
                backgroundTags.tags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.tag);
                })
            )
            var subTags = this.state.master_tags.find(tags => tags.name === "subTag");
            select_sub_tags = e("select", { className: "is-select2-select", onChange: this.onReplaySearchSelected, multiple: "multiple", name: "filter_sub_tags", tabIndex: "-1", placeholder: "룰" },
                e("option", { value: "", selectd: "selected" }, "-"),
                subTags.tags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.tag);
                })
            )
        }
    
        var component = 
        <div>            
            <span>리플레이</span>
            {typeof(this.props.currentUser) == 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!=null?<Link to='/replays/make'>새로 만들기</Link>:null}
            <div className="search_window">
                <form id= "tag-form" action="/replays/search" method= "POST">
                    <ul className = "search_ul" >
                        <li>
                            <input  id= "rdTag" type= "hidden" value= "" name= "tag"/>
                            <div   className= "form-field" >
                            <label  htmlFor= "filter_title">리플레이 제목</label>
                            <input  type= "text" size= "12" name= "filter_title" onChange={this.onReplaySearchChange}  placeholder= "찾을 리플레이 제목"/>
                            </div>
                        </li>
                        <li>
                            <div className= "form-field">
                                <label  htmlFor= "filter_author" > 작가</label>
                                <input  type= "text" size= "10" name= "filter_author" onChange={this.onReplaySearchChange} placeholder= "찾을 작가"/>
                            </div>
                        </li>
                        <li>
                            <div className= "form-field">
                                <label htmlFor="filter_rule">룰</label>
                                {select_rule}
                            </div>
                        </li> 
                        <li>
                            <div className= "form-field" >
                                <label  htmlFor= "filter_background" >배경</label>
                                {select_background}
                            </div>
                        </li>
                        <li>
                            <div className= "form-field" >
                                <label htmlFor= "filter_genre" >장르</label>
                                {select_genre}
                            </div>
                        </li>
                        <li>
                            <div className= "form-field" >
                                <label  htmlFor= "filter_sub_tags">태그</label>
                                {select_sub_tags}
                            </div>
                        </li>
                    </ul>
                    <ul className="search_ul">
                        <li>
                            <div className="form-field">
                                <label htmlFor="filter_price_min">가격</label>
                                <input type="number"  className="size_5" name="filter_price_min" onChange={ this.onReplaySearchChange} min='0' title="검색될 최소 가격 입력"/>
                                <span>~</span>
                                <input type= "number"  className="size_5" name= "filter_price_max" onChange={this.onReplaySearchChange} min='0' title="검색될 최대 가격 입력"/>
                            </div>
                        </li>
                    </ul>
                    <button type="submit" onClick={this.onReplaySearchSubmit}>검색</button>
                </form>
                <ul id="tag-list"></ul>
            </div>
            {/* <div className="order">
                <button className= "btn align-btn" type="button" value="title" onClick= {this.onAlignClick}>제목순</button>
                <button className= "btn align-btn" type="button" value='ruleTag' onClick= {this.onAlignClick}>룰순</button>
                <button className= "btn align-btn" type="button"value='author' onClick= {this.onAlignClick}>작가순</button>
                <button className= "btn align-btn" type="button" value='view' onClick= {this.onAlignClick}>조회수</button>
                <button className= "btn align-btn" type="button" value='price' onClick= {this.onAlignClick}>가격순</button>
                <button className= "btn align-btn" type="button" value='created' onClick= {this.onAlignClick}>발행순</button>
                {this.state.align_order === "ascending" ? <span className= "btn align-btn">내림차순</span> : <span className="btn align-btn">오름차순</span>}
            </div> */}
            
            <div className="view_type">
                <Button icon value="list" onClick={this.onViewClick}><Icon name="list layout"/></Button>
                <Button icon value="card" onClick={this.onViewClick}><Icon name="grid layout"/></Button>
            </div>
            {this.getList(this.state.viewType)}
        </div>

        return component;
    }
}

export default ArticleList;
// ReactDOM.render(e(ArticleList), document.querySelector('.articles_box'));

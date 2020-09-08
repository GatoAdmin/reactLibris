import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import HashTagsSearch from '../Layout/hashTagsSearch'
import {Switch, Route, Link} from 'react-router-dom';
import { Table, Form, Icon, Image, Card, Button } from 'semantic-ui-react'

const e = React.createElement;

const align_types = ['title', 'rule', 'author', 'view', 'price', 'created'];
class NewsArticleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            align_type: 'created',
            align_order: 'descending',
            filter_title: "",
            filter_author: "",
            filter_hash_tags: [],
            hash_tags: [],
            viewType: 'list',
        };
    }

    componentDidMount() {
        let getArticles = () => {
            axios.post('/news', {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            })
            .then(res => {
                this.setState({
                    rows: res.data.articles,
                    hash_tags: res.data.hashTags
                });
                })
            .catch(function (err) {
                console.log(err);
            })
        }
        getArticles();
    }

    onViewClick= (e) =>{
        e.preventDefault();
        var viewType = e.target.value;
        if(viewType !=null && viewType!=undefined){
            this.setState(() => ({viewType: viewType}));
        }
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
            axios.post('/news/search', {
                params: {
                    align_order: alignOrder,
                    align_type: alignType,
                    searchs: {
                        filter_title: this.state.filter_title,
                        filter_author: this.state.filter_author,
                        filter_hash_tags: this.state.filter_hash_tags,
                    }
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.articles,
                        hash_tags: res.data.hashTags
                    });

                    this.forceUpdate();
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }
    onNewsSearchChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }
        );
    }
    onNewsSearchSelected = (e) => {
        var options = Array.from(e.target.selectedOptions, option => option.value);
        this.setState({
            [e.target.name]: options
        }
        );
    }
    onNewsSearchSubmit = (e) => {
        e.preventDefault();
        let getArticles = () => {
            axios.post('/news/search', {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type,
                    searchs: {
                        filter_title: this.state.filter_title,
                        filter_author: this.state.filter_author,
                        filter_hash_tags: this.state.filter_hash_tags,
                    }
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.articles,
                        hash_tags: res.data.hashTags
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }
    getAlignIcon(order){
        if(this.state.align_type === order){
            return this.state.align_order === "ascending" ?"sort down" : "sort up"
        }else{
            console.log(this.state.align_type)
            return null;
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
                                        <Link to={"/news/view/"+data._id} ><Image src={data.banner.length>0?"/"+data.banner[0].imageData:null}/></Link>
                                        <Card.Content>
                                            <Card.Header><Link to={"/news/view/"+data._id} >{latest.title}</Link></Card.Header>
                                            <Card.Description><Link to={"/news/view/"+data._id} >내용</Link></Card.Description>
                                            <Card.Meta>
                                                <Moment  format="YYYY-MM-DD HH:mm">{date}</Moment>
                                            </Card.Meta>
                                            <Card.Meta>
                                                <ul>
                                                    {data.hashTags.map((tag, id) => { return <li className="tag_item" key={id.toString()}>#{tag}</li>}) }
                                                </ul>
                                            </Card.Meta>
                                        </Card.Content>
                                        <Card.Content extra>
                                                <a  href={"/user/"+data.author.userName} ><Icon name="user"/> {data.author.userName}</a>
                                                <Icon name="eye"/>{data.view}
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
                    {/* <thead>
                        <tr>
                            <th><Button className= "btn align-btn" type="button" value="title" icon onClick= {this.onAlignClick}>제목<Icon name={this.getAlignIcon("title")}/></Button></th>
                            <th><Button className= "btn align-btn" type="button"value='author' icon  onClick= {this.onAlignClick}>작성자<Icon name={this.getAlignIcon('author')}/></Button></th>
                            <th><Button className= "btn align-btn" type="button" value='view' icon  onClick= {this.onAlignClick}>조회수<Icon name={this.getAlignIcon('view')}/></Button></th>
                            <th>태그</th>
                            <th><Button className= "btn align-btn" type="button" value='created' icon  onClick= {this.onAlignClick}>발행<Icon name={this.getAlignIcon('created')}/></Button></th>
                        </tr>
                    </thead> */}
                    <Table.Body id="data_tbody" basic>
                    {this.state.rows.map((data, index) => {
                                var date = new Date(data.created);
                                var latest = data.lastVersion;
                                return (
                                    <Table.Row key = {index.toString()} >
                                        <Table.Cell>
                                            <Link to={"/news/view/"+data._id} ><Image src={data.banner.length>0?"/"+data.banner[0].imageData:null}/></Link>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Table.Row><Link to={"/news/view/"+data._id} >{latest.title}</Link></Table.Row>
                                            <Table.Row><Link to={"/news/view/"+data._id} >내용</Link></Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                <Icon name="user"/> <a  href={"/user/"+data.author.userName} >{data.author.userName}</a>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Icon name="eye"/>{data.view}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <ul>
                                                        {data.hashTags.map((tag, id) => { return <li className="tag_item" key={id.toString()}>#{tag}</li>}) }
                                                    </ul>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Cell>
                                        {/* <Table.Cell>
                                            <Moment  format="YYYY-MM-DD HH:mm">{date}</Moment>
                                        </Table.Cell> */}
                                    </Table.Row>
                                    );
                            })
                    }
                    </Table.Body>
                </Table>
                );
        }
    }

    onChangeHashTags = (value)=>{
        if(value!=undefined&&value!=null){
            console.log(value);
            this.setState(()=>({filter_hash_tags:value}))
        }
    }

    render() {
        var select_hash_tags;
        if (this.state.hash_tags.length > 0) {
            var hashTags = this.state.hash_tags;
            select_hash_tags = e("select", { className: "is-select2-select", onChange: this.onNewsSearchSelected, multiple: "multiple", name: "filter_hash_tags", tabIndex: "-1", placeholder: "해쉬태그" },
                e("option", { value: "", selectd: "selected" }, "-"),
                hashTags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.name);
                })
            )
        }
        var component = 
        <div>            
            <span>뉴스</span>
            <div className="search_window">
                <Form id= "tag-form" action="/news/search" method= "POST">
                        <Form.Input  id= "rdTag" type= "hidden" value= "" name= "tag"/>
                    <Form.Group widths='equal' className = "search_ul" >
                        <div   className= "form-field" >
                            <Form.Input  type= "text" label="뉴스 제목" name= "filter_title" onChange={this.onNewsSearchChange}  placeholder= "찾을 뉴스 제목"/>
                        </div>
                        <div className= "form-field">                                
                            <Form.Input  type= "text" label="작가" name= "filter_author" onChange={this.onNewsSearchChange} placeholder= "찾을 작가"/>
                        </div>
                    </Form.Group>
                    
                    <div className= "form-field" >
                            {/* <label  htmlFor= "filter_hash_tags">태그</label> */}
                            <HashTagsSearch tags={this.state.hash_tags} onChangeHashTags={this.onChangeHashTags}/>
                        </div>
                    <Button type="submit" onClick={this.onNewsSearchSubmit}>검색</Button>
                </Form>
                <ul id="tag-list"></ul>
            </div>
            <div className="view_type">
                <Button icon value="list" onClick={this.onViewClick}><Icon name="list layout"/></Button>
                <Button icon value="card" onClick={this.onViewClick}><Icon name="grid layout"/></Button>
            </div>
            {this.state.rows.length>0?this.getList(this.state.viewType):<span>검색하신 결과를 찾지 못했어요 ;ㅂ;</span>}
        </div>

        return component;
    }
}

export default NewsArticleList;

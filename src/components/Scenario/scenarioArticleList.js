import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import { Grid, Card, Icon, Form, Image, Table, Button, Label } from 'semantic-ui-react'

const e = React.createElement;

const align_types = ['title', 'rule', 'author', 'view', 'price', 'created'];
class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_show_detail_filter:false,
            rows: [],
            align_type: 'created',
            align_order: 'descending',
            filter_title: "",
            filter_author: "",
            filter_capacity_min: "",
            filter_capacity_max: "",
            filter_time_min: "",
            filter_time_max: "",
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
            axios.post('/scenarios', {
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
        if(alignType=== this.state.align_type){
            alignOrder = alignOrder === "descending" ? "ascending" : "descending";
        }
        
        this.setState(() => ({
            align_type: alignType,
            align_order: alignOrder
        }));
        
        let getArticles = () => {
            axios.post('/scenarios/search', {
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
                        filter_capacity_min: this.state.filter_capacity_min,
                        filter_capacity_max: this.state.filter_capacity_max,
                        filter_time_min: this.state.filter_time_min,
                        filter_time_max: this.state.filter_time_max ,
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
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }
    onScenarioSearchChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }
        );
    }
    onScenarioSearchSelected = (e, data) => {
        this.setState({
            [data.name]: data.value
        }
        );
    }
    onScenarioSearchSubmit = (e) => {
        e.preventDefault();
        let getArticles = () => {
            axios.post('/scenarios/search', {
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
                        filter_capacity_min: this.state.filter_capacity_min,
                        filter_capacity_max: this.state.filter_capacity_max,
                        filter_time_min: this.state.filter_time_min,
                        filter_time_max: this.state.filter_time_max ,
                        filter_price_min: this.state.filter_price_min ,
                        filter_price_max: this.state.filter_price_max ,
                    }
                }
            })
                .then(res => {
                    console.log(res.data.articles);
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
    getAlignIcon(order){
        if(this.state.align_type === order){
            return this.state.align_order === "ascending" ?"sort down" : "sort up"
        }else{
            return "";
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
    
    setShowFilter(){
        this.setState((prevState)=>({is_show_detail_filter:!prevState.is_show_detail_filter}))
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
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value="title" icon onClick= {this.onAlignClick}>제목<Icon name={this.getAlignIcon("title")}/></Button></Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value="ruleTag" icon onClick= {this.onAlignClick}>기반룰<Icon name={this.getAlignIcon("ruleTag")}/></Button></Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button"value='author' icon  onClick= {this.onAlignClick}>작성자<Icon name={this.getAlignIcon('author')}/></Button></Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value='view' icon  onClick= {this.onAlignClick}>조회수<Icon name={this.getAlignIcon('view')}/></Button></Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value='price' icon  onClick= {this.onAlignClick}>가격<Icon name={this.getAlignIcon('price')}/></Button></Table.HeaderCell>
                            <Table.HeaderCell>배경</Table.HeaderCell>
                            <Table.HeaderCell>장르</Table.HeaderCell>
                            <Table.HeaderCell>태그</Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value='created' icon  onClick= {this.onAlignClick}>발행<Icon name={this.getAlignIcon('created')}/></Button></Table.HeaderCell>
                   </Table.Header>

                    <Table.Body id="data_tbody" basic>
                        {this.state.rows.map((data, index) => {
                            var date = new Date(data.created);
                            var latest = data.lastVersion;
                            return (
                                <Table.Row key = {index.toString()} >
                                    <Table.Cell>
                                        <Link to={"/scenarios/view/"+data._id} >{data.title}</Link>
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
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column className="tag_item">#{latest.backgroundTag}</Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Grid>
                                            <Grid.Row>
                                                {latest.genreTags.map((tag, id) => { return <Grid.Column className="tag_item" key={id.toString()}>#{tag}</Grid.Column>}) }
                                            </Grid.Row>
                                        </Grid>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Grid>
                                            <Grid.Row>
                                                {latest.subTags.map((tag, id) => { return <Grid.Column className="tag_item" key={id.toString()}>#{tag}</Grid.Column>}) }
                                            </Grid.Row>
                                        </Grid>
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
                // e(Table, null,
                //     e(Table.Header, null,
                //         e(Table.Row, null,
                //             e("th",null, e(Button,{className:"btn align-btn", type:"button", value:"title" ,icon:true ,onClick:this.onAlignClick},"제목"  ,e(Icon,{name:this.getAlignIcon("title")})) ),
                //             e("th",null, e(Button,{className:"btn align-btn", type:"button", value:"ruleTag" ,icon:true ,onClick:this.onAlignClick},"사용룰",e(Icon,{name:this.getAlignIcon("ruleTag")}))  ),
                //             e("th",null, e(Button,{className:"btn align-btn", type:"button", value:"author" ,icon:true ,onClick:this.onAlignClick},"작가"  ,e(Icon,{name:this.getAlignIcon("author")}))  ),
                //             e("th",null, e(Button,{className:"btn align-btn", type:"button", value:"view" ,icon:true ,onClick:this.onAlignClick},"조회수",e(Icon,{name:this.getAlignIcon( "view")}))    ),
                //             e("th",null, e(Button,{className:"btn align-btn", type:"button", value:"price" ,icon:true ,onClick:this.onAlignClick},"가격"  ,e(Icon,{name:this.getAlignIcon( "price")}))  ),
                //             e("th",null,"배경"),
                //             e("th",null,"장르"),
                //             e("th",null,"태그"),
                //             e("th",null, e(Button,{className:"btn align-btn", type:"button", value:"created" ,icon:true ,onClick:this.onAlignClick},"발행일",e(Icon,{name:this.getAlignIcon("created")}))   )
                //         )
                //     ),
                //     e(Table.Body, { id: "data_tbody" },
                //         this.state.rows.map((data, index) => {
                //             var date = new Date(data.created);//.format('yyyy-MM-dd HH:mm');
                //             var latest = data.lastVersion;//.last();
                //             return e(Table.Row, { key: index.toString() },
                //                 e(Table.Cell, null,
                //                     e("a", { href: "/scenarios/view/" + data._id }, latest.title)),
                //                 e(Table.Cell, null, data.ruleTag),
                //                 e(Table.Cell, null, e("a", { href: "/user/" + data.author.userName }, data.author.userName)),
                //                 e(Table.Cell, null, data.view),
                //                 e(Table.Cell, null, data.price),
                //                 e(Table.Cell, null,
                //                     e("ul", null,
                //                         e("li", { className: "tag_item" }, "#" + latest.backgroundTag)
                //                     )
                //                 ),
                //                 e(Table.Cell, null,
                //                     e("ul", null,
                //                     latest.genreTags.map((tag, id) => {
                //                             return e("li", { className: "tag_item", key: id.toString() }, "#" + tag);
                //                         })
                //                     )
                //                 ),
                //                 e(Table.Cell, null, e("ul", null,
                //                 latest.subTags.map((tag, id) => {
                //                         return e("li", { className: "tag_item", key: id.toString() }, "#" + tag);
                //                     })
                //                 )
                //                 ),
                //                 e(Table.Cell, null, e(Moment,{format:"YYYY-MM-DD HH:mm"},date))

                //             );
                //         })
                //     )
                // )
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
            select_rule = ruleTags.tags.map((tag, id) => {
                        return { value: tag._id, key: id.toString(), text:tag.tag };
                    })
            var genreTags = this.state.master_tags.find(tags => tags.name === "genre");
            select_genre = genreTags.tags.map((tag, id) => {
                return { value: tag._id, key: id.toString(), text:tag.tag };
            })
            var backgroundTags = this.state.master_tags.find(tags => tags.name === "background");
            select_background = backgroundTags.tags.map((tag, id) => {
                return { value: tag._id, key: id.toString(), text:tag.tag };
            })
            var subTags = this.state.master_tags.find(tags => tags.name === "subTag");
            select_sub_tags = subTags.tags.map((tag, id) => {
                return { value: tag._id, key: id.toString(), text:tag.tag };
            })
        }
        var header =
        <div>
            <div className="search_window">
                <Form id="tag-form"  onSubmit={(e)=>this.onScenarioSearchSubmit(e)}>
                    <Form.Group>
                        <Form.Input id="rdTag" type="hidden" value="" name="tag"/>
                        <Form.Input label="시나리오 제목" tpye="text" width={4} name="filter_title" onChange={(e)=> this.onScenarioSearchChange(e)} placeholder= "찾을 시나리오 제목"/>
                        <Form.Input label="작가" tpye="text" width={4} name="filter_author" onChange={(e)=> this.onScenarioSearchChange(e)} placeholder= "찾을 작가"/>

                        <Form.Select 
                                label='룰'
                                name= "filter_rule"
                                multiple
                                onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                options={select_rule}
                                placeholder='찾을 룰'/>
                    </Form.Group>  
                    {this.state.is_show_detail_filter?<div>
                    <Form.Group className='detail-filter'>
                        <Form.Select 
                                label='장르'
                                name= "filter_genre"
                                multiple
                                onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                options={select_genre}
                                placeholder='찾을 장르'/>

                        <Form.Select 
                                label='배경'
                                name= "filter_background"
                                multiple
                                onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                options={select_background}
                                placeholder='찾을 배경'/>     
                        <Form.Select 
                                label='태그'
                                name= "filter_sub_tags"
                                multiple
                                onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                options={select_sub_tags}
                                placeholder='찾을 태그'/>                                                              
                    </Form.Group>
                    <Form.Group className='detail-filter' inline>
                        <Form.Group><Label>인원수</Label><Form.Input type="number" name="filter_capacity_min" onChange={()=>this.onScenarioSearchChange} min={1} placeholder='최소 인원수'/><span className='dash'>~</span><Form.Input lable="" type="number" name="filter_capacity_max" onChange={()=>this.onScenarioSearchChange} min={1} placeholder='최대 인원수'/></Form.Group>
                        <Form.Group><Label>가격</Label><Form.Input type="number" name="filter_price_min" onChange={()=>this.onScenarioSearchChange} min={0} placeholder='최소 가격'/><span className='dash'>~</span><Form.Input lable="" type="number" name="filter_price_max" onChange={()=>this.onScenarioSearchChange} min={0} placeholder='최대 가격'/></Form.Group>
                        <Form.Group><Label>시간</Label><Form.Input type="number" name="filter_time_min" onChange={()=>this.onScenarioSearchChange} min={0} placeholder='최소 시간'/><span className='dash'>~</span><Form.Input lable="" type="number" name="filter_time_max" onChange={()=>this.onScenarioSearchChange} min={0} placeholder='최대 시간'/></Form.Group>
                    </Form.Group>
                    <Button type="button" onClick={()=>this.setShowFilter()}>상세 검색 닫기</Button>
                    </div> :<Button type="button" onClick={()=>this.setShowFilter()}>상세 검색</Button>
                    }
                    <Form.Button type="submit">검색</Form.Button>
                </Form>
            </div>
            <div className="view_type">
                    <Button icon value="list" onClick={()=>this.onViewClick}><Icon name="list layout"/></Button>
                    <Button icon value="card" onClick={()=>this.onViewClick}><Icon name="grid layout"/></Button>
            </div>
        </div>
        var component = <div>
            {header}
            {this.getList(this.state.viewType)}
        </div>
        return component;
    }
}

export default ArticleList;



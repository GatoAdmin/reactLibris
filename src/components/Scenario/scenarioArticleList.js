import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import { Grid, Card, Icon, Form, Image, Table, Button, Label, Select,Dropdown } from 'semantic-ui-react'
import Pagination from 'rc-pagination';
import Selection from 'rc-select';
import localeInfo from 'rc-pagination/es/locale/ko_KR';
import '../../dist/rc-select_index.css';
import 'rc-pagination/assets/index.css';

const e = React.createElement;
const src = 'https://react.semantic-ui.com/images/wireframe/image.png'
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
            view_type:'card',
            total_size:0,
            current_page:1,
            page_size: 30,
        };
    }

    componentDidMount() {
        let getArticles = () => {
            // const params = new url.URLSearchParams({ foo: 'bar' });
            axios.post('/scenarios', {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            },{params:{p:this.state.current_page, ps:this.state.page_size}})
                .then(res => {
                    console.log(res.data)
                    this.setState({
                        rows: res.data.articles,
                        total_size:  res.data.totalSize,
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
            },{params:{p:this.state.current_page, ps:this.state.page_size}})
                .then(res => {
                    this.setState({
                        rows: res.data.articles,
                        total_size:  res.data.totalSize,
                        master_tags: res.data.masterTags
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }

    onChangePage = (page, pageSize) =>{
        this.setState({current_page: page})
        axios.post('/scenarios',null,{params:{p:page, ps:pageSize}})
             .then(res=>{
                 this.setState({
                     rows: res.data.articles
                 })
             })
             .catch(function (err) {
                 console.log(err);
             })
    }
    onShowSizeChange = (current, pageSize) => {
        this.setState({page_size: pageSize });
      };

    onScenarioSearchChange = (e, data) => {
        this.setState({
            [data.name]: data.value
        }
        );
    }
    onScenarioSearchSelected = (e, data) => {
        this.setState({
            [data.name]: data.value
        }
        );
    }
    onClickTag =(name, tagText)=>{
        var select_tag =[];

        if (this.state.master_tags.length > 0) {
            if(name === 'filter_rule'){
                select_tag.push(this.state.master_tags.find(tags => tags.name === "rule").tags.find(tag=>tag.tag===tagText)._id); 
            }else if(name === 'filter_background'){
                select_tag.push(this.state.master_tags.find(tags => tags.name === "background").tags.find(tag=>tag.tag===tagText)._id);
            }else if(name === 'filter_genre'){
                select_tag.push(this.state.master_tags.find(tags => tags.name === "genre").tags.find(tag=>tag.tag===tagText)._id);
            }else if(name === 'filter_sub_tags'){
                select_tag.push(this.state.master_tags.find(tags => tags.name === "subTag").tags.find(tag=>tag.tag===tagText)._id);
            }
        }
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
            },{params:{p:1, ps:this.state.page_size}})
                .then(res => {
                    console.log(res.data.articles);
                    this.setState({
                        rows: res.data.articles,
                        total_size:  res.data.totalSize
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        this.setState({[name]:select_tag, is_show_detail_filter:true },()=>getArticles());
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
                        total_size:  res.data.totalSize,
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
            return "sort";
        }
    }
    
    onViewClick= (e, data) =>{
        e.preventDefault();
        var viewType = data.value;
        if(viewType !=null && viewType!=undefined){
            this.setState(() => ({view_type: viewType}));
        }
    }
    
    setShowFilter(){
        this.setState((prevState)=>({is_show_detail_filter:!prevState.is_show_detail_filter}))
    }

    getList(type){
        if(type==="card"){
            return (
                <Card.Group className="margin-top-1 margin-bottom-1" itemsPerRow={5}>
                    {this.state.rows.map((data, index) => {
                                var date = new Date(data.created);
                                var latest = data.lastVersion;
                                return (
                                    <Card key = {index.toString()} >
                                        <Image className="card_banner" as={Link} to={"/scenarios/view/"+data._id} src={data.banner!=undefined?data.banner.imageData!==undefined?"/"+data.banner.imageData:src:src} wrapped ui={false} />
                                        <Card.Content>
                                            <Card.Header className="ellipsis"><Link to={"/scenarios/view/"+data._id}>{data.title}</Link></Card.Header>
                                            <Card.Meta><Link to={"/user/"+data.author.userName}><Icon name="user"/>{data.author.userName}</Link></Card.Meta>
                                            <Card.Meta className="card-tags">
                                                <Label className="tag-item background-tag" as={Button} onClick={()=>this.onClickTag('filter_background',data.backgroundTag)}  content={data.backgroundTag} icon='hashtag' />                                                
                                                    {data.genreTags.map((tag, id) => { return <Label className="tag-item genre-tag" key={id.toString()}  as={Button} onClick={()=>this.onClickTag('filter_genre',tag)}  content={tag} icon='hashtag' />}) }                                               
                                                    {data.subTags.map((tag, id) => { return <Label className="tag-item sub-tag" key={id.toString()}  as={Button} onClick={()=>this.onClickTag('filter_sub_tags',tag)}  content={tag} icon='hashtag' />}) }                                                
                                                    {/* {data.hashTags.map((tag, id) => { return <Label className="tag-item" key={id.toString()}  content={tag} icon='hashtag' />}) } */}                                               
                                            </Card.Meta>
                                        </Card.Content>
                                        <Card.Content extra>
                                            <Card.Meta>
                                                <Grid columns="equal">
                                                    <Grid.Column ><Icon name="eye"/>{data.view}</Grid.Column>
                                                    <Grid.Column className="text-right"><Moment  format="YY-MM-DD">{date}</Moment></Grid.Column>
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
                <Table  basic='very'>
                    <Table.Header >
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value="title" icon onClick= {this.onAlignClick}>제목<Icon name={this.getAlignIcon("title")}disabled={this.getAlignIcon('title')==="sort"?true:false}/></Button></Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value="ruleTag" icon onClick= {this.onAlignClick}>기반룰<Icon name={this.getAlignIcon("ruleTag")}disabled={this.getAlignIcon('ruleTag')==="sort"?true:false}/></Button></Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button"value='author' icon  onClick= {this.onAlignClick}>작성자<Icon name={this.getAlignIcon('author')}disabled={this.getAlignIcon('author')==="sort"?true:false}/></Button></Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value='view' icon  onClick= {this.onAlignClick}>조회수<Icon name={this.getAlignIcon('view')}disabled={this.getAlignIcon('view')==="sort"?true:false}/></Button></Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value='price' icon  onClick= {this.onAlignClick}>가격<Icon name={this.getAlignIcon('price')} disabled={this.getAlignIcon('price')==="sort"?true:false}/></Button></Table.HeaderCell>
                            {/* <Table.HeaderCell>배경</Table.HeaderCell>
                            <Table.HeaderCell>장르</Table.HeaderCell> */}
                            <Table.HeaderCell>태그</Table.HeaderCell>
                            <Table.HeaderCell><Button className= "btn align-btn" type="button" value='created' icon  onClick= {this.onAlignClick}>발행<Icon name={this.getAlignIcon('created')}disabled={this.getAlignIcon('created')==="sort"?true:false}/></Button></Table.HeaderCell>
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
                                    <Table.Cell className="text-center">
                                        {data.view}
                                    </Table.Cell>
                                    <Table.Cell className="text-center">
                                        {data.price===0?"무료":data.price}
                                    </Table.Cell>
                                    {/* <Table.Cell>
                                        <Grid>
                                            <Grid.Column>
                                                <Label className="tag_item" as='a' content={latest.backgroundTag} icon='hashtag' />
                                            </Grid.Column>
                                        </Grid>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Grid>
                                            <Grid.Column>
                                                {latest.genreTags.map((tag, id) => { return <Label className="tag_item" key={id.toString()} as='a' content={tag} icon='hashtag' />}) }
                                            </Grid.Column>
                                        </Grid>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Grid>
                                            <Grid.Column>
                                                {latest.subTags.map((tag, id) => { return <Label className="tag_item" key={id.toString()} as='a' content={tag} icon='hashtag' />}) }
                                            </Grid.Column>
                                        </Grid>
                                    </Table.Cell> */}
                                    
                                    <Table.Cell>
                                        <Label className="tag-item background-tag"  as={Button} onClick={()=>this.onClickTag('filter_background',latest.backgroundTag)}  content={latest.backgroundTag} icon='hashtag' />
                                    
                                        {latest.genreTags.map((tag, id) => { return <Label className="tag-item genre-tag" key={id.toString()} as={Button} onClick={()=>this.onClickTag('filter_genre',tag)} content={tag} icon='hashtag' />}) }
                                    
                                        {latest.subTags.map((tag, id) => { return <Label className="tag-item sub-tag" key={id.toString()} as={Button} onClick={()=>this.onClickTag('filter_sub_tags',tag)} content={tag} icon='hashtag' />}) }
                                            
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Moment  format="YY-MM-DD">{date}</Moment>
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

    makeArticle(){
        axios.post('/scenarios/make')
            .then(res => {
                window.location.href = `/scenarios/edit/${res.data.id}`;
            })
            .catch(function (err) {
                console.log(err);
            })
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
        // selectComponentClass={<Select className="ui select" options={}/>}

        var header =
        <div>
            {typeof(this.props.currentUser) == 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!=null?<Button onClick={()=>this.makeArticle()}>새로 만들기</Button>:null}
            <div className="search_window">
                {this.state.is_show_detail_filter?
                <div className="form-box">
                <Form id="tag-form"  onSubmit={(e)=>this.onScenarioSearchSubmit(e)}>
                    <Form.Group className="main-search-box  text-left" inline>
                        {/* <Form.Input id="rdTag" type="hidden" value="" name="tag"/> */}
                        <Form.Input label="시나리오 제목" tpye="text"  name="filter_title" onChange={(e)=> this.onScenarioSearchChange(e)} placeholder= "찾을 시나리오 제목"/>
                        <Form.Input label="작가" tpye="text" name="filter_author" onChange={(e)=> this.onScenarioSearchChange(e)} placeholder= "찾을 작가"/>

                        <Form.Select 
                                label='룰'
                                name= "filter_rule"
                                multiple
                                onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                options={select_rule}
                                value={this.state.filter_rule}
                                placeholder='찾을 룰'/>           
                        <Form.Button className="filter-submit" type="submit" color="violet">검색</Form.Button>
                    </Form.Group>  
                    <Grid>
                        <Grid.Row  centered>   
                            <Form.Group className='detail-filter text-left' inline>
                                <Form.Select 
                                            label='배경'
                                            name= "filter_background"
                                            multiple
                                            onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                            options={select_background}
                                            value={this.state.filter_background}
                                            placeholder='찾을 배경'/> 
                                
                                <Form.Select 
                                        label='장르'
                                        name= "filter_genre"
                                        multiple
                                        onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                        options={select_genre}
                                        value={this.state.filter_genre}
                                        placeholder='찾을 장르'/>  
                                <Form.Select 
                                        label='태그'
                                        name= "filter_sub_tags"
                                        multiple
                                        onChange={(e,data)=>this.onScenarioSearchSelected(e,data)}
                                        options={select_sub_tags}
                                        value={this.state.filter_sub_tags}
                                        placeholder='찾을 태그'/>   
                                   
                                <div className='detail-filter-secondary'>
                                    <Form.Group className="text-left" inline>    
                                        <Form.Input className="search-number " type="number" name="filter_capacity_min" onChange={(e, data)=>this.onScenarioSearchChange(e, data)} min={1} label='인원수' placeholder="최소"/>
                                            {/* <Label className='dash'>~</Label> */}
                                        <Form.Input className="search-number search-number-right" label="" type="number" name="filter_capacity_max" onChange={(e, data)=>this.onScenarioSearchChange(e, data)} min={1} placeholder="최대"/>
                                    </Form.Group>
                                <Form.Group className="text-left" inline><Form.Input className="search-number " type="number" name="filter_time_min" onChange={(e, data)=>this.onScenarioSearchChange(e, data)} min={0} label='시간' placeholder="최소"/>
                                    {/* <Label className='dash'>~</Label> */}
                                    <Form.Input className="search-number search-number-right" label="" type="number" name="filter_time_max" onChange={(e, data)=>this.onScenarioSearchChange(e, data)} min={0} placeholder="최대"/></Form.Group>                                                       
                                <Form.Group className="text-left" inline><Form.Input className="search-number" type="number" name="filter_price_min" onChange={(e, data)=>this.onScenarioSearchChange(e, data)} min={0} label='가격' placeholder="최소"/>
                                    {/* <Label className='dash'>~</Label> */}
                                    <Form.Input className="search-number search-number-right" label="" type="number" name="filter_price_max" onChange={(e, data)=>this.onScenarioSearchChange(e, data)} min={0} placeholder="최대"/></Form.Group>
                            
                                </div>  
                            </Form.Group>
                        </Grid.Row>
                    </Grid>
                
                </Form>
                </div>:null}
                {this.state.is_show_detail_filter?<Grid>
                        <Grid.Row centered>
                        <Button className="detail-search-button" type="button" onClick={()=>this.setShowFilter()}>상세 검색 닫기</Button>
                        </Grid.Row>
                    
                    </Grid> :<Grid><Grid.Row centered><Button className="detail-search-button"  type="button" onClick={()=>this.setShowFilter()}>상세 검색</Button></Grid.Row></Grid>
                } 
            </div>
            <div className="view_type">
                    <Button icon value="list" onClick={(e, data)=>this.onViewClick(e, data)}><Icon name="list layout"/></Button>
                    <Button icon value="card" onClick={(e, data)=>this.onViewClick(e, data)}><Icon name="grid layout"/></Button>
            </div>
        </div>
        var component = <div>
            {header}
            {this.getList(this.state.view_type)}
            <Pagination
                className="text-center pagination"
                selectComponentClass={Selection}
                showSizeChanger
                totalBoundaryShowSizeChanger={50}
                pageSizeOptions	={[30,50,100]}
                pageSize={this.state.page_size}
                onShowSizeChange={this.onShowSizeChange}
                defaultCurrent={1}
                onChange={(p,ps)=>this.onChangePage(p,ps)}
                total={this.state.total_size}
                locale={localeInfo}
            />
        </div>
        return component;
    }
}

export default ArticleList;



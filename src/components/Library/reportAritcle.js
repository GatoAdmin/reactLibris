import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import {Button, Table, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
const e = React.createElement;

class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            href:window.location.href,
            align_type: 'created',
            align_order: 'descending',
        };
    }

    componentDidMount() {
        let getArticles = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            })
                .then(res => {
                    console.log(res)
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
    componentDidUpdate(prevProps, prevState){
        console.log(window.location.href);
        if (window.location.href !== prevState.href) {    
            let getArticles = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            })
                .then(res => {
                    console.log(res)
                    this.setState({
                        rows: res.data.articles,
                    });
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
        this.setState({href:window.location.href});
        }
    }
    onAlignClick = (event) => {
        event.preventDefault();
        var alignType=event.target.value;
        var alignOrder = this.state.align_order;
        if(alignType== this.state.align_type){
            alignOrder = alignOrder === "descending" ? "ascending" : "descending";
        }
        
        this.setState(() => ({
            align_type: alignType,
            align_order: alignOrder
        }));
        
        let getArticles = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: alignOrder,
                    align_type: alignType,
                    // searchs: {
                    //     filter_title: this.state.filter_title,
                    //     filter_author: this.state.filter_author,
                    //     filter_rule: this.state.filter_rule,
                    // }
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

    onSearchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        }
        );
    }

    onSearchSelected = (event) => {
        var options = Array.from(event.target.selectedOptions, option => option.value);
        this.setState({
            [event.target.name]: options
        }
        );
    }
    onSearchSubmit = (event) => {
        event.preventDefault();
        let getArticles = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type,
                    // searchs: {
                    //     filter_title: this.state.filter_title,
                    //     filter_author: this.state.filter_author,
                    //     filter_rule: this.state.filter_rule,
                    // }
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

    onChangeMemo = (event) => {
        this.setState({
            memo: event.target.value
        }
        );
    }
    editMemoMode =(event)=>{
        event.preventDefault();
        var target = event.target.parentElement.parentElement;
        var editMemo = target.getAttribute('data-memo');
        var targetMemo = target.querySelector('.bookmarkMemo');
        this.setState({
            memo:targetMemo.querySelector('span').innerText,
            editMemo:editMemo
        });
    }

    onSubmitMemo = (event) => {
        event.preventDefault();
        var target = event.target.parentElement.parentElement.parentElement;
        var targetId = target.getAttribute('data-bookmark');
        var targetVersion = target.getAttribute('data-version');
        let getArticles = () => {
            axios.post(window.location.href+"/memo", {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type,
                    memo:{
                        text : this.state.memo,
                        article : targetId,
                        version:targetVersion
                    }
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.articles,
                        master_tags: res.data.masterTags,
                        memo:"",
                        editMemo:-1
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }

    bookmarkRemove = (event) => {
        event.preventDefault();
        var target = event.target.parentElement.parentElement;
        var targetId = target.getAttribute('data-bookmark');
        var targetVersion = target.getAttribute('data-version');
        let getArticles = () => {
            axios.post(window.location.href+"/delete", {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type,
                    delete:{
                        article : targetId,
                        version:targetVersion
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

    render() {
        var urlStringLast  = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

        var saveButton = e("button",{type:"button", onClick:this.onSubmitMemo},"저장");
        var component = <div>
            <Table>
                <Table.Header>
                    <Table.HeaderCell>
                        <Button className="align-btn" type='button' value="title" onClick={(e)=>this.onAlignClick(e)} >
                            제목</Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <Button className="align-btn" type='button' value="title" onClick={(e)=>this.onAlignClick(e)} >
                            상태</Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <Button className="align-btn" type='button' value="title" onClick={(e)=>this.onAlignClick(e)} >
                            제한 이유</Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        <Button className="align-btn" type='button' value="title" onClick={(e)=>this.onAlignClick(e)} >
                            이의제기</Button>
                    </Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {
                        this.state.rows.map((data, index)=>{
                            this.state.rows.map((data, index) => {
                                var date = new Date(data.created);
                                console.log(data);
                                var version = data.lastVersion;
                                return( <Table.Row key={index}>
                                        <Table.Cell>
                                            <Link to={"/"+urlStringLast+"/view/" + data._id+"/"+data.version}></Link>
                                        </Table.Cell>
                                    </Table.Row>)
                                // return e("tr", { key: index.toString(), 'data-memo':index, "data-bookmark":data._id},
                                //     e("td", null,
                                //         e("a", { href:  }, version.title)),
                                //     e("td", null, data.ruleTag),
                                //     e("td", null, e("a", { href: "/user/" + data.author.userName }, data.author.userName)), 
                                //     e("td", {className:"bookmarkMemo"}, this.state.editMemo == index?e('span',null,e('input',{type:'text',value:this.state.memo,onChange:this.onChangeMemo}),saveButton) :e('span',null,data.memo)
                                //     ),
                                //     e("td", null, e(Moment,{format:"YYYY-MM-DD HH:mm"},date)),
                                //     e("td",null,e("button",{type:"button", onClick:this.editMemoMode},"수정")),
                                //     e("td",null,e("button",{type:"button", onClick:this.bookmarkRemove},"해제"))
                                // );
                            })

                        })
                    }
                </Table.Body>
            </Table>
        </div>
            e("div", null,
                e("button", {
                    className: "btn align-btn",
                    type:"button",
                    value:"title",
                    onClick: this.onAlignClick,
                }, "제목순"),
                e("button", {
                    className: "btn align-btn",
                    type:"button",
                    value:'ruleTag', 
                    onClick: this.onAlignClick,
                }, "룰순"),
                e("button", {
                    className: "btn align-btn",
                    type:"button",
                    value:'author', 
                    onClick: this.onAlignClick,
                }, "작가순"),
                e("button", {
                    className: "btn align-btn",
                    type:"button",
                    value:'created',
                    onClick: this.onAlignClick,
                }, "북마크일순"),
                this.state.align_order === "ascending" ? e("button", {
                    className: "btn align-btn",
                    onClick: () =>
                        this.setState({
                            align_order: 'descending'
                        }),
                }, "내림차순")
                    : e("button", {
                        className: "btn align-btn",
                        onClick: () =>
                            this.setState({
                                align_order: 'ascending'
                            }),
                    }, "오름차순"),
                e("table", null,
                    e("thead", null,
                        e("tr", null,
                            e("th", null, "제목"),
                            e("th", null, "기반룰"),
                            e("th", null, "작가"),
                            e("th", null, "메모"),
                            e("th", null, "북마크일")
                        )
                    ),
                    e('tbody', { id: "data_tbody" },
                        this.state.rows.map((data, index) => {
                            var date = new Date(data.created);//new Date(data.created).format('yyyy-MM-dd HH:mm');
                            console.log(data);
                            var version = data.lastVersion;
                            return e("tr", { key: index.toString(), 'data-memo':index, "data-bookmark":data._id},
                                e("td", null,
                                    e("a", { href: "/"+urlStringLast+"/view/" + data._id+"/"+data.version }, version.title)),
                                e("td", null, data.ruleTag),
                                e("td", null, e("a", { href: "/user/" + data.author.userName }, data.author.userName)), 
                                e("td", {className:"bookmarkMemo"}, this.state.editMemo == index?e('span',null,e('input',{type:'text',value:this.state.memo,onChange:this.onChangeMemo}),saveButton) :e('span',null,data.memo)
                                ),
                                e("td", null, e(Moment,{format:"YYYY-MM-DD HH:mm"},date)),
                                e("td",null,e("button",{type:"button", onClick:this.editMemoMode},"수정")),
                                e("td",null,e("button",{type:"button", onClick:this.bookmarkRemove},"해제"))
                            );
                        })
                    ))
                );

        return component;
    }
}

export default ArticleList;
// ReactDOM.render(e(ArticleList), document.querySelector('.articles_box'));

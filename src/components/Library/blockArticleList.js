import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';

const e = React.createElement;

const align_types = ['title', 'rule', 'author','created'];
class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            href:'',
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
                    this.setState({
                        rows: res.data.articles,
                        href:window.location.href,
                        master_tags: res.data.masterTags
                    });
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
        console.log(this.state.rows);
    }

    componentDidUpdate(prevProps, prevState){
        if (window.location.href !== prevState.href) {    
            let getArticles = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.articles,
                        href:window.location.href,
                        master_tags: res.data.masterTags
                    });
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
        console.log(this.state.rows);
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

    blockRemove = (event) => {
        event.preventDefault();
        var target = event.target.parentElement.parentElement;
        var targetId = target.getAttribute('data-block');
        let getArticles = () => {
            axios.post(window.location.href+"/delete", {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type,
                    delete:{
                        article : targetId,
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

        var component = <div></div>;
        // if(this.state.rows.length>0){
            console.log(this.state.rows);
            component =
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
                }, "차단일순"),
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
                            e("th", null, "룰"),
                            e("th", null, "작가"),
                            e("th", null, "차단일")
                        )
                    ),
                     e('tbody', { id: "data_tbody" },
                        this.state.rows.map((data, index) => {
                             var date = new Date(data.created);//.format('yyyy-MM-dd HH:mm');
                             var content =  data.content;
                             var version = content.versions[content.versions.length-1];
                             return e("tr", { key: index.toString(), 'data-index':index, "data-block":content._id},
                                 e("td", null,
                                     e("a", { href: "/"+urlStringLast+"/view/" + content._id+"/"+data.version }, version.title)
                                    ),
                                e("td", null, content.ruleTag),
                                e("td", null, e("a", { href: "/user/" + content.author.userName }, content.author.userName)), 
                                e("td", null, e(Moment,{format:"YYYY-MM-DD HH:mm"},date)),
                                e("td",null,e("button",{type:"button", onClick:this.blockRemove},"해제"))
                             );
                         })
                     )
                    )
                );

        // }
        return component;
    }
}

export default ArticleList;
// ReactDOM.render(e(ArticleList), document.querySelector('.articles_box'));

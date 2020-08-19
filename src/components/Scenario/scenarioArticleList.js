import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';

const e = React.createElement;

const align_types = ['title', 'rule', 'author', 'view', 'price', 'created'];
class ArticleList extends React.Component {
    constructor(props) {
        super(props);
        // this.setState({rows:array});
        this.state = {
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
                    console.log(res.data.articles);
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
                    console.log(res.data.articles);
                    console.log(res.data.masterTags);
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
        getArticles();
    }
    onScenarioSearchChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }
        );
    }
    onScenarioSearchSelected = (e) => {
        var options = Array.from(e.target.selectedOptions, option => option.value);
        this.setState({
            [e.target.name]: options
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
    render() {
        var select_rule;
        var select_genre;
        var select_background;
        var select_sub_tags;
        if (this.state.master_tags.length > 0) {
            var ruleTags = this.state.master_tags.find(tags => tags.name === "rule");
            select_rule = e("select", { className: "is-select2-select", name: "filter_rule", onChange: this.onScenarioSearchSelected, multiple: "multiple", tabIndex: "-1", placeholder: "룰" },
                e("option", { value: "", selectd: "selected" }, "-"),
                ruleTags.tags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.tag);
                })
            )
            var genreTags = this.state.master_tags.find(tags => tags.name === "genre");
            select_genre = e("select", { className: "is-select2-select", onChange: this.onScenarioSearchSelected, multiple: "multiple", name: "filter_genre", tabIndex: "-1", placeholder: "룰" },
                e("option", { value: "", selectd: "selected" }, "-"),
                genreTags.tags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.tag);
                })
            )
            var backgroundTags = this.state.master_tags.find(tags => tags.name === "background");
            select_background = e("select", { className: "is-select2-select", onChange: this.onScenarioSearchSelected, multiple: "multiple", name: "filter_background", tabIndex: "-1", placeholder: "룰" },
                e("option", { value: "", selectd: "selected" }, "-"),
                backgroundTags.tags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.tag);
                })
            )
            var subTags = this.state.master_tags.find(tags => tags.name === "subTag");
            select_sub_tags = e("select", { className: "is-select2-select", onChange: this.onScenarioSearchSelected, multiple: "multiple", name: "filter_sub_tags", tabIndex: "-1", placeholder: "룰" },
                e("option", { value: "", selectd: "selected" }, "-"),
                subTags.tags.map((tag, id) => {
                    return e("option", { value: tag._id, key: id.toString() }, tag.tag);
                })
            )
        }
        var component =
            e("div", null,
                e("span",null,"시나리오"), 
                typeof(this.props.currentUser) == 'object'&&!Array.isArray(this.props.currentUser)&&this.props.currentUser!=null?e(Link, {to:'/scenarios/make'},"새로 만들기"):null,
                e("div", { className: "search_window" },
                    e("form", { action: "/scenarios/search", method: "POST", id: "tag-form" },
                        e("ul", { className: "search_ul" },
                            e("li", null,
                                e("input", { id: "rdTag", type: "hidden", value: "", name: "tag" }),
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_title" }, "시나리오 제목"),
                                    e("input", { type: "text", size: "12", name: "filter_title", onChange: this.onScenarioSearchChange, placeholder: "찾을 시나리오 제목" })
                                )
                            ),
                            e("li", null,
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_author" }, "작가"),
                                    e("input", { type: "text", size: "10", name: "filter_author", onChange: this.onScenarioSearchChange, placeholder: "찾을 작가" })
                                )
                            ),
                            e("li", null,
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_rule" }, "룰"),
                                    select_rule
                                )
                            ),
                            e("li", null,
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_background" }, "배경"),
                                    select_background
                                )
                            ),
                            e("li", null,
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_genre" }, "장르"),
                                    select_genre
                                )
                            ),
                            e("li", null,
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_sub_tags" }, "태그"),
                                    select_sub_tags
                                )
                            ),
                        ), 
                        e("ul", { className: "search_ul" },
                            e("li", null,
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_capacity_min" }, "인원수"),
                                    e("input", { type: "number", className:"size_2", name: "filter_capacity_min", onChange: this.onScenarioSearchChange, min:1,title:"검색될 최소 필요 인원수 입력" }),
                                    e("span",null,"~"),
                                    e("input", { type: "number",  className:"size_2", name: "filter_capacity_max", onChange: this.onScenarioSearchChange, min:1,title:"검색될 최대 필요 인원수 입력" })
                                )
                            ),
                            e("li", null,
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_price_min" }, "가격"),
                                    e("input", { type: "number",  className:"size_5", name: "filter_price_min", onChange: this.onScenarioSearchChange, min:0, title:"검색될 최소 가격 입력" }),
                                    e("span",null,"~"),
                                    e("input", { type: "number",  className:"size_5", name: "filter_price_max", onChange: this.onScenarioSearchChange, min:0, title:"검색될 최대 가격 입력" })
                                )
                            ),
                            e("li", null,
                                e("div", { className: "form-field" },
                                    e("label", { htmlFor: "filter_time_min" }, "시간"),
                                    e("input", { type: "number", className:"size_2", name: "filter_time_min", onChange: this.onScenarioSearchChange, min:0, title:"검색될 최소 예측 시간 입력" }),
                                    e("span",null,"~"),
                                    e("input", { type: "number", className:"size_2", name: "filter_time_max", onChange: this.onScenarioSearchChange, min:0, title:"검색될 최대 예측 시간 입력" })
                                )
                            ),
                        ),
                        e("button", {
                            type: "submit", onClick: this.onScenarioSearchSubmit
                            // onClick: () => this.setState({ search_tags: ["CoC", ["사랑", "죽어라"]] })
                        }, "검색")
                    ),
                    e("ul", { id: "tag-list" }),
                    // e("table",null,
                    //     e("tr",null,
                    //         e("td",null,
                    //             e("input",{id:"search",type:"text"}),
                    //             e("input",{type:"submit",value:"검색",
                    //             onClick:()=>this.setState({search_tags: ["CoC",["사랑","죽어라"]]})
                    //             })
                    //         )
                    //     )
                    // )
                ),
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
                    value:'view', 
                    onClick: this.onAlignClick,
                }, "조회수"),
                e("button", {
                    className: "btn align-btn",
                    type:"button",
                    value:'price',
                    onClick: this.onAlignClick,
                }, "가격순"),
                e("button", {
                    className: "btn align-btn",
                    type:"button",
                    value:'created',
                    onClick: this.onAlignClick,
                }, "발행순"),
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
                            e("th", null, "사용룰"),
                            e("th", null, "작가"),
                            e("th", null, "조회수"),
                            e("th", null, "가격"),
                            e("th", null, "배경"),
                            e("th", null, "장르"),
                            e("th", null, "태그"),
                            e("th", null, "발행일")
                        )
                    ),
                    e('tbody', { id: "data_tbody" },
                        this.state.rows.map((data, index) => {
                            var date = new Date(data.created);//.format('yyyy-MM-dd HH:mm');
                            var latest = data.lastVersion;//.last();
                            return e("tr", { key: index.toString() },
                                e("td", null,
                                    e("a", { href: "/scenarios/view/" + data._id }, latest.title)),
                                e("td", null, data.ruleTag),
                                e("td", null, e("a", { href: "/user/" + data.author.userName }, data.author.userName)),
                                e("td", null, data.view),
                                e("td", null, data.price),
                                e("td", null,
                                    e("ul", null,
                                        e("li", { className: "tag_item" }, "#" + latest.backgroundTag)
                                    )
                                ),
                                e("td", null,
                                    e("ul", null,
                                    latest.genreTags.map((tag, id) => {
                                            return e("li", { className: "tag_item", key: id.toString() }, "#" + tag);
                                        })
                                    )
                                ),
                                e("td", null, e("ul", null,
                                latest.subTags.map((tag, id) => {
                                        return e("li", { className: "tag_item", key: id.toString() }, "#" + tag);
                                    })
                                )
                                ),
                                e("td", null, e(Moment,{format:"YYYY-MM-DD HH:mm"},date))

                            );
                        })
                    )
                ));

        return component;
    }
}

// Find all DOM containers, and render Like buttons into them.
// document.querySelectorAll('.articles_box')
//     .forEach(domContainer => {
//         // Read the comment ID from a data-* attribute.
//         const commentID = parseInt(domContainer.dataset.commentid, 10);
//         ReactDOM.render(
//             e(ArticleList, { commentID: commentID }),
//             domContainer
//         );
//     });

export default ArticleList;
// ReactDOM.render(e(ArticleList), document.querySelector('.articles_box'));


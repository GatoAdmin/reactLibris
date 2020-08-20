import React from 'react';
import axios from 'axios';
import Moment from 'react-moment';
const e = React.createElement;

const align_types = ['title', 'rule', 'author','created'];
class BlockUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            align_type: 'created',
            align_order: 'descending',
        };
    }

    componentDidMount() {
        let getUsers = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.userList,
                        master_tags: res.data.masterTags
                    });
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getUsers();
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
        
        let getUsers = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: alignOrder,
                    align_type: alignType,
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.userList,
                    });

                    this.forceUpdate();
                  })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getUsers();
    }

    blockRemove = (event) => {
        event.preventDefault();
        var alignType = event.target.value;
        var alignOrder = this.state.align_order;
        
        this.setState(() => ({
            align_type: alignType,
            align_order: alignOrder
        }));

        var target = event.target.parentElement.parentElement;
        var targetName = target.getAttribute('data-user');
        let getUsers = () => {
            axios.post(window.location.href+"/"+targetName, {
                params: {
                    align_order: alignOrder,
                    align_type: alignType,
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.userList
                    });
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getUsers();
    }

    render() {
        var urlStringLast  = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

        console.log(this.state.rows);
        var component =
            e("div", null,
                e("button", {
                    className: "btn align-btn",
                    type:"button",
                    value:'userName', 
                    onClick: this.onAlignClick,
                }, "유저순"),
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
                            e("th", null, "유저"),
                            e("th", null, "차단일")
                        )
                    ),
                    e('tbody', { id: "data_tbody" },
                        this.state.rows.map((data, index) => {
                            var date = new Date(data.created);//.format('yyyy-MM-dd HH:mm');
                            var content =  data.content;
                            return e("tr", { key: index.toString(), 'data-index':index, "data-user":content.userName},
                                e("td", null, e("a", { href: "/user/" + content.userName }, content.userName)), 
                                e("td", null, e(Moment,{format:"YYYY-MM-DD HH:mm"},date)),
                                e("td",null,e("button",{type:"button", onClick:this.blockRemove},"차단해제"))
                            );
                        })
                    )
                    )
                );

        return component;
    }
}
export default BlockUserList
// ReactDOM.render(e(BlockUserList), document.querySelector('.articles_box'));

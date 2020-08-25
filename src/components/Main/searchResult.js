import React from 'react';
import axios from 'axios';
import { Button, List, Grid } from 'semantic-ui-react';
import { HTTPVersionNotSupported } from 'http-errors';

class SearchResult extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            rows : [],
            searchWord: props.location.search
        }
    }
    
    componentDidMount(){
        let getArticles = () => {
            axios.post(window.location.href, {
                params: {
                    align_order: this.state.align_order,
                    align_type: this.state.align_type
                }
            })
                .then(res => {
                    this.setState({
                        rows: res.data.results
                    });
                 })
                .catch(function (err) {
                    console.log(err);
                })
        }
        getArticles();
    }
    textLengthOverCut(txt, len, lastTxt) {
        if (len == "" || len == null) { // 기본값
            len = 20;
        }
        if (lastTxt == "" || lastTxt == null) { // 기본값
            lastTxt = "...";
        }
        if (txt.length > len) {
            txt = txt.substr(0, len) + lastTxt;
        }
        return txt;
    }
    render() {
        console.log(this.state.rows);
        var component = <div></div>
        if(this.state.rows.length>0){
            component =(
                <div>
                    <Grid divided='vertically'>
                    {this.state.rows.map((row)=>{
                        return (<Grid.Row>
                           {row.works.map((work)=>{
                               return(<Grid.Column>
                                    <Grid.Row>
                                       {work.lastVersion.title}
                                   </Grid.Row>
                                   <Grid.Row>
                                       {row.onModel}
                                   </Grid.Row> 
                                   <Grid.Row>
                                       {work.lastVersion.content.substr}
                                   </Grid.Row> 
                               </Grid.Column>
                               );
                            })}
                        </Grid.Row>);  
                    })} 
                   </Grid>
                </div>
            );
        }
        return component;
    }
}
export default SearchResult;


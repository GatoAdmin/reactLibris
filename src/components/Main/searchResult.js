import React from 'react';
import axios from 'axios';
import { Button, List, Grid } from 'semantic-ui-react';
import ReactQuill,{Quill} from 'react-quill';

class SearchResult extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            chronicles : [],
            replays : [],
            scenarios : [],
            searchWord: new URLSearchParams( props.location.search).get('searchWord')
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
                    console.log(res.data)
                    this.setState({
                        chronicles: res.data.chronicles,
                        replays:res.data.replays,
                        scenarios:res.data.scenarios,
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
        console.log(txt);
        if (txt.length > len) {
            txt = txt.substr(0, len) + lastTxt;
        }
        return txt;
    }
    deltaCut(delta, len, lastTxt) {
        // if (len == "" || len == null) { // 기본값
        //     len = 20;
        // }
        // if (lastTxt == "" || lastTxt == null) { // 기본값
        //     lastTxt = "...";
        // }
        var deltaTest =null;
        deltaTest = delta.ops.map((obj)=>{
            delete obj.attributes;
            if(typeof(obj.insert)!='string'){
                delete obj.insert;
            }
            return obj;
        });
        // if (delta.length > len) {
        //     delta = delta.substr(0, len) + lastTxt;
        // })
        var ops= null;
        ops = deltaTest.filter((obj)=>{
                 return obj.insert!=undefined?obj.insert.includes(this.state.searchWord):false
        });
        console.log(ops)
        return delta;
    }
    render() {
        var component = <div></div>
        var header = <Grid.Row><Grid.Column><h1>검색 결과</h1></Grid.Column></Grid.Row>
        if(this.state.chronicles.length>0&&this.state.replays.length>0&&this.state.scenarios.length>0){
            component =( 
                <Grid divided='vertically'>
                {header}
                   <Grid.Row>
                       <Grid.Column>
                        <h2>검색 결과가 없습니다. 검색어를 바꾸어서 검색해보세요.</h2>
                       </Grid.Column>
                   </Grid.Row>
           </Grid>);
        }else{
            if(this.state.chronicles.length>0){
                component =(
                    <div>
                        <Grid divided='vertically'>
                            {header}
                        {this.state.chronicles.map((row)=>{
                            return (
                            <Grid.Row>
                                <Grid.Column>
                                        <Grid.Row>
                                           {row.title}
                                       </Grid.Row>
                                       <Grid.Row>
                                           {row.onModel} 작품군
                                       </Grid.Row>
                                   </Grid.Column>
                            </Grid.Row>);  
                        })} 
                        {this.state.scenarios.map((rows)=>{
                            return rows.map((row)=>{
                                return(
                                    <Grid.Row>
                                        <Grid.Column>
                                                <Grid.Row>
                                                   {row.lastVersion.title}
                                               </Grid.Row>
                                               <Grid.Row>
                                                   {row.onModel}
                                               </Grid.Row>
                                                <Grid.Row>
                                                <ReactQuill
                                                    theme='bubble'
                                                    defaultValue={JSON.parse(row.lastVersion.content)}
                                                    readOnly
                                                />
                                            </Grid.Row> 
                                           </Grid.Column>
                                    </Grid.Row>
                                );
                            })
                        })}
                        {this.state.replays.map((rows)=>{
                            return rows.map((row)=>{
                                return(
                                    <Grid.Row>
                                        <Grid.Column>
                                                <Grid.Row>
                                                   {row.lastVersion.title}
                                               </Grid.Row>
                                               <Grid.Row>
                                                   {row.onModel}
                                               </Grid.Row>
                                                <Grid.Row>
                                                <ReactQuill
                                                    theme='bubble'
                                                    defaultValue={JSON.parse(row.lastVersion.content)}
                                                    readOnly
                                                />
                                            </Grid.Row> 
                                           </Grid.Column>
                                    </Grid.Row>
                                );
                            })
                        })}
                       </Grid>
                    </div>
                );
            }
        }
        return component;
    }
}
export default SearchResult;


import React from 'react';
import axios from 'axios';
import { Button, Item, Grid, ListItem } from 'semantic-ui-react';

import CardList from './cardList';
import BannerCarousel from './BannerCarousel';

const src = 'https://react.semantic-ui.com/images/wireframe/image.png'
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: [],
            recommandScenarios:  [],
            recommandReplays:[],
            // monthScenarios:  [],
            // monthReplays:[],
            // dayScenarios:  [],
            // dayReplays:[],
            // weekScenarios:  [],
            // weekReplays:[],
            // newScenarios:  [],
            // newReplays:[],
        };
    }    
    componentDidMount() {
        axios.post('/')
        .then(res => {console.log(res.data);this.setState(res.data)})
        .catch(function (err) {
            console.log(err);
        });
      }
    render() {        //
        var imageSrc = null;
        var newsCardList = this.state.news;
        var newsFirst = this.state.news[0];
        // if(this.state.news.length>0){
        //     if(newsFirst.banner!=undefined&&newsFirst.banner.length>0){
        //         imageSrc = newsFirst.banner[0].imageData.replace('\\','/')
        //     }
        //     newsCardList.shift();
        // }
        return (
            <div className="home">
                {this.state.news.length>0?<BannerCarousel festivals={this.state.news}/>:null}
                <Grid>
                    <Grid.Column width={13}>
                        <Grid.Row className="recommand_scenarios">
                                <Grid.Column>
                                    <Grid.Row>
                                        추천 시나리오
                                    </Grid.Row>
                                    <Grid.Row>
                                    {this.state.recommandScenarios.length>0?<CardList cards={this.state.recommandScenarios} type="scenarios"/>:null}
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row className="recommand_replays">
                                <Grid.Column>
                                    <Grid.Row>
                                        추천 리플레이
                                    </Grid.Row>
                                    <Grid.Row>
                                    {this.state.recommandReplays.length>0?<CardList cards={this.state.recommandReplays} type="replays"/>:null}
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Grid.Row><div className="google-ad"></div></Grid.Row>
                        <Grid.Row>
                            <div className="notice-box">
                                <h3>공지사항</h3>
                                <Item.Group divided>
                                    {this.state.news.map((notice,index)=>{
                                        return <Item>
                                            <Item.Image/>
                                            <Item.Content>
                                                <Item.Header>{notice.title}</Item.Header>
                                            </Item.Content>
                                        </Item>
                                    })}
                                </Item.Group>
                            </div>
                        </Grid.Row>
                        <Grid.Row><div className="google-ad"></div></Grid.Row>
                        <Grid.Row><div className="twitter-box"></div></Grid.Row>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
export default Home;

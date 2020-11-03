import React from 'react';
import axios from 'axios';
import { Button, Item, Grid, Image } from 'semantic-ui-react';
import Moment from 'react-moment';

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
                    <Grid.Column width={12}>
                        <Grid.Row className="recommand-box scenarios">
                            <Grid.Column>
                                {this.state.recommandScenarios.length>0?<CardList name="시나리오 추천작" cards={this.state.recommandScenarios} type="scenarios"/>:null}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="recommand-box replays">
                            <Grid.Column>
                                {this.state.recommandReplays.length>0?<CardList name="리플레이 추천작" cards={this.state.recommandReplays} type="replays"/>:null}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="recommand-box scenarios">
                            <Grid.Column>
                                {this.state.recommandScenarios.length>0?<CardList name="이런 시나리오 어때요?" cards={this.state.recommandScenarios} type="scenarios"/>:null}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="recommand-box replays">
                            <Grid.Column>
                                {this.state.recommandReplays.length>0?<CardList name="이런 리플레이 어때요?" cards={this.state.recommandReplays} type="replays"/>:null}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row><div className="google-ad">
                            <Image src='/assets/images/layout/google-ad-test-336.png'/>
                            </div></Grid.Row>
                        <Grid.Row>
                            <div className="notice-box">
                                <h3>새소식</h3>
                                <Item.Group divided>
                                    {this.state.news.map((notice,index)=>{
                                        return <Item>
                                            <Item.Image src={notice.banner.length>0?"/assets/images/"+notice.banner[0].imageData:src} size="tiny"/>
                                            <Item.Content>
                                                <Item.Header>{notice.title}</Item.Header>        
                                                <Item.Meta>
                                                    <Moment format="YY.MM.DD">{notice.created}</Moment>
                                                </Item.Meta>
                                            </Item.Content>
                                        </Item>
                                    })}
                                </Item.Group>
                            </div>
                        </Grid.Row>
                        <Grid.Row><div className="google-ad">
                            <Image src='/assets/images/layout/google-ad-test-336.png'/>
                            </div></Grid.Row>
                        <Grid.Row><div className="twitter-box">
                            <h3>트위터</h3>
                            <div className="twitter-timeline"></div>
                            </div></Grid.Row>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
export default Home;

import React from 'react';
import { Button, List, Grid } from 'semantic-ui-react';
import CardList from './cardList';
import axios from 'axios';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: [],
            recommandScenarios:  [],
            recommandReplays:[],
            monthScenarios:  [],
            monthReplays:[],
            dayScenarios:  [],
            dayReplays:[],
            weekScenarios:  [],
            weekReplays:[],
            newScenarios:  [],
            newReplays:[],
        };
    }    
    componentDidMount() {
        axios.post('/')
        .then(res => this.setState(res.data))
        .catch(function (err) {
            console.log(err);
        });
      }
    render() {
        return (
            <div className="App">
                <h3>리브리스에 오신 것을 환영합니다!</h3>
                <span>홈</span>
                <Grid>
                    <Grid.Row className="news">
                        <Grid.Column>
                            <Grid.Row>
                                뉴스
                            </Grid.Row>
                            <Grid.Row>
                                <CardList cards={this.state.news} type="news"/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="recommand_scenarios">
                        <Grid.Column>
                            <Grid.Row>
                                추천 시나리오
                            </Grid.Row>
                            <Grid.Row>
                                <CardList cards={this.state.recommandScenarios} type="scenarios"/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="recommand_replays">
                        <Grid.Column>
                            <Grid.Row>
                                추천 리플레이
                            </Grid.Row>
                            <Grid.Row>
                                <CardList cards={this.state.monthReplays} type="replays"/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="recommand_scenarios">
                        <Grid.Column>
                            <Grid.Row>
                                인기 시나리오
                            </Grid.Row>
                            <Grid.Row>
                                <CardList cards={this.state.monthScenarios} type="scenarios"/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="recommand_replays">
                        <Grid.Column>
                            <Grid.Row>
                                인기 리플레이
                            </Grid.Row>
                            <Grid.Row>
                                <CardList cards={this.state.replays} type="replays"/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="recommand_scenarios">
                        <Grid.Column>
                            <Grid.Row>
                                신규 시나리오
                            </Grid.Row>
                            <Grid.Row>
                                <CardList cards={this.state.newScenarios} type="scenarios"/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="recommand_replays">
                        <Grid.Column>
                            <Grid.Row>
                                신규 리플레이
                            </Grid.Row>
                            <Grid.Row>
                                <CardList cards={this.state.newReplays} type="replays"/>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>                                        
                </Grid>
            </div>
        );
    }
}
export default Home;

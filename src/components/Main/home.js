import React from 'react';
import { Button, List, Grid } from 'semantic-ui-react';

class Home extends React.Component {
    render() {
        return (
            <div className="App">
                <h3>리브리스에 오신 것을 환영합니다!</h3>
                <span>홈</span>
                <Grid>
                    <Grid.Row className="news">
                        <Grid.Column>뉴스</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="recommand_scenarios">
                        <Grid.Column>추천 시나리오</Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="recommand_replays">
                        <Grid.Column>추천 리플레이</Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
export default Home;

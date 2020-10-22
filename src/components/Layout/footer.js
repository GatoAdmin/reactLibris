import React from 'react';
import { List, Grid,Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Footer extends React.Component {
    render() {
        return (
            <footer className="footer">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={7}>
                                <Image className="logo" src='/assets/images/layout/Logo.png'/>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <List>
                                    <List.Item>빠른 링크</List.Item>
                                    <List.Item as={Link} to="/scenarios">시나리오</List.Item>
                                    <List.Item as={Link} to="/replays">리플레이</List.Item>
                                    <List.Item as={Link} to="/news">공지사항</List.Item>
                                    <List.Item as={Link} to="/">포럼</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <List>
                                    <List.Item>고객지원</List.Item>
                                    <List.Item as={Link} to="/about">설명서</List.Item>
                                    <List.Item as={Link} to="/">FAQ</List.Item>
                                    <List.Item as={Link} to="/">연락방법</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <List>
                                    <List.Item>SNS</List.Item>
                                    <List.Item as={Link} to="/">트위터</List.Item>
                                    <List.Item as={Link} to="/">페이스북</List.Item>
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row >
                            <Grid.Column  width={8}>
                                <span>©2020 Libris | All Rights Reserved</span>
                            </Grid.Column>
                            <Grid.Column  width={8}>
                                <Link to="">개인 정보 보호 정책</Link> | <Link to="">이용 약관</Link> 
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
            </footer>
        );
    }
}
export default Footer;

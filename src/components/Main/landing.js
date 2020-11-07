import React from 'react';
import { Button, Grid,Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { useCookies  } from 'react-cookie';
import './style.css'

function Main(){
        const [cookies, setCookie] = useCookies(['libris_visite']);
        setCookie('libris_visite', true, { path: '/' });
        return (
            <div className="landing-box">
                <div className="door-box">
                    <Grid>
                        <Grid.Column width={8}></Grid.Column>
                        <Grid.Column width={8}>
                            <Image class="logo" src='/assets/images/layout/Logo.png'/>
                            <div>
                                <h2>시나리오 리플레이를 한 곳에서!</h2>
                                <span>블라블라블라블라블블라블라블라블라블라블라블라블라
                                      블라블라블라블라블라블라블라블라블라블라블라블라</span>
                            </div>
                            <Button className="violet-btn" color="violet" as={Link} to="/login">시작하기</Button>
                        </Grid.Column>
                    </Grid>
                </div>
                <div className="explain-box">
                    <Grid>
                        <Grid.Row>
                            <h3>리브리스는</h3>
                            <span>블라블라블라블라블블라블라블라블라블라블라블라블라블라블라블라블라블블라블라블라블라블라블라블라블라
                                블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                블라블라블라블라블블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블블라블라블라블라블라블라블라블라
                                블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                블라블라블라블라블블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                블라블라블라블라블라블라블라블라블라블라블라블라</span>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={4}/>
                            <Grid.Column width={4}>
                                    <Button className="with-btn" color="white" as={Link} to="/about">공식 설명서</Button>
                            </Grid.Column>
                            <Grid.Column  width={4}>
                                    <Button className="violet-btn" color="violet" as={Link} to="/login">시작하기</Button>
                            </Grid.Column>
                            <Grid.Column width={4}/>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="feature-box">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <h3>특징1</h3>
                                <span>블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라</span>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <h3>특징2</h3>
                                <span>블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라</span>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <h3>특징3</h3>
                                <span>블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라</span>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <h3>특징4</h3>
                                <span>블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                    블라블라블라블라블라블라블라블라블라블라블라블라</span>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
                <div className="sponsor-box">
                    <Grid>
                        <Grid.Row>
                            <h3>프리미엄 후원자 등록</h3>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Grid.Row>
                                    <h3>장점</h3>
                                </Grid.Row>
                                <Grid.Row>
                                    <Image src=""/>
                                </Grid.Row>
                                <Grid.Row>
                                    <span>블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라</span>
                                </Grid.Row>
                            </Grid.Column>
                            <Grid.Column  width={3}>
                                <Grid.Row>
                                    <h3>장점</h3>
                                </Grid.Row>
                                <Grid.Row>
                                    <Image src=""/>
                                </Grid.Row>
                                <Grid.Row>
                                    <span>블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라</span>
                                </Grid.Row>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Grid.Row>
                                    <h3>장점</h3>
                                </Grid.Row>
                                <Grid.Row>
                                    <Image src=""/>
                                </Grid.Row>
                                <Grid.Row>
                                    <span>블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라</span>
                                </Grid.Row>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Grid.Row>
                                    <h3>장점</h3>
                                </Grid.Row>
                                <Grid.Row>
                                    <Image src=""/>
                                </Grid.Row>
                                <Grid.Row>
                                    <span>블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라블라
                                        블라블라블라블라블라블라블라블라블라블라블라블라</span>
                                </Grid.Row>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Button className="violet-btn" color="violet" as={Link} to="/">프리미엄 후원자 보기</Button>
                        </Grid.Row>
                    </Grid>
                </div>

                <div className="cooperation-box">
                    <Grid>
                        <Grid.Row><h3>협력 사이트</h3></Grid.Row>
                        <Grid.Row>
                            <Grid.Column>

                            </Grid.Column>
                            <Grid.Column>
                                
                            </Grid.Column>
                            <Grid.Column>
                                
                            </Grid.Column>
                            <Grid.Column>
                                
                            </Grid.Column>
                            <Grid.Column>
                                
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        );
    }
export default Main;

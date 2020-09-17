import React from 'react';
import { Button,Divider, Grid } from 'semantic-ui-react'
import {Link } from 'react-router-dom';
import Moment from 'react-moment';

function Navbar (props){
  return (<nav className='Menu-wrapper'>
  <ul>
    <h3>My Page</h3>
    {props.currentUser!=null?(
    <Grid >
      <Grid.Row color='grey'>
        <Grid.Column  width={5}>{props.currentUser.userName} 님</Grid.Column>
        <Grid.Column  width={9}><Button as={Link} to='/logout' size='mini'>로그아웃</Button></Grid.Column>
      </Grid.Row>
      <Grid.Row  color='grey' >
        <Grid.Column  width={14}>
          <Grid.Row>
            <Grid.Column width={5}>총 골드</Grid.Column>
            <Grid.Column width={9}>{props.currentUser.coin}G</Grid.Column>
          </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>구매한 골드</Grid.Column>
              <Grid.Column width={9}>{props.currentUser.coin}G</Grid.Column>
            </Grid.Row>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row color='grey'>
        <Grid.Column width={5}>가입일</Grid.Column>
        <Grid.Column width={9}><Moment format="YYYY-MM-DD">{props.currentUser.created}</Moment></Grid.Column>
      </Grid.Row>
    </Grid>):null}
    <Divider />
    <div>회원 정보</div>
    <Divider />
    <Button.Group vertical>
        <Button as={Link} to='/user'>개인 정보 수정</Button>
        <Button as={Link} to='/user'>환경 설정</Button>
        <Button as={Link} to='/user/block/replays'>회원 탈퇴</Button>
    </Button.Group>
    <div>판매 정보</div>
    <Divider />
    <Button.Group vertical>
        <Button as={Link} to='/user/bookmark/scenarios'>내 판매 정보</Button>
        <Button as={Link} to='/user/bookmark/replays'>판매 시나리오 관리</Button>
        <Button as={Link} to='/user/block/scenarios'>판매 리플레이 관리</Button>
    </Button.Group>
    <div>이용 정보</div>
    <Divider />
    <Button.Group vertical>
        <Button as={Link} to='/user/block/replays'>결제 내역</Button>
        <Button as={Link} to='/user/block/replays'>콘텐츠 구매내역</Button>
        <Button as={Link} to='/user/block/replays'>보낸 선물 내역</Button>
        <Button as={Link} to='/user/block/replays'>받은 선물 내역</Button>
        <Button as={Link} to='/user/block/replays'>이벤트 선물 내역</Button>
        <Button as={Link} to='/user/block/replays'>보낸 후원 내역</Button>
        <Button as={Link} to='/user/block/replays'>받은 후원 내역</Button>
        <Button as={Link} to='/user/block/user'>문의 내역</Button>
        <Button as={Link} to='/user/block/replays'>쿠폰 등록</Button>
    </Button.Group>
  </ul>
</nav>);
}
export default Navbar
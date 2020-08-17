import React from 'react';
import { Button, List } from 'semantic-ui-react';

class Main extends React.Component {
    render() {
        return (
            <div className="App">
                <h3>리브리스에 오신 것을 환영합니다!</h3>
                <div id="landing_header">
                    <div className="table">
                        <div className="tr">
                            <div className="td">
                                <div className="tr">
                                </div>
                                <div className="tr">
                                    <a href="/signup">
                                        <div className="btn"><Button>계정 만들기</Button></div>
                                    </a>
                                </div>
                                <div className="tr">
                                </div>
                            </div>
                            <div className="td">
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3>리브리스를 시작하는 방법</h3>
            <a href="/signup">
                        <div className="btn"><Button>계정 만들기</Button></div>
                    </a>
                </div>
                <div>
                    <h3>장점1</h3>
                    <div>적당히 이미지</div>
                </div>
                <div>
                    <h3>장점2</h3>
                    <div>적당히 이미지</div>
                    <a href="/signup">
                        <div className="btn"><Button>계정 만들기</Button></div>
                    </a>
                </div>
                <div>
                    <h3>장점3</h3>
                    <div>적당히 이미지</div>
                    <a href="/signup">
                        <div className="btn"><Button>계정 만들기</Button></div>
                    </a>
                </div>
                <div>
                    <h3>장점4</h3>
                    <div>적당히 이미지</div>
                    <a href="/signup">
                        <div className="btn"><Button>계정 만들기</Button></div>
                    </a>
                </div>
                <div>
                    <h3>최신 뉴스</h3>
                    <div>카드 뉴스 한개</div>
                    <div>카드 뉴스 한개</div>
                    <div>카드 뉴스 한개</div>
                </div>

                <div>
                    <h3>우리의 회원이 되어주지 않을래요?</h3>
                    <div>
                        <form action="/signup" method="post">
                            <table>
                                <tr>
                                    <td>이메일 : </td>
                                    <td><input type="text" name="email" /></td>
                                </tr>
                                <tr>
                                    <td>비번 : </td>
                                    <td><input type="password" name="password" /></td>
                                </tr>
                                <tr>
                                    <td><input type="submit" value="회원가입" /></td>
                                </tr>
                            </table>
                        </form>
                    </div>
                    <div>이미 회원이시라구요? <a href="/login">로그인</a></div>
                </div>
                <div>
                    <div className="table">
                        <div className="tr">
                            <div className="td">
                            <div>로고</div>
                            </div>
                            <div className="td">
                                포부
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
export default Main;

import React from 'react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import RRuleGenerator from 'react-rrule-generator';
import 'react-rrule-generator/build/styles.css';
import {Form, Button,Input,TextArea} from 'semantic-ui-react';
import axios from 'axios';

class Maker extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state={
          rrule :null,
          title:"팀",
          desc:"",
          times:['20:00','00:00']
      }
    }

    onSubmit = (event) => {
        event.preventDefault();
        axios.post(window.location.href+"/repeat/save",{data:this.state})
        .then(res=>{
            if(res.succes){
                window.location.reload();
            }
        }).catch(function (err) {
            console.log(err);
        })
        return false;
    }
render(){
    return (
        <div>
            <form onSubmit={this.onSubmit}>
                <div>
                <Input name="title" type="text" label="반복 일정 이름" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})}/>
                </div>
               <div>
               <TextArea name="desc" type="text" label="일정 설명" value={this.state.desc} onChange={(e)=>this.setState({desc:e.target.value})}/>
               </div>
                
                <div>
                    몇시부터 몇시까지 하나요?
                    <TimeRangePicker
                        onChange={(value)=>{this.setState({times:value})}}
                        value={this.state.times}
                    />
                </div>
                <RRuleGenerator
                    onChange={(rrule) => this.setState({ rrule })}
                    config={{
                    repeat: ['Monthly', 'Weekly'],
                    end: ['Never', 'On date'],
                    weekStartsOnSunday: true,
                    hideError: true,
                    hideStart:false,
                    }}
                    value={this.state.rrule}
                    translations={{
                        'repeat.weekly.label':'주 마다',
                        'repeat.label':'반복 주기',
                        'repeat.monthly.label':'달 마다',
                        'repeat.monthly.every':'몇 달 마다',
                        'repeat.monthly.on_day':'몇 일마다',
                        'repeat.monthly.months':'매 달',
                        'repeat.monthly.on_the':'몇째 주에',
                        'numerals.first':'첫째 주',
                        'numerals.second':'두째 주',
                        'numerals.third':'셋째 주',
                        'numerals.fourth':'넷째 주',
                        'numerals.last':'마지막 주',
                        'days.sunday':'일요일',
                        'days.monday':'월요일',
                        'days.tuesday':'화요일',
                        'days.wednesday':'수요일',
                        'days.thursday':'목요일',
                        'days.friday':'금요일',
                        'days.saturday':'토요일',
                        'days.day':'매일',
                        'days.weekday':'평일 동안',
                        'days.weekend day':'주말 동안',
                        'repeat.weekly.every':'몇주 마다',
                        'repeat.weekly.weeks':'무슨 요일에',
                        'days_short.sun':'일',
                        'days_short.mon':'월',
                        'days_short.tue':'화',
                        'days_short.wed':'수',
                        'days_short.thu':'목',
                        'days_short.fri':'금',
                        'days_short.sat':'토',
                        'start.label':'시작 날짜',
                        'end.label':'언제까지 하나요?',
                        'end.never':'영원히',
                        'end.on_date':'몇일 까지'
                    }}
                />
                <Button type="submit">저장</Button>
            </form>
          </div>
    );
}
}
export default Maker;
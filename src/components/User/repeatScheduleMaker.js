import React from 'react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import RRuleGenerator from 'react-rrule-generator';
import 'react-rrule-generator/build/styles.css';
import {Form, Icon, Modal, Button,Input,TextArea} from 'semantic-ui-react';
import axios from 'axios';
import { TwitterPicker  } from 'react-color';
import moment from 'moment';
import {rrulestr} from 'rrule';
class Maker extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state={
          rrule :null,
          title:"팀",
          displayColorPicker :false,
          color:'#3174ad',
          desc:"",
          times:['20:00','00:00'],
          open:false,
      }
    }

    translationRRule(rruleStr){
        if(rruleStr!=null){
            var startStrings = rruleStr.split(/\r?\n/);
            var middleStrings = startStrings.pop();
            var endStrings = null;
            middleStrings = middleStrings.split(';');
            if(middleStrings.some(string=>string.includes("UNTIL"))){
                endStrings = middleStrings.filter(string=>string.includes("UNTIL")).pop();
            }
            var strings = moment(startStrings[0].split(':').pop()).format('YYYY-MM-DD')+" 부터 "
            var interval = 0;

            if(endStrings!=null){
                strings+= moment(endStrings.split('=').pop()).format('YYYY-MM-DD')+" 까지 \n"
            }else{
                strings+="영원히 \n"
            }
            strings += "매 ";
            if(middleStrings.some(string=>string.includes("INTERVAL"))){
                interval = middleStrings.filter(string=>string.includes("INTERVAL"))[0].split('=').pop();
                strings += interval==="1"?"":interval;
             }
            if(middleStrings.some(string=>string.includes("RRULE"))){
               var engStrings = middleStrings.filter(string=>string.includes("RRULE"))[0].split('=').pop();
               strings += engStrings==="MONTHLY"?"달 ":engStrings==="WEEKLY"?"주 ":"";
            }
            if(middleStrings.some(string=>string.includes("BYMONTHDAY"))){
                var number = middleStrings.filter(string=>string.includes("BYMONTHDAY"))[0].split('=').pop();
                strings += number+"일";
             }
             if(middleStrings.some(string=>string.includes("BYSETPOS"))){
                var engStrings = middleStrings.filter(string=>string.includes("BYSETPOS"))[0].split('=').pop();
                strings += (engStrings==="1"?"첫째 주":engStrings==="2"?"두째 주":engStrings==="3"?"셋째 주":engStrings==="4"?"넷째 주":engStrings==="-1"?"마지막 주":"")+" ";
             }
             if(middleStrings.some(string=>string.includes("BYDAY"))){
                var engStrings = middleStrings.filter(string=>string.includes("BYDAY"))[0].split('=').pop();
                strings += engStrings==="MO"?"월요일":
                           engStrings==="TU"?"화요일":
                           engStrings==="WE"?"수요일":
                           engStrings==="TH"?"목요일":
                           engStrings==="FR"?"금요일":
                           engStrings==="SA"?"토요일":
                           engStrings==="SU"?"일요일": 
                           engStrings==="MO,TU,WE,TH,FR"?"평일":
                           engStrings==="SA,SU"?"주말":
                           engStrings==="MO,TU,WE,TH,FR,SA,SU"?"매일":(
                             engStrings.split(',').map(eng=>eng==="MO"?"월요일":
                             eng==="TU"?"화요일":
                             eng==="WE"?"수요일":
                             eng==="TH"?"목요일":
                             eng==="FR"?"금요일":
                             eng==="SA"?"토요일":
                             eng==="SU"?"일요일": "")
                           );
             }
            strings += " 마다"
            return strings;
        }
    }

/*
    translationRRule(rruleStr){
        if(rruleStr!=null){
            var rrule = rrulestr(rruleStr).origOptions;
            console.log(rrule);
            var startDate = rrule.dtstart;
            var endDate = rrule.until;
            
            var strings = moment(startDate).format('YYYY-MM-DD')+" 부터 "


            if(endDate!=undefined){
                strings+= moment(endDate).format('YYYY-MM-DD')+" 까지"
            }else{
                strings+="영원히 "
            }
            strings += "매 ";
            if(rrule.interval!=undefined){
                strings += rrule.interval==="1"?"":rrule.interval;
             }
            if(rrule.freq!=undefined){
               strings += rrule.freq===1?"달 ":rrule.freq===2?"주 ":"";
            }
            // if(middleStrings.some(string=>string.includes("BYMONTHDAY"))){
            //     var number = middleStrings.filter(string=>string.includes("BYMONTHDAY"))[0].split('=').pop();
            //     strings += number+"일";
            //  }
            //  if(middleStrings.some(string=>string.includes("BYSETPOS"))){
            //     var engStrings = middleStrings.filter(string=>string.includes("BYSETPOS"))[0].split('=').pop();
            //     strings += (engStrings==="1"?"첫째 주":engStrings==="2"?"두째 주":engStrings==="3"?"셋째 주":engStrings==="4"?"넷째 주":engStrings==="-1"?"마지막 주":"")+" ";
            //  }
            //  if(middleStrings.some(string=>string.includes("BYDAY"))){
            //     var engStrings = middleStrings.filter(string=>string.includes("BYDAY"))[0].split('=').pop();
            //     strings += engStrings==="MO"?"월요일":
            //                engStrings==="TU"?"화요일":
            //                engStrings==="WE"?"수요일":
            //                engStrings==="TH"?"목요일":
            //                engStrings==="FR"?"금요일":
            //                engStrings==="SA"?"토요일":
            //                engStrings==="SU"?"일요일": 
            //                engStrings==="MO,TU,WE,TH,FR"?"평일":
            //                engStrings==="SA,SU"?"주말":
            //                engStrings==="MO,TU,WE,TH,FR,SA,SU"?"매일":(
            //                  engStrings.split(',').map(eng=>eng==="MO"?"월요일":
            //                  eng==="TU"?"화요일":
            //                  eng==="WE"?"수요일":
            //                  eng==="TH"?"목요일":
            //                  eng==="FR"?"금요일":
            //                  eng==="SA"?"토요일":
            //                  eng==="SU"?"일요일": "")
            //                );
            //  }
            strings += " 마다"
            return strings;
        }
    }
*/

    onClose(){
        this.setState({
            rrule :null,
            title:"팀",
            displayColorPicker :false,
            color:'#3174ad',
            desc:"",
            times:['20:00','00:00'],
            open:false
        })
    }
    setPickerView = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
      };
      setPickColor = (color) => {
        console.log(color);
        this.setState({ color: color.hex })
      };
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
        <Modal onClose={()=>this.setState({open:false})} onOpen={()=>this.setState({open:true})} open={this.state.open} trigger={<Button icon labelPosition='right'>반복 일정 추가하기<Icon name="calendar plus"/></Button>}>
            <Modal.Content>

            <form onSubmit={this.onSubmit}>
                <div>
                <Input name="title" type="text" label="반복 일정 이름" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})}/>
                <Input type="hidden" name="color" value={this.state.color}/>
                    <Input type="hidden" name="id" value={this.props.schedule!=null?this.props.schedule._id:null}/>
                    <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '5px',
                          backgroundColor:this.state.color,
                      }} onClick={()=>this.setPickerView()}></div>
                  </div>
                  {
                     this.state.displayColorPicker ?( 
                     <div style={{left: '50px',position: 'fixed', top: '100px', zIndex: 1020,}}>
                        <div style={{ position: 'fixed',
                                    top: '0px',
                                    right: '0px',
                                    bottom: '0px',
                                    left: '0px',
                         } } onClick={()=>this.setPickerView() }/>
                        <TwitterPicker onClose={()=>this.setPickerView(false)} triangle="hide" color={ this.state.color } onChange={(color)=>this.setPickColor(color)} onChangeComplete={(color, event)=>{this.setState({color:color.hex});this.setPickerView(false);}}colors={['#3174ad','#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']} />
                    </div>):null
                  }
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
                <Button type="reset" onClick={()=>{this.onClose();}}>취소</Button>
                <Button type="submit" positive>저장</Button>
            </form>
            {this.translationRRule(this.state.rrule)}
            </Modal.Content>
          </Modal>
    );
}
}
export default Maker;
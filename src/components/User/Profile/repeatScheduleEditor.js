import React, { useState } from 'react';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import RRuleGenerator from  'react-rrule-generator';
import 'react-rrule-generator/build/styles.css';
import {Form, Icon, Modal, Button,Input,TextArea} from 'semantic-ui-react';
import axios from 'axios';
import { TwitterPicker  } from 'react-color';
import moment from 'moment';
import {rrulestr} from 'rrule';

let pickColor=null;
const Editor =({open, schedule, toggle, remove })=>{
    let data = {}
    if(schedule !=null){
        data ={
            _id: schedule._id,
            repeat :schedule.repeat,
            title:schedule.title,
            color:pickColor!=null?pickColor:schedule.color,
            desc:schedule.desc,
            startTime:schedule.startTime,
            endTime:schedule.endTime
        }
    } 
    const [displayColorPicker, setPickerView] = React.useState(false);
    const setPickColor = (color) => {
        pickColor= color.hex ;
      };
    const onSubmit = (event) => {
        event.preventDefault();
        axios.post(window.location.href+"/repeat/save",{data:data})
        .then(res=>{
            if(res.data.success){
                toggle(false);
                window.location.reload();
            }
        }).catch(function (err) {
            console.log(err);
        })
        return false;
    }
    if(open){
        if(Array.isArray(data.startTime)){
            data.startTime = schedule.startTime[0]+":"+(schedule.startTime[1]==0?"00":schedule.startTime[1]);
            data.endTime = schedule.endTime[0]+":"+(schedule.endTime[1]==0?"00":schedule.endTime[1]);
        }
        return (
            <Modal onClose={() => {toggle(false);pickColor=null;}} onOpen={() => toggle(true)} open={open}>
                <Modal.Content>
                <form onSubmit={(event)=>onSubmit(event)}>
                    <div>
                    <Input name="title" type="text" label="반복 일정 이름" value={data.title} onChange={(e)=>{data.title=e.target.value}}/>
                    <Input type="hidden" name="color" value={data.color}/>
                    <Input type="hidden" name="id" value={data!=null?data._id:null}/>
                        <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '5px',
                              backgroundColor:data.color,
                          }} onClick={()=>setPickerView(!displayColorPicker)}></div>
                      </div>
                      {displayColorPicker ?( 
                         <div style={{left: '50px',position: 'fixed', top: '100px', zIndex: 1020,}}>
                            <div style={{ position: 'fixed',
                                        top: '0px',
                                        right: '0px',
                                        bottom: '0px',
                                        left: '0px',
                             } } onClick={()=>setPickerView(!displayColorPicker) }/>
                            <TwitterPicker onClose={()=>setPickerView(false)} triangle="hide" color={ data.color } onChange={(color)=>setPickColor(color)} onChangeComplete={(color, event)=>{setPickColor(color);setPickerView(false);}}colors={['#3174ad','#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']} />
                        </div>):null}
                   <div>
                   <TextArea name="desc" type="text" label="일정 설명" value={data.desc} onChange={(e)=>{data.desc=e.target.value}}/>
                   </div>
                    
                    <div>
                        몇시부터 몇시까지 하나요?
                        <TimeRangePicker
                            onChange={(value)=>{data.startTime=value[0];data.endTime=value[1];}}
                            value={[data.startTime,data.endTime]}
                        />
                    </div>
                    <RRuleGenerator
                        onChange={(rrule) =>{ data.repeat= rrule}}
                        config={{
                        repeat: ['Monthly', 'Weekly'],
                        end: ['Never', 'On date'],
                        weekStartsOnSunday: true,
                        hideError: true,
                        hideStart:false,
                        }}
                        value={data.repeat}
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
                            'end.on_date':'몇일 까지',
                            'end.executions':''
                        }}
                    />
                    <Button type="reset" onClick={()=>{toggle(false);pickColor=null}}>취소</Button>
                    <Button type="reset" negative onClick={()=>remove(data._id)}>삭제</Button>
                    <Button type="submit" positive>저장</Button>
                </form>
                </Modal.Content>
              </Modal>
        );
    }
    return <div></div>
}
export default Editor;
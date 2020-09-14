import React from 'react'
import dates from 'react-big-calendar/lib/utils/dates';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import Moment from 'react-moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import RepeatScheduleMaker from './repeatScheduleMaker'
import { RRule, RRuleSet, rrulestr } from 'rrule';
import axios from 'axios';
import EventComponent from './eventComponent';
import {Modal, Input, TextArea, Button, Checkbox, Portal, Segment, Header} from 'semantic-ui-react';
import ModalSchedule from './modalSchedule';

let allViews = Object.keys(Views).map(k => Views[k])
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })
  const localizer = momentLocalizer(moment);

class EditCalendar extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.state={
          openViewSchedule:false, 
          openCreateRepeatSchedule:false, 
          openViewRepeatSchedule:false, 
          viewSchedule:null,
          editSchedule:null,
          calendar:null,
          events:[],
          showModal:false,
          dateTimes:null,
          messages : { // new
            allDay: '하루종일',
            previous: '<',
            next: '>',
            today: '오늘',
            month: '달별',
            week: '주별',
            day: '일별',
            agenda: '일정',
            date: '날짜별',
            time: '시간별',
            event: '이벤트별',
            showMore: total => (
              <div
                style={{ cursor: 'pointer' }}
                onMouseOver={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >{`+${total} more`}
              </div>
            ),
          }
      }
    }
    componentDidMount(){
        axios.post(window.location.href)
            .then(res => {
                console.log(res.data)
                this.setState({
                    calendar: res.data.calendar,
                });
                this.onNavigate(new Date(), "month");
                })
            .catch(function (err) {
                console.log(err);
            })
    }
    onNavigate = (date, view) => {
        let start, end;

        if (view === 'month') {
          start = moment(date).startOf('month').startOf('week')
          end = moment(date).endOf('month').endOf('week')
        }

        this.getSchedules(this.state.calendar, start, end);
        console.log(start, end);
    }
    getRepeatSchedules(repeatSchedules,startView,endView){
        var schedules = [];
        const offset = new Date().getTimezoneOffset() * 60 * 1000; // get offset for local timezone (can modify here to support tzid)
          repeatSchedules.map(schedule=>{
            var rrules = rrulestr(schedule.repeat);
            rrules.between(startView.toDate(),endView.toDate()).map(rrule=>{
                rrule =  rrule.setTime(rrule.getTime()+offset);
                var start= new Date(rrule);
                var end = new Date(rrule);
                if(schedule.startTime[0]>schedule.endTime[0]){
                    end.setDate(end.getDate()+1);
                }
                start.setHours(schedule.startTime[0],schedule.startTime[1]);
                end.setHours(schedule.endTime[0],schedule.endTime[1]);
  
                schedules.push({
                    id:schedule.id,
                    title: schedule.title,
                    start: start,
                    end: end,
                    color:schedule.color,
                    repeat: true,
                    desc: schedule.desc
                }) 
            });
        })
          return schedules;
      }

      getSchedules(calendar, startView, endView){
        var schedules = calendar.schedules;
        var repeat = this.getRepeatSchedules(calendar.repeatSchedules,startView,endView);    

        var newSchedules = schedules.concat(repeat);
        this.setState(()=>({events:newSchedules}));
    }

    getRepeatSchedulesMaker(){
        return  <RepeatScheduleMaker setState={this.setState}/>
    } 
    
    getEvent(){
        return this.state.events
    }
    
  //   onShceduleSubmit = (event) => {
  //     event.preventDefault();
  //     axios.post(window.location.href+"/save",{data:{
  //       events:this.state.events,
  //       dateTimes:this.state.dateTimes,
  //       date
  //     }})
  //     .then(res=>{
  //         if(res.succes){
  //             window.location.reload();
  //         }
  //     }).catch(function (err) {
  //         console.log(err);
  //     })
  //     return false;
  // }

    setOpenViewSchedule(open,event=null){
      console.log(event);
      this.setState(()=>({openViewSchedule:open, viewSchedule:event}))
    }


    setOpenCreateSchedule=(open)=>{
      this.setState(()=>({openCreateSchedule:open}))
  }

    createSchedules=({ start, end })=>{
        this.setState({dateTimes:[start,end]})
        this.setOpenCreateSchedule(true);
    }

    editSchedule=(event)=>{
      this.setState({editSchedule:event})
      console.log(event)
      this.setOpenCreateSchedule(true);
    }
    editRepeatSchedule=(event)=>{
      
    }

    
    deleteShcedule(id){
      axios.post(window.location.href+"delete",{data:id})
      .then(res=>{
        console.log(res)
        if(res.data.success){
          this.setState({calendar:res.data.calendar, openViewSchedule:false});
          window.location.reload();
        }
      }).catch(err=>{
        console.log(err);
        alert(err);
      })
    }

    onCloseScheduleWindow=()=>{
      this.setOpenCreateSchedule(false)
      this.setState({
        editSchedule: null,
        dateTimes:null
      })
    }
    handleSelect = ({ start, end }) => {
        const title = window.prompt('New Event name')
        if (title)
          this.setState({
            events: [
              ...this.state.events,
              {
                start,
                end,
                title,
              },
            ],
          })
      }
    viewSchedule(){
      if(this.state.viewSchedule!=null){
        var view = this.state.viewSchedule;
        if(typeof(view.start)==='string'){
          view.start = new Date(view.start);
          view.end = new Date(view.end);
          // view.start.setTime(startDate.getTime()+offset);
          // view.end.setTime(endDate.getTime()+offset);
        }
        return (<Portal onClose={()=>this.setOpenViewSchedule(false)} open={this.state.openViewSchedule}>
            <Segment
              style={{
                left: '40%',
                position: 'fixed',
                top: '50%',
                zIndex: 1000,
              }}
            >
              <Header>{view.title}</Header>
              <p><Moment  format="YYYY-MM-DD HH:mm">{view.start}</Moment></p>
              <p>~</p>
              <p><Moment  format="YYYY-MM-DD HH:mm">{view.end}</Moment></p>
              <p>{view.desc}</p>

              <Button
                content='닫기'
                onClick={()=>this.setOpenViewSchedule(false)}
              />
              <Button
                content='삭제'
                negative
                onClick={()=>this.deleteShcedule(view._id)}
              />
              <Button
                content='수정'
                positive
                onClick={()=>view.repeat?this.editRepeatSchedule(view):this.editSchedule(view)}
              />                            
            </Segment>
          </Portal>  )
      }
    }

    test=(e)=>{
      e.preventDefault();
      console.log(e.target)
    }
    eventStyleGetter(event, start, end, isSelected){
      var backgroundColor = event.color;
      var style = {
          backgroundColor: backgroundColor,
          borderRadius: '5px',
          opacity: 0.8,
          border: '0px',
          display: 'block'
      };
      return {
          style: style
      };
    }
    render() {
      console.log()
      return (
        <div>
            {this.getRepeatSchedulesMaker()}
            <Calendar
                selectable
                localizer={localizer}
                events={this.getEvent()}
                onNavigate={this.onNavigate}
                views={["month","week"]}
                step={60}
                messages={this.state.messages}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={event => this.setOpenViewSchedule(true,event)}
                onSelectSlot={this.createSchedules}
                culture='ko-KR'
                // onSelectEvent={event => alert(event.title)}
                components={{
                  timeSlotWrapper: ColoredDateCellWrapper,
                  event: EventComponent
                }}
                style={{ height: 500, width:800 }}
                // eventPropGetter={event => ({
                //   style: {
                //     backgroundColor: event.color,
                //   },
                // })}
                eventPropGetter={(this.eventStyleGetter)}
            />

            <Modal onClose={()=>this.onCloseScheduleWindow()} onOpen={()=>this.setOpenCreateSchedule(true)} open={this.state.openCreateSchedule}>
                <ModalSchedule onCloseScheduleWindow={this.onCloseScheduleWindow} setOpenCreateSchedule={this.setOpenCreateSchedule} schedule={this.state.editSchedule} dateTimes={this.state.dateTimes}/>       
            </Modal>            
        {this.viewSchedule()}      
        </div>
      );
    }
  }
export default EditCalendar
import React from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { RRule, RRuleSet, rrulestr } from 'rrule';
import events from './events';
import {Modal,Portal,Segment,Header, Button} from 'semantic-ui-react';
import EventComponent from './eventComponent';
import Moment from 'react-moment';

// var Globalize = require( "globalize" );
// Globalize.load( require( "cldr-data" ).entireSupplemental() );
// Globalize.load( require( "cldr-data" ).entireMainFor( "en" ) );
// Globalize.loadTimeZone( require( "iana-tz-data" ) );

const localizer = momentLocalizer(moment)
let allViews = Object.keys(Views).map(k => Views[k])
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

  class BigCalendar extends React.Component {
    constructor(props) {
      super(props);
      this.state={
          openViewSchedule:false,
          viewSchedule:null,
          calendar:props.calendar,
          events:[],
          showModal:false,
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
        this.onNavigate(new Date(), "month");
    }
    onNavigate = (date, view) => {
        let start, end;

        if (view === 'month') {
          start = moment(date).startOf('month').startOf('week')
          end = moment(date).endOf('month').endOf('week')
        }        
        this.getSchedules(this.state.calendar, start, end)
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
                  title: schedule.title,
                  start: start,
                  end: end,
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

  getEvent(){
    console.log(this.state.events);
    return this.state.events
  }

  setOpenViewSchedule(open,event=null){
    console.log(event);
    this.setState(()=>({openViewSchedule:open, viewSchedule:event}))
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
          </Segment>
        </Portal>  )
    }
  }
  render() {
    return (
      <div>
        <Calendar
          selectable
          localizer={localizer}
          events={this.getEvent()}
          onNavigate={this.onNavigate}
          views={["month","week"]}
          step={60}
          messages={this.state.messages}
          onSelectEvent={event => this.setOpenViewSchedule(true,event)}
          startAccessor="start"
          endAccessor="end"
          culture='ko-KR'
          // onSelectEvent={event => alert(event.title)}
          components={{
            timeSlotWrapper: ColoredDateCellWrapper,
            event: EventComponent
          }}
          style={{ height: 500, width:800 }}
          eventPropGetter={(this.eventStyleGetter)}
        />   
        {this.viewSchedule()} 
      </div>
    );
  }
}
export default BigCalendar
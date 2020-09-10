import React from 'react'
import dates from 'react-big-calendar/lib/utils/dates';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import RepeatScheduleMaker from './repeatScheduleMaker'
import { RRule, RRuleSet, rrulestr } from 'rrule';
import axios from 'axios';


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
          calendar:null,
          events:[]
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
        repeatSchedules.map(schedule=>{
            var rrules = rrulestr(schedule.repeat);
            rrules.between(startView.toDate(),endView.toDate()).map(rrule=>{
                var start,end = new Date(rrule);
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
        var newSchedules = schedules.concat(this.getRepeatSchedules(calendar.repeatSchedules,startView,endView));
        this.setState({envets:newSchedules}) ;
    }

    getRepeatSchedulesMaker(){
        return  <RepeatScheduleMaker setState={this.setState}/>
    }
    
    render() {
      return (
        <div>
            {this.getRepeatSchedulesMaker()}
            <Calendar
                localizer={localizer}
                events={this.state.events}
                onNavigate={this.onNavigate}
                views={["month"]}
                step={60}
                startAccessor="start"
                endAccessor="end"
                components={{
                    timeSlotWrapper: ColoredDateCellWrapper,
                }}
                style={{ height: 500, width:800 }}
            />
        </div>
      );
    }
  }
export default EditCalendar
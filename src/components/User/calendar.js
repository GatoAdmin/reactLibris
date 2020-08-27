import React from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import events from './events'

const localizer = momentLocalizer(moment)
let allViews = Object.keys(Views).map(k => Views[k])
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

  let Basic = ({ localizer }) => (
    <Calendar
      events={events}
      views={allViews}
      step={60}
      showMultiDayTimes
      defaultDate={new Date(2015, 3, 1)}
      components={{
        timeSlotWrapper: ColoredDateCellWrapper,
      }}
      localizer={localizer}
    />
  )
  
const MyCalendar = props => (
  <div>
    <Calendar
      localizer={localizer}
      events={events}
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
)
export default MyCalendar
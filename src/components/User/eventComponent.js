import React from 'react'
import {Popup, Header} from 'semantic-ui-react';

const offset = new Date().getTimezoneOffset() * 60 * 1000; 
function EventComponent(props){
    var event = props.event;
    var startDate = event.start;
    var endDate = event.end;
    if(typeof(startDate)==='string'){
        startDate = new Date(event.start);
        endDate = new Date(event.end);
        startDate.setTime(startDate.getTime()+offset);
        endDate.setTime(endDate.getTime()+offset);
    }
    var start = (startDate.getHours()===0?"00":startDate.getHours())+":"+(startDate.getMinutes()===0?"00":startDate.getMinutes());
    var end = (endDate.getHours()===0?"00":endDate.getHours())+":"+(endDate.getMinutes()===0?"00":endDate.getMinutes())
    return (
        <Popup trigger={<div>{event.title}</div>} >
            <Header content={event.title} subheader={start+"~"+end}/>
            <Popup.Content>
                <div>{event.desc}</div>
            </Popup.Content>
        </Popup>
    );
    
}
  export default EventComponent
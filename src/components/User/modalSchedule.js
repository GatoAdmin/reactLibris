import React from 'react';
import {Modal, Input, TextArea, Button, Checkbox, Portal, Segment, Header} from 'semantic-ui-react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { TwitterPicker  } from 'react-color';
import { render } from '@testing-library/react';


class ModalSchedule extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            schedule : props.schedule,
            openCreateSchedule: false, 
            displayColorPicker :false,
            dateTimes: props.dateTimes,
            title:"",
            desc:"",
            allDay:false,
            pickColor:'#3174ad',
        }
    }
    componentDidMount(){
        this.setSchedule(this.props.schedule);
    }
    componentDidUpdate(prevProps, prevState){
        if (this.props.schedule !== prevProps.schedule) {
            this.setSchedule(this.props.schedule);
            }
    }
 setPickerView = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };
 setPickColor = (color) => {
    console.log(color);
    this.setState({ pickColor: color.hex })
  };
  setSchedule(schedule){
    console.log( schedule) 
      if(schedule!=null){
          this.setState({
            title:schedule.title,
            desc:schedule.desc,
            allDay:schedule.allDay,
            pickColor:schedule.color,
            dateTimes: [schedule.start,schedule.end],
          }) 
      }else{
        this.setState({
          title:"",
          desc:"",
          allDay:false,
          pickColor:'#3174ad',
          dateTimes: null,
        }) 
      }
  }
    render(){
        return( 
            <div>
            <Header>{this.state.title!=""? this.state.title:"새로운 일정"}</Header>
            <Modal.Content>
              {/*  onSubmit={(e)=>this.test(e)}  */}
                <form action={window.location.href+"save"} method="POST">
                  <div>
                    <Input type="text" name="title" label="제목" value={this.state.title} onChange={(e)=>{this.setState({title:e.target.value})}}/>
                    <Input type="hidden" name="color" value={this.state.pickColor}/>
                    <Input type="hidden" name="id" value={this.props.schedule!=null?this.props.schedule._id:null}/>
                    <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '5px',
                          backgroundColor:this.state.pickColor,
                      }} onClick={()=>this.setPickerView()}></div>
                  </div>
                  {
                     this.state.displayColorPicker ?( 
                     <div style={{left: '40%',position: 'fixed', top: '30%', zIndex: 1020,}}>
                        <div style={{ position: 'fixed',
                                    top: '0px',
                                    right: '0px',
                                    bottom: '0px',
                                    left: '0px',
                         } } onClick={()=>this.setPickerView() }/>
                        <TwitterPicker onClose={()=>this.setPickerView(false)} triangle="hide" color={ this.state.pickColor } onChange={(color)=>this.setPickColor(color)} onChangeComplete={(color, event)=>{this.setState({pickColor:color.hex});this.setPickerView(false);}}colors={['#3174ad','#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF']} />
                    </div>):null
                  }
                    <div>   
                        {this.state.allDay?
                        <DateRangePicker
                          name="dateTimes"
                          onChange={(value)=>{console.log(value);this.setState({dateTimes:value})}}
                          value={this.state.dateTimes!=null?this.state.dateTimes:this.props.dateTimes}
                          disableClock={true}
                          disableCalendar={true}

                        />:
                        <DateTimeRangePicker
                            name="dateTimes"
                            onChange={(value)=>{console.log(value);this.setState({dateTimes:value})}}
                            value={this.state.dateTimes!=null?this.state.dateTimes:this.props.dateTimes}
                            disableClock={true}
                            disableCalendar={true}                        
                        />}
                        <Checkbox name="allDay" toggle label="하루종일" value={this.state.allDay} onChange={(event,data)=>{console.log(data);this.setState({allDay:data.checked})}}/>
                    </div>
                    <TextArea name="desc" type="text" label="메모" value={this.state.desc} onChange={(e)=>this.setState({desc:e.target.value})}/>
                    <Button type="reset" onClick={()=>{this.props.onCloseScheduleWindow(); this.setSchedule(null)}}>취소</Button>
                    <Button type="sumbit" positive>저장</Button>
                </form>
            </Modal.Content> 
            </div>    
                )
    }
}

export default ModalSchedule;
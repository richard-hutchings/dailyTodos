import React from 'react';
//import { library } from '@fortawesome/fontawesome-svg-core';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faPlay, faPause, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Button, Icon } from 'semantic-ui-react';
import './timer.css';

//library.add( faPlay, faPause, faPlus, faMinus )

const SESSION = "SESSION";
const BREAK = "BREAK";
const DEFAULT_STATE = {action: "", time_type: SESSION, time_left: 50 * 60, break_length: 10, session_length: 50};
const BEEP = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3";


const SettingChanger = props => {
  return (
     <div className="setting-cont">
       <div id={props.sname + "-label"} 
       style={props.labelColor}>
         {props.sname.charAt(0).toUpperCase() + props.sname.slice(1)} </div>
       <div className="setting-inner">

       <Button icon id={props.sname + "-decrement"} 
         style={props.visible}
         type="button" 
         onClick={()=>props.changer(-1)} >
           <Icon name='minus' />
           </Button>
         <label id={props.sname + "-length"} 
         style={props.labelColor}> {props.setting}</label>
        
        <Button icon id={props.sname + "-increment"} 
         style={props.visible} 
         type="button" 
         onClick={()=>props.changer(1)} >
           <Icon name='plus' />
           </Button>
       </div>
     </div>
  );
};

class Pomo extends React.Component {
 constructor(props){
   super(props);
   this.state = DEFAULT_STATE;
   this.timer = "";
   this.clip = "";
   this.getClockTime = this.getClockTime.bind(this);
   this.changeBreak = this.changeBreak.bind(this);
   this.changeSession = this.changeSession.bind(this);
   this.startStop= this.startStop.bind(this);
   this.tickTime = this.tickTime.bind(this);
   this.reset = this.reset.bind(this);
   this.audio = React.createRef();
   
 } 
  

  getClockTime(seconds){
      let min = (Math.floor(seconds/60)).toString().padStart(2,"0");
    let sec = (seconds%60).toString().padStart(2,"0");
    return min + " : " + sec; 
  }
  
  changeBreak(value){
     let new_break = this.state.break_length + value;
    if(new_break > 0 && new_break <= 60){
      this.setState({action: "",
         time_type: this.state.time_type,
         time_left: this.state.time_left,
         break_length: new_break, 
         session_length: this.state.session_length});
    }
  }
  
  changeSession(value){
    let new_session = this.state.session_length + value;
    if(new_session > 0 && new_session <= 60){
      this.setState({action: "", 
       time_type: this.state.time_type, 
       time_left: new_session * 60,
       break_length: this.state.break_length, 
       session_length: new_session});
    }
  }
    
  startStop(){
    this.audio.current.load();
     let promise = this.audio.current.play();
    if (promise !== undefined) {
      promise.then(_ => {
      }).catch(_error => {
      })
    }
    
    if(this.timer === ""){
       this.setState({action: "playing", 
       time_type: this.state.time_type,
       time_left: this.state.time_left,
       break_length: this.state.break_length,
       session_length: this.state.session_length});
      this.timer = setInterval(this.tickTime, 1000);
    }
    else{
         this.setState({action: "paused",
          time_type: this.state.time_type,
          time_left: this.state.time_left,
          break_length: this.state.break_length,
          session_length: this.state.session_length});
      clearInterval(this.timer);
      this.timer = "";
    }
  }

  tickTime(){
 if(this.state.time_left === 0){
   let promise = this.audio.current.play();
    if (promise !== undefined) {
      promise.then(_ => {
      }).catch(_error => {
      })
    }
      if(this.state.time_type === SESSION){
        this.setState({action: this.state.action,
           time_type: BREAK,
           time_left: this.state.break_length * 60,
           break_length: this.state.break_length,
           session_length: this.state.session_length});
      }
      else{
         this.setState({action: this.state.action,
           time_type: SESSION,
           time_left: this.state.session_length * 60, 
           break_length: this.state.break_length,
           session_length: this.state.session_length});
      }
    }
    else{
      this.setState({action: this.state.action,
        time_type: this.state.time_type, 
        time_left: this.state.time_left -1,
        break_length: this.state.break_length, 
        session_length: this.state.session_length});
    }
  }
  
   reset(){
    this.audio.current.pause();
    this.audio.current.currentTime = 0;
    if(this.timer !== ""){
      clearInterval(this.timer); 
      this.timer = "";
    }
    this.setState(DEFAULT_STATE);
  }
  
  render(){
    let time = this.getClockTime(this.state.time_left);
    /*let symbol = 
      <Button Icon >
        <Icon name='play' />
      </Button> ; */
    
    let symbColor = {color: "Chartreuse"};
    let canChange = {visibility: "visible"}; 
    let color = "Chartreuse"; 
    let border = "Chartreuse";
    if(this.state.action !== ""){
      canChange.visibility = "hidden";
    }
    if(this.state.action === "playing"){
      border = "Chartreuse";
     /* symbol =
      <Button Icon >
        <Icon name='pause' />
      </Button> ; */
      
      symbColor.color = "Chartreuse";
      
    }
    if (this.state.action === "paused"){
      border = "orchid";
      color = "orchid";
      symbColor.color = "orchid";
    }
    let clockRimStyle = {color: color, borderColor: border};
    let headColor = {color: border};
    let breakLabelColor = {color: "Chartreuse"};
    let sessLabelColor =  {color: "Chartreuse"};
    if(this.state.action !== "" && this.state.time_type === SESSION){
      sessLabelColor.color = border;
    }
    else if (this.state.action !== "" && this.state.time_type === BREAK){
      breakLabelColor.color = border;
    }
 return(
 <div id="clock-outer">
   
   <audio ref={this.audio} id="beep" src={BEEP}/>
   <div id="center">
   
     <SettingChanger 
     sname="break" 
     setting={this.state.break_length} 
     changer={this.changeBreak} 
     visible={canChange} 
     labelColor={breakLabelColor}
     />
     <div id="timer-cont">
       <div id="time-center"
        style={clockRimStyle}>
          <h3 id="timer-label" style={headColor}>
            {this.state.time_type}
          </h3>
          <span id="time-left">{time}</span>
        

          <div id="clock-functions-cont" >
           <Button Icon id="start_stop" 
            type="button" 
            style={symbColor}
            onClick={this.startStop} >
              <Icon name='play' />
           </Button>

           <Button icon id="reset" 
           type="button" 
           style={symbColor}
           onClick={this.reset} >
             <Icon name='redo' />
             </Button>
         </div>
     </div>
  </div>
     <SettingChanger 
     sname="session" 
     setting={this.state.session_length} 
     changer={this.changeSession} 
     visible={canChange} 
     labelColor={sessLabelColor}
     />
     </div>
     
     </div>
     );
  }
}

// line 223  <i className={symbol}></i>
/*  <div id="clock-functions-cont" >
           <Button icon id="start_stop" 
            type="button" 
            onClick={this.startStop} >
              <Icon name={symbol}/>
             
           </Button>
           <Button icon id="reset" 
           type="button" 
           onClick={this.reset} >
             <Icon name='redo' />
             </Button>
         </div>   */
export default Pomo;     
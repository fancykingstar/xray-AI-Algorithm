import React, { Component } from 'react';
import 'react-bootstrap-toggle/dist/bootstrap2-toggle.css'
import Toggle  from 'react-bootstrap-toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faSearch, faSearchPlus, faExpandArrowsAlt, faAdjust, faDrawPolygon, faEraser } from '@fortawesome/free-solid-svg-icons'
import "./toolbar.css"
import EE from './ee.js'


class ToggleToolItem extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        toggleActive: this.props.activeState,
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick =  () => {
     this.setState(
        (ps, s) => { 
           return {toggleActive: !this.state.toggleActive }
        }, 
        () => {this.props.toolbarFunc({name: this.props.toolname+'_state', state:this.state.toggleActive});}

     );
  }

  render() {
     return (
       <div style={{display:"flex", flex:"1 1"}}>
          <FontAwesomeIcon icon={this.props.icon} style={{ color:'white', height: '25px', width: '25px', margin: "10px"}} />
          <Toggle onClick={this.handleClick}
             style={ { width: "50%", marginTop: "8px" } }
             on={<div style={{ flex: "1 1", fontSize: "0.7rem"}}>{this.props.onText}</div>}
             off={<div style={{ flex: "1 1", fontSize: "0.7rem"}} >{this.props.offText}</div>}
             onstyle="tgon"
             offstyle="tgon"
             size="small"
             active={this.props.activeState}
             handlestyle="warning"
             height={"40px"}
          />
       </div>
    )
  }

};

class Toolbar extends Component {
  static contextType = EE;
  constructor(props) {
    super(props);
    this.state = { 
        Pan_state:  true,
        Wwwc_state: false,
        Zoom_state: false,
        Magnify_state: false,
        Invert_state: false,
        Length_state: false,
        Eraser_state: false
    };
    this.toolbarFunc = this.toolbarFunc.bind(this);
  }

   handleInvert = (toggleobj) => {
     var o = { }
     o[toggleobj.name] =  toggleobj.state;
     this.setState(
           (ps,s) => {
              return o;
           },
           () => { this.props.evem.emitEvent('invert',[this.state.Invert_state]) }
        );
   } 


  toolbarFunc = (toggleobj) => {
    const defaultState = {
           Pan_state:  true,
           Wwwc_state: false,
           Zoom_state: false,
           Magnify_state: false,
           Length_state: false,
           Eraser_state: false
    };
    const allOffState = {
           Pan_state:  false,
           Wwwc_state: false,
           Zoom_state: false,
           Magnify_state: false,
           Length_state: false,
           Eraser_state: false
    };
     if( toggleobj.name === "Invert_state") {
        this.handleInvert(toggleobj);
        return;
     }
     if ( toggleobj.state === false ) {
        this.setState( 
           (ps,s) => {
              return {...defaultState};
           },
           () => { this.props.evem.emitEvent('alltools',[this.state]) }
        );
     } else {
        var o = { }
        o[toggleobj.name] =  toggleobj.state;
        this.setState( 
           (ps,s) => {
              return Object.assign({},allOffState,o);
           },
           () => { this.props.evem.emitEvent('alltools',[this.state]) }
        );
     }
  }
 
  render() {
    return (
       <React.Fragment>
          <ToggleToolItem activeState={this.state.Pan_state} 
             toolname={"Pan"} i
             icon={faExpandArrowsAlt}
             onText={"Pan On"}
             offText={"Pan Off"}
             toolbarFunc={this.toolbarFunc}
          />
          <ToggleToolItem activeState={this.state.Wwwc_state} 
             toolname={"Wwwc"} i
             icon={faSun}
             onText={"WW/WC On"}
             offText={"WW/WC Off"}
             toolbarFunc={this.toolbarFunc}
          />
          <ToggleToolItem activeState={this.state.Zoom_state} 
             toolname={"Zoom"} i
             icon={faSearchPlus}
             onText={"Zoom On"}
             offText={"Zoom Off"}
             toolbarFunc={this.toolbarFunc}
          />
          <ToggleToolItem activeState={this.state.Magnify_state} 
             toolname={"Magnify"} i
             icon={faSearch}
             onText={"Magnifier On"}
             offText={"Magnifier Off"}
             toolbarFunc={this.toolbarFunc}
          />
          <ToggleToolItem activeState={this.state.Invert_state} 
             toolname={"Invert"}
             icon={faAdjust}
             onText={"Invert On"}
             offText={"Invert Off"}
             toolbarFunc={this.toolbarFunc}
          />
          <ToggleToolItem activeState={this.state.Length_state} 
             toolname={"Length"} i
             icon={faDrawPolygon}
             onText={"Length On"}
             offText={"Length Off"}
             toolbarFunc={this.toolbarFunc}
          />
          <ToggleToolItem activeState={this.state.Eraser_state} 
             toolname={"Eraser"} i
             icon={faEraser}
             onText={"Eraser On"}
             offText={"Eraser Off"}
             toolbarFunc={this.toolbarFunc}
          />
       </React.Fragment>
    )
  }

  componentDidMount() {
  }

};

export default Toolbar;

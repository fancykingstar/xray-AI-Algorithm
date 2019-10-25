import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-bootstrap-toggle/dist/bootstrap2-toggle.css'
import Toggle  from 'react-bootstrap-toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faSearch, faSearchPlus, faExpandArrowsAlt, faAdjust, faDrawPolygon, faEraser } from '@fortawesome/free-solid-svg-icons'
import "./toolbar.css"
import EE from './ee.js'
import HeatmapToggle from '../HeatmapToggle';


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

  entering = (e) => {
    e.children[0].style.borderTopColor = '#f6f8fa';
    e.children[1].style.backgroundColor = '#f6f8fa';

    e.children[1].style.color = "black";
  }

  render() {
     return (
       <div style={{display:"flex", flex:"1 1"}}>
          <OverlayTrigger
            key='right'
            placement='right'
            overlay={
              <Tooltip id={`tooltip-right`}>
                {this.props.toolname}
              </Tooltip>
            }
            onEntering={this.entering}
          > 
            <Toggle onClick={this.handleClick}
               style={ { width: "100%", marginTop: "8px", borderRadius: '30px' } }
               on={<div style={{ flex: "1 1", fontSize: "14px"}}>{this.props.onText}</div>}
               off={<div style={{ flex: "1 1", fontSize: "14px"}} >{this.props.offText}</div>}
               onstyle="tgon"
               offstyle="tgon"
               size="small"
               active={this.props.activeState}
               handlestyle="warning"
               height={"35px"}
            />
          </OverlayTrigger>
       </div>
    )
  }

};

class ToolbarHeatMap extends Component {
  static contextType = EE;
  constructor(props) {
    super(props);
    this.state = { 
        color_state: false,
        greyscale_state: false
    };
    this.toolbarFunc = this.toolbarFunc.bind(this);
  }

  toolbarFunc = (toggleobj) => {
    const defaultState = {
      color_state:  true,
      greyscale_state: false,
    }
    const allOffState = {
      color_state:  false,
      greyscale_state: false,
    };
    
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
          {this.props.heatmapactive && <HeatmapToggle 
                heatmapState={this.props.heatmapState} evem={this.props.evem}/>}
       </React.Fragment>
    )
  }

  componentDidMount() {
  }

};

export default ToolbarHeatMap;

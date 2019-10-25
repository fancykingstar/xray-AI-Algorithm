import React, { Component } from 'react';
import Toggle  from 'react-bootstrap-toggle';
import "./toolbar.css"

class HeatmapToggle extends Component {
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
        () => {this.props.evem.emitEvent('togglehmap',[this.state.toggleActive])}
     );
  }

  render() {
     return (
       <div style={{}}>
          <Toggle onClick={this.handleClick}
             style={ { width: "100%", marginTop: "8px", borderRadius: '30px' } }
             on={<div style={{ flex: "1 1", fontSize: "14px"}}>COLOR ON</div>}
             off={<div style={{ flex: "1 1", fontSize: "14px"}} >COLOR Off</div>}
             onstyle="tgon"
             offstyle="tgon"
             size="small"
             active={this.props.heatmapState}
             handlestyle="warning"
             height={"35px"}
          />
       </div>
    )
  }
};

export default HeatmapToggle;

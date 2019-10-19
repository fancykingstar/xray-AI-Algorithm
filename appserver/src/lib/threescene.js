import React, { Component } from 'react';

import entrypoint from "./entrypoint"

export default class Scene extends Component {
    componentDidMount() {
       entrypoint(this.threeRootElement);
    }

    render () {
       var h = window.innerHeight - 80;
       return (
          <canvas style={ {height: h} } ref={element => this.threeRootElement = element} />
       );
    }
}

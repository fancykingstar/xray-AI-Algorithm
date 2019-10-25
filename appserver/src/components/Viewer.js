import React, { Component } from 'react';
import {css} from '@emotion/core'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import cornerstone from 'cornerstone-core'
import cornerstoneTools from 'cornerstone-tools'
import ReactResizeDetector from 'react-resize-detector'
import ViewportOverlay from './ViewportOverlay.js';
import HeatmapToggle from './HeatmapToggle.js'


const Wrapper = styled.div(props => css`
   width:100%;
   height:100%;
   position:relative;
   display:inline-block;
   color:white;
   background-color:black;
`)

const DicomImage = styled.div(props => css`
   width:100%;
   height:100%;
   top:0px;
   left:0px; 
   position:absolute;
`)

function initializeTools(cornerstoneTools, element) {
   var zoomConfig = {
       minScale: 0.3,
       maxScale: 25,
       preventZoomOutsideImage: true
   }
  cornerstoneTools.addToolForElement(element, cornerstoneTools["WwwcRegionTool"]);
  cornerstoneTools.addToolForElement(element, cornerstoneTools["WwwcTool"]);
  cornerstoneTools.addToolForElement(element, cornerstoneTools["PanTool"]);
  cornerstoneTools.addToolForElement(element, cornerstoneTools["MagnifyTool"]);
  cornerstoneTools.addToolForElement(element, cornerstoneTools["ZoomTool"],zoomConfig);
  cornerstoneTools.addToolForElement(element, cornerstoneTools["ZoomMouseWheelTool"],zoomConfig);
  cornerstoneTools.addToolForElement(element, cornerstoneTools["LengthTool"]);
  cornerstoneTools.addToolForElement(element, cornerstoneTools["EraserTool"]);
  cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1});
  cornerstoneTools.setToolActive("ZoomMouseWheel",{});
}

class Viewer extends Component {
   static defaultProps = {
      activeTool: 'Pan',
      isActive: false
   };
   static propTypes = {
      activeTool: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired
   };

   constructor(props) {
      super(props);
      const imageid=props.imageid;

      this.state = {
         imageId: imageid,
         viewportHeight: '100%',
         isLoading: false,
         error: null,
         viewport: cornerstone.getDefaultViewport(null, undefined)
      };

      this.debouncedResize = debounce( () => {
         try {
            cornerstone.getEnabledElement(this.element);
         } catch (error) {
            console.error(error);
            return;
         }
         cornerstone.resize(this.element, true);

         this.setState({
            viewportHeight: `${this.element.clientHeight - 20}px`
         });
      }, 300);
      this.props.evem.addListener('alltools', this.buttonStatesFromSideBar);
      this.props.evem.addListener('invert', this.invertButtonFromSideBar);
   }

   buttonStatesFromSideBar = (states) => {
      Object.keys(states).forEach(function(key) {
         var tool = key.replace('_state','');
         if ( states[key] === true ) {
            cornerstoneTools.setToolActive(tool, { mouseButtonMask: 1});
         }
         else {
            cornerstoneTools.setToolPassive(tool);
         }
      });
   }

   invertButtonFromSideBar = (invstate) => {
     const viewport = cornerstone.getViewport(this.element);
     // Toggle invert
     console.log("The inverst state: " + viewport.invert);
     if (viewport.invert === true) {
         viewport.invert = false;
     } else {
         viewport.invert = true;
     }
     cornerstone.setViewport(this.element, viewport);
   }


   onContextMenu = event => {
      event.preventDefault();
   }

   onWindowResize = () => {
      this.debouncedResize();
   }

   render() {
     return (
          <Wrapper>
            {ReactResizeDetector && (
               <ReactResizeDetector
                  handleWidth
                  handleHeight
                  onResize={this.onWindowResize}
               />
             )}
             <DicomImage 
                onContextMenu={this.onContextMenu}
                ref={el => {this.element = el}}
             />
             <ViewportOverlay viewport={this.state.viewport} imageId={this.state.imageId}>
             </ViewportOverlay>
          </Wrapper>
      );
   }

   setActiveTool = activeTool => {
      cornerstoneTools.setToolActive(activeTool, {
          mouseButtonMask: 1,
      });
   };

  onImageRendered = event => {
    this.setState({
      viewport: Object.assign({}, event.detail.viewport)
    });
  };

  onNewImage = event => {
    this.setState({
      imageId: event.detail.image.imageId
    });
  };
  onMouseClick = event => {}
  onImageLoaded = () => {}

   componentDidMount() {
      const element = this.element;
      this.eventHandlerData = [
         {
           eventTarget: element,
           eventType: cornerstone.EVENTS.IMAGE_RENDERED,
           handler: this.onImageRendered
         },
         {
           eventTarget: element,
           eventType: cornerstone.EVENTS.NEW_IMAGE,
           handler: this.onNewImage
         },
       ];
      cornerstone.enable(element, {});
      const { imageId } = this.state;
      this.eventHandlerData.forEach(data => {
          const { eventTarget, eventType, handler } = data;

          eventTarget.addEventListener(eventType, handler);
      });
      initializeTools(cornerstoneTools, element);
      this.renderImage(imageId);
      this.setActiveTool(this.props.activeTool);
   }

   renderImage(imageId) {
      let imagePromise;
      const element = this.element;

      try {
         if( imageId.includes('heatmap') ) {
            imagePromise = cornerstone.loadImage(imageId);
         } else {
            imagePromise = cornerstone.loadAndCacheImage(imageId);
         }
      } catch(error) {
         if ( !imagePromise ) {
               console.error(error);
               return;
         }
      }

      imagePromise.then(
         image => {
            try {
               cornerstone.getEnabledElement(element);
               const viewport = cornerstone.getDefaultViewportForImage(element, image);
               viewport.voiLUT= undefined;
               cornerstone.displayImage(element, image, viewport);
            } catch (error) {
               console.error(error);
               return;
            }
         },
         error => {
            console.error(error);
         }
     );
   }

   componentDidUpdate() {

      if ( this.props.imageid !== this.state.imageId ) {
         this.renderImage(this.props.imageid);
      }
   }


   componentWillUnmount() {
      const element = this.element;
      cornerstone.disable(element);
   }
}

export default Viewer;

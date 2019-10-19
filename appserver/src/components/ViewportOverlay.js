import { PureComponent } from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import cornerstone from 'cornerstone-core';
import { helpers } from './helpers/index.js';
import {css} from '@emotion/core'
import styled from '@emotion/styled'

const TopLeftOverlay = styled.div(props => css`
   /* prevent text selection on overlay */
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   /* ignore pointer event on overlay */
   pointer-events: none;
  position:absolute;
   top:0px;left:0px
   color: white;
`)
const TopRightOverlay = styled.div(props => css`
   /* prevent text selection on overlay */
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   /* ignore pointer event on overlay */
   pointer-events: none;
   position:absolute;top:0px;right:0px
`)
const BottomLeftOverlay = styled.div(props => css`
   /* prevent text selection on overlay */
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   /* ignore pointer event on overlay */
   pointer-events: none;
   position:absolute;bottom:0px;left:0px
`)
const BottomRightOverlay = styled.div(props => css`
   /* prevent text selection on overlay */
   -webkit-touch-callout: none;
   -webkit-user-select: none;
   -khtml-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
   /* ignore pointer event on overlay */
   pointer-events: none;
   position:absolute;bottom:0px;right:0px
`)

const {
  formatPN,
  formatDA,
  formatNumberPrecision,
  formatTM,
} = helpers;

function getCompression(imageId) {
  const generalImageModule =
    cornerstone.metaData.get('generalImageModule', imageId) || {};
  const {
    lossyImageCompression,
    lossyImageCompressionRatio,
    lossyImageCompressionMethod
  } = generalImageModule;

  if (lossyImageCompression === '01' && lossyImageCompressionRatio !== '') {
    const compressionMethod = lossyImageCompressionMethod || 'Lossy: ';
    const compressionRatio = formatNumberPrecision(
      lossyImageCompressionRatio,
      2
    );
    return compressionMethod + compressionRatio + ' : 1';
  }

  return 'Lossless / Uncompressed';
}

class ViewportOverlay extends PureComponent {
  static propTypes = {
    viewport: PropTypes.object.isRequired,
    imageId: PropTypes.string.isRequired,
  };

  render() {
    const imageId = this.props.imageId;
    if (!imageId) {
      return null;
    }
    const zoom = this.props.viewport.scale * 100;
    const seriesMetadata =
      cornerstone.metaData.get('generalSeriesModule', imageId) || {};
    const { seriesNumber, seriesDescription } = seriesMetadata;

    const generalStudyModule =
      cornerstone.metaData.get('generalStudyModule', imageId) || {};
    const { studyDate, studyTime, studyDescription } = generalStudyModule;

    const patientModule =
      cornerstone.metaData.get('patientModule', imageId) || {};
    const { patientId, patientName } = patientModule;

     /**
    const generalImageModule =
      cornerstone.metaData.get('generalImageModule', imageId) || {};
    const { instanceNumber } = generalImageModule;
      **/

    const compression = getCompression(imageId);
    const windowWidth = this.props.viewport.voi.windowWidth || 0;
    const windowCenter = this.props.viewport.voi.windowCenter || 0;
    const wwwc = `W: ${windowWidth.toFixed(0)} L: ${windowCenter.toFixed(0)}`;

    const normal = (
      <React.Fragment>
         <TopLeftOverlay>
            <div>{formatPN(patientName)}</div>
            <div>{patientId}</div>
         </TopLeftOverlay>
         <TopRightOverlay>
          <div>{studyDescription}</div>
          <div>
            {formatDA(studyDate)} {formatTM(studyTime)}
          </div>
        </TopRightOverlay>>
        <BottomRightOverlay>
          <div>Zoom: {formatNumberPrecision(zoom, 0)}%</div>
          <div>{wwwc}</div>
          <div className="compressionIndicator">{compression}</div>
        </BottomRightOverlay>
        <BottomLeftOverlay>
          <div>{seriesNumber >= 0 ? `Ser: ${seriesNumber}` : ''}</div>
          <div>{seriesDescription}</div>
        </BottomLeftOverlay>
      </React.Fragment>
    );

     return <div>{normal}</div>;
  }
}

export default ViewportOverlay;

import {css} from '@emotion/core'
import styled from '@emotion/styled'

const Sidebar = styled.div(props => css`
   display: flex;
   flex-direction: column;
   justify-content: start;
   width: 100%;
   height: 100%;
   background-color: #666699;
   color: #8992ae;
   user-select: none;
`)

const Panel = styled.div(props => css`
   display: flex;
   flex-direction: column;
   margin-top: 20px;
   position: relative;
   color: #8993ae;
   flex: 0 0 auto; 
   justify-content: start;
`)

var PanelTitle = styled.h2(props => css`
   position: relative;
   margin: 0;
   padding: 0;
   line-height: normal;
   font-size: 14px;
   font-weight: normal;
   vertical-align: middle;
   letter-spacing: 2px;
   color: #cfd5e0;
`)


export {Sidebar, Panel, PanelTitle}

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Welcome from "./components/Welcome"
import AiApp from "./components/AiApp"
import NotFound from "./components/NotFound"
import Login from './components/Auth/login/login' 
import ForgotPassword from './components/Auth/forgot-password/forgot-password'
import Signup from './components/Auth/signup/signup'
import XrayDetails from './components/xray/xrayDeatil'
export default () => 
   <Switch>
      <Route path="/javascripts" render={(props) => {console.log("Gireesha " + props);}} />
      <Route path="/" exact component={Login} />
      <Route path="/login" exact component={Login}/>
      <Route path="/forgot-password" exact component={ForgotPassword}/>
      <Route path="/signup" exact component={Signup}/>
      <Route path="/XrayDetails" exact component={XrayDetails}/>

{ /* Finally, catch all unmatched routes */ } <Route path = "/rotation"
exact render = {
    (props) => < AiApp {...props }
    pipeline = "rotation"
    algorithm = "Rotation"
    splash = "Rotation.JPG" / > }
/> <Route path = "/chestfrontal"
exact render = {
    (props) => < AiApp {...props }
    pipeline = "chestfrontal"
    algorithm = "Chest Frontal"
    splash = "Frontal.JPG" / > }
/> <Route path = "/lungfield"
exact render = {
    (props) => < AiApp {...props }
    pipeline = "lungfield"
    algorithm = "Lung Field Check"
    splash = "LungField.JPG" / > }
/> <Route path = "/ptx"
exact render = {
    (props) => < AiApp {...props }
    pipeline = "ptx"
    algorithm = "Pneumothorax"
    splash = "PTX.JPG" / > }
/> <Route path = "/freeair"
exact render = {
    (props) => < AiApp {...props }
    pipeline = "freeair"
    algorithm = "Freeair"
    splash = "FREEAIR.JPG" / > }
/> <Route path = "/carina"
exact render = {
    (props) => < AiApp {...props }
    pipeline = "carina"
    algorithm = "Carina"
    splash = "CARINA.JPG" / > }
/> <Route path = "/ettube"
exact render = {
    (props) => < AiApp {...props }
    pipeline = "ettube"
    algorithm = "ET Tube"
    splash = "ETTUBE.JPG" / > }
/> <Route path = "/ettubetip"
exact render = {
    (props) => < AiApp {...props }
    pipeline = "ettubetip"
    algorithm = "ET Tube Tip"
    splash = "ETTUBETIP.JPG" / > }
/> <Route component = { NotFound }
/> </Switch>;
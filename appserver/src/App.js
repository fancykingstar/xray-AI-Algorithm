import React, {Component}  from 'react';
import './index.css';
import Routes from "./Routes"
import Footer from './components/footer/footer.js'
import "./initCornerstone"

class App extends Component {
   render()  {
      return (
            <div>
               <Routes />
               <Footer />
            </div>
      );
  }
};

export default App;

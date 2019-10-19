import React, {Component}  from 'react';
import Header from './components/Header' 
import Routes from "./Routes"
import Footer from './components/footer/footer'
import "./initCornerstone"

class App extends Component {
   render()  {
      return (
            <div className="App containter">
               {/* <Header /> */}
               <Routes />
               <Footer />
            </div>
      );
  }
};

export default App;

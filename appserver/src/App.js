import React, {Component}  from 'react';
import Routes from "./Routes"
import Footer from './components/footer/footer.js'
import "./initCornerstone"
import "bootstrap/dist/js/bootstrap.min"

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

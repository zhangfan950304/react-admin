import React from 'react';
import {BrowserRouter,Route,Switch} from "react-router-dom"
import Login from "./pages/login/login.js"
import Admin from "./pages/admin/admin.js"
class App extends React.Component {
  render(){
    return (
      <BrowserRouter>
         <Switch>{/*只匹配其中一个 */}
          <Route path='/login' component={Login}/>
          <Route path='/' component={Admin}/>
        </Switch>
        <Route />
      </BrowserRouter>
    );
  }
}

export default App;

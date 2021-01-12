import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Main from "./pages/Main";
import EmployeeView from "./pages/EmployeeView";

//React router. Send specific employee id
const App = () => (
  <Router>
    <div className="app">
      <Route exact path="/employeeview/:id" render={(props) => <EmployeeView {...props}/>} />
      <Route exact path="/" render={() => <Main />} />
    </div>
  </Router>
);

export default App;

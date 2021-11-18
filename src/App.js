import './App.css';
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "./pages/Login";
import {useSelector} from "react-redux";
import AddWork from "./pages/AddWork";
import Home from "./pages/Home";
import AllJobs from "./pages/AllJobs";
import MyWorks from "./pages/MyWorks";
import AllWorkers from "./pages/AllWorkers";
import Menu from "./components/Menu";
import React from "react";
import logo from "./assets/logo.png"

function App() {
    const isAuth = useSelector(({user}) => user.isAuth)

    const routes = isAuth ? (
        <Switch>
            <Route path="/add-work" exact component={AddWork}/>
            <Route path="/home" exact component={Home}/>
            <Route path="/all-jobs" exact component={AllJobs}/>
            <Route path="/salaries" exact component={AllWorkers}/>
            <Route path="/my-works/:id" component={MyWorks}/>
            <Redirect to="/home" />
        </Switch>
    ) : (
        <Switch>
            <Route path="/" exact component={Login}/>
            <Redirect to="/" />
        </Switch>
    )
      return (
          <>
              <img src={logo} alt="logo" width={250} style={{marginBottom: '50px'}}/>
              {routes}
              {isAuth && <Menu />}
          </>
      );
}

export default App;

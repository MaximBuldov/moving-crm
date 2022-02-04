import React from 'react';
import {useSelector} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import Login from "../pages/Login";
import {HOME_ROUTE} from "../utils/consts";

const AppRouter = ({routes}) => {
	const {data} = useSelector(({user}) => user)
	const isAuth = !!data?.user_role
	return isAuth ?
		(
			<Switch>
				{routes.map(({path, Component, exact = true}) => <Route key={path} path={path} exact={exact} component={Component}/>)}
				<Redirect to={HOME_ROUTE} />
			</Switch>
		) : (
			<Switch>
				<Route path="/" exact component={Login}/>
				<Redirect to="/" />
			</Switch>
		)
};

export default AppRouter;

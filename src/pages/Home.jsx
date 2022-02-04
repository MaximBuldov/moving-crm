import React from 'react';
import {useSelector} from "react-redux";
import {Typography} from "antd";

const Home = () => {
	const {data: {user_display_name}} = useSelector(({user}) => user)
	return (
		<Typography.Title>Hello, {user_display_name}!</Typography.Title>
	);
};

export default Home;

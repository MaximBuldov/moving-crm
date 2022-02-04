import React, {Component} from 'react';
import {Menu as AntMenu} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import {SINGLE_JOB_ROUTE} from "../utils/consts";
import {logoutUser} from "../store/slices/userSlice";
import {useDispatch} from "react-redux";
import { Link } from 'react-router-dom';

interface Props {
	routes: Array<MenuItem>
}

interface MenuItem {
	path: string
	name: string
	Icon: Component
}


const Menu = React.memo(function Menu({routes}: Props) {
	const dispatch = useDispatch()
	const logout = () => {
		localStorage.clear()
		dispatch(logoutUser())
	}
	const {Item} = AntMenu
	return (
		<AntMenu theme="dark"
				 mode="inline"
				 defaultSelectedKeys={['/home']}
				 className="custom-sider-menu"
		>
			{routes.filter(el => el.path !== SINGLE_JOB_ROUTE).map(({path, name, Icon}) => (
				<Item key={path} icon={Icon}>
					<Link to={path}>{name}</Link>
				</Item>
			))}
			<Item key="logout" icon={<LogoutOutlined />} onClick={logout}>Logout</Item>
		</AntMenu>
	);
})

export default Menu;

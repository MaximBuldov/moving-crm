import React, {useState} from 'react';
import {Affix, Button, Drawer, Menu as AntMenu} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../redux/actions/user";



const Menu = () => {
	const [visible, setVisible] = useState(false)
	const {user_id} = useSelector(({user}) => user.user)
	const dispatch = useDispatch()
	const showDrawer = () => {
		setVisible(true);
	};
	const onClose = () => {
		setVisible(false);
	};
	const logout = () => {
		localStorage.clear()
		dispatch(userLogout())
	}
	const {Item} = AntMenu
	return (
		<>
			<Affix style={{position: 'absolute', top: '30px', left:'30px'}} offsetTop="30">
				<Button type="primary" onClick={showDrawer}>
					<MenuOutlined />
				</Button>
			</Affix>
			<Drawer title="Menu" placement="left" onClose={onClose} visible={visible}>
				<AntMenu onClick={onClose} mode="inline">
					<Item key="home">
						<Link to="/home">Update data</Link>
					</Item>
					<Item key="add-work">
						<Link to="/add-work">Add work</Link>
					</Item>
					<Item key="all-jobs">
						<Link to="/all-jobs">All jobs</Link>
					</Item>
					<Item key="salaries">
						<Link to="/salaries">Salaries</Link>
					</Item>
					<Item key="my-works">
						<Link to={`/my-works/${user_id}`}>My works</Link>
					</Item>
					<Item key="logout" onClick={logout}>Logout</Item>
				</AntMenu>
			</Drawer>
		</>
	);
};

export default Menu;

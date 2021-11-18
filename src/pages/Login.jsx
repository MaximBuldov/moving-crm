import React, {useState} from 'react';
import {Button, Form, Input, message, Spin} from "antd";
import {auth} from "../redux/asyncActions/user";
import {useDispatch, useSelector} from "react-redux";

const Login = () => {
	const dispatch = useDispatch()
	const user = useSelector(({user}) => user)
	const [form, setForm] = useState({
		username: '', password: ''
	});
	const onFinish = async (values) => {
		const res = await dispatch(auth(values))
		if (res) {
			message.success('Success')
		} else {
			message.error('Invalid data')
		}
	};

	const handleForm = (e) => {
		setForm({...form, [e.target.name]: e.target.value})
	}
	return (
			<Spin spinning={user.isLoading}>
				<Form
					name="login"
					onFinish={onFinish}
					layout="vertical"
				>
					<Form.Item
						label="Username"
						name="username"
						rules={[
							{
								required: true,
								message: 'Please input your username!',
							},
						]}
					>
						<Input
							name="username"
							size="large"
							onChange={handleForm}
						/>
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[
							{
								required: true,
								message: 'Please input your password!',
							},
						]}
					>
						<Input.Password name="password" size="large" onChange={handleForm} />
					</Form.Item>

					<Form.Item>
						<Button size="large" type="primary" htmlType="submit">
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Spin>

	);
};

export default Login;

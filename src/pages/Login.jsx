import React, {useEffect} from 'react';
import {Button, Form, Input, message, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {authUser} from "../store/asyncActions/user";

const Login = () => {
	const dispatch = useDispatch()
	const {status, error} = useSelector(({user}) => user)
	const [form] = Form.useForm()
	const onFinish = async (values) => {
		dispatch(authUser(values))
	};
	useEffect(() => {
		if (status === 'resolved') {
			message.success('Success')
		} else if (status === 'rejected') {
			message.error(error.replace( /(<([^>]+)>)/ig, ''))
		}
	}, [status])

	return (
			<Spin spinning={status === 'loading'}>
				<Form
					name="login"
					onFinish={onFinish}
					layout="vertical"
					form={form}
					size="large"
					style={{maxWidth: 400}}
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
						<Input name="username" />
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
						<Input.Password name="password" />
					</Form.Item>
					<Form.Item>
						<Button size="large" type="primary" htmlType="submit">Submit</Button>
					</Form.Item>
				</Form>
			</Spin>

	);
};

export default Login;

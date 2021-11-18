import React, {useEffect} from 'react';
import {Button, message, Space, Spin} from "antd";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchJobs} from "../redux/asyncActions/jobs";

const Home = () => {
	const {token, user_id} = useSelector(({user}) => user.user)
	const isLoading = useSelector(({jobs}) => jobs.isLoading)
	const dispatch = useDispatch()
	useEffect(() => {
		const res = dispatch(fetchJobs(token))
		res ? message.success('Data update') : message.error('Reload page')
	}, [dispatch, token]);
	return (
		<Spin spinning={isLoading}>
			<Space className="home-menu" direction="vertical">
				<Button type="primary">
					<Link to="/add-work">Add work</Link>
				</Button>
				<Button type="primary">
					<Link to="/all-jobs">All jobs</Link>
				</Button>
				<Button type="primary">
					<Link to="/salaries">Salaries</Link>
				</Button>
				<Button type="primary">
					<Link to={`/my-works/${user_id}`}>My works</Link>
				</Button>
			</Space>
		</Spin>
	);
};

export default Home;

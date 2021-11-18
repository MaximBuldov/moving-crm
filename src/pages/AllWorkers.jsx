import React, {useEffect} from 'react';
import {Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkers} from "../redux/asyncActions/workers";
import {Link} from "react-router-dom";

const AllWorkers = () => {
	const {workers, isLoading} = useSelector(({workers}) => workers)
	const {token} = useSelector(({user}) => user.user)
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchWorkers(token))
	}, [token, dispatch]);
	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: '',
			dataIndex: 'id',
			key: 'id',
			render: text => <Link to={`/my-works/${text}`}>See works</Link>
		},
	];

	return (
		<Table loading={isLoading} dataSource={workers} columns={columns} />
	);
};

export default AllWorkers;

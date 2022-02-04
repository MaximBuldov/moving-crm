import React, {useEffect} from 'react';
import {Divider, Select} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkers} from "../store/asyncActions/workers";
import MyWorks from "../components/MyWorks";
import {fetchJobs, fetchWorkerJobs} from "../store/asyncActions/jobs";

const Salaries = () => {
	const {user, workers, jobs} = useSelector(state => state)
	const {token, user_id} = user.data
	const dispatch = useDispatch()
	useEffect(() => {
		if(workers.data.length === 0) {
			dispatch(fetchWorkers(token))
		}
	}, [token, dispatch, workers.data])

	useEffect(() => {
		fetchWorks(user_id)
	}, [user_id, dispatch])

	useEffect(() => {
		if(jobs.data.length === 0) {
			dispatch(fetchJobs({token}))
		}
	}, [jobs.data, dispatch])

	const fetchWorks = (id) => {
		dispatch(fetchWorkerJobs({token: user.data.token, id}))
	}
	const onSelect = (value) => {
		fetchWorks(value)
	}

	return (
		<>
			{
				user.data.user_role === 'administrator' && (
					<Select
						filterOption={(input, option) =>
							option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
						onSelect={onSelect}
						style={{width: 300}}
						placeholder="Enter name"
						size="large"
					>
						{workers.data.map(el => <Select.Option key={el.id.toString()} value={el.id.toString()}>{el.name}</Select.Option>)}
					</Select>
				)
			}
			<Divider/>
			<MyWorks user={user.data} jobs={jobs} dispatch={dispatch} />
		</>

	);
};

export default Salaries;

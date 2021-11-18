import React, {useEffect} from 'react';
import {PageHeader, Table} from "antd";
import moment from "moment";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkerJobs} from "../redux/asyncActions/jobs";
import DataFilter from "../components/DataFilter"

const MyWorks = () => {
	const id = useParams().id
	const history = useHistory()
	const dispatch = useDispatch()
	const {token} = useSelector(({user}) => user.user)

	useEffect(() => {
		dispatch(fetchWorkerJobs(token, id))
	}, [dispatch, id, token])
	let {worker_jobs, isLoading} = useSelector(({jobs}) => jobs)
	const columns = [
		{
			title: 'Date',
			dataIndex: 'date',
			key: 'date',
			render: text => moment(text).format('MM/DD/YYYY'),
			filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
				<DataFilter setSelectedKeys={setSelectedKeys} confirm={confirm} clearFilters={clearFilters}/>
			),
			onFilter: (value, record) => moment(record.date).format('YYYY-MM') === value
		},
		{
			title: 'Work №',
			dataIndex: ['title'],
			key: 'title',
		},
		{
			title: 'Workers count',
			dataIndex: ['workers_count'],
			key: 'workers_count',
		},
		{
			title: 'Time',
			dataIndex: ['total_time'],
			key: 'total_time',
			render: text => `${Math.round((text/60)*100)/100}h`,
		},
		{
			title: 'Role',
			dataIndex: ['workers', 'worker_role'],
			key: 'workers',
			filters: [
				{
					text: 'foreman',
					value: 'foreman',
				},
				{
					text: 'helper',
					value: 'helper',
				},
			],
			onFilter: (value, record) => record.workers.worker_role === value,
		},
		{
			title: 'Salary',
			dataIndex: ['workers', 'salary'],
			key: 'total',
			render: text => `$${text}`,
		},
		{
			title: 'Payment',
			dataIndex: ['workers', 'payment_type'],
			key: 'payment_type',
		},

	];
	return (
		<>
			<PageHeader
				onBack={history.goBack}
				title={worker_jobs.name}
			/>
			<Table loading={isLoading} dataSource={worker_jobs.works} columns={columns}
				   summary={pageData => {
					   let totalHours = 0;
					   let totalSalary = 0;

					   pageData.forEach(({workers, total_time}) => {
						   totalHours += Number(total_time)
						   totalSalary += Number(workers?.salary)
					   });

					   return (
						   <>
							   <Table.Summary.Row>
								   <Table.Summary.Cell />
								   <Table.Summary.Cell />
								   <Table.Summary.Cell />
								   <Table.Summary.Cell>{`${Math.round((totalHours/60)*100)/100}h`}</Table.Summary.Cell>
								   <Table.Summary.Cell />
								   <Table.Summary.Cell>{`$${totalSalary}`}</Table.Summary.Cell>
								   <Table.Summary.Cell />
							   </Table.Summary.Row>
						   </>
					   );
				   }}
			/>
		</>

	);
};

export default MyWorks;

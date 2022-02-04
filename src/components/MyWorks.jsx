import React from 'react';
import {Switch, Table} from "antd";
import moment from "moment";
import DataFilter from "./DataFilter"
import {updateJobStatus} from "../store/asyncActions/jobs";

const MyWorks = ({user, jobs, dispatch}) => {
	const {token, user_role, user_id} = user
	const {worker_jobs, data, status} = jobs

	const updateWork = (record) => {
		const job_workers = data.find(el => el.id === record.id).acf.workers.map(el => {
			if(el.worker.ID === +user_id) {
				return {
					...el,
					status: !record.workers.status
				}
			}
			return el
		})
		dispatch(updateJobStatus({token, record, job_workers}))
	}

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
			title: 'H',
			dataIndex: ['total_time'],
			key: 'total_time',
			render: text => `${text}h`,
		},
		{
			title: 'F/H',
			dataIndex: ['workers', 'worker_role'],
			key: 'workers',
			render: text => `${text[0].toUpperCase()}`,
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
			title: '$',
			dataIndex: ['workers', 'salary'],
			key: 'total',
			render: text => `${text}`,
		},
		{
			title: 'Cash Check',
			dataIndex: ['workers', 'payment_type'],
			key: 'payment_type',
		},
		{
			title: 'Status',
			dataIndex: ['workers', 'status'],
			key: 'status',
			render: (text, record) => {
				return <Switch
					checkedChildren="Paid"
					unCheckedChildren="Unpaid"
					defaultChecked={text}
					onChange={() => updateWork(record)}
					disabled={user_role !== 'administrator'}
				/>
			}
		},

	];
	return (
		<Table loading={status === 'loading'}
			   dataSource={worker_jobs.works}
			   columns={columns}
			   rowKey="id"
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
							   <Table.Summary.Cell>{`${Math.round((totalHours)*100)/100}h`}</Table.Summary.Cell>
							   <Table.Summary.Cell />
							   <Table.Summary.Cell>{`${totalSalary}`}</Table.Summary.Cell>
							   <Table.Summary.Cell />
							   <Table.Summary.Cell />
						   </Table.Summary.Row>
					   </>
				   );
			   }}
		/>

	);
};

export default MyWorks;

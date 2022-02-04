import React, {useEffect} from 'react';
import {Table, Tag} from "antd";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import DataFilter from "../components/DataFilter"
import SearchFilter from "../components/SearchFilter";
import {SearchOutlined} from "@ant-design/icons";
import {fetchJobs} from "../store/asyncActions/jobs";


const AllJobs = () => {
	const dispatch = useDispatch()
	const {user: {data: {token}}, jobs: {data, status}} = useSelector(state => state)
	useEffect(() => {
		dispatch(fetchJobs({token}))
	}, [dispatch])

	const columns = [
		{
			title: 'Date',
			dataIndex: ['acf', 'date'],
			key: 'date',
			render: text => moment(text).format('MM/DD/YYYY'),
			filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
				<DataFilter setSelectedKeys={setSelectedKeys} confirm={confirm} clearFilters={clearFilters}/>
			),
			onFilter: (value, record) => moment(record.date).format('YYYY-MM') === value
		},
		{
			title: 'Work №',
			dataIndex: ['title', 'rendered'],
			key: 'id',
			filterDropdown: ({ setSelectedKeys, confirm, clearFilters, selectedKeys }) => (
				<SearchFilter setSelectedKeys={setSelectedKeys} confirm={confirm} clearFilters={clearFilters}  selectedKeys={selectedKeys}/>
			),
			onFilter: (value, record) => moment(record.date).format('YYYY-MM') === value,
			filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		},
		{
			title: 'Workers count',
			dataIndex: ['acf', 'foreman_info', 'workers_count'],
			key: 'workers_count',
		},
		{
			title: 'Workers',
			dataIndex: ['acf', 'foreman_info', 'workers'],
			key: 'workers',
			render: workers => workers.map(el => <Tag key={el?.worker.ID} color="processing">{el?.worker.display_name}</Tag>),
		},
		{
			title: 'Payment',
			dataIndex: ['acf', 'foreman_info', 'payment', 'label'],
			key: 'payment',
		},
		{
			title: 'Total',
			dataIndex: ['acf', 'foreman_info', 'total'],
			key: 'total',
			render: text => `$${text}`
		},
		{
			title: 'Time',
			dataIndex: ['acf', 'foreman_info', 'total_time'],
			key: 'total_time',
			render: text => `${Math.round(text)}h`,
		},
	];
	return (
		<Table loading={status === 'loading'} columns={columns} dataSource={data.filter(el => el.acf.completed === 'yes')} rowKey="id"
			   summary={pageData => {
				   let totalIncome = 0;
				   pageData.forEach(({acf: {foreman_info: {total}}}) => {
					   totalIncome += Number(total)
				   });

				   return (
					   <>
						   <Table.Summary.Row>
							   <Table.Summary.Cell />
							   <Table.Summary.Cell />
							   <Table.Summary.Cell />
							   <Table.Summary.Cell />
							   <Table.Summary.Cell />
							   <Table.Summary.Cell>{`$${totalIncome}`}</Table.Summary.Cell>
							   <Table.Summary.Cell />
						   </Table.Summary.Row>
					   </>
				   );
			   }}
		/>
	);
};

export default AllJobs;

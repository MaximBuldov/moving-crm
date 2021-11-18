import React from 'react';
import {Table, Tag} from "antd";
import {useSelector} from "react-redux";
import moment from "moment";
import DataFilter from "../components/DataFilter"
import SearchFilter from "../components/SearchFilter";
import {SearchOutlined} from "@ant-design/icons";


const AllJobs = () => {
	const {jobs, isLoading} = useSelector(({jobs}) => jobs)
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
			title: 'ID',
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
			dataIndex: ['acf', 'workers_count'],
			key: 'workers_count',
		},
		{
			title: 'Workers',
			dataIndex: ['acf', 'workers'],
			key: 'workers',
			render: text => text.map(el => <Tag key={el.worker.ID} color="processing">{el.worker.display_name}</Tag>),
		},
		{
			title: 'Payment',
			dataIndex: ['acf', 'payment', 'label'],
			key: 'payment',
		},
		{
			title: 'Total',
			dataIndex: ['acf', 'total'],
			key: 'total',
			render: text => `$${text}`
		},
		{
			title: 'Time',
			dataIndex: ['acf', 'total_time'],
			key: 'total_time',
			render: text => `${Math.round((text/60)*100)/100}h`,
		},
	];
	return (
		<Table loading={isLoading} columns={columns} dataSource={jobs}
			   summary={pageData => {
				   let totalIncome = 0;
				   pageData.forEach(({acf: {total}}) => {
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

import React from 'react';
import {Button, DatePicker} from "antd";

const DataFilter = ({ setSelectedKeys, confirm, clearFilters }) => {
	return (
		<>
			<DatePicker
				onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])}
				picker="month"
				style={{width:"200px", display:'block'}}
			/>
			<Button type="primary" onClick={() => confirm()}>Filter</Button>
			<Button onClick={() => clearFilters()}>Reset</Button>
		</>
	);
};

export default DataFilter;

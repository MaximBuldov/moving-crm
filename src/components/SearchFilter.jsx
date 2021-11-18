import React from 'react';
import {Button, Input, Space} from "antd";

const SearchFilter = ({ setSelectedKeys, confirm, clearFilters, selectedKeys }) => {
	return (
		<div style={{ padding: 8 }}>
			<Input
				value={selectedKeys[0]}
				onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
				onPressEnter={() => confirm()}
				style={{ marginBottom: 8, display: 'block' }}
			/>
			<Space>
				<Button
					type="primary"
					onClick={() => confirm()}
					style={{ width: 90 }}
				>
					Search
				</Button>
				<Button onClick={() => clearFilters()} style={{ width: 90 }}>
					Reset
				</Button>
			</Space>
		</div>
	);
};

export default SearchFilter;

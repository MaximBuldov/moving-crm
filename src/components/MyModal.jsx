import React, {useEffect} from 'react';
import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, TimePicker} from "antd";
import moment from "moment";
import {CopyOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {setIsModalVisible} from "../store/slices/appSlice";
import {createJob} from "../store/asyncActions/jobs";
import {changeStatus} from "../store/slices/jobsSlice";
import copy from "copy-to-clipboard";
import {copyOrderInfo} from "../utils/copyOrderInfo";
import MaskedInput from "antd-mask-input";

const {Item} = Form
const {Option} = Select


const MyModal = ({dispatch, status, token, job, handleCancel, workNumber}) => {
	const [form] = Form.useForm()
	const handleOk = () => {
		form.submit()
	}
	const copyToClickBoard = () => {
		copy(copyOrderInfo(form.getFieldsValue()))
		message.success('Copied!')
	}
	const onFinish = (values) => {
		const jobId = job.id ? job.id : false
		dispatch(createJob({values, token, jobId}))
	}
	const onMoversCountChange = (value) => {
		const count = parseInt(value)
		form.setFieldsValue({
			result: count * 40 + 40
		})
	}
	useEffect(() => {
		if (status === 'created') {
			form.resetFields()
			handleCancel()
			message.success('Order created')
			dispatch(changeStatus(null))
		}
	}, [status]);
	const values = job.action ? {
		date: moment(job.start, 'MM/DD/YYYY'),
		title: +workNumber + 1,
		truck_fee: '$70 (truck fee)',
		time: moment(job.start, 'H a').format('HH:mm')
	} : {
		...job.customer_info,
		title: +job.order,
		date: moment(job.start, 'MM/DD/YYYY'),
		time: moment(job.customer_info.time, 'H a').format('HH:mm')
	}
	return (
		<Modal
			forceRender
			title={`${job.action ? 'Add new work' : job.title}`}
			visible={!!job}
			onOk={handleOk}
			onCancel={handleCancel}
			width={1000}
			confirmLoading={status === 'loading'}
			okText="Sumbit"
			style={{top: 0}}
		>
			{!job.action && <Button onClick={copyToClickBoard} type="primary" style={{width: '100%'}} size="large" icon={<CopyOutlined />}>Copy order to clipboard</Button>}
			<Form
				form={form}
				size="large"
				name="addOrder"
				autoComplete="off"
				layout="vertical"
				initialValues={values}
				onFinish={onFinish}
			>
				<Item name="title" label="Order number">
					<InputNumber placeholder="9999999"/>
				</Item>
				<Item name="date" label="Date">
					<DatePicker format="DD/MM/YYYY"/>
				</Item>
				<Item name="bedroom" label="Moving size">
					<Select>
						<Option value="Studio">Studio</Option>
						<Option value="1 bedroom">1 bedroom</Option>
						<Option value="2 bedroom">2 bedroom</Option>
						<Option value="3 bedroom">3 bedroom</Option>
						<Option value="4 bedroom">4 bedroom</Option>
						<Option value="5 bedroom">5 bedroom</Option>
						<Option value="6 bedroom">6 bedroom</Option>
					</Select>
				</Item>
				<Item name="truck" label="Truck size">
					<Select>
						<Option value="No truck just a labor">No truck just a labor</Option>
						<Option value="16 feet">16 feet</Option>
						<Option value="20 feet">20 feet</Option>
						<Option value="26 feet">26 feet</Option>

					</Select>
				</Item>
				<Item name="movers" label="Crew size">
					<Select onChange={onMoversCountChange}>
						<Option value="2 movers">2 movers</Option>
						<Option value="3 movers">3 movers</Option>
						<Option value="4 movers">4 movers</Option>
						<Option value="5 movers">5 movers</Option>
						<Option value="6 movers">6 movers</Option>
					</Select>
				</Item>
				<Item name="time" label="Start time">
					<MaskedInput mask="11:11"/>
				</Item>
				<Item name="payment" label="Payment">
					<Select>
						<Option value="cash">Cash</Option>
						<Option value="Credit card">Credit card</Option>
						<Option value="Venmo">Venmo</Option>
						<Option value="Zelle">Zelle</Option>
					</Select>
				</Item>
				<Item name="typeofresidency" label="Type of residency">
					<Select>
						<Option value="Apartment">Apartment</Option>
						<Option value="House">House</Option>
						<Option value="Townhouse">Townhouse</Option>
						<Option value="Storage">Storage</Option>
						<Option value="Office">Office</Option>
						<Option value="Other">Other</Option>
					</Select>
				</Item>
				<Item name="packing" label="Packing">
					<Select>
						<Option value="No Packing">No Packing</Option>
						<Option value="Partial Packing">Partial Packing</Option>
						<Option value="Full Packing">Full Packing</Option>
					</Select>
				</Item>
				<Item name="heavyItems" label="Have Items more then 300lb">
					<Select>
						<Option value="Yes">Yes</Option>
						<Option value="No">No</Option>
					</Select>
				</Item>
				<Item name="supplies" label="Supplies">
					<Select>
						<Option value="yes">Yes</Option>
						<Option value="no">No</Option>
					</Select>
				</Item>
				<Item name="small_boxes" label="Small Box">
					<InputNumber/>
				</Item>
				<Item name="medium_boxes" label="Medium boxes">
					<InputNumber/>
				</Item>
				<Item name="wrapping_paper" label="Wrapping paper">
					<InputNumber/>
				</Item>
				<div className="full-width">
					<Form.List name="pickup_address">
						{(fields, {add, remove}) => (
							<>
								{fields.map(({key, name, fieldKey, ...restField}) => (
									<div className="add-order-list full-width">
										<Item
											{...restField}
											name={[name, 'address']}
											fieldKey={[fieldKey, 'address']}
											label="Pick up address"
										>
											<Input/>
										</Item>
										<Item
											{...restField}
											name={[name, 'city']}
											fieldKey={[fieldKey, 'city']}
											label="Pick up city"
										>
											<Input/>
										</Item>
										<Item
											{...restField}
											name={[name, 'zip']}
											fieldKey={[fieldKey, 'zip']}
											label="Pick up zip"
										>
											<Input/>
										</Item>
										<Item
											{...restField}
											name={[name, 'flights']}
											fieldKey={[fieldKey, 'flights']}
											label="Flights"
										>
											<InputNumber/>
										</Item>
										<Item>
											<Button type="default" onClick={() => remove(name)}
													icon={<MinusCircleOutlined/>} danger>Delete address</Button>
										</Item>
									</div>
								))}
								<Item className="full-width">
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>Add pick up
										address</Button>
								</Item>
							</>
						)}
					</Form.List>
					<Form.List name="dropoff_address">
						{(fields, {add, remove}) => (
							<>
								{fields.map(({key, name, fieldKey, ...restField}) => (
									<div className="add-order-list full-width">
										<Item
											{...restField}
											name={[name, 'address']}
											fieldKey={[fieldKey, 'address']}
											label="Drop off address"
										>
											<Input/>
										</Item>
										<Item
											{...restField}
											name={[name, 'city']}
											fieldKey={[fieldKey, 'city']}
											label="Drop off city"
										>
											<Input/>
										</Item>
										<Item
											{...restField}
											name={[name, 'zip']}
											fieldKey={[fieldKey, 'zip']}
											label="Drop off zip"
										>
											<Input/>
										</Item>
										<Item
											{...restField}
											name={[name, 'flights']}
											fieldKey={[fieldKey, 'flights']}
											label="Flights"
										>
											<InputNumber/>
										</Item>
										<Item>
											<Button type="default" onClick={() => remove(name)}
													icon={<MinusCircleOutlined/>} danger>Delete address</Button>
										</Item>
									</div>
								))}
								<Item className="full-width">
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>Add drop
										off address</Button>
								</Item>
							</>
						)}
					</Form.List>
				</div>
				<div className="order-form-3-columns full-width">
					<Item name="customer_name" label="Customer name">
						<Input/>
					</Item>
					<Item name="customer_phone" label="Customer phone">
						<Input/>
					</Item>
					<Item name="customer_email" label="Customer email" rules={[{type: 'email'}]}>
						<Input/>
					</Item>
					<Item name="contact_name" label="Contact name">
						<Input/>
					</Item>
					<Item name="contact_phone" label="Contact phone">
						<Input/>
					</Item>
					<Item name="contact_email" label="Contact email" rules={[{type: 'email'}]}>
						<Input/>
					</Item>
					<Item name="howfrom" label="How find us">
						<Select>
							<Option value="Yelp">Yelp</Option>
							<Option value="Google">Google</Option>
							<Option value="Referral">Referral</Option>
							<Option value="Other">Other</Option>
						</Select>
					</Item>
					<Item name="truck_fee" label="Truck fee">
						<Input/>
					</Item>
					<Item name="result" label="Rate">
						<Input prefix="$"/>
					</Item>
				</div>
			</Form>
		</Modal>
	);
};

export default MyModal;

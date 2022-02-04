import React, {useEffect, useState} from 'react';
import {
	Button,
	Col,
	DatePicker,
	Form,
	Input,
	InputNumber, message,
	Row,
	Select,
	Spin,
	Switch,
	Typography
} from "antd";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {CheckOutlined, CloseOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {fetchWorkers} from "../store/asyncActions/workers";
import {calculator} from "../utils/calculator";
import {useHistory} from "react-router-dom";
import MaskedInput from "antd-mask-input";
import {createJob, fetchJobs, updateJob} from "../store/asyncActions/jobs";

const { Item, List } = Form
const { Option } = Select

const AddWork = () => {
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const history = useHistory()
	const [heavyItems, setHeavyItems] = useState(false);
	const [addItems, setAddItems] = useState(false);
	const [tips, setTips] = useState(false);
	const [truckFee, setTruckFee] = useState(true);
	const [discount, setDiscount] = useState([
		{value: 'no', label:'No'},
		{value: 'percent', label:'Yes, 10%'}
	])
	const {user: {data: {user_id, token, user_display_name}}, workers, jobs} = useSelector((state) => state)
	const workersOption = workers.data.filter(el => el.id !== +user_id).map(el => (
		<Option key={el.id} role={el.roles[0]} value={el.id}>{el.name}</Option>
	))
	useEffect(() => {
		if (workers.data.length === 0) {
			dispatch(fetchWorkers(token))
		}
	}, [token, dispatch, workers.data]);

	useEffect(() => {
		if (jobs.data.length === 0) {
			dispatch(fetchJobs(token))
		}
	}, [token, dispatch, jobs.data]);

	useEffect(() => {
		if (workers.status === 'rejected') {
			message.error(workers.error)
			history.push('/home')
		}
	}, [workers.status]);

	useEffect(() => {
		if (jobs.status === 'updated') {
			form.resetFields()
			message.success('Work updated')
		} else if (jobs.status === 'rejected') {
			message.error('Error')
		}
	}, [jobs.status])


	const calculateTotal = (changedValues, allValues) => {
		form.setFieldsValue({total: calculator(allValues, form)})
	}
	const onFinish = (values) => {
		dispatch(updateJob({values, token, work_id: values.title}))
	};

	const onChangeHeavy = () => {
		setHeavyItems(!heavyItems)
		form.setFieldsValue({heavy_items: []})
	}
	const onChangeMaterial = () => {
		setAddItems(!addItems)
		form.setFieldsValue({add_items: []})
	}
	const onChangeTips = () => {
		setTips(!tips)
		form.setFieldsValue({tips: ''})
	}
	const onTruckFee = () => {
		setTruckFee(!truckFee)
		form.setFieldsValue({driving_time_price: null})
		form.setFieldsValue({driving_time_fee: truckFee})
		form.setFieldsValue({truck_fee: !truckFee})
	}
	const setWorkerRole = (value, option) => {
		const allWorkers = form.getFieldValue('workers').map(el => {
			if(el.worker === value) {
				return {
					...el,
					g_role: option.role
				}
			}
			return el
		})
		form.setFieldsValue({workers: [...allWorkers]})
	}
	const addDiscount = (item) => {
		setDiscount([...discount, {value: item, label: `${item}$`}])
	}
	return (
		<Spin spinning={false}>
			<Form
				name="addWork"
				onFinish={onFinish}
				autoComplete="off"
				layout="vertical"
				initialValues={{
					date: moment(Date.now()),
					total_time: 0,
					truck_fee: truckFee,
					foreman: +user_id,
					discount: 'no'
				}}
				form={form}
				onValuesChange={calculateTotal}
				size="large"
			>
				<Row gutter={16}>
					<Col xs={24} lg={8}>
						<Item
							label="Date"
							name="date"
							style={{ width: '100%' }}
						>
							<DatePicker style={{ width: '100%' }} name="date" disabled />
						</Item>
					</Col>
					<Col xs={24} lg={8}>
						<Item
							label="Work number"
							name="title"
							rules={[{ required: true, message: 'Please choose work number!' }]}
						>
							<Select name="title" placeholder="№0000000">
								{jobs.data.filter(el => moment(Date.now()).format('MM/DD/YYYY') === el.acf.date).map(el => <Option key={el.id} value={el.id}>{el.title.rendered}</Option>)}
							</Select>
						</Item>
					</Col>
					<Col xs={24} lg={8}>
						<Item
							label="Payment method"
							name="payment"
							rules={[{ required: true, message: 'Please select payment time!' }]}
						>
							<Select name="payment" placeholder="Payment method">
								<Option value="cash">Cash</Option>
								<Option value="credit_card">Credit card(+5%)</Option>
								<Option value="credit_card_dollar">Credit card(+$10/h)</Option>
								<Option value="check">Check</Option>
								<Option value="zelle">Zelle</Option>
								<Option value="venmo">Venmo</Option>
							</Select>
						</Item>
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Foreman</Typography.Title>
					</Col>
					<Col xs={24} lg={12}>
						<Item name='foreman'>
							<Select name='foreman' disabled>
								<Option value={+user_id}>{user_display_name}</Option>
							</Select>
						</Item>
					</Col>
					<Col xs={24} lg={12}>
						<Item
							name='foreman_payment_type'
							fieldKey='foreman_payment_type'
							rules={[{ required: true, message: 'Choose payment type' }]}
						>
							<Select name='foreman_payment_type' placeholder="Payment type">
								<Option value="check">Check</Option>
								<Option value="cash">Cash</Option>
							</Select>
						</Item>
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Helpers</Typography.Title>
						<List name="workers" rules={[{ required: true, message: 'Please add workers!' }]}>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, fieldKey, ...restField }) => (
										<Row gutter={16} justify="space-between" key={key}>
											<Col xs={11} lg={12}>
												<Item
													{...restField}
													name={[name, 'worker']}
													fieldKey={[fieldKey, 'worker']}
													rules={[{ required: true, message: 'Choose worker' }]}
												>
													<Select
														placeholder="Worker"
														showSearch
														optionFilterProp="children"
														name={[name, 'worker']}
														filterOption={(input, option) =>
															option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
														}
														onChange={setWorkerRole}
													>
														{workersOption}
													</Select>
												</Item>
											</Col>
											<Col xs={11} lg={11}>
												<Item
													{...restField}
													name={[name, 'payment_type']}
													fieldKey={[fieldKey, 'payment_type']}
													rules={[{ required: true, message: 'Choose payment type' }]}
												>
													<Select name={[name, 'payment_type']} placeholder="Payment type">
														<Option value="check">Check</Option>
														<Option value="cash">Cash</Option>
													</Select>
												</Item>
												<Item
													{...restField}
													name={[name, 'worker_role']}
													fieldKey={[fieldKey, 'worker_role']}
													hidden
													initialValue="helper"
												>
													<Input name={[name, 'worker_role']} />
												</Item>
												<Item
													{...restField}
													name={[name, 'g_role']}
													fieldKey={[fieldKey, 'g_role']}
													hidden
												>
													<Input name={[name, 'g_role']} />
												</Item>
											</Col>
											<Col xs={2} lg={1}>
												<MinusCircleOutlined onClick={() => remove(name)} />
											</Col>
											<Item
												{...restField}
												name={[name, 'salary']}
												fieldKey={[fieldKey, 'salary']}
												hidden
											>
												<Input name={[name, 'salary']} hidden/>
											</Item>
										</Row>
									))}
									<Item>
										<Button loading={workers.status === 'loading'} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
											Add helper
										</Button>
									</Item>
								</>
							)}
						</List>
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Work</Typography.Title>
					</Col>
					<Col span={8}>
						<Item
							name='loading_time'
							fieldKey='loading_time'
							label="Loading time"
							rules={[{ required: true, message: 'Please input loading time!' }]}
						>
							<MaskedInput name='loading_time' mask="11:11" placeholder="00:00" />
						</Item>
					</Col>
					<Col span={8}>
						<Item
							name='loading_flights'
							fieldKey='loading_flights'
							label="Flights of stairs"
							rules={[{ required: true, message: 'Please input flights!' }]}
						>
							<InputNumber name='loading_flights' placeholder="0" />
						</Item>
					</Col>
					<Col span={8}>
						<Item
							name='loading_movers'
							fieldKey='loading_movers'
							label="Additional movers"
						>
							<InputNumber name='loading_movers' placeholder="0" />
						</Item>
					</Col>
					<Col span={8}>
						<Item
							name='drive_time'
							fieldKey='drive_time'
							label="Drive time"
							rules={[{ required: true, message: 'Please input driving time!' }]}
						>
							<MaskedInput name='drive_time' mask="11:11" placeholder="00:00" />
						</Item>
					</Col>
					<Col span={12}>
						<Item
							name='double_drive'
							fieldKey='double_drive'
							label="Double drive?"
							valuePropName="checked"
						>
							<Switch
								checkedChildren={<CheckOutlined />}
								unCheckedChildren={<CloseOutlined />}
								name='double_drive'
							/>
						</Item>
					</Col>
					<Col span={8}>
						<Item
							name='unloading_time'
							fieldKey='unloading_time'
							label="Unloading time"
							rules={[{ required: true, message: 'Please input driving time!' }]}
						>
							<MaskedInput name='unloading_time' mask="11:11" placeholder="00:00"/>
						</Item>
					</Col>
					<Col span={8}>
						<Item
							name='unloading_flights'
							fieldKey='unloading_flights'
							label="Flights of stairs"
							rules={[{ required: true, message: 'Please input flights!' }]}
						>
							<InputNumber name='unloading_flights' placeholder="0" />
						</Item>
					</Col>
					<Col span={8}>
						<Item
							name='unloading_movers'
							fieldKey='unloading_movers'
							label="Additional movers"
						>
							<InputNumber name='unloading_movers' placeholder="0" />
						</Item>
					</Col>
					<Col xs={14} lg={8}>
						<Item
							label="Discount"
							name="discount"
						>
							<Select name="discount" dropdownRender={menu => (
								<>
									{menu}
									<div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
										<Item name="customDiscount">
											<InputNumber name="customDiscount"/>
										</Item>
										<Button onClick={() => addDiscount(form.getFieldValue('customDiscount'))}><PlusOutlined /> add</Button>
									</div>
								</>
							)}>
								{discount.map(el => (
									<Option key={el.value} value={el.value}>{el.label}</Option>
								))}
							</Select>
						</Item>
					</Col>
					<Col xs={12} lg={4}>
						<Item
							label="Truck fee"
							name="truck_fee"
							valuePropName="checked"
						>
							<Switch
								checkedChildren="Yes"
								unCheckedChildren="No"
								name="truck_fee"
								onChange={onTruckFee}
							/>
						</Item>
					</Col>
					<Col xs={12} lg={6}>
						<Item
							label="Driving time fee"
							name="driving_time_fee"
							valuePropName="checked"
						>
							<Switch
								checkedChildren="Yes"
								unCheckedChildren="No"
								name="driving_time_fee"
								onChange={onTruckFee}
							/>
						</Item>
					</Col>
					<Col xs={12} lg={6}>
						{!truckFee && (
							<Item
								label="Driving time price"
								name="driving_time_price"
							>
								<InputNumber
									formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={value => value.replace(/\$\s?|(,*)/g, '')}
									name="driving_time_price" placeholder="Driving time price"/>
							</Item>
						)}

					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Heavy items <Switch onChange={onChangeHeavy} checkedChildren="Yes" unCheckedChildren="No"/></Typography.Title>
						{heavyItems && (
							<List name="heavy_items">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, fieldKey, ...restField }) => (
											<Row key={key} gutter={16}>
												<Col span={11}>
													<Item
														{...restField}
														name={[name, 'heavy_item']}
														fieldKey={[fieldKey, 'heavy_item']}
													>
														<Select name={[name, 'heavy_item']} placeholder="Heavy item">
															<Option value="piano">Piano</Option>
															<Option value="safe">Safe</Option>
															<Option value="heavy_furniture">Heavy furniture</Option>
														</Select>
													</Item>
												</Col>
												<Col span={11}>
													<Item
														{...restField}
														name={[name, 'heavy_item_price']}
														fieldKey={[fieldKey, 'heavy_item_price']}
													>
														<InputNumber
															name={[name, 'heavy_item_price']}
															placeholder="Heavy item price"
															formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
															parser={value => value.replace(/\$\s?|(,*)/g, '')}
														/>
													</Item>
												</Col>
												<Col span={2}>
													<MinusCircleOutlined onClick={() => remove(name)} />
												</Col>
											</Row>
										))}
										<Form.Item>
											<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
												Add item
											</Button>
										</Form.Item>
									</>
								)}
							</List>
						)}
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Packing materials <Switch onChange={onChangeMaterial} checkedChildren="Yes" unCheckedChildren="No"/></Typography.Title>
						{addItems && (
							<List name="add_items">
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, fieldKey, ...restField }) => (
											<Row key={key} gutter={16}>
												<Col span={11}>
													<Item
														{...restField}
														name={[name, 'add_item']}
														fieldKey={[fieldKey, 'add_item']}
													>
														<Select name={[name, 'add_item']} placeholder="Additional item">
															<Option value="small">Small box</Option>
															<Option value="medium">Medium box</Option>
															<Option value="wardrobe">Wardrobe</Option>
															<Option value="wrap_paper">Wrap paper</Option>
															<Option value="bubble_wrap">Bubble wrap</Option>
															<Option value="blankets">Blankets</Option>
														</Select>
													</Item>
												</Col>
												<Col span={11}>
													<Item
														{...restField}
														name={[name, 'add_item_count']}
														fieldKey={[fieldKey, 'add_item_count']}
													>
														<InputNumber name={[name, 'add_item_count']} placeholder="Count"/>
													</Item>
												</Col>
												<Col span={2}>
													<MinusCircleOutlined onClick={() => remove(name)} />
												</Col>
											</Row>
										))}
										<Form.Item>
											<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
												Add item
											</Button>
										</Form.Item>
									</>
								)}
							</List>
						)}
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Tips <Switch onChange={onChangeTips} checkedChildren="Yes" unCheckedChildren="No"/></Typography.Title>
					</Col>
					<Col span={24}>
						{
							tips && (
								<Item
									name="tips"
								>
									<InputNumber
										formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={value => value.replace(/\$\s?|(,*)/g, '')}
										name="tips"
									/>
								</Item>
							)
						}
					</Col>
					<Col xs={24} span={8}>
						<Item
							name="total"
							style={{fontWeight: 'bold'}}
						>
							<InputNumber
								formatter={value => `Total: $${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								name="total"
								disabled
								style={{background:"#fff"}}
							/>
						</Item>
					</Col>
					<Col span={24}>
						<Item
							name='total_time'
							hidden
						>
							<InputNumber name='total_time' hidden />
						</Item>
						<Item>
							<Button loading={jobs.status === 'loading'} type="primary" htmlType="submit">
								Submit
							</Button>
						</Item>
					</Col>
				</Row>
			</Form>
		</Spin>
	);
};

export default AddWork;

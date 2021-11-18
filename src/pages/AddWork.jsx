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
	TimePicker,
	Typography
} from "antd";
import moment from "moment";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {CheckOutlined, CloseOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {fetchWorkers} from "../redux/asyncActions/workers";
import {calculator} from "../functions/calculator";
import {useHistory} from "react-router-dom";

const { Item, List } = Form
const { Option } = Select

const AddWork = () => {
	const [form] = Form.useForm()
	const dispatch = useDispatch()
	const history = useHistory()
	const [sendData, setSendData] = useState(false);
	const user = useSelector(({user}) => user)
	const {workers, isLoading} = useSelector(({workers}) => workers)
	const workersOption = workers.map(el => (
		<Option key={el.id} value={el.id}>{el.name}</Option>
	))
	useEffect(() => {
		dispatch(fetchWorkers(user.user.token))
	}, [user.user.token, dispatch]);
	const covert_time = (label) => label ? moment.duration(moment(label).format('HH:mm:ss')).asMinutes() : 0
	const calculateTotal = (changedValues, allValues) => {
		if (Array.isArray(changedValues?.working_hours)) {
			const total_time = allValues.working_hours.reduce((total, el) => {
				return total + covert_time(el?.loading_time) + covert_time(el?.unloading_time) + ((el?.double_drive ? 2 : 1) * covert_time(el?.drive_time))
			}, 0)
			form.setFieldsValue({total_time})
		}
		form.setFieldsValue({total: calculator(allValues)})
	}
	const onFinish = async (values) => {
		setSendData(true)
		const data = {
			status: 'publish',
			title: values.title,
			date: values.date,
			fields: {
				...values,
				workers_count: values.workers.length,
				working_hours: values.working_hours.map(el => ({
					...el,
					loading_time: moment(el.loading_time).format('HH:mm'),
					unloading_time: moment(el.unloading_time).format('HH:mm'),
					drive_time: moment(el.drive_time).format('HH:mm')
				})),
				workers: values.workers.map(el => ({
					...el,
					salary: Math.round(values.total_time/60*(el.worker_role === 'foreman' ? 25 : 20))
				}))
			}
		}
		try {
			await axios({
				method: 'POST',
				url: 'https://db.smartpeoplemoving.com/wp-json/wp/v2/works',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${user.user.token}`
				},
				data: JSON.stringify(data)
			})
			form.resetFields()
			message.success('Work added')
			setSendData(false)
			history.push('/home')
		} catch (e) {
			message.error('Error')
			setSendData(false)
			console.error(e)
		}

	};
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
					workers: [
						{
							id: +user.user.user_id,
							worker: +user.user.user_id,
							worker_role: 'foreman'
						}
					]
				}}
				form={form}
				onValuesChange={calculateTotal}
				size="large"
			>
				<Row style={{maxWidth: '600px'}} gutter={[16, 16]}>
					<Col span={8}>
						<Item
							label="Date"
							name="date"
							style={{ width: '100%' }}
						>
							<DatePicker style={{ width: '100%' }} name="date" disabled />
						</Item>
					</Col>
					<Col span={8}>
						<Item
							label="Work number"
							name="title"
							rules={[{ required: true, message: 'Please input work number!' }]}
						>
							<Input name="title"/>
						</Item>
					</Col>
					<Col span={8}>
						<Item
							label="Payment method"
							name="payment"
							rules={[{ required: true, message: 'Please select payment time!' }]}
						>
							<Select name="payment" placeholder="Payment method">
								<Option value="cash">Cash</Option>
								<Option value="credit_card">Credit card</Option>
								<Option value="check">Check</Option>
								<Option value="zelle">Zelle</Option>
								<Option value="venmo">Venmo</Option>
							</Select>
						</Item>
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Workers</Typography.Title>
						<List name="workers" rules={[{ required: true, message: 'Please add workers!' }]}>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, fieldKey, ...restField }) => (
										<Row gutter={16} justify="space-between" key={key}>
											<Col xs={24} lg={7}>
												<Item
													{...restField}
													name={[name, 'worker']}
													fieldKey={[fieldKey, 'worker']}
													rules={[{ required: true, message: 'Choose worker' }]}
													style={{ width: '100%' }}
												>
													<Select
														placeholder="Worker"
														showSearch
														optionFilterProp="children"
														name={[name, 'worker']}
														filterOption={(input, option) =>
															option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
														}
													>
														{workersOption}
													</Select>
												</Item>
											</Col>
											<Col xs={24} lg={7}>
												<Item
													{...restField}
													name={[name, 'payment_type']}
													fieldKey={[fieldKey, 'payment_type']}
													rules={[{ required: true, message: 'Choose payment type' }]}
													style={{ width: '100%' }}
												>
													<Select name={[name, 'payment_type']} placeholder="Payment type">
														<Option value="check">Check</Option>
														<Option value="cash">Cash</Option>
													</Select>
												</Item>
											</Col>
											<Col xs={22} lg={7}>
												<Item
													{...restField}
													name={[name, 'worker_role']}
													fieldKey={[fieldKey, 'worker_role']}
													rules={[{ required: true, message: 'Choose worker role' }]}
													style={{ width: '100%' }}
												>
													<Select name={[name, 'worker_role']} placeholder="Worker role">
														<Option value="foreman">Foreman</Option>
														<Option value="helper">Helper</Option>
													</Select>
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
										<Button loading={isLoading} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
											Add helper
										</Button>
									</Item>
								</>
							)}
						</List>
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Working hours</Typography.Title>
						<List name="working_hours">
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, fieldKey, ...restField }) => (
										<Row gutter={16} style={{width: '100%'}} key={key}>
											<Col xs={24} lg={6}>
												<Item
													{...restField}
													name={[name, 'loading_time']}
													fieldKey={[fieldKey, 'loading_time']}
													label="Loading time"
												>
													<TimePicker
														showNow={false}
														name={[name, 'loading_time']}
														format={'HH:mm'}
														minuteStep={5}
													/>
												</Item>
											</Col>
											<Col xs={24} lg={11}>
												<Row gutter={16}>
													<Col span={14}>
														<Item
															{...restField}
															name={[name, 'drive_time']}
															fieldKey={[fieldKey, 'drive_time']}
															label="Drive time"
														>
															<TimePicker showNow={false} name={[name, 'drive_time']} format={'HH:mm'} minuteStep={5}/>
														</Item>
													</Col>
													<Col span={10}>
														<Item
															{...restField}
															name={[name, 'double_drive']}
															fieldKey={[fieldKey, 'double_drive']}
															label="Double drive?"
															valuePropName="checked"
														>
															<Switch
																checkedChildren={<CheckOutlined />}
																unCheckedChildren={<CloseOutlined />}
																name={[name, 'double_drive']}
															/>
														</Item>
													</Col>

												</Row>
											</Col>
											<Col xs={22} lg={6}>
												<Item
													{...restField}
													name={[name, 'unloading_time']}
													fieldKey={[fieldKey, 'unloading_time']}
													label="Unloading time"

												>
													<TimePicker showNow={false} name={[name, 'unloading_time']} format={'HH:mm'} minuteStep={5}/>
												</Item>
											</Col>
											<Col xs={2} lg={1}>
												<MinusCircleOutlined onClick={() => remove(name)} />
											</Col>
										</Row>
									))}
									<Item>
										<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
											Add location
										</Button>
									</Item>

								</>
							)}
						</List>
						<Item name="total_time" hidden>
							<InputNumber hidden name="total_time" prefix="Total time:" suffix="minutes" disabled />
						</Item>
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Heavy items</Typography.Title>
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
														<Input name={[name, 'heavy_item']} placeholder="Heavy item" />
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
					</Col>
					<Col span={24}>
						<Typography.Title level={4}>Additional items</Typography.Title>
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
					</Col>

					<Col xs={12} span={8}>
						<Item
							label="Truck fee"
							name="truck_fee"
							valuePropName="checked"
						>
							<Switch
								checkedChildren="Yes"
								unCheckedChildren="No"
								name="truck_fee"
							/>
						</Item>
					</Col>
					<Col xs={24} span={8}>
						<Item
							label="Total"
							name="total"
						>
							<InputNumber
								formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={value => value.replace(/\$\s?|(,*)/g, '')}
								name="total"
								disabled

							/>
						</Item>
					</Col>

					<Col span={24}>
						<Item>
							<Button loading={sendData} type="primary" htmlType="submit">
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

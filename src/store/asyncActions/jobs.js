import axios from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_ROUTE} from "../../utils/consts";

export const createJob = createAsyncThunk(
	'jobs/createJob',
	async ({values, token, jobId = false}, {rejectWithValue}) => {
		try {
			const data = {
				status: 'publish',
				title: values.title.toString(),
				fields: {
					date: values.date,
					completed: 'no',
					customer_info: values
				}
			}
			const res = await axios({
				method: 'POST',
				url: `${API_ROUTE}/wp/v2/works${jobId ? `/${jobId}` : ''}`,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				data: JSON.stringify(data)
			})
			const {id, date, title, acf} = res.data
			return {id, date, title, acf, jobId}
		} catch (e) {
			return rejectWithValue(e.message)
		}
	}
)

export const updateJob = createAsyncThunk(
	'jobs/updateJob',
	async ({values, token, work_id = ''}, {rejectWithValue}) => {
		try {
			values.workers.push({
				worker_role: 'foreman',
				worker: values.foreman,
				payment_type: values.foreman_payment_type
			})
			const data = {
				fields: {
					date: values.date,
					completed: 'yes',
					foreman_info: {
						...values,
						workers_count: values.workers.length,
						workers: values.workers.map(el => ({
							...el,
							salary: Math.round(values.total_time*(el.g_role === 'foreman' ? 25 : 20)),
							status: values.payment === "cash" && el.payment_type === "cash"
						}))
					}
				}
			}
			const res = await axios({
				method: 'POST',
				url: `${API_ROUTE}/wp/v2/works/${work_id}`,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				data: JSON.stringify(data)
			})
			const {id, date, title, acf} = res.data
			return {id, date, title, acf}
		} catch (e) {
			return rejectWithValue(e.message)
		}
	}
)

export const fetchWorkerJobs = createAsyncThunk(
	'jobs/fetchWorkerJobs',
	async ({token, id}, {rejectWithValue}) => {
		try {
			let user = await axios({
				method: 'GET',
				url: `${API_ROUTE}/myplug/v2/users/${id}`,
				headers: {
					'Authorization': `Bearer ${token}`
				},
			})
			user.data.works = user.data.works.map(work => ({
				...work,
				workers: work?.workers.find(el => +el.worker.ID === +id)
			}))
			return user.data
		} catch (e) {
			return rejectWithValue(e.message)
		}
	}
)

export const fetchJobs = createAsyncThunk(
	'jobs/fetchJobs',
	async ({token}, {rejectWithValue}) => {
		try {
			const res = await axios({
				method: 'GET',
				url: `${API_ROUTE}/wp/v2/works`,
				params: {
					_fields: 'id,date,title,acf'
				},
				headers: {
					'Authorization': `Bearer ${token}`
				},
			})
			return res.data
		} catch (e) {
			return rejectWithValue(e.message)
		}
	}
)

export const updateJobStatus = createAsyncThunk(
	'jobs/updateJobStatus',
	async ({token, record, job_workers}, {rejectWithValue}) => {
		try {
			await axios({
				method: 'PUT',
				url: `${API_ROUTE}/acf/v3/works/${record.id}/workers`,
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type' : 'application/json'
				},
				data: JSON.stringify({fields: {foreman_info: {workers: job_workers}}})
			})
			return record.id
		} catch (e) {
			return rejectWithValue(e.message)
		}
	}
)

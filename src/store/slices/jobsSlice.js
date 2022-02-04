import {createSlice} from "@reduxjs/toolkit";
import {setData, setError, setLoading} from "../../utils/functions";
import {createJob, fetchJobs, fetchWorkerJobs, updateJob, updateJobStatus} from "../asyncActions/jobs";

const initialState = {
	data: [],
	worker_jobs: {
		works: []
	},
	status: null,
	error: null
}


const jobsSlice = createSlice({
	name: 'jobs',
	initialState,
	reducers: {
		changeStatus(state, action) {
			state.status = action.payload
		}
	},
	extraReducers: {
		[updateJob.pending]: setLoading,
		[updateJob.fulfilled]: (state, action) => {
			state.data[state.data.findIndex(el => +el.id === +action.payload.id)] = action.payload
			state.status = 'updated'
			state.error = null
		},
		[updateJob.rejected]: setError,
		[fetchWorkerJobs.pending]: setLoading,
		[fetchWorkerJobs.fulfilled]: (state, action) => {
			state.status = 'resolved'
			state.error = null
			state.worker_jobs = action.payload
		},
		[fetchWorkerJobs.rejected]: setError,
		[fetchJobs.pending]: setLoading,
		[fetchJobs.fulfilled]: setData,
		[fetchJobs.rejected]: setError,
		[updateJobStatus.pending]: setLoading,
		[updateJobStatus.fulfilled]: (state, action) => {
			state.worker_jobs.works = state.worker_jobs.works.map(el => {
				if(el.id === action.payload) {
					return {
						...el,
						workers: {
							...el.workers,
							status: !el.workers.status
						}
					}
				}
				return el
			})
			state.status = 'resolved'
			state.error = null
		},
		[updateJobStatus.rejected]: setError,
		[createJob.pending]: setLoading,
		[createJob.fulfilled]: (state, action) => {
			if (action.payload.jobId) {
				console.log(true)
				state.data[state.data.findIndex(el => +el.id === +action.payload.jobId)] = action.payload
			} else {
				state.data.unshift(action.payload)
			}
			state.status = 'created'
			state.error = null
		},
		[createJob.rejected]: setError,

	}
})

export const {changeStatus} = jobsSlice.actions

export default jobsSlice.reducer
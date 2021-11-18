export const setJobs = (data) => ({
	type: 'SET_JOBS',
	payload: data
})
export const setJobsLoading = (bool) => ({
	type: 'SET_JOBS_LOADING',
	payload: bool
})
export const setWorkerJobs = (data) => ({
	type: 'SET_WORKER_JOBS',
	payload: data
})
import produce from "immer";

const initialState = {
	jobs: [],
	isLoading: false,
	worker_jobs: {
		works: []
	}
}

const jobs = (state = initialState, action) => {
	return produce(state, draft => {
		const {payload, type} = action
		if (type === 'SET_JOBS') {
			draft.jobs = payload
		}
		if (type === 'SET_JOBS_LOADING') {
			draft.isLoading = payload
		}
		if (type === 'SET_WORKER_JOBS') {
			draft.worker_jobs = payload
		}
	})
}

export default jobs;
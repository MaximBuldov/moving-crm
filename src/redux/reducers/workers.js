import produce from "immer";

const initialState = {
	workers: [],
	isLoading: false
}

const workers = (state = initialState, action) => {
	return produce(state, draft => {
		const {payload, type} = action
		if (type === 'SET_WORKERS') {
			draft.workers = payload
		}
		if (type === 'SET_WORKERS_LOADING') {
			draft.isLoading = payload
		}
	})
}

export default workers;
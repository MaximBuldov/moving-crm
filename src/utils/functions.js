export const setError = (state, action) => {
	state.status = 'rejected'
	state.error = action.payload
}

export const setLoading = (state) => {
	state.status = 'loading'
	state.error = null
}

export const setData = (state, action) => {
	state.status = 'resolved'
	state.error = null
	state.data = action.payload
}
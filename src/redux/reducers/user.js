import produce from "immer";

const initialState = {
	user: null,
	isAuth: false,
	isLoading: false
}

const user = (state = initialState, action) => {
	return produce(state, draft => {
		const {payload, type} = action
		if (type === 'USER_AUTH') {
			draft.user = payload
			draft.isAuth = true
		}
		if (type === 'SET_USER_LOADING') {
			draft.isLoading = payload
		}
		if (type === 'USER_LOGOUT') {
			draft.user = null
			draft.isAuth = false
		}
	})
}

export default user;
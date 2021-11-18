export const userAuth = (data) => ({
	type: 'USER_AUTH',
	payload: data
})
export const setUserLoading = (bool) => ({
	type: 'SET_USER_LOADING',
	payload: bool
})
export const userLogout = () => ({
	type: 'USER_LOGOUT'
})

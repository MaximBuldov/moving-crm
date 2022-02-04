import {createSlice} from "@reduxjs/toolkit";
import {authUser} from "../asyncActions/user";
import {setData, setError, setLoading} from "../../utils/functions";

const initialState = {
	data: null,
	status: null,
	error: null
}



const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logoutUser(state) {
			state.data = null
			state.status = null
			state.error = null
		}
	},
	extraReducers: {
		[authUser.pending]: setLoading,
		[authUser.fulfilled]: setData,
		[authUser.rejected]: setError,
	}
})

export const {logoutUser} = userSlice.actions

export default userSlice.reducer
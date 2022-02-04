import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	collapsed: false,
	currentJob: null,
	isModalVisible: null
}

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		collapseMenu(state) {
			state.collapsed = !state.collapsed
		},
		serCurrentJob(state, action) {
			state.currentJob = action.payload
		},
		setIsModalVisible(state, action) {
			state.isModalVisible = action.payload
		}
	}
})

export const {collapseMenu, serCurrentJob, setIsModalVisible} = appSlice.actions

export default appSlice.reducer
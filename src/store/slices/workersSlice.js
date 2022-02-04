import {createSlice} from "@reduxjs/toolkit";
import {setData, setError, setLoading} from "../../utils/functions";
import {fetchWorkers} from "../asyncActions/workers";

const initialState = {
	data: [],
	status: null,
	error: null,
}


const workersSlice = createSlice({
	name: 'workers',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchWorkers.pending]: setLoading,
		[fetchWorkers.fulfilled]: setData,
		[fetchWorkers.rejected]: setError,
	}
})


export default workersSlice.reducer
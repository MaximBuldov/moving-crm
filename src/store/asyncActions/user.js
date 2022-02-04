import axios from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_ROUTE} from "../../utils/consts";

///rejectWithValue, dispatch, getState
export const authUser = createAsyncThunk(
	'user/authUser',
	async (data, {rejectWithValue}) => {
		try {
			const res = await axios({
				method: 'POST',
				url: `${API_ROUTE}/jwt-auth/v1/token`,
				data
			})
			return res.data
		} catch (error) {
			return rejectWithValue(error.response.data.message)
		}
	}
)
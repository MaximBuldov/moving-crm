import axios from "axios";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {API_ROUTE} from "../../utils/consts";

export const fetchWorkers = createAsyncThunk(
	'workers/fetchWorkers',
	async (token, {rejectWithValue}) => {
		try {
			const res = await axios({
				method: 'GET',
				url: `${API_ROUTE}/wp/v2/users`,
				params: {
					roles: 'helper,foreman',
					_fields: 'id,name,slug,acf,roles',
					per_page: '100'
				},
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
			})
			return res.data
		} catch (e) {
			return rejectWithValue(e.message)
		}
	}
)

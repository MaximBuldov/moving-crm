import axios from "axios";
import {setWorkers, setWorkersLoading} from "../actions/workers";

export const fetchWorkers = (token) => {
	return async dispatch => {
		dispatch(setWorkersLoading(true))
		try {
			const res = await axios({
				method: 'GET',
				url: `https://db.smartpeoplemoving.com/wp-json/wp/v2/users?roles=editor&_fields=id,name,slug,acf`,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
			})
			dispatch(setWorkers(res.data))
			dispatch(setWorkersLoading(false))
			return true
		} catch (e) {
			dispatch(setWorkersLoading(false))
			return false
		}
	}
}


import axios from "axios";
import {setUserLoading, userAuth} from "../actions/user";

export const auth = (data) => {
	return async dispatch => {
		dispatch(setUserLoading(true))
		try {
			const res = await axios({
				method: 'POST',
				url: `https://db.smartpeoplemoving.com/wp-json/jwt-auth/v1/token`,
				data: data
			})
			dispatch(userAuth(res.data))
			dispatch(setUserLoading(false))
			return true
		} catch (e) {
			dispatch(setUserLoading(false))
			return false
		}
	}
}
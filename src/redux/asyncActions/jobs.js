import axios from "axios";
import {setJobs, setJobsLoading, setWorkerJobs} from "../actions/jobs";

export const fetchJobs = (token) => {
	return async dispatch => {
		dispatch(setJobsLoading(true))
		try {
			const res = await axios({
				method: 'GET',
				url: `https://db.smartpeoplemoving.com/wp-json/wp/v2/works?_fields=id,date,title,acf`,
				headers: {
					'Authorization': `Bearer ${token}`
				},
			})
			dispatch(setJobs(res.data))
			dispatch(setJobsLoading(false))
			return true
		} catch (e) {
			dispatch(setJobsLoading(false))
			return false
		}
	}
}
export const fetchWorkerJobs = (token, id) => {
	return async dispatch => {
		dispatch(setJobsLoading(true))
		try {
			let user = await axios({
				method: 'GET',
				url: `https://db.smartpeoplemoving.com/wp-json/myplug/v2/users/${id}`,
				headers: {
					'Authorization': `Bearer ${token}`
				},
			})
			user.data.works = user.data.works.map(work => ({
				...work,
				workers: work?.workers.find(el => el.worker.ID == id)
			}))
			dispatch(setWorkerJobs(user.data))
			dispatch(setJobsLoading(false))
		} catch (e) {
			dispatch(setJobsLoading(false))
		}
	}
}

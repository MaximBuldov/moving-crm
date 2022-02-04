import React, {useCallback, useEffect, useState} from 'react'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import {useDispatch, useSelector} from "react-redux";
import {fetchJobs} from "../store/asyncActions/jobs";
import {Spin} from "antd";
import MyCalendar from "../components/MyCalendar";
import MyModal from "../components/MyModal";


const Schedule = () => {
	const dispatch = useDispatch()
	const [job, setJob] = useState(null);
	const {jobs: {data, status}, user: {data: {token}}} = useSelector((state) => state)

	useEffect(() => {
			dispatch(fetchJobs({token}))
		}, [dispatch]
	)

	const onSelectEvent = useCallback((job) => {
		setJob(job)
	}, [])

	const onSelectSlot = (slotInfo) => {
		setJob(slotInfo)
	}

	const handleCancel = () => {
		setJob(null)
	}
	return (
		<Spin spinning={status === 'loading'}>
			<MyCalendar data={data} onSelectEvent={onSelectEvent} onSelectSlot={onSelectSlot}/>
			{!!job && <MyModal job={job} dispatch={dispatch} status={status} token={token} handleCancel={handleCancel} workNumber={data[0].title.rendered}/>}
		</Spin>
	);
	}
;

export default Schedule;
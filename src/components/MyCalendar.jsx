import React, {useMemo} from 'react';
import {Calendar, momentLocalizer, Views} from "react-big-calendar";
import moment from "moment";


const localize = momentLocalizer(moment)
let allViews = Object.keys(Views).map(k => Views[k])

const minTime = moment().hours(8).minutes(0).seconds(0).toDate(),
	maxTime = moment().hours(20).minutes(0).seconds(0).toDate()

const MyCalendar = React.memo(function MyCalendar({data, onSelectEvent, onSelectSlot}) {

	const worksList = useMemo(() => data.map(el => {
		let time = el?.acf?.customer_info?.time
		const title = `#${el.title.rendered} -${parseInt(el.acf.customer_info?.movers)}- ${el.acf.customer_info?.customer_name} ${el.acf.customer_info?.customer_phone} ${el.acf.customer_info?.howfrom[0]}`
		return {
			id: el.id,
			title,
			allDay: false,
			start: moment(el.acf.date, 'MM/DD/YYYY').add(time, 'HH:mm').toDate(),
			end: moment(el.acf.date, 'MM/DD/YYYY').add(time + 60, 'HH:mm').toDate(),
			foreman_info: el.acf.foreman_info,
			customer_info: el.acf.customer_info,
			completed: el.acf.completed,
			order: el.title.rendered
		}
	}), [data])
	return (
		<Calendar
			defaultView={Views.DAY}
			localizer={localize}
			events={worksList}
			startAccessor="start"
			endAccessor="end"
			showMultiDayTimes
			views={allViews}
			style={{height: 'calc(100vh - 48px)'}}
			onSelectEvent={onSelectEvent}
			onSelectSlot={onSelectSlot}
			selectable
			min={minTime}
			max={maxTime}
		/>
	);
});

export default MyCalendar;



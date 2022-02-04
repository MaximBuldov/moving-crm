import moment from "moment";

const c = (label) => label ? moment.duration(label).asHours() : 0

export const calculator = (allValues, form) => {
	const dayType = moment(allValues?.date).day() < 5 ? 10 : 0
	const moversPrice = 40 + ((allValues?.workers?.length + 1) * 40)
	const truckFee = allValues?.truck_fee ? 50 : 0
	const drivingFee = allValues?.driving_time_fee ? allValues?.driving_time_price : 0
	const double_drive = allValues?.double_drive ? 2 : 1
	const tips = allValues?.tips ? allValues?.tips : 0
	const loadingFlights = allValues?.loading_flights > 3 ? allValues?.loading_flights * 5 : 0
	const unloadingFlights = allValues?.unloading_flights > 3 ? allValues?.unloading_flights * 5 : 0
	const discount = allValues.discount === 'no' ? 1 : allValues.discount === 'percent' ? 0.9 : allValues.discount
	const totalTime = c(allValues?.loading_time) + (c(allValues?.drive_time) * double_drive) + c(allValues?.unloading_time)
	const loadingMovers = allValues?.loading_movers ? allValues.loading_movers * 40 : 0
	const unloadingMovers = allValues?.unloading_movers ? allValues.unloading_movers * 40 : 0
	form.setFieldsValue({total_time: totalTime})
	let heavyItems = allValues?.heavy_items?.reduce((total, el) => {
		return total + (isNaN(el?.heavy_item_price) ? 0 : el.heavy_item_price)
	}, 0)
	heavyItems = heavyItems ? heavyItems : 0
	let addItems = allValues?.add_items?.reduce((total, el) => {
		let price = 0
		switch (el?.add_item) {
			case 'small':
				price = 3
				break
			case 'medium':
				price = 4
				break
			case 'wardrobe':
				price = 30
				break
			case 'blankets':
				price = 30
				break
			case 'wrap_paper':
				price = 40
				break
			case 'bubble_wrap':
				price = 40
				break
			default:
				price = 0
		}
		return total + (isNaN(el?.add_item_count) ? 0 : el.add_item_count) * price
	}, 0)
	addItems = addItems ? addItems : 0
	let payment = 1
	switch (allValues.payment) {
		case "credit_card":
		case "venmo":
			payment = 1.05
			break
		case "zelle":
		case "check":
		case "cash":
			payment = 1
			break
		case "credit_card_dollar":
			payment = 0
			break
		default:
			payment = 1
	}
	const totalMoversPrice = payment === 0 ? moversPrice - dayType + 10 : moversPrice - dayType
	const totalTimePrice = ((totalMoversPrice + loadingMovers + loadingFlights) * c(allValues?.loading_time)) + ((c(allValues?.drive_time) * double_drive) * totalMoversPrice) + ((totalMoversPrice + unloadingMovers + unloadingFlights) * c(allValues?.unloading_time))
	const itemPlusFee = truckFee + drivingFee + heavyItems + addItems + tips
	const priceWithDiscount = discount > 1 ? (totalTimePrice + itemPlusFee) - discount : (totalTimePrice + itemPlusFee) * discount
	const result = payment === 0 ? priceWithDiscount : priceWithDiscount * payment
	return isNaN(result) ? 0 : Math.round(result)
}
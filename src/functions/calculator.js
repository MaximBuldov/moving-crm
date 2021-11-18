export const calculator = (allValues) => {
	const moversPrice = allValues?.workers?.length > 0 ? 40 + allValues.workers.length * 40 : 0
	const truckFee = allValues?.truck_fee ? 70 : 0
	const totalTime = allValues?.total_time / 60
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
	const payment = allValues.payment === "credit_card" ? 1.05 : 1
	const result = ((moversPrice*totalTime) + truckFee + heavyItems + addItems) * payment
	return isNaN(result) ? 0 : Math.round(result)
}
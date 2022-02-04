import moment from "moment";
import React from "react";

export const copyOrderInfo = (values) => {
	const text = `
Request: ${values.title}
Status: ??
Move Date: ${moment(values.date).format('MM/DD/YYYY')}
Start Time: ${moment(values.time).format('h a')}
Crew Size: ${values.movers}
Hourly Rate: ${values.result}
Payment: ${values.payment}
Truck Fee: ${values.truck_fee}
Type of Service: Moving
Size of Move: ${values.bedroom}
Truck: ${values.truck}

Moving From: ${values.pickup_address[0].address}, ${values.pickup_address[0].city}, ${values.pickup_address[0].zip}
Flights: ${values.pickup_address[0].flights}
Moving to: ${values?.dropoff_address[0]?.address}, ${values?.dropoff_address[0]?.city}, ${values?.dropoff_address[0]?.zip}
Flights: ${values?.dropoff_address[0]?.flights}

Packing: ${values.packing}

Customer: ${values.customer_name}
Phone: ${values.customer_phone}
Email: ${values.customer_email}
Contact person: ${values.contact_name}
Phone: ${values.contact_phone}
Email: ${values.contact_email}

From: ${values.howfrom}
	`
	return text
}
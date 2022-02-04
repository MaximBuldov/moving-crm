import {
	ADD_JOB_ROUTE,
	ALL_JOBS_ROUTE,
	HOME_ROUTE,
	SALARIES_ROUTE,
	SCHEDULE_ROUTE,
} from "./utils/consts";
import Home from "./pages/Home";
import AddWork from "./pages/AddWork";
import Salaries from "./pages/Salaries";
import AllJobs from "./pages/AllJobs";
import Schedule from "./pages/Schedule";
import {
	CalculatorOutlined,
	CalendarOutlined,
	CreditCardOutlined, DatabaseOutlined,
	HomeOutlined,
} from "@ant-design/icons";


const helperRoutes = [
	{
		path: HOME_ROUTE,
		Component: Home,
		name: 'Home',
		Icon: <HomeOutlined />
	},
	{
		path: SALARIES_ROUTE,
		Component: Salaries,
		name: 'Salaries',
		Icon: <CreditCardOutlined />
	},
]

const foremanRoutes = [
	{
		path: ADD_JOB_ROUTE,
		Component: AddWork,
		name: 'Add job',
		Icon: <CalculatorOutlined />
	}
]

const adminRoutes = [
	{
		path: ALL_JOBS_ROUTE,
		Component: AllJobs,
		name: 'Completed',
		Icon: <DatabaseOutlined />
	},
	{
		path: SCHEDULE_ROUTE,
		Component: Schedule,
		name: 'Schedule',
		Icon: <CalendarOutlined />
	}
]

export const allRoutes = (user_role) => {
	let routes = []
	if (user_role === 'helper' || user_role === 'foreman' || user_role === 'administrator') {
		routes.push(...helperRoutes)
	}
	if (user_role === 'foreman' || user_role === 'administrator') {
		routes.push(...foremanRoutes)
	}
	if (user_role === 'administrator') {
		routes.push(...adminRoutes)
	}
	return routes
}
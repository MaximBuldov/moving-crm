import {combineReducers} from "redux";
import user from "./user";
import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import workers from "./workers";
import jobs from "./jobs";

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['user', 'workers', 'jobs'],
}

const rootReducer = combineReducers({
	user, workers, jobs
})

export default persistReducer(persistConfig, rootReducer);
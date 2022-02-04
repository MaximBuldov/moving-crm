import {configureStore, combineReducers} from "@reduxjs/toolkit"
import userReducer from './slices/userSlice'
import workersReducer from './slices/workersSlice'
import jobsReducer from './slices/jobsSlice'
import appReducer from './slices/appSlice'

import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
	user: userReducer,
	workers: workersReducer,
	jobs: jobsReducer,
	app: appReducer,
})

const persistConfig = {
	key: 'root',
	storage,
	//blacklist
	//whitelist
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

export const persistor = persistStore(store)

export default store
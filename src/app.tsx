import { App } from "./components-ui/Menu";
import * as React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import reducers from "./reducers/index";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native
import { PersistGate } from "redux-persist/integration/react";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { Root } from "native-base";

const persistConfig = {
	key: "root",
	storage,
	whitelist: ["logger"]
};

const persistedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducer, applyMiddleware(logger, thunk));
const persistor = persistStore(store);

export class MainApp extends React.Component {

	componentDidMount() {
		console.disableYellowBox = true;
		NativeModules.Wrap_Main.init(
			RNFS.DocumentDirectoryPath + "/store",
			(err) => console.log(err));
	}
	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Root>
						<App />
					</Root>
				</PersistGate>
			</Provider>
		);
	}
}
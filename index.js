import * as React from "react";
import { Provider } from "react-redux";
import { AppRegistry } from 'react-native';
import {App} from './build/app';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import reducers from './build/reducers/index';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['files'] 
  }

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(persistedReducer, applyMiddleware(logger, thunk));
const persistor = persistStore(store)


class MainApp extends React.Component {      

    componentDidMount() {
        console.disableYellowBox = true;
    }
    render() {
        return(
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App/>
                </PersistGate>
            </Provider>
        )
    }
}

AppRegistry.registerComponent('CryptoARM_GOST', () => MainApp);
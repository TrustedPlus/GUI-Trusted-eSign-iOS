import * as React from "react";
import { Provider } from "react-redux";
import { AppRegistry } from 'react-native';
import {App} from './build/app';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import reducers from './build/reducers/index';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(logger, thunk));


class MainApp extends React.Component {
    componentDidMount() {
        console.disableYellowBox = true;
    }
    render() {
        return(
            <Provider store={store}>
                <App/>
            </Provider>
        )
    }
}

AppRegistry.registerComponent('CryptoARM_GOST', () => MainApp);
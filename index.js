import * as React from "react";
import { Provider } from "react-redux";
import { AppRegistry } from 'react-native';
import {App} from './build/app';
import { createStore } from 'redux';
import reducers from './build/reducers/index';

const store = createStore(reducers)

class MainApp extends React.Component {
    render() {
        return(
            <Provider store={store}>
                <App/>
            </Provider>
        )
    }
}

AppRegistry.registerComponent('CryptoARM_GOST', () => MainApp);
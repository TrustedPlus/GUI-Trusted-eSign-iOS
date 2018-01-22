import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import SecondScreen from './src/SecondScreen'
import {App} from './src/App';

const SimpleApp = DrawerNavigator({
  App: { screen: App },
  SecondScreen: { screen: SecondScreen },
});

AppRegistry.registerComponent('ReactNativeApp', () => SimpleApp);
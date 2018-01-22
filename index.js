import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import {App} from './src/App';
import Diagnostic from './src/Diagnostic';
import Signature from './src/Signature';
import Encryption from './src/Encryption';
import Сertificate from './src/Сertificate';
import Repository from './src/Repository';
import Journal from './src/Journal';
import SideBar from "./components/SideBar";

const SimpleApp = DrawerNavigator({
  App: { screen: App},
  Diagnostic: { screen: Diagnostic },
  Signature: { screen: Signature },
  Encryption: { screen: Encryption },
  Сertificate: { screen: Сertificate },
  Repository: { screen: Repository},
  Journal: { screen: Journal},
},
{
  contentComponent: props => <SideBar {...props} />
}
);

AppRegistry.registerComponent('ReactNativeApp', () => SimpleApp);
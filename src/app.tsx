import * as React from "react";
import { DrawerNavigator } from "react-navigation";
import {menu} from "./components/Menu";
import {Diagnostic} from "./components/Diagnostic";
import {Signature} from "./components/Signature";
import {Encryption} from "./components/Encryption";
import {Certificate} from "./components/Certificate";
import {Repository} from "./components/Repository";
import {Journal} from "./components/Journal";
import {SideBar} from "./components/SideBar";
import {License} from "./components/License";
import {Help} from "./components/Help";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers";

const store = createStore(reducers);



export const App = DrawerNavigator({
  Menu: { screen: menu},
  Diagnostic: { screen: Diagnostic },
  Signature: { screen: Signature },
  Encryption: { screen: Encryption },
  Certificate: { screen: Certificate },
  Repository: { screen: Repository},
  Journal: { screen: Journal},
  License: { screen: License},
  Help: { screen: Help}
},
{
  contentComponent: props => <SideBar {...props} />
});
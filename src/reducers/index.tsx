import { combineReducers } from "redux";
import appData from "./dataReducer";

const rootReducer = combineReducers({
    footer: appData
});

export default rootReducer;
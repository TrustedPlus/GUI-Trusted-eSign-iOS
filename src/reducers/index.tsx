import { combineReducers } from "redux";
import appData from "./SignReducers";

const rootReducer = combineReducers({
    footer: appData
});

export default rootReducer;
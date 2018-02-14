import { combineReducers } from "redux";
import Footer from "./SignReducers";
import {Certificate} from "./CertReducers";

const rootReducer = combineReducers({
    footer: Footer,
    certificate: Certificate
});

export default rootReducer;
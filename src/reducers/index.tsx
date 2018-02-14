import { combineReducers } from "redux";
import Footer from "./SignReducers";
import {Certificate} from "./CertReducers";
import Files from "./Files";

const rootReducer = combineReducers({
    footer: Footer,
    certificate: Certificate,
    files: Files
});

export default rootReducer;
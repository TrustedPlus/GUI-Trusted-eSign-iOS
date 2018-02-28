import { combineReducers } from "redux";
import Footer from "./SignReducers";
import {Certificate} from "./CertReducers";
import {Files} from "./Files";
import {CertKeys} from "./CertKeysReducers";

const rootReducer = combineReducers({
    footer: Footer,
    certificate: Certificate,
    files: Files,
    certKeys: CertKeys
});

export default rootReducer;
import { combineReducers } from "redux";
import Footer from "./SignReducers";
import {personalCert} from "./PersonalCertReducers";
import {otherCert} from "./OtherCertReducers";
import {Files} from "./Files";
import {CertKeys} from "./CertKeysReducers";

const rootReducer = combineReducers({
    footer: Footer,
    personalCert: personalCert,
    files: Files,
    certKeys: CertKeys,
    otherCert: otherCert
});

export default rootReducer;
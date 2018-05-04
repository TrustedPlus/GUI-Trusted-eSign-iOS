import { combineReducers } from "redux";
import Footer from "./SignReducers";
import {personalCert} from "./PersonalCertReducers";
import {otherCert} from "./OtherCertReducers";
import {Files} from "./Files";
import {Logger} from "./Logger";
import {CertKeys} from "./CertKeysReducers";

const rootReducer = combineReducers({
    footer: Footer,
    personalCert: personalCert,
    files: Files,
    logger: Logger,
    certKeys: CertKeys,
    otherCert: otherCert
});

export default rootReducer;
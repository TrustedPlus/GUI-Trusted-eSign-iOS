import { combineReducers } from "redux";
import { Footer } from "./SignReducers";
import { personalCert } from "./PersonalCertReducers";
import { otherCert } from "./OtherCertReducers";
import { Files } from "./Files";
import { Logger } from "./Logger";
import { certificates } from "./CertificatesReducers";
import { containers } from "./GetContainersReducers";

const rootReducer = combineReducers({
	footer: Footer,
	personalCert: personalCert,
	files: Files,
	logger: Logger,
	certificates: certificates,
	otherCert: otherCert,
	containers: containers
});

export default rootReducer;
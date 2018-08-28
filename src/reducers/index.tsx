import { combineReducers } from "redux";
// import { Footer } from "./SignReducers";
import { personalCert } from "./PersonalCertReducers";
import { otherCert } from "./OtherCertReducers";
import { Files } from "./Files";
import { Logger } from "./Logger";
import { certificates } from "./CertificatesReducers";
import { containers } from "./GetContainersReducers";
import { requests } from "./requestReducer";
import { workspaceSign } from "./workspaceSign";
import { workspaceEnc } from "./workspaceEnc";
import { filter } from "./filterReducers";
import { statusLicense } from "./refreshStatusReducer";

const rootReducer = combineReducers({
	// footer: Footer,
	personalCert: personalCert,
	files: Files,
	logger: Logger,
	certificates: certificates,
	otherCert: otherCert,
	containers: containers,
	requests: requests,
	workspaceSign: workspaceSign,
	workspaceEnc: workspaceEnc,
	filter: filter,
	statusLicense: statusLicense
});

export default rootReducer;
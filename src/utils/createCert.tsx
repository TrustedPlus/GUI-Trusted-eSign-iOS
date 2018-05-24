import { Alert, AlertIOS, NativeModules } from "react-native";
import * as RNFS from "react-native-fs";

function randomRowGeneration() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 50; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export function genSelfSignedCertWithoutRequest(algorithm, keyAssignment, certAssignment: boolean[], CN, email, org, city, obl, country) {
    return new Promise((resolve, reject) => {
        NativeModules.Wrap_CertRequest.genSelfSignedCertWithoutRequest(
            algorithm,
            randomRowGeneration(),
            keyAssignment,
            certAssignment,
            true, CN, email, org, city, obl, country,
            RNFS.DocumentDirectoryPath + "/Files/" + CN + ".cer",
            (err, verify) => {
                if (!!verify) {
                    resolve(verify);
                }
                if (err) {
                    reject(err);
                }
            });
    });
}
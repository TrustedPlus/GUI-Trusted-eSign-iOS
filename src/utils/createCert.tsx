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

export function genSelfSignedCertWithoutRequest(algorithm, certAssignment: boolean[], CN, email, org, city, obl, country, goBack) {
    NativeModules.Wrap_CertRequest.genSelfSignedCertWithoutRequest(
        algorithm,
        randomRowGeneration(),
        0,
        certAssignment, CN, email, org, city, obl, country,
        RNFS.DocumentDirectoryPath + "/Files/" + CN + ".cer",
        (err, verify) => {
            console.log("err: " + err);
            console.log("verify: " + verify);
            if (verify) {
                RNFS.unlink(RNFS.DocumentDirectoryPath + "/Files/" + CN + ".cer");
                AlertIOS.alert(
                    "Сертификат и ключ создан",
                    null,
                    [
                       { text: "Импортировать сертификат", onPress: () => this.props.goBack() }
                    ]
                 );
            } else {
                Alert.alert(err);
            }
        });
}
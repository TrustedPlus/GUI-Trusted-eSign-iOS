import * as React from "react";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { NativeModules } from "react-native";
// let Openssl = NativeModules.TestClass;
let Cipher = NativeModules.CipherClass;
let Signer = NativeModules.SignerClass;

import * as RNFS from "react-native-fs";

interface IFile {
    mtime: string;
    extension: string;
    name: string;
}

interface FooterSignProps {
    encrypt?: boolean;
    sign?: boolean;
    footer: any;
    files: IFile[];
    certificate: any;
    encryptFiles(any): void;
}

class FooterSign extends React.Component<FooterSignProps> {

    signFile(files, certificate, footer) {
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            RNFS.writeFile(path + ".sig", "", "utf8");
            console.log(certificate.title);
            Signer.signFile(RNFS.DocumentDirectoryPath + "/CertKeys/" + certificate.title + ".crt",
                        RNFS.DocumentDirectoryPath + "/CertKeys/" + certificate.title + ".key",
                        path + "." + files[footer.arrButton[i]].extension,
                        path + ".sig",
                        (err, signFile) => { console.log(err); console.log(signFile); });
        }
    }

    verifySign(files, certificate, footer) {
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            Signer.verifySign(RNFS.DocumentDirectoryPath + "/CertKeys/" + certificate.title + ".crt",
                        path + "." + files[footer.arrButton[i]].extension,
                        (err, signFile) => { console.log(err); console.log(signFile); });
        }
    }

    EncAssymmetric(files, certificate, footer) {
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            RNFS.writeFile(path + ".enc", "", "utf8");
            Cipher.EncAssymmetric(path + "." + files[footer.arrButton[i]].extension,
                              path + ".enc",
                              RNFS.DocumentDirectoryPath + "/CertKeys/" + certificate.title + ".crt",
                              (err, encrypt) => { console.log(err); console.log(encrypt); });
        }
    }

    DecAssymmetric(files, certificate, footer) {
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            RNFS.writeFile(path + ".txt", "", "utf8");
            Cipher.DecAssymmetric(path + "." + files[footer.arrButton[i]].extension,
                              path + ".txt",
                              RNFS.DocumentDirectoryPath + "/CertKeys/" + certificate.title + ".crt",
                              RNFS.DocumentDirectoryPath + "/CertKeys/" + certificate.title + ".key",
                              (err, decrypt) => { console.log(err); console.log(decrypt); });
        }
    }
    render() {
        const {files, certificate} = this.props;
        let footer = null;
        if (this.props.encrypt) { // если футер для мастера шифрования
            footer = <FooterTab style={styles.container}>
                    <Button vertical onPress={() => this.EncAssymmetric(files, certificate, this.props.footer)}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 130}}>Зашифровать</Text>
                    </Button>
                    <Button vertical onPress={() => this.DecAssymmetric(files, certificate, this.props.footer)}>
                        <Icon style={{color: "black"}} name="camera" />
                        <Text style={{color: "black", width: 140}}>{/*Архивировать*/}Расшифровать</Text>
                    </Button></FooterTab>;
        }
        if (this.props.sign) { // если футер для мастера подписи
            footer = <FooterTab style={styles.container}>
                    <Button vertical onPress={() => this.verifySign(files, certificate, this.props.footer)}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 110}}>Проверить</Text>
                    </Button>
                    <Button vertical onPress={() => this.signFile(files, certificate, this.props.footer)}>
                        <Icon style={{color: "black"}} name="camera"/>
                        <Text style={{color: "black", width: 110}}>Подписать</Text>
                    </Button></FooterTab>;
        }
        return(
            <Footer>
                {footer}
                <FooterTab style={styles.container}>
                <Button vertical>
                    <Icon style={{color: "black"}} name="navigate" />
                    <Text style={{color: "black",  width: 110}}>Отправить</Text>
                </Button>
                <Button vertical>
                    <Icon style={{color: "black"}} name="person" />
                    <Text style={{color: "black"}}>Удалить</Text>
                </Button></FooterTab>
            </Footer>
        );
    }
}

function mapStateToProps (state) {
    return {
      files: state.files.files,
      footer: state.footer,
      certificate: state.certificate
    };
}

export default connect(mapStateToProps)(FooterSign);
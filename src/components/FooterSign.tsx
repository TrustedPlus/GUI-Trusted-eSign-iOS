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

interface FooterSignProps {
    encrypt?: boolean;
    sign?: boolean;
    footer: any;
    files: any;
    encryptFiles(any): void;
}

class FooterSign extends React.Component<FooterSignProps> {

    signFile(files, footer) {
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files.title[footer.arrButton[i]];
            RNFS.writeFile(path + ".sig", "", "utf8");
            Signer.signFile("/Users/dev/Desktop/cert\ and\ key/cert1.crt",
                        "/Users/dev/Desktop/cert\ and\ key/cert1.key",
                        path + "." + files.extension[footer.arrButton[i]],
                        path + ".sig",
                        (err, signFile) => { console.log(err); console.log(signFile); });
        }
    }

    verifySign(files, footer) {
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files.title[footer.arrButton[i]];
            Signer.verifySign("/Users/dev/Desktop/cert\ and\ key/cert1.crt",
                        path + "." + files.extension[footer.arrButton[i]],
                        (err, signFile) => { console.log(err); console.log(signFile); });
        }
    }

    EncAssymmetric(files, footer) {
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files.title[footer.arrButton[i]];
            RNFS.writeFile(path + ".enc", "", "utf8");
            Cipher.EncAssymmetric(path + "." + files.extension[footer.arrButton[i]],
                              path + ".enc",
                              "/Users/dev/Desktop/cert\ and\ key/cert1.crt",
                              (err, encrypt) => { console.log(err); console.log(encrypt); });
        }
    }

    DecAssymmetric(files, footer) {
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files.title[footer.arrButton[i]];
            RNFS.writeFile(path + ".txt", "", "utf8");
            Cipher.DecAssymmetric(path + "." + files.extension[footer.arrButton[i]],
                              path + ".txt",
                              "/Users/dev/Desktop/cert\ and\ key/cert1.crt",
                              "/Users/dev/Desktop/cert\ and\ key/cert1.key",
                              (err, decrypt) => { console.log(err); console.log(decrypt); });
        }
    }

    render() {
        const {files} = this.props;
        let footer = null;
        if (this.props.encrypt) { // если футер для мастера шифрования
            footer = <FooterTab style={styles.container}>
                    <Button vertical onPress={() => this.EncAssymmetric(files, this.props.footer)}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 130}}>Зашифровать</Text>
                    </Button>
                    <Button vertical onPress={() => this.DecAssymmetric(files, this.props.footer)}>
                        <Icon style={{color: "black"}} name="camera" />
                        <Text style={{color: "black", width: 140}}>{/*Архивировать*/}Расшифровать</Text>
                    </Button></FooterTab>;
        }
        if (this.props.sign) { // если футер для мастера подписи
            footer = <FooterTab style={styles.container}>
                    <Button vertical onPress={() => this.verifySign(files, this.props.footer)}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 110}}>Проверить</Text>
                    </Button>
                    <Button vertical onPress={() => this.signFile(files, this.props.footer)}>
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
      files: state.files,
      footer: state.footer
    };
}

export default connect(mapStateToProps)(FooterSign);
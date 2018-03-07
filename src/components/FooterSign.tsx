import * as React from "react";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { NativeModules } from "react-native";
import {signFile, verifySign} from "../actions/SignVerifyAction";
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
    personalCert: any;
    otherCert: any;
    signFile(files: IFile[], otherCert: string[], footer: string[]): void;
    verifySign?(...any): void;
}

class FooterSign extends React.Component<FooterSignProps> {

    EncAssymmetric(files, otherCert, footer) {
        if (otherCert.title === "") return;
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            RNFS.writeFile(path + ".enc", "", "utf8");
            NativeModules.WCipher.EncAssymmetric(path + "." + files[footer.arrButton[i]].extension,
                              path + ".enc",
                              RNFS.DocumentDirectoryPath + "/OtherCertKeys/" + otherCert.title + ".crt", "BASE64",
                              (err, encrypt) => { console.log(err); console.log(encrypt); });
        }
    }

    DecAssymmetric(files, otherCert, footer) {
        if (otherCert.title === "") return;
        for (let i = 0; i < footer.arrButton.length; i++) {
            let path = RNFS.DocumentDirectoryPath + "/Files/" + files[footer.arrButton[i]].name;
            RNFS.writeFile(path + ".txt", "", "utf8");
            NativeModules.WCipher.DecAssymmetric(path + "." + files[footer.arrButton[i]].extension,
                              path + ".txt",
                              RNFS.DocumentDirectoryPath + "/OtherCertKeys/" + otherCert.title + ".crt", "BASE64",
                              RNFS.DocumentDirectoryPath + "/OtherCertKeys/" + otherCert.title + ".key", "BASE64",
                              (err, decrypt) => { console.log(err); console.log(decrypt); });
        }
    }
    render() {
        const {files, personalCert, otherCert, verifySign, signFile} = this.props;
        let footer = null;
        if (this.props.encrypt) { // если футер для мастера шифрования
            footer = <FooterTab style={styles.container}>
                    <Button vertical  onPress={() => this.EncAssymmetric(files, otherCert, this.props.footer)}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 130}}>Зашифровать</Text>
                    </Button>
                    <Button vertical onPress={() => this.DecAssymmetric(files, otherCert, this.props.footer)}>
                        <Icon style={{color: "black"}} name="camera" />
                        <Text style={{color: "black", width: 140}}>{/*Архивировать*/}Расшифровать</Text>
                    </Button></FooterTab>;
        }
        if (this.props.sign) { // если футер для мастера подписи
            footer = <FooterTab style={styles.container}>
                    <Button vertical onPress={() => verifySign(files, personalCert, this.props.footer)}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 110}}>Проверить</Text>
                    </Button>
                    <Button vertical onPress={() => signFile(files, personalCert, this.props.footer)}>
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
      personalCert: state.personalCert,
      otherCert: state.otherCert
    };
}

function mapDispatchToProps (dispatch) {
    return {
        signFile: bindActionCreators(signFile, dispatch),
        verifySign: bindActionCreators(verifySign, dispatch)
    };
  }

export default connect(mapStateToProps, mapDispatchToProps)(FooterSign);
import * as React from "react";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {encryptFiles} from "../actions/index";
import { NativeModules } from "react-native";
// let Openssl = NativeModules.TestClass;
let Cipher = NativeModules.CipherClass;
let Signer = NativeModules.SignerClass;

interface FooterSignProps {
    encrypt?: boolean;
    sign?: boolean;
    footer: any;
    encryptFiles(any): void;
}

function signFile() {
    Signer.signFile("/Users/dev/Desktop/cert\ and\ key/cert1.crt",
                    "/Users/dev/Desktop/cert\ and\ key/cert1.key",
                    "/Users/dev/Desktop/Files/Письмо\ от\ 23_08_2018.txt",
                    "/Users/dev/Desktop/Files/Письмо\ от\ 23_08_2018.sgn",
                    (err, signFile) => { console.log(err); console.log(signFile); });
}

function verifySign() {
    Signer.verifySign("/Users/dev/Desktop/cert\ and\ key/cert1.crt",
                      "/Users/dev/Desktop/Files/Письмо\ от\ 23_08_2018.sgn",
                      (err, verify) => { console.log(err); console.log(verify); });
}

function EncAssymmetric() {
    Cipher.EncAssymmetric("/Users/dev/Desktop/Files/Письмо\ от\ 23_08_2018.txt",
                          "/Users/dev/Desktop/Files/Письмо\ от\ 23_08_2018.enc",
                          "/Users/dev/Desktop/cert\ and\ key/cert1.crt",
                          (err, encrypt) => { console.log(err); console.log(encrypt); });

}

function DecAssymmetric() {
    Cipher.DecAssymmetric("/Users/dev/Desktop/Files/Письмо\ от\ 23_08_2018.enc",
                          "/Users/dev/Desktop/Files/Письмо\ от\ 23_08_2018.txt",
                          "/Users/dev/Desktop/cert\ and\ key/cert1.crt",
                          "/Users/dev/Desktop/cert\ and\ key/cert1.key",
                          (err, decrypt) => { console.log(err); console.log(decrypt); });
}

class FooterSign extends React.Component<FooterSignProps> {

    render() {
        let footer = null;
        if (this.props.encrypt) { // если футер для мастера шифрования
            footer = <FooterTab style={styles.container}>
                    <Button vertical onPress={() => EncAssymmetric()}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 130}}>Зашифровать</Text>
                    </Button>
                    <Button vertical onPress={() => DecAssymmetric()}>
                        <Icon style={{color: "black"}} name="camera" />
                        <Text style={{color: "black", width: 140}}>{/*Архивировать*/}Расшифровать</Text>
                    </Button></FooterTab>;
        }
        if (this.props.sign) { // если футер для мастера подписи
            footer = <FooterTab style={styles.container}>
                    <Button vertical onPress={() => {verifySign(); }}>
                        <Icon style={{color: "black"}} name="apps" />
                        <Text style={{color: "black", width: 110}}>Проверить</Text>
                    </Button>
                    <Button vertical onPress={() => {signFile(); }}>
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

function mapDispatchToProps (dispatch) {
    return {
        encryptFiles: bindActionCreators(encryptFiles, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterSign);
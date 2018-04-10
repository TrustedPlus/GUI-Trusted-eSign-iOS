import * as React from "react";
import {Footer, FooterTab, Button, Icon, Text} from "native-base";
import {styles} from "../styles";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { NativeModules } from "react-native";
import {signFile, verifySign} from "../actions/SignVerifyAction";
import {encAssymmetric, decAssymmetric} from "../actions/EncDecAction";
import {uploadFile, deleteFile} from "../actions/UploadFileAction";
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
    signFile?(files: IFile[], personalCert: string[], footer: string[]): void;
    verifySign?(files: IFile[], personalCert: string[], footer: string[]): void;
    encAssymmetric?(files: IFile[], otherCert: string[], footer: string[]): void;
    decAssymmetric?(files: IFile[], otherCert: string[], footer: string[]): void;
    uploadFile?(files: IFile[], footer: string[]): void;
    deleteFile?(files: IFile[], footer: string[]): void;
}

class FooterSign extends React.Component<FooterSignProps> {

    render() {
        const {files, personalCert, otherCert, verifySign, signFile, encAssymmetric, decAssymmetric, uploadFile, deleteFile} = this.props;
        let footer = null;
        if (this.props.encrypt) { // если футер для мастера шифрования
            footer = <FooterTab style={{backgroundColor: "#be3817"}}>
                    <Button vertical onPress={() => encAssymmetric(files, otherCert, this.props.footer)}>
                        <Icon style={{color: "white"}} name="apps" />
                        <Text style={{color: "white", width: 130}}>Зашифровать</Text>
                    </Button>
                    <Button vertical onPress={() => decAssymmetric(files, otherCert, this.props.footer)}>
                        <Icon style={{color: "white"}} name="camera" />
                        <Text style={{color: "white", width: 140}}>{/*Архивировать*/}Расшифровать</Text>
                    </Button></FooterTab>;
        }
        if (this.props.sign) { // если футер для мастера подписи
            footer = <FooterTab style={{backgroundColor: "#be3817"}}>
                    <Button vertical onPress={() => verifySign(files, personalCert, this.props.footer)}>
                        <Icon style={{color: "white"}} name="apps" />
                        <Text style={{color: "white", width: 110}}>Проверить</Text>
                    </Button>
                    <Button vertical onPress={() => signFile(files, personalCert, this.props.footer)}>
                        <Icon style={{color: "white"}} name="camera"/>
                        <Text style={{color: "white", width: 110}}>Подписать</Text>
                    </Button></FooterTab>;
        }
        return(
            <Footer>
                {footer}
                <FooterTab style={{backgroundColor: "#be3817"}}>
                <Button vertical onPress={() => uploadFile(files, this.props.footer)}>
                    <Icon style={{color: "white"}} name="navigate" />
                    <Text style={{color: "white",  width: 110}}>Отправить</Text>
                </Button>
                <Button vertical onPress={() => deleteFile(files, this.props.footer)}>
                    <Icon style={{color: "white"}} name="person" />
                    <Text style={{color: "white"}}>Удалить</Text>
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
        verifySign: bindActionCreators(verifySign, dispatch),
        encAssymmetric: bindActionCreators(encAssymmetric, dispatch),
        decAssymmetric: bindActionCreators(decAssymmetric, dispatch),
        uploadFile: bindActionCreators(uploadFile, dispatch),
        deleteFile: bindActionCreators(deleteFile, dispatch)
    };
  }

export default connect(mapStateToProps, mapDispatchToProps)(FooterSign);
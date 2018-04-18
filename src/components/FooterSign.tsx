import * as React from "react";
import { Footer, FooterTab, Button, Icon, Text } from "native-base";
import { styles } from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { View, ScrollView } from "react-native";
import { signFile, verifySign } from "../actions/SignVerifyAction";
import { encAssymmetric, decAssymmetric } from "../actions/EncDecAction";
import { uploadFile, deleteFile } from "../actions/UploadFileAction";
import * as RNFS from "react-native-fs";
import { FooterButton } from "./FooterButton";

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

    unsignFile() {
        console.log("Снятие подписи");
    }

    render() {
        const { files, personalCert, otherCert, verifySign, signFile, encAssymmetric, decAssymmetric, uploadFile, deleteFile, footer } = this.props;
        let footerleft = null;
        let isddisabled = null;
        if (this.props.encrypt) { // если футер для мастера шифрования
            if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "enc").length) {
                isddisabled = "enc";
            }
            if (!otherCert.title) {
                isddisabled = "noCert";
            }
            footerleft = <FooterTab style={styles.footer}>
                <FooterButton title="Зашифровать"
                    disabled={isddisabled === "noCert" ? true : false}
                    icon="apps"
                    nav={() => encAssymmetric(files, otherCert, footer)} />
                <FooterButton title="Расшифровать"
                    disabled={isddisabled === "enc" ? false : true}
                    icon="camera"
                    nav={() => decAssymmetric(files, otherCert, footer)} />
            </FooterTab>;
        }
        if (this.props.sign) { // если футер для мастера подписи
            if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "sig").length) {
                isddisabled = "sig";
            }
            if (!personalCert.title) {
                isddisabled = "noCert";
            }
            footerleft = <FooterTab style={styles.footer}>
                <FooterButton title="Проверить"
                    disabled={isddisabled === "sig" ? false : true}
                    icon="apps"
                    nav={() => verifySign(files, personalCert, footer)} />
                <FooterButton title="Подписать"
                    disabled={isddisabled === "noCert" ? true : false}
                    icon="camera"
                    nav={() => signFile(files, personalCert, footer)} />
                { /*isddisabled === "sig" ? <FooterButton title="Снять"
                              disabled={isddisabled === "noCert" ? true : false }
                              icon="camera"
        nav={() => this.unsignFile() }/> : null*/}
            </FooterTab>;
        }
        // const buttons: SomeButton[] = [{ title: "Foo" }, { title: "Bar", disabled: true }];
        return (
            <Footer>
                {footerleft}
                {/*<SomeFooterTab button={buttons} />*/}
                <FooterTab style={styles.footer}>
                    <FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="navigate" nav={() => uploadFile(files, footer)} />
                    <FooterButton title="Удалить" icon="person" nav={() => deleteFile(files, footer)} />
                </FooterTab>;
            </Footer>
        );
    }
}
/*
interface SomeButton {
    title?: string;
    disabled?: boolean;
    onClick?: Function;
}
interface SomeFooterTabProps {
    button?: SomeButton[];
}

class SomeFooterTab extends React.PureComponent<SomeFooterTabProps> {
    render() {
        return (
            <Footer>
                {
                    this.props.button.map((btn) => {
                        return (
                            <FooterButton
                                title={btn.title}
                                disabled={btn.disabled}
                                nav={() => btn.onClick} />
                        );
                    })
                }
            </Footer>
        );
    }
}

class SuperClass extends React.PureComponent {
    render() {
        return (
            <FooterSign encrypt={}>
            </FooterSign>
        );
    }
} */

function mapStateToProps(state) {
    return {
        files: state.files.files,
        footer: state.footer,
        personalCert: state.personalCert,
        otherCert: state.otherCert
    };
}

function mapDispatchToProps(dispatch) {
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
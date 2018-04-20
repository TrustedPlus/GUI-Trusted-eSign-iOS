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
        let certIsNotNull, isSign, isDec, isEnc, allIsSign = null;
        if (this.props.encrypt) { // если футер для мастера шифрования
            if (footer.arrExtension.filter(extension => extension === "enc").length !== 0) {
                isEnc = "enc";
            }
            if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "enc").length) {
                isDec = "dec";
            }
            if (!otherCert.title) {
                certIsNotNull = "noCert";
            }
            footerleft = <FooterTab style={styles.footer}>
                <FooterButton title="Зашифровать"
                    disabled={certIsNotNull === "noCert" ? true : (isEnc === "enc" ? true : false) }
                    icon="md-lock"
                    nav={() => encAssymmetric(files, otherCert, footer)} />
                <FooterButton title="Расшифровать"
                    disabled={ certIsNotNull === "noCert" ? true : (isDec === "dec" ? false : true)}
                    icon="md-unlock"
                    nav={() => decAssymmetric(files, otherCert, footer)} />
            </FooterTab>;
        }
        if (this.props.sign) { // если футер для мастера подписи
            if (!personalCert.title) {
                certIsNotNull = "noCert";
            }
            if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "sig").length) {
                allIsSign = "sig";
            }
            if (footer.arrExtension.filter(extension => extension === "sig").length !== 0) {
                isSign = "sig";
            }
            footerleft = <FooterTab style={styles.footer}>
                <FooterButton title="Проверить"
                    disabled={allIsSign === "sig" ? false : true}
                    icon="md-done-all"
                    nav={() => verifySign(files, personalCert, footer)} />
                <FooterButton title="Подписать"
                    disabled={certIsNotNull === "noCert" ? true : (isSign === "sig" ? true : false)}
                    icon="md-create"
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
                    <FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
                    <FooterButton title="Удалить" icon="md-trash" nav={() => deleteFile(files, footer)} />
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
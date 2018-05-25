import * as React from "react";
import { Footer, FooterTab, } from "native-base";
import { styles } from "../styles";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { encAssymmetric, decAssymmetric } from "../actions/EncDecAction";
import { uploadFile, deleteFile } from "../actions/UploadFileAction";
import { FooterButton } from "../components//FooterButton";

function mapStateToProps(state) {
    return {
        files: state.files.files,
        footer: state.footer,
        otherCert: state.otherCert
    };
}

function mapDispatchToProps(dispatch) {
    return {
        encAssymmetric: bindActionCreators(encAssymmetric, dispatch),
        decAssymmetric: bindActionCreators(decAssymmetric, dispatch),
        uploadFile: bindActionCreators(uploadFile, dispatch),
        deleteFile: bindActionCreators(deleteFile, dispatch)
    };
}

interface IFile {
    mtime: string;
    extension: string;
    name: string;
}

interface FooterEncProps {
    footer?: any;
    files?: IFile[];
    otherCert?: any;
    encAssymmetric?(files: IFile[], otherCert: string[], footer: string[]): void;
    decAssymmetric?(files: IFile[], otherCert: string[], footer: string[]): void;
    uploadFile?(files: IFile[], footer: string[]): void;
    deleteFile?(files: IFile[], footer: string[]): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class FooterEnc extends React.Component<FooterEncProps> {

    render() {
        const { files, otherCert, encAssymmetric, decAssymmetric, uploadFile, deleteFile, footer } = this.props;
        let footerleft = null;
        let certIsNotNull, CertDontHasPrivateKey, isDec, isEnc = null;

        if (footer.arrExtension.filter(extension => extension === "enc").length !== 0) {
            isEnc = "enc";
        }
        if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "enc").length) {
            isDec = "dec";
        }
        if (!otherCert.hasPrivateKey) {
            CertDontHasPrivateKey = "noKey";
        }
        if (!otherCert.title) {
            certIsNotNull = "noCert";
        }
        return (
            <Footer>
                <FooterTab>
                    <FooterButton title="Зашифровать"
                        disabled={certIsNotNull ? true : (isEnc === "enc" ? true : false)}
                        icon="md-lock"
                        nav={() => encAssymmetric(files, otherCert, footer)} />
                    <FooterButton title="Расшифровать"
                        disabled={certIsNotNull ? true : (CertDontHasPrivateKey ? true : isDec === "dec" ? false : true)}
                        icon="md-unlock"
                        nav={() => decAssymmetric(files, otherCert, footer)} />
                    <FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
                    <FooterButton title="Удалить" icon="md-trash" nav={() => deleteFile(files, footer)} />
                </FooterTab>
            </Footer>
        );
    }
}
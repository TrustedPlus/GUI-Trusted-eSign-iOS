import * as React from "react";
import { Footer, FooterTab, } from "native-base";
import { FooterButton } from "../components//FooterButton";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { encAssymmetric, decAssymmetric } from "../actions/encDecAction";
import { uploadFile, deleteFile } from "../actions/uploadFileAction";

function mapStateToProps(state) {
	return {
		files: state.files.files,
		footer: state.footer,
		otherCert: state.otherCert,
		certificates: state.certificates.certificates
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
	certificates?: any;
	encAssymmetric?(files: IFile[], otherCert: string[], certificates: any, footer: string[]): void;
	decAssymmetric?(files: IFile[], otherCert: string[], footer: string[]): void;
	uploadFile?(files: IFile[], footer: string[]): void;
	deleteFile?(files: IFile[], footer: string[]): void;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class FooterEnc extends React.Component<FooterEncProps> {

	render() {
		const { files, otherCert, encAssymmetric, decAssymmetric, uploadFile, deleteFile, footer, certificates } = this.props;
		let footerleft = null;
		let certIsNotNull, isDec, isEnc = null;

		if (footer.arrExtension.filter(extension => extension === "enc").length !== 0) {
			isEnc = "enc";
		}
		if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "enc").length) {
			isDec = "dec";
		}
		if (!otherCert.arrEncCertificates.length) {
			certIsNotNull = "noCert";
		}
		return (
			<Footer>
				<FooterTab>
					<FooterButton title="Зашифровать"
						disabled={certIsNotNull ? true : (isEnc === "enc" ? true : false)}
						icon="md-lock"
						nav={() => encAssymmetric(files, otherCert, certificates, footer)} />
					<FooterButton title="Расшифровать"
						disabled={isDec === "dec" ? false : true}
						icon="md-unlock"
						nav={() => decAssymmetric(files, otherCert, footer)} />
					<FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
					<FooterButton title="Удалить" icon="md-trash" nav={() => deleteFile(files, footer)} />
				</FooterTab>
			</Footer>
		);
	}
}
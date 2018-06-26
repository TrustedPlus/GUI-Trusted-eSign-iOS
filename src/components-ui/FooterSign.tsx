import * as React from "react";
import { NativeModules, Alert, AlertIOS } from "react-native";
import * as RNFS from "react-native-fs";
import { Footer, FooterTab } from "native-base";
import { FooterButton } from "../components/FooterButton";
import { showToast } from "../utils/toast";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { signFile, verifySign, UnSignFile } from "../actions/signVerifyAction";
import { uploadFile, deleteFile } from "../actions/uploadFileAction";
import { readFiles } from "../actions/index";

function mapStateToProps(state) {
	return {
		files: state.files.files,
		footer: state.footer,
		personalCert: state.personalCert
	};
}

function mapDispatchToProps(dispatch) {
	return {
		signFile: bindActionCreators(signFile, dispatch),
		verifySign: bindActionCreators(verifySign, dispatch),
		UnSignFile: bindActionCreators(UnSignFile, dispatch),
		uploadFile: bindActionCreators(uploadFile, dispatch),
		deleteFile: bindActionCreators(deleteFile, dispatch),
		readFiles: bindActionCreators(readFiles, dispatch)
	};
}

interface IFile {
	mtime: string;
	extension: string;
	extensionAll?: string;
	name: string;
}

interface FooterSignProps {
	footer?: any;
	files?: IFile[];
	personalCert?: any;
	signFile?(files: IFile[], personalCert: string[], footer: string[], detached: boolean): void;
	verifySign?(files: IFile[], footer: string[]): void;
	UnSignFile?(files: IFile[], footer: string[]): void;
	uploadFile?(files: IFile[], footer: string[]): void;
	deleteFile?(files: IFile[], footer: string[]): void;
	readFiles?(): any;
}

@(connect(mapStateToProps, mapDispatchToProps) as any)
export class FooterSign extends React.Component<FooterSignProps, { showToast: boolean }> {

	constructor(props) {
		super(props);
		this.state = {
			showToast: false
		};
	}

	render() {
		const { files, personalCert, verifySign, signFile, UnSignFile, uploadFile, deleteFile, footer } = this.props;
		let certIsNotNull, isSign, allIsSign = null;
		if (!personalCert.title) {
			certIsNotNull = "noCert";
		}
		if (footer.arrExtension.length === footer.arrExtension.filter(extension => extension === "sig").length) {
			allIsSign = "sig";
		}
		if (footer.arrExtension.filter(extension => extension === "sig").length !== 0) {
			isSign = "sig";
		}
		let sig = false;
		return (
			<Footer>
				<FooterTab>
					<FooterButton title="Проверить"
						disabled={allIsSign === "sig" ? false : true}
						icon="md-done-all"
						nav={() => verifySign(files, footer)} />
					<FooterButton title="Подписать"
						disabled={certIsNotNull === "noCert" ? true : false}
						icon="md-create"
						nav={() => {
							footer.arrButton.forEach(function (i, num) {
							if (files[i].extension === "sig") { sig = true; }
						}); sig ?
							AlertIOS.alert(
								null,
								null,
								[
									{ text: "совмещенной подписью", onPress: () => signFile(files, personalCert, footer, false) },
									{
										text: "отделенной подписью", onPress: () => signFile(files, personalCert, footer, true), style: "destructive"
									},
									{ text: "Отмена", onPress: () => null, style: "destructive" }
								]
							) : AlertIOS.alert(
								null,
								null,
								[
									{ text: "совмещенной подписью", onPress: () => signFile(files, personalCert, footer, false) },
									{
										text: "отделенной подписью", onPress: () => signFile(files, personalCert, footer, true)
									},
									{ text: "Отмена", onPress: () => null, style: "destructive" }
								]
							); }} />
					<FooterButton title="Снять" disabled={allIsSign === "sig" ? false : true} icon="md-crop" nav={() => UnSignFile(files, footer)} />
					<FooterButton title="Отправить" disabled={footer.arrExtension.length === 1 ? false : true} icon="ios-share-alt-outline" nav={() => uploadFile(files, footer)} />
					<FooterButton title="Удалить" icon="md-trash" nav={() => deleteFile(files, footer)} />
				</FooterTab>
			</Footer>
		);
	}
}